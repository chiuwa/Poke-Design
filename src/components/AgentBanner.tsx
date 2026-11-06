import { useState } from 'react';
import { pokemonIndex } from '../lib/pokemon';
import type { PokemonMetadata } from '../lib/types';
import GeneratedPreview from './generated/GeneratedPreview';

const TABS = [
  {
    id: 'codex',
    label: 'Codex',
    kicker: 'CLI / desktop / IDE',
    steps: [
      'Add the local relay to ~/.codex/config.toml',
      'Restart Codex, then keep this page open in your browser',
      'Ask: “Use pokemon_palette + design_skill to design a landing page with Jigglypuff and Apple Design.”',
    ],
    code: `[mcp_servers.poke-palette-atelier]\ncommand = "npx"\nargs = ["-y", "@mcp-b/webmcp-local-relay@latest"]`,
    note: 'Codex shares this MCP config across CLI, desktop app and IDE extension.',
  },
  {
    id: 'claude-code',
    label: 'Claude Code',
    kicker: 'CLI',
    steps: [
      'Run the command below in your terminal',
      'Open this site and confirm the relay lists it as a source',
      'Ask Claude Code to combine pokemon_palette with design_skill',
    ],
    code: `claude mcp add --transport stdio poke-palette-atelier -- npx -y @mcp-b/webmcp-local-relay@latest`,
    note: 'Use /mcp inside Claude Code to verify the connection.',
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    kicker: 'mcpServers JSON',
    steps: [
      'Open Settings → Developer → Edit Config',
      'Add the relay to mcpServers and restart Claude Desktop',
      'Open this site, then ask your agent to list tools',
    ],
    code: `{
  "mcpServers": {
    "poke-palette-atelier": {
      "command": "npx",
      "args": ["-y", "@mcp-b/webmcp-local-relay@latest"]
    }
  }
}`,
    note: 'Works with Claude Desktop, Cursor, Windsurf and other stdio MCP clients.',
  },
  {
    id: 'chrome',
    label: 'Chrome agent',
    kicker: 'Native WebMCP / extension',
    steps: [
      'Use Chrome 155+ with WebMCP enabled, or the Model Context Tool Inspector extension',
      'Open this page and let the browser discover document.modelContext',
      'Ask the in-browser agent to call pokemon_palette + design_skill',
    ],
    code: `document.modelContext.getTools()\n// list_pokemon, pokemon_palette,\n// design_skill, design_brief`,
    note: 'No relay needed for browser-native agents. The tools live in this tab.',
  },
];

export default function AgentBanner() {
  const [active, setActive] = useState('codex');
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [promptRun, setPromptRun] = useState(0);
  const [isBuildingSample, setIsBuildingSample] = useState(false);

  const examplePokemon =
    pokemonIndex.find((p) => p.name.toLowerCase() === 'jigglypuff') ??
    pokemonIndex[0] as PokemonMetadata;
  const prompt = `Use the ${examplePokemon.name} color palette from pokemon_palette, apply the Apple Design skill from design_skill, and generate a complete landing page. Return DESIGN.md + CSS variables + a React component.`;

  const runPrompt = () => {
    setPromptRun((n) => n + 1);
    setIsBuildingSample(true);
    window.setTimeout(() => setIsBuildingSample(false), 5800);
  };

  const copy = async (value: string, which: 'code' | 'prompt') => {
    try {
      await navigator.clipboard.writeText(value);
      if (which === 'code') {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      } else {
        setCopiedPrompt(true);
        window.setTimeout(() => setCopiedPrompt(false), 1400);
      }
    } catch {
      // Clipboard may be unavailable over non-secure origins; text remains selectable.
    }
  };

  return (
    <section className="agent-banner" id="connect">
      <div className="section-index">01 / Connect your agent</div>
      <div className="agent-banner-grid">
        <div className="agent-banner-intro">
          <p className="eyebrow">WebMCP · local relay · browser native</p>
          <h2>One sentence in your agent.<br />A complete design system out.</h2>
          <p className="agent-banner-copy">
            This page publishes structured tools through WebMCP. Your agent reads a
            <code> pokemon_palette</code>, mixes it with a <code>design_skill</code>,
            and turns that into UI — no screenshots, no copy-pasting hex values.
          </p>
          <div className="prompt-showcase">
            <div className="prompt-block">
              <span className="prompt-label">One-sentence prompt</span>
              <button type="button" className={`run-prompt${isBuildingSample ? ' is-building' : ''}`} onClick={runPrompt}>
                {isBuildingSample ? 'Running...' : 'Try this prompt'}
              </button>
              <p>{prompt}</p>
              <button type="button" className="copy-prompt" onClick={() => copy(prompt, 'prompt')}>
                {copiedPrompt ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
          </div>
        </div>

        <div className="agent-setup">
          <div className="agent-tabs" role="tablist" aria-label="Agent setup">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === active}
                className={t.id === active ? 'active' : ''}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="agent-panel" role="tabpanel">
            <div className="agent-panel-head">
              <span>{tab.kicker}</span>
              <span className="relay-state"><i /> Relay embed active</span>
            </div>
            <ol className="setup-steps">
              {tab.steps.map((s, i) => (
                <li key={s}><span>{String(i + 1).padStart(2, '0')}</span>{s}</li>
              ))}
            </ol>
            <div className="code-block">
              <button type="button" onClick={() => copy(tab.code, 'code')} aria-label="Copy setup code">
                {copied ? '✓' : 'Copy'}
              </button>
              <pre>{tab.code}</pre>
            </div>
            <p className="agent-note">{tab.note}</p>
          </div>
        </div>

        <div className="prompt-result-wrap">
          <div className="prompt-result-label">
            <span>Actual generated sample</span>
            <span>WebMCP → React</span>
          </div>
          <GeneratedPreview runId={promptRun} />
        </div>
      </div>
    </section>
  );
}
