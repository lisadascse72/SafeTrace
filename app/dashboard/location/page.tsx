import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LocationTracker } from "@/components/location/location-tracker"
import { LocationHistory } from "@/components/location/location-history"

export default async function LocationPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get recent location updates
  const { data: locationUpdates } = await supabase
    .from("location_updates")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Tracking</h1>
          <p className="text-gray-600">Monitor and share your real-time location for emergency situations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Map Area */}
          <div className="lg:col-span-2">
            <LocationTracker userId={data.user.id} />
          </div>

          {/* Location History Sidebar */}
          <div>
            <LocationHistory locationUpdates={locationUpdates || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
