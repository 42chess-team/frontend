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
}: {
  game: Chess
  position: string
  orientation: "white" | "black"
  onMove: (from: string, to: string) => boolean
}) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)

  const legalMoves = useMemo(() => {
    if (!selectedSquare) return []
    return game.moves({ square: selectedSquare, verbose: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- position triggers recalc of legal moves
  }, [game, selectedSquare, position])

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

  const handleSquareClick = useCallback(
    ({ square }: { square: string | null }) => {
      if (!square) return
      const sq = square as Square
      if (selectedSquare) {
        const moved = onMove(selectedSquare, sq)
        if (!moved) {
          const piece = game.get(sq)
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(sq)
          } else {
            setSelectedSquare(null)
          }
        } else {
          setSelectedSquare(null)
        }
      }
    },
    [selectedSquare, onMove, game],
  )

  const handlePieceClick = useCallback(
    ({ square }: { square: string | null }) => {
      if (!square) return
      const sq = square as Square
      if (selectedSquare && selectedSquare !== sq) {
        const moved = onMove(selectedSquare, sq)
        if (moved) {
          setSelectedSquare(null)
          return
        }
      }
      const piece = game.get(sq)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(selectedSquare === sq ? null : sq)
      }
    },
    [selectedSquare, onMove, game],
  )

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare) return false
      const moved = onMove(sourceSquare, targetSquare)
      if (moved) setSelectedSquare(null)
      return moved
    },
    [onMove],
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
