import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSiteEngine } from './engine';
import { BLOCKS } from './data/prompts';
import { CFG } from './data/theme';
import { FG } from './components/primitives/theme';
import Background from './components/layout/Background';
import Header from './components/layout/Header';
import Composer from './components/chat/Composer';
import { Block } from './components/feed/Cards';
import ChatBubble from './components/chat/ChatBubble';
import { buildMessages } from './chat/history';
import { streamChat } from './chat/client';
import type { LiveTurn } from './types/chat';
import type { BlockType } from './types/blocks';
import type { BreakPillStatus, EngineHandle, GameStatus } from './types/engine';

const BLOCK_ORDER: readonly BlockType[] = BLOCKS.map((b) => b.type);
const DEFAULT_BREAK_STATUS: BreakPillStatus = { canShow: true, label: 'Take a break' };
const DEFAULT_GAME_STATUS: GameStatus = { phase: null, score: 0, best: 0, newBest: false, countdownLabel: null };

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  const idRef = useRef(0);

  const [live, setLive] = useState<LiveTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [breakStatus, setBreakStatus] = useState<BreakPillStatus>(DEFAULT_BREAK_STATUS);
  const [gameStatus, setGameStatus] = useState<GameStatus>(DEFAULT_GAME_STATUS);

  useEffect(() => {
    const engine = createSiteEngine(CFG, BLOCK_ORDER);
    engineRef.current = engine;
    const unsubscribeBreakStatus = engine.onBreakStatusChange(setBreakStatus);
    const unsubscribeGameStatus = engine.onGameStatusChange(setGameStatus);
    if (rootRef.current) engine.mount(rootRef.current);
    return () => { unsubscribeBreakStatus(); unsubscribeGameStatus(); engine.destroy(); engineRef.current = null; };
  }, []);

  // Nudge to the newest message when a turn is added (not on every stream tick).
  useEffect(() => {
    if (live.length) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [live.length]);

  const onJump = (type: BlockType) => engineRef.current?.jumpToType(type);

  const onBreakPillClick = useCallback((origin: { x: number; y: number }) => {
    engineRef.current?.triggerBreakPill(origin);
  }, []);

  const onRestartGame = useCallback(() => engineRef.current?.restartGame(), []);
  const onQuitGame = useCallback(() => engineRef.current?.quitGame(), []);

  // Lets live bubbles hand their DOM node to the engine so they behave like the
  // preloaded blocks (reveal, shine, konami/game fly-away). Stable identity.
  const register = useMemo(() => ({
    add: (el: HTMLElement | null) => engineRef.current?.addBubble(el),
    remove: (el: HTMLElement | null) => engineRef.current?.removeBubble(el),
  }), []);

  const send = useCallback(async (text: string) => {
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
      const message = e instanceof Error ? e.message : String(e);
      setLive((prev) =>
        prev.map((m) => (m.id === asstId ? { ...m, text: `_Something went wrong: ${message}_` } : m)));
    } finally {
      setBusy(false);
    }
  }, [busy, live]);

  return (
    <div ref={rootRef} style={{
      position: 'relative', minHeight: '100vh',
      background: 'radial-gradient(125% 95% at 76% -6%, #15181e 0%, #0a0b0d 58%)', fontFamily: FG,
    }}>
      <Background gameStatus={gameStatus} onRestartGame={onRestartGame} onQuitGame={onQuitGame} />
      <Header />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '86px 22px 168px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        {BLOCKS.map((block, i) =>
          block.type === 'user' || block.type === 'assistant'
            ? <ChatBubble key={i} role={block.type} text={block.text} />
            : <Block key={i} block={block} />
        )}
        {live.map((m) => <ChatBubble key={m.id} role={m.role} text={m.text} live register={register} />)}
      </div>

      <Composer
        onJump={onJump}
        onSend={send}
        busy={busy}
        breakLabel={breakStatus.label}
        breakCanShow={breakStatus.canShow}
        onBreakPillClick={onBreakPillClick}
      />
    </div>
  );
}
