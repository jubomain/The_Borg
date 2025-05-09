import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function AgentNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-green-900 border-2 border-green-700 rounded-md p-3 w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-green-700 rounded-md flex items-center justify-center mr-2">🤖</div>
        <div className="font-medium truncate">{data.name || "Agent"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">{data.description || "Agent description"}</div>
      <div className="mt-2 text-xs bg-green-800 rounded px-2 py-1">Model: {data.model || "grok-1"}</div>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </div>
  )
}

export default memo(AgentNode)
