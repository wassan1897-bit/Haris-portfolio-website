const TOOLS = [
  ['n8n.svg', 'n8n'], ['claude.svg', 'Claude'], ['openai.svg', 'OpenAI'], ['perplexity.svg', 'Perplexity'],
  ['cursor.svg', 'Cursor'], ['antigravity.svg', 'Antigravity'], ['clay.png', 'Clay'], ['apollo.svg', 'Apollo'],
  ['heyreach.jpg', 'HeyReach'], ['salesnavigator.svg', 'Sales Navigator'], ['lagrowthmachine.png', 'La Growth Machine'],
  ['gohighlevel.png', 'GoHighLevel'], ['zapier.svg', 'Zapier'], ['make.svg', 'Make'], ['elevenlabs.svg', 'ElevenLabs'],
  ['hubspot.svg', 'HubSpot'], ['webflow.svg', 'Webflow'], ['supabase.svg', 'Supabase'], ['postgres.svg', 'Postgres'],
  ['python.svg', 'Python'], ['fastapi.svg', 'FastAPI'], ['typescript.svg', 'TypeScript'], ['nextjs.svg', 'Next.js'],
  ['react.svg', 'React'], ['dotnet.svg', '.NET'], ['docker.svg', 'Docker'], ['sentry.svg', 'Sentry'],
]

const List = (props) => (
  <ul {...props}>
    {TOOLS.map(([file, name]) => <li key={name}><img src={`/logos/si/${file}`} alt="" width="26" height="26" /><span>{name}</span></li>)}
  </ul>
)

// each tool once; the list is repeated so the loop is seamless
export default function Logos() {
  return (
    <section className="logos" aria-label="Toolkit">
      <div className="track"><List /><List aria-hidden="true" /></div>
    </section>
  )
}
