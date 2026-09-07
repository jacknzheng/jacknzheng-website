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
      <p className="article-byline">Collaborator: Jeffrey Cheng</p>

      <p>
        It is our belief that momentum remains an under-optimized area of
        pre-training. While recent research predominately focuses on improving
        the optimizer family itself, momentum has mostly remained a single EMA
        buffer with a fixed decay.{' '}
        <a href="https://arxiv.org/abs/1412.6980">[1]</a>,{' '}
        <a href="https://arxiv.org/html/2409.03137">[2]</a>
      </p>

      <h2 id="results">Results</h2>

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
        Our variant on single EMA momentum: K-Maxwell, achieves SOTA on Nano-GPT
        speed-run for both Muon, MuonH and the current world record SOAP
        optimizer, on Track 3 optimization. We surpass the previous world record
        by 90 steps (3% improvement in convergence speed) on Muon, and 60 steps
        on MuonH. However, K-Maxwell only surpasses the current world record by
        10 steps on SOAP-Muon, and does not reach statistical significance in
        surpassing its predecessor Bi-Maxwell, which we believe is due to the
        overlapping objective of reducing oscillations at the edge of stability,
        which both momentum and SOAP-style preconditioning{' '}
        <a href="https://arxiv.org/abs/2409.11321">[6]</a>, aim to address.
      </p>

      <p>
        However, we have found K-Maxwell generalizes well, and even improves at
        larger batch sizes, while Bi-Maxwell degrades, which suggests that the
        annealed momentum mix is not simply performing noise reduction.
      </p>

      <h2 id="what-is-momentum-doing">What is momentum doing?</h2>

      <p>
        Momentum is commonly thought of as a heavy ball carrying us through
        divots, saddle points and other local minima. However this is only
        partly true, momentum is helping us converge faster by dampening the
        effect of pathological curvature, which can be expressed in the
        condition number. The condition number represents the ratio of largest
        and smallest eigenvalues of the Hessian.
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
        In neural network optimization, assuming full batch gradient descent and
        a convex loss surface, the Polyak momentum variant pushes us faster
        along directions of low curvature, while dampening oscillations along
        directions of high curvature - which analytically accelerates
        convergence on ill-conditioned loss surfaces, by changing the dependence
        on condition number from{' '}
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <semantics>
              <mrow>
                <mi>κ</mi>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\kappa`}
              </annotation>
            </semantics>
          </math>
        </span>{' '}
        to{' '}
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <semantics>
              <mrow>
                <msqrt>
                  <mi>κ</mi>
                </msqrt>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\sqrt{\kappa}`}
              </annotation>
            </semantics>
          </math>
        </span>{' '}
        <a href="https://distill.pub/2017/momentum/">[7]</a>,{' '}
        <a href="https://doi.org/10.1016/0041-5553%2864%2990137-5">[8]</a>.
      </p>

      <p>
        This is quite intuitive as we can imagine momentum along a low curvature
        direction is accumulating persistent directions +g, +g, … while momentum
        along a high curvature direction is oscillating, or bouncing along the
        valley walls, with gradients frequently alternating sign: -g, +g, -g,
        +g, creating an implicit dampening effect. The reason for this
        oscillation is best explained by the fact that neural networks train on
        the edge of stability, an observation made by Cohen in 2021{' '}
        <a href="https://arxiv.org/abs/2103.00065">[9]</a>, meaning training
        progresses towards high curvature directions, causing curvature to
        increase throughout training and then oscillate at the stability
        boundary{' '}
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <semantics>
              <mrow>
                <mstyle scriptLevel={0} displaystyle="true">
                  <mfrac>
                    <mn>2</mn>
                    <mi>η</mi>
                  </mfrac>
                </mstyle>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\dfrac{2}{\eta}`}
              </annotation>
            </semantics>
          </math>
        </span>
        .
      </p>

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
          <a href="#ref-18">[18]</a>; related edge-of-stability findings are
          discussed in <a href="#ref-9">[9]</a>.
        </figcaption>
      </figure>

      <p>
        Momentum effectively dampens oscillations at the edge of stability,
        which allows us to take on a higher learning rate of{' '}
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <semantics>
              <mrow>
                <mstyle scriptLevel={0} displaystyle="true">
                  <mfrac>
                    <mrow>
                      <mn>2</mn>
                      <mo>+</mo>
                      <mn>2</mn>
                      <mi>β</mi>
                    </mrow>
                    <msub>
                      <mi>λ</mi>
                      <mrow>
                        <mi>m</mi>
                        <mi>a</mi>
                        <mi>x</mi>
                      </mrow>
                    </msub>
                  </mfrac>
                </mstyle>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\dfrac{2+2\beta}{\lambda_{max}}`}
              </annotation>
            </semantics>
          </math>
        </span>
        , while still ensuring convergence.
      </p>

      <h2 id="k-maxwell-momentum">K-Maxwell momentum</h2>

      <p>
        K-Maxwell momentum extends Bi-Maxwell{' '}
        <a href="https://arxiv.org/abs/2608.22994">[10]</a> and AdEMAMix{' '}
        <a href="https://arxiv.org/html/2409.03137">[2]</a> by introducing 8
        log-spaced EMA buffers, with decay rates (
        <span className="katex">
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <semantics>
              <mrow>
                <mi>β</mi>
              </mrow>
              <annotation encoding="application/x-tex">
                {String.raw`\beta`}
              </annotation>
            </semantics>
          </math>
        </span>
        ) fixed. The starting mixture of the momentum buffers have a mean age of
        58, and throughout training, linearly interpolates towards a mean age of
        26, until step 3250. Training begins with a single EMA momentum buffer
        and switches to K-Maxwell at step 1000.{' '}
        <a href="https://github.com/KellerJordan/modded-nanogpt/pull/357">[3]</a>
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
        The following pseudocode illustrates the annealed momentum after the
        switch step. Initialization and the surrounding optimizer are defined in
        the source trainer{' '}
        <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/train_gpt_kmaxwell_anneal.py">
          [11]
        </a>
        .
      </p>

      <pre>
        <code className="language-python">{pseudocode}</code>
      </pre>

      <p>
        We use log-spaced buffers because this allows us to capture meaningfully
        different timescales, as slower EMAs act as a low-pass filter{' '}
        <a href="https://www.dsprelated.com/freebooks/filters/Bandwidth_One_Pole.html">
          [12]
        </a>{' '}
        on faster frequencies and frequency characteristically behaves like:
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
        But mean age does not elicit the true expressivity enabled by multiple
        EMA buffers. As discussed in AdEMAMix{' '}
        <a href="https://arxiv.org/html/2409.03137">[2]</a>, a mixture of EMAs
        allows us to have substantial weight on the newest gradients while
        maintaining a longer tail of historic gradients.
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
        We believe that by maintaining meaningfully different timescales in
        every gradient step, we can remove predictable errors. Similar to
        Richardson extrapolation{' '}
        <a href="https://personal.math.ubc.ca/~israel/m215/rich/rich.html">
          [13]
        </a>{' '}
        that uses differing step-sizes to remove lower order errors, we use a
        weighted combination of different frequencies to attenuate to the
        recurring oscillations that occur at the edge of stability.
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
        We also observe that annealing momentum to a lower mean age at the end
        of training creates substantial gains compared to configurations without
        annealing.{' '}
        <a href="https://github.com/jacknzheng/kmaxwell-sota/blob/master/records/track_3_optimization/results/20260826_kmaxwell_3160/README.md">
          [14]
        </a>{' '}
        We suspect this is due to higher momentum better maintaining persistent
        gradients during the extended <em>transient phase</em> of training, and
        providing greater responsiveness in the <em>final convergence phase</em>{' '}
        which is needed to adapt to frequent oscillations{' '}
        <a href="https://proceedings.mlr.press/v28/sutskever13.html">[15]</a>.
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
        This aligns with the concern of momentum amplifying noise by
        internalizing random error, especially during the final phase of
        training where gradients frequently change sign and oscillate along
        directions of high curvature. The traditional approach is to normalize
        the gradient itself, by the root-squared gradient for example in scalar
        RMSProp which also slows convergence by shrinking the effective learning
        rate. It seems that annealing momentum may also do the trick, without
        delaying convergence.
      </p>

      <p>
        One possible explanation is that long momentum memory becomes less
        useful during late-stage convergence, when retaining older gradient
        directions can delay the optimizer’s response to changes in the loss
        landscape. Shortening that memory may improve responsiveness, although
        it also reduces noise smoothing. RMSProp addresses a related challenge
        by scaling each gradient component using its running root-mean-square
        magnitude{' '}
        <a href="https://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf#page=29">
          [16]
        </a>{' '}
        but typically slows late-stage convergence by reducing the effective
        learning rate. K-Maxwell momentum annealing seems to also do the trick
        without negatively impacting convergence.
      </p>

      <h2 id="extending-to-larger-batch-sizes">
        Extending to larger batch sizes
      </h2>

      <p>
        We also performed ablations on batch size, and found that K-Maxwell
        improves with larger batch sizes, while Bi-Maxwell degrades to the
        control which is Muon with single EMA momentum. We suspect this reflects
        a change in the role of momentum as training becomes less stochastic
        with larger batch size. Recent work on batch sharpness, which is the
        curvature encountered along each mini-batch’s gradient direction, finds
        that momentum imposes a tighter stability constraint at small batch
        sizes. At larger batch sizes however, training approaches the
        optimizer’s deterministic stability boundary, allowing it to explore
        sharper regions than in the small-batch regime.{' '}
        <a href="https://arxiv.org/html/2604.14108v1">[17]</a>
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
        One possible explanation is that K-Maxwell’s changing memory profile
        remains useful as the balance between stochastic fluctuations and
        curvature-driven oscillations shifts. This could explain why its benefit
        persists even as larger batches reduce the need for noise smoothing,
        fluctuations persist which K-Maxwell’s annealing dampens, whereas a
        fixed mixture such as Bi-Maxwell does not.
      </p>

      <h2 id="limitations">Limitations</h2>

      <p>
        The GPU memory profile of K-Maxwell at larger model sizes is significant
        as it requires storing 7 additional EMA buffers on top of the single
        EMA, per parameter. This becomes prohibitively expensive at the trillion
        parameter model scale. We are actively working on more memory efficient
        momentum approaches.
      </p>

      <p>Acknowledgements:</p>

      <p>
        Thank you to Jerry Hong for assisting with this project. Baseline
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
        [18] Cohen, J., Damian, A., Talwalkar, A., Kolter, J. Z., & Lee, J. D. (n.d.). <a href="https://centralflows.github.io/part1/"><em>Part I: How does gradient descent work?</em></a> Understanding Optimization in Deep Learning with Central Flows [Companion website].
      </p>
    </>
  )
}
