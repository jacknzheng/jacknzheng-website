import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  averageRuns,
  firstPass,
  kernel,
  mean,
  meanAge,
  parseRuns,
  populationSD,
  project3D,
  weightsAt,
} from '../src/components/kmaxwell/math.ts'

const data = JSON.parse(
  readFileSync(
    new URL('../src/data/kmaxwell/experiments.json', import.meta.url),
    'utf8',
  ),
)
const close = (actual: number, expected: number, tolerance = 0.000005) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`)

test('parser ignores embedded code, splits concatenated runs, and rejects conflicting duplicates', () => {
  const logs =
    'print("step:0/3250 val_loss:9.0")\nstep:0/3250 val_loss:10.0 train_time:0\nstep:1/3250 train_time:2\nstep:100/3250 val_loss:4.0\nstep:100/3250 val_loss:4.0\nstep:0/3250 val_loss:11.0\nstep:100/3250 val_loss:3.0\n'
  assert.deepEqual(averageRuns(parseRuns(logs), 2), [
    { step: 0, loss: 10.5 },
    { step: 100, loss: 3.5 },
  ])
  assert.throws(() =>
    parseRuns('step:100/3250 val_loss:4.0\nstep:100/3250 val_loss:3.0'),
  )
  assert.throws(() => averageRuns(parseRuns(logs), 8))
})

test('missing seeds do not create an apparent improvement or a new cohort', () => {
  const result = averageRuns(
    [
      [
        { step: 0, loss: 10 },
        { step: 10, loss: 4 },
      ],
      [{ step: 0, loss: 12 }],
    ],
    2,
  )
  assert.deepEqual(result, [{ step: 0, loss: 11 }])
})

test('published record means and prescribed passing checkpoints reproduce', () => {
  const muon = data.training.muon.kmaxwell,
    muonh = data.training.muonh.kmaxwell
  close(muon.find((p: { step: number }) => p.step === 3160).loss, 3.27794)
  close(muonh.find((p: { step: number }) => p.step === 3065).loss, 3.27833)
  assert.equal(firstPass(muon, 8, 2900, 10), 3160)
  assert.equal(firstPass(muonh, 8, 3000, 5), 3065)
  assert.equal(data.training.muonh.baseline.length, 1)
  assert.equal(data.training.muonh.bimaxwell.length, 0)
})

test('mixture endpoints and middle preserve the published memory ages', () => {
  for (const [key, from, to] of [
    ['muon', 58, 26],
    ['muonh', 50, 22],
  ] as const) {
    const recipe = data.recipes[key]
    for (const fraction of [0, 0.5, 1]) {
      const w = weightsAt(
        recipe,
        recipe.onset + fraction * (recipe.end - recipe.onset),
      )
      close(
        w.reduce((a, b) => a + b, 0),
        1,
      )
      close(meanAge(recipe.betas, w), from + fraction * (to - from), 0.001)
      close(
        Array.from({ length: 2000 }, (_, lag) =>
          kernel(recipe.betas, w, lag),
        ).reduce((a, b) => a + b, 0),
        1,
      )
    }
    assert.deepEqual(weightsAt(recipe, -1), recipe.startWeights)
    weightsAt(recipe, 10000).forEach((v, i) => close(v, recipe.endWeights[i]))
  }
  close(meanAge([0.95], [1]), 19)
  close(meanAge([0.85, 0.98], [0.4385, 0.5615]), 30, 0.002)
})

test('batch differences retain all three seeds and population SD', () => {
  assert.equal(data.batch.length, 20)
  for (const row of data.batch) {
    assert.equal(row.seeds.length, 3)
    close(row.mean, mean(row.seeds), 1e-12)
    close(row.sd, populationSD(row.seeds), 1e-12)
  }
  close(
    data.batch.find(
      (p: { batch: number; diff: string }) =>
        p.batch === 16 && p.diff === 'kmax_minus_mu0',
    ).mean,
    -0.00469,
  )
})

test('sweeps contain finite measured values and source links, with no synthetic grid', () => {
  assert.ok(data.sweep.length > 40)
  assert.equal(
    new Set(data.sweep.map((p: { id: string }) => p.id)).size,
    data.sweep.length,
  )
  for (const p of data.sweep) {
    for (const key of [
      'k',
      'startAge',
      'endAge',
      'tauMin',
      'tauMax',
      'mu',
      'loss',
    ])
      assert.ok(Number.isFinite(p[key]), `${p.id}: ${key}`)
    assert.equal(p.seed, 0)
    assert.equal(p.step, 3150)
    assert.match(
      p.source,
      /github\.com\/jacknzheng\/kmaxwell-sota\/blob\/[a-f0-9]{40}\//,
    )
  }
})

test('3D rotation preserves distance and changes the view without changing data', () => {
  const point = [0.7, -0.2, 0.8]
  for (const yaw of [-1, 0, 1]) {
    const rotated = project3D(point, yaw, 0.4)
    close(
      rotated.x ** 2 + rotated.y ** 2 + rotated.depth ** 2,
      point.reduce((s, v) => s + v ** 2, 0),
      1e-12,
    )
  }
})
