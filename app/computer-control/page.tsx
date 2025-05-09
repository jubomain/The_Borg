import ComputerControlAgent from "@/components/agents/computer-control-agent"

export const metadata = {
  title: "Computer Control - Borg Framework",
  description: "Control and monitor your computer system using natural language",
}

export default function ComputerControlPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Computer Control</h1>
      <ComputerControlAgent />
    </div>
  )
}
