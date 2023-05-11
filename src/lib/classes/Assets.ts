import {
    PlaylistMusic,
    VFS_Entries, VFS_PATH_PREFIX,
    Decoded
} from "$lib/stores/stores";
import { get } from "svelte/store";
import type { AudioAssetMetadata, MultiAssetContainer } from "../../typeDeclarations";

export function assign(
    element: HTMLElement,
    params: {
        assetContainer: AudioAssetMetadata;
        index: number;
        sum: number;
    }
) {
    let structuredContainer: MultiAssetContainer = {
        music: undefined,
        speech: undefined
    };
    const { assetContainer, index, sum } = params;
    Decoded.update(($d) => {
        $d.bounds = sum;
        return $d;
    });
    const { mediaItemUrl, title, fileSize, buffer, category } = assetContainer;
    PlaylistMusic.update(($p) => {
        $p.titles[category] = [...$p.titles[category], title];
        return $p;
    });
    structuredContainer[category] = {
        header: {
            title: title,
            bytes: fileSize,
            globPath: mediaItemUrl,
            vfsPath: `${get(VFS_PATH_PREFIX)}${title || 'untitled_' + index}`
        },
        body: buffer || undefined
    };
    // add the VFS entry to relevent category dictionary for later VFS assignment
    VFS_Entries.update(($v: any) => {
        $v[category] = [...$v[category], structuredContainer[category]];
        return $v;
    })
}