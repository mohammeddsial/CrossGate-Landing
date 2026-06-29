import urllib.request
# Check 404
try:
    r = urllib.request.Request('https://crossgatelegal.com/randomgibberish', headers={'User-Agent': 'Mozilla/5.0'})
    urllib.request.urlopen(r, timeout=10)
    print('404: FAIL (no error raised)')
except urllib.request.HTTPError as e:
    body = e.read().decode('utf-8', errors='ignore')
    branded = 'out of reach' in body and 'Return home' in body
    print(f'404: {"PASS (branded)" if branded else "FAIL (generic)"}')
except Exception as e:
    print(f'404: {e}')
# Check sitemap
try:
    r = urllib.request.Request('https://crossgatelegal.com/sitemap.xml', headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(r, timeout=10)
    print(f'sitemap.xml: PASS ({resp.status})')
except Exception as e:
    print(f'sitemap.xml: {e}')
# Check form
try:
    r = urllib.request.Request('https://crossgatelegal.com/contact.html', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(r, timeout=10).read().decode('utf-8', errors='ignore')
    print(f'Form spinner: {"PASS" if "Sending" in html else "FAIL"}')
    print(f'onBlur validation: {"PASS" if "blur" in html else "FAIL"}')
except Exception as e:
    print(f'Form check: {e}')