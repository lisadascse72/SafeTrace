"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"

interface AlertNotificationsProps {
  userId?: string
  isAdmin?: boolean
}

export function AlertNotifications({ userId, isAdmin = false }: AlertNotificationsProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const supabase = createClient()

  useEffect(() => {
    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }

    // Set up real-time subscription
    const channel = supabase
      .channel("sos_alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sos_alerts",
          ...(isAdmin ? {} : { filter: `user_id=eq.${userId}` }),
        },
        (payload) => {
          handleNewAlert(payload.new as any)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sos_alerts",
          ...(isAdmin ? {} : { filter: `user_id=eq.${userId}` }),
        },
        (payload) => {
          handleAlertUpdate(payload.new as any)
        },
      )
      .subscribe()

    setIsSubscribed(true)

    return () => {
      supabase.removeChannel(channel)
      setIsSubscribed(false)
    }
  }, [userId, isAdmin, supabase])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive real-time emergency alerts.",
        })
      }
    }
  }

  const handleNewAlert = async (alert: any) => {
    // Show toast notification
    toast({
      title: isAdmin ? "🚨 New Emergency Alert" : "🚨 Emergency Alert Sent",
      description: isAdmin
        ? `Emergency alert from user at ${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`
        : "Your emergency alert has been sent to your contacts.",
      variant: "destructive",
    })

    // Show browser notification
    if (notificationPermission === "granted") {
      const notification = new Notification(isAdmin ? "SafeTrace - New Emergency Alert" : "SafeTrace - Alert Sent", {
        body: isAdmin
          ? `Emergency situation reported. Location: ${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`
          : "Your emergency alert has been successfully sent to your emergency contacts.",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `alert-${alert.id}`,
        requireInteraction: isAdmin, // Keep admin notifications visible
      })

      // Auto-close user notifications after 5 seconds
      if (!isAdmin) {
        setTimeout(() => notification.close(), 5000)
      }

      notification.onclick = () => {
        window.focus()
        if (isAdmin) {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dashboard"
        }
        notification.close()
      }
    }

    // Play alert sound (optional)
    if (isAdmin) {
      playAlertSound()
    }
  }

  const handleAlertUpdate = (alert: any) => {
    if (alert.status === "resolved") {
      toast({
        title: "Alert Resolved",
        description: isAdmin
          ? "Emergency alert has been resolved by admin."
          : "Your emergency alert has been resolved.",
      })

      if (notificationPermission === "granted") {
        new Notification("SafeTrace - Alert Resolved", {
          body: "Emergency situation has been resolved.",
          icon: "/favicon.ico",
          tag: `resolved-${alert.id}`,
        })
      }
    }
  }

  const playAlertSound = () => {
    // Create audio context for alert sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {notificationPermission === "default" && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Enable Notifications</p>
              <p className="text-xs text-gray-600 mt-1">Get real-time alerts for emergency situations</p>
              <button
                onClick={requestNotificationPermission}
                className="text-xs text-blue-600 hover:text-blue-700 mt-2"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="mt-2 flex items-center justify-end">
        <div className={`w-2 h-2 rounded-full ${isSubscribed ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs text-gray-500 ml-1">{isSubscribed ? "Connected" : "Disconnected"}</span>
      </div>
    </div>
  )
}
