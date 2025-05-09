import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function DataNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-md p-3 w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center mr-2">💾</div>
        <div className="font-medium truncate">{data.label || "Data"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">Source: {data.dataSource || "undefined"}</div>
      {data.table && <div className="text-xs text-gray-300 truncate">Table: {data.table}</div>}
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </div>
  )
}

export default memo(DataNode)
