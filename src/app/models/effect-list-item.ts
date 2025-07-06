import { Item } from '@owlbear-rodeo/sdk'

export interface EffectListItem {
  id: string;
  characterId: string;
  name?: string; // Optional, can be derived from character item
  description: string;
  rounds: number;
  totalRounds?: number; // Optional, used for progress bar calculation
  processBar?: any; // Optional, used for progress bar SVG path
}
