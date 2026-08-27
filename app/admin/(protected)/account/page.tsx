"use client";

import { useState } from "react";
import { adminFetch } from "../../_lib/client";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают.");
      return;
    }

    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Пароль изменён. Все остальные сессии завершены.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось изменить пароль.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="admin-h1">Аккаунт</h1>
      <p className="admin-sub">Смена пароля администратора.</p>

      {error && <div className="admin-alert error">{error}</div>}
      {success && <div className="admin-alert success">{success}</div>}

      <div className="admin-card" style={{ maxWidth: 420 }}>
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Текущий пароль</label>
            <input
              className="admin-input"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="admin-field">
            <label>Новый пароль (мин. 12 символов)</label>
            <input
              className="admin-input"
              type="password"
              required
              minLength={12}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="admin-field">
            <label>Повторите новый пароль</label>
            <input
              className="admin-input"
              type="password"
              required
              minLength={12}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button className="admin-btn" type="submit" disabled={busy}>
            {busy ? "Сохраняем…" : "Изменить пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
