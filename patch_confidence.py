from pathlib import Path
path = Path(r'c:\Users\Administrator\Downloads\FINAN-AI-6a7ea032c15796d0105c33386c543d5db6d0be9c\script.js')
text = path.read_text(encoding='utf-8')
old = '            `  "confidence": 92\\n` +\\n'
print('old repr:', repr(old))
print('line in text?', old in text)
print('found index:', text.find(old))
new = ''
if old not in text:
    raise SystemExit('old not found')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')
print('removed confidence line')
