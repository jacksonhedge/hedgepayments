import Anthropic from '@anthropic-ai/sdk';
import { RankProvider, RankInput, RankedOffer, Offer, PurchaseContext } from '../types';

const RANK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ranked: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          offerId: { type: 'string' },
          rank: { type: 'integer' },
          reason: { type: 'string' },
        },
        required: ['offerId', 'rank'],
      },
    },
  },
  required: ['ranked'],
};

const SYSTEM =
  'You curate prediction-market offers for a shopper at checkout. Rank the given offers for ' +
  'relevance to what they are buying and appeal/likelihood to play. Return only offerIds from the ' +
  'list — never invent an id. rank 0 is shown first.';

function userPrompt(context: PurchaseContext, offers: Offer[], max: number): string {
  const slim = offers.map(o => ({
    id: o.id, kind: o.kind, odds: o.display.odds, framedDiscountPct: o.display.framedDiscountPct,
    achievesFree: o.display.achievesFree, questions: o.legs.map(l => l.question), tags: o.legs.flatMap(l => l.tags),
  }));
  return [
    `Purchase: ${context.productTitle ?? 'unknown item'} (category: ${context.category ?? 'unknown'}), amount $${context.amount}.`,
    `Return up to ${max} offers, best first.`,
    `Offers: ${JSON.stringify(slim)}`,
  ].join('\n');
}

export class AnthropicRankProvider implements RankProvider {
  private client: Anthropic;
  constructor(private model: string = 'claude-haiku-4-5', client?: Anthropic) {
    this.client = client ?? new Anthropic();
  }

  async rank({ context, offers, max }: RankInput): Promise<RankedOffer[]> {
    const msg: any = await this.client.messages.parse({
      model: this.model,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt(context, offers, max) }],
      output_config: { format: { type: 'json_schema', schema: RANK_SCHEMA } },
    } as any);
    return (msg.parsed_output?.ranked ?? []) as RankedOffer[];
  }
}
