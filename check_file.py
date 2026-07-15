with open('C:/Users/halui/OneDrive/Documentos/New OpenCode Project/clarity2.html','r',encoding='utf-8') as f:
    c = f.read()

print('Babel present:', 'babel' in c)
idx = c.find('const {useState')
start = c.rfind('<script', 0, idx)
end = c.find('>', start)
print(f'Script tag: {c[start:end+1]}')

# Check if a CDN is failing
for url in ['unpkg.com/react','unpkg.com/react-dom','cdn.jsdelivr.net','cdn.tailwindcss.com']:
    print(f'{url} present:', url in c)

# Check body content after root div
body_start = c.find('<body>')
root_div = c.find('<div id="root">')
print(f'<body> at line {c[:body_start].count(chr(10))+1}')
print(f'<div id="root"> at line {c[:root_div].count(chr(10))+1}')
