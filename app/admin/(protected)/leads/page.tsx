"use client";

import { useEffect, useState, useCallback } from "react";
import { adminJson } from "../../_lib/client";

type Lead = {
  id: number;
  contact: string;
  task: string;
  source: string;
  pageUrl: string | null;
  status: string;
  telegramSent: boolean;
  emailSent: boolean;
  createdAt: string;
};

const STATUSES = ["new", "in_progress", "done", "spam"] as const;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminJson<{ leads: Lead[] }>("/api/admin/leads");
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await adminJson(`/api/admin/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update.");
      load();
    }
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <h1 className="admin-h1">Заявки</h1>
      <p className="admin-sub">«Быстрые запросы» с сайта — сохраняются здесь, дублируются в Telegram и на почту.</p>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-tabs">
        {["all", ...STATUSES].map((s) => (
          <button key={s} className={`admin-tab${filter === s ? " is-active" : ""}`} onClick={() => setFilter(s)}>
            {s === "all" ? "Все" : s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admin-sub">Загрузка…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-sub">Заявок нет.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Контакт</th>
              <th>Задача</th>
              <th>Источник</th>
              <th>Доставка</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.contact}</td>
                <td style={{ maxWidth: 340 }}>{lead.task}</td>
                <td>{lead.source}</td>
                <td style={{ fontSize: 12 }}>
                  {lead.telegramSent ? "✅ TG" : "— TG"} / {lead.emailSent ? "✅ email" : "— email"}
                </td>
                <td>
                  <select
                    className="admin-select"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    style={{ padding: "4px 8px", fontSize: 12 }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{new Date(lead.createdAt).toLocaleString("ru-RU")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
