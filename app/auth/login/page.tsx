"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase, isDemoMode } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import BorgLogo from "@/components/borg-logo"
import { AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const resetSuccess = searchParams.get("reset")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [demoModeActive, setDemoModeActive] = useState(false)

  useEffect(() => {
    // Set demo mode state
    setDemoModeActive(isDemoMode())

    if (registered === "true") {
      setSuccess("Account created successfully! Please check your email for verification.")
    }
    if (resetSuccess === "true") {
      setSuccess("Password reset successfully! You can now log in with your new password.")
    }
  }, [registered, resetSuccess])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log("Login attempt with:", { email, password: "***", demoMode: demoModeActive })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Supabase auth error:", error)
        throw error
      }

      console.log("Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)

      if (demoModeActive && password !== "demo123") {
        setError("For demo mode, use any email with password: demo123")
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.")
      }
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
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription className="text-gray-400">Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {demoModeActive && (
            <div className="bg-blue-900/30 border border-blue-700 text-blue-200 p-3 rounded-md mb-4 flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Demo mode active. Use any email with password: <strong>demo123</strong>
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-200 p-3 rounded-md mb-4 flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
