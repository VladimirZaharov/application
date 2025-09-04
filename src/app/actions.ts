'use server';

import { adjustProposalTone } from '@/ai/flows/adjust-proposal-tone';

interface AdjustToneResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function handleToneAdjustment(
  currentText: string,
  tone: string
): Promise<AdjustToneResult> {
  if (!currentText || !tone) {
    return { success: false, error: 'Требуется текст предложения и тон.' };
  }

  try {
    const result = await adjustProposalTone({
      proposalText: currentText,
      desiredTone: tone,
    });
    return { success: true, text: result.adjustedProposalText };
  } catch (e) {
    console.error('AI tone adjustment failed:', e);
    return { success: false, error: 'Не удалось настроить тон. Пожалуйста, попробуйте еще раз.' };
  }
}
