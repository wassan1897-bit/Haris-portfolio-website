// Runs after `vite build` and the server build: writes every page as finished HTML (dist/resume.html,
// dist/work/signal-engine.html, ...) so search engines, AI crawlers and link previews get the real page
// without running JavaScript. Also writes the 404 page, sitemap.xml and llms.txt. In the browser the app
// takes over the HTML as it is, so visitors see exactly the same site.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
// React's production build: the development one is slower and warns about things that don't apply here
process.env.NODE_ENV ??= 'production'
const { render, sheetId, WORK, CATEGORIES, ALL_PROJECTS_LEDE, site, seo } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)

const ORIGIN = site.SITE_URL
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const urlOf = (route) => ORIGIN + route

const ROUTES = ['/', '/resume', '/projects/all', ...CATEGORIES.map((c) => `/projects/${c.slug}`), ...WORK.map((w) => `/work/${w.slug}`), '/reviews', '/faq', '/privacy']

// ---------- structured data ----------
const PERSON_ID = `${ORIGIN}/#person`
const WEBSITE_ID = `${ORIGIN}/#website`
const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Muhammad Haris',
  jobTitle: 'AI GTM Engineer',
  description: site.DESCRIPTION,
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/images/haris.webp`,
  email: `mailto:${site.EMAIL}`,
  sameAs: [site.LINKEDIN, site.GITHUB],
  knowsAbout: ['Go-to-market engineering', 'AI agents', 'Signal intelligence', 'Lead research and enrichment', 'Signal-triggered outbound', 'Inbound conversion', 'Customer retention', 'Voice AI agents', 'Retrieval-augmented generation', 'Claude', 'OpenAI', 'Clay', 'Apollo', 'HubSpot', 'n8n', 'Python', 'Postgres'],
}
const website = { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${ORIGIN}/`, name: site.SITE, inLanguage: 'en', publisher: { '@id': PERSON_ID } }
const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, route], i) => ({ '@type': 'ListItem', position: i + 1, name, item: urlOf(route) })),
})

function structuredData(route, meta) {
  const url = urlOf(route)
  const page = (type, extra = {}) => ({ '@type': type, '@id': `${url}#page`, url, name: meta.title, description: meta.description, inLanguage: 'en', isPartOf: { '@id': WEBSITE_ID }, ...extra })
  const graph = [person, website]
  const category = CATEGORIES.find((c) => route === `/projects/${c.slug}`)
  const work = WORK.find((w) => route === `/work/${w.slug}`)
  if (route === '/' || route === '/resume') graph.push(page('ProfilePage', { mainEntity: { '@id': PERSON_ID } }))
  else if (route === '/projects/all') {
    graph.push(page('CollectionPage', { author: { '@id': PERSON_ID }, hasPart: WORK.map((w) => ({ '@type': 'CreativeWork', name: w.title, url: urlOf(`/work/${w.slug}`) })) }))
  } else if (category) {
    const works = WORK.filter((w) => w.category === category.slug)
    graph.push(page('CollectionPage', { author: { '@id': PERSON_ID }, hasPart: works.map((w) => ({ '@type': 'CreativeWork', name: w.title, url: urlOf(`/work/${w.slug}`) })) }))
    graph.push(crumbs([['Selected work', '/projects/all'], [category.name, route]]))
  } else if (work) {
    const cat = CATEGORIES.find((c) => c.slug === work.category)
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      url,
      name: work.title,
      headline: work.title,
      description: meta.description,
      abstract: work.sub,
      image: work.shot ? `${ORIGIN}${work.shot.src}` : undefined,
      author: { '@id': PERSON_ID },
      about: cat.name,
      keywords: work.tag,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
    })
    graph.push(crumbs([['Selected work', '/projects/all'], [cat.name, `/projects/${cat.slug}`], [work.title, route]]))
  } else graph.push(page('WebPage', { about: { '@id': PERSON_ID } }))
  return { '@context': 'https://schema.org', '@graph': graph }
}

// ---------- pages ----------
function htmlFor(route, indexable) {
  const { html, meta, sheets } = render(route)
  if (!meta) throw new Error(`${route}: the page set no title`)
  const url = urlOf(route)
  const head = [
    indexable ? `<link rel="canonical" href="${url}" />` : '<meta name="robots" content="noindex" />',
    indexable && `<meta property="og:url" content="${url}" />`,
    // the page's own stylesheets, in the order the app keeps them; the app takes these elements over
    ...sheets.sort((a, b) => a.order - b.order).map((s) => `<style data-order="${s.order}" data-sheet="${sheetId(s.css)}" data-ssr>${s.css}</style>`),
    indexable && `<script type="application/ld+json">${JSON.stringify(structuredData(route, meta)).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n')
  const swap = (re, value) => (doc) => {
    if (!re.test(doc)) throw new Error(`template is missing ${re}`)
    return doc.replace(re, (_, before) => before + esc(value))
  }
  let doc = template
  for (const step of [
    swap(/(<title>)[^<]*/, meta.title),
    swap(/(<meta name="description" content=")[^"]*/, meta.description),
    swap(/(<meta property="og:title" content=")[^"]*/, meta.title),
    swap(/(<meta property="og:description" content=")[^"]*/, meta.description),
  ]) doc = step(doc)
  return doc.replace('</head>', () => `${head}\n</head>`).replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)
}

const fileFor = (route) => path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}.html`)
for (const route of ROUTES) {
  const file = fileFor(route)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, htmlFor(route, true))
}
// Vercel serves this, with a real 404 status, for any address that isn't a page
fs.writeFileSync(path.join(dist, '404.html'), htmlFor('/404', false))
// the compression plugin zipped the empty template; those copies are out of date now
for (const f of fs.readdirSync(dist)) if (f.endsWith('.html.gz')) fs.rmSync(path.join(dist, f))

// ---------- sitemap.xml ----------
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${urlOf(r)}</loc></url>`).join('\n')}
</urlset>
`)

// ---------- llms.txt: a plain-text guide to the site for AI assistants ----------
const faqAnswer = 'I build the AI systems behind every stage of the revenue engine: finding accounts that are in market, researching them, reaching them at the right moment, converting inbound demand and keeping customers. Then I wire it all together so every stage hands clean data to the next.'
fs.writeFileSync(path.join(dist, 'llms.txt'), `# ${site.SITE}

> ${site.DESCRIPTION} The engineer revenue leaders bring in when they want AI that produces pipeline, not a demo.

What an AI GTM engineer does, in Muhammad Haris's words: ${faqAnswer}

## About
- [Resume](${urlOf('/resume')}): experience, the five stages of the revenue engine, and toolkit
- [Resume (PDF)](${ORIGIN}${site.RESUME_PDF})
- [FAQ](${urlOf('/faq')}): who he works with, how a project starts, what happens after, what it costs
- [Client reviews](${urlOf('/reviews')})

## Selected work
${ALL_PROJECTS_LEDE}

${CATEGORIES.map((c) => `### ${c.name}\n${c.line}\n${WORK.filter((w) => w.category === c.slug).map((w) => `- [${w.title}](${urlOf(`/work/${w.slug}`)}): ${seo.WORK_SEO[w.slug]?.description ?? w.description}`).join('\n')}`).join('\n\n')}

## Contact
- Email: ${site.EMAIL}
- Book a meeting: ${site.CALENDAR_URL}
- LinkedIn: ${site.LINKEDIN}
- GitHub: ${site.GITHUB}
`)

console.log(`prerendered ${ROUTES.length} pages + 404, sitemap.xml, llms.txt`)
