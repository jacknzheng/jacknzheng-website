import data from '../../data/kmaxwell/experiments.json'
import {
  Axes,
  Chart,
  colors,
  formatDelta,
  Legend,
  linePath,
  scale,
} from './Chart'

const methods = [
  { key: 'kmax_minus_mu0', name: 'K-Maxwell', color: colors.kmaxwell },
  { key: 'bimax_minus_mu0', name: 'Bi-Maxwell', color: colors.bimaxwell },
  { key: 'mu95_minus_mu0', name: 'Single EMA', color: colors.baseline },
]
const batches = [1, 2, 4, 8, 16]

export default function BatchFigure() {
  const x = (n: number) => scale([0, 4], [90, 588])(Math.log2(n))
  const y = scale([-0.0115, 0.0015], [307, 30])
  const rows = methods.map((m) => ({
    ...m,
    points: data.batch.filter((p) => p.diff === m.key),
  }))
  return (
    <figure className="km-figure" id="figure-4">
      <div className="km-figure-heading">
        <h3>K-Maxwell retains its advantage at larger batches</h3>
      </div>
      <div className="km-chart-layout">
        <Chart
          title="Batch-size ablation against momentum-off Muon"
          description="Blue K-Maxwell retains a benefit at 16 times the batch size. Black Bi-Maxwell approaches zero. Lower is better. Error bars show one population standard deviation across three seeds. Hover over a point or open the data table for exact values."
          width={620}
          height={350}
        >
          <Axes
            x={x}
            y={y}
            xTicks={batches}
            yTicks={[-0.01, -0.008, -0.006, -0.004, -0.002, 0]}
            xLabel="Batch size (× baseline)"
            yLabel="Δ validation loss ↓"
            width={620}
            height={350}
            left={84}
            formatX={(n) => `${n}×`}
            formatY={(n) => (n === 0 ? '0' : n.toFixed(3))}
          />
          <rect
            x="84"
            y={y(0.0005)}
            width="520"
            height={y(-0.0005) - y(0.0005)}
            fill="currentColor"
            opacity="0.035"
          />
          <line className="km-target" x1="84" x2="604" y1={y(0)} y2={y(0)} />
          <text x="90" y={y(0.0005) - 8} className="km-chart-note">
            Reference band ±0.0005
          </text>
          {rows.map((m) => (
            <g key={m.key}>
              <path
                d={linePath(
                  m.points.map((p) => ({ x: x(p.batch), y: y(p.mean) })),
                )}
                fill="none"
                stroke={m.color}
                strokeWidth="2"
                strokeDasharray={m.key === 'mu95_minus_mu0' ? '5 4' : undefined}
              />
              {m.points.map((p) => (
                <g key={p.batch}>
                  <line
                    x1={x(p.batch)}
                    x2={x(p.batch)}
                    y1={y(p.mean - p.sd)}
                    y2={y(p.mean + p.sd)}
                    stroke={m.color}
                  />
                  {[-1, 1].map((sign) => (
                    <line
                      key={sign}
                      x1={x(p.batch) - 5}
                      x2={x(p.batch) + 5}
                      y1={y(p.mean + sign * p.sd)}
                      y2={y(p.mean + sign * p.sd)}
                      stroke={m.color}
                    />
                  ))}
                  {m.key === 'mu95_minus_mu0' ? (
                    <path
                      d={`M${x(p.batch)},${y(p.mean) - 4}l4,4 -4,4 -4,-4Z`}
                      fill={m.color}
                    />
                  ) : (
                    <circle
                      cx={x(p.batch)}
                      cy={y(p.mean)}
                      r="4"
                      fill={m.color}
                    />
                  )}
                  <circle
                    cx={x(p.batch)}
                    cy={y(p.mean)}
                    r="14"
                    fill="transparent"
                  >
                    <title>{`${m.name}, ${p.batch}×: ${formatDelta(p.mean)} ± ${p.sd.toFixed(5)}`}</title>
                  </circle>
                </g>
              ))}
            </g>
          ))}
        </Chart>
        <Legend />
      </div>
      <figcaption>
        Loss difference vs Muon with momentum off. Three runs; error bars show
        ±1 standard deviation.
      </figcaption>
      <details className="km-details">
        <summary>Data & methods</summary>
        <p>
          Each method continues from the same per-seed step-2,000 state to step
          2,750. One batch unit is 524,288 tokens per step. Comparisons are
          within each batch size: larger batches see more tokens. Error bars use
          the population standard deviation. The ±0.0005 reference band is not a
          confidence interval. <a href={data.batchSource}>Measurements ↗</a>
        </p>
        <div className="km-data-table">
          <table>
            <caption>
              Paired loss differences versus µ = 0; lower is better.
            </caption>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Method</th>
                <th>Mean</th>
                <th>SD</th>
                <th>Seed 0</th>
                <th>Seed 1</th>
                <th>Seed 2</th>
              </tr>
            </thead>
            <tbody>
              {batches.flatMap((b) =>
                rows.map((m) => {
                  const p = m.points.find((p) => p.batch === b)!
                  return (
                    <tr key={`${b}-${m.key}`}>
                      <th>{b}×</th>
                      <td>{m.name}</td>
                      <td>{formatDelta(p.mean)}</td>
                      <td>{p.sd.toFixed(5)}</td>
                      {p.seeds.map((v, i) => (
                        <td key={i}>{formatDelta(v)}</td>
                      ))}
                    </tr>
                  )
                }),
              )}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
