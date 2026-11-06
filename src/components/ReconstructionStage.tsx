import { useEffect, useRef, useState } from 'react';

/**
 * ReconstructionStage
 * --------------------
 * Virtual cursors rebuild a Pokémon Center-inspired design station from a
 * DOM blueprint: snapshot -> blank -> rulers -> structure -> emblem -> glass
 * -> entrance -> palette tokens -> finished specimen.
 *
 * The building is an inline SVG so its proportions stay precise at any size.
 * Each <g> is an independent reconstruction layer driven by data-phase.
 */

const CURSORS = [
  { id: 'a', label: 'Layout', color: '#e2493f', x: 8, y: 12 },
  { id: 'b', label: 'Type', color: '#2649a8', x: 72, y: 18 },
  { id: 'c', label: 'Color', color: '#d59a1a', x: 18, y: 74 },
  { id: 'd', label: 'Media', color: '#2f6b4f', x: 84, y: 70 },
  { id: 'e', label: 'Guide', color: '#6d4aa5', x: 52, y: 8 },
];

const SWATCHES = ['#ffaca4', '#e67383', '#ec5f6d', '#dd4655', '#ffffff', '#1785b5'];

export default function ReconstructionStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 300),
      window.setTimeout(() => setPhase(2), 1100),
      window.setTimeout(() => setPhase(3), 1700),
      window.setTimeout(() => setPhase(4), 2300),
      window.setTimeout(() => setPhase(5), 3200),
      window.setTimeout(() => setPhase(6), 4400),
      window.setTimeout(() => setPhase(7), 5600),
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
        <button type="button" className="replay-button" onClick={replay}>Replay</button>
      </div>

      <div className="reconstruction-canvas" aria-label="Virtual cursors reconstructing a Pokemon Center-inspired design interface">
        <div className="blueprint" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className={`blueprint-layer bp-${i}`} />
          ))}
        </div>

        <div className="canvas-cleaner" aria-hidden="true" />

        <div className="ruler ruler-h" aria-hidden="true"><span>0</span><span>240</span><span>480</span><span>720</span></div>
        <div className="ruler ruler-v" aria-hidden="true"><span>0</span><span>160</span><span>320</span></div>
        <div className="guide guide-h" aria-hidden="true"><span>64</span></div>
        <div className="guide guide-v" aria-hidden="true"><span>128</span></div>

        <div className="center-ui-v2">
          <svg viewBox="40 54 640 390" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Pokemon Center-inspired facade reconstructed from a color palette">
            {/* editorial margin notes */}
            <g className="rc-layer rc-notes">
              <text x="24" y="26" className="svg-kicker">SPECIMEN 039 / JIGGLYPUFF</text>
              <text x="24" y="43" className="svg-note">One sentence → one palette → one interface.</text>
            </g>

            {/* foundation + wings + central block */}
            <g className="rc-layer rc-base">
              <rect x="52" y="384" width="616" height="10" fill="#e9e3d8" stroke="#2a241d" strokeWidth="1.5" />
              <rect x="68" y="258" width="180" height="126" fill="#f7f2e8" stroke="#2a241d" strokeWidth="2" />
              <rect x="472" y="258" width="180" height="126" fill="#f7f2e8" stroke="#2a241d" strokeWidth="2" />
              <rect x="60" y="246" width="196" height="14" rx="2" fill="#c23b2b" stroke="#2a241d" strokeWidth="2" />
              <rect x="464" y="246" width="196" height="14" rx="2" fill="#c23b2b" stroke="#2a241d" strokeWidth="2" />
              <rect x="60" y="260" width="196" height="4" fill="#faf8f2" />
              <rect x="464" y="260" width="196" height="4" fill="#faf8f2" />
              <rect x="228" y="196" width="264" height="188" fill="#faf8f2" stroke="#2a241d" strokeWidth="2" />
              <rect x="228" y="308" width="16" height="76" fill="#efe6d6" stroke="#2a241d" strokeWidth="1.5" />
              <rect x="476" y="308" width="16" height="76" fill="#efe6d6" stroke="#2a241d" strokeWidth="1.5" />
            </g>

            {/* side wing roofs — closer to the reference architecture */}
            <g className="rc-layer rc-roof">
              <path d="M60 250 C64 218 92 204 132 204 L232 204 L232 250 Z" fill="#c23b2b" stroke="#2a241d" strokeWidth="2" />
              <path d="M660 250 C656 218 628 204 588 204 L488 204 L488 250 Z" fill="#c23b2b" stroke="#2a241d" strokeWidth="2" />
              <path d="M132 250 C142 148 244 96 360 96 C476 96 578 148 588 250 Z" fill="#c23b2b" stroke="#2a241d" strokeWidth="2.5" />
              <path d="M170 230 C186 160 264 120 360 120 C456 120 534 160 550 230" fill="none" stroke="#f7e5da" strokeWidth="9" strokeLinecap="round" opacity="0.95" />
              <path d="M132 250 L588 250 L588 262 L132 262 Z" fill="#1a1814" />
              <rect x="132" y="262" width="456" height="5" fill="#8d2a20" />
            </g>

            {/* one ball emblem only, centered lower on the roof */}
            <g className="rc-layer rc-emblem">
              <circle cx="360" cy="205" r="26" fill="#faf8f2" stroke="#2a241d" strokeWidth="2.8" />
              <path d="M334 205 A26 26 0 0 1 386 205 Z" fill="#c23b2b" />
              <path d="M334 205 A26 26 0 0 1 386 205" fill="none" stroke="#2a241d" strokeWidth="2.8" />
              <rect x="334" y="201" width="52" height="8" fill="#1a1814" />
              <circle cx="360" cy="205" r="8.5" fill="#faf8f2" stroke="#2a241d" strokeWidth="2.4" />
              <ellipse cx="348" cy="193" rx="7.5" ry="3.6" fill="#ffffff" opacity="0.85" />
            </g>

            {/* teal glass — properly inset under the roof, not full-bleed */}
            <g className="rc-layer rc-glass">
              <rect x="246" y="266" width="228" height="40" fill="#1785b5" stroke="#2a241d" strokeWidth="2" />
              <rect x="250" y="270" width="220" height="6" fill="#ffffff" opacity="0.3" />
              {[1, 2, 3, 4, 5].map((i) => (
                <line key={`c${i}`} x1={246 + 38 * i} y1="266" x2={246 + 38 * i} y2="306" stroke="#2a241d" strokeWidth="1.5" />
              ))}
              <rect x="84" y="278" width="148" height="86" fill="#1785b5" stroke="#2a241d" strokeWidth="2" />
              <rect x="488" y="278" width="148" height="86" fill="#1785b5" stroke="#2a241d" strokeWidth="2" />
              <rect x="88" y="282" width="140" height="6" fill="#ffffff" opacity="0.3" />
              <rect x="492" y="282" width="140" height="6" fill="#ffffff" opacity="0.3" />
              {[1, 2, 3].map((i) => (
                <g key={`w${i}`}>
                  <line x1={84 + 37 * i} y1="278" x2={84 + 37 * i} y2="364" stroke="#2a241d" strokeWidth="1.5" />
                  <line x1={488 + 37 * i} y1="278" x2={488 + 37 * i} y2="364" stroke="#2a241d" strokeWidth="1.5" />
                </g>
              ))}
              <line x1="84" y1="322" x2="232" y2="322" stroke="#2a241d" strokeWidth="1.5" />
              <line x1="488" y1="322" x2="636" y2="322" stroke="#2a241d" strokeWidth="1.5" />
            </g>

            {/* central cylindrical entrance */}
            <g className="rc-layer rc-entrance">
              <path d="M306 296 C306 260 330 242 360 242 C390 242 414 260 414 296 Z" fill="#e67383" stroke="#2a241d" strokeWidth="2" />
              <path d="M316 290 C320 264 338 252 360 252" fill="none" stroke="#ffaca4" strokeWidth="7" strokeLinecap="round" />
              <rect x="306" y="296" width="108" height="88" fill="#ffaca4" stroke="#2a241d" strokeWidth="2" />
              <rect x="324" y="310" width="72" height="74" fill="#cfe9ef" stroke="#2a241d" strokeWidth="2" />
              <line x1="360" y1="310" x2="360" y2="384" stroke="#2a241d" strokeWidth="1.5" />
              <circle cx="360" cy="336" r="12" fill="#faf8f2" stroke="#2a241d" strokeWidth="2" />
              <circle cx="360" cy="336" r="4" fill="#1785b5" />
              <rect x="296" y="372" width="128" height="6" fill="#efe6d6" stroke="#2a241d" strokeWidth="1.2" />
              <rect x="286" y="378" width="148" height="6" fill="#e9e3d8" stroke="#2a241d" strokeWidth="1.2" />
            </g>

            {/* generated palette tokens + footer */}
            <g className="rc-layer rc-palette">
              <text x="52" y="406" className="svg-monotiny">PALETTE TOKENS / 6</text>
              {SWATCHES.map((c, i) => (
                <rect key={c + i} x={52 + i * 102.67} y="410" width="102.67" height="18" fill={c} stroke="#2a241d" strokeWidth="1" />
              ))}
            </g>
            <g className="rc-layer rc-footer">
              <text x="52" y="440" className="svg-monotiny">Generated with pokemon_palette + design_skill</text>
            </g>
          </svg>
        </div>

        <div className="measure measure-one" aria-hidden="true">240 × 128</div>
        <div className="measure measure-two" aria-hidden="true">W 96 / H 96</div>
        <div className="crosshair crosshair-one" aria-hidden="true">+</div>
        <div className="crosshair crosshair-two" aria-hidden="true">+</div>
        <div className="selection-box" aria-hidden="true"><i /><i /><i /><i /></div>

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
        <span>04 Generated UI</span>
      </div>
    </div>
  );
}
