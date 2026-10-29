import { useRef } from 'react'
import FlowCanvas from '../../components/FlowCanvas.jsx'
import { useInView } from '../../hooks/useInView.js'

const CARDS = [[0, 0], [1, 1], [2, 2], [0, 3], [1, 4], [2, 5]]

// deal cards move across the board and turn gold as they land in the pipeline column, only while it's on screen
function PipelineBoard() {
  const ref = useRef(null)
  const run = useInView(ref)
  return (
    <figure className={'pboard' + (run ? ' run' : '')} aria-label="~£110k annual pipeline created, 731 new prospects captured" ref={ref}>
      <div className="pb-stage" aria-hidden="true">
        <div className="pb-cols"><div><span /></div><div><span /></div><div className="win"><span /></div></div>
        <div className="pb-cards">{CARDS.map(([r, d]) => <i key={d} style={{ '--r': r, '--d': d }} />)}</div>
      </div>
      <div className="pb-ft"><div><b>~&pound;110k</b><span>annual pipeline created</span></div><div><b>731</b><span>new prospects captured</span></div></div>
    </figure>
  )
}

export default function Why() {
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="in">
        <div className="why-left">
          <h2 id="why-title">I don't sell AI. I sell pipeline that happens to run on AI.</h2>
          <PipelineBoard />
        </div>
        <div>
          <h3>What makes me different</h3>
          <dl>
            <dt>Systems, not workflows.</dt><dd>Every engagement is end to end: the data, the agents, the CRM and the reporting. Nothing is handed over half-connected.</dd>
            <dt>Agents where judgment helps. Plain code where mistakes cost money.</dt><dd>AI reads, researches and decides what deserves attention. Deterministic logic handles anything that touches a price, a send or a customer record.</dd>
            <dt>A production standard most GTM work never reaches.</dt><dd>Evaluations, guardrails, strict output formats on every AI step, human approval before anything sensitive reaches a customer, and monitoring once it's live.</dd>
            <dt>Revenue first, tools last.</dt><dd>I start from where pipeline leaks and work back to the build. The stack is chosen to fit the problem, never the other way round.</dd>
            <dt>I build real software.</dt><dd>AI platforms with hybrid retrieval, evaluation pipelines and bank-grade security, not just connected SaaS tools.</dd>
            <dt>I've built where the stakes are highest.</dt><dd>Bank data, regulated compliance and multi-tenant platforms. If a system can be trusted with a customer's money, it can be trusted with your pipeline.</dd>
          </dl>
        </div>
      </div>
      <FlowCanvas />
    </section>
  )
}
