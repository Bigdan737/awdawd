import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { leads, projects } from "../../../db/schema";

export default async function DashboardPage() {
  const db = getDb();

  const [totalProjects, publishedProjects, newLeads, totalLeads] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(projects),
    db.select({ count: sql<number>`count(*)` }).from(projects).where(sql`published = 1`),
    db.select({ count: sql<number>`count(*)` }).from(leads).where(sql`status = 'new'`),
    db.select({ count: sql<number>`count(*)` }).from(leads),
  ]);

  const recentLeads = await db.select().from(leads).orderBy(sql`created_at desc`).limit(5);

  return (
    <div>
      <h1 className="admin-h1">Дашборд</h1>
      <p className="admin-sub">Обзор сайта produp</p>

      <div className="admin-grid" style={{ marginBottom: 28 }}>
        <div className="admin-stat">
          <div className="num">{newLeads[0]?.count ?? 0}</div>
          <div className="label">Новых заявок</div>
        </div>
        <div className="admin-stat">
          <div className="num">{totalLeads[0]?.count ?? 0}</div>
          <div className="label">Заявок всего</div>
        </div>
        <div className="admin-stat">
          <div className="num">{publishedProjects[0]?.count ?? 0}</div>
          <div className="label">Опубликовано проектов</div>
        </div>
        <div className="admin-stat">
          <div className="num">{totalProjects[0]?.count ?? 0}</div>
          <div className="label">Проектов всего</div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Последние заявки</h2>
        <p className="admin-card-desc">Быстрые запросы с сайта — приходят также в Telegram и на почту.</p>

        {recentLeads.length === 0 ? (
          <p className="admin-sub">Заявок пока нет.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Контакт</th>
                <th>Задача</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.contact}</td>
                  <td style={{ maxWidth: 320 }}>{lead.task.slice(0, 140)}</td>
                  <td>
                    <span className={`admin-badge ${lead.status}`}>{lead.status}</span>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleString("ru-RU")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 14 }}>
          <Link href="/admin/leads" className="admin-btn secondary">
            Все заявки →
          </Link>
        </div>
      </div>
    </div>
  );
}
