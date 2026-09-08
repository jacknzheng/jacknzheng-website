export type Point = { step: number; loss: number }
export type Recipe = {
  betas: number[]
  startWeights: number[]
  endWeights: number[]
  onset: number
  end: number
}

export const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value))
export const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length
export const populationSD = (values: number[]) =>
  Math.sqrt(mean(values.map((value) => (value - mean(values)) ** 2)))
export const threshold = (n: number) => 3.28 - 0.004 / Math.sqrt(n)

export function weightsAt(recipe: Recipe, step: number) {
  const fraction = clamp(
    (step - recipe.onset) / (recipe.end - recipe.onset),
    0,
    1,
  )
  return recipe.startWeights.map(
    (weight, i) => weight + fraction * (recipe.endWeights[i] - weight),
  )
}

export function kernel(betas: number[], weights: number[], lag: number) {
  return betas.reduce(
    (sum, beta, i) => sum + weights[i] * (1 - beta) * beta ** lag,
    0,
  )
}

export function meanAge(betas: number[], weights: number[]) {
  return betas.reduce(
    (sum, beta, i) => sum + (weights[i] * beta) / (1 - beta),
    0,
  )
}

// Logs can contain embedded Python and more than one run. Only actual metric
// lines count; a reset to step zero starts a new run. Duplicate evaluations
// within one run must agree rather than silently increasing its sample count.
export function parseRuns(text: string): Point[][] {
  const runs: Point[][] = []
  let current = new Map<number, number>()
  for (const line of text.split(/\r?\n/)) {
    const match = /^step:(\d+)\/\d+\s+val_loss:([\d.]+)(?:\s|$)/.exec(line)
    if (!match) continue
    const step = Number(match[1]),
      loss = Number(match[2])
    if (!Number.isFinite(loss)) throw new Error('Invalid validation loss')
    if (step === 0 && current.size) {
      runs.push([...current].map(([step, loss]) => ({ step, loss })))
      current = new Map()
    }
    if (current.has(step) && current.get(step) !== loss)
      throw new Error(`Conflicting evaluation at ${step}`)
    current.set(step, loss)
  }
  if (current.size)
    runs.push([...current].map(([step, loss]) => ({ step, loss })))
  return runs
}

export function averageRuns(runs: Point[][], expected: number): Point[] {
  if (runs.length !== expected)
    throw new Error(`Expected ${expected} runs; got ${runs.length}`)
  const maps = runs.map((run) => new Map(run.map((p) => [p.step, p.loss])))
  // Intersection only: never let a missing seed change the plotted cohort.
  return runs[0]
    .filter((p) => maps.every((map) => map.has(p.step)))
    .map((p) => ({
      step: p.step,
      loss: mean(maps.map((map) => map.get(p.step)!)),
    }))
    .sort((a, b) => a.step - b.step)
}

export function firstPass(
  points: Point[],
  n: number,
  start: number,
  interval: number,
) {
  return points.find(
    (p) =>
      p.step >= start &&
      (p.step - start) % interval === 0 &&
      p.loss <= threshold(n),
  )?.step
}

export function nearestPoint(points: Point[], step: number) {
  return points.reduce<Point | undefined>(
    (best, p) =>
      !best || Math.abs(p.step - step) < Math.abs(best.step - step) ? p : best,
    undefined,
  )
}

export function project3D(point: number[], yaw: number, pitch: number) {
  const [x, y, z] = point
  const u = x * Math.cos(yaw) + z * Math.sin(yaw)
  const depth = -x * Math.sin(yaw) + z * Math.cos(yaw)
  return {
    x: u,
    y: y * Math.cos(pitch) - depth * Math.sin(pitch),
    depth: y * Math.sin(pitch) + depth * Math.cos(pitch),
  }
}
