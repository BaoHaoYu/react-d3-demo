import * as React from 'react'

export function SvgDemo() {
  return (
    <div>
      <svg width="300" height="200">
        <line />

        <rect width="100%" height="100%" fill="#00d8e2" />

        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="green"
          stroke-width="4"
          fill="yellow"
        />
      </svg>
    </div>
  )
}
