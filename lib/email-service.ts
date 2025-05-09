import nodemailer from "nodemailer"
import { createClient } from "@/lib/supabase-client"

// Email service for sending notifications
export class EmailService {
  private static instance: EmailService
  private transporter: nodemailer.Transporter | null = null
  private config: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
    from: string
  } | null = null

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  public async initialize(): Promise<boolean> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("system_settings").select("value").eq("key", "smtp_config").single()

      if (error || !data) {
        console.error("Failed to load SMTP configuration:", error)
        return false
      }

      const smtpConfig = data.value as any

      this.config = {
        host: smtpConfig.host,
        port: Number.parseInt(smtpConfig.port),
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.username,
          pass: smtpConfig.password,
        },
        from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
      }

      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: this.config.auth,
      })

      // Verify connection
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error("Failed to initialize email service:", error)
      this.transporter = null
      this.config = null
      return false
    }
  }

  public async sendEmail(options: {
    to: string | string[]
    subject: string
    text?: string
    html?: string
    attachments?: any[]
  }): Promise<boolean> {
    try {
      if (!this.transporter || !this.config) {
        const initialized = await this.initialize()
        if (!initialized) {
          throw new Error("Email service not initialized")
        }
      }

      const mailOptions = {
        from: this.config!.from,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      }

      await this.transporter!.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }
}

// Export a singleton instance
export const emailService = EmailService.getInstance()
