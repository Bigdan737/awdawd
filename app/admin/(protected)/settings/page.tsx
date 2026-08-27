"use client";

import { useEffect, useState, useCallback } from "react";
import { adminJson, adminFetch } from "../../_lib/client";

type SettingsMap = Record<string, string>;

const TABS = [
  { id: "ai", label: "ИИ-ассистент" },
  { id: "email", label: "Почта" },
  { id: "telegram", label: "Telegram" },
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("ai");
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminJson<{ settings: SettingsMap }>("/api/admin/settings");
      setSettings(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function save(keys: string[]) {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: SettingsMap = {};
      for (const k of keys) payload[k] = settings[k] ?? "";
      const data = await adminJson<{ settings: SettingsMap }>("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSettings(data.settings);
      setSuccess("Сохранено.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить.");
    } finally {
      setSaving(false);
    }
  }

  async function testTelegram() {
    setTestMsg(null);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/settings/test-telegram", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTestMsg("Тестовое сообщение отправлено в Telegram ✅");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить.");
    }
  }

  async function testEmail() {
    setTestMsg(null);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/settings/test-email", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTestMsg("Тестовое письмо отправлено ✅");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить.");
    }
  }

  if (loading) return <p className="admin-sub">Загрузка…</p>;

  return (
    <div>
      <h1 className="admin-h1">Настройки</h1>
      <p className="admin-sub">Конфигурация ИИ-ассистента, почты и Telegram-уведомлений.</p>

      {error && <div className="admin-alert error">{error}</div>}
      {success && <div className="admin-alert success">{success}</div>}
      {testMsg && <div className="admin-alert success">{testMsg}</div>}

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`admin-tab${tab === t.id ? " is-active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ai" && (
        <div className="admin-card">
          <h2>ИИ-ассистент</h2>
          <p className="admin-card-desc">
            Системный промпт, модель и ключ провайдера для чат-виджета на сайте. Пусто = используются значения из
            переменных окружения (для первого запуска).
          </p>

          <div className="admin-field">
            <label>Системный промпт</label>
            <textarea
              className="admin-textarea"
              style={{ minHeight: 220, fontFamily: "monospace", fontSize: 13 }}
              value={settings.ai_system_prompt ?? ""}
              onChange={(e) => set("ai_system_prompt", e.target.value)}
              placeholder="Оставьте пустым, чтобы использовать промпт по умолчанию из кода."
            />
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>Модель</label>
              <input
                className="admin-input"
                value={settings.ai_model ?? ""}
                onChange={(e) => set("ai_model", e.target.value)}
                placeholder="openai/gpt-oss-20b"
              />
            </div>
            <div className="admin-field">
              <label>Base URL провайдера</label>
              <input
                className="admin-input"
                value={settings.ai_base_url ?? ""}
                onChange={(e) => set("ai_base_url", e.target.value)}
                placeholder="https://api.groq.com/openai/v1"
              />
            </div>
          </div>

          <div className="admin-field">
            <label>API-ключ (шифруется в базе)</label>
            <input
              className="admin-input"
              type="password"
              value={settings.ai_api_key ?? ""}
              onChange={(e) => set("ai_api_key", e.target.value)}
              placeholder="sk-..."
            />
            <p className="admin-hint">Показывается как маска после сохранения. Оставьте маску без изменений, чтобы не менять ключ.</p>
          </div>

          <button
            className="admin-btn"
            disabled={saving}
            onClick={() => save(["ai_system_prompt", "ai_model", "ai_base_url", "ai_api_key"])}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      )}

      {tab === "email" && (
        <div className="admin-card">
          <h2>SMTP / Почта</h2>
          <p className="admin-card-desc">Используется для отправки уведомлений о новых заявках.</p>

          <div className="admin-row">
            <div className="admin-field">
              <label>SMTP host</label>
              <input className="admin-input" value={settings.smtp_host ?? ""} onChange={(e) => set("smtp_host", e.target.value)} placeholder="smtp.yourprovider.com" />
            </div>
            <div className="admin-field">
              <label>Порт</label>
              <input className="admin-input" value={settings.smtp_port ?? ""} onChange={(e) => set("smtp_port", e.target.value)} placeholder="587" />
            </div>
          </div>

          <div className="admin-checkbox-row">
            <input
              type="checkbox"
              id="smtp_secure"
              checked={settings.smtp_secure === "true"}
              onChange={(e) => set("smtp_secure", e.target.checked ? "true" : "false")}
            />
            <label htmlFor="smtp_secure" style={{ margin: 0 }}>SSL/TLS (обычно включено для порта 465)</label>
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>SMTP пользователь</label>
              <input className="admin-input" value={settings.smtp_user ?? ""} onChange={(e) => set("smtp_user", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>SMTP пароль (шифруется)</label>
              <input className="admin-input" type="password" value={settings.smtp_pass ?? ""} onChange={(e) => set("smtp_pass", e.target.value)} />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>From (например "produp" &lt;noreply@produp.com&gt;)</label>
              <input className="admin-input" value={settings.smtp_from ?? ""} onChange={(e) => set("smtp_from", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Куда слать уведомления о заявках</label>
              <input className="admin-input" value={settings.lead_notify_email ?? ""} onChange={(e) => set("lead_notify_email", e.target.value)} placeholder="team@produp.com" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="admin-btn"
              disabled={saving}
              onClick={() => save(["smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_pass", "smtp_from", "lead_notify_email"])}
            >
              {saving ? "Сохраняем…" : "Сохранить"}
            </button>
            <button className="admin-btn secondary" onClick={testEmail}>Отправить тестовое письмо</button>
          </div>
        </div>
      )}

      {tab === "telegram" && (
        <div className="admin-card">
          <h2>Telegram-уведомления</h2>
          <p className="admin-card-desc">Заявки с сайта будут приходить в указанный чат.</p>

          <div className="admin-checkbox-row">
            <input
              type="checkbox"
              id="telegram_enabled"
              checked={settings.telegram_enabled !== "false"}
              onChange={(e) => set("telegram_enabled", e.target.checked ? "true" : "false")}
            />
            <label htmlFor="telegram_enabled" style={{ margin: 0 }}>Включено</label>
          </div>

          <div className="admin-field">
            <label>Bot token (шифруется)</label>
            <input className="admin-input" type="password" value={settings.telegram_bot_token ?? ""} onChange={(e) => set("telegram_bot_token", e.target.value)} placeholder="123456:AA..." />
            <p className="admin-hint">Получить у @BotFather в Telegram.</p>
          </div>

          <div className="admin-field">
            <label>Chat ID</label>
            <input className="admin-input" value={settings.telegram_chat_id ?? ""} onChange={(e) => set("telegram_chat_id", e.target.value)} placeholder="-1001234567890" />
            <p className="admin-hint">Узнать через @userinfobot или https://api.telegram.org/bot&lt;token&gt;/getUpdates</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="admin-btn"
              disabled={saving}
              onClick={() => save(["telegram_enabled", "telegram_bot_token", "telegram_chat_id"])}
            >
              {saving ? "Сохраняем…" : "Сохранить"}
            </button>
            <button className="admin-btn secondary" onClick={testTelegram}>Отправить тест</button>
          </div>
        </div>
      )}
    </div>
  );
}
