import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { host, port, username, password, fromEmail, fromName, secure } = data

    // Create a test transporter
    const transporter = nodemailer.createTransport({
      host,
      port: Number.parseInt(port),
      secure: secure,
      auth: {
        user: username,
        pass: password,
      },
    })

    // Verify the connection
    await transporter.verify()

    // Send a test email
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: username, // Send to the same email for testing
      subject: "SMTP Test - Borg Framework",
      text: "This is a test email to verify your SMTP configuration.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>SMTP Configuration Test</h2>
          <p>This is a test email to verify your SMTP configuration for the Borg Framework.</p>
          <p>If you're receiving this email, your SMTP configuration is working correctly.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated message from the Borg Framework.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("SMTP test failed:", error)
    return NextResponse.json(
      {
        error: "SMTP test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
