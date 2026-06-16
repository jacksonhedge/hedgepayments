import { Candidate, Offer } from './types';
import { ComboSource, ComboOpts } from './comboSource';

/**
 * Drop-in for when Polymarket exposes a public combo/CAOC API.
 * Same interface as SyntheticComboSource; until the endpoint exists, returns no offers.
 */
export class NativeComboSource implements ComboSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build(_candidates: Candidate[], _opts: ComboOpts): Offer[] {
    // TODO: fetch Polymarket combo contracts, map to Offer[] with kind 'parlay'.
    return [];
  }
}
