import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useTranslation } from "react-i18next"

import { useQueryClient } from "@tanstack/react-query"

import {
  getChatControllerListConversationsQueryKey,
  getChatControllerListMessagesQueryKey,
  useChatControllerListConversations,
  useChatControllerListMessages,
  useChatControllerSendMessage,
} from "@/api/chat/chat"
import {
  getFriendsControllerListQueryKey,
  useFriendsControllerAdd,
  useFriendsControllerList,
  useFriendsControllerRemove,
} from "@/api/friends/friends"
import type { PresenceStatusDtoStatus } from "@/api/model"
import { UpdatePresenceDtoStatus } from "@/api/model"
import {
  getPresenceControllerListQueryKey,
  usePresenceControllerList,
  usePresenceControllerUpdateMe,
} from "@/api/presence/presence"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { cn } from "@/lib/utils"

const statusOptions = [
  UpdatePresenceDtoStatus.ONLINE,
  UpdatePresenceDtoStatus.AWAY,
  UpdatePresenceDtoStatus.OFFLINE,
] as const

const statusClassName: Record<PresenceStatusDtoStatus, string> = {
  ONLINE: "bg-emerald-500",
  AWAY: "bg-amber-500",
  OFFLINE: "bg-muted-foreground",
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export default function SocialPanel() {
  const { t } = useTranslation("profile")
  const queryClient = useQueryClient()
  const currentUsername = useAuthStore((state) => state.user?.username)
  const [friendUsername, setFriendUsername] = useState("")
  const [peerUsername, setPeerUsername] = useState("")
  const [messageBody, setMessageBody] = useState("")

  const friendsQuery = useFriendsControllerList()
  const conversationsQuery = useChatControllerListConversations()
  const friends = friendsQuery.data?.items ?? []
  const friendUsernames = friends.map((friend) => friend.username)
  const presenceUsernames = friendUsernames.join(",")
  const presenceQuery = usePresenceControllerList(
    presenceUsernames ? { usernames: presenceUsernames } : undefined,
    { query: { enabled: presenceUsernames.length > 0 } },
  )
  const presenceByUsername = useMemo(
    () => new Map((presenceQuery.data?.items ?? []).map((status) => [status.username, status])),
    [presenceQuery.data?.items],
  )

  const selectedPeer = peerUsername.trim()
  const messagesQuery = useChatControllerListMessages(selectedPeer || "__none__", {
    query: { enabled: selectedPeer.length > 0 },
  })

  const invalidateFriends = () => {
    void queryClient.invalidateQueries({ queryKey: getFriendsControllerListQueryKey() })
    void queryClient.invalidateQueries({ queryKey: getPresenceControllerListQueryKey() })
  }

  const addFriend = useFriendsControllerAdd({
    mutation: {
      onSuccess: () => {
        setFriendUsername("")
        invalidateFriends()
      },
    },
  })

  const removeFriend = useFriendsControllerRemove({
    mutation: {
      onSuccess: (_data, variables) => {
        if (peerUsername.trim() === variables.username) setPeerUsername("")
        invalidateFriends()
      },
    },
  })

  const updatePresence = usePresenceControllerUpdateMe({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getPresenceControllerListQueryKey() })
      },
    },
  })

  const sendMessage = useChatControllerSendMessage({
    mutation: {
      onSuccess: (_data, variables) => {
        setMessageBody("")
        void queryClient.invalidateQueries({
          queryKey: getChatControllerListMessagesQueryKey(variables.username),
        })
        void queryClient.invalidateQueries({
          queryKey: getChatControllerListConversationsQueryKey(),
        })
      },
    },
  })

  const onAddFriend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const username = friendUsername.trim()
    if (!username) return
    addFriend.mutate({ data: { username } })
  }

  const onSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPeer || !messageBody.trim()) return
    sendMessage.mutate({ username: selectedPeer, data: { body: messageBody.trim() } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("social.title")}</CardTitle>
        <CardDescription>{t("social.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3" aria-labelledby="presence-heading">
          <div>
            <h2 id="presence-heading" className="text-sm font-semibold">
              {t("social.presence.title")}
            </h2>
            {currentUsername ? (
              <p className="text-xs text-muted-foreground">
                {t("social.presence.signedInAs", { username: currentUsername })}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                size="sm"
                disabled={updatePresence.isPending}
                onClick={() => updatePresence.mutate({ data: { status } })}
              >
                {t(`social.presence.status.${status}`)}
              </Button>
            ))}
          </div>
          {updatePresence.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getErrorMessage(updatePresence.error, t("social.errors.presence"))}
            </p>
          ) : null}
        </section>

        <section className="space-y-3" aria-labelledby="friends-heading">
          <h2 id="friends-heading" className="text-sm font-semibold">
            {t("social.friends.title")}
          </h2>
          <form className="flex gap-2" onSubmit={onAddFriend}>
            <Input
              value={friendUsername}
              onChange={(event) => setFriendUsername(event.target.value)}
              placeholder={t("social.friends.usernamePlaceholder")}
              aria-label={t("social.friends.usernameLabel")}
            />
            <Button type="submit" disabled={addFriend.isPending || !friendUsername.trim()}>
              {addFriend.isPending ? t("social.friends.adding") : t("social.friends.add")}
            </Button>
          </form>
          {addFriend.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getErrorMessage(addFriend.error, t("social.errors.friend"))}
            </p>
          ) : null}

          {friendsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("social.loading")}</p>
          ) : friends.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("social.friends.empty")}</p>
          ) : (
            <ul className="space-y-2">
              {friends.map((friend) => {
                const presence = presenceByUsername.get(friend.username)
                const status = presence?.status ?? "OFFLINE"
                return (
                  <li
                    key={friend.username}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2"
                  >
                    <button
                      type="button"
                      className="min-w-0 text-left"
                      onClick={() => setPeerUsername(friend.username)}
                    >
                      <span className="block truncate text-sm font-medium">
                        {friend.displayName}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        @{friend.username}
                      </span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className={cn("h-2 w-2 rounded-full", statusClassName[status])}
                        />
                        {t(`social.presence.status.${status}`)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPeerUsername(friend.username)}
                      >
                        {t("social.chat.open")}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={removeFriend.isPending}
                        onClick={() => removeFriend.mutate({ username: friend.username })}
                      >
                        {t("social.friends.remove")}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {removeFriend.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getErrorMessage(removeFriend.error, t("social.errors.friend"))}
            </p>
          ) : null}
        </section>

        <section className="space-y-3" aria-labelledby="chat-heading">
          <h2 id="chat-heading" className="text-sm font-semibold">
            {t("social.chat.title")}
          </h2>
          <Input
            value={peerUsername}
            onChange={(event) => setPeerUsername(event.target.value)}
            placeholder={t("social.chat.peerPlaceholder")}
            aria-label={t("social.chat.peerLabel")}
          />
          {conversationsQuery.data?.items.length ? (
            <div className="flex flex-wrap gap-2">
              {conversationsQuery.data.items.map((conversation) => (
                <Button
                  key={conversation.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPeerUsername(conversation.peerUsername)}
                >
                  {conversation.peerDisplayName}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
            {!selectedPeer ? (
              <p className="text-sm text-muted-foreground">{t("social.chat.selectPeer")}</p>
            ) : messagesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">{t("social.loading")}</p>
            ) : (messagesQuery.data?.items.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">{t("social.chat.empty")}</p>
            ) : (
              messagesQuery.data?.items.map((message) => {
                const mine = message.senderUsername === currentUsername
                return (
                  <article
                    key={message.id}
                    className={cn(
                      "rounded-lg p-2 text-sm",
                      mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <p className="text-xs opacity-80">{message.senderUsername}</p>
                    <p>{message.body}</p>
                  </article>
                )
              })
            )}
          </div>

          <form className="flex gap-2" onSubmit={onSendMessage}>
            <Input
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              placeholder={t("social.chat.messagePlaceholder")}
              aria-label={t("social.chat.messageLabel")}
              disabled={!selectedPeer}
            />
            <Button
              type="submit"
              disabled={sendMessage.isPending || !selectedPeer || !messageBody.trim()}
            >
              {sendMessage.isPending ? t("social.chat.sending") : t("social.chat.send")}
            </Button>
          </form>
          {sendMessage.isError || messagesQuery.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getErrorMessage(sendMessage.error ?? messagesQuery.error, t("social.errors.chat"))}
            </p>
          ) : null}
        </section>
      </CardContent>
    </Card>
  )
}
