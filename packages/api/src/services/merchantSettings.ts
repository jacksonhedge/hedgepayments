import { supabase } from '../lib/supabase';

export interface ChanceSettings {
  aiProvider: 'anthropic' | 'openai' | 'off';
  aiModel: string | null;
  parlaysEnabled: boolean;
}

const DEFAULTS: ChanceSettings = { aiProvider: 'off', aiModel: null, parlaysEnabled: false };

export async function getChanceSettings(businessAccountId: string): Promise<ChanceSettings> {
  const { data, error } = await supabase
    .from('business_chance_settings')
    .select('ai_provider, ai_model, parlays_enabled')
    .eq('business_account_id', businessAccountId)
    .single();
  if (error || !data) return DEFAULTS;
  return {
    aiProvider: data.ai_provider,
    aiModel: data.ai_model ?? null,
    parlaysEnabled: !!data.parlays_enabled,
  };
}
