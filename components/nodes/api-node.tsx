import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function ApiNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-orange-900 border-2 border-orange-700 rounded-md p-3 w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-orange-700 rounded-md flex items-center justify-center mr-2">🔌</div>
        <div className="font-medium truncate">{data.name || "API"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">{data.description || "API integration"}</div>
      <div className="mt-2 text-xs bg-orange-800 rounded px-2 py-1">Method: {data.method || "GET"}</div>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </div>
  )
}

export default memo(ApiNode)
