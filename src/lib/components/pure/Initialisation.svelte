<script lang="ts">
import eventExpressions from "$lib/audio/AudioEventExpressions";
import { AudioMain } from "$lib/classes/Audio";
import { CablesAudioContext, RendererStatus } from "$lib/stores/stores";


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
			}).then( () => {
				$RendererStatus.music = 'ready';
			})
			await AudioMain.initialiseRenderer({
				id:'data', 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						nothing: true
					}
				},
				eventExpressions: eventExpressions.get('data')
			}).then( () => {
				$RendererStatus.data = 'ready';
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
			}).then( () => {
				$RendererStatus.speech = 'ready';
			})
		return Promise.resolve(true)
        }

function done( element: HTMLElement, answer: boolean){
			//console.log('Audio Renderers initialised?', answer)
		}

</script>

{#if $CablesAudioContext}
	{#await initialiseAudioRenderers()}
	<div data-comment> Intialising audio renderers. </div>
	{:then answer }
	<div data-comment use:done={answer} />
	{/await}
{/if}