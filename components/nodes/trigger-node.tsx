import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function TriggerNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-blue-900 border-2 border-blue-700 rounded-md p-3 w-48">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center mr-2">⏰</div>
        <div className="font-medium truncate">{data.label || "Trigger"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">
        {data.triggerType === "cron"
          ? `Cron: ${data.cronExpression || "* * * * *"}`
          : `Webhook: ${data.webhookUrl || "URL not set"}`}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </div>
  )
}

export default memo(TriggerNode)
