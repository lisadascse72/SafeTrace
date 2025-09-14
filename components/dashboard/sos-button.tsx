"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface SOSButtonProps {
  userId: string
}

export function SOSButton({ userId }: SOSButtonProps) {
  const [isSending, setIsSending] = useState(false)
  const supabase = createClient()

  const triggerSOS = async () => {
    setIsSending(true)

    // Get current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            // Create SOS alert
            const { data: alert, error } = await supabase
              .from("sos_alerts")
              .insert({
                user_id: userId,
                latitude,
                longitude,
                status: "active",
                message: "Emergency SOS Alert Triggered",
              })
              .select()
              .single()

            if (error) throw error

            try {
              await fetch("/api/notifications", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  alertId: alert.id,
                  type: "emergency",
                }),
              })
            } catch (notificationError) {
              console.error("Failed to send notifications:", notificationError)
            }

            toast({
              title: "SOS Alert Sent!",
              description: "Emergency contacts have been notified of your location.",
              variant: "destructive",
            })
          } catch (error) {
            console.error("Error sending SOS alert:", error)
            toast({
              title: "Error",
              description: "Failed to send SOS alert. Please try again.",
              variant: "destructive",
            })
          } finally {
            setIsSending(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive",
          })
          setIsSending(false)
        },
      )
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      })
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Button
          size="lg"
          className={`h-32 w-32 rounded-full text-white font-bold text-lg transition-all duration-200 ${
            isSending ? "bg-red-700 scale-95" : "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl"
          }`}
          onClick={triggerSOS}
          disabled={isSending}
        >
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 mb-2" />
            {isSending ? "Sending..." : "SOS"}
          </div>
        </Button>

        {isSending && <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />}
      </div>

      <div className="text-center max-w-md">
        <p className="text-sm text-gray-600">
          {isSending ? "Sending emergency alert..." : "Click to send emergency alert to your contacts"}
        </p>
      </div>
    </div>
  )
}
