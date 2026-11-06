import './tokens.css';
import './JigglypuffSaasIndex.css';

const NAV_ITEMS = ['Product', 'Workspace', 'Customers', 'Pricing'];
const METRICS = [
  { label: 'Weekly focus', value: '82%', delta: '+12%' },
  { label: 'Plans shipped', value: '24', delta: '+6' },
  { label: 'Team calm', value: '4.9', delta: 'steady' },
];
const BARS = [42, 68, 54, 86, 72, 92, 64];
const PALETTE = ['#ffaca4', '#e67383', '#ec5f6d', '#dd4655', '#ffffff', '#1785b5'];

export default function JigglypuffSaasIndex() {
  return (
    <main className="jsaas">
      <header className="jp-nav">
        <a className="jp-brand" href="#sample-top" aria-label="Puffbase home">
          <span className="jp-brand-mark" aria-hidden="true">
            <img src="/sprites/39.png" alt="" />
          </span>
          <span>Puffbase</span>
        </a>
        <nav aria-label="Product navigation">
          {NAV_ITEMS.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
        </nav>
        <a className="jp-nav-cta" href="#start">Start free</a>
      </header>

      <section className="jp-hero" id="sample-top">
        <div className="jp-hero-copy">
          <p className="jp-eyebrow"><span /> A calmer way to plan together</p>
          <h1>Good work,<br /><em>without the noise.</em></h1>
          <p className="jp-lede">
            Puffbase turns scattered briefs into one clear weekly rhythm. Built for teams
            who would rather make something thoughtful than manage another dashboard.
          </p>
          <div className="jp-actions">
            <a className="jp-primary" href="#start">Start free <span aria-hidden="true">↗</span></a>
            <a className="jp-secondary" href="#workspace">See the workspace</a>
          </div>
          <div className="jp-proof">
            <div className="jp-avatars" aria-hidden="true"><i>J</i><i>A</i><i>M</i><i>+</i></div>
            <span>Designed for small teams<br />with ambitious standards.</span>
          </div>
        </div>

        <div className="jp-product" id="workspace" aria-label="Puffbase weekly planning dashboard">
          <div className="jp-window-bar">
            <div className="jp-window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span>week 24 / studio plan</span>
            <b>Live</b>
          </div>
          <div className="jp-product-body">
            <aside className="jp-sidebar" aria-label="Workspace sections">
              <small>WORKSPACE</small>
              {['Overview', 'Projects', 'Timeline', 'Notes', 'Archive'].map((x, i) => (
                <span className={i === 0 ? 'active' : ''} key={x}><i />{x}</span>
              ))}
            </aside>
            <div className="jp-dashboard">
              <div className="jp-dash-head">
                <div><small>THIS WEEK</small><h2>Make room for the important work.</h2></div>
                <button type="button">New plan</button>
              </div>
              <div className="jp-metric-row">
                {METRICS.map((m) => (
                  <article key={m.label}>
                    <small>{m.label}</small>
                    <b>{m.value}</b>
                    <em>{m.delta}</em>
                  </article>
                ))}
              </div>
              <div className="jp-chart-card">
                <div className="jp-chart-title"><span>Team momentum</span><b>Last 7 days</b></div>
                <div className="jp-chart" aria-hidden="true">
                  {BARS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
                </div>
              </div>
              <div className="jp-task-row">
                <article><i className="jp-task-dot warm" /><div><b>Finalise launch notes</b><small>Today · Design</small></div><span>09:30</span></article>
                <article><i className="jp-task-dot cool" /><div><b>Review customer calls</b><small>Today · Research</small></div><span>14:00</span></article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="jp-palette-strip" aria-label="Jigglypuff palette tokens">
        <span>POKEMON_PALETTE / 039</span>
        <div>{PALETTE.map((c) => <i key={c} style={{ background: c }} title={c} />)}</div>
        <span>APPLE_DESIGN / FLUID UI</span>
      </section>

      <section className="jp-features" id="product">
        {[
          ['01', 'One clear rhythm', 'Every brief, decision and next step lands in a single weekly view.'],
          ['02', 'Built around people', 'Quiet defaults, direct manipulation and no performative busyness.'],
          ['03', 'Ready on day one', 'A considered workspace that feels familiar before anyone explains it.'],
        ].map(([n, title, copy]) => (
          <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </section>
    </main>
  );
}