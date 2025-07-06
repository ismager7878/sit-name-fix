import { EffectListItem } from './effect-list-item';

export interface InitiativeItem {
  id: string;
  characterId: string;
  name: string;
  initiative: number;
  active: boolean;
  rounds: number;
  effects: Array<EffectListItem>;
  visible: boolean;
  displayName?: string;
  isGroup?: boolean;
}
