import os

base = r'C:\Users\user\Claude\Projects\Cross Gate Legal  -- Landing'

# Read styles.css content
with open(os.path.join(base, 'styles.css'), 'r', encoding='utf-8') as f:
    css_content = f.read()

# Minify slightly: remove comments
import re
css_min = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
css_min = re.sub(r'\n\s*\n', '\n', css_min)

files = ['index.html', 'about.html', 'contact.html', 'team.html', 'privacy.html', 'terms.html']

for fname in files:
    path = os.path.join(base, fname)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Remove external stylesheet link
    html = re.sub(r'<link rel="stylesheet" href="styles\.css"/>\n?', '', html)
    
    # Add inline styles before Tailwind config (or after preconnects)
    # Find the last <link> or <style> tag in head and insert after it
    insert_point = html.find('</head>')
    inline_style = f'<style>{css_min}</style>\n'
    html = html[:insert_point] + inline_style + html[insert_point:]
    
    # Add defer to site.js link
    html = html.replace('src="site.js?v=2"', 'src="site.js?v=2" defer')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f'Processed: {fname}')

print('\nDone. CSS inlined and site.js deferred on all pages.')