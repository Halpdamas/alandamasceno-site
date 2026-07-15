with open('C:/Users/halui/OneDrive/Documentos/New OpenCode Project/clarity2.html','r',encoding='utf-8') as f:
    content = f.read()

# Find all lines in TRANS with odd single quotes due to apostrophes
import re
lines = content.split('\n')
for i, line in enumerate(lines):
    # Check for single-quoted strings containing apostrophes
    # Find pattern: '...'...' where the first ' opens a string and the middle ' is an apostrophe
    stripped = line.strip()
    if stripped.startswith("'") or stripped.startswith("//"):
        continue
    
    # Count single quotes
    sq = line.count("'")
    dq = line.count('"')
    
    # If odd single quotes and has double quotes too, there might be embedded apostrophes
    if sq % 2 != 0 and dq > 0:
        # Find the actual issue
        for ch in line:
            pass
        print(f'Line {i+1}: sq={sq} dq={dq}')
        print(f'  {line[:150].strip()}')
        print()
    elif sq % 2 != 0 and sq > 0:
        print(f'Line {i+1}: sq={sq} dq={dq} ** ODD SINGLE QUOTES ONLY **')
        print(f'  {line[:150].strip()}')
        print()
