
import { get } from 'svelte/store';
import { VFS_PATH_PREFIX, PlaylistMusic } from '$lib/stores/stores';
import { Audio } from '$lib/classes/Audio';
import type { PlaylistContainer } from '../../typeDeclarations';

let $playlistMusic: PlaylistContainer;

PlaylistMusic.subscribe(($pl) => $playlistMusic = $pl);

export function handlePlaylistChoice(e?: any, name?: string) {
    // can simulate event with a passed `name` value for programmatic track selection
    if (!e && name) {
        e = { currentTarget: { name } };
    };

    const currentTrack = {
        title: e.currentTarget.name,
        vfsPath: get(VFS_PATH_PREFIX) + e.currentTarget.name,
        progress: 0,
        duration: $playlistMusic.durations?.get(e.currentTarget.name),
    }

    PlaylistMusic.update(($pl) => {
        $pl.currentTrack = currentTrack;
        $pl.show = false;
        return $pl;
    });

    Audio.status = 'playing';
    Audio.playWithScrub({ trigger: 0, startOffset: 0 });
    Audio.playWithScrub({ trigger: 1, startOffset: 0 });
}