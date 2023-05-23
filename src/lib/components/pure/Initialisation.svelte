<script lang="ts">
import eventExpressions from "$lib/audio/AudoEventExpressions";
import { AudioMain } from "$lib/classes/Audio";
import { CablesAudioContext, MusicCoreLoaded, SpeechCoreLoaded } from "$lib/stores/stores";


 async function initialiseAudioRenderers() {
			await AudioMain.initialiseRenderer({
				id:'music', 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						destination: true,
						visualiser: true,
					}
				},
				eventExpressions: eventExpressions.get('music')
			});
			await AudioMain.initialiseRenderer({
				id:'data', 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						nothing: true
					}
				},
				eventExpressions: eventExpressions.get('data')
			});
			await AudioMain.initialiseRenderer({
				id: 'speech',
				ctx: $CablesAudioContext,
				options: {
					connectTo: { 
						sidechain: true, 
						destination: true 
					}
				},
				eventExpressions: eventExpressions.get('speech')
			});

		return Promise.resolve(true)
        }

function done( element: HTMLElement, answer: boolean){
			console.log('Audio Renderers initialised?', answer)
			$MusicCoreLoaded = true;
			$SpeechCoreLoaded = true;
		}

</script>

{#if $CablesAudioContext}
	{#await initialiseAudioRenderers()}
	<div data-comment> Intialising audio renderers. </div>
	{:then answer }
	<div data-comment use:done={answer} />
	{/await}
{/if}