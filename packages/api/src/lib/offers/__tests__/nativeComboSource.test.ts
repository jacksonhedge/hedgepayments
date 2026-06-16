import { NativeComboSource } from '../nativeComboSource';

describe('NativeComboSource (stub)', () => {
  it('returns no offers until the Polymarket combo API is wired', () => {
    const offers = new NativeComboSource().build([], { targetPrice: 0.02, amount: 50, stake: 1 });
    expect(offers).toEqual([]);
  });
});
