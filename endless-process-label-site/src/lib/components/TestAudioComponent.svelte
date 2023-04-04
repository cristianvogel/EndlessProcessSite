<script lang="ts">
// fire off the loaded file in the VFS

 import { Audio } from '$lib/stores/AudioEngine';
 import { Samples } from '$lib/stores/stores';




if ($Samples?.byteLength > 0) {
  Audio.updateVFS($Samples);
}



</script>

{#if $Samples?.byteLength > 0}
    <div class='info'>Audiobuffer</div>
{/if}
