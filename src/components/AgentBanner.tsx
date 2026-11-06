import { useEffect, useRef, useState } from 'react';
import { pokemonIndex } from '../lib/pokemon';
import type { PokemonMetadata } from '../lib/types';
import GeneratedPreview from './generated/GeneratedPreview';

const TOOL_CALLS = [
  { name: 'pokemon_palette', meta: 'Jigglypuff · 6 tokens' },
  { name: 'design_skill', meta: 'Apple Design · type / motion / material' },
  { name: 'design_brief', meta: 'CSS tokens + layout + contrast' },
];

export default function AgentBanner() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [promptRun, setPromptRun] = useState(0);
  const [isBuildingSample, setIsBuildingSample] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const examplePokemon =
    pokemonIndex.find((p) => p.name.toLowerCase() === 'jigglypuff') ??
    pokemonIndex[0] as PokemonMetadata;

  const prompt = `Use the ${examplePokemon.name} palette from pokemon_palette, apply Apple Design from design_skill, and draft a landing page. Return DESIGN.md, CSS tokens and a React component.`;
  const siteUrl = typeof window === 'undefined'
    ? 'https://your-domain.example/'
    : window.location.href.split('#')[0];

  const runPrompt = () => {
    setHasResult(true);
    setPromptRun((n) => n + 1);
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };

  useEffect(() => {
    if (promptRun === 0) return;
    setIsBuildingSample(true);
    const timer = window.setTimeout(() => setIsBuildingSample(false), 5800);
    return () => window.clearTimeout(timer);
  }, [promptRun]);

  const copy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1400);
    } catch {
      // Clipboard may be unavailable over non-secure origins; text remains selectable.
    }
  };

  return (
    <section className="agent-banner" id="connect">
      <div className="section-index">01 / Studio</div>
      <div className="agent-banner-grid">
        <div className="agent-banner-intro">
          <p className="eyebrow">WebMCP · one URL · four tools</p>
          <h2>Color, skill,<br />one working brief.</h2>
          <p className="agent-banner-copy">
            A palette gives the color. A design skill gives the judgment.
            An assistant combines both into a considered interface.
          </p>

          <div className="prompt-showcase">
            <div className="prompt-block">
              <div className="prompt-block-head">
                <span className="prompt-label">Studio prompt</span>
                <button type="button" className={`run-prompt${isBuildingSample ? ' is-building' : ''}`} onClick={runPrompt}>
                  {isBuildingSample ? 'Running...' : hasResult ? 'Rebuild sample' : 'Try this prompt'}
                </button>
              </div>
              <p>{prompt}</p>
              <div className="prompt-block-foot">
                <span>pokemon_palette + design_skill</span>
                <button type="button" className="copy-prompt" onClick={() => copy(prompt, 'prompt')}>
                  {copiedField === 'prompt' ? 'Copied' : 'Copy prompt'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="agent-console" aria-label="Generic WebMCP assistant example">
          <div className="agent-console-bar">
            <span><i /> Assistant / WebMCP</span>
            <span>Connected</span>
          </div>
          <div className="agent-url-field">
            <small>Source URL</small>
            <div>
              <code>{siteUrl}</code>
              <button type="button" onClick={() => copy(siteUrl, 'url')}>
                {copiedField === 'url' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="agent-thread">
            <div className="agent-message user">
              <span>You</span>
              <p>Jigglypuff palette + Apple Design, made into a landing page.</p>
            </div>
            <div className="agent-tool-list">
              {TOOL_CALLS.map((tool, index) => (
                <div className="agent-tool-call" key={tool.name}>
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  <code>{tool.name}</code>
                  <span>{tool.meta}</span>
                </div>
              ))}
            </div>
            <div className="agent-message assistant">
              <span>Assistant</span>
              <p>Palette, skill and interface spec are ready.</p>
            </div>
          </div>
          <div className="agent-console-foot">
            <span>Open this URL in a WebMCP-enabled browser, or attach it to a local relay.</span>
            <code>document.modelContext</code>
          </div>
        </aside>

        {hasResult && (
          <div className="prompt-result-wrap" ref={resultRef}>
            <div className="prompt-result-label">
              <span>Result</span>
              <span>WebMCP → React</span>
            </div>
            <GeneratedPreview runId={promptRun} />
          </div>
        )}
      </div>
    </section>
  );
}