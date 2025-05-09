import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function SlackNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-indigo-900 border-2 border-indigo-700 rounded-md p-3 w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-indigo-700 rounded-md flex items-center justify-center mr-2">💬</div>
        <div className="font-medium truncate">{data.name || "Slack"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">{data.description || "Slack integration"}</div>
      <div className="mt-2 text-xs bg-indigo-800 rounded px-2 py-1">Channel: {data.channel || "general"}</div>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </div>
  )
}

export default memo(SlackNode)
