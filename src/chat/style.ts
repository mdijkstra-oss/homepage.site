import type { ChatRole } from '../types/blocks';

export interface BubbleStyle {
  end: boolean;
  maxWidth: string;
  background: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
  padding: string;
  color: string;
}

export const BUBBLE_STYLES: Record<ChatRole, BubbleStyle> = {
  user: { end: true, maxWidth: '64%', background: 'linear-gradient(140deg, rgba(86,124,255,0.3), rgba(86,124,255,0.12)), linear-gradient(rgba(10,16,34,0.4), rgba(10,16,34,0.4))', border: '1px solid rgba(140,170,255,0.45)', borderRadius: '16px 16px 6px 16px', boxShadow: '0 8px 22px rgba(20,40,120,0.3)', padding: '13px 17px', color: '#eaf0ff' },
  assistant: { end: false, maxWidth: '74%', background: 'linear-gradient(140deg, rgba(255,255,255,0.085), rgba(255,255,255,0.03)), linear-gradient(rgba(12,14,19,0.5), rgba(12,14,19,0.5))', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px 16px 16px 6px', boxShadow: '0 10px 30px rgba(0,0,0,0.35)', padding: '14px 17px', color: '#d2dae6' },
};
