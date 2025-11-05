# Pre-Deployment Testing Guide

This guide provides commands to test your `.htaccess` configuration before deploying to production.

## Prerequisites

- **curl** installed (comes with most Unix-like systems, Windows 10+ has it)
- **Access to your server** (via SSH or local testing environment)
- **Domain/IP address** where your site will be deployed

## Testing Commands

### 1. Test HTTPS Redirect

**Goal**: Verify HTTP requests are redirected to HTTPS.

```bash
# Test HTTP to HTTPS redirect (should return 301 redirect)
curl -I http://yourdomain.com

# Expected output:
# HTTP/1.1 301 Moved Permanently
# Location: https://yourdomain.com/...

# Test with verbose output to see redirect chain
curl -v http://yourdomain.com 2>&1 | grep -i "location\|301\|302"

# Test proxy header handling (if behind proxy)
curl -I -H "X-Forwarded-Proto: http" https://yourdomain.com
```

**Success Criteria**:
- HTTP requests return `301 Moved Permanently`
- `Location` header points to HTTPS URL
- No redirect loops

---

### 2. Verify API Routes Bypass SPA Rewrite

**Goal**: Ensure `/api/*` requests reach the backend server, not React Router.

```bash
# Test API health endpoint (should return JSON, not HTML)
curl -I https://yourdomain.com/api/health

# Expected output:
# HTTP/1.1 200 OK
# Content-Type: application/json
# ...

# Test API content endpoint
curl https://yourdomain.com/api/content

# Expected: JSON response, NOT HTML
# {"content": {...}}

# Verify it's NOT serving index.html
curl https://yourdomain.com/api/health | head -20

# Should NOT contain: "<!doctype html>" or "<div id="root"></div>"
```

**Success Criteria**:
- API routes return JSON responses
- Content-Type is `application/json`
- No HTML content from React app

---

### 3. Verify Admin Routes Bypass SPA Rewrite

**Goal**: Ensure `/dfaqs/*` routes bypass React Router.

```bash
# Test admin route (should return 200, not redirect to index.html)
curl -I https://yourdomain.com/dfaqs

# Expected output:
# HTTP/1.1 200 OK
# Content-Type: text/html
# ...

# Test with trailing slash
curl -I https://yourdomain.com/dfaqs/

# Verify it serves the admin app, not main SPA
curl https://yourdomain.com/dfaqs | grep -i "admin\|dfaqs\|login"

# Should contain admin-specific content
```

**Success Criteria**:
- `/dfaqs` returns 200 OK
- Serves admin application, not main React app
- Trailing slash handled correctly

---

### 4. Test Immutable Cache Headers on Hashed Assets

**Goal**: Verify fingerprinted assets get `immutable` cache headers.

```bash
# Test a hashed JavaScript file (replace with actual filename from your build)
curl -I https://yourdomain.com/assets/index-D7ZTbwwW.js

# Expected output:
# HTTP/1.1 200 OK
# Cache-Control: public, max-age=31536000, immutable
# Expires: ... (1 year from now)
# ...

# Test a hashed CSS file
curl -I https://yourdomain.com/assets/index-CdkOIcSR.css

# Test a hashed image (if you have any)
curl -I https://yourdomain.com/assets/logo-abc12345.png

# Compare with non-hashed files (should NOT have immutable)
curl -I https://yourdomain.com/index.html | grep -i cache-control
# Should show: no-cache, no-store, must-revalidate
```

**Success Criteria**:
- Hashed assets have `Cache-Control: public, max-age=31536000, immutable`
- HTML files have `Cache-Control: no-cache, no-store, must-revalidate`
- Expires header matches cache duration

**Find your actual asset filenames**:
```bash
# List built assets (if you have SSH access)
ls -la /path/to/public_html/assets/*.js
ls -la /path/to/public_html/assets/*.css

# Or check your dist folder locally
ls dist/assets/*.js
ls dist/assets/*.css
```

---

### 5. Monitor CSP for Violations

**Goal**: Check Content-Security-Policy headers and detect violations.

```bash
# Check CSP header is set
curl -I https://yourdomain.com | grep -i "content-security-policy"

# Expected output:
# Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; ...

# Full CSP header extraction
curl -sI https://yourdomain.com | grep -i "content-security-policy" | cut -d' ' -f2-

# Test loading page and check for CSP errors
curl -v https://yourdomain.com 2>&1 | grep -i "csp\|violation"
```

**Browser Testing** (More reliable for CSP):
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to your site
4. Look for CSP violation messages like:
   ```
   Content Security Policy: The page's settings blocked the loading of a resource at ...
   ```

**Manual CSP Test**:
```bash
# Test external script loading (should work - cdn.jsdelivr.net allowed)
curl -I https://yourdomain.com | grep -i csp

# Verify CSP allows:
# - 'self' scripts ✓
# - cdn.jsdelivr.net scripts ✓
# - 'unsafe-inline' styles ✓
```

**Success Criteria**:
- CSP header is present
- No CSP violations in browser console
- External scripts (cdn.jsdelivr.net) load correctly

---

### 6. Test Compression (Gzip/Brotli)

**Goal**: Verify compression is working.

```bash
# Test gzip compression
curl -I -H "Accept-Encoding: gzip" https://yourdomain.com | grep -i "content-encoding"

# Expected output:
# Content-Encoding: gzip

# Test Brotli compression (if available)
curl -I -H "Accept-Encoding: br" https://yourdomain.com | grep -i "content-encoding"

# Expected output (if mod_brotli available):
# Content-Encoding: br

# Test Vary header (important for caching)
curl -I https://yourdomain.com | grep -i vary

# Expected output:
# Vary: Accept-Encoding

# Test actual compression
curl -H "Accept-Encoding: gzip" https://yourdomain.com/assets/index-D7ZTbwwW.js --compressed -o test.js.gz
ls -lh test.js.gz
# Compare size with uncompressed version
```

**Success Criteria**:
- `Content-Encoding: gzip` or `br` header present
- `Vary: Accept-Encoding` header present
- File sizes are smaller than uncompressed

---

### 7. Test Security Headers

**Goal**: Verify all security headers are present.

```bash
# Check all security headers at once
curl -I https://yourdomain.com | grep -iE "x-content-type|x-frame|x-xss|referrer|permissions|strict-transport"

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Referrer-Policy: no-referrer-when-downgrade
# Permissions-Policy: geolocation=(), microphone=(), camera=()
# Strict-Transport-Security: max-age=604800 (only on HTTPS)

# Detailed check script
curl -sI https://yourdomain.com > headers.txt
echo "=== Security Headers Check ==="
grep -i "x-content-type-options" headers.txt || echo "❌ Missing X-Content-Type-Options"
grep -i "x-frame-options" headers.txt || echo "❌ Missing X-Frame-Options"
grep -i "referrer-policy" headers.txt || echo "❌ Missing Referrer-Policy"
grep -i "permissions-policy" headers.txt || echo "❌ Missing Permissions-Policy"
grep -i "strict-transport-security" headers.txt || echo "⚠️  HSTS missing (check if HTTPS)"
grep -i "content-security-policy" headers.txt || echo "❌ Missing CSP"
```

**Success Criteria**:
- All security headers present
- HSTS only on HTTPS (not HTTP)
- Values match your configuration

---

### 8. Test React Router Fallback

**Goal**: Verify React Router handles client-side routes correctly.

```bash
# Test direct access to a React route (should serve index.html, not 404)
curl -I https://yourdomain.com/more-faq

# Expected output:
# HTTP/1.1 200 OK
# Content-Type: text/html
# ...

# Verify it serves index.html (contains React root)
curl https://yourdomain.com/more-faq | grep -i "root\|react"

# Should contain: <div id="root"></div>

# Test another route
curl -I https://yourdomain.com/privacy-policy

# Test non-existent route (should still serve index.html for SPA)
curl -I https://yourdomain.com/non-existent-route-12345
```

**Success Criteria**:
- React routes return 200 OK (not 404)
- Serves index.html with React app
- Browser can handle client-side routing

---

### 9. Test No-Cache Headers for API/Admin/Uploads

**Goal**: Verify dynamic routes don't get cached.

```bash
# Test API routes have no-cache headers
curl -I https://yourdomain.com/api/content | grep -iE "cache-control|pragma|expires"

# Expected output:
# Cache-Control: no-cache, no-store, must-revalidate
# Pragma: no-cache
# Expires: 0

# Test admin routes
curl -I https://yourdomain.com/dfaqs | grep -iE "cache-control|pragma|expires"

# Test uploads route (if exists)
curl -I https://yourdomain.com/uploads/test.jpg | grep -iE "cache-control|pragma|expires"
```

**Success Criteria**:
- API routes have `no-cache, no-store, must-revalidate`
- Admin routes have no-cache headers
- Uploads have no-cache headers

---

## Comprehensive Test Script

Save this as `test-htaccess.sh` and run it:

```bash
#!/bin/bash

DOMAIN="yourdomain.com"  # Change this to your domain

echo "=== Testing .htaccess Configuration ==="
echo "Domain: $DOMAIN"
echo ""

# 1. HTTPS Redirect
echo "1. Testing HTTPS Redirect..."
HTTP_STATUS=$(curl -sI http://$DOMAIN | head -1 | awk '{print $2}')
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
  echo "✓ HTTPS redirect working"
else
  echo "✗ HTTPS redirect not working (got $HTTP_STATUS)"
fi
echo ""

# 2. API Routes
echo "2. Testing API Routes..."
API_CONTENT_TYPE=$(curl -sI https://$DOMAIN/api/health | grep -i "content-type" | awk '{print $2}')
if [[ "$API_CONTENT_TYPE" == *"json"* ]]; then
  echo "✓ API routes bypassing SPA rewrite"
else
  echo "✗ API routes may be rewritten to SPA"
fi
echo ""

# 3. Admin Routes
echo "3. Testing Admin Routes..."
ADMIN_STATUS=$(curl -sI https://$DOMAIN/dfaqs | head -1 | awk '{print $2}')
if [ "$ADMIN_STATUS" = "200" ]; then
  echo "✓ Admin routes accessible"
else
  echo "✗ Admin routes returned $ADMIN_STATUS"
fi
echo ""

# 4. Cache Headers
echo "4. Testing Cache Headers..."
# Find a hashed asset (you may need to adjust this)
HASHED_ASSET=$(curl -s https://$DOMAIN | grep -o 'assets/[^"]*\.js' | head -1)
if [ ! -z "$HASHED_ASSET" ]; then
  CACHE_HEADER=$(curl -sI https://$DOMAIN/$HASHED_ASSET | grep -i "cache-control" | grep -i "immutable")
  if [ ! -z "$CACHE_HEADER" ]; then
    echo "✓ Immutable cache headers set on hashed assets"
  else
    echo "✗ Immutable cache headers missing"
  fi
else
  echo "⚠ Could not find hashed asset to test"
fi
echo ""

# 5. Security Headers
echo "5. Testing Security Headers..."
CSP=$(curl -sI https://$DOMAIN | grep -i "content-security-policy")
HSTS=$(curl -sI https://$DOMAIN | grep -i "strict-transport-security")
if [ ! -z "$CSP" ] && [ ! -z "$HSTS" ]; then
  echo "✓ Security headers present"
else
  echo "✗ Some security headers missing"
fi
echo ""

# 6. Compression
echo "6. Testing Compression..."
ENCODING=$(curl -sI -H "Accept-Encoding: gzip" https://$DOMAIN | grep -i "content-encoding")
if [ ! -z "$ENCODING" ]; then
  echo "✓ Compression working"
else
  echo "✗ Compression not working"
fi
echo ""

echo "=== Testing Complete ==="
```

**Usage**:
```bash
chmod +x test-htaccess.sh
./test-htaccess.sh
```

---

## Quick Verification Checklist

Run these commands and verify outputs:

```bash
# Quick test all endpoints
DOMAIN="yourdomain.com"

# HTTPS redirect
curl -I http://$DOMAIN | head -1

# API bypass
curl -sI https://$DOMAIN/api/health | grep -i "content-type"

# Admin bypass  
curl -I https://$DOMAIN/dfaqs | head -1

# Cache headers
curl -I https://$DOMAIN/assets/index-D7ZTbwwW.js | grep -i "cache-control"

# Security headers
curl -I https://$DOMAIN | grep -iE "csp|hsts|x-frame"

# Compression
curl -I -H "Accept-Encoding: gzip" https://$DOMAIN | grep -i "content-encoding"
```

---

## Post-Deployment Monitoring

After deployment, monitor for:

1. **CSP Violations**: Check browser console daily for first week
2. **HSTS Effectiveness**: After 1 week, increase max-age to 2 years:
   ```apache
   Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
   ```
3. **Cache Performance**: Monitor browser DevTools Network tab
4. **API Response Times**: Ensure no-cache headers don't impact performance

---

## Troubleshooting

### Issue: API routes return HTML instead of JSON
**Solution**: Check rewrite rules order - API exclusion must come before SPA fallback

### Issue: Immutable cache not working
**Solution**: Verify regex pattern matches your asset naming (`-[0-9a-fA-F]{8,}\.`)

### Issue: CSP violations in console
**Solution**: Add required domains to CSP or use nonces/hashes for inline scripts

### Issue: HSTS set on HTTP
**Solution**: Ensure `<If "%{HTTPS} == 'on'">` condition is correct

---

## Additional Resources

- [Mozilla Security Headers Guide](https://infosec.mozilla.org/guidelines/web_security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers Test](https://securityheaders.com/)

