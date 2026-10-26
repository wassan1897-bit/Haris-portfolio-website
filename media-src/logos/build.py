"""Builds the toolkit logo strip: brand icons (Simple Icons, in each brand's own colour) in public/logos/si/,
and the strip markup in index.html between the <!-- logos --> markers. Every tool is one the brief's toolkit names.
Usage: python build.py <path to an unpacked simple-icons npm package>"""
import json, os, re, shutil, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SI = sys.argv[1]
OUT = os.path.join(ROOT, 'public', 'logos', 'si')
os.makedirs(OUT, exist_ok=True)

# (file name, label as the brief writes it, simple-icons slug or a local file in public/logos with its colour)
TOOLS = [
	('n8n', 'n8n', 'n8n'), ('claude', 'Claude', 'claude'), ('openai', 'OpenAI', ('openai.svg', '#111a17')),
	('gemini', 'Gemini', 'googlegemini'), ('perplexity', 'Perplexity', 'perplexity'), ('deepseek', 'DeepSeek', 'deepseek'),
	('zapier', 'Zapier', 'zapier'), ('make', 'Make', 'make'), ('retell', 'Retell', None),
	('elevenlabs', 'ElevenLabs', 'elevenlabs'), ('twilio', 'Twilio', ('twilio.svg', '#F22F46')), ('whatsapp', 'WhatsApp', 'whatsapp'),
	('hubspot', 'HubSpot', 'hubspot'), ('airtable', 'Airtable', 'airtable'), ('clickup', 'ClickUp', 'clickup'),
	('webflow', 'Webflow', 'webflow'), ('googlesheets', 'Google Sheets', 'googlesheets'), ('appsscript', 'Apps Script', 'googleappsscript'),
	('supabase', 'Supabase', 'supabase'), ('postgres', 'Postgres', 'postgresql'), ('python', 'Python', 'python'),
	('fastapi', 'FastAPI', 'fastapi'), ('typescript', 'TypeScript', 'typescript'), ('nextjs', 'Next.js', 'nextdotjs'),
	('react', 'React', 'react'), ('dotnet', '.NET', 'dotnet'), ('vercel', 'Vercel', 'vercel'),
	('docker', 'Docker', 'docker'), ('githubactions', 'GitHub Actions', 'githubactions'), ('sentry', 'Sentry', 'sentry'),
]
data = json.load(open(os.path.join(SI, 'data', 'simple-icons.json'), encoding='utf-8'))
icons = data if isinstance(data, list) else data['icons']
HEX = {}
for ic in icons:
	slug = ic.get('slug') or re.sub(r'[^a-z0-9]', '', ic['title'].lower())
	HEX[slug] = '#' + ic['hex']


def colour(svg, hex_):
	svg = re.sub(r'\sfill="[^"]*"', '', svg, count=1)
	return svg.replace('<svg ', f'<svg fill="{hex_}" ', 1)


for name, label, src in TOOLS:
	if src is None:
		continue
	if isinstance(src, tuple):
		svg = open(os.path.join(ROOT, 'public', 'logos', src[0]), encoding='utf-8').read()
		svg = colour(svg, src[1])
	else:
		svg = colour(open(os.path.join(SI, 'icons', src + '.svg'), encoding='utf-8').read(), HEX[src])
	open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8').write(svg)


def item(name, label, hidden):
	alt = ''  # the visible name is the label
	if name == 'retell':  # no Simple Icons mark: the icon cut from Retell's own wordmark (public/logos/retell.png)
		return f'<li><img src="/logos/si/retell.webp" alt="" width="26" height="26" /><span>{label}</span></li>'
	return f'<li><img src="/logos/si/{name}.svg" alt="{alt}" width="26" height="26" /><span>{label}</span></li>'


ul = lambda hidden: (f'<ul{" aria-hidden=\"true\"" if hidden else ""}>' + ''.join(item(n, l, hidden) for n, l, _ in TOOLS) + '</ul>')
strip = '<!-- logos -->\n\t<div class="track">' + ul(False) + ul(True) + '</div>\n\t<!-- /logos -->'
p = os.path.join(ROOT, 'index.html')
s = open(p, encoding='utf-8').read()
if '<!-- logos -->' in s:
	s = re.sub(r'<!-- logos -->.*?<!-- /logos -->', lambda m: strip, s, flags=re.S)
else:
	s, n = re.subn(r'<div class="track">.*?</div>', lambda m: strip, s, count=1, flags=re.S)
	assert n == 1
open(p, 'w', encoding='utf-8').write(s)
print('logos:', len(TOOLS))
