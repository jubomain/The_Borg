import { EmailNotificationSetup } from "@/components/email-notification-setup"

export default function EmailSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Email Notification Setup</h1>
      <EmailNotificationSetup />
    </div>
  )
}
