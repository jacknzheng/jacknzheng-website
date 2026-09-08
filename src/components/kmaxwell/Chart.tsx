import { useId } from 'react'
import type { ReactNode } from 'react'

export const colors = {
  kmaxwell: '#245eb5',
  bimaxwell: '#252525',
  baseline: '#777975',
}
export const formatStep = (value: number) => value.toLocaleString('en-US')
export const formatDelta = (value: number) =>
  `${value > 0 ? '+' : ''}${value.toFixed(5)}`
export const scale = (domain: number[], range: number[]) => (value: number) =>
  range[0] +
  ((value - domain[0]) / (domain[1] - domain[0])) * (range[1] - range[0])
export const linePath = (points: { x: number; y: number }[]) =>
  points
    .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')

export function Chart({
  title,
  description,
  width = 360,
  height = 270,
  children,
}: {
  title: string
  description: string
  width?: number
  height?: number
  children: ReactNode
}) {
  const id = useId()
  return (
    <svg
      className="km-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{description}</desc>
      {children}
    </svg>
  )
}

export function Axes({
  xTicks,
  yTicks,
  x,
  y,
  xLabel,
  yLabel,
  width = 360,
  height = 270,
  left = 48,
  formatX = String,
  formatY = String,
}: {
  xTicks: number[]
  yTicks: number[]
  x: (n: number) => number
  y: (n: number) => number
  xLabel: string
  yLabel: string
  width?: number
  height?: number
  left?: number
  formatX?: (n: number) => string
  formatY?: (n: number) => string
}) {
  return (
    <g className="km-axes">
      <text x={left} y="15" className="km-axis-title">
        {yLabel}
      </text>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={left} x2={width - 16} y1={y(t)} y2={y(t)} />
          <text x={left - 7} y={y(t) + 4} textAnchor="end">
            {formatY(t)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={height - 43} y2={height - 39} />
          <text x={x(t)} y={height - 23} textAnchor="middle">
            {formatX(t)}
          </text>
        </g>
      ))}
      <text
        x={(left + width - 16) / 2}
        y={height - 3}
        textAnchor="middle"
        className="km-axis-title"
      >
        {xLabel}
      </text>
    </g>
  )
}

export function Choices<T extends string>({
  label,
  value,
  choices,
  onChange,
}: {
  label: string
  value: T
  choices: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="km-choices" role="group" aria-label={label}>
      {choices.map((c) => (
        <button
          key={c.value}
          type="button"
          aria-pressed={value === c.value}
          onClick={() => onChange(c.value)}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

export function Legend({ muonh = false }: { muonh?: boolean }) {
  return (
    <div className="km-legend" aria-label="Curve legend">
      <span>
        <i style={{ borderColor: colors.kmaxwell }} />
        K-Maxwell
      </span>
      {!muonh && (
        <span>
          <i style={{ borderColor: colors.bimaxwell }} />
          Bi-Maxwell
        </span>
      )}
      <span>
        <i style={{ borderColor: colors.baseline, borderTopStyle: 'dashed' }} />
        {muonh ? 'Published baseline' : 'Single EMA'}
      </span>
    </div>
  )
}
