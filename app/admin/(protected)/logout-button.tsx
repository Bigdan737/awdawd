"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "../_lib/client";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await adminFetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button className="admin-btn secondary" onClick={handleLogout} disabled={busy} style={{ width: "100%" }}>
      {busy ? "…" : "Выйти"}
    </button>
  );
}
