import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SOSButton } from "@/components/dashboard/sos-button"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { EmergencyContacts } from "@/components/dashboard/emergency-contacts"
import { AlertNotifications } from "@/components/realtime/alert-notifications"
import { EmergencyContactAlerts } from "@/components/realtime/emergency-contact-alerts"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get recent alerts
  const { data: recentAlerts } = await supabase
    .from("sos_alerts")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get emergency contacts
  const { data: emergencyContacts } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", data.user.id)
    .order("priority", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* SOS Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency SOS</h2>
                <p className="text-gray-600 mb-8">
                  Press and hold the button below in case of emergency. Your location and alert will be sent to your
                  emergency contacts.
                </p>
                <SOSButton userId={data.user.id} />
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats alerts={recentAlerts || []} />

            {/* Recent Alerts */}
            <RecentAlerts alerts={recentAlerts || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Emergency Contacts */}
            <EmergencyContacts contacts={emergencyContacts || []} userId={data.user.id} />
          </div>
        </div>
      </main>

      <AlertNotifications userId={data.user.id} />
      <EmergencyContactAlerts userId={data.user.id} />
    </div>
  )
}
