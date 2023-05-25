
import { PlaylistMusic, VFS_PATH_PREFIX } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { PlaylistContainer } from '../../typeDeclarations';
import { AudioMain } from '$lib/classes/Audio';

let $playlistMusic: PlaylistContainer;

PlaylistMusic.subscribe(($pl) => $playlistMusic = $pl);

export function handlePlaylistChoice(e?: any, name?: string) {
    // can simulate event with a passed `name` value for programmatic track selection
    if (!e && name) {
        e = { currentTarget: { name } };
    };
    const startOffset = 0;
    const currentTrack = {
        title: e.currentTarget.name,
        vfsPath: get(VFS_PATH_PREFIX) + e.currentTarget.name,
        progress: startOffset,
        duration: $playlistMusic.durations?.get(e.currentTarget.name),
    }
    PlaylistMusic.update(($pl) => {
        $pl.currentTrack = currentTrack;

        $pl.show = false;
        return $pl;
    });
    AudioMain.playMusicFrom(startOffset)
}