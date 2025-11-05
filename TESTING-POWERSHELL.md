# Pre-Deployment Testing Guide - Windows PowerShell

Quick test commands for Windows PowerShell users.

## Quick Tests

```powershell
# Set your domain
$domain = "yourdomain.com"

# 1. Test HTTPS Redirect
Write-Host "Testing HTTPS Redirect..." -ForegroundColor Cyan
Invoke-WebRequest -Uri "http://$domain" -Method Head -MaximumRedirection 0 -ErrorAction SilentlyContinue | Select-Object StatusCode, Headers

# 2. Test API Routes
Write-Host "`nTesting API Routes..." -ForegroundColor Cyan
$apiResponse = Invoke-WebRequest -Uri "https://$domain/api/health" -Method Head
$apiResponse.Headers.'Content-Type'
# Should show: application/json

# 3. Test Admin Routes
Write-Host "`nTesting Admin Routes..." -ForegroundColor Cyan
$adminResponse = Invoke-WebRequest -Uri "https://$domain/dfaqs" -Method Head
$adminResponse.StatusCode
# Should show: 200

# 4. Test Cache Headers
Write-Host "`nTesting Cache Headers..." -ForegroundColor Cyan
$assetResponse = Invoke-WebRequest -Uri "https://$domain/assets/index-D7ZTbwwW.js" -Method Head
$assetResponse.Headers.'Cache-Control'
# Should show: public, max-age=31536000, immutable

# 5. Test Security Headers
Write-Host "`nTesting Security Headers..." -ForegroundColor Cyan
$headers = Invoke-WebRequest -Uri "https://$domain" -Method Head
$headers.Headers.'Content-Security-Policy'
$headers.Headers.'Strict-Transport-Security'
$headers.Headers.'X-Frame-Options'

# 6. Test Compression
Write-Host "`nTesting Compression..." -ForegroundColor Cyan
$compressed = Invoke-WebRequest -Uri "https://$domain" -Method Head -Headers @{"Accept-Encoding"="gzip"}
$compressed.Headers.'Content-Encoding'
# Should show: gzip
```

## Complete PowerShell Test Script

Save as `test-htaccess.ps1`:

```powershell
param(
    [string]$Domain = "yourdomain.com"
)

Write-Host "=== Testing .htaccess Configuration ===" -ForegroundColor Green
Write-Host "Domain: $Domain`n" -ForegroundColor Yellow

# 1. HTTPS Redirect
Write-Host "1. Testing HTTPS Redirect..." -ForegroundColor Cyan
try {
    $httpResponse = Invoke-WebRequest -Uri "http://$Domain" -Method Head -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "   ✗ HTTP not redirecting (Status: $($httpResponse.StatusCode))" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 301 -or $_.Exception.Response.StatusCode -eq 302) {
        Write-Host "   ✓ HTTPS redirect working" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Unexpected status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# 2. API Routes
Write-Host "`n2. Testing API Routes..." -ForegroundColor Cyan
try {
    $apiResponse = Invoke-WebRequest -Uri "https://$Domain/api/health" -Method Head
    $contentType = $apiResponse.Headers.'Content-Type'
    if ($contentType -match "json") {
        Write-Host "   ✓ API routes bypassing SPA rewrite" -ForegroundColor Green
    } else {
        Write-Host "   ✗ API returning: $contentType" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ API request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Admin Routes
Write-Host "`n3. Testing Admin Routes..." -ForegroundColor Cyan
try {
    $adminResponse = Invoke-WebRequest -Uri "https://$Domain/dfaqs" -Method Head
    if ($adminResponse.StatusCode -eq 200) {
        Write-Host "   ✓ Admin routes accessible" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Admin routes returned: $($adminResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Admin route failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Cache Headers
Write-Host "`n4. Testing Cache Headers..." -ForegroundColor Cyan
# Note: You'll need to update this with actual asset filenames
$testAssets = @("index-D7ZTbwwW.js", "index-CdkOIcSR.css")
$found = $false
foreach ($asset in $testAssets) {
    try {
        $assetResponse = Invoke-WebRequest -Uri "https://$Domain/assets/$asset" -Method Head
        $cacheControl = $assetResponse.Headers.'Cache-Control'
        if ($cacheControl -match "immutable") {
            Write-Host "   ✓ Immutable cache headers set on $asset" -ForegroundColor Green
            $found = $true
            break
        }
    } catch {
        # Asset might not exist, try next
        continue
    }
}
if (-not $found) {
    Write-Host "   ⚠ Could not find hashed asset to test" -ForegroundColor Yellow
}

# 5. Security Headers
Write-Host "`n5. Testing Security Headers..." -ForegroundColor Cyan
try {
    $headers = Invoke-WebRequest -Uri "https://$Domain" -Method Head
    $missing = @()
    if (-not $headers.Headers.'Content-Security-Policy') { $missing += "CSP" }
    if (-not $headers.Headers.'Strict-Transport-Security') { $missing += "HSTS" }
    if (-not $headers.Headers.'X-Frame-Options') { $missing += "X-Frame-Options" }
    if (-not $headers.Headers.'X-Content-Type-Options') { $missing += "X-Content-Type-Options" }
    
    if ($missing.Count -eq 0) {
        Write-Host "   ✓ All security headers present" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Missing headers: $($missing -join ', ')" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Failed to check headers: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Compression
Write-Host "`n6. Testing Compression..." -ForegroundColor Cyan
try {
    $compressed = Invoke-WebRequest -Uri "https://$Domain" -Method Head -Headers @{"Accept-Encoding"="gzip"}
    $encoding = $compressed.Headers.'Content-Encoding'
    if ($encoding -match "gzip|br") {
        Write-Host "   ✓ Compression working ($encoding)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Compression not working" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Compression test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green
```

**Usage**:
```powershell
# Run with default domain
.\test-htaccess.ps1

# Run with custom domain
.\test-htaccess.ps1 -Domain "hardweyllc.com"
```

---

## Browser Testing (Most Reliable)

For CSP and React Router testing, browser DevTools are more reliable:

1. **Open Chrome DevTools** (F12)
2. **Network Tab**: Check headers for all requests
3. **Console Tab**: Look for CSP violations
4. **Application Tab** → **Storage**: Check cache behavior

**Quick Browser Tests**:
- Navigate to `https://yourdomain.com` → Should redirect from HTTP
- Navigate to `https://yourdomain.com/api/health` → Should return JSON
- Navigate to `https://yourdomain.com/dfaqs` → Should load admin app
- Navigate to `https://yourdomain.com/more-faq` → Should load React app (SPA route)
- Check Network tab → Verify cache headers on assets
- Check Console → No CSP violations

