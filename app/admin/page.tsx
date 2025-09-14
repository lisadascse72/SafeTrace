import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { ActiveAlerts } from "@/components/admin/active-alerts"
import { AllAlerts } from "@/components/admin/all-alerts"
import { UserManagement } from "@/components/admin/user-management"
import { AlertNotifications } from "@/components/realtime/alert-notifications"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin (simple check - in production you'd have proper role management)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile?.full_name?.toLowerCase().includes("admin")) {
    redirect("/dashboard")
  }

  // Get all SOS alerts
  const { data: allAlerts } = await supabase
    .from("sos_alerts")
    .select(`
      *,
      profiles!sos_alerts_user_id_fkey (
        full_name,
        phone_number
      )
    `)
    .order("created_at", { ascending: false })

  // Get active alerts
  const activeAlerts = allAlerts?.filter((alert) => alert.status === "active") || []

  // Get all users
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage SafeTrace emergency alerts and users</p>
        </div>

        <div className="space-y-8">
          {/* Stats Overview */}
          <AdminStats alerts={allAlerts || []} users={users || []} />

          {/* Active Alerts - Priority Section */}
          {activeAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-900 mb-4">🚨 Active Emergency Alerts</h2>
              <ActiveAlerts alerts={activeAlerts} />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* All Alerts */}
            <AllAlerts alerts={allAlerts || []} />

            {/* User Management */}
            <UserManagement users={users || []} />
          </div>
        </div>
      </main>

      <AlertNotifications isAdmin={true} />
    </div>
  )
}
