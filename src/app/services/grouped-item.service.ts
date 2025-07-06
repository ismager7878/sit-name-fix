import { Injectable } from '@angular/core';
import OBR from '@owlbear-rodeo/sdk';
import * as uuid from 'uuid';
import { ID } from '../utils/config';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class GroupedItemService {
    private groupedItemSubject = new BehaviorSubject<Array<GroupedItemService>>([]);
    groupedItems$ = this.groupedItemSubject.asObservable(); // Read-only access

    constructor() {}

    async createGroup(groupName: string, initiative: number): Promise<string> {
        const groupId = uuid.v4();

        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;

        let newSceneMetadata = sceneMetadata


        if (!sceneMetadata || !sceneMetadata.groups) {
          newSceneMetadata = {
            ...sceneMetadata,
            groups: [],
          };
        }

        newSceneMetadata.groups.push({
          id: groupId,
          name: groupName || 'Unnamed Group',
          initiative: initiative || 0,
          hidden: false,
        });

        OBR.scene.setMetadata({
          [`${ID}/metadata`]: newSceneMetadata,
        });

        return groupId;
    }

    async toggleGroupVisibility(groupId: string): Promise<void> {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;

        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return;
        }

        const group = sceneMetadata.groups.find((g: any) => g.id === groupId);
        if (!group) {
          console.warn(`Group with ID ${groupId} not found`);
          return;
        }

        group.hidden = !group.hidden;

        await OBR.scene.setMetadata({
          [`${ID}/metadata`]: sceneMetadata,
        });

        OBR.scene.items.updateItems(
          (item) => (item.metadata[`${ID}/metadata`] as any)?.group === groupId,
          (items) => {
            for (let item of items) {
              const metadata = item.metadata[`${ID}/metadata`] as any;
              if (metadata) {
                metadata.hidden = group.hidden;
              }
            }
          }
        );
    }

    async updateInitiative(groupId: string, initiative: number): Promise<void> {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;

        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return;
        }

        const group = sceneMetadata.groups.find((g: any) => g.id === groupId);
        if (!group) {
          console.warn(`Group with ID ${groupId} not found`);
          return;
        }

        group.initiative = initiative;

        OBR.scene.setMetadata({
          [`${ID}/metadata`]: sceneMetadata,
        });
    }

    async changeGroupName(groupId: string, newName: string): Promise<void> {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;
        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return;
        }
        const group = sceneMetadata.groups.find((g: any) => g.id === groupId);
        if (!group) {
          console.warn(`Group with ID ${groupId} not found`);
          return;
        }
        group.name = newName;
        OBR.scene.setMetadata({
          [`${ID}/metadata`]: sceneMetadata,
        });
    }
    

    async getGroup(id: string): Promise<any>  {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;

        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return null;
        }

        const group = sceneMetadata.groups.find((g: any) => g.id === id);
        if (!group) {
          console.warn(`Group with ID ${id} not found`);
          return null;
        }

        return group;
    }

    async getAllGroups(): Promise<any[]> {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;
        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return [];
        }
        return sceneMetadata.groups;
    }

    async removeGroup(groupId: string): Promise<void> {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;

        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return;
        }

        const groupIndex = sceneMetadata.groups.findIndex((g: any) => g.id === groupId);
        if (groupIndex === -1) {
          console.warn(`Group with ID ${groupId} not found`);
          return;
        }

        sceneMetadata.groups.splice(groupIndex, 1)

        await OBR.scene.setMetadata({
          [`${ID}/metadata`]: sceneMetadata,
        });

        await OBR.scene.items.updateItems(
          (item) => (item.metadata[`${ID}/metadata`] as any)?.group === groupId,
            (items) => {
                for (let item of items) {
                    delete item.metadata[`${ID}/metadata`];
                }
            }
        )

        
    }

    async renameGroup(groupId: string, newName: string): Promise<void> {
        const sceneMetadata = (await OBR.scene.getMetadata())[`${ID}/metadata`] as any;

        if (!sceneMetadata || !sceneMetadata.groups) {
          console.warn('No groups found in scene metadata');
          return;
        }

        const group = sceneMetadata.groups.find((g: any) => g.id === groupId);
        if (!group) {
          console.warn(`Group with ID ${groupId} not found`);
          return;
        }

        group.name = newName;

        OBR.scene.setMetadata({
          [`${ID}/metadata`]: sceneMetadata,
        });
    }

}