const STEPS = [
  ['I sit with the people doing the work.', 'Sales, marketing, support, ops. I watch how a lead really moves through the company, not how the playbook says it does, and I learn the manual steps nobody has written down.'],
  ['I find where revenue leaks.', 'The handoff that drops leads. The research nobody has time for. The quote that takes a day. The customer who leaves without anyone asking why. That is where the build starts.'],
  ['I rebuild the process as a system.', "Agents for the judgment, plain code for the money, and a person in the loop wherever a mistake would reach a customer. I design it so it keeps running when I'm not in the room."],
  ['I ship into production, not a demo.', 'Real data, real customers, from the first week. Then I watch it: monitoring, evaluation, and fixes before anyone has to report a problem.'],
  ['I hand it over so your team owns it.', "Documented, explained and understood by the people who will live with it. I stay close until it runs without me, and I'm a message away when it matters."],
]

export default function Process() {
  return (
    <section className="process" id="how-i-work">
      <div className="wrap">
        <h2 className="h2">I get inside the revenue team, then I build.</h2>
        <div className="steps">
          {STEPS.map(([h, p]) => <div key={h}><i aria-hidden="true" /><h3>{h}</h3><p>{p}</p></div>)}
        </div>
      </div>
    </section>
  )
}
