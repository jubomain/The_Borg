import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

function ConditionNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-yellow-900 border-2 border-yellow-700 rounded-md p-3 w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-yellow-700 rounded-md flex items-center justify-center mr-2">⚙️</div>
        <div className="font-medium truncate">{data.label || "Condition"}</div>
      </div>
      <div className="text-xs text-gray-300 truncate">{data.condition || "condition == true"}</div>
      <div className="flex justify-between mt-2">
        <div className="text-xs bg-green-800 rounded px-2 py-1">{data.trueLabel || "True"}</div>
        <div className="text-xs bg-red-800 rounded px-2 py-1">{data.falseLabel || "False"}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: "30%" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: "70%" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}

export default memo(ConditionNode)
