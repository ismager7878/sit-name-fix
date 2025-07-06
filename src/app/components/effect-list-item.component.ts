import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectListItem } from '../models/effect-list-item';
import OBR, { isImage } from '@owlbear-rodeo/sdk';

@Component({
  selector: 'app-effect-list-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-item">
      <span>{{ item.name }}: {{ item.description }}</span>
      <input type="number" [value]="item.rounds" (change)="updateRounds($event)" />
    </div>
  `,
  styleUrls: ['./effect-list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectListItemComponent {
  @Input() item!: EffectListItem;
  @Output() roundsChange = new EventEmitter<number>();

  constructor() {}

  updateRounds(e: any): void {
    this.roundsChange.emit(e.target.valueAsNumber);
  }

  async getName(effect: EffectListItem): Promise<string> {
    if (!effect.characterId) return ""
    const items = await OBR.scene.items.getItems(
      (i) => i.id === effect.characterId
    );
    if (!isImage(items[0])) return ''

    return items[0].text.plainText === '' ? items[0].name : items[0].text.plainText;
  }
}
