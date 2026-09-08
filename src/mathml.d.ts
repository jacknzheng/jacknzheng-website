// @types/react (19.2.x) ships no JSX typings for MathML elements, though React
// renders them correctly. Declare the subset used by article equations.
import type { HTMLAttributes } from 'react'

type MathMLProps = HTMLAttributes<Element> & {
  display?: 'block' | 'inline'
  displaystyle?: 'true' | 'false'
  scriptlevel?: number
  separator?: 'true' | 'false'
  stretchy?: 'true' | 'false'
  accent?: 'true' | 'false'
  encoding?: string
  width?: string
  xmlns?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      math: MathMLProps
      semantics: MathMLProps
      annotation: MathMLProps
      mrow: MathMLProps
      mi: MathMLProps
      mo: MathMLProps
      mn: MathMLProps
      msub: MathMLProps
      msup: MathMLProps
      msqrt: MathMLProps
      mfrac: MathMLProps
      mstyle: MathMLProps
      mover: MathMLProps
      munder: MathMLProps
      mspace: MathMLProps
    }
  }
}
