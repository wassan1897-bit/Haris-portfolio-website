"""Builds the live resume page public/resume.html from the approved engine concept (resume-best.py):
real links, the top bar's dropdown script, a stage-line reveal, and phone/tablet layouts."""
import os
from importlib import util
HERE = os.path.dirname(os.path.abspath(__file__))
spec = util.spec_from_file_location('rb', os.path.join(HERE, 'resume-best.py'))
rb = util.module_from_spec(spec); spec.loader.exec_module(rb)
rm = rb.rm
ROOT = r'E:\Haris portfolio website'
src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()

MAIL_HREF = 'mailto:hariswassan001@gmail.com'
RESUME_HREF = 'mailto:hariswassan001@gmail.com?subject=Resume'  # until the resume PDF is in
LI_HREF, GH_HREF = 'https://linkedin.com/in/muhammad-haris-wassan', 'https://github.com/Haris001-bit'
EXT = 'target="_blank" rel="noopener noreferrer"'

body = rb.BODY
for a, b in [
	(f'<a class="pri" href="#">{rm.I_DL} Download resume</a>', f'<a class="pri" href="{RESUME_HREF}">{rm.I_DL} Download resume</a>'),
	(f'<a href="#">{rm.I_DL} Download resume</a>', f'<a href="{RESUME_HREF}">{rm.I_DL} Download resume</a>'),
	('<a href="#">Book a call</a>', '<a href="/#book">Book a call</a>'),
	('<a href="#">Book a call &rarr;</a>', '<a href="/#book">Book a call &rarr;</a>'),
	(f'<a href="#">{rm.I_MAIL} {rm.MAIL}</a>', f'<a href="{MAIL_HREF}">{rm.I_MAIL} {rm.MAIL}</a>'),
	(f'<a href="#">{rm.I_LI} {rm.LI}</a>', f'<a href="{LI_HREF}" {EXT}>{rm.I_LI} {rm.LI}</a>'),
	(f'<a href="#">{rm.I_GH} {rm.GH}</a>', f'<a href="{GH_HREF}" {EXT}>{rm.I_GH} {rm.GH}</a>'),
]:
	assert a in body, a
	body = body.replace(a, b)
assert 'href="#"' not in body, 'unlinked anchor left'

# top bar and footer point back to the home page sections from here
header, footer = rm.header, rm.footer
for anchor in ['#what-i-build', '#how-i-work', '#who-i-am', '#book', '#selected-work']:
	header = header.replace(f'href="{anchor}"', f'href="/{anchor}"')
	footer = footer.replace(f'href="{anchor}"', f'href="/{anchor}"')
footer = footer.replace(f'href="{RESUME_HREF}">Resume', 'href="/resume.html" aria-current="page">Resume')

nav_js = src[src.index('// Top bar dropdowns'):src.index('// Selected work pages')].rstrip()

css = rb.CSS + '''
/* stage line draws in when the stages come into view */
.stg::after { width: calc(100% - 40px); transform-origin: 0 50%; transition: transform 1.4s cubic-bezier(.23, 1, .32, 1); }
.stg.pre::after { transform: scaleX(0); }
.rh a:focus-visible, .cl a:focus-visible { outline: 2px solid #4fd68c; outline-offset: 3px; }
.rh .acts a, .cl .go a { transition: transform .16s ease-out, background-color .15s ease; }
.rh .acts a:active, .cl .go a:active { transform: scale(.97); }
.rh .ct a:hover { color: #fff; }

@media (max-width: 1000px) {
	.links { display: none; }
	nav.top { grid-template-columns: 1fr auto; height: 72px; }
	.rh .wrap { grid-template-columns: 1fr; gap: 50px; }
	.dia { max-width: 560px; }
	.eng { padding-top: 80px; }
	.stg { grid-template-columns: 1fr 1fr; row-gap: 44px; }
	.stg::before, .stg::after { display: none; }
	.stg h3, .stg p { min-height: 0; }
	.infra { grid-template-columns: 42px 1fr; }
	.infra em { grid-column: 2; }
	.exp { grid-template-columns: 1fr; gap: 28px; padding-top: 80px; }
	.exp .head { position: static; }
	.mods { grid-template-columns: 1fr 1fr; }
	.cl { grid-template-columns: 1fr; padding: 80px 0; }
	.end .end-cols { grid-template-columns: 1fr 1fr; }
	.end .end-cols > div:first-child { grid-column: 1 / -1; }
	.end .end-card { max-width: 440px; }
}
@media (max-width: 600px) {
	.logo span { display: none; }
	.logo b { white-space: nowrap; }
	.top-right .icon-btn { display: none; }
	.rh { padding: 48px 0 56px; }
	.rh h1 { font-size: 42px; }
	.rh .acts a { flex: 1 1 auto; justify-content: center; }
	.eng h2, .exp h2, .tk h2 { font-size: 32px; }
	.stg { grid-template-columns: 1fr; }
	.stg .pr b { font-size: 34px; }
	.exp article { grid-template-columns: 1fr; }
	.exp .tags { grid-column: 1; grid-row: auto; flex-direction: row; flex-wrap: wrap; align-items: center; margin-top: 10px; }
	.exp h3 { font-size: 28px; }
	.tk { padding: 72px 0 80px; }
	.mods { grid-template-columns: 1fr; }
	.cl .q, .cl .go { padding: 28px; }
	.cl .go h3 { font-size: 28px; }
	.end .end-cols { grid-template-columns: 1fr; gap: 36px; }
	.end .end-legal { flex-direction: column; }
}
'''

page = rm.page('engine', css, body)
page = page.replace(rm.header, header).replace(rm.footer, footer)
page = page.replace('<title>Resume | Muhammad Haris, AI GTM Engineer</title>',
	'<title>Resume | Muhammad Haris, AI GTM Engineer</title>\n<meta name="description" content="' + rm.e(rm.ONE) + '" />')
page = page.replace('<body>', '<body>\n<!-- Resume page. Every word comes from the AI GTM Engineer brief; the top bar and footer match the home page. -->', 1)
page = page.replace('</body>', '''<script>
''' + nav_js + '''

// Stage line: draws across when the five stages come into view (stays drawn with reduced motion)
;(function () {
	const s = document.querySelector('.stg')
	if (!s || matchMedia('(prefers-reduced-motion: reduce)').matches) return
	s.classList.add('pre')
	new IntersectionObserver(([e], o) => { if (e.isIntersecting) { s.classList.remove('pre'); o.disconnect() } }, { threshold: 0.3 }).observe(s)
})()
</script>
</body>''')
open(os.path.join(ROOT, 'public', 'resume.html'), 'w', encoding='utf-8').write(page)
print('wrote public/resume.html', len(page))
