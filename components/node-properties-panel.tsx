"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Trash2 } from "lucide-react"

export function NodePropertiesPanel() {
  const [nodeType, setNodeType] = useState("agent")
  const [nodeName, setNodeName] = useState("Agent Node")
  const [nodeDescription, setNodeDescription] = useState("This is an agent node")

  // Agent-specific properties
  const [agentModel, setAgentModel] = useState("gpt-4")
  const [agentTemperature, setAgentTemperature] = useState(0.7)
  const [agentInstructions, setAgentInstructions] = useState("You are a helpful assistant.")

  // Trigger-specific properties
  const [triggerType, setTriggerType] = useState("schedule")
  const [triggerSchedule, setTriggerSchedule] = useState("0 0 * * *")
  const [triggerWebhookUrl, setTriggerWebhookUrl] = useState("")

  // Action-specific properties
  const [actionType, setActionType] = useState("http")
  const [actionEndpoint, setActionEndpoint] = useState("https://api.example.com")
  const [actionMethod, setActionMethod] = useState("POST")
  const [actionHeaders, setActionHeaders] = useState("{}")
  const [actionBody, setActionBody] = useState("{}")

  // Condition-specific properties
  const [conditionExpression, setConditionExpression] = useState("data.value > 10")

  // Data-specific properties
  const [dataType, setDataType] = useState("json")
  const [dataSchema, setDataSchema] = useState("{}")

  const handleSave = () => {
    // In a real implementation, this would update the node in the workflow
    alert("Node properties saved!")
  }

  const handleDelete = () => {
    // In a real implementation, this would delete the node from the workflow
    alert("Node deleted!")
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Node Properties</h3>
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="node-type">Node Type</Label>
            <Select value={nodeType} onValueChange={setNodeType}>
              <SelectTrigger id="node-type">
                <SelectValue placeholder="Select node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="trigger">Trigger</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="node-name">Name</Label>
            <Input id="node-name" value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="node-description">Description</Label>
            <Textarea
              id="node-description"
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Agent-specific properties */}
          {nodeType === "agent" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-model">Model</Label>
                <Select value={agentModel} onValueChange={setAgentModel}>
                  <SelectTrigger id="agent-model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-2">Claude 2</SelectItem>
                    <SelectItem value="llama-2-70b">Llama 2 70B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="agent-temperature">Temperature: {agentTemperature}</Label>
                <Input
                  id="agent-temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={agentTemperature}
                  onChange={(e) => setAgentTemperature(Number.parseFloat(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="agent-instructions">Instructions</Label>
                <Textarea
                  id="agent-instructions"
                  value={agentInstructions}
                  onChange={(e) => setAgentInstructions(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Trigger-specific properties */}
          {nodeType === "trigger" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="trigger-type">Trigger Type</Label>
                <Select value={triggerType} onValueChange={setTriggerType}>
                  <SelectTrigger id="trigger-type">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {triggerType === "schedule" && (
                <div>
                  <Label htmlFor="trigger-schedule">Schedule (cron)</Label>
                  <Input
                    id="trigger-schedule"
                    value={triggerSchedule}
                    onChange={(e) => setTriggerSchedule(e.target.value)}
                    placeholder="0 0 * * *"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: minute hour day month weekday</p>
                </div>
              )}

              {triggerType === "webhook" && (
                <div>
                  <Label htmlFor="trigger-webhook">Webhook URL</Label>
                  <Input
                    id="trigger-webhook"
                    value={triggerWebhookUrl}
                    onChange={(e) => setTriggerWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action-specific properties */}
          {nodeType === "action" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="action-type">Action Type</Label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger id="action-type">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP Request</SelectItem>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="database">Database Operation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {actionType === "http" && (
                <>
                  <div>
                    <Label htmlFor="action-endpoint">Endpoint URL</Label>
                    <Input
                      id="action-endpoint"
                      value={actionEndpoint}
                      onChange={(e) => setActionEndpoint(e.target.value)}
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-method">Method</Label>
                    <Select value={actionMethod} onValueChange={setActionMethod}>
                      <SelectTrigger id="action-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="action-headers">Headers (JSON)</Label>
                    <Textarea
                      id="action-headers"
                      value={actionHeaders}
                      onChange={(e) => setActionHeaders(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="action-body">Body (JSON)</Label>
                    <Textarea
                      id="action-body"
                      value={actionBody}
                      onChange={(e) => setActionBody(e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Condition-specific properties */}
          {nodeType === "condition" && (
            <div>
              <Label htmlFor="condition-expression">Condition Expression</Label>
              <Textarea
                id="condition-expression"
                value={conditionExpression}
                onChange={(e) => setConditionExpression(e.target.value)}
                rows={3}
                placeholder="data.value > 10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use JavaScript expressions to define conditions. Access input data using the 'data' object.
              </p>
            </div>
          )}

          {/* Data-specific properties */}
          {nodeType === "data" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="data-type">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data-schema">Schema (JSON)</Label>
                <Textarea
                  id="data-schema"
                  value={dataSchema}
                  onChange={(e) => setDataSchema(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
