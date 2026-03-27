import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ChatMessage = {
  id: string
  sender: string
  text: string
}

export function GameChat() {
  const { t } = useTranslation("game")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "me",
      text: input.trim(),
    }
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    // TODO: Socket.IO로 메시지 전송
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("chat")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("chatEmpty")}</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`text-sm ${msg.sender === "me" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block rounded-lg px-3 py-1.5 ${
                    msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chatPlaceholder")}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
