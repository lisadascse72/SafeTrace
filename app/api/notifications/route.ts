import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { alertId, type } = await request.json()
    const supabase = await createClient()

    // Get alert details
    const { data: alert, error: alertError } = await supabase
      .from("sos_alerts")
      .select(`
        *,
        profiles!sos_alerts_user_id_fkey (
          full_name,
          phone_number
        )
      `)
      .eq("id", alertId)
      .single()

    if (alertError || !alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    // Get emergency contacts
    const { data: contacts } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", alert.user_id)
      .order("priority", { ascending: true })

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: "No emergency contacts found" }, { status: 404 })
    }

    // Prepare notification data
    const notifications = contacts.map((contact) => ({
      contact_name: contact.name,
      contact_phone: contact.phone_number,
      user_name: alert.profiles?.full_name || "SafeTrace User",
      location: `${alert.latitude}, ${alert.longitude}`,
      maps_url: `https://maps.google.com/maps?q=${alert.latitude},${alert.longitude}`,
      alert_time: alert.created_at,
    }))

    // In production, you would integrate with:
    // - Twilio for SMS notifications
    // - SendGrid/Mailgun for email notifications
    // - Push notification services

    console.log("Emergency notifications to send:", notifications)

    // Simulate sending notifications
    const results = notifications.map((notification) => ({
      contact: notification.contact_name,
      phone: notification.contact_phone,
      status: "sent", // In production, this would be the actual send status
      message: `EMERGENCY: ${notification.user_name} needs help! Location: ${notification.maps_url}`,
    }))

    return NextResponse.json({
      success: true,
      notifications_sent: results.length,
      results,
    })
  } catch (error) {
    console.error("Notification API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
