export type Player = {
  id: string
  name: string
  rating: number | string
  avatar: string | null
}

export type GameInfo = {
  id: string
  white: Player
  black: Player
  timeControl: {
    base: number
    increment: number
  }
}
