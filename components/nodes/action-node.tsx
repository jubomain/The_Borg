import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function ActionNodeComponent({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-purple-900 border-2 border-purple-700 rounded-md p-3 w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-purple-700 rounded-md flex items-center justify-center mr-2">🔄</div>
        <div className="font-medium truncate">{data.label || "Action"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">Type: {data.actionType || "undefined"}</div>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </div>
  )
}

export const ActionNode = memo(ActionNodeComponent)
