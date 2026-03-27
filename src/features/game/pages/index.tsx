import { useCallback, useState } from "react"

import { Chess } from "chess.js"

import { ChessBoard } from "../components/ChessBoard"
import { GameChat } from "../components/GameChat"
import { GameControls } from "../components/GameControls"
import { MoveHistory } from "../components/MoveHistory"
import { PlayerBar } from "../components/PlayerBar"
import { VsIntro } from "../components/VsIntro"
import type { GameInfo } from "../types"

// TODO: 실제 게임 데이터는 Socket.IO로 받아옴
const mockGame: GameInfo = {
  id: "1",
  white: { id: "1", name: "Chess Player", rating: 1200, avatar: null },
  black: { id: "2", name: "Opponent", rating: 1350, avatar: null },
  timeControl: { base: 5, increment: 3 },
}

export default function GamePage() {
  const [game] = useState(new Chess())
  const [position, setPosition] = useState(game.fen())
  const [moves, setMoves] = useState<string[]>([])
  const [introComplete, setIntroComplete] = useState(false)

  // TODO: 실제 타이머는 Socket.IO 서버에서 관리
  const [whiteTime] = useState(mockGame.timeControl.base * 60)
  const [blackTime] = useState(mockGame.timeControl.base * 60)

  const currentTurn = game.turn() === "w" ? "white" : "black"

  const handleMove = useCallback(
    (from: string, to: string) => {
      try {
        const move = game.move({ from, to, promotion: "q" })
        if (!move) return false
        setPosition(game.fen())
        setMoves((prev) => [...prev, move.san])
        return true
      } catch {
        return false
      }
    },
    [game],
  )

  const handleResign = () => {
    // TODO: Socket.IO 기권
  }

  const handleOfferDraw = () => {
    // TODO: Socket.IO 무승부 제안
  }

  return (
    <div className="relative mx-auto max-w-6xl py-4 px-4">
      <VsIntro
        white={mockGame.white}
        black={mockGame.black}
        onComplete={useCallback(() => setIntroComplete(true), [])}
      />
      <div
        className={`transition-opacity duration-300 ${introComplete ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex gap-4">
          <div className="flex w-60 shrink-0 flex-col gap-3">
            <MoveHistory moves={moves} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <PlayerBar
              player={mockGame.black}
              timeLeft={blackTime}
              isActive={currentTurn === "black"}
            />
            <ChessBoard game={game} position={position} orientation="white" onMove={handleMove} />
            <PlayerBar
              player={mockGame.white}
              timeLeft={whiteTime}
              isActive={currentTurn === "white"}
            />
          </div>
          <div className="flex w-60 shrink-0 flex-col gap-3">
            <GameChat />
            <GameControls onResign={handleResign} onOfferDraw={handleOfferDraw} />
          </div>
        </div>
      </div>
    </div>
  )
}
