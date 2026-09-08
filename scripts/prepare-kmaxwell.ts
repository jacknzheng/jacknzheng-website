// Development-only extraction. Run with Node 22+: npm run data:kmaxwell
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import {
  averageRuns,
  firstPass,
  mean,
  parseRuns,
  populationSD,
} from '../src/components/kmaxwell/math.ts'

const repo = 'jacknzheng/kmaxwell-sota'
const muonSHA = '31717414cd73f11a76e2dccf7f443c9db0e84303'
const muonhSHA = '65098cd4c2e88fb27eb1900f64c170bc30eac510'
const researchSHA = '98c92ea718ba15a7d11c1f6079c9cdca2e583c21'
const biSHA = 'b60d7df7c846ab0aaec4c0dda9153445471f4875'
const base = 'records/track_3_optimization/results/'
const cache = join(tmpdir(), 'kmaxwell-article-cache')
await mkdir(cache, { recursive: true })
const sources: { url: string; sha256: string }[] = []

async function get(url: string) {
  const path = join(cache, createHash('sha256').update(url).digest('hex'))
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${response.status}: ${url}`)
    text = await response.text()
    await writeFile(path, text)
  }
  sources.push({ url, sha256: createHash('sha256').update(text).digest('hex') })
  return text
}
const raw = (sha: string, path: string, repository = repo) =>
  get(`https://raw.githubusercontent.com/${repository}/${sha}/${path}`)
const link = (sha: string, path: string, repository = repo) =>
  `https://github.com/${repository}/blob/${sha}/${path}`
type TreeEntry = { path: string; type: string }
async function tree(sha: string) {
  const result = JSON.parse(
    await get(
      `https://api.github.com/repos/${repo}/git/trees/${sha}?recursive=1`,
    ),
  ) as { tree: TreeEntry[]; truncated: boolean }
  if (result.truncated) throw new Error('Incomplete repository tree')
  return result.tree.filter((x) => x.type === 'blob').map((x) => x.path)
}
async function pool<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []
  let next = 0
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i])
      }
    }),
  )
  return results
}
const [masterTree, researchTree] = await Promise.all([
  tree(muonSHA),
  tree(researchSHA),
])
async function series(
  sha: string,
  paths: string[],
  n: number,
  repository = repo,
) {
  const logs = await pool(paths, (path) => raw(sha, path, repository))
  return averageRuns(logs.flatMap(parseRuns), n)
}
const muonPath = `${base}20260826_kmaxwell_3160/`
const muonhPath = `${base}20260827_muonh_kmaxwell_3065/`
const biPath = `${base}20260715_bimaxwell_baseline_3210/`
const baselinePaths = masterTree.filter(
  (p) =>
    p.startsWith(`${base}20260610_tuned_baseline_3250/`) && p.endsWith('.txt'),
)
const seeds = Array.from({ length: 8 }, (_, i) => i)
const [muon, muonh, baseline, bimax] = await Promise.all([
  series(
    muonSHA,
    seeds.map((i) => `${muonPath}H100_seed${i}.txt`),
    8,
  ),
  series(
    muonhSHA,
    seeds.map((i) => `${muonhPath}H100_seed${i}.txt`),
    8,
  ),
  series(muonSHA, baselinePaths, 10),
  series(
    biSHA,
    seeds.map((i) => `${biPath}A800_seed${i}.txt`),
    8,
    'orange4664/modded-nanogpt',
  ),
])
if (
  firstPass(muon, 8, 2900, 10) !== 3160 ||
  firstPass(muonh, 8, 3000, 5) !== 3065
)
  throw new Error('Record checkpoint mismatch')

function arrayConstant(text: string, name: string): number[] {
  const match = text.match(new RegExp(`${name} = \\[([^\\]]+)\\]`))
  if (!match) throw new Error(`Missing constant ${name}`)
  return match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
}
const [muonTrainer, muonhTrainer] = await Promise.all([
  raw(muonSHA, `${muonPath}train_gpt_kmaxwell_anneal.py`),
  raw(muonhSHA, `${muonhPath}train_gpt_muonh_kmaxwell.py`),
])
const recipes = {
  muon: {
    betas: arrayConstant(muonTrainer, 'kmaxwell_decay_rates'),
    startWeights: arrayConstant(
      muonTrainer,
      'kmaxwell_starting_buffer_weights',
    ),
    endWeights: arrayConstant(muonTrainer, 'kmaxwell_ending_buffer_weights'),
    onset: 1000,
    end: 3250,
  },
  muonh: {
    betas: arrayConstant(muonhTrainer, 'KMAXWELL_DECAY_RATES'),
    startWeights: arrayConstant(muonhTrainer, 'KMAXWELL_START_WEIGHTS'),
    endWeights: arrayConstant(muonhTrainer, 'KMAXWELL_END_WEIGHTS'),
    onset: 750,
    end: 3125,
  },
}

const batchPath =
  'logs/kmaxwell/req043_paired_kernel_batch_ablation/readout.tsv'
const batch = (await raw(researchSHA, batchPath))
  .split(/\r?\n/)
  .filter((line) => /^b\d+x\t/.test(line))
  .map((line) => {
    const [b, tokens, diff, s0, s1, s2, publishedMean, publishedSD] =
      line.split('\t')
    const values = [s0, s1, s2].map(Number)
    if (
      Math.abs(mean(values) - Number(publishedMean)) > 0.000011 ||
      Math.abs(populationSD(values) - Number(publishedSD)) > 0.000011
    )
      throw new Error('Batch summary mismatch')
    return {
      batch: Number(b.slice(1, -1)),
      tokens: Number(tokens),
      diff,
      seeds: values,
      mean: mean(values),
      sd: populationSD(values),
    }
  })
if (batch.length !== 20) throw new Error('Incomplete batch experiment')

type SweepPoint = {
  id: string
  k: number
  startAge: number
  endAge: number
  tauMin: number
  tauMax: number
  mu: number
  onset: number
  seed: number
  step: number
  loss: number
  kind: 'fixed' | 'annealed'
  source: string
}
const sweep: SweepPoint[] = []
const endpointPaths = researchTree.filter((p) =>
  /^logs\/kmaxwell\/ablation_anneal_n8\/(C1_.*seed0|ANL64_s0_seed0)\.stdout$/.test(
    p,
  ),
)
await pool(endpointPaths, async (path) => {
  const text = await raw(researchSHA, path)
  const header = text.split('\n').slice(0, 2).join(' ')
  const option = (name: string) => {
    const m = header.match(new RegExp(`--${name} ([^ ]+)`))
    if (!m) throw new Error(`Missing ${name}: ${path}`)
    return Number(m[1])
  }
  const ages = header.match(/age ([\d.]+)->([\d.]+)/)
  const point = parseRuns(text)[0]?.find((p) => p.step === 3150)
  if (!point || !ages) throw new Error(`Missing sweep evidence: ${path}`)
  sweep.push({
    id: path.split('/').pop()!.replace('.stdout', ''),
    k: option('k'),
    startAge: Number(ages[1]),
    endAge: Number(ages[2]),
    tauMin: option('tau-min'),
    tauMax: option('tau-max'),
    mu: 0.95,
    onset: option('start'),
    seed: 0,
    step: 3150,
    loss: point.loss,
    kind: 'annealed',
    source: link(researchSHA, path),
  })
})
const muSweepPath = 'logs/kmaxwell/mu_sweep_3160/summary.tsv'
for (const line of (await raw(researchSHA, muSweepPath))
  .split('\n')
  .filter((line) => /^0\.\d+\t/.test(line))) {
  const [mu, seed, , loss] = line.split('\t').map(Number)
  sweep.push({
    id: `mu-${mu}`,
    k: 8,
    startAge: 58,
    endAge: 26,
    tauMin: 3,
    tauMax: 64,
    mu,
    onset: 1000,
    seed,
    step: 3150,
    loss,
    kind: 'annealed',
    source: link(researchSHA, muSweepPath),
  })
}
// Record the kernel implementation used to derive frozen mixture ages.
await raw(researchSHA, `${biPath}kmaxwell_kernel.py`)
// Frozen buffer-count/weight screens have complete parameters in their filenames.
const frozenPaths = researchTree.filter((p) =>
  /^logs\/kmaxwell\/stage[1678]\/seed0_k.*\.stdout$/.test(p),
)
await pool(frozenPaths, async (path) => {
  const config = path
    .replaceAll('p', '.')
    .match(
      /seed0_k(\d+)_tau-min([\d.]+)_tau-max([\d.]+)_(?:sigma([\d.]+)_)?start(\d+)(?:_weights([\d.,]+))?\.stdout$/,
    )
  if (!config) throw new Error(`Unrecognized frozen configuration: ${path}`)
  const [, kText, minText, maxText, sigmaText, onsetText, weightText] = config
  const k = Number(kText),
    tauMin = Number(minText),
    tauMax = Number(maxText)
  const ages = Array.from(
    { length: k },
    (_, i) => tauMin * (tauMax / tauMin) ** (i / (k - 1)),
  )
  const scores = weightText
    ? weightText.split(',').map(Number)
    : ages.map((age) =>
        Math.exp(
          -((Math.log(age) - Math.log(Math.sqrt(tauMin * tauMax))) ** 2) /
            (2 * Number(sigmaText) ** 2),
        ),
      )
  const total = scores.reduce((a, b) => a + b, 0)
  const age = ages.reduce((sum, a, i) => sum + (a * scores[i]) / total, 0)
  const point = parseRuns(await raw(researchSHA, path))[0]?.find(
    (p) => p.step === 3150,
  )
  if (!point) return // Failed/incomplete runs are never fabricated as observations.
  sweep.push({
    id: path.split('/').slice(-2).join('/').replace('.stdout', ''),
    k,
    startAge: age,
    endAge: age,
    tauMin,
    tauMax,
    mu: 0.95,
    onset: Number(onsetText),
    seed: 0,
    step: 3150,
    loss: point.loss,
    kind: 'fixed',
    source: link(researchSHA, path),
  })
})
sweep.sort((a, b) => a.id.localeCompare(b.id, 'en'))
const result = {
  recipes,
  training: {
    muon: {
      kmaxwell: muon,
      baseline,
      bimaxwell: bimax,
      source: link(muonSHA, `${muonPath}README.md`),
      baselineSource: link(muonSHA, baselinePaths[0]),
      bimaxwellSource: link(
        biSHA,
        `${biPath}README.md`,
        'orange4664/modded-nanogpt',
      ),
    },
    muonh: {
      kmaxwell: muonh,
      baseline: [{ step: 3125, loss: 3.278994 }],
      bimaxwell: [],
      source: link(muonhSHA, `${muonhPath}README.md`),
      baselineSource: 'https://github.com/KellerJordan/modded-nanogpt/pull/351',
      bimaxwellSource: '',
    },
  },
  batch,
  batchSource: link(researchSHA, batchPath),
  sweep,
}
await mkdir('src/data/kmaxwell', { recursive: true })
await writeFile(
  'src/data/kmaxwell/experiments.json',
  JSON.stringify(result) + '\n',
)
await writeFile(
  'src/data/kmaxwell/sources.json',
  JSON.stringify(
    {
      revisions: { muonSHA, muonhSHA, researchSHA, biSHA },
      sources: sources.sort((a, b) => a.url.localeCompare(b.url, 'en')),
    },
    null,
    2,
  ) + '\n',
)
console.log(
  `Prepared ${muon.length} Muon points, ${muonh.length} MuonH points, ${batch.length} batch comparisons, ${sweep.length} sweep observations.`,
)
