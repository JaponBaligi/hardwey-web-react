# Deploy React App to Namecheap cPanel

## Prerequisites
- Built React app (run `npm run build` locally)
- FTP/File Manager access to cPanel
- Domain configured in cPanel

## Steps

### 1. Build the React App
On your local machine:
```bash
cd D:\hardwey-react
npm run build
```
This creates the `dist/` folder with production-ready files.

### 2. Prepare .htaccess for React Router
Create a `.htaccess` file in the `dist/` folder with the following content:

```apache
# Enable rewrite engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle React Router - redirect all requests to index.html
  # except for actual files and directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 3. Upload Files to cPanel
Using cPanel File Manager or FTP:

1. **Navigate to your domain's root directory:**
   - Usually `public_html/` for the main domain
   - Or `public_html/subdomain/` for a subdomain

2. **Upload all contents from `dist/` folder:**
   - Select all files and folders inside `dist/`
   - Upload them to the domain's root directory
   - Ensure `index.html` is at the root level

3. **Verify file structure:**
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── *.js
   │   ├── *.css
   │   └── ...
   └── .htaccess
   ```

### 4. Set File Permissions
In cPanel File Manager:
- `index.html`: 644
- `.htaccess`: 644
- `assets/` directory: 755
- All files in `assets/`: 644

### 5. Verify API Configuration
Ensure your backend API is accessible at `/api` endpoints. Since your React app uses relative URLs (`/api/content`, `/api/auth/login`), the API must be:
- On the same domain (e.g., `https://hardweyllc.com/api/...`)
- Or configured via reverse proxy/rewrite rules

**If your API is on a different domain or subdomain:**
- Update `vite.config.ts` to set `base` path
- Or configure cPanel to proxy `/api` requests to your Node.js backend

### 6. Test the Deployment
1. Visit your domain: `https://hardweyllc.com`
2. Check browser console for errors
3. Test navigation (React Router routes)
4. Verify API calls work (check Network tab)
5. Test admin login at `/dfaqs` if applicable

### 7. SSL/HTTPS
- Ensure SSL certificate is installed in cPanel
- Force HTTPS redirect if needed (add to `.htaccess`):
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Troubleshooting

### React Router 404 Errors
- Ensure `.htaccess` is uploaded and RewriteEngine is enabled
- Check that Apache `mod_rewrite` is enabled (contact hosting support if needed)

### API Calls Fail
- Verify CORS settings on backend match your domain
- Check that `ALLOWED_ORIGIN` in backend includes your frontend domain
- Ensure cookies work (check `credentials: 'include'` in fetch calls)

### Assets Not Loading
- Verify file paths in `index.html` are correct (should be `/assets/...`)
- Check file permissions (644 for files, 755 for directories)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Build Size Issues
- Current build uses code splitting (`manualChunks` in vite.config.ts)
- If chunks are too large, consider lazy loading routes

## Updating the App
1. Make changes locally
2. Run `npm run build` again
3. Upload new `dist/` contents (overwrite existing files)
4. Clear browser cache or use cache-busting query params

