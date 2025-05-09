"use client"

import { useEffect, useRef } from "react"

export function AnimatedTechSvg() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const animate = () => {
      if (!svgRef.current) return

      // Get all the circle elements
      const circles = svgRef.current.querySelectorAll(".node-circle")
      const lines = svgRef.current.querySelectorAll(".connector-line")

      // Animate circles
      circles.forEach((circle, index) => {
        const delay = index * 300
        setTimeout(() => {
          circle.classList.add("animate-pulse")

          // Pulse effect
          setTimeout(() => {
            circle.classList.remove("animate-pulse")
          }, 1000)
        }, delay)
      })

      // Animate lines
      lines.forEach((line, index) => {
        const delay = index * 200 + 100
        setTimeout(() => {
          line.classList.add("animate-dash")

          // Reset animation
          setTimeout(() => {
            line.classList.remove("animate-dash")
          }, 1500)
        }, delay)
      })
    }

    // Initial animation
    animate()

    // Set interval for repeated animation
    const interval = setInterval(animate, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-full max-h-64" xmlns="http://www.w3.org/2000/svg">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .node-circle {
          fill: #0c4a6e;
          stroke: #7dd3fc;
          stroke-width: 2;
          transition: all 0.3s ease;
        }
        .node-circle.animate-pulse {
          fill: #0ea5e9;
          r: 13;
        }
        .connector-line {
          stroke: #7dd3fc;
          stroke-width: 2;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
        }
        .connector-line.animate-dash {
          animation: dash 1.5s linear forwards;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        .core-circle {
          fill: #0ea5e9;
          filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.7));
        }
      `,
        }}
      />

      {/* Central node */}
      <circle cx="200" cy="150" r="25" className="core-circle" />

      {/* Satellite nodes */}
      <circle cx="100" cy="100" r="12" className="node-circle" />
      <circle cx="300" cy="100" r="12" className="node-circle" />
      <circle cx="120" cy="220" r="12" className="node-circle" />
      <circle cx="280" cy="220" r="12" className="node-circle" />
      <circle cx="200" cy="70" r="12" className="node-circle" />
      <circle cx="200" cy="230" r="12" className="node-circle" />

      {/* Connectors */}
      <line x1="200" y1="150" x2="100" y2="100" className="connector-line" />
      <line x1="200" y1="150" x2="300" y2="100" className="connector-line" />
      <line x1="200" y1="150" x2="120" y2="220" className="connector-line" />
      <line x1="200" y1="150" x2="280" y2="220" className="connector-line" />
      <line x1="200" y1="150" x2="200" y2="70" className="connector-line" />
      <line x1="200" y1="150" x2="200" y2="230" className="connector-line" />

      {/* Text */}
      <text x="200" y="155" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff">
        BORG
      </text>
    </svg>
  )
}
