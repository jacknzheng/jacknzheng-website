import { useId, useRef, useState } from 'react'
import data from '../../data/kmaxwell/experiments.json'
import { clamp, project3D } from './math'
import { Choices, scale } from './Chart'

const fixed = data.sweep.filter((p) => p.kind === 'fixed')
const annealed = data.sweep.filter((p) => p.kind === 'annealed')
type Observation = (typeof data.sweep)[number]
const nice = (value: number) => Number(value.toFixed(2)).toString()
const rangeColors: Record<number, string> = {
  56: '#737d8c',
  64: '#245eb5',
  72: '#168579',
}
const rangeSymbols: Record<number, string> = { 56: '●', 64: '◆', 72: '▲' }
const lossColor = (loss: number) =>
  `hsl(216 62% ${62 - clamp((3.284 - loss) / 0.008, 0, 1) * 37}%)`

export default function SweepFigure() {
  const [view, setView] = useState<'endpoint' | 'buffers'>('endpoint')
  const [yaw, setYaw] = useState(-0.6)
  const [pitch, setPitch] = useState(0.35)
  const [selectedId, setSelectedId] = useState('')
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const id = useId()
  const cube = view === 'endpoint'
  const points =
    view === 'buffers'
      ? [...fixed, ...annealed.filter((p) => p.mu === 0.95)]
      : annealed
  const selected = points.find((p) => p.id === selectedId)
  const ranges = [...new Set(annealed.map((p) => p.tauMax))].sort(
    (a, b) => a - b,
  )
  const normalize = (p: Observation) => [
    (p.startAge - 53) / 11,
    (p.endAge - 27) / 7,
    (p.mu - 0.95) / 0.035,
  ]
  const project = (v: number[]) => {
    const p = project3D(v, yaw, pitch)
    return { x: 310 + p.x * 155, y: 186 - p.y * 115, depth: p.depth }
  }
  const position = (p: Observation) =>
    cube
      ? project(normalize(p))
      : {
          x: scale([1, 17], [60, 570])(p.k),
          y: scale([0, 62], [305, 35])((p.startAge + p.endAge) / 2),
          depth: 0,
        }
  const corners = Array.from({ length: 8 }, (_, i) => [
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
  ])
  const flatXTicks = [2, 4, 6, 8, 12, 16]
  const flatYTicks = [0, 15, 30, 45, 60]
  const flatX = scale([1, 17], [60, 570])
  const flatY = scale([0, 62], [305, 35])
  const changeView = (v: 'endpoint' | 'buffers') => {
    setView(v)
    setSelectedId('')
  }

  return (
    <figure className="km-figure" id="figure-3">
      <div className="km-figure-heading">
        <h3>
          {view === 'endpoint'
            ? 'Starting and ending momentum memory'
            : 'Buffer count and momentum memory'}
        </h3>
      </div>
      <div className="km-chart-layout km-chart-with-controls">
        <svg
          className={`km-chart ${cube ? 'km-cube' : ''}`}
          viewBox="0 0 620 370"
          role="group"
          aria-label={
            cube
              ? 'Rotatable measured endpoint sweep. Arrow keys rotate; use the experiment selector below to inspect points.'
              : 'Measured sweep scatterplot. Use the experiment selector below to inspect points.'
          }
          tabIndex={cube ? 0 : undefined}
          onKeyDown={(e) => {
            if (!cube) return
            if (
              ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                e.key,
              )
            ) {
              e.preventDefault()
              if (e.key === 'ArrowLeft') setYaw((v) => v - 0.12)
              if (e.key === 'ArrowRight') setYaw((v) => v + 0.12)
              if (e.key === 'ArrowUp')
                setPitch((v) => clamp(v + 0.1, -1.1, 1.1))
              if (e.key === 'ArrowDown')
                setPitch((v) => clamp(v - 0.1, -1.1, 1.1))
            }
          }}
          onPointerDown={(e) => {
            if (!cube) return
            drag.current = { x: e.clientX, y: e.clientY, moved: false }
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (!cube || !drag.current) return
            const dx = e.clientX - drag.current.x,
              dy = e.clientY - drag.current.y
            if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true
            setYaw((v) => v + dx * 0.009)
            setPitch((v) => clamp(v + dy * 0.009, -1.1, 1.1))
            drag.current = {
              x: e.clientX,
              y: e.clientY,
              moved: drag.current.moved,
            }
          }}
          onPointerUp={(e) => {
            if (cube && drag.current && !drag.current.moved) {
              const bounds = e.currentTarget.getBoundingClientRect()
              const px = ((e.clientX - bounds.left) / bounds.width) * 620,
                py = ((e.clientY - bounds.top) / bounds.height) * 370
              const nearest = points
                .map((p) => ({
                  p,
                  distance: Math.hypot(position(p).x - px, position(p).y - py),
                }))
                .sort((a, b) => a.distance - b.distance)[0]
              if (nearest && nearest.distance < 20) setSelectedId(nearest.p.id)
            }
            drag.current = null
          }}
          onPointerCancel={() => {
            drag.current = null
          }}
        >
          <title>
            {cube
              ? 'Start age × end age × Nesterov coefficient'
              : 'Buffer count versus mixture age'}
          </title>
          <desc>
            {view === 'endpoint'
              ? 'Colors and shapes distinguish buffer age ranges: gray circles 3–56, blue diamonds 3–64, green triangles 3–72 steps. Select a point for its measured loss.'
              : 'Darker blue indicates lower loss; circles are fixed mixtures and diamonds are annealed.'}{' '}
            All observations use seed zero at step 3150. Data and methods
            follow.
          </desc>
          {cube ? (
            <g className="km-cube-axes">
              {corners.flatMap((c, i) =>
                [1, 2, 4]
                  .filter((bit) => !(i & bit))
                  .map((bit) => {
                    const a = project(c),
                      b = project(corners[i | bit])
                    return (
                      <line
                        key={`${i}-${bit}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                      />
                    )
                  }),
              )}
              {[
                {
                  label: 'Start age',
                  dim: 0,
                  ticks: [44, 53, 62],
                  norm: (v: number) => (v - 53) / 11,
                },
                {
                  label: 'End age',
                  dim: 1,
                  ticks: [22, 27, 32],
                  norm: (v: number) => (v - 27) / 7,
                },
                {
                  label: 'Nesterov µ',
                  dim: 2,
                  ticks: [0.92, 0.95, 0.98],
                  norm: (v: number) => (v - 0.95) / 0.035,
                },
              ].map((axis) => {
                const labelPos = [-1.18, -1.18, -1.18]
                labelPos[axis.dim] = 0
                const lp = project(labelPos)
                return (
                  <g key={axis.label}>
                    <text
                      x={lp.x - (axis.dim === 1 ? 35 : 0)}
                      y={lp.y + (axis.dim === 1 ? 4 : 48)}
                      textAnchor={axis.dim === 1 ? 'end' : 'middle'}
                      className="km-axis-title"
                    >
                      {axis.label}
                    </text>
                    {axis.ticks.map((t) => {
                      const v = [-1, -1, -1]
                      v[axis.dim] = axis.norm(t)
                      const p = project(v)
                      return (
                        <text
                          key={t}
                          x={p.x + (axis.dim === 1 ? -14 : 0)}
                          y={
                            p.y +
                            (axis.dim === 1 ? 4 : axis.dim === 2 ? -8 : 20)
                          }
                          textAnchor="middle"
                        >
                          {t}
                        </text>
                      )
                    })}
                  </g>
                )
              })}
            </g>
          ) : (
            <g className="km-axes">
              <text x="60" y="17" className="km-axis-title">
                Mean age (fixed, or average of endpoints)
              </text>
              {flatYTicks.map((t) => (
                <g key={t}>
                  <line x1="60" x2="570" y1={flatY(t)} y2={flatY(t)} />
                  <text x="50" y={flatY(t) + 4} textAnchor="end">
                    {t}
                  </text>
                </g>
              ))}
              {flatXTicks.map((t) => (
                <text key={t} x={flatX(t)} y="325" textAnchor="middle">
                  {t}
                </text>
              ))}
              <text
                x="315"
                y="349"
                textAnchor="middle"
                className="km-axis-title"
              >
                Number of buffers
              </text>
            </g>
          )}
          {points
            .slice()
            .sort((a, b) => position(a).depth - position(b).depth)
            .map((p) => {
              const pos = position(p),
                chosen = p.id === selectedId
              return (
                <g
                  key={p.id}
                  onClick={() => {
                    if (!cube) setSelectedId(p.id)
                  }}
                  className="km-sweep-point"
                >
                  {chosen && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="10"
                      fill="none"
                      stroke="#1c1c1c"
                      strokeWidth="1.2"
                    />
                  )}
                  {view === 'endpoint' ? (
                    <g fill={rangeColors[p.tauMax]}>
                      {p.tauMax === 56 ? (
                        <circle cx={pos.x} cy={pos.y} r="4.5" />
                      ) : (
                        <path
                          d={
                            p.tauMax === 72
                              ? `M${pos.x},${pos.y - 6}l6,11h-12Z`
                              : `M${pos.x},${pos.y - 5}l5,5 -5,5 -5,-5Z`
                          }
                        />
                      )}
                    </g>
                  ) : p.kind === 'fixed' ? (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="4.5"
                      fill={lossColor(p.loss)}
                    />
                  ) : (
                    <path
                      d={`M${pos.x},${pos.y - 5}l5,5 -5,5 -5,-5Z`}
                      fill={lossColor(p.loss)}
                    />
                  )}
                  <circle cx={pos.x} cy={pos.y} r="10" fill="transparent">
                    <title>{`${p.kind}: K=${p.k}, ${nice(p.startAge)} → ${nice(p.endAge)}, µ=${p.mu}; buffer ages ${nice(p.tauMin)}–${nice(p.tauMax)}; loss ${p.loss.toFixed(5)}`}</title>
                  </circle>
                </g>
              )
            })}
        </svg>
        <div className="km-chart-sidebar">
          <div className="km-toolbar">
            <Choices
              label="Sweep experiment"
              value={view}
              choices={[
                { value: 'endpoint', label: 'Annealing endpoints' },
                { value: 'buffers', label: 'Buffer count' },
              ]}
              onChange={changeView}
            />
            {cube && (
              <button
                type="button"
                onClick={() => {
                  setYaw(-0.6)
                  setPitch(0.35)
                }}
              >
                Reset view
              </button>
            )}
          </div>
          <div className="km-sweep-legend">
            {view === 'endpoint' ? (
              <>
                <span>Buffer ages</span>
                {ranges.map((range) => (
                  <span key={range}>
                    <span style={{ color: rangeColors[range] }}>
                      {rangeSymbols[range]}
                    </span>{' '}
                    3–{range} steps
                  </span>
                ))}
              </>
            ) : (
              <>
                <span>○ Fixed · ◇ Annealed</span>
                <span>
                  <i /> Darker = lower loss
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="km-instruction">
        {cube
          ? 'Drag to rotate · select a point'
          : 'Select a point to see its loss'}
      </p>
      {selected && (
        <p className="km-point-readout" aria-live="polite">
          {nice(selected.startAge)} → {nice(selected.endAge)} steps · µ{' '}
          {selected.mu} · <strong>loss {selected.loss.toFixed(5)}</strong> ·{' '}
          <a href={selected.source}>Source</a>
        </p>
      )}
      <details className="km-details">
        <summary>Data & methods</summary>
        <p>
          Each point is a measured seed-0 run at step 3,150. The endpoint sweep
          shows all buffer age ranges together; loss appears when you select a
          point. These are sparse measurements, not an interpolated grid. The
          buffer-count view also varies ranges and weights, so it is not an
          isolated comparison of buffer count.
        </p>
        <label
          className="km-select km-experiment-select"
          htmlFor={`${id}-experiment`}
        >
          Measured experiment
          <select
            aria-label="Measured experiment"
            id={`${id}-experiment`}
            value={selected?.id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select an experiment…</option>
            {points.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >{`K=${p.k} · ${nice(p.startAge)}→${nice(p.endAge)} · µ=${p.mu} · loss ${p.loss.toFixed(5)} · ${p.id.startsWith('mu-') ? 'µ screen' : p.kind}`}</option>
            ))}
          </select>
        </label>
        <div className="km-data-table">
          <table>
            <caption>
              Current selection: {points.length} measured configurations.
            </caption>
            <thead>
              <tr>
                <th>K</th>
                <th>Age</th>
                <th>Buffer range</th>
                <th>µ</th>
                <th>Loss</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.id}>
                  <td>{p.k}</td>
                  <td>
                    {nice(p.startAge)} → {nice(p.endAge)}
                  </td>
                  <td>
                    {nice(p.tauMin)}–{nice(p.tauMax)}
                  </td>
                  <td>{p.mu}</td>
                  <td>{p.loss.toFixed(5)}</td>
                  <td>
                    <a href={p.source}>Log</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
