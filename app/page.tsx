import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, MapPin, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SafeTrace</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 opacity-60"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 mb-8">
              <span className="text-sm font-medium text-orange-800">Discover our platform</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 text-balance">Emergency SOS Alert System</h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto text-pretty">
              Stay safe with instant emergency alerts, real-time location tracking, and automatic notifications to your
              emergency contacts when you need help most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
                  Start Protecting Yourself
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg bg-transparent"
                >
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">One platform. Three pillars.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Protect your safety with our comprehensive advanced features, get positioned to respond quickly to
              emergencies and ensure your loved ones are notified.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Instant SOS Alerts</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                One-click emergency button that immediately sends alerts to your emergency contacts and authorities with
                your exact location.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Instant notification
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  GPS coordinates
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  24/7 monitoring
                </li>
              </ul>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time Location</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Automatic location tracking and sharing with emergency contacts for quick response and assistance when
                you need it most.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Live tracking
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Secure sharing
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Privacy controls
                </li>
              </ul>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Manage your emergency contacts and ensure they're notified immediately when you need help with detailed
                information.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Multiple contacts
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Smart notifications
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Contact verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to stay safe?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust SafeTrace to keep them and their loved ones protected in emergency
            situations.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
