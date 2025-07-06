import { Injectable } from '@angular/core';
import OBR, {isImage, buildImage} from '@owlbear-rodeo/sdk';
import * as uuid from 'uuid';
import { ID } from '../utils/config';
import { GroupedItemService } from './grouped-item.service';
import { EffectListItem } from '../models/effect-list-item';
import { EffectListService } from './effect-list.service';

@Injectable()
export class ContextMenuService {
  constructor(
    private groupedItemService: GroupedItemService,
    private effectListService: EffectListService
  ) {}
  setup(): void {
    // add/remove item to initiative tracking
    OBR.contextMenu.create({
      id: `${ID}/context-menu`,
      icons: [
        {
          icon: '/assets/add-icon.svg',
          label: 'SIT - Add tracking',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined },
            ],
          },
        },
        {
          icon: '/assets/remove-icon.svg',
          label: 'SIT - Remove tracking',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`, `group`], value: undefined, operator: '==' },
            ],
          },
        },
      ],
      onClick: async (context) => {
        const addToInitiative = context.items.every((item) => item.metadata[`${ID}/metadata`] === undefined);

        if (addToInitiative) {
          const initiativeInput = window.prompt('Enter initiative:');
          const initiative = initiativeInput && parseInt(initiativeInput) ? parseInt(initiativeInput) : 0;
          
          // Update items
          OBR.scene.items.updateItems(
            isImage,
            (items) => {
              for (let item of items) {
                if(!context.items.some((i) => i.id === item.id)) continue;

                item.metadata[`${ID}/metadata`] = {
                  id: item.id,
                  initiative,
                  rounds: 1,
                  hidden: false,
                  effects: [],
                };
              }
            }
          );
        } else {
          OBR.scene.items.updateItems(context.items, (items) => {
            for (let item of items) {
              this.effectListService.deleteEffectsOnItem(item);

              delete item.metadata[`${ID}/metadata`];
            }
          });
        }
      },
    });

    // add new effect of this item
    OBR.contextMenu.create({
      id: `${ID}/context-menu-effects`,
      icons: [
        {
          icon: '/assets/add-icon.svg',
          label: 'SIT - Add concentration',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined, operator: '!=' },
              { key: ['metadata', `${ID}/metadata`, 'effects', 'length'], value: 0, operator: '==' },
            ],
          },
        },
        {
          icon: '/assets/remove-icon.svg',
          label: 'SIT - Remove concentration',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined, operator: '!=' },
            ],
          },
        },
      ],
      onClick: (context) => {

        if(context.items.every((item) => (item.metadata[`${ID}/metadata`] as any)?.effects?.length > 0)) {
          // Remove all effects
          this.effectListService.deleteEffectsOnItem(context.items[0]);
          return;
        }

        const descriptionInput = window.prompt('Enter description for this effect:');
        const description = descriptionInput?.length ? descriptionInput : 'Effect';
        const roundsInput = window.prompt('Enter duration in rounds:');
        const rounds = roundsInput && parseInt(roundsInput) ? parseInt(roundsInput) : 1;

        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            if (!item.metadata[`${ID}/metadata`]) continue;
            if (!isImage(item)) continue;
            (item.metadata[`${ID}/metadata`] as any).effects?.push({
              id: uuid.v4(),
              characterId: item.id,
              name: item.text.plainText === '' ? item.name : item.text.plainText,
              description,
              rounds,
              totalRounds: rounds,
            });
            this.effectListService.setEffectList((item.metadata[`${ID}/metadata`] as any).effects)
          }
          
        });
      },
    });

    // Add grouped items to initiative tracking
    OBR.contextMenu.create({
      id: `${ID}/context-menu-grouped`,
      icons: [
        {
          icon: '/assets/add-icon-group.svg',
          label: 'SIT - Add group tracking',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined },
            ],
            roles: ['GM'],
            min: 2,
          },
        },
        {
          icon: '/assets/remove-icon-group.svg',
          label: 'SIT - Remove group tracking',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`, 'group'], value: undefined, operator: "!=" }
            ],
            roles: ['GM'],
            max: 1,
          },
        },
      ],

      // Add group tracking
      onClick: async (context) => {

        const hasGroup = context.items.some((item) => (item.metadata[`${ID}/metadata`] as any)?.group !== undefined); 

        //console.log('Context Menu Grouped Items', context.items, hasGroup);

        if (hasGroup) {
          const groupedItems = await OBR.scene.items.getItems(
            (item) => (item.metadata[`${ID}/metadata`] as any)?.group !== undefined && context.items.some((i) => (i.metadata[`${ID}/metadata`] as any).group === (item.metadata[`${ID}/metadata`] as any).group)
          );

          groupedItems.forEach((item) => {
            this.effectListService.deleteEffectsOnItem(item);
          });

          await this.groupedItemService.removeGroup((context.items[0].metadata[`${ID}/metadata`] as any).group);
    
          return;
        }

        const groupName = window.prompt('Enter group name for grouped items:');
        const initiativeInput = window.prompt('Enter initiative for grouped items:');
        const initiative = initiativeInput && parseInt(initiativeInput) ? parseInt(initiativeInput) : 0;

        const groupId = await this.groupedItemService.createGroup(groupName || 'Unnamed Group', initiative);
        
        OBR.scene.items.updateItems(
          isImage,
          (items) => {
            for (let item of items) {
              if(!context.items.some((i) => i.id === item.id)) continue;

              item.metadata[`${ID}/metadata`] = {
                id: item.id,
                initiative,
                rounds: 1,
                effects: [],
                hidden: false,
                group: groupId,
              };
            }
          }
        );
      },
    });

    // Hide from players
    OBR.contextMenu.create({
      id: `${ID}/context-menu-hide`,
      icons: [
        {
          icon: '/assets/hide-initiative.svg',
          label: 'SIT - Hide from players',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined, operator: '!=' },
              { key: ['metadata', `${ID}/metadata`, 'group'], value: undefined, operator: '==' },
              { key: ['metadata', `${ID}/metadata`, 'hidden'], value: false },
            ],
            roles: ['GM'],
          },
        },
        {
          icon: '/assets/show-initiative.svg',
          label: 'SIT - Show to players',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined, operator: '!=' },
              { key: ['metadata', `${ID}/metadata`, 'group'], value: undefined, operator: '==' },
              { key: ['metadata', `${ID}/metadata`, 'hidden'], value: true },
            ],
            roles: ['GM'],
          }
        },
        {
          icon: '/assets/hide-initiative.svg',
          label: 'SIT - Hide group from players',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined, operator: '!=' },
              { key: ['metadata', `${ID}/metadata`, 'hidden'], value: false },
            ],
            roles: ['GM'],
            max: 1, // Only allow this action for one group at a time
          },
        },
        {
          icon: '/assets/show-initiative.svg',
          label: 'SIT - Show group to players',
          filter: {
            every: [
              { key: 'layer', value: 'CHARACTER' },
              { key: ['metadata', `${ID}/metadata`], value: undefined, operator: '!=' },
              { key: ['metadata', `${ID}/metadata`, 'hidden'], value: true },
            ],
            roles: ['GM'],
            max: 1, // Only allow this action for one group at a time
          },
        }
      ],
      onClick: (context) => {
        const isGroup = context.items.every((item) => (item.metadata[`${ID}/metadata`] as any)?.group !== undefined);
        if (isGroup) {
          // Toggle hidden state for group
          this.groupedItemService.toggleGroupVisibility((context.items[0].metadata[`${ID}/metadata`] as any).group);
          return;
        }
        
        OBR.scene.items.updateItems(
          context.items, (items) => {
          for (let item of items) {
            const metadata = item.metadata[`${ID}/metadata`] as any;
            if (metadata && metadata.group === undefined) {
              // Toggle hidden state
              metadata.hidden = !metadata.hidden;
            }
          }
        }
      )
    },
    });
  }
}

