"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { copy, type Locale } from "./content";

type Message = { role: "bot" | "user" | "error"; text: string };
type Tab = "chat" | "lead";

export function AiManagerWidget({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", text: t.aiGreeting }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number>(0);

  useEffect(() => {
    if (open && !openedAtRef.current) openedAtRef.current = Date.now();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const history = messages
      .filter((m): m is Message & { role: "bot" | "user" } => m.role !== "error")
      .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data: { reply?: string; error?: string } = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "error", text: data.error ?? t.aiLeadError }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply ?? "" }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "error", text: t.aiLeadError }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ai-widget">
      {open && (
        <div className="ai-panel" role="dialog" aria-label="AI assistant">
          <div className="ai-panel-header">
            <div>
              <strong>{t.aiWidgetName}</strong>
              <span className="ai-status">
                <span className="ai-status-dot" /> {t.aiWidgetStatus}
              </span>
            </div>
            <button className="ai-close" type="button" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>

          <div className="ai-tabs">
            <button
              type="button"
              className={tab === "chat" ? "is-active" : ""}
              onClick={() => setTab("chat")}
            >
              {t.aiTabChat}
            </button>
            <button
              type="button"
              className={tab === "lead" ? "is-active" : ""}
              onClick={() => setTab("lead")}
            >
              {t.aiTabLead}
            </button>
          </div>

          {tab === "chat" ? (
            <ChatTab
              t={t}
              messages={messages}
              scrollRef={scrollRef}
              input={input}
              setInput={setInput}
              sending={sending}
              onSend={send}
            />
          ) : (
            <LeadTab t={t} openedAt={openedAtRef.current} />
          )}
        </div>
      )}

      <button
        type="button"
        className={`ai-launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t.aiWidgetName}
      >
        <span className="ai-launcher-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}

function ChatTab({
  t,
  messages,
  scrollRef,
  input,
  setInput,
  sending,
  onSend,
}: {
  t: (typeof copy)["en"];
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  input: string;
  setInput: (v: string) => void;
  sending: boolean;
  onSend: (text: string) => void;
}) {
  return (
    <div className="ai-tabpanel">
      <p className="ai-disclaimer">{t.aiDisclaimer}</p>
      <div className="ai-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`ai-msg ai-msg-${m.role}`}>
            {m.text}
          </div>
        ))}
        {sending && (
          <div className="ai-typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form
        className="ai-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.aiWidgetPlaceholder}
          disabled={sending}
        />
        <button type="submit" aria-label="Send" disabled={sending || !input.trim()}>
          →
        </button>
      </form>
    </div>
  );
}

function LeadTab({ t, openedAt }: { t: (typeof copy)["en"]; openedAt: number }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const website = String(form.get("website") ?? ""); // honeypot
    const contact = String(form.get("contact") ?? "");
    const task = String(form.get("task") ?? "");
    const consent = form.get("consent") === "on";

    setStatus("sending");
    try {
      const res = await fetch("/api/ai-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website,
          contact,
          task,
          consent,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          openedAt,
        }),
      });
      const data: { message?: string; error?: string } = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? t.aiLeadError);
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg(t.aiLeadError);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="ai-tabpanel">
        <div className="ai-lead-success">
          <span className="success-check" aria-hidden="true" />
          {t.aiLeadSuccess}
        </div>
      </div>
    );
  }

  return (
    <div className="ai-tabpanel">
      <form className="ai-lead-form" onSubmit={onSubmit}>
        {/* Honeypot — hidden from real visitors, bots fill every field */}
        <div className="ai-hp-field" aria-hidden="true">
          <label htmlFor="ai-lead-website">Website</label>
          <input type="text" id="ai-lead-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field">
          <input type="text" id="ai-lead-contact" name="contact" placeholder=" " required />
          <label htmlFor="ai-lead-contact">{t.aiFieldContact}</label>
        </div>

        <div className="field">
          <textarea id="ai-lead-task" name="task" placeholder=" " required rows={3} />
          <label htmlFor="ai-lead-task">{t.aiFieldTask}</label>
        </div>

        <label className="ai-consent">
          <input type="checkbox" name="consent" required />
          <span>{t.aiConsent}</span>
        </label>

        {status === "error" && <div className="ai-lead-status error">{errorMsg}</div>}

        <button className="button" type="submit" disabled={status === "sending"}>
          {t.aiSubmit}
        </button>
      </form>
    </div>
  );
}
