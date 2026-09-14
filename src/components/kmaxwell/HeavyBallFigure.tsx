import { useEffect, useId, useRef, useState } from 'react'
import { project3D } from './math'
import { Choices } from './Chart'

// A quadratic bowl with elliptical level sets. The path is computed from
// Polyak's update, not drawn by hand; interpolation stays on the surface.
// η × curvature = 1.92: plain gradient descent is stable, but almost at
// its oscillation limit of 2 along the steep direction.
const curvature = 16
const learningRate = 0.12
const loss = (x: number, y: number) => (x * x + curvature * y * y) / 2
const project = (x: number, y: number) => {
  const p = project3D([x, loss(x, y) * 0.11, y], 0.5, 0.75)
  return { x: 310 + p.x * 106, y: 282 - p.y * 106, depth: p.depth }
}
function makeTrajectory(beta: number) {
  const points = [{ x: -1.75, y: 1.05 }]
  let vx = 0, vy = 0
  for (let i = 0; i < 64; i++) {
    const p = points[i]
    vx = beta * vx + p.x
    vy = beta * vy + curvature * p.y
    points.push({ x: p.x - learningRate * vx, y: p.y - learningRate * vy })
  }
  return points
}
const trajectories = {
  momentum: makeTrajectory(0.72),
  none: makeTrajectory(0),
}
type Method = keyof typeof trajectories
const lastStep = trajectories.momentum.length - 1
const surface = Array.from({ length: 28 * 20 }, (_, i) => {
  const x = -2.1 + (i % 28) * 4.2 / 28
  const y = -1.3 + Math.floor(i / 28) * 2.6 / 20
  const corners = [[x, y], [x + 4.2 / 28, y], [x + 4.2 / 28, y + 2.6 / 20], [x, y + 2.6 / 20]]
  const points = corners.map(([a, b]) => project(a, b))
  return {
    points: points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),
    depth: points.reduce((sum, p) => sum + p.depth, 0) / 4,
    shade: 93 - loss(x, y) * 0.5,
  }
}).sort((a, b) => a.depth - b.depth)

export default function HeavyBallFigure() {
  const id = useId()
  const [method, setMethod] = useState<Method>('momentum')
  const trajectory = trajectories[method]
  const [step, setStep] = useState(7)
  const [playing, setPlaying] = useState(false)
  const currentStep = useRef(step)
  const changeStep = (next: number) => {
    currentStep.current = next
    setStep(next)
  }

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let previous: number | undefined
    const animate = (now: number) => {
      const elapsed = previous === undefined ? 0 : Math.min(now - previous, 100)
      previous = now
      const next = Math.min(lastStep, currentStep.current + elapsed / 160)
      currentStep.current = next
      setStep(next)
      if (next >= lastStep) setPlaying(false)
      else frame = requestAnimationFrame(animate)
    }
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false) }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [playing])

  const index = Math.floor(step)
  const start = trajectory[index]
  const end = trajectory[Math.min(index + 1, lastStep)]
  const fraction = step - index
  const position = { x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction }
  const ball = project(position.x, position.y)
  // Sample each step so the trail follows the curved surface between updates.
  const trail = Array.from({ length: Math.floor(step * 10) + 1 }, (_, i) => {
    const t = i / 10, n = Math.floor(t), f = t - n
    const a = trajectory[n], b = trajectory[Math.min(n + 1, lastStep)]
    return project(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f)
  })
  trail.push(ball)
  const origin = project(0, 0)

  return (
    <figure className="km-figure km-heavy-ball" id="heavy-ball">
      <div className="km-figure-heading">
        <h3>Momentum on a quadratic bowl</h3>
        <p>A steeper valley makes gradient descent zigzag. Compare both methods at the same learning rate.</p>
      </div>
      <div className="km-toolbar">
        <Choices<Method>
          label="Bowl optimization method"
          value={method}
          choices={[{ value: 'momentum', label: 'Momentum' }, { value: 'none', label: 'No momentum' }]}
          onChange={next => { setPlaying(false); setMethod(next) }}
        />
      </div>
      <svg className="km-chart" viewBox="0 0 620 370" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>A ball descending a gridded quadratic loss surface</title>
        <desc id={`${id}-desc`}>An elliptical bowl with a blue {method === 'momentum' ? 'Polyak momentum' : 'gradient descent without momentum'} trajectory approaching its single minimum. Use the controls below to follow the optimization steps.</desc>
        <defs>
          <radialGradient id={`${id}-ball`} cx="30%" cy="25%" r="75%">
            <stop offset="0" stopColor="#9ebce3" />
            <stop offset="0.45" stopColor="#3976c4" />
            <stop offset="1" stopColor="#183e73" />
          </radialGradient>
        </defs>
        <g stroke="#899397" strokeOpacity="0.48" strokeWidth="0.55" strokeLinejoin="round">
          {surface.map((cell, i) => <polygon key={i} points={cell.points} fill={`hsl(205 13% ${cell.shade}%)`} />)}
        </g>
        <circle cx={origin.x} cy={origin.y} r="4" fill="#f7f5f2" stroke="#6d777c" strokeWidth="1.2" />
        <path d={trail.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')} fill="none" stroke="#245eb5" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={ball.x + 2} cy={ball.y + 2} rx="8" ry="3" fill="#183e73" opacity="0.15" />
        <circle cx={ball.x} cy={ball.y - 6} r="7" fill={`url(#${id}-ball)`} stroke="#173e75" strokeWidth="0.7" />
        <path d={`M${origin.x + 10},${origin.y + 9} L${origin.x + 35},330 H${origin.x + 64}`} fill="none" stroke="#8c918f" strokeWidth="0.8" />
        <text x={origin.x + 70} y="334">Minimum</text>
      </svg>
      <div className="km-ball-controls">
        <button type="button" onClick={() => {
          if (!playing && step >= lastStep) changeStep(0)
          setPlaying(!playing)
        }}>{playing ? 'Pause' : step >= lastStep ? 'Replay' : 'Play'}</button>
        <button type="button" onClick={() => { setPlaying(false); changeStep(0) }}>Reset</button>
        <label htmlFor={`${id}-step`}>Step <output>{Math.floor(step)}</output></label>
        <input id={`${id}-step`} aria-label="Momentum simulation step" type="range" min="0" max={lastStep} step="0.1" value={step} onChange={e => { setPlaying(false); changeStep(Number(e.target.value)) }} />
      </div>
      <figcaption>
        A quadratic loss, L(x, y) = ½(x² + {curvature}y²), with {curvature}× greater curvature across the valley than along it.
        {' '}The blue path follows {method === 'momentum' ? 'Polyak momentum (η = 0.12, β = 0.72)' : 'gradient descent without momentum (η = 0.12, β = 0)'}.
        {' '}Switch methods to compare their positions at the same step.
        {' '}Without momentum, the learning rate is close to the stability limit, producing repeated overshoots across the valley.
      </figcaption>
    </figure>
  )
}
