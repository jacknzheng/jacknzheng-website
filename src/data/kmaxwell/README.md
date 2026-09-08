# Article measurements

`experiments.json` is a compact, local snapshot of published experiment data.
The page imports it directly; it does not contact GitHub or run Python/PyTorch.

To regenerate it with Node 22 or later:

```sh
npm run data:kmaxwell
npm run test:kmaxwell
```

The development-only extractor reads fixed GitHub commits, caches downloads in
the operating system's temporary directory, and records input URLs and SHA-256
checksums in `sources.json`. Neither the downloader nor this manifest is imported
by the article. Updating the experiments requires intentionally changing the
pinned revisions in the extractor and checking the resulting differences.

## Measurement definitions

- Training curves: arithmetic means at checkpoints present in every expected run.
  No smoothing, extrapolation, or averaging of different run counts. Repeated
  identical metrics within a run count once. Record passes use the prescribed
  10-step Muon / 5-step MuonH grids and `(3.28 − mean) × √n ≥ 0.004`.
- MuonH control: published n=20 endpoint only, not the separate n=8 paired-control
  rerun table. There is no invented full trajectory.
- Batch ablation: REQ-044 data in `req043_paired_kernel_batch_ablation` at the
  research commit. The three same-seed differences are recomputed into means and
  population standard deviations, and checked against the published readout.
  These are step-2000 → step-2750 continuations, not full speedrun records.
- Endpoint sweep: seed-0 C1/ANL64 logs and the separate µ screen, all evaluated at
  step 3150. Identical settings from separate runs remain separate observations.
- Buffer sweep: complete seed-0 stage 1/6/7/8 fixed-weight logs plus the annealed
  endpoint observations at µ=0.95. Configuration ages are derived from explicit
  weights or the source kernel's Gaussian weighting rule. Runs without a measured
  step-3150 loss are omitted. Different buffer ranges are disclosed: this is an
  exploratory search, not an isolated causal comparison of buffer count.
- Memory profiles: exact published β and mixture vectors, linearly interpolated
  in training time. They represent the scheduled profile, excluding the lazy-init
  transient and common Nesterov contribution. Rounded source constants are kept.

Charts are transparent SVG rendered by React. The source raster assets remain
available at their existing public URLs for compatibility, but are not used as
article charts.
