import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SiteEngine } from './engine.js';
import { BLOCKS, CFG } from './data.js';
import { FG } from './components/ui.js';
import Background from './components/Background.jsx';
import Header from './components/Header.jsx';
import Composer from './components/Composer.jsx';
import { Block } from './components/cards.jsx';
import { buildMessages } from './chat/messages.js';
import { streamChat } from './chat/client.js';

export default function App() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const idRef = useRef(0);

  const [live, setLive] = useState([]); // { id, role, text } appended below the preloaded feed
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const engine = new SiteEngine(CFG);
    engineRef.current = engine;
    engine.mount(rootRef.current);
    return () => { engine.destroy(); engineRef.current = null; };
  }, []);

  // Nudge to the newest message when a turn is added (not on every stream tick).
  useEffect(() => {
    if (live.length) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [live.length]);

  const onJump = (type) => engineRef.current && engineRef.current.jumpToType(type);

  const send = useCallback(async (text) => {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);

    const userId = ++idRef.current;
    const asstId = ++idRef.current;
    setLive((prev) => [
      ...prev,
      { id: userId, role: 'user', text: q },
      { id: asstId, role: 'assistant', text: '' },
    ]);

    // `live` (closure) holds the turns completed before this one — exactly the
    // history to send alongside the preloaded feed and the new question.
    const messages = buildMessages(live, q);
    try {
      await streamChat(messages, {
        onDelta: (chunk) =>
          setLive((prev) => prev.map((m) => (m.id === asstId ? { ...m, text: m.text + chunk } : m))),
      });
    } catch (e) {
      setLive((prev) =>
        prev.map((m) => (m.id === asstId ? { ...m, text: `_Something went wrong: ${e.message}_` } : m)));
    } finally {
      setBusy(false);
    }
  }, [busy, live]);

  return (
    <div ref={rootRef} style={{
      position: 'relative', minHeight: '100vh',
      background: 'radial-gradient(125% 95% at 76% -6%, #15181e 0%, #0a0b0d 58%)', fontFamily: FG,
    }}>
      <Background />
      <Header />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '86px 22px 168px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        {BLOCKS.map((block, i) => <Block key={i} block={block} />)}
        {live.map((m) => <Block key={m.id} block={{ type: m.role, text: m.text }} live />)}
      </div>

      <Composer onJump={onJump} onSend={send} busy={busy} />
    </div>
  );
}
