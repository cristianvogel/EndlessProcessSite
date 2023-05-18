<script lang="ts">
import { eventExpressions } from "$lib/audio/AudoEventExpressions";
import { AudioMain } from "$lib/classes/Audio";
import { VoiceOver } from "$lib/classes/Speech";
import { CablesAudioContext, MusicCoreLoaded, SpeechCoreLoaded } from "$lib/stores/stores";

 async function initialiseAudioRenderers() {
			await AudioMain.init({
				namedRenderer: { 
					id:'music', 
					renderer: AudioMain._core 
				}, 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						destination: true,
						visualiser: true,
					},
				}
			});
			await AudioMain.init({
				namedRenderer: { 
					id:'silent', 
					renderer: AudioMain._silentCore 
				}, 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						nothing: true
					},
					eventExpressions: { snapshot: eventExpressions.progress } ,
				}
			});
			await VoiceOver.init({
				namedRenderer: {
				id: 'speech',
				renderer: VoiceOver._core
			},
			options: {
				connectTo: { 
					sidechain: true, 
					destination: true 
				},
				eventExpressions: { meter: eventExpressions.meter }
			}
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