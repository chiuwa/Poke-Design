import './tokens.css';
import './JigglypuffSaasIndex.css';

const NAV_ITEMS = ['Product', 'Workspace', 'Customers', 'Pricing'];
const SIDEBAR_ITEMS = [
  { label: 'Today', count: '4', active: true },
  { label: 'Upcoming', count: '12' },
  { label: 'Projects', count: '8' },
  { label: 'Notes', count: '' },
  { label: 'Archive', count: '' },
];
const TASKS = [
  { title: 'Finalise launch notes', meta: 'Design · 09:30', done: true },
  { title: 'Review customer calls', meta: 'Research · 14:00', done: false },
  { title: 'Send weekly digest', meta: 'Studio · 16:30', done: false },
];
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
        <a className="jp-nav-cta" href="#start">Open app</a>
      </header>

      <section className="jp-hero" id="sample-top">
        <div className="jp-hero-copy">
          <p className="jp-eyebrow"><span /> A calmer place to work</p>
          <h1>Good work,<br /><em>quietly organised.</em></h1>
          <p className="jp-lede">
            One focused workspace for the day’s decisions, writing and next steps.
            Nothing loud, nothing to configure.
          </p>
          <div className="jp-actions">
            <a className="jp-primary" href="#start">Open Puffbase</a>
            <a className="jp-secondary" href="#workspace">Take a look <span aria-hidden="true">→</span></a>
          </div>
          <div className="jp-proof">
            <span className="jp-proof-rule" aria-hidden="true" />
            <span>Mac, iPad and iPhone<br />Designed for small teams.</span>
          </div>
        </div>

        <div className="jp-product" id="workspace" aria-label="Puffbase desktop workspace">
          <div className="jp-titlebar">
            <div className="jp-traffic" aria-hidden="true"><i /><i /><i /></div>
            <div className="jp-titlebar-title"><span>Puffbase</span><small>Today</small></div>
            <div className="jp-titlebar-actions" aria-hidden="true">
              <i className="jp-symbol-plus">＋</i>
              <i className="jp-symbol-search">⌕</i>
              <i className="jp-symbol-more">···</i>
            </div>
          </div>
          <div className="jp-app-body">
            <aside className="jp-sidebar" aria-label="Workspace sections">
              <div className="jp-sidebar-account">
                <span className="jp-account-avatar" aria-hidden="true">S</span>
                <div><b>Studio North</b><small>Workspace</small></div>
              </div>
              <div className="jp-sidebar-label">Library</div>
              <ul>
                {SIDEBAR_ITEMS.map((item) => (
                  <li className={item.active ? 'active' : ''} key={item.label}>
                    <i aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.count && <small>{item.count}</small>}
                  </li>
                ))}
              </ul>
              <div className="jp-sidebar-foot">
                <i aria-hidden="true" />
                <span>Storage</span>
                <small>2.4 GB</small>
              </div>
            </aside>

            <section className="jp-content">
              <div className="jp-content-toolbar">
                <div className="jp-segmented" aria-label="View selector">
                  <span className="active">Today</span><span>Week</span><span>All</span>
                </div>
                <div className="jp-toolbar-meta">
                  <span>Thursday, 12 June</span>
                  <b className="jp-calendar-icon" aria-hidden="true">12</b>
                </div>
              </div>

              <div className="jp-focus-card">
                <div className="jp-focus-copy">
                  <small>FOCUS</small>
                  <h2>Make room for the important work.</h2>
                  <p>Two tasks left today. Your afternoon is clear after 15:00.</p>
                </div>
                <div className="jp-focus-ring" aria-hidden="true"><span>2</span><small>left</small></div>
              </div>

              <div className="jp-list-head">
                <div><small>TO DO</small><b>Today</b></div>
                <button type="button">New item <span aria-hidden="true">＋</span></button>
              </div>
              <div className="jp-task-list">
                {TASKS.map((task) => (
                  <article className={task.done ? 'done' : ''} key={task.title}>
                    <i className="jp-check" aria-hidden="true">{task.done ? '✓' : ''}</i>
                    <div><b>{task.title}</b><small>{task.meta}</small></div>
                    <span className="jp-row-chevron" aria-hidden="true">›</span>
                  </article>
                ))}
              </div>
            </section>

            <aside className="jp-inspector" aria-label="Item details">
              <small>DETAILS</small>
              <div className="jp-inspector-empty" aria-hidden="true">
                <i />
                <span />
                <span />
              </div>
              <div className="jp-inspector-note">
                <b>Studio note</b>
                <p>Keep the week clear. One decision, one next step, then close the laptop.</p>
              </div>
              <div className="jp-inspector-tags">
                {['#ffaca4', '#e67383', '#ec5f6d'].map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
                <span>Palette 039</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="jp-palette-strip" aria-label="Jigglypuff palette tokens">
        <span>POKEMON_PALETTE / 039</span>
        <div>{PALETTE.map((c) => <i key={c} style={{ background: c }} title={c} />)}</div>
        <span>APPLE_DESIGN / QUIET UI</span>
      </section>

      <section className="jp-features" id="product">
        {[
          ['01', 'One clear view', 'Today, upcoming and notes live in one predictable place.'],
          ['02', 'Familiar by default', 'System typography, direct controls and no setup ritual.'],
          ['03', 'Detail without noise', 'Restrained color, considered spacing and calm feedback.'],
        ].map(([n, title, copy]) => (
          <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </section>
    </main>
  );
}