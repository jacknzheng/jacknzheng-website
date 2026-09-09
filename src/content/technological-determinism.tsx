// Published from the author’s Notion essay; wording and source links are preserved.
export default function TechnologicalDeterminism() {
  return (
    <>
      <p>
        <em>{"On Technological Determinism"}</em>
      </p>
      <p>
        {
          "Technological determinism is the belief that technology is the single driving force of history, dictating how human customs, morals, institutions, laws and more, develop and change over time. In a recent blog post by Mechanize "
        }
        <a href={"https://www.mechanize.work/blog/technological-determinism/"}>
          {"[1]"}
        </a>
        {", the cofounders argue that: "}
      </p>
      <blockquote className="my-6 border-l-2 border-rule pl-5">
        <p>
          <em>
            {
              "“Whether we like it or not, humanity will develop roughly the same technologies, in roughly the same order, in roughly the same way, regardless of what choices we make now.”"
            }
          </em>
        </p>
      </blockquote>
      <p>
        {
          "This has become a growing consensus in the Bay: that our future has already been determined by the technology we began to develop decades ago. And so there is a sense of inevitability, even defeatism, that the dominoes have already fallen and the inexorable march of progress has begun its unwavering stride. So our futile efforts at changing it are better spent either accelerating it or insuring ourselves against it."
        }
      </p>
      <p>
        {
          "This is not at all irrational, technology capable of labor substitution has historical precedent. "
        }
        <a
          href={
            "https://economics.mit.edu/sites/default/files/publications/the%20polarization%20of%20us%20labor%202006.pdf"
          }
        >
          {"[2]"}
        </a>
        {" We would be unwise to ignore the lessons from: Engels’ Pause "}
        <a href={"https://gabriel-zucman.eu/files/teaching/Allen09.pdf"}>
          {"[3]"}
        </a>
        {", the Gilded Age and the Great Decoupling "}
        <a href={"https://www.nber.org/papers/w24165"}>{"[4]"}</a>
        {
          ", as well as not be hopeful given the material abundance observed in the centuries after mass industrialization."
        }
      </p>
      <p>
        {
          "But we made many mistakes in the decades of early industrialization, and I strongly believe that many of these can be avoided, mitigated or the extended period of mass poverty, can be shortened - this time around."
        }
      </p>
      <p>{"In this article, we’ll consider"}</p>
      <ol className="my-5 list-decimal space-y-3 pl-6">
        <li>{"The case for technological determinism"}</li>
        <li>
          {
            "How change as a result of technology, can still be steered with reform"
          }
        </li>
        <li>
          {
            "How the risks of technological advancement can be controlled, and what must be actively worked on to prevent them"
          }
        </li>
      </ol>
      <h2 id={"the-case-for-technological-determinism"}>
        {"The case for technological determinism"}
      </h2>
      <p>
        {
          "Determinism and predestination have strong historical roots, from the "
        }
        <em>{"Moirai"}</em>
        {" of Greek mythology to "}
        <em>{"Mingyun "}</em>
        {
          "in Confucianist belief, but economic determinism is a recent phenomenon of thought. It is argued to have first appeared in Marx’s theory of historical materialism. Marx seems to posit that society organizes itself around technology, as it changes the material means of survival:"
        }
      </p>
      <blockquote className="my-6 border-l-2 border-rule pl-5">
        <p>
          {
            "“The hand-mill gives you society with the feudal lord; the steam-mill society with the industrial capitalist.”"
          }
        </p>
        <footer className="mt-2 text-sm">
          <em>{"Karl Marx, The Poverty of Philosophy"}</em>{" "}
          <a
            href={
              "https://www.marxists.org/archive/marx/works/1847/poverty-philosophy/ch02.htm"
            }
          >
            {"[5]"}
          </a>
        </footer>
      </blockquote>
      <p>
        {
          "However, Marx predominately focuses on how the distribution of food, water and resources, through systems like wage labor, shape "
        }
        <em>{"class dynamics. "}</em>
        {
          "Technology serves as perhaps one of many mechanisms of material change. The case for technological determinism is decisively more pointed."
        }
      </p>
      <p>{"Underpinning technological determinism are 2 core beliefs:"}</p>
      <ul className="my-5 list-disc space-y-3 pl-6">
        <li>
          <strong>{"Autonomy "}</strong>
          {
            "- technology develops by its own internal logic, driven from outside society."
          }
        </li>
        <li>
          <strong>{"Primacy "}</strong>
          {
            "- technological change is the main driver of societal change. Culture and institutions adapt to it."
          }
        </li>
      </ul>
      <p>
        {
          "In Mechanize’s essay, they put forward two arguments to support these claims about technology."
        }
      </p>
      <p>
        {
          "First, they show that important discoveries are typically made by multiple people around the same time. They offer a rolodex of examples showing that history-altering discoveries are made concurrently and independently by many people. Famously, Alexander Graham Bell filed a patent application for the telephone on the same day Elisha Gray filed a patent caveat, separated by only hours. "
        }
        <a
          href={
            "https://commons.princeton.edu/wp-content/uploads/sites/70/2019/08/scientificamerican0181-156-hounshell.pdf"
          }
        >
          {"[6]"}
        </a>
      </p>
      <figure id="figure-1">
        <img
          src="/images/technological-determinism/telephone-patents.png"
          alt="Telephone patent sketches by Elisha Gray (top) and Alexander Graham Bell (bottom)."
          aria-describedby="figure-1-caption"
          width={642}
          height={775}
          loading="lazy"
          decoding="async"
        />
        <figcaption id="figure-1-caption">
          <strong>Figure 1. Gray’s and Bell’s telephone designs.</strong> Patent
          sketches by Elisha Gray (top) and Alexander Graham Bell (bottom).{" "}
          Source:{" "}
          <a href="https://commons.princeton.edu/wp-content/uploads/sites/70/2019/08/scientificamerican0181-156-hounshell.pdf">
            David A. Hounshell
          </a>
          , via{" "}
          <a href="https://www.construction-physics.com/p/how-often-do-inventions-have-multiple">
            Brian Potter
          </a>
          .
        </figcaption>
      </figure>
      <p>
        {
          "This is admittedly not an anomaly in history. Many important inventions such as jet engines, the telegraph, and the Hall-Héroult process of smelting aluminum were invented by multiple people around similar times. "
        }
        <a
          href={
            "https://www.construction-physics.com/p/how-often-do-inventions-have-multiple"
          }
        >
          {"[7]"}
        </a>{" "}
        <a href={"https://www.mechanize.work/blog/technological-determinism/"}>
          {"[1]"}
        </a>{" "}
      </p>
      <p className="my-6 border-l-2 border-rule pl-5">
        <a
          href={
            "https://www.construction-physics.com/p/how-often-do-inventions-have-multiple"
          }
        >
          {"How Often Do Inventions Have Multiple Inventors?"}
        </a>
      </p>
      <p>
        {
          "This would seem to insinuate that as important technology becomes possible to invent, humanity invents it."
        }
      </p>
      <p>
        {
          "The second argument points out that isolated societies tend to converge on the same technologies. The Spanish, the Mesopotamians, the Chinese and more, all seem to develop the wheel, different versions of paper and writing, the craft of metallurgy and not only this, but they also all converge on similar ways of organizing society: the bureaucratic state, taxation and basic accounting. "
        }
      </p>
      <p>
        {
          "So, if all important technologies are discovered as soon as they become possible by multiple, independent inventors, and independent societies throughout history seem to converge on the same technologies and "
        }
        <em>{"thus, "}</em>
        {
          "the same institutions, it really does seem that technology is the primal driver of historical progress."
        }
      </p>
      <h2 id={"technology-does-not-determine-societal-change"}>
        {"Technology does not determine societal change"}
      </h2>
      <p>
        {
          "This narrative of determinism must have you believe that technology is an unyielding process that causes all societies to converge on some single social equilibrium. Yet history is replete with counterexamples. "
        }
      </p>
      <p>
        {
          "Industrialized societies in the East and West were starkly different - predominately due to the political institutions that mediated the technological change. Even if we concede our technological trajectory is not under our control, it is unlikely to be true that society’s trajectory is as well."
        }
      </p>
      <p>
        {
          "While the Soviet Union was able to develop thermonuclear weapons and launch Sputnik into space, it struggled to ship food across its own borders, as the life of the average citizen deteriorated. "
        }
        <em>{"Anti-chastnik "}</em>
        {
          "policies in the 1930s to 50s, destroyed commercial networks and removed merchant middlemen, making it prohibitively difficult to transport produce from agrarian nations to urban masses inland. "
        }
        <a
          href={
            "https://books.google.com/books/about/The_Making_of_the_Soviet_System.html?id=w-0CAQAAIAAJ"
          }
        >
          {"[8]"}
        </a>
        {
          " Central planning only exacerbated allocation difficulties. Ironically, the Soviet Union often had grown more food than it needed, but it possessed little capacity to distribute it - creating what came to be known as a ‘nation of queuers’."
        }
      </p>
      <figure id="figure-2">
        <img
          src="/images/technological-determinism/bread-queue.png"
          alt="People queuing outside a bread shop in Russia in 1993."
          aria-describedby="figure-2-caption"
          width={551}
          height={362}
          loading="lazy"
          decoding="async"
        />
        <figcaption id="figure-2-caption">
          <strong>Figure 2. A bread queue in Russia, 1993.</strong> Photograph
          credited to Gennady Mikheev, via{" "}
          <a href="https://www.researchgate.net/figure/Bread-line-in-a-time-of-shortage-Source-Gennady-Mikheev-Russia-in-1993-https_fig2_340161468">
            ResearchGate
          </a>
          .
        </figcaption>
      </figure>
      <p>
        {
          "This was not true of early American industrialization, which expanded the purchasing power of substantial sections of the wage-earning population. "
        }
        <a href={"https://www.nber.org/papers/h0028"}>{"[9]"}</a>
        {" Canals and railroads connected producers with distant markets, "}
        <a href={"https://www.nber.org/papers/w5303"}>{"[10]"}</a>
        {
          " as mechanization lowered costs for everyday goods. While urban life did initially suffer from disease, abject poverty and inequality, it was not characterized by the permanent shortages and persistent famine that defined most of Soviet life. "
        }
      </p>
      <p>
        {
          "However, even the widening inequality seen as an inevitable byproduct of industrial capitalism is not unavoidable. We can consider post-war industrial Sweden and America. Both nations’ wage distributions sharply diverged in the 1970s, predominately due to Swedish wage-setting arrangements and active labor market policies. Strong unions collectively bargained for a policy of wage solidarity, narrowing wage differences across firms and industries. "
        }
        <a href={"https://www.nber.org/system/files/chapters/c6522/c6522.pdf"}>
          {"[11]"}
        </a>{" "}
        <a href={"https://www.nber.org/papers/w7502"}>{"[12]"}</a>
        {
          " Between 1968 and 1984, inequality in male hourly wages shrunk substantially, while American wage inequality only widened after 1970. "
        }
        <a href={"https://www.nber.org/system/files/chapters/c6522/c6522.pdf"}>
          {"[11]"}
        </a>{" "}
        <a href={"https://www.nber.org/papers/w3817"}>{"[13]"}</a>
        {
          " Reaganism then accelerated wage deflation and disparities in the US via corporate deregulation and the dismantling of labor unions "
        }
        <a href={"https://www.nber.org/papers/w5093"}>{"[14]"}</a>
        {
          ", paving the way for the corporate consolidation present in America today. Again, this is not true of countries such as Singapore and Australia which enforced strict pro-competition mandates, "
        }
        <a
          href={
            "https://www.ccs.gov.sg/anti-competitive-practices/legislation-and-guidelines/competition-act-and-guidelines/"
          }
        >
          {"[15]"}
        </a>{" "}
        <a
          href={
            "https://www.pc.gov.au/inquiries-and-research/national-competition-policy/report/"
          }
        >
          {"[16]"}
        </a>
        {" and in Australia, strong labor coordination persisted. "}
      </p>
      <h2 id={"effective-ai-reform-can-change-our-trajectory"}>
        {"Effective AI reform can change our trajectory"}
      </h2>
      <p>
        {
          "Just as with industrialization, social policies that mediated technological change in the 20th century will again mediate the imminent restructuring of society in the 21st century. While it would be naive to retrofit aforementioned social policies onto our current-day labor markets, we can use them to reason about policies for the immediate future. "
        }
      </p>
      <p>
        {
          "AI will likely first automate menial back-office jobs, potentially expanding employment and productivity in the short-term but depressing wages as skilled labor performance reaches parity with lower-skilled labor "
        }
        <a
          href={"https://www.fabricatedknowledge.com/p/mythos-and-engels-pause"}
        >
          {"[17]"}
        </a>{" "}
        <a href={"https://www.nber.org/papers/w25684"}>{"[18]"}</a>
        {
          ". It is clear that similar effects were shared by industrializing, and manufacturing economies. "
        }
        <a href={"https://gabriel-zucman.eu/files/teaching/Allen09.pdf"}>
          {"[3]"}
        </a>
        {" We can observe that:"}
      </p>
      <ul className="my-5 list-disc space-y-3 pl-6">
        <li>
          <strong>
            {
              "Wage-setting institutions and large-scale unionization provided strong counterbalances against economic polarization. "
            }
          </strong>
          {
            "While transfer payments and active labor market policy were important at supporting the lowest income earners, the decentralization of collective bargaining in 1980s Sweden showed wage-setting instead was a major contributor to keeping wage differences compressed. "
          }
          <a href={"https://www.nber.org/papers/w7502"}>{"[12]"}</a>
        </li>
        <li>
          <strong>
            {
              "The distribution of manufactured goods, just as the distribution of intelligence will determine shared prosperity."
            }
          </strong>
          {
            " Technological progress naturally concentrates economic gains in free market systems. Distribution infrastructure needs to be built such as public compute allocation and cheap, safe, open intelligence."
          }
        </li>
      </ul>
      <p>
        {
          "Without going too deeply into project and policy proposals, as I plan to in a later post, the future of work and the organization of society is evidently still being set into motion. If anything, efforts now will have lasting effects on the century to come, just as the political and economic reforms of the industrial era did. "
        }
      </p>
      <h2
        id={
          "technological-paths-can-be-broadly-determined-but-still-rearranged"
        }
      >
        {"The order of discovery can still be rearranged"}
      </h2>
      <p>
        {
          "Even if our broad technological path is determined by precedent inventions, changing the order at which technologies are developed, or even which technologies we develop alongside each other, could be existentially important. Permissive Action Links (PALs) on nuclear weapons, are a compelling example that state-sponsored development can mediate our path. "
        }
      </p>
      <figure id="figure-3">
        <img
          src="/images/technological-determinism/b61-pal.png"
          alt="A B61 nuclear bomb shown assembled at the back and disassembled into components in the foreground."
          aria-describedby="figure-3-caption"
          width={345}
          height={227}
          loading="lazy"
          decoding="async"
        />
        <figcaption id="figure-3-caption">
          <strong>Figure 3. Components of a B61 nuclear bomb.</strong> A{" "}
          <a href="https://en.wikipedia.org/wiki/B61_nuclear_bomb">B-61</a> bomb
          contains 5,919 parts, including its PAL. Photo: U.S. government, via{" "}
          <a href="https://commons.wikimedia.org/wiki/File:B-61_bomb_%28DOE%29.jpg">
            Wikimedia Commons
          </a>
          .
        </figcaption>
      </figure>
      <p>
        {
          "PALs were developed as a counterpart technology to nuclear weapons, for controlling unauthorized access and use. Developed by Sandia in 1960, by 1962 Kennedy had mandated their installation on all US nuclear weapons dispersed to NATO commands. Designed as coded locking devices, they regulated whether a nuclear weapon could be used without authorization. "
        }
        <a href={"https://www.sandia.gov/about/history/1960s/"}>{"[19]"}</a>
        {
          " Separate safeguards, including environmental sensing devices that check conditions match a predetermined launch sequence, and accident-safety switches, were also designed to prevent unintentional detonation. In 1961, a B-52 bomber carrying two Mark 39 hydrogen bombs broke apart over Goldsboro, North Carolina. One bomb progressed through several stages of its arming sequence, but one switch remaining in the safe position preventing catastrophe. While PALs, a preventative technology developed to control the capabilities of nuclear weapons, are certainly an outlier in some respect - they are not alone. Emergency core cooling mechanisms were developed alongside in nuclear reactors and biological safety cabinets for epidemiology were also instantiated to control the existential risks associated with new technologies."
        }
      </p>
      <h2 id={"ai-safety-needs-policy-intervention"}>
        {"AI safety needs policy intervention"}
      </h2>
      <p>
        {
          "Today we face a similar threat with AI’s cyber and bio capabilities. It has become clear that models possess the ability to manipulate human judgments "
        }
        <a href={"https://www.nature.com/articles/s41562-025-02194-6"}>
          {"[20]"}
        </a>
        {", conduct scientific research "}
        <a href={"https://arxiv.org/abs/2502.18864"}>{"[21]"}</a>
        {", and support large-scale cyberattacks "}
        <a href={"https://www.anthropic.com/news/disrupting-AI-espionage"}>
          {"[22]"}
        </a>
        {
          ", and further, removing refusal behavior can be done with relatively few modifications to the model. "
        }
        <a href={"https://arxiv.org/abs/2406.11717"}>{"[23]"}</a>
        {
          " While AI safety is not underfunded, it certainly is, relative to the capital dedicated to push frontier capabilities. Safety at most frontier labs are ad-addendum to the core training process due to a lack of financial incentive to push alignment as far as capabilities "
        }
        <a href={"https://techcrunch.com/2026/02/14/is-safety-is-dead-at-xai/"}>
          {"[24]"}
        </a>
        {
          ". Highly capable Chinese open weight models are released on the open internet. And it is not unreasonable to expect the Hugging Face hack, and wiki message boards are just the beginning of us discovering emergent multi-agent behavior. "
        }
        <a href={"https://collusion.wiki/"}>{"[25]"}</a>{" "}
        <a
          href={
            "https://www.redwoodresearch.org/research/hugging-face-incident"
          }
        >
          {"[26]"}
        </a>
        {
          " The negative externalities of AI may be difficult for a free market to internalize, and so as with PALs, it is my contention that command and control technologies will have to be a public-led effort and likely an initiative akin to the Manhattan project, as model capabilities continue to outpace our understanding of models themselves."
        }
      </p>
      <h2 id={"conclusion"}>{"Conclusion"}</h2>
      <blockquote className="my-6 border-l-2 border-rule pl-5">
        <p>
          {
            "“In any moment of decision, the best thing you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is nothing.”"
          }
          <em>
            <br />
            {"Thomas Carlyle"}
          </em>
        </p>
      </blockquote>
      <p>
        {
          "We live in a time of momentous change. Because of this, as individuals, groups and organizations we possess a disproportionate ability to affect the future."
        }
      </p>
      <p>
        {
          "Whether we believe it is already determined or malleable can feel like a trivial argument to be had, that is just of historical or intellectual interest. But I would argue this is one of the most important perspectives of our time."
        }
      </p>
      <p>
        {
          "If we believe that humanity’s trajectory is entirely out of our control, we might accelerate headlong towards highly capable models. Yet AI does not need to progress much further to create suffering at an inordinate scale - suffering that could otherwise be mitigable."
        }
      </p>
      <p>
        {
          "On the other hand, the belief that technological paths are entirely under our control, and capability deceleration is a worthy pursuit, are likely also flawed. There are overwhelming market and geopolitical forces at play for full automation and super-intelligence to exist. "
        }
      </p>
      <p>
        {
          "We need to be selective about the methods we choose to affect the future. Hence, having a clear-minded perspective on which parameters could still change our trajectory, is existentially important. It would change the initiatives we choose to fund, the policies we vote for, and the problems we choose to pursue as individuals."
        }
      </p>
      <h2 id={"references"}>{"References"}</h2>
      <p className="article-reference" id="ref-1">
        {
          "[1] Barnett, Matthew, Tamay Besiroglu, and Ege Erdil. (2025, October 6). "
        }
        <a href={"https://www.mechanize.work/blog/technological-determinism/"}>
          {"The future of AI is already written"}
        </a>
        {". Mechanize."}
      </p>
      <p className="article-reference" id="ref-2">
        {
          "[2] Autor, David H., Lawrence F. Katz, and Melissa S. Kearney. (2006). "
        }
        <a
          href={
            "https://economics.mit.edu/sites/default/files/publications/the%20polarization%20of%20us%20labor%202006.pdf"
          }
        >
          {"The Polarization of the U.S. Labor Market"}
        </a>
        {". American Economic Review, 96(2), 189–194."}
      </p>
      <p className="article-reference" id="ref-3">
        {"[3] Allen, Robert C. (2009). "}
        <a href={"https://gabriel-zucman.eu/files/teaching/Allen09.pdf"}>
          {
            "Engels’ pause: Technical change, capital accumulation, and inequality in the British industrial revolution"
          }
        </a>
        {". Explorations in Economic History, 46(4), 418–435."}
      </p>
      <p className="article-reference" id="ref-4">
        {"[4] Stansbury, Anna M., and Lawrence H. Summers. (2017). "}
        <a href={"https://www.nber.org/papers/w24165"}>
          {"Productivity and Pay: Is the Link Broken?"}
        </a>
        {". NBER Working Paper 24165."}
      </p>
      <p className="article-reference" id="ref-5">
        {"[5] Marx, Karl. (1847). "}
        <a
          href={
            "https://www.marxists.org/archive/marx/works/1847/poverty-philosophy/ch02.htm"
          }
        >
          {"The Poverty of Philosophy, Chapter II, §1, Second Observation"}
        </a>
        {". Marxists Internet Archive."}
      </p>
      <p className="article-reference" id="ref-6">
        {"[6] Hounshell, David A. (1981). "}
        <a
          href={
            "https://commons.princeton.edu/wp-content/uploads/sites/70/2019/08/scientificamerican0181-156-hounshell.pdf"
          }
        >
          {"Two Paths to the Telephone"}
        </a>
        {". Scientific American."}
      </p>
      <p className="article-reference" id="ref-7">
        {"[7] Potter, Brian. (2025, June 5). "}
        <a
          href={
            "https://www.construction-physics.com/p/how-often-do-inventions-have-multiple"
          }
        >
          {"How Common Is Multiple Invention?"}
        </a>
        {". Construction Physics."}
      </p>
      <p className="article-reference" id="ref-8">
        {"[8] Lewin, Moshe. (1985). "}
        <a
          href={
            "https://books.google.com/books/about/The_Making_of_the_Soviet_System.html?id=w-0CAQAAIAAJ"
          }
        >
          {
            "The Making of the Soviet System: Essays in the Social History of Interwar Russia"
          }
        </a>
        {". Pantheon Books."}
      </p>
      <p className="article-reference" id="ref-9">
        {"[9] Sokoloff, Kenneth L., and Georgia C. Villaflor. (1991). "}
        <a href={"https://www.nber.org/papers/h0028"}>
          {
            "The Market for Manufacturing Workers During Early Industrialization: The American Northeast, 1820 to 1860"
          }
        </a>
        {". NBER Historical Working Paper 28."}
      </p>
      <p className="article-reference" id="ref-10">
        {"[10] Slaughter, Matthew J. (1995). "}
        <a href={"https://www.nber.org/papers/w5303"}>
          {
            "The Antebellum Transportation Revolution and Factor-Price Convergence"
          }
        </a>
        {". NBER Working Paper 5303."}
      </p>
      <p className="article-reference" id="ref-11">
        {"[11] Edin, Per-Anders, and Robert Topel. (1997). "}
        <a href={"https://www.nber.org/system/files/chapters/c6522/c6522.pdf"}>
          {"Wage Policy and Restructuring: The Swedish Labor Market since 1960"}
        </a>
        {
          ". In The Welfare State in Transition: Reforming the Swedish Model, pp. 155–202. University of Chicago Press."
        }
      </p>
      <p className="article-reference" id="ref-12">
        {"[12] Davis, Steven J., and Magnus Henrekson. (2000). "}
        <a href={"https://www.nber.org/papers/w7502"}>
          {"Wage-Setting Institutions as Industrial Policy"}
        </a>
        {
          ". NBER Working Paper 7502; published in Labour Economics, 12(3), 345–377 (2005)."
        }
      </p>
      <p className="article-reference" id="ref-13">
        {"[13] Goldin, Claudia, and Robert A. Margo. (1991). "}
        <a href={"https://www.nber.org/papers/w3817"}>
          {
            "The Great Compression: The Wage Structure in the United States at Mid-Century"
          }
        </a>
        {
          ". NBER Working Paper 3817; published in The Quarterly Journal of Economics, 107(1), 1–34 (1992)."
        }
      </p>
      <p className="article-reference" id="ref-14">
        {"[14] DiNardo, John, Nicole M. Fortin, and Thomas Lemieux. (1995). "}
        <a href={"https://www.nber.org/papers/w5093"}>
          {
            "Labor Market Institutions and the Distribution of Wages, 1973–1992: A Semiparametric Approach"
          }
        </a>
        {
          ". NBER Working Paper 5093; published in Econometrica, 64(5), 1001–1044 (1996)."
        }
      </p>
      <p className="article-reference" id="ref-15">
        {"[15] Competition and Consumer Commission of Singapore. "}
        <a
          href={
            "https://www.ccs.gov.sg/anti-competitive-practices/legislation-and-guidelines/competition-act-and-guidelines/"
          }
        >
          {"Competition Act and Guidelines"}
        </a>
        {". Official guidance on the Competition Act 2004."}
      </p>
      <p className="article-reference" id="ref-16">
        {"[16] Productivity Commission. (2005). "}
        <a
          href={
            "https://www.pc.gov.au/inquiries-and-research/national-competition-policy/report/"
          }
        >
          {"Review of National Competition Policy Arrangements"}
        </a>
        {". Australian Government inquiry report."}
      </p>
      <p className="article-reference" id="ref-17">
        {"[17] O’Laughlin, Doug. (2026, April 15). "}
        <a
          href={"https://www.fabricatedknowledge.com/p/mythos-and-engels-pause"}
        >
          {"Engels’ Pause and the Permanent Underclass"}
        </a>
        {". Fabricated Knowledge."}
      </p>
      <p className="article-reference" id="ref-18">
        {"[18] Acemoglu, Daron, and Pascual Restrepo. (2019). "}
        <a href={"https://www.nber.org/papers/w25684"}>
          {
            "Automation and New Tasks: How Technology Displaces and Reinstates Labor"
          }
        </a>
        {". NBER Working Paper 25684."}
      </p>
      <p className="article-reference" id="ref-19">
        {"[19] Sandia National Laboratories. "}
        <a href={"https://www.sandia.gov/about/history/1960s/"}>
          {"1960s: Spinning off new capabilities, new directions"}
        </a>
        {
          ". See the entry for June 6, 1962, on PAL development in 1960 and Kennedy’s NSAM 160."
        }
      </p>
      <p className="article-reference" id="ref-20">
        {
          "[20] Salvi, Francesco, Manoel Horta Ribeiro, Riccardo Gallotti, and Robert West. (2025). "
        }
        <a href={"https://www.nature.com/articles/s41562-025-02194-6"}>
          {"On the conversational persuasiveness of GPT-4"}
        </a>
        {
          ". Nature Human Behaviour, 9, 1645–1653. Use the updated article, including the September 3, 2026 author correction."
        }
      </p>
      <p className="article-reference" id="ref-21">
        {"[21] Gottweis, Juraj, et al. (2025). "}
        <a href={"https://arxiv.org/abs/2502.18864"}>
          {"Towards an AI co-scientist"}
        </a>
        {". arXiv:2502.18864."}
      </p>
      <p className="article-reference" id="ref-22">
        {"[22] Anthropic. (2025, November 13). "}
        <a href={"https://www.anthropic.com/news/disrupting-AI-espionage"}>
          {
            "Disrupting the first reported AI-orchestrated cyber espionage campaign"
          }
        </a>
        {
          ". Primary incident report; its findings and attribution are Anthropic’s assessment."
        }
      </p>
      <p className="article-reference" id="ref-23">
        {"[23] Arditi, Andy, et al. (2024). "}
        <a href={"https://arxiv.org/abs/2406.11717"}>
          {"Refusal in Language Models Is Mediated by a Single Direction"}
        </a>
        {". NeurIPS 2024; arXiv:2406.11717."}
      </p>
      <p className="article-reference" id="ref-24">
        {"[24] Ha, Anthony. (2026, February 14). "}
        <a href={"https://techcrunch.com/2026/02/14/is-safety-is-dead-at-xai/"}>
          {"Is safety ‘dead’ at xAI?"}
        </a>
        {". TechCrunch."}
      </p>
      <p className="article-reference" id="ref-25">
        {
          "[25] Von Arx, Sydney, Cormac Slade Byrd, Spencer Kitts, and Thomas Larsen. (2026, September 4). "
        }
        <a href={"https://collusion.wiki/"}>
          {"Discovery of a new OpenAI agent message board"}
        </a>
        {". "}
        <a href={"http://Collusion.wiki"}>{"Collusion.wiki"}</a>
        {"."}
      </p>
      <p className="article-reference" id="ref-26">
        {
          "[26] Greenblatt, Ryan, Ajeya Cotra, and Hjalmar Wijk. (2026, August 26). "
        }
        <a
          href={
            "https://www.redwoodresearch.org/research/hugging-face-incident"
          }
        >
          {
            "Brief independent investigation of agents’ behavior, reasoning and collaboration in the OpenAI / Hugging Face hacking incident"
          }
        </a>
        {". METR and Redwood Research."}
      </p>
    </>
  );
}
