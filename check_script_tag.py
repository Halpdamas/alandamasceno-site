with open('C:/Users/halui/OneDrive/Documentos/New OpenCode Project/clarity2.html','r',encoding='utf-8') as f:
    c = f.read()

# Check for </script> in the JS code (would break HTML parsing)
idx = c.find('const {useState')
end = c.find('</script>', idx)
js = c[idx:end]

# Check for any </script> inside the JS code
if '</script>' in js:
    print('WARNING: </script> found inside JS code!')
    for i, line in enumerate(js.split('\n')):
        if '</script>' in line:
            print(f'  Line {i+1}: {line[:100]}')
else:
    print('No </script> inside JS code - OK')

# Check for unclosed script tag
remaining = c[end+9:]  # after </script>
if '<script' in remaining:
    print('WARNING: Found additional script tags after main script')
    print(remaining[:200])
else:
    print('No extra script tags - OK')

# Verify the script content is complete
print(f'Script content length: {len(js)}')
print(f'Script starts with: {js[:50]}')
print(f'Script ends with: {js[-50:]}')
