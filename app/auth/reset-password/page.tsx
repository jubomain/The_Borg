"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import BorgLogo from "@/components/borg-logo"
import { AlertCircle, Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)

  // Handle hash fragment for Supabase auth tokens
  useEffect(() => {
    // Check if we have a hash in the URL (Supabase auth redirect)
    const handleHashRedirect = async () => {
      if (window.location.hash) {
        console.log("Found hash fragment, handling auth redirect")

        try {
          // Let Supabase handle the hash fragment
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting session from hash:", error)
            setTokenError("Invalid or expired reset token. Please request a new password reset link.")
          } else if (!data.session) {
            console.error("No session found from hash")
            setTokenError("No valid session found. Please request a new password reset link.")
          } else {
            console.log("Successfully processed auth redirect")
          }
        } catch (err) {
          console.error("Error processing auth redirect:", err)
          setTokenError("Error processing authentication. Please try again or request a new reset link.")
        }
      } else {
        // Check for token in query params (fallback)
        const token = searchParams.get("token")
        if (token) {
          console.log("Found token in query params")
          // Handle token from query params if needed
        }
      }
    }

    handleHashRedirect()
  }, [searchParams])

  async function handleResetPassword(e: React.FormEvent) {
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
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      // Redirect to login with success message
      router.push("/auth/login?reset=true")
    } catch (err: any) {
      console.error("Password reset error:", err)
      setError(err.message || "Failed to reset password. Please try again.")
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
          <CardTitle className="text-2xl font-bold">Create new password</CardTitle>
          <CardDescription className="text-gray-400">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          {tokenError ? (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{tokenError}</p>
                <p className="mt-2">
                  <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300 underline">
                    Request a new password reset
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-md mb-4 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    New Password
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
                    Confirm New Password
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
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
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
