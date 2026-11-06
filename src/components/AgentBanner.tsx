import { useEffect, useState } from 'react';
import { pokemonIndex } from '../lib/pokemon';
import type { PokemonMetadata } from '../lib/types';
import GeneratedPreview from './generated/GeneratedPreview';

const PALETTE_TOKENS = [
  { hex: '#ffaca4', name: 'blush' },
  { hex: '#e67383', name: 'rose' },
  { hex: '#ec5f6d', name: 'coral' },
  { hex: '#dd4655', name: 'deep' },
  { hex: '#ffffff', name: 'paper' },
  { hex: '#1785b5', name: 'cool' },
];

const TOOL_CALLS = [
  { name: 'pokemon_palette', meta: '6 color tokens' },
  { name: 'design_skill', meta: 'Apple Design · type / motion / material' },
  { name: 'design_brief', meta: 'CSS tokens + layout + contrast' },
];

export default function AgentBanner() {
  const [copied, setCopied] = useState(false);
  const [promptRun, setPromptRun] = useState(0);
  const [hasResult, setHasResult] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const examplePokemon =
    pokemonIndex.find((p) => p.name.toLowerCase() === 'jigglypuff') ??
    pokemonIndex[0] as PokemonMetadata;

  const prompt = `Use the ${examplePokemon.name} color palette (${PALETTE_TOKENS.map((t) => t.hex).join(', ')}) from pokemon_palette, then apply a design_skill and draft a landing page. Return DESIGN.md, CSS tokens and a React component.`;
  const siteUrl = typeof window === 'undefined'
    ? 'https://your-domain.example/'
    : window.location.href.split('#')[0];

  const sendPrompt = () => {
    setHasResult(true);
    setPromptRun((n) => n + 1);
  };

  useEffect(() => {
    if (promptRun === 0) return;
    setIsBuilding(true);
    const timer = window.setTimeout(() => setIsBuilding(false), 5800);
    return () => window.clearTimeout(timer);
  }, [promptRun]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Text remains selectable if clipboard access is unavailable.
    }
  };

  return (
    <section className="agent-banner" id="connect">
      <div className="section-index">01 / Studio</div>

      <div className="agent-workspace">
        <div className="agent-window-bar">
          <span className="agent-window-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>chatgpt.com / Poke Design</span>
          <span className="agent-window-state"><i /> WebMCP connected</span>
        </div>

        <div className="agent-workspace-grid">
          <section className="agent-chat" aria-label="Assistant conversation">
            <div className="agent-rail" aria-hidden="true">
              <i>＋</i><i>⌕</i><i>◇</i><i>◎</i>
            </div>

            <div className="agent-chat-body">
              <div className="agent-source-line">
                <small>Source URL</small>
                <code>{siteUrl}</code>
              </div>

              <div className="agent-bubble user">
                <span className="agent-role">You</span>
                {hasResult ? (
                  <p>
                    Use the {examplePokemon.name} color palette{' '}
                    <span className="hex-inline">
                      {PALETTE_TOKENS.map((token) => (
                        <span key={token.hex} title={token.name}>
                          <i style={{ background: token.hex }} />
                          {token.hex}
                        </span>
                      ))}
                    </span>{' '}
                    from <code>pokemon_palette</code>, then apply a <code>design_skill</code> and draft a landing page.
                  </p>
                ) : (
                  <p className="agent-empty-hint">Send the studio prompt to build the interface in the display pane.</p>
                )}
              </div>

              {hasResult && (
                <>
                  <div className="agent-status-line">
                    <i className={isBuilding ? 'pulsing' : ''} />
                    {isBuilding ? 'Worked for 5.8s · rebuilding interface' : 'Interface ready'}
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
                  <div className="agent-bubble assistant">
                    <span className="agent-role">Assistant</span>
                    <p>Palette, skill and interface spec are ready. The display pane shows the rebuilt UI.</p>
                  </div>
                </>
              )}
            </div>

            <div className="agent-composer">
              <div className="agent-composer-text">
                <span className="composer-kicker">Studio prompt</span>
                <p>
                  Use the {examplePokemon.name} color palette{' '}
                  <span className="hex-inline">
                    {PALETTE_TOKENS.map((token) => (
                      <span key={token.hex} title={token.name}>
                        <i style={{ background: token.hex }} />
                        {token.hex}
                      </span>
                    ))}
                  </span>{' '}
                  from <code>pokemon_palette</code>, then apply a <code>design_skill</code> and draft a landing page.
                  Return <code>DESIGN.md</code>, CSS tokens and a React component.
                </p>
              </div>
              <div className="agent-composer-actions">
                <button type="button" className="composer-copy" onClick={copyPrompt}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button type="button" className="composer-send" onClick={sendPrompt} aria-label="Send studio prompt">
                  {isBuilding ? 'Working' : hasResult ? 'Rebuild' : 'Send'} <b>↑</b>
                </button>
              </div>
            </div>
          </section>

          <section className="agent-artifact" aria-label="Generated interface display pane">
            <div className="agent-artifact-bar">
              <span>Puffbase / interface</span>
              <span>Generated specimen</span>
            </div>
            <div className="agent-artifact-body">
              {hasResult ? (
                <GeneratedPreview runId={promptRun} compact />
              ) : (
                <div className="agent-artifact-empty">
                  <div className="artifact-empty-frame" aria-hidden="true">
                    <i /><i /><i /><i />
                  </div>
                  <p>Send the prompt to see the interface rebuilt here.</p>
                  <span>Virtual cursors · palette tokens · React UI</span>
                </div>
              )}
            </div>
            <div className="agent-artifact-foot">
              <span>WebMCP → React</span>
              <code>document.modelContext</code>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}