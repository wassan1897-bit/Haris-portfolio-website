"""Insert project NN into about.html: <case.html> after the previous project's article,
<detail.html> after the previous project's case file, an index button, and bump --pj-n.
usage: python add-project.py NN case.html detail.html"""
import sys
nn, case_f, det_f = sys.argv[1], sys.argv[2], sys.argv[3]
n = int(nn); prev = f'{n - 1:02d}'
p = 'E:/Haris portfolio website/public/landing/about.html'
s = open(p, encoding='utf-8', newline='').read(); nl = '\r\n'
load = lambda f: open(f, encoding='utf-8').read().replace('\r\n', '\n').rstrip('\n').replace('\n', nl)
assert f'id="project-{nn}"' not in s, 'already added'
e = s.index('</article>', s.index(f'id="project-{prev}"')) + len('</article>')
s = s[:e] + nl + nl + load(case_f) + s[e:]
e = s.index('</aside>', s.index(f'id="pj-detail-{prev}"')) + len('</aside>')
s = s[:e] + nl + nl + load(det_f) + s[e:]
old = f'style="--pj-n: {n}"'; assert s.count(old) == 1; s = s.replace(old, f'style="--pj-n: {n + 1}"')
btn = f'<button type="button" data-go="{n - 1}" aria-label="Project {prev}">{prev}</button>'
assert s.count(btn) == 1
s = s.replace(btn, btn + nl + f'\t\t\t\t\t\t<button type="button" data-go="{n}" aria-label="Project {nn}">{nn}</button>')
open(p, 'w', encoding='utf-8', newline='').write(s)
print('added project', nn)
