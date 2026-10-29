export default function Intro() {
  return (
    <div className="wrap">
      <section className="intro" id="who-i-am">
        <img className="pic" src="/images/haris.webp" alt="Muhammad Haris" width="1536" height="2048" loading="lazy" />
        <div>
          <span className="eyebrow">Who I am</span>
          <h2>I build revenue systems that run without me.</h2>
          <p className="one">I'm Muhammad Haris, an AI GTM engineer. I build the AI systems that find your buyers, research them, reach them at the right moment and keep them.</p>
          <p>What makes me useful to a revenue leader isn't a tool list. It's that I understand what the number has to do, and I can build the machine that does it, to a standard where you can let it run.</p>
          <h3 className="bring-h">What I bring to every engagement</h3>
          <dl className="bring">
            <dt>I speak revenue and code.</dt><dd>I can sit in a pipeline review in the morning and ship the fix in the afternoon.</dd>
            <dt>I build the whole system.</dt><dd>Signal, research, outreach, conversion, retention and the data underneath, wired together so every stage hands clean data to the next.</dd>
            <dt>Production or nothing.</dt><dd>Real data from the first week, evaluations, guardrails, monitoring, and a person in the loop wherever a mistake would reach a customer.</dd>
          </dl>
        </div>
      </section>
    </div>
  )
}
