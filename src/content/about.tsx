// Author-provided biography, exported from Notion.
export default function About() {
  return (
    <>
      <p>
        I’m currently doing pre-training and alignment research at South Park
        Commons.
      </p>

      <p>
        Before this I was studying law in Melbourne, Australia, which I left
        after sophomore, to join Superpower. I studied political philosophy and
        economics, and I previously was a competitive national debater.
      </p>

      <details className="my-5">
        <summary className="cursor-pointer font-bold focus-visible:outline-2 focus-visible:outline-offset-4">
          Brief timeline
        </summary>
        <ul className="about-timeline">
          <li>
            21: Joined South Park Commons - I left Superpower at Series B to do AI
            research with friends at SPC. Broke the NanoGPT speedrun WR with Jeffrey
            Cheng.
          </li>
          <li>
            20: Left university to join Superpower - helped scale paid media, worked
            on medical harness evals, and commercializing prescriptions.
            <figure>
              <img
                src="/images/about/founding-growth-team.jpeg"
                alt="Superpower founding team"
                width={1024}
                height={768}
                loading="lazy"
              />
              <figcaption>Founding team!</figcaption>
            </figure>
          </li>
          <li>
            20: Won a Stanford hackathon - built a compliance company, made a lot of
            mistakes, learnt a lot. Ended up spinning it down and joining Superpower.
            <figure>
              <img
                src="/images/about/stanford-hackathon.png"
                alt="Hackathon team from Australia, London and Manila"
                width={2048}
                height={1365}
                loading="lazy"
              />
              <figcaption>
                Hackathon team from Australia, London and Manila
              </figcaption>
            </figure>
          </li>
          <li>
            19: Worked in Australian parliament - for the first Liberals office in
            Australia. Did a lot of econometrics and voter analysis. But quickly
            became disillusioned by politics as a vehicle for change.
          </li>
          <li>
            18: National University Debating - one of the youngest semi-finalist
            teams, University of Melbourne firsts.
            <figure>
              <img
                src="/images/about/university-debating.jpeg"
                alt="University of Melbourne debating team"
                width={1024}
                height={768}
                loading="lazy"
              />
              <figcaption>
                The only photo where we’re not holding Liv’s mini witch charm
              </figcaption>
            </figure>
          </li>
          <li>
            18: Finals - got a full scholarship into economics and law, led a state
            debating team and went to nationals for Model UN.
          </li>
          <li>
            12: Did a diploma in piano - mostly forced by parents, but incredibly
            grateful for it. Now piano is only to be played at Asian family dinners
            to impress the relatives.
          </li>
        </ul>
      </details>
    </>
  );
}
