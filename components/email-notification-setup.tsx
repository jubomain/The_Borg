"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Mail, Server, Shield, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function EmailNotificationSetup() {
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
    secure: true,
  })
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [savedStatus, setSavedStatus] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSmtpConfig({
      ...smtpConfig,
      [name]: type === "checkbox" ? checked : value,
    })
    setSavedStatus(false)
  }

  const handleTestConnection = async () => {
    setTestStatus("loading")
    try {
      // In a real implementation, this would call an API endpoint to test the SMTP connection
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTestStatus("success")
    } catch (error) {
      setTestStatus("error")
    }
  }

  const handleSaveConfig = async () => {
    try {
      // In a real implementation, this would call an API endpoint to save the SMTP configuration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSavedStatus(true)
    } catch (error) {
      setSavedStatus(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notification Setup
        </CardTitle>
        <CardDescription>
          Configure SMTP settings to enable email notifications for your Borg Framework instance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="smtp">
          <TabsList className="mb-4">
            <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="events">Notification Events</TabsTrigger>
          </TabsList>

          <TabsContent value="smtp">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">SMTP Host</Label>
                  <div className="flex items-center">
                    <Server className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="host"
                      name="host"
                      placeholder="smtp.example.com"
                      value={smtpConfig.host}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">SMTP Port</Label>
                  <Input id="port" name="port" placeholder="587" value={smtpConfig.port} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">SMTP Username</Label>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="username"
                      name="username"
                      placeholder="username@example.com"
                      value={smtpConfig.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">SMTP Password</Label>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={smtpConfig.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    placeholder="notifications@yourdomain.com"
                    value={smtpConfig.fromEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    name="fromName"
                    placeholder="Borg Notifications"
                    value={smtpConfig.fromName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="secure"
                  name="secure"
                  checked={smtpConfig.secure}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                <Label htmlFor="secure" className="text-sm font-medium text-gray-700">
                  Use secure connection (TLS/SSL)
                </Label>
              </div>

              {testStatus === "success" && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Connection successful</AlertTitle>
                  <AlertDescription>Your SMTP server connection was tested successfully.</AlertDescription>
                </Alert>
              )}

              {testStatus === "error" && (
                <Alert className="bg-red-50 text-red-800 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle>Connection failed</AlertTitle>
                  <AlertDescription>
                    Unable to connect to the SMTP server. Please check your settings and try again.
                  </AlertDescription>
                </Alert>
              )}

              {savedStatus && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Settings saved</AlertTitle>
                  <AlertDescription>Your SMTP configuration has been saved successfully.</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Email Templates</h3>
              <p className="text-gray-500 mt-2 mb-4">Configure email templates for different notification types.</p>
              <Button>Manage Templates</Button>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Notification Events</h3>
              <p className="text-gray-500 mt-2 mb-4">Configure which events trigger email notifications.</p>
              <Button>Configure Events</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "loading"}>
          {testStatus === "loading" ? "Testing..." : "Test Connection"}
        </Button>
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </CardFooter>
    </Card>
  )
}
