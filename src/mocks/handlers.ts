import { HttpResponse, http } from "msw"

const mockUser = {
  id: "1",
  email: "player@42chess.com",
  username: "chess_player",
  displayName: "Chess Player",
  avatarUrl: null,
  createdAt: "2026-03-01T00:00:00Z",
  ratings: [{ timeControl: "RAPID", rating: 1247, gamesPlayed: 85 }],
  usernameChangedAt: null,
}

const mockAuthUser = {
  id: mockUser.id,
  email: mockUser.email,
  username: mockUser.username,
  displayName: mockUser.displayName,
  avatarUrl: mockUser.avatarUrl,
}

const mockMatches = [
  {
    id: "g1",
    opponent: { username: "magnus_42", displayName: "Magnus_42", avatarUrl: null },
    color: "WHITE",
    result: "WIN",
    absoluteResult: "WHITE_WIN",
    resultReason: "CHECKMATE",
    timeControl: "BLITZ",
    initialTimeSeconds: 300,
    incrementSeconds: 0,
    ratingBefore: 1232,
    ratingAfter: 1247,
    ratingDelta: 15,
    startedAt: "2026-03-27T18:20:00Z",
    endedAt: "2026-03-27T18:30:00Z",
  },
  {
    id: "g2",
    opponent: { username: "bobby_fischer_99", displayName: "BobbyFischer99", avatarUrl: null },
    color: "BLACK",
    result: "LOSS",
    absoluteResult: "WHITE_WIN",
    resultReason: "RESIGN",
    timeControl: "RAPID",
    initialTimeSeconds: 600,
    incrementSeconds: 5,
    ratingBefore: 1259,
    ratingAfter: 1247,
    ratingDelta: -12,
    startedAt: "2026-03-26T13:45:00Z",
    endedAt: "2026-03-26T14:00:00Z",
  },
  {
    id: "g3",
    opponent: { username: "chess_noob", displayName: "ChessNoob", avatarUrl: null },
    color: "WHITE",
    result: "WIN",
    absoluteResult: "WHITE_WIN",
    resultReason: "CHECKMATE",
    timeControl: "BULLET",
    initialTimeSeconds: 180,
    incrementSeconds: 0,
    ratingBefore: 1239,
    ratingAfter: 1247,
    ratingDelta: 8,
    startedAt: "2026-03-25T20:10:00Z",
    endedAt: "2026-03-25T20:15:00Z",
  },
  {
    id: "g4",
    opponent: { username: "queen_gambit", displayName: "QueenGambit", avatarUrl: null },
    color: "BLACK",
    result: "DRAW",
    absoluteResult: "DRAW",
    resultReason: "AGREEMENT",
    timeControl: "BLITZ",
    initialTimeSeconds: 300,
    incrementSeconds: 3,
    ratingBefore: 1245,
    ratingAfter: 1247,
    ratingDelta: 2,
    startedAt: "2026-03-24T10:45:00Z",
    endedAt: "2026-03-24T11:00:00Z",
  },
  {
    id: "g5",
    opponent: { username: "pawn_star", displayName: "PawnStar", avatarUrl: null },
    color: "WHITE",
    result: "WIN",
    absoluteResult: "WHITE_WIN",
    resultReason: "RESIGN",
    timeControl: "RAPID",
    initialTimeSeconds: 600,
    incrementSeconds: 0,
    ratingBefore: 1237,
    ratingAfter: 1247,
    ratingDelta: 10,
    startedAt: "2026-03-23T09:30:00Z",
    endedAt: "2026-03-23T09:45:00Z",
  },
]

let isAuthenticated = false

let mockFriends = [
  { username: "magnus_42", displayName: "Magnus_42", avatarUrl: null },
  { username: "queen_gambit", displayName: "QueenGambit", avatarUrl: null },
]

const mockPresence = new Map([
  ["chess_player", { username: "chess_player", status: "ONLINE", lastSeenAt: null }],
  ["magnus_42", { username: "magnus_42", status: "ONLINE", lastSeenAt: null }],
  [
    "queen_gambit",
    { username: "queen_gambit", status: "AWAY", lastSeenAt: "2026-03-27T18:20:00Z" },
  ],
])

let mockMessages = [
  {
    id: "dm-1",
    senderUsername: "magnus_42",
    recipientUsername: "chess_player",
    body: "Ready for a rematch?",
    createdAt: "2026-03-27T18:31:00Z",
  },
]

const unauthorized = () => HttpResponse.json({ message: "Unauthorized" }, { status: 401 })

const requireAuth = () => {
  if (!isAuthenticated) return unauthorized()
  return null
}

const asUsername = (value: string | readonly string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export const handlers = [
  // MSW-only OAuth callback shim. Production starts OAuth at /auth/google/login.
  http.get("*/auth/google/login", () =>
    HttpResponse.json({ url: "/auth/google/callback?code=mock-code" }),
  ),

  http.post("*/api/auth/callback", async () => {
    isAuthenticated = true
    return HttpResponse.json({
      accessToken: "mock-access-token",
      user: mockAuthUser,
    })
  }),

  http.post("*/api/auth/login", async () => {
    isAuthenticated = true
    return HttpResponse.json({
      accessToken: "mock-local-token",
      user: mockAuthUser,
    })
  }),

  http.post("*/api/auth/signup", async () => {
    isAuthenticated = true
    return HttpResponse.json({
      accessToken: "mock-signup-token",
      user: mockAuthUser,
    })
  }),

  http.post("*/api/auth/refresh", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Invalid refresh token" }, { status: 401 })
    }
    return HttpResponse.json({
      accessToken: "mock-access-token-refreshed",
    })
  }),

  http.post("*/api/auth/logout", () => {
    isAuthenticated = false
    return HttpResponse.json({ message: "Logged out" })
  }),

  http.get("*/api/auth/me", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json(mockUser)
  }),

  http.get("*/api/users/me", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json(mockUser)
  }),

  http.get("*/api/users/:username", ({ params }) => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json({ ...mockUser, username: params.username })
  }),

  http.get("*/api/users/:username/matches", () => {
    if (!isAuthenticated) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json({
      items: mockMatches,
      total: mockMatches.length,
      page: 1,
      pageSize: 10,
      hasNext: false,
    })
  }),

  http.get("*/api/friends", () => {
    const authError = requireAuth()
    if (authError) return authError
    return HttpResponse.json({ items: mockFriends })
  }),

  http.post("*/api/friends", async ({ request }) => {
    const authError = requireAuth()
    if (authError) return authError

    const body = (await request.json()) as { username?: string }
    const username = body.username?.trim()
    if (!username) return HttpResponse.json({ message: "Username is required" }, { status: 400 })

    if (!mockFriends.some((friend) => friend.username === username)) {
      mockFriends = [...mockFriends, { username, displayName: username, avatarUrl: null }]
    }
    if (!mockPresence.has(username)) {
      mockPresence.set(username, { username, status: "OFFLINE", lastSeenAt: null })
    }
    return HttpResponse.json({ targetUsername: username, status: "ADDED" })
  }),

  http.delete("*/api/friends/:username", ({ params }) => {
    const authError = requireAuth()
    if (authError) return authError

    const username = asUsername(params.username)
    mockFriends = mockFriends.filter((friend) => friend.username !== username)
    return HttpResponse.json({ targetUsername: username, status: "REMOVED" })
  }),

  http.put("*/api/presence/me", async ({ request }) => {
    const authError = requireAuth()
    if (authError) return authError

    const body = (await request.json()) as { status?: string }
    const status = body.status ?? "ONLINE"
    const value = {
      username: mockUser.username,
      status,
      lastSeenAt: status === "OFFLINE" ? new Date().toISOString() : null,
    }
    mockPresence.set(mockUser.username, value)
    return HttpResponse.json(value)
  }),

  http.get("*/api/presence", ({ request }) => {
    const authError = requireAuth()
    if (authError) return authError

    const url = new URL(request.url)
    const usernames = (url.searchParams.get("usernames") ?? "")
      .split(",")
      .map((username) => username.trim())
      .filter(Boolean)
    const items = usernames.map(
      (username) => mockPresence.get(username) ?? { username, status: "OFFLINE", lastSeenAt: null },
    )
    return HttpResponse.json({ items })
  }),

  http.get("*/api/presence/:username", ({ params }) => {
    const authError = requireAuth()
    if (authError) return authError

    const username = asUsername(params.username) ?? ""
    return HttpResponse.json(
      mockPresence.get(username) ?? { username, status: "OFFLINE", lastSeenAt: null },
    )
  }),

  http.get("*/api/chat/conversations", () => {
    const authError = requireAuth()
    if (authError) return authError

    const peerUsernames = Array.from(
      new Set(
        mockMessages.map((message) =>
          message.senderUsername === mockUser.username
            ? message.recipientUsername
            : message.senderUsername,
        ),
      ),
    )
    return HttpResponse.json({
      items: peerUsernames.map((peerUsername) => {
        const lastMessage = [...mockMessages]
          .reverse()
          .find(
            (message) =>
              message.senderUsername === peerUsername || message.recipientUsername === peerUsername,
          )!
        const friend = mockFriends.find((item) => item.username === peerUsername)
        return {
          id: `conversation-${peerUsername}`,
          peerUsername,
          peerDisplayName: friend?.displayName ?? peerUsername,
          peerAvatarUrl: friend?.avatarUrl ?? null,
          lastMessageAt: lastMessage.createdAt,
          lastMessageBody: lastMessage.body,
          lastMessageSenderUsername: lastMessage.senderUsername,
        }
      }),
    })
  }),

  http.get("*/api/chat/conversations/:username/messages", ({ params }) => {
    const authError = requireAuth()
    if (authError) return authError

    const username = asUsername(params.username)
    return HttpResponse.json({
      items: mockMessages.filter(
        (message) => message.senderUsername === username || message.recipientUsername === username,
      ),
    })
  }),

  http.post("*/api/chat/conversations/:username/messages", async ({ params, request }) => {
    const authError = requireAuth()
    if (authError) return authError

    const username = asUsername(params.username) ?? ""
    const body = (await request.json()) as { body?: string }
    const message = {
      id: `dm-${mockMessages.length + 1}`,
      senderUsername: mockUser.username,
      recipientUsername: username,
      body: body.body ?? "",
      createdAt: new Date().toISOString(),
    }
    mockMessages = [...mockMessages, message]
    return HttpResponse.json({ message })
  }),
]
