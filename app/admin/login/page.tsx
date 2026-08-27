"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "../_lib/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setupToken = searchParams.get("setup");
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSetupMode = Boolean(setupToken);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Не удалось войти.");
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    if (password.length < 12) {
      setError("Пароль должен быть не короче 12 символов.");
      return;
    }

    setBusy(true);
    try {
      const res = await adminFetch("/api/admin/auth/setup", {
        method: "POST",
        body: JSON.stringify({ token: setupToken, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Не удалось создать аккаунт.");
        return;
      }
      setSuccess("Аккаунт создан. Теперь можно войти обычным способом.");
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1 className="admin-h1">produp</h1>
        <p className="admin-sub">{isSetupMode ? "Создание первого аккаунта" : "Вход в админ-панель"}</p>

        {error && <div className="admin-alert error">{error}</div>}
        {success && <div className="admin-alert success">{success}</div>}

        {isSetupMode && !success ? (
          <form onSubmit={handleSetup}>
            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="admin-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="password">Пароль (мин. 12 символов)</label>
              <input
                id="password"
                className="admin-input"
                type="password"
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="confirmPassword">Повторите пароль</label>
              <input
                id="confirmPassword"
                className="admin-input"
                type="password"
                required
                minLength={12}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button className="admin-btn" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? "Создаём…" : "Создать аккаунт"}
            </button>
            <p className="admin-hint">
              После создания аккаунта уберите переменную окружения ADMIN_SETUP_TOKEN — она больше не понадобится.
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="admin-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                className="admin-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button className="admin-btn" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? "Входим…" : "Войти"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
