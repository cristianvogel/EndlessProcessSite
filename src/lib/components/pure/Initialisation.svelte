<script lang="ts">
import eventExpressions from "$lib/audio/AudoEventExpressions";
import { AudioMain } from "$lib/classes/Audio";
import { VoiceOver } from "$lib/classes/Speech";
import { CablesAudioContext, MusicCoreLoaded, SpeechCoreLoaded } from "$lib/stores/stores";

 async function initialiseAudioRenderers() {
			await AudioMain.initialiseRenderer({
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
					eventExpressions: eventExpressions.get('music')
				}
			});
			await AudioMain.initialiseRenderer({
				namedRenderer: { 
					id:'silent', 
					renderer: AudioMain._silentCore 
				}, 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						nothing: true
					},
					eventExpressions: eventExpressions.get('silent')
				}
			});
			await VoiceOver.initialiseRenderer({
				namedRenderer: {
				id: 'speech',
				renderer: VoiceOver._core
			},
			ctx: $CablesAudioContext,
			options: {
				connectTo: { 
					sidechain: true, 
					destination: true 
				},
				eventExpressions: eventExpressions.get('speech')
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
	<div > Intialising audio renderers. </div>
	{:then answer }
	<div use:done={answer} > done. </div>
	{/await}
{/if}