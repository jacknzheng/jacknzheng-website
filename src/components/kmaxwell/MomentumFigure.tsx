import { useId, useState } from 'react'
import data from '../../data/kmaxwell/experiments.json'
import { kernel, meanAge, weightsAt } from './math'
import {
  Axes,
  Chart,
  Choices,
  colors,
  formatStep,
  Legend,
  linePath,
  scale,
} from './Chart'

export type Optimizer = 'muon' | 'muonh'
export type MomentumSelection = {
  optimizer: Optimizer
  step: number
  onOptimizerChange: (optimizer: Optimizer) => void
}

export default function MomentumFigure({
  optimizer,
  step,
  onOptimizerChange,
  onStepChange,
}: MomentumSelection & { onStepChange: (step: number) => void }) {
  const [buffer, setBuffer] = useState<number | null>(null)
  const recipe = data.recipes[optimizer]
  const training = data.training[optimizer]
  const h = optimizer === 'muonh'
  const weights = weightsAt(recipe, step)
  const active = step >= recipe.onset
  const age = active ? meanAge(recipe.betas, weights) : 19
  const id = useId()
  const switchOptimizer = (next: Optimizer) => {
    onOptimizerChange(next)
    setBuffer(null)
  }
  const kx = scale([0, 300], [48, 344])
  const ky = (v: number) =>
    scale([-5, -1], [227, 30])(Math.log10(Math.max(1e-5, v)))
  const lags = Array.from({ length: 301 }, (_, i) => i)
  const kernels = [
    {
      name: 'Single EMA',
      color: colors.baseline,
      dash: '5 4',
      value: (lag: number) => kernel([0.95], [1], lag),
    },
    {
      name: 'Bi-Maxwell reference',
      color: colors.bimaxwell,
      dash: undefined,
      value: (lag: number) => kernel([0.85, 0.98], [0.4385, 0.5615], lag),
    },
    {
      name: 'K-Maxwell',
      color: colors.kmaxwell,
      dash: undefined,
      value: (lag: number) =>
        active ? kernel(recipe.betas, weights, lag) : kernel([0.95], [1], lag),
    },
  ]

  return (
    <figure
      className="km-figure km-opening km-memory"
      id="momentum-explorer"
      aria-label="Momentum and buffer explorer"
    >
      <section aria-labelledby={`${id}-memory`}>
        <h3 id={`${id}-memory`}>How much does momentum remember?</h3>
        <p className="km-subtitle">
          Mean gradient age: <strong>{age.toFixed(1)} steps</strong>
        </p>
        <div className="km-chart-layout km-chart-with-controls">
          <Chart
            title="Momentum weight by gradient age"
            description="Logarithmic weight axis. K-Maxwell is blue, Bi-Maxwell black, single EMA dashed gray. Select a buffer below to inspect its contribution."
          >
            <Axes
              x={kx}
              y={ky}
              xTicks={[0, 100, 200, 300]}
              yTicks={[1e-5, 1e-4, 1e-3, 1e-2, 1e-1]}
              xLabel="Gradient age (steps ago)"
              yLabel="Momentum weight · log scale"
              formatY={(n) =>
                ({
                  '0.1': '10⁻¹',
                  '0.01': '10⁻²',
                  '0.001': '10⁻³',
                  '0.0001': '10⁻⁴',
                  '0.00001': '10⁻⁵',
                })[String(n)] ?? ''
              }
            />
            {kernels.map((k) => (
              <path
                key={k.name}
                d={linePath(
                  lags
                    .filter((lag) => k.value(lag) >= 1e-5)
                    .map((lag) => ({ x: kx(lag), y: ky(k.value(lag)) })),
                )}
                fill="none"
                stroke={k.color}
                strokeWidth="2"
                strokeDasharray={k.dash}
              />
            ))}
            {active && buffer !== null && (
              <path
                d={linePath(
                  lags
                    .filter(
                      (lag) =>
                        kernel(
                          [recipe.betas[buffer]],
                          [weights[buffer]],
                          lag,
                        ) >= 1e-5,
                    )
                    .map((lag) => ({
                      x: kx(lag),
                      y: ky(
                        kernel([recipe.betas[buffer]], [weights[buffer]], lag),
                      ),
                    })),
                )}
                fill="none"
                stroke={colors.kmaxwell}
                strokeWidth="2"
                strokeDasharray="2 3"
              />
            )}
          </Chart>
          <div className="km-chart-sidebar">
            <div className="km-toolbar">
              <Choices
                label="Optimizer"
                value={optimizer}
                choices={[
                  { value: 'muon', label: 'Muon' },
                  { value: 'muonh', label: 'MuonH' },
                ]}
                onChange={switchOptimizer}
              />
            </div>
            <Legend />
          </div>
        </div>
        {!active && (
          <p className="km-readout">Single EMA until step {recipe.onset}.</p>
        )}
      </section>
      <div className="km-time-control">
        <label htmlFor={`${id}-step`}>
          Training step <output>{formatStep(step)}</output>
        </label>
        <input
          id={`${id}-step`}
          type="range"
          min={0}
          max={recipe.end}
          step="1"
          value={step}
          onChange={(e) => onStepChange(Number(e.target.value))}
        />
        <div className="km-shortcuts">
          {['Start', 'Middle', 'End'].map((label, i) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                onStepChange(
                  Math.round(
                    recipe.onset + ((recipe.end - recipe.onset) * i) / 2,
                  ),
                )
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="km-buffer-heading">
        Buffer weights · select to highlight
      </div>
      <div
        className="km-buffers"
        data-count={recipe.betas.length}
        role="group"
        aria-label="Inspect individual momentum buffers"
      >
        {recipe.betas.map((beta, i) => (
          <button
            key={beta}
            type="button"
            aria-pressed={buffer === i}
            disabled={!active}
            onClick={() => setBuffer(buffer === i ? null : i)}
            aria-label={`Buffer ${i + 1}, mean age ${(beta / (1 - beta)).toFixed(1)} steps, ${(weights[i] * 100).toFixed(1)} percent weight`}
          >
            <span className="km-buffer-bar">
              <i style={{ height: `${weights[i] * 100}%` }} />
            </span>
            <strong>{(beta / (1 - beta)).toFixed(1)}</strong>
            <span>steps</span>
            <small>
              {active ? `${(weights[i] * 100).toFixed(1)}%` : 'inactive'}
            </small>
          </button>
        ))}
      </div>
      <details className="km-details">
        <summary>How it works</summary>
        <p>
          The buffers keep fixed memory timescales; the slider changes their
          mixture weights. Curves show the scheduled profile, excluding the
          initialization transient and common Nesterov contribution.
          {h &&
            ' Bi-Maxwell is a reference profile, not a MuonH experiment.'}{' '}
          <a href={training.source}>Experiment report ↗</a>
        </p>
      </details>
    </figure>
  )
}
