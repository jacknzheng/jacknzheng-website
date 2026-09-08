import { useId } from 'react'
import data from '../../data/kmaxwell/experiments.json'
import { threshold } from './math'
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
import type { MomentumSelection } from './MomentumFigure'

export default function TrainingFigure({
  optimizer,
  step,
  onOptimizerChange,
}: MomentumSelection) {
  const recipe = data.recipes[optimizer]
  const training = data.training[optimizer]
  const h = optimizer === 'muonh'
  const record = h ? 3065 : 3160
  const start = h ? 3000 : 2900
  const id = useId()
  const series = [
    {
      name: 'K-Maxwell',
      points: training.kmaxwell,
      color: colors.kmaxwell,
      n: 8,
      pass: record,
      source: training.source,
    },
    ...(!h
      ? [
          {
            name: 'Bi-Maxwell',
            points: training.bimaxwell,
            color: colors.bimaxwell,
            n: 8,
            pass: 3210,
            source: training.bimaxwellSource,
          },
        ]
      : []),
    {
      name: h ? 'Published MuonH baseline' : 'Single EMA',
      points: training.baseline,
      color: colors.baseline,
      n: h ? 20 : 10,
      pass: recipe.end,
      source: training.baselineSource,
    },
  ].map((series) => ({
    ...series,
    points: series.points.filter(
      (p) => p.step >= start && p.step <= recipe.end,
    ),
  }))
  const x = scale([start, recipe.end], [48, 344])
  const visibleLosses = series.flatMap((s) =>
    s.points.filter((p) => p.step >= start).map((p) => p.loss),
  )
  const yMin = Math.floor((Math.min(...visibleLosses) - 0.001) * 1000) / 1000
  const yMax = Math.ceil((Math.max(...visibleLosses) + 0.001) * 1000) / 1000
  const y = scale([yMin, yMax], [227, 30])
  const yTicks = Array.from(
    { length: 5 },
    (_, i) => yMin + ((yMax - yMin) * i) / 4,
  )

  return (
    <figure
      className="km-figure km-opening km-training"
      id="training-results"
      aria-label="Training results"
    >
      <section aria-labelledby={`${id}-training`}>
        <h3 id={`${id}-training`}>K-Maxwell reaches the target sooner</h3>
        <p className="km-subtitle">
          {formatStep(recipe.end)} → <strong>{formatStep(record)} steps</strong>
        </p>
        <div className="km-chart-layout km-chart-with-controls">
          <Chart
            title={`${h ? 'MuonH' : 'Muon'} validation loss`}
            description="Lower loss is better. Lines connect measured checkpoints. The vertical blue line follows the iteration slider. Exact measurements and sources follow the figure."
          >
            <defs>
              <clipPath id={`${id}-loss-clip`}>
                <rect x="48" y="27" width="299" height="203" />
              </clipPath>
            </defs>
            <Axes
              x={x}
              y={y}
              xTicks={h ? [3000, 3065, 3125] : [2900, 3050, 3160, 3250]}
              yTicks={yTicks}
              xLabel="Training step"
              yLabel="Validation loss ↓"
              formatX={formatStep}
              formatY={(n) => n.toFixed(3)}
            />
            <g clipPath={`url(#${id}-loss-clip)`}>
              <line
                className="km-target"
                x1="48"
                x2="344"
                y1={y(3.28)}
                y2={y(3.28)}
              />
              <text x="52" y={y(3.28) - 6} className="km-chart-note">
                Target 3.28
              </text>
              <line
                x1="48"
                x2="344"
                y1={y(threshold(8))}
                y2={y(threshold(8))}
                stroke={colors.kmaxwell}
                strokeOpacity="0.3"
                strokeDasharray="2 4"
              />
              <line
                x1="48"
                x2="344"
                y1={y(threshold(h ? 20 : 10))}
                y2={y(threshold(h ? 20 : 10))}
                stroke={colors.baseline}
                strokeOpacity="0.4"
                strokeDasharray="2 4"
              />
              {series
                .slice()
                .reverse()
                .map((s) => (
                  <g key={s.name}>
                    <path
                      d={linePath(
                        s.points.map((p) => ({ x: x(p.step), y: y(p.loss) })),
                      )}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2"
                      strokeDasharray={
                        s.color === colors.baseline ? '5 4' : undefined
                      }
                    />
                    {s.points
                      .filter((p) => p.step >= start)
                      .map((p) => (
                        <circle
                          key={p.step}
                          cx={x(p.step)}
                          cy={y(p.loss)}
                          r={p.step === s.pass ? 4.5 : 1.8}
                          fill={s.color}
                        >
                          <title>{`${s.name}: ${p.loss.toFixed(5)} at step ${p.step}; n=${s.n}`}</title>
                        </circle>
                      ))}
                  </g>
                ))}
              <line
                x1={x(step)}
                x2={x(step)}
                y1="28"
                y2="227"
                stroke={colors.kmaxwell}
                strokeOpacity="0.5"
                strokeDasharray="3 4"
              />
            </g>
          </Chart>
          <div className="km-chart-sidebar">
            <div className="km-toolbar">
              <Choices
                label="Results optimizer"
                value={optimizer}
                choices={[
                  { value: 'muon', label: 'Muon' },
                  { value: 'muonh', label: 'MuonH' },
                ]}
                onChange={onOptimizerChange}
              />
            </div>
            <Legend muonh={h} />
          </div>
        </div>
      </section>

      <figcaption>
        Lower loss is better. Large dots mark the reported passing steps.
      </figcaption>
      <details className="km-details">
        <summary>Data & methods</summary>
        <p>
          The target is loss 3.28. The formal rule is (3.28 − mean loss) × √n ≥
          0.004; n is the number of independent runs. Dotted lines in the target
          view show the adjusted thresholds for n=8 and n={h ? 20 : 10}. Large
          points mark the reported passing checkpoints.
        </p>
        <p>
          {h
            ? 'The MuonH baseline is the published n=20 endpoint; a full baseline trajectory is not available in this report.'
            : 'K-Maxwell uses 8 H100 runs, Bi-Maxwell uses 8 A800 runs, and the published single-EMA baseline uses 10 runs. This graph compares training steps, not wall-clock speed.'}
        </p>
        <ul>
          {series.map((s) => (
            <li key={s.name}>
              <a href={s.source}>{s.name} source</a> · n={s.n} · reported pass{' '}
              {formatStep(s.pass)}
            </li>
          ))}
        </ul>
        <div className="km-data-table">
          <table>
            <caption>
              Mean validation losses; blank cells mean no measurement on that
              step.
            </caption>
            <thead>
              <tr>
                <th>Step</th>
                {series.map((s) => (
                  <th key={s.name}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...new Set(series.flatMap((s) => s.points.map((p) => p.step)))]
                .sort((a, b) => a - b)
                .map((t) => (
                  <tr key={t}>
                    <th>{t}</th>
                    {series.map((s) => (
                      <td key={s.name}>
                        {s.points.find((p) => p.step === t)?.loss.toFixed(5) ??
                          '—'}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
