"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import BorgLogo from "@/components/borg-logo"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Get the current site URL - this works in both development and production
      const siteUrl =
        typeof window !== "undefined"
          ? `${window.location.protocol}//${window.location.host}`
          : process.env.NEXT_PUBLIC_SITE_URL || "https://your-production-url.com"

      console.log("Using site URL for password reset:", siteUrl)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Password reset error:", err)
      setError(err.message || "Failed to send reset email. Please try again.")
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
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success ? (
            <div className="bg-green-900/30 border border-green-700 text-green-200 p-3 rounded-md mb-4 flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Password reset email sent! Check your inbox and follow the instructions to reset your password.
              </span>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
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
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
