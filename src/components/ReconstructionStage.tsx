import { useEffect, useRef, useState } from 'react';

/**
 * ReconstructionStage
 * --------------------
 * Interprets swarm-cursors as a performance of UI reconstruction:
 * a DOM blueprint is blanked, then multiple virtual cursors rebuild
 * boxes, text, guides, media and duplicates in a top-down sequence.
 *
 * This is a self-contained CSS/Web Animations recreation of the idea,
 * not a copy of the repo code. No page snapshot is taken; the "blueprint"
 * is a designed specimen UI.
 */

const CURSORS = [
  { id: 'a', label: 'Layout', color: '#e2493f', x: 8, y: 12 },
  { id: 'b', label: 'Type', color: '#1d4ed8', x: 72, y: 18 },
  { id: 'c', label: 'Color', color: '#e39a1c', x: 18, y: 74 },
  { id: 'd', label: 'Media', color: '#3a7d44', x: 84, y: 70 },
  { id: 'e', label: 'Guide', color: '#7c3aed', x: 52, y: 8 },
];

export default function ReconstructionStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 300),   // blueprint
      window.setTimeout(() => setPhase(2), 1100),  // blank
      window.setTimeout(() => setPhase(3), 1700),  // rulers
      window.setTimeout(() => setPhase(4), 2300),  // rects
      window.setTimeout(() => setPhase(5), 3200),  // text
      window.setTimeout(() => setPhase(6), 4400),  // media
      window.setTimeout(() => setPhase(7), 5300),  // complete
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [replayKey]);

  const replay = () => {
    setPhase(0);
    setReplayKey((k) => k + 1);
  };

  return (
    <div className="reconstruction" ref={stageRef} data-phase={phase}>
      <div className="reconstruction-topbar">
        <span className="reconstruction-status">
          <span className="status-dot" aria-hidden="true" />
          {phase < 7 ? `Rebuilding · step ${phase}/7` : 'UI reconstructed'}
        </span>
        <button type="button" className="replay-button" onClick={replay}>
          Replay
        </button>
      </div>

      <div className="reconstruction-canvas" aria-label="Virtual cursors reconstructing a Pokémon Center-inspired design interface">
        {/* Blueprint ghost — visible only at step 1 */}
        <div className="blueprint" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className={`blueprint-layer bp-${i}`} />
          ))}
        </div>

        {/* Rulers and guides */}
        <div className="ruler ruler-h" aria-hidden="true"><span>0</span><span>240</span><span>480</span><span>720</span></div>
        <div className="ruler ruler-v" aria-hidden="true"><span>0</span><span>160</span><span>320</span></div>
        <div className="guide guide-h" aria-hidden="true"><span>64</span></div>
        <div className="guide guide-v" aria-hidden="true"><span>128</span></div>

        {/* Reconstructed specimen UI — a Pokémon Center-inspired design station */}
        <div className="center-ui">
          <div className="center-sky" aria-hidden="true">
            <span className="center-roof" />
            <span className="center-beacon"><i /></span>
            <span className="center-orb"><i /></span>
          </div>
          <div className="center-glass" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </div>
          <div className="center-body">
            <div className="center-sign">
              <span className="center-kicker">Color specimen / 039</span>
              <h3>Design Center</h3>
              <p>One sentence → one palette → one interface.</p>
            </div>
            <div className="center-door">
              <span className="center-door-orb" />
              <span className="center-door-line" />
            </div>
          </div>
          <div className="ui-swatches">
            {['#ffaca4', '#e67383', '#ec5f6d', '#dd4655', '#ffffff', '#1785b5'].map((c, i) => (
              <span key={c} style={{ background: c, animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
          <div className="ui-footerline">Generated with pokemon_palette + design_skill</div>
        </div>

        {/* Measurement / annotation chrome */}
        <div className="measure measure-one" aria-hidden="true">240 × 128</div>
        <div className="measure measure-two" aria-hidden="true">W 96 / H 96</div>
        <div className="crosshair crosshair-one" aria-hidden="true">+</div>
        <div className="crosshair crosshair-two" aria-hidden="true">+</div>
        <div className="selection-box" aria-hidden="true"><i /><i /><i /><i /></div>

        {/* Swarm cursors */}
        <div className="cursor-swarm" aria-hidden="true">
          {CURSORS.map((c, i) => (
            <div
              key={c.id}
              className={`virtual-cursor cursor-${c.id}`}
              style={{
                '--cursor-color': c.color,
                '--x': `${c.x}%`,
                '--y': `${c.y}%`,
                '--delay': `${i * 90}ms`,
              } as React.CSSProperties}
            >
              <svg viewBox="0 0 20 24" width="18" height="22">
                <path d="M2 1.5L17.5 12.4L10.4 13.2L7.2 21.5L2 1.5Z" fill="var(--cursor-color)" stroke="white" strokeWidth="1.4" />
              </svg>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reconstruction-caption">
        <span>01 DOM blueprint</span>
        <span>02 Blank canvas</span>
        <span>03 Cursors rebuild</span>
        <span>04 Design Center</span>
      </div>
    </div>
  );
}
