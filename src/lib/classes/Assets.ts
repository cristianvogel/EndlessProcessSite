import {
    PlaylistMusic,
    VFS_Entries, VFS_PATH_PREFIX,
    Decoded
} from "$lib/stores/stores";
import { get } from "svelte/store";
import type { AssetCategories, AudioAssetMetadata, ExtendedWebRenderer, StructuredAssetContainer } from "../../typeDeclarations";
import { AudioMain } from "./Audio";


export function assign(
    element: HTMLElement,
    params: {
        assetContainer: AudioAssetMetadata;
        index: number;
        bounds: number;
    }
) {
    let structuredContainer: StructuredAssetContainer;

    const { assetContainer, index, bounds } = params;

    const { mediaItemUrl, title, fileSize, buffer, category } = assetContainer;

    PlaylistMusic.update(($p) => {
        $p.titles[category] = [...$p.titles[category], title];
        return $p;
    });
    structuredContainer = {
        header: {
            title: title,
            bytes: fileSize,
            globPath: mediaItemUrl,
            vfsPath: `${get(VFS_PATH_PREFIX)}${title || 'untitled_' + index}`
        },
        body: buffer || undefined
    };
    /*
    * add the VFS entry to relevent category dictionary for later VFS assignment
    * and also flag 'done' if all assets from the metadata have been ingested
    */
    VFS_Entries.update(($v: any) => {
        $v[category] = [...$v[category], structuredContainer];
        $v['done'] = sumLengthsOfAllArraysInVFSStore() >= ((bounds > 0) ? (bounds - 1) : 1.0e6);
        return $v;
    })

    Decoded.update(($d) => {
        $d.bounds = bounds;
        return $d;
    });
}

export function sumLengthsOfAllArraysInVFSStore() {
    let sum = 0
    const $VFS_Entries = get(VFS_Entries)
    for (const key in $VFS_Entries) {
        if (Object.prototype.hasOwnProperty.call($VFS_Entries, key)) {
            const element = $VFS_Entries[key as AssetCategories];
            sum += element.length ? element.length : 0
        }
    }
    return sum
}

export function getRendererForCategory(category: AssetCategories): ExtendedWebRenderer {
    return AudioMain._renderers.get(category) as ExtendedWebRenderer
};