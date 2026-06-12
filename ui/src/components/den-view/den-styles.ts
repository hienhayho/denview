export const DEN_CSS = `
* { box-sizing: border-box; }
:root {
  --bg: #fafaf9; --panel-border: #ebe8e0;
  --ink: #1a1815; --muted: #807a6f; --shadow-soft: rgba(20,18,14,0.05);
}
html, body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg); color: var(--ink); height: 100%; -webkit-font-smoothing: antialiased; }
.den-app { display: grid; grid-template-columns: 1fr; height: 100vh; overflow: hidden; }
.stage { position: relative; overflow: hidden; height: 100vh; background: var(--bg);
  background-image: radial-gradient(ellipse at 20% 0%, rgba(255,240,220,0.5), transparent 60%),
    radial-gradient(ellipse at 100% 30%, rgba(220,235,255,0.4), transparent 60%); }
.brand { position: absolute; top: 18px; left: 22px; z-index: 10; display: flex; align-items: center; gap: 10px; pointer-events: none; }
.brand-mark { width: 28px; height: 28px; border-radius: 7px; background: #14110d; display: grid; place-items: center; }
.brand-mark svg { width: 18px; height: 18px; }
.brand-name { font-weight: 600; letter-spacing: -0.01em; font-size: 14px; }
.brand-sub { font-size: 12px; color: var(--muted); margin-left: 6px; }
.task-badge { position: absolute; top: 18px; right: 22px; z-index: 10; display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; background: rgba(255,255,255,0.86); backdrop-filter: blur(8px);
  border: 1px solid var(--panel-border); border-radius: 999px; font-size: 11px; color: var(--muted); pointer-events: none; }
.task-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }
.task-badge-dot.done { background: #807a6f; }
.task-badge-dot.failed { background: #ef4444; }
.legend { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 10;
  display: flex; gap: 14px; padding: 8px 14px; background: rgba(255,255,255,0.86); backdrop-filter: blur(8px);
  border: 1px solid var(--panel-border); border-radius: 999px; font-size: 11px; color: var(--muted); pointer-events: none; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; vertical-align: -1px; }
.office-layout { display: grid; grid-template-columns: 248px 1fr; gap: 16px;
  padding: 60px 20px 60px; height: 100%; box-sizing: border-box; align-items: stretch; }
.shared { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; align-self: stretch; }
.area { position: relative; background: #fff; border-radius: 14px; border: 1px solid var(--panel-border);
  box-shadow: 0 8px 24px var(--shadow-soft); height: 210px; overflow: hidden; }
.area-label { position: absolute; top: 10px; left: 12px; font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--muted); z-index: 2; }
.floor { padding: 0; overflow-y: auto; align-self: stretch; }
.desk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px; align-content: start; padding-bottom: 60px; }
.cell { position: relative; aspect-ratio: 220 / 250; border-radius: 8px; cursor: pointer; transition: transform 160ms ease; }
.cell:hover { transform: translateY(-2px); }
.cell:hover .cell-name { opacity: 1; }
.cell-name { position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
  font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
  opacity: 0.55; transition: opacity 160ms ease; pointer-events: none; white-space: nowrap; }
.workstation { width: 100%; height: 100%; display: block; overflow: visible; }
@keyframes key-blink { 0%,100%{opacity:0.18}50%{opacity:1;fill:#ffe566} }
@keyframes head-bob { 0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)} }
@keyframes zzz-float { 0%{transform:translate(0,0) scale(0.8);opacity:0}20%{opacity:1}100%{transform:translate(6px,-16px) scale(1.1);opacity:0} }
@keyframes bubble-pop { 0%{transform:scale(0.4);opacity:0}20%{transform:scale(1.1);opacity:1}80%{transform:scale(1);opacity:1}100%{transform:scale(0.9);opacity:0} }
@keyframes screen-flicker { 0%,95%,100%{opacity:1}97%{opacity:0.7} }
@keyframes blink-caret { 0%,50%{opacity:1}51%,100%{opacity:0} }
@keyframes line-grow { from{transform:scaleX(0)}to{transform:scaleX(1)} }
@keyframes ball-roll { 0%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(8px,-2px) rotate(120deg)}50%{transform:translate(14px,0) rotate(240deg)}75%{transform:translate(8px,2px) rotate(360deg)}100%{transform:translate(0,0) rotate(480deg)} }
@keyframes stretch-up { 0%,100%{transform:translateY(0) scaleY(1)}40%,60%{transform:translateY(-3px) scaleY(1.05)} }
@keyframes spinner { to{transform:rotate(360deg)} }
@keyframes steam { 0%{opacity:0;transform:translateY(0) scaleX(0.6)}30%{opacity:0.7}100%{opacity:0;transform:translateY(-14px) scaleX(1.2)} }
@keyframes sway { 0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)} }
@keyframes phone-glow { 0%,100%{opacity:0.85}50%{opacity:1} }
@keyframes chart-bar { 0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.6)} }
@keyframes chat-bounce { 0%,100%{transform:translateY(0)}30%{transform:translateY(-1px)} }
@media (max-width: 900px) {
  .office-layout { grid-template-columns: 1fr; padding-top: 56px; }
  .shared { flex-direction: row; flex-wrap: wrap; }
  .area { height: 160px; flex: 1; min-width: 200px; }
  .desk-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
}
`
