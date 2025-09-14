"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface LiveLocationShareProps {
  userId: string
}

export function LiveLocationShare({ userId }: LiveLocationShareProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const supabase = createClient()

  const generateShareLink = async () => {
    try {
      // Generate a unique share token
      const shareToken = crypto.randomUUID()
      const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Store share session in database (you'd need to create this table)
      // For now, we'll just generate a URL
      const url = `${window.location.origin}/share/${shareToken}`

      setShareUrl(url)
      setExpiresAt(expirationTime)
      setIsSharing(true)

      toast({
        title: "Share Link Generated",
        description: "Your location sharing link is ready to share.",
      })
    } catch (error) {
      console.error("Error generating share link:", error)
      toast({
        title: "Error",
        description: "Failed to generate share link.",
        variant: "destructive",
      })
    }
  }

  const stopSharing = () => {
    setIsSharing(false)
    setShareUrl("")
    setExpiresAt(null)
    toast({
      title: "Sharing Stopped",
      description: "Location sharing has been disabled.",
    })
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="h-5 w-5 mr-2" />
          Live Location Sharing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <Badge variant={isSharing ? "default" : "secondary"} className={isSharing ? "bg-green-600" : ""}>
            {isSharing ? "Active" : "Inactive"}
          </Badge>
        </div>

        {!isSharing ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Generate a secure link to share your live location with trusted contacts.
            </p>
            <Button onClick={generateShareLink} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Start Sharing Location
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Share Link</label>
              <div className="flex mt-1">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={copyShareLink} variant="outline" size="sm" className="ml-2 bg-transparent">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expiresAt && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                Expires: {expiresAt.toLocaleString()}
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={stopSharing} variant="destructive" size="sm">
                Stop Sharing
              </Button>
              <Button onClick={copyShareLink} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-1" />
                Copy Link
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Note:</strong> Only share this link with trusted contacts. Anyone with this link can
                see your live location.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
