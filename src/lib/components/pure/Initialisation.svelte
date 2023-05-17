<script lang="ts">
import { customEvents } from "$lib/audio/EventHandlers";
import { AudioMain } from "$lib/classes/Audio";
import { VoiceOver } from "$lib/classes/Speech";
import { CablesAudioContext, MusicCoreLoaded, SpeechCoreLoaded } from "$lib/stores/stores";

 async function initialiseAudioRenderers() {

		if ( Object.hasOwn( $CablesAudioContext,'__elemRegistered') ) {
			console.log('Elementary already registered')
			return Promise.resolve(false)
		}

			await AudioMain.init({
				namedRenderer: { id:'music', renderer: AudioMain._core }, 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						destination: true,
						visualiser: true,
					},
				}
			});
			await AudioMain.init({
				namedRenderer: { id:'silent', renderer: AudioMain._silentCore }, 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						nothing: true,
					},
					extraFunctionality: [
						customEvents.progressSignal
					],
				}
			});
			await VoiceOver.init()

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
	<span class='info'> intialising audio renderers </span>
	{:then answer }
	<div data-comment use:done={answer} />
	{/await}
{/if}