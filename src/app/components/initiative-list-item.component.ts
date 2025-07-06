import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitiativeItem } from 'src/app/models/intitiative-list-item';
import { GMConfigService } from '../services/gm-config.service';

@Component({
  selector: 'app-initiative-list-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-item" [class.active]="item.active">
      <span (click)="onDisplayNameClick()" style="display: flex; align-items: center;">
        {{ getDisplayName() }} 
        <svg class="icon" width="30px" height="25px" style="margin-left: 5px;" *ngIf="item.isGroup">
          <path
            d="m 24,15.9 c 0,-2.8 -1.5,-5 -3.7,-6.1 1,-1 1.7,-2.3 1.7,-3.8 0,-2.8 -2.2,-5 -5,-5 -2.1,0 -3.8,1.2 -4.6,3 0,0 0,0 0,0 -0.1,0 -0.3,0 -0.4,0 -0.1,0 -0.3,0 -0.4,0 0,0 0,0 0,0 C 10.8,2.2 9.1,1 7,1 4.2,1 2,3.2 2,6 2,7.5 2.7,8.8 3.7,9.8 1.5,10.9 0,13.2 0,15.9 V 20 h 5 v 3 h 14 v -3 h 5 z M 17,3 c 1.7,0 3,1.3 3,3 0,1.6 -1.3,3 -3,3 0,-1.9 -1.1,-3.5 -2.7,-4.4 0,0 0,0 0,0 C 14.8,3.6 15.8,3 17,3 Z M 13.4,4.2 Z M 15,9 c 0,1.7 -1.3,3 -3,3 -1.7,0 -3,-1.3 -3,-3 0,-1.7 1.3,-3 3,-3 1.7,0 3,1.3 3,3 z M 10.6,4.2 Z M 7,3 C 8.2,3 9.2,3.6 9.7,4.6 8.1,5.5 7,7.1 7,9 5.3,9 4,7.7 4,6 4,4.3 5.3,3 7,3 Z M 5.1,18 H 2 V 15.9 C 2,13.1 4.1,11 7,11 v 0 c 0,0 0,0 0,0 0.1,0 0.2,0 0.3,0 0,0 0,0 0,0 0.3,0.7 0.8,1.3 1.3,1.8 -1.9,1 -3.2,2.9 -3.5,5.2 z M 17,21 H 7 V 18.9 C 7,16.1 9.2,14 12,14 c 2.9,0 5,2.1 5,4.9 z m 5,-3 h -3.1 c -0.3,-2.3 -1.7,-4.2 -3.7,-5.2 0.6,-0.5 1,-1.1 1.3,-1.8 0.1,0 0.2,0 0.4,0 v 0 c 2.9,0 5,2.1 5,4.9 V 18 Z"
            id="path1"
            style="fill:#ffffff;fill-opacity:1" />
        </svg>
      </span>
      <input type="number" [value]="item.initiative" (change)="updateInitiative($event)" />
    </div>
  `,
  styleUrls: ['./initiative-list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitiativeListItemComponent implements OnInit {
  @Input() item!: InitiativeItem;
  @Output() initiativeChange = new EventEmitter<number>();
  @Output() displayNameClick = new EventEmitter<void>();

  redactInvisibleItems: boolean = false;

  constructor(private gmConfigService: GMConfigService) {}

  ngOnInit(): void {
    this.redactInvisibleItems = this.gmConfigService.config.redactInvisibleItems;
  }

  updateInitiative(e: any): void {
    this.initiativeChange.emit(e.target.valueAsNumber);
  }

  onDisplayNameClick(): void {
    this.displayNameClick.emit();
  }

  getDisplayName(): string {
    return this.item.displayName || this.item.name;
  }
}
