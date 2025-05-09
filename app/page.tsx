import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the welcome chat page
  redirect("/welcome-chat")
}
