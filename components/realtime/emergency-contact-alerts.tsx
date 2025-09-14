"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface EmergencyContactAlertsProps {
  userId: string
}

export function EmergencyContactAlerts({ userId }: EmergencyContactAlertsProps) {
  const supabase = createClient()

  useEffect(() => {
    const sendEmergencyNotifications = async (alert: any) => {
      try {
        // Get user's emergency contacts
        const { data: contacts } = await supabase
          .from("emergency_contacts")
          .select("*")
          .eq("user_id", alert.user_id)
          .order("priority", { ascending: true })

        // Get user profile for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", alert.user_id)
          .single()

        if (contacts && contacts.length > 0) {
          // In a real implementation, you would send SMS/email notifications here
          // For now, we'll simulate the notification process
          console.log("Sending emergency notifications to contacts:", contacts)

          // Create notification records (you could add a notifications table)
          const notifications = contacts.map((contact) => ({
            contact_id: contact.id,
            alert_id: alert.id,
            message: `EMERGENCY ALERT: ${profile?.full_name || "SafeTrace User"} has triggered an emergency alert. Location: https://maps.google.com/maps?q=${alert.latitude},${alert.longitude}`,
            sent_at: new Date().toISOString(),
          }))

          // In production, integrate with SMS/Email services like Twilio, SendGrid, etc.
          console.log("Emergency notifications prepared:", notifications)
        }
      } catch (error) {
        console.error("Error sending emergency notifications:", error)
      }
    }

    // Subscribe to new alerts for this user
    const channel = supabase
      .channel(`emergency_contacts_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sos_alerts",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          sendEmergencyNotifications(payload.new as any)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return null // This component doesn't render anything
}
