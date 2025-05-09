"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import BorgLogo from "@/components/borg-logo"
import { AlertCircle, Info, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if we're in demo mode (no Supabase credentials)
    const checkDemoMode = async () => {
      try {
        // Try to get session to check if Supabase is working
        const { data, error } = await supabase.auth.getSession()
        if (error && error.message.includes("not initialized")) {
          setIsDemoMode(true)
        }
      } catch (err) {
        console.error("Error checking auth status:", err)
        setIsDemoMode(true)
      }
    }

    checkDemoMode()
  }, [])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      // If in demo mode, simulate registration
      if (isDemoMode) {
        // Simulate registration delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Redirect to login with success message
        router.push("/auth/login?registered=true")
        return
      }

      // Real Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        throw error
      }

      // Redirect to login with success message
      router.push("/auth/login?registered=true")
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] p-4">
      <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-800 text-white">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 mb-4">
            <BorgLogo />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription className="text-gray-400">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <div className="bg-blue-900/30 border border-blue-700 text-blue-200 p-3 rounded-md mb-4 flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Demo mode active. Registration will be simulated.</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#2A2A2A] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#2A2A2A] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#2A2A2A] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-[#2A2A2A] border-gray-700 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
