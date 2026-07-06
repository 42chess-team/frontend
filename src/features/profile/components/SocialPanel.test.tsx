import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { useAuthStore } from "@/features/auth/stores/auth-store"
import "@/lib/i18n"

import SocialPanel from "./SocialPanel"

let friends = [{ username: "magnus_42", displayName: "Magnus_42", avatarUrl: null }]
let presence = new Map([
  ["magnus_42", { username: "magnus_42", status: "ONLINE", lastSeenAt: null }],
  ["queen_gambit", { username: "queen_gambit", status: "AWAY", lastSeenAt: null }],
])
let messages = [
  {
    id: "dm-1",
    senderUsername: "magnus_42",
    recipientUsername: "chess_player",
    body: "Ready?",
    createdAt: "2026-03-27T18:31:00Z",
  },
]

const server = setupServer(
  http.get("*/api/friends", () => HttpResponse.json({ items: friends })),
  http.post("*/api/friends", async ({ request }) => {
    const body = (await request.json()) as { username: string }
    friends = [...friends, { username: body.username, displayName: body.username, avatarUrl: null }]
    presence.set(body.username, { username: body.username, status: "OFFLINE", lastSeenAt: null })
    return HttpResponse.json({ targetUsername: body.username, status: "ADDED" })
  }),
  http.delete("*/api/friends/:username", ({ params }) => {
    friends = friends.filter((friend) => friend.username !== params.username)
    return HttpResponse.json({ targetUsername: params.username, status: "REMOVED" })
  }),
  http.get("*/api/presence", ({ request }) => {
    const url = new URL(request.url)
    const usernames = (url.searchParams.get("usernames") ?? "").split(",").filter(Boolean)
    return HttpResponse.json({
      items: usernames.map(
        (username) => presence.get(username) ?? { username, status: "OFFLINE", lastSeenAt: null },
      ),
    })
  }),
  http.put("*/api/presence/me", async ({ request }) => {
    const body = (await request.json()) as { status: string }
    return HttpResponse.json({ username: "chess_player", status: body.status, lastSeenAt: null })
  }),
  http.get("*/api/chat/conversations", () =>
    HttpResponse.json({
      items: [
        {
          id: "conversation-magnus_42",
          peerUsername: "magnus_42",
          peerDisplayName: "Magnus_42",
          peerAvatarUrl: null,
          lastMessageAt: "2026-03-27T18:31:00Z",
          lastMessageBody: "Ready?",
          lastMessageSenderUsername: "magnus_42",
        },
      ],
    }),
  ),
  http.get("*/api/chat/conversations/:username/messages", ({ params }) =>
    HttpResponse.json({
      items: messages.filter(
        (message) =>
          message.senderUsername === params.username ||
          message.recipientUsername === params.username,
      ),
    }),
  ),
  http.post("*/api/chat/conversations/:username/messages", async ({ params, request }) => {
    const body = (await request.json()) as { body: string }
    const message = {
      id: `dm-${messages.length + 1}`,
      senderUsername: "chess_player",
      recipientUsername: String(params.username),
      body: body.body,
      createdAt: "2026-03-27T18:32:00Z",
    }
    messages = [...messages, message]
    return HttpResponse.json({ message })
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  cleanup()
  server.resetHandlers()
  useAuthStore.getState().clearAuth()
})
afterAll(() => server.close())

beforeEach(() => {
  friends = [{ username: "magnus_42", displayName: "Magnus_42", avatarUrl: null }]
  presence = new Map([
    ["magnus_42", { username: "magnus_42", status: "ONLINE", lastSeenAt: null }],
    ["queen_gambit", { username: "queen_gambit", status: "AWAY", lastSeenAt: null }],
  ])
  messages = [
    {
      id: "dm-1",
      senderUsername: "magnus_42",
      recipientUsername: "chess_player",
      body: "Ready?",
      createdAt: "2026-03-27T18:31:00Z",
    },
  ]
  useAuthStore.getState().setAuth("token", {
    id: "1",
    email: "player@42chess.com",
    name: "Chess Player",
    avatar: null,
    provider: "local",
    username: "chess_player",
  })
})

function renderSocialPanel() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <SocialPanel />
    </QueryClientProvider>,
  )
}

describe("SocialPanel", () => {
  it("adds and removes friends and shows presence", async () => {
    renderSocialPanel()

    expect((await screen.findAllByText("Magnus_42")).length).toBeGreaterThan(0)
    expect(await screen.findByText("Online")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Friend username"), {
      target: { value: "queen_gambit" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))

    expect(await screen.findByText("queen_gambit")).toBeInTheDocument()
    expect(await screen.findByText("Away")).toBeInTheDocument()

    const queenRow = screen.getByText("queen_gambit").closest("li")
    expect(queenRow).not.toBeNull()
    fireEvent.click(within(queenRow!).getByRole("button", { name: "Remove" }))

    await waitFor(() => expect(screen.queryByText("queen_gambit")).not.toBeInTheDocument())
  })

  it("lists and sends direct messages with a selected peer", async () => {
    renderSocialPanel()

    fireEvent.change(screen.getByLabelText("Chat peer username"), {
      target: { value: "magnus_42" },
    })

    expect(await screen.findByText("Ready?")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Message body"), {
      target: { value: "Good luck!" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Send" }))

    expect(await screen.findByText("Good luck!")).toBeInTheDocument()
  })

  it("updates own presence status", async () => {
    let statusSet = ""
    server.use(
      http.put("*/api/presence/me", async ({ request }) => {
        const body = (await request.json()) as { status: string }
        statusSet = body.status
        return HttpResponse.json({
          username: "chess_player",
          status: body.status,
          lastSeenAt: null,
        })
      }),
    )

    renderSocialPanel()
    fireEvent.click(screen.getByRole("button", { name: "Away" }))

    await waitFor(() => expect(statusSet).toBe("AWAY"))
  })
})
