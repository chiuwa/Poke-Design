import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './GeneratedPreview.css';
import JigglypuffSaasIndex from './JigglypuffSaasIndex';

type GeneratedPreviewProps = {
  runId: number;
};

const BUILD_CURSORS = [
  { id: 'a', label: 'DOM', color: '#e2493f', x: '8%', y: '12%' },
  { id: 'b', label: 'Type', color: '#2649a8', x: '76%', y: '18%' },
  { id: 'c', label: 'Color', color: '#d59a1a', x: '18%', y: '76%' },
  { id: 'd', label: 'Motion', color: '#2f6b4f', x: '84%', y: '68%' },
  { id: 'e', label: 'Tokens', color: '#6d4aa5', x: '52%', y: '8%' },
];

const SOURCE_WIDTH = 1180;
const SOURCE_HEIGHT = 760;
const MOBILE_SOURCE_WIDTH = 780;
const MOBILE_SOURCE_HEIGHT = 1160;

const PHASE_LABELS = [
  'Prompt received',
  'DOM blueprint',
  'Blank canvas',
  'Rulers and cursors',
  'Navigation and type',
  'Workspace rebuilt',
  'Palette and details',
  'UI reconstructed',
];

export default function GeneratedPreview({ runId }: GeneratedPreviewProps) {
  const [phase, setPhase] = useState(7);
  const [internalRun, setInternalRun] = useState(0);
  const [scale, setScale] = useState(0.42);
  const [source, setSource] = useState({ width: SOURCE_WIDTH, height: SOURCE_HEIGHT, mobile: false });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const runToken = runId + internalRun;

  useEffect(() => {
    if (runToken === 0) return;
    setPhase(0);
    const delays = [260, 900, 1500, 2100, 3100, 4300, 5500];
    const timers = delays.map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );
    return () => timers.forEach(window.clearTimeout);
  }, [runToken]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const updateScale = () => {
      const width = element.clientWidth;
      const mobile = width <= 720;
      const sourceWidth = mobile ? MOBILE_SOURCE_WIDTH : SOURCE_WIDTH;
      const sourceHeight = mobile ? MOBILE_SOURCE_HEIGHT : SOURCE_HEIGHT;
      setSource({ width: sourceWidth, height: sourceHeight, mobile });
      setScale(width / sourceWidth);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const replay = () => {
    setInternalRun((k) => k + 1);
  };
  const isBuilding = runToken > 0 && phase < 7;
  const status = isBuilding
    ? `Rebuilding · step ${phase}/7`
    : runToken > 0
      ? 'UI reconstructed'
      : 'Generated specimen / ready to rebuild';

  return (
    <div
      className="generated-result"
      data-build-phase={phase}
      aria-label="Generated SaaS index page sample with virtual-cursor rebuild"
    >
      <div className="generated-result-head">
        <span className="gp-status" aria-live="polite">
          <i className={isBuilding ? 'pulsing' : ''} aria-hidden="true" />
          {status}
        </span>
        <span className="gp-head-right">
          <span className="gp-source">Jigglypuff × Apple Design</span>
          <button type="button" className="gp-replay" onClick={replay}>Replay</button>
        </span>
      </div>

      <div className="generated-result-window">
        <div className="generated-window-chrome" aria-hidden="true">
          <i /><i /><i />
          <span>localhost:5173 / generated-index</span>
          <b>React</b>
        </div>

        <div
          className="generated-result-scroll"
          ref={scrollRef}
          style={{ height: `${Math.round(source.height * scale)}px` }}
        >
          <div className="gp-blueprint" aria-hidden="true">
            <span className="gp-bp gp-bp-nav" />
            <span className="gp-bp gp-bp-hero" />
            <span className="gp-bp gp-bp-product" />
            <span className="gp-bp gp-bp-metrics" />
            <span className="gp-bp gp-bp-palette" />
          </div>

          <div className="gp-cleaner" aria-hidden="true" />

          <div className="gp-ruler gp-ruler-h" aria-hidden="true"><span>0</span><span>320</span><span>640</span><span>960</span></div>
          <div className="gp-ruler gp-ruler-v" aria-hidden="true"><span>0</span><span>240</span><span>480</span><span>720</span></div>
          <div className="gp-guide gp-guide-h" aria-hidden="true"><span>64</span></div>
          <div className="gp-guide gp-guide-v" aria-hidden="true"><span>128</span></div>
          <div className="gp-measure gp-measure-one" aria-hidden="true">1180 × 760</div>
          <div className="gp-measure gp-measure-two" aria-hidden="true">W 560 / H 390</div>
          <div className="gp-crosshair gp-crosshair-one" aria-hidden="true">+</div>
          <div className="gp-crosshair gp-crosshair-two" aria-hidden="true">+</div>
          <div className="gp-selection" aria-hidden="true"><i /><i /><i /><i /></div>

          <div className={`generated-result-scale${source.mobile ? ' mobile' : ''}`} style={{ transform: `scale(${scale})` }}>
            <JigglypuffSaasIndex />
          </div>

          <div className="gp-cursor-swarm" aria-hidden="true">
            {BUILD_CURSORS.map((cursor, index) => (
              <div
                key={cursor.id}
                className={`gp-cursor gp-cursor-${cursor.id}`}
                style={{
                  '--gp-cursor-color': cursor.color,
                  '--gx': cursor.x,
                  '--gy': cursor.y,
                  '--gdelay': `${index * 80}ms`,
                } as CSSProperties}
              >
                <svg viewBox="0 0 20 24" width="16" height="20">
                  <path d="M2 1.5L17.5 12.4L10.4 13.2L7.2 21.5L2 1.5Z" fill="var(--gp-cursor-color)" stroke="white" strokeWidth="1.4" />
                </svg>
                <span>{cursor.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="generated-build-caption" aria-label={PHASE_LABELS[phase]}>
        <span className={phase >= 1 ? 'active' : ''}>01 DOM blueprint</span>
        <span className={phase >= 4 ? 'active' : ''}>02 Tokens + type</span>
        <span className={phase >= 5 ? 'active' : ''}>03 Cursors rebuild</span>
        <span className={phase >= 7 ? 'active' : ''}>04 Generated UI</span>
      </div>

      <div className="generated-result-foot">
        <span>DESIGN.md</span>
        <span>CSS variables</span>
        <span>React component</span>
        <em>6 palette tokens</em>
      </div>
    </div>
  );
}
