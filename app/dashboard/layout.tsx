import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, MapPin, Shield } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Shield className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">SafeTrace</span>
          </div>

          <div className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/location">
              <Button variant="ghost" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Location Tracking
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
