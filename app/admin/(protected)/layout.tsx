import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminForPage } from "../../../lib/admin/auth";
import { NavLinks } from "./nav-links";
import { LogoutButton } from "./logout-button";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminForPage();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          produp
          <span>admin panel</span>
        </div>
        <NavLinks />
        <div className="admin-sidebar-footer">
          <div style={{ marginBottom: 8 }}>{admin.email}</div>
          <LogoutButton />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
