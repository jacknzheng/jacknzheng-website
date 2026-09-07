// Trusted article content exported from the author’s Notion draft.
// Equations use native MathML.

const pseudocode = `# per Muon 2-D param, step >= 1000:
for k, beta in enumerate(kmaxwell_decay_rates):  # 8 log-spaced τ in [3, 64]
    m[k].lerp_(g, 1 - beta)
frac = (step - 1000) / 2250
w = (1 - frac) * w_age58 + frac * w_age26        # mixture mean age 58 → 26
m_eff = sum(w[k] * m[k] for k in range(8))
update = g.lerp_(m_eff, mu)                       # Nesterov mix unchanged`

export default function KMaxwellMomentum() {
  return (
    <>
      <p className="article-byline">
        Collaborator: <a href="https://github.com/jeffreycider">Jeffrey Cheng</a>
        {' · '}
        <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/README.md">
          GitHub report
        </a>
      </p>

      <p>
        We believe momentum remains an under-optimized area of pre-training. While much recent research focuses on optimizer design, momentum often still uses a single exponential moving average (EMA) buffer with a fixed decay rate. <a href="https://arxiv.org/abs/1412.6980">[1]</a>, <a href="https://arxiv.org/html/2409.03137">[2]</a>
      </p>

      <h2 id="results">Results</h2>

      <p>
        K-Maxwell, our variant of single-EMA momentum, improves on the current world records for the Muon, MuonH, and SOAP-Muon optimizer baselines in Track 3 of the modded-nanoGPT speedrun. As shown below, it reduces the required training steps by 90 on Muon (2.77%) and 60 on MuonH (1.92%). However, the observed gain on SOAP-Muon is only 10 steps (0.37%), with no statistically significant improvement over its predecessor, Bi-Maxwell. We suspect this is due to an overlap in how momentum and SOAP-style preconditioning <a href="https://arxiv.org/abs/2409.11321">[6]</a> both address oscillations at the edge of stability.
      </p>

      <div
        className="article-table"
        tabIndex={0}
        role="region"
        aria-label="K-Maxwell experiment results"
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Configuration and source</th>
              <th scope="col">Baseline → K-Maxwell steps</th>
              <th scope="col">Reduction</th>
              <th scope="col">Runs and reported mean loss</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Tuned Muon + auxiliary AdamW; submission #357{' '}
                <a href="https://github.com/KellerJordan/modded-nanogpt/pull/357">
                  [3]
                </a>
              </td>
              <td>3250 → 3160</td>
              <td>90 steps; 2.77%</td>
              <td>8 seeds; 3.27794</td>
            </tr>
            <tr>
              <td>
                MuonH fast-slow decay; submission #359{' '}
                <a href="https://github.com/KellerJordan/modded-nanogpt/pull/359">
                  [4]
                </a>
              </td>
              <td>3125 → 3065</td>
              <td>60 steps; 1.92%</td>
              <td>8 seeds; 3.27833</td>
            </tr>
            <tr>
              <td>
                SOAP-Muon + Tail-EMA + RowFloor + CWD; companion report{' '}
                <a href="https://github.com/jacknzheng/kmaxwell-sota/tree/track3-kmaxwell-sota/records/track_3_optimization/results/20260824_kmaxwell_2680">
                  [5]
                </a>
              </td>
              <td>2690 → 2680</td>
              <td>10 steps; 0.37%</td>
              <td>8 seeds; 3.27847 using Tail-EMA evaluation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        We also find that K-Maxwell generalizes well to larger batch sizes, while Bi-Maxwell’s degrades to the control - that is normal Muon with a single EMA momentum. This suggests that the annealed momentum mixture does more than dampen gradient noise.
      </p>

      <h2 id="what-is-momentum-doing">What is momentum doing?</h2>

      <p>
        Momentum is commonly conceived of as a heavy ball carrying us through small divots, saddle points and across flat regions of the loss surface. While this is intuitively useful, momentum does much more - helping us converge faster when curvature differs greatly across our gradient directions, or in other words, our loss objective is poorly conditioned. For a positive-definite Hessian, which describes our loss surface’s local curvature, the condition number is the ratio of its largest to smallest eigenvalues:
      </p>

      <div className="article-equation">
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <semantics>
              <mrow>
                <mi>κ</mi>
                <mo>=</mo>
                <mstyle scriptLevel={0} displaystyle="true">
                  <mfrac>
                    <msub>
                      <mi>λ</mi>
                      <mrow>
                        <mi>m</mi>
                        <mi>a</mi>
                        <mi>x</mi>
                      </mrow>
                    </msub>
                    <msub>
                      <mi>λ</mi>
                      <mrow>
                        <mi>m</mi>
                        <mi>i</mi>
                        <mi>n</mi>
                      </mrow>
                    </msub>
                  </mfrac>
                </mstyle>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\kappa =\dfrac{\lambda_{max}}{\lambda_{min}}`}
              </annotation>
            </semantics>
          </math>
        </span>
      </div>

      <p>
        To understand why momentum helps us converge faster, we can observe a simple example. For full-batch optimization of a convex quadratic loss, tuned Polyak momentum helps accelerate progress along directions of low curvature while damping oscillations along directions of high curvature, which occur at the <em>edge of stability</em>. In this simplified setting, it improves the convergence dependence on the condition number from κ to √κ. <a href="https://distill.pub/2017/momentum/">[7]</a>, <a href="https://doi.org/10.1016/0041-5553%2864%2990137-5">[8]</a>
      </p>
      <div className="article-equation">
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <mrow><msub><mi>v</mi><mi>t</mi></msub><mo>=</mo><mi>β</mi><msub><mi>v</mi><mrow><mi>t</mi><mo>−</mo><mn>1</mn></mrow></msub><mo>+</mo><mo>∇</mo><mi>L</mi><mo>(</mo><msub><mi>θ</mi><mi>t</mi></msub><mo>)</mo><mo>,</mo><mspace width="1em" /><msub><mi>θ</mi><mrow><mi>t</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>=</mo><msub><mi>θ</mi><mi>t</mi></msub><mo>−</mo><mi>η</mi><msub><mi>v</mi><mi>t</mi></msub></mrow>
          </math>
        </span>
      </div>
      <p><em>Polyak momentum.</em> <a href="https://doi.org/10.1016/0041-5553%2864%2990137-5">[8]</a></p>

      <p>
        The intuition is that gradients along a low curvature direction tend to keep the same sign: +g, +g, …, so momentum accumulates along a persistent gradient direction. However, down high curvature directions, updates can overshoot due to the discretized learning rate of gradient descent, causing gradients to alternate: −g, +g, −g, +g. Averaging these opposing gradients dampens this oscillating motion, which is exactly what momentum does.
      </p>

      <p>Cohen et al. (2021) <a href="https://arxiv.org/abs/2103.00065">[9]</a> observed that, during full-batch neural network training, the largest Hessian eigenvalue often rises and then hovers near <span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mn>2</mn><mi>η</mi></mfrac></mrow></math></span>, where <span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>η</mi></mrow></math></span> is the learning rate. This is called training at the edge of stability, and we find that momentum permits us to take on larger learning rates which can speed up convergence.</p>

      <figure id="figure-1">
        <video
          controls
          playsInline
          preload="metadata"
          aria-label="Gradient descent converging or diverging on a quadratic loss"
          aria-describedby="figure-1-caption"
        >
          <source src="/images/k-maxwell/quadratic.mp4" type="video/mp4" />
          <a href="/images/k-maxwell/quadratic.mp4">
            Watch the gradient descent animation
          </a>
          .
        </video>
        <figcaption id="figure-1-caption">
          <strong>Figure 1. Convergence and divergence on a quadratic loss.</strong>{' '}
          With learning rate η and curvature S, gradient descent converges when
          S &lt; 2/η (left) and diverges when S &gt; 2/η (right). Animation from
          the{' '}
          <a href="https://centralflows.github.io/part1/">
            Central Flows companion website
          </a>{' '}
          <a href="#ref-19">[19]</a>; related edge-of-stability findings are
          discussed in <a href="#ref-9">[9]</a>.
        </figcaption>
      </figure>

      <p>
        For the standard Polyak update on a positive-definite quadratic loss, the new stability condition is <span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mn>0</mn><mo>&lt;</mo><mi>η</mi><mo>&lt;</mo><mfrac><mrow><mn>2</mn><mo>+</mo><mn>2</mn><mi>β</mi></mrow><msub><mi>λ</mi><mrow><mi>m</mi><mi>a</mi><mi>x</mi></mrow></msub></mfrac></mrow></math></span>, where <span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>β</mi></mrow></math></span> is the momentum coefficient. <a href="https://distill.pub/2017/momentum/">[7]</a> In the experiments of Andreyev et al., large-batch momentum dynamics approach the optimizer-specific deterministic stability boundary, while smaller batches impose tighter stability constraints. <a href="https://arxiv.org/html/2604.14108v1">[17]</a>
      </p>

      <h2 id="k-maxwell-momentum">K-Maxwell momentum</h2>

      <p>
        K-Maxwell momentum extends Bi-Maxwell <a href="https://arxiv.org/abs/2608.22994">[10]</a> and AdEMAMix <a href="https://arxiv.org/html/2409.03137">[2]</a> using eight EMA buffers with logarithmically spaced timescales and fixed decay rates (<span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>β</mi></mrow></math></span>). In the Muon configuration shown here, training begins with a single EMA buffer and switches to K-Maxwell at step 1000. From the switch step, we linearly interpolate the mixture weights from a mean age of 58 steps toward a mean age of 26 steps, at step 3250. Mean age describes on average, the gradient age in the EMA buffer, weighted by each past gradient’s contribution. <a href="https://github.com/KellerJordan/modded-nanogpt/pull/357">[3]</a>
      </p>

      <div className="article-equation">
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <semantics>
              <mrow>
                <msub>
                  <mi>m</mi>
                  <mrow>
                    <mi>i</mi>
                    <mo separator="true">,</mo>
                    <mi>t</mi>
                  </mrow>
                </msub>
                <mo>=</mo>
                <msub>
                  <mi>β</mi>
                  <mi>i</mi>
                </msub>
                <msub>
                  <mi>m</mi>
                  <mrow>
                    <mi>i</mi>
                    <mo separator="true">,</mo>
                    <mi>t</mi>
                    <mo>−</mo>
                    <mn>1</mn>
                  </mrow>
                </msub>
                <mo>+</mo>
                <mo stretchy="false">(</mo>
                <mn>1</mn>
                <mo>−</mo>
                <msub>
                  <mi>β</mi>
                  <mi>i</mi>
                </msub>
                <mo stretchy="false">)</mo>
                <msub>
                  <mi>g</mi>
                  <mi>t</mi>
                </msub>
                <mo separator="true">,</mo>
                <mspace width="2em" />
                <msub>
                  <mover accent="true">
                    <mi>m</mi>
                    <mo>ˉ</mo>
                  </mover>
                  <mi>t</mi>
                </msub>
                <mo>=</mo>
                <munder>
                  <mo>∑</mo>
                  <mi>i</mi>
                </munder>
                <msub>
                  <mi>w</mi>
                  <mi>i</mi>
                </msub>
                <mo stretchy="false">(</mo>
                <mi>t</mi>
                <mo stretchy="false">)</mo>
                <msub>
                  <mi>m</mi>
                  <mrow>
                    <mi>i</mi>
                    <mo separator="true">,</mo>
                    <mi>t</mi>
                  </mrow>
                </msub>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`m_{i,t}=\beta_i m_{i,t-1}+(1-\beta_i)g_t,
\qquad
\bar m_t=\sum_i w_i(t)m_{i,t}`}
              </annotation>
            </semantics>
          </math>
        </span>
      </div>

      <p>
        The following pseudocode illustrates the annealed momentum after the switch step. Initialization and the surrounding optimizer are defined in the source trainer <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/train_gpt_kmaxwell_anneal.py">[11]</a>.
      </p>

      <pre>
        <code className="language-python">{pseudocode}</code>
      </pre>

      <p>
        We use logarithmically spaced timescales to capture meaningfully different ranges of gradient history. Slower EMAs can act as low-pass filters <a href="https://www.dsprelated.com/freebooks/filters/Bandwidth_One_Pole.html">[12]</a>, smoothing out high frequency changes while retaining persistent gradient directions. Since we know characteristic frequency <span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>ω</mi></mrow></math></span> is approximately inversely proportional to memory <span className="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>τ</mi></mrow></math></span> (i.e. wavelength), we adopt a logarithmic scale.
      </p>

      <div className="article-equation">
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <semantics>
              <mrow>
                <mi>ω</mi>
                <mo>≈</mo>
                <mstyle scriptLevel={0} displaystyle="true">
                  <mfrac>
                    <mn>1</mn>
                    <mi>τ</mi>
                  </mfrac>
                </mstyle>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\omega \approx\dfrac{1}{\tau}`}
              </annotation>
            </semantics>
          </math>
        </span>
      </div>

      <p>
        However, mean age alone does not capture the expressivity allowed by multiple EMA buffers. As discussed in AdEMAMix <a href="https://arxiv.org/html/2409.03137">[2]</a>, an EMA mixture can give substantial weight to the newest gradients while retaining a long tail of older gradients. The example below shows how two memory profiles can have the same mean age but have vastly different gradient ages present:
      </p>

      <div
        className="article-table"
        tabIndex={0}
        role="region"
        aria-label="EMA memory comparison"
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Memory</th>
              <th scope="col">Mean age</th>
              <th scope="col">Weight on the newest gradient</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Single EMA with β = 0.95</td>
              <td>19 steps</td>
              <td>5%</td>
            </tr>
            <tr>
              <td>Equal mixture of EMAs with mean ages 3 and 35</td>
              <td>19 steps</td>
              <td>≈13.9%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        We suspect that combining very distinct timescales at each training step helps reduce recurring errors, including oscillations at the edge of stability. This is loosely analogous to Richardson extrapolation <a href="https://personal.math.ubc.ca/~israel/m215/rich/rich.html">[13]</a>, which combines estimates at different step sizes to remove predictable error. Our mechanism is more closely associated with the idea of multi-timescale temporal filtering, however we presume it goes beyond this as it retains a stable advantage over normal single EMA Muon even with larger batch size. For related mathematical background on stochastic momentum dynamics, see Li, Tai, and E (2019). <a href="https://www.jmlr.org/papers/v20/17-526.html">[18]</a>
      </p>

      <h2 id="annealing-momentum">Annealing momentum</h2>

      <figure id="figure-2">
        <a
          href="/images/k-maxwell/kernel-annealing.gif"
          aria-label="View Figure 2 at full size"
        >
          <img
            src="/images/k-maxwell/kernel-annealing.gif"
            alt="Animated memory kernels comparing annealed K-Maxwell, a single EMA, and Bi-Maxwell across gradient ages."
            loading="lazy"
            decoding="async"
          />
        </a>
        <figcaption>
          <strong>Figure 2. Annealing the memory kernel.</strong> The weight
          assigned to each past gradient changes as K-Maxwell’s mean age falls
          from 58 to 26 steps between training steps 1000 and 3250. The single
          EMA (β = 0.95; mean age 19) and Bi-Maxwell (mean age 30) are shown for
          comparison. The vertical axis is logarithmic. The common Nesterov
          contribution from the current gradient is excluded.{' '}
          <a href="#ref-14">[14]</a>
        </figcaption>
      </figure>

      <p>
        We also observe substantial gains from annealing momentum, and see a step-function improvement over configurations that kept the mixture fixed as seen in the figure below. <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/README.md">[14]</a> We suspect that longer memory helps maintain persistent gradient directions during the extended <em>transient phase</em>, when training is still making broad progress. Shorter memory may then improve responsiveness during the <em>late-stage convergence phase</em>, when the optimizer needs to adapt quickly to oscillatory changes in gradient direction. <a href="https://proceedings.mlr.press/v28/sutskever13.html">[15]</a>
      </p>

      <figure id="figure-3">
        <a
          href="/images/k-maxwell/buffer-count-mean-age.png"
          aria-label="View Figure 3 at full size"
        >
          <img
            src="/images/k-maxwell/buffer-count-mean-age.png"
            alt="Two views of measured validation losses across K-Maxwell buffer counts and frozen or annealed mean ages."
            loading="lazy"
            decoding="async"
          />
        </a>
        <figcaption>
          <strong>Figure 3. Buffer count and mean-age sweep.</strong> Circles
          represent fixed mean ages; diamonds represent annealed configurations.
          Color shows seed-0 validation loss at step 3150, with darker purple
          indicating lower loss. The left panel shows the minimum and maximum
          mean ages; the right uses the fixed age or the average of the
          annealing endpoints. These are individual measured runs, with no
          interpolation between points.
        </figcaption>
      </figure>



      <p>
        Another possible explanation is that long momentum memory becomes less useful late in training as retaining older gradient directions can delay the optimizer’s response to changes in the loss landscape. Shortening that memory may improve responsiveness, although it also reduces noise smoothing. Optimizer families such as RMSProp and ADAM, attempt to solve related problems by adjusting updates responsively, using running squared-gradient estimates to scale updates; Adam also uses a running average of the gradient in its numerator. <a href="https://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf#page=29">[16]</a>, <a href="https://arxiv.org/abs/1412.6980">[1]</a> This changes the effective learning rate of each component, potentially slowing convergence when gradient norm grows large - which is likely to occur when training at the edge of stability. On the other hand, K-Maxwell instead adjusts how much gradient history contributes to momentum, which appears to strictly improve convergence in our experiments.
      </p>

      <h2 id="extending-to-larger-batch-sizes">
        Extending to larger batch sizes
      </h2>

      <p>
        We also varied batch size and found that K-Maxwell’s advantage remains robust at larger batch sizes, while Bi-Maxwell’s performance falls back to the control, which is Muon with a single EMA buffer. We suspect this reflects a shift in momentum’s role as larger batches make gradients less noisy. Recent work on <em>batch sharpness</em>, which describes the curvature encountered along each mini-batch’s gradient direction, finds that momentum imposes a tighter stability constraint at small batch sizes. At larger batch sizes, training approaches the optimizer’s deterministic stability boundary, that is the limit associated with full-batch gradients, allowing it to reach sharper regions than in the small-batch regime, which allows us to continue to converge despite high curvature. <a href="https://arxiv.org/html/2604.14108v1">[17]</a>
      </p>

      <figure id="figure-4">
        <a
          href="/images/k-maxwell/batch-size-ablation.png"
          aria-label="View Figure 4 at full size"
        >
          <img
            src="/images/k-maxwell/batch-size-ablation.png"
            alt="K-Maxwell, Bi-Maxwell, and Muon with momentum 0.95 compared against a matched Muon control with momentum zero, across batch sizes from 1 to 16 times baseline."
            loading="lazy"
            decoding="async"
          />
        </a>
        <figcaption>
          <strong>Figure 4. Batch-size ablation.</strong> Final validation-loss
          differences are measured against a fresh matched Muon control with µ =
          0; lower values are better. One batch-size unit is 524,288 tokens per
          step. Large markers show means over three independent seeds, hollow
          markers show individual runs, and error bars show ±1 population
          standard deviation. The shaded band spans ±0.0005 loss.
        </figcaption>
      </figure>

      <p>
        A related explanation is that K-Maxwell’s momentum annealing becomes more useful as the balance shifts from mostly gradient noise to predominately oscillations caused by curvature, causing us to overshoot along steep directions. Annealing the mixture may help K-Maxwell adapt to this shift more effectively than a fixed momentum mix such as in Bi-Maxwell.
      </p>

      <h2 id="limitations">Limitations</h2>

      <p>
        K-Maxwell has a substantial GPU memory cost at larger model sizes as it stores seven additional EMA buffers per parameter that it is applied to. This can become prohibitively expensive at the trillion-parameter scale. We are actively working on momentum approaches that use less memory.
      </p>

      <h2 id="conclusion">Conclusion</h2>
      <p>By extending single EMA and Bi-Maxwell momentum, K-Maxwell shows that mixing multiple momentum timescales and annealing their mixture during training can speed up pre-training convergence. Its robustness at larger batch sizes also suggests that these improvements extend beyond simply dampening stochastic gradient noise.</p>
      <p>Most momentum research has focused on toy models with NAG and Polyak momentum, we’re most interested now, in how momentum interacts with non-Euclidean gradient descent, where updates are shaped by a geometry beyond ordinary Euclidean distance. We hope to find a better theory for convergence at the edge of stability. However, many open questions remain about why temporal filtering improves optimization, and through what mechanism mixed EMA momentum does this. We believe understanding these mechanisms could help us design more effective, memory-efficient momentum methods.</p>

      <p>Acknowledgements:</p>

      <p>
        Thank you to <a href="https://jhong21.com/">Jerry Hong</a> for assisting
        with this project. Baseline
        implementations and their contributors are credited in the linked
        experiment reports.
      </p>

      <h2 id="references">References</h2>

      <p className="article-reference" id="ref-1">
        [1] Kingma, D. P., & Ba, J. (2015). <a href="https://arxiv.org/abs/1412.6980"><em>Adam: A method for stochastic optimization</em></a>. International Conference on Learning Representations.
      </p>

      <p className="article-reference" id="ref-2">
        [2] Pagliardini, M., Ablin, P., & Grangier, D. (2024). <a href="https://arxiv.org/html/2409.03137"><em>The AdEMAMix optimizer: Better, faster, older</em></a>. arXiv.
      </p>

      <p className="article-reference" id="ref-3">
        [3] jacknzheng. (2026c, August 27). <a href="https://github.com/KellerJordan/modded-nanogpt/pull/357"><em>Track 3: Annealed K-Maxwell momentum on tuned Muon—3160 steps (n=8)</em></a> [Pull request #357]. GitHub.
      </p>

      <p className="article-reference" id="ref-4">
        [4] jacknzheng. (2026d, August 28). <a href="https://github.com/KellerJordan/modded-nanogpt/pull/359"><em>Track 3: K-Maxwell on MuonH fast-slow decay, 3065 steps (n=8)</em></a> [Pull request #359]. GitHub.
      </p>

      <p className="article-reference" id="ref-5">
        [5] jacknzheng. (2026a). <a href="https://github.com/jacknzheng/kmaxwell-sota/tree/track3-kmaxwell-sota/records/track_3_optimization/results/20260824_kmaxwell_2680"><em>Record: Track 3 optimization—Frozen K-Maxwell momentum on SOAP-CWD—2680 steps (n=8)</em></a> [Experiment report]. GitHub.
      </p>

      <p className="article-reference" id="ref-6">
        [6] Vyas, N., Morwani, D., Zhao, R., Kwun, M., Shapira, I., Brandfonbrener, D., Janson, L., & Kakade, S. (2024). <a href="https://arxiv.org/abs/2409.11321"><em>SOAP: Improving and stabilizing Shampoo using Adam</em></a>. arXiv.
      </p>

      <p className="article-reference" id="ref-7">
        [7] Goh, G. (2017). <a href="https://distill.pub/2017/momentum/">Why momentum really works</a>. <em>Distill, 2</em>(4), Article e6. <a href="https://doi.org/10.23915/distill.00006">doi:10.23915/distill.00006</a>
      </p>

      <p className="article-reference" id="ref-8">
        [8] Polyak, B. T. (1964). <a href="https://doi.org/10.1016/0041-5553%2864%2990137-5">Some methods of speeding up the convergence of iteration methods</a>. <em>USSR Computational Mathematics and Mathematical Physics, 4</em>(5), 1–17.
      </p>

      <p className="article-reference" id="ref-9">
        [9] Cohen, J. M., Kaur, S., Li, Y., Kolter, J. Z., & Talwalkar, A. (2021). <a href="https://arxiv.org/abs/2103.00065"><em>Gradient descent on neural networks typically occurs at the edge of stability</em></a>. International Conference on Learning Representations.
      </p>

      <p className="article-reference" id="ref-10">
        [10] Hu, Y., Xiang, H., Gong, X., & Yu, H. (2026). <a href="https://arxiv.org/abs/2608.22994"><em>A physical response-and-memory model for Muon optimization</em></a>. arXiv.
      </p>

      <p className="article-reference" id="ref-11">
        [11] jacknzheng. (2026e). <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/train_gpt_kmaxwell_anneal.py"><em>train_gpt_kmaxwell_anneal.py</em></a> [Python source code]. GitHub.
      </p>

      <p className="article-reference" id="ref-12">
        [12] Smith, J. O., III. (2007). <a href="https://www.dsprelated.com/freebooks/filters/Bandwidth_One_Pole.html"><em>Introduction to digital filters: With audio applications</em></a>. W3K Publishing.
      </p>

      <p className="article-reference" id="ref-13">
        [13] Israel, R. (2002, January 29). <a href="https://personal.math.ubc.ca/~israel/m215/rich/rich.html"><em>Richardson extrapolation</em></a>. University of British Columbia.
      </p>

      <p className="article-reference" id="ref-14">
        [14] jacknzheng. (2026b). <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/README.md"><em>Record: Track 3 optimization—K-Maxwell annealed momentum on the tuned Muon baseline—3160 steps (n=8)</em></a> [Experiment report]. GitHub.
      </p>

      <p className="article-reference" id="ref-15">
        [15] Sutskever, I., Martens, J., Dahl, G., & Hinton, G. (2013). <a href="https://proceedings.mlr.press/v28/sutskever13.html">On the importance of initialization and momentum in deep learning</a>. In S. Dasgupta & D. McAllester (Eds.), <em>Proceedings of the 30th International Conference on Machine Learning</em> (Vol. 28, pp. 1139–1147). PMLR.
      </p>

      <p className="article-reference" id="ref-16">
        [16] Hinton, G., Srivastava, N., & Swersky, K. (n.d.). <a href="https://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf#page=29"><em>Neural networks for machine learning: Lecture 6e—RMSProp: Divide the gradient by a running average of its recent magnitude</em></a> [Lecture slides]. University of Toronto.
      </p>

      <p className="article-reference" id="ref-17">
        [17] Andreyev, A., Ananthkumar, A., Walden, M., Poggio, T., & Beneventano, P. (2026). <a href="https://arxiv.org/html/2604.14108v1"><em>Momentum further constrains sharpness at the edge of stochastic stability</em></a>. arXiv.
      </p>

      <p className="article-reference" id="ref-18">
        <a href="https://www.jmlr.org/papers/v20/17-526.html">18] Li, Q., Tai, C., &amp; E, W. (2019). [<em>Stochastic modified equations and dynamics of stochastic gradient algorithms I: Mathematical foundations</em></a>. Journal of Machine Learning Research, 20(40), 1–47.
      </p>

      <p className="article-reference" id="ref-19">
        [19] Cohen, J., Damian, A., Talwalkar, A., Kolter, J. Z., & Lee, J. D. (n.d.). <a href="https://centralflows.github.io/part1/"><em>Part I: How does gradient descent work?</em></a> Understanding Optimization in Deep Learning with Central Flows [Companion website].
      </p>
    </>
  )
}
