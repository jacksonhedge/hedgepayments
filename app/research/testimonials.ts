// Real tester feedback shown in the ticker under the hero on /research.
//
// Leave this EMPTY until you have genuine quotes — the ticker does not render
// when the array is empty. Do not add invented names/quotes (FTC fake-review
// rule, and the audience for this page will notice).
//
// Suggested fields: first name + last initial, segment (school / "SideBet user"
// / etc.), the app they tested, and a short first-person quote. `avatar` is
// optional; initials are rendered when it's omitted.

export type Testimonial = {
  name: string
  segment: string
  app: string
  quote: string
  avatar?: string
}

export const TESTIMONIALS: Testimonial[] = []
