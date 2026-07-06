import { useCallback, useMemo, useState } from "react"
import { Chessboard } from "react-chessboard"

import type { Chess, Square } from "chess.js"

const HIGHLIGHT_STYLE: React.CSSProperties = {
  background: "radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 25%)",
}

const CAPTURE_HIGHLIGHT_STYLE: React.CSSProperties = {
  background: "radial-gradient(circle, rgba(0,0,0,0.2) 85%, transparent 85%)",
}

const SELECTED_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 0, 0.4)",
}

export function ChessBoard({
  game,
  position,
  orientation,
  onMove,
  canMove = true,
}: {
  game: Chess
  position: string
  orientation: "white" | "black"
  onMove: (from: string, to: string, promotion?: string) => void
  canMove?: boolean
}) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  const legalMoves = useMemo(() => {
    if (!selectedSquare || !canMove) return []
    return game.moves({ square: selectedSquare, verbose: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- position triggers recalc of legal moves
  }, [game, selectedSquare, position, canMove])

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {}
    if (selectedSquare) {
      styles[selectedSquare] = SELECTED_STYLE
    }
    for (const move of legalMoves) {
      styles[move.to] = move.captured ? CAPTURE_HIGHLIGHT_STYLE : HIGHLIGHT_STYLE
    }
    return styles
  }, [selectedSquare, legalMoves])

  const submitIfLegal = useCallback(
    (from: Square, to: Square) => {
      if (!canMove) return false
      const legalMove = legalMoves.find((move) => move.from === from && move.to === to)
      if (!legalMove) return false
      onMove(from, to, legalMove.promotion || "q")
      setSelectedSquare(null)
      return true
    },
    [canMove, legalMoves, onMove],
  )

  const handleSquareClick = useCallback(
    ({ square }: { square: string | null }) => {
      if (!square || !canMove) return
      const sq = square as Square
      if (selectedSquare && submitIfLegal(selectedSquare, sq)) return

      const piece = game.get(sq)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(sq)
      } else {
        setSelectedSquare(null)
      }
    },
    [selectedSquare, submitIfLegal, game, canMove],
  )

  const handlePieceClick = useCallback(
    ({ square }: { square: string | null }) => {
      if (!square || !canMove) return
      const sq = square as Square
      if (selectedSquare && selectedSquare !== sq && submitIfLegal(selectedSquare, sq)) return

      const piece = game.get(sq)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(selectedSquare === sq ? null : sq)
      }
    },
    [selectedSquare, submitIfLegal, game, canMove],
  )

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare || !canMove) return false
      const from = sourceSquare as Square
      const to = targetSquare as Square
      const piece = game.get(from)
      const moves = game.moves({ square: from, verbose: true })
      const legalMove = moves.find((move) => move.to === to)
      if (piece && piece.color === game.turn() && legalMove) {
        onMove(from, to, legalMove.promotion || "q")
        setSelectedSquare(null)
      }
      // Never locally accept the drop; the board advances only after the server event updates FEN.
      return false
    },
    [canMove, game, onMove],
  )

  return (
    <div className="aspect-square w-full">
      <Chessboard
        options={{
          position,
          boardOrientation: orientation,
          onPieceDrop,
          onSquareClick: handleSquareClick,
          onPieceClick: handlePieceClick,
          squareStyles,
          boardStyle: {
            borderRadius: "0.5rem",
            overflow: "hidden",
          },
          darkSquareStyle: { backgroundColor: "#b58863" },
          lightSquareStyle: { backgroundColor: "#f0d9b5" },
        }}
      />
    </div>
  )
}
