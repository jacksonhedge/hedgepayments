// packages/link/src/app/flows/chance/index.ts
import { h, render } from 'preact'
import { Chance } from './Chance'
import type { FlowCtx } from '../flowCtx'

export function mountChance(root: HTMLElement, ctx: FlowCtx): void {
  render(h(Chance, { ctx }), root)
}
