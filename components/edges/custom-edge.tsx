import { memo } from "react"
import { type EdgeProps, getBezierPath } from "reactflow"

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      {data?.label && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: "12px" }}
            startOffset="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
          >
            {data.label}
          </textPath>
        </text>
      )}
    </>
  )
}

export default memo(CustomEdge)
