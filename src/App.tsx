import { useCallback, useEffect, useRef } from 'react';
import styles from './App.module.css';
import Background from './components/layout/Background/Background';
import BottomBar from './components/layout/BottomBar/BottomBar';
import Header from './components/layout/Header/Header';
import { SECTIONS } from './content/site';
import ChatBubble from './features/chat/components/ChatBubble/ChatBubble';
import type { ChatTurn } from './features/chat/conversation/messages';
import { useLLMChat } from './features/chat/hooks/useLLMChat';
import { FOREGROUND_CONFIG } from './features/foreground/config';
import { useFlyAway } from './features/foreground/flyAway/useFlyAway';
import PageTransitionItem from './features/foreground/PageTransitionItem/PageTransitionItem';
import Game from './features/game/Game/Game';
import { useGameEngine } from './features/game/hooks/useGameEngine';
import { GAME_CONFIG } from './features/game/settings';
import { PORTFOLIO_CHAT_HISTORY } from './features/portfolio/chat/portfolioChatHistory';
import { Block } from './features/portfolio/components/cards/Block';

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { messages, isGeneratingResponse, sendMessage } = useLLMChat(PORTFOLIO_CHAT_HISTORY);
  const { golCanvasRef, burstCanvasRef, breakStatus, gameStatus, startOrResume, restartGame, quitGame } =
    useGameEngine(GAME_CONFIG);
  const { flyIn, flyOut } = useFlyAway(rootRef, FOREGROUND_CONFIG);

  useEffect(
    function restoreForegroundOutsideGame() {
      if (gameStatus.phase === null || gameStatus.phase === 'paused') flyIn();
    },
    [flyIn, gameStatus.phase],
  );

  useScrollToLatestMessage(messages, isGeneratingResponse);

  const onBreakPillClick = useCallback(
    function onBreakPillClick(origin: { x: number; y: number }) {
      flyOut(40);
      startOrResume(origin);
    },
    [flyOut, startOrResume],
  );

  return (
    <div ref={rootRef} className={styles.app}>
      <Background>
        <Game
          status={gameStatus}
          onRestart={restartGame}
          onQuit={quitGame}
          golCanvasRef={golCanvasRef}
          burstCanvasRef={burstCanvasRef}
        />
      </Background>
      <Header />

      <main className={styles.feed}>
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className={styles.section}>
            <PageTransitionItem config={FOREGROUND_CONFIG}>
              <ChatBubble speaker="user" text={section.prompt} />
            </PageTransitionItem>
            {section.blocks.map((block, index) => (
              <PageTransitionItem key={`${block.type}-${index}`} config={FOREGROUND_CONFIG}>
                <Block block={block} />
              </PageTransitionItem>
            ))}
          </section>
        ))}
        {messages.map((message) => (
          <PageTransitionItem key={message.id} config={FOREGROUND_CONFIG}>
            <ChatBubble speaker={message.role} text={message.text} />
          </PageTransitionItem>
        ))}
      </main>

      <BottomBar
        onSend={sendMessage}
        isGeneratingResponse={isGeneratingResponse}
        breakLabel={breakStatus.label}
        breakCanShow={breakStatus.canShow}
        onBreakPillClick={onBreakPillClick}
      />
    </div>
  );
}

function useScrollToLatestMessage(messages: readonly ChatTurn[], isGeneratingResponse: boolean): void {
  useEffect(() => {
    if (!messages.length) return;
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: isGeneratingResponse ? 'auto' : 'smooth',
    });
  }, [messages, isGeneratingResponse]);
}
