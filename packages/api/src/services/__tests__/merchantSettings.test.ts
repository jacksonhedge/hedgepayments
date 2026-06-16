const single = jest.fn();
jest.mock('../../lib/supabase', () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ single }) }) }) },
}));

import { getChanceSettings } from '../merchantSettings';

describe('getChanceSettings', () => {
  beforeEach(() => single.mockReset());

  it('returns defaults (off, no parlays) when no row exists', async () => {
    single.mockResolvedValue({ data: null, error: { message: 'no rows' } });
    const s = await getChanceSettings('biz-1');
    expect(s).toEqual({ aiProvider: 'off', aiModel: null, parlaysEnabled: false });
  });

  it('maps a stored row to ChanceSettings', async () => {
    single.mockResolvedValue({ data: { ai_provider: 'anthropic', ai_model: 'claude-haiku-4-5', parlays_enabled: true }, error: null });
    const s = await getChanceSettings('biz-1');
    expect(s).toEqual({ aiProvider: 'anthropic', aiModel: 'claude-haiku-4-5', parlaysEnabled: true });
  });
});
