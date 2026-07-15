with open('C:/Users/halui/OneDrive/Documentos/New OpenCode Project/clarity2.html','r',encoding='utf-8') as f:
    c = f.read()

idx = c.find('const {useState')
end = c.find('</script>', idx)
js = c[idx:end]

# Find all lines with odd single quotes
lines = js.split('\n')
for i, line in enumerate(lines):
    sq = line.count("'")
    dq = line.count('"')
    if sq % 2 != 0 and sq > 0:
        # Check if the odd quote is due to an apostrophe in a double-quoted string
        # by simulating JS parsing
        in_sq = False
        in_dq = False
        actual_sq_delimiters = 0
        for ch in line:
            if ch == "'" and not in_dq:
                in_sq = not in_sq
                actual_sq_delimiters += 1
            elif ch == '"' and not in_sq:
                in_dq = not in_dq
        
        if actual_sq_delimiters % 2 != 0:
            print(f'LINE {i+1}: BROKEN single-quoted string (delimiter count={actual_sq_delimiters})')
            print(f'  {line[:200]}')
            print()
