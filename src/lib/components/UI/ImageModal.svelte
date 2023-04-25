<!-- ImageModal.svelte -->

<script lang="ts">
  export let imageUrl: string;
  export let altText: string;
  export let onClose: any;
</script>

<div class="fixed z-10 inset-0 overflow-y-auto" on:mousedown={onClose}>
  <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
    <!-- Background overlay -->
    <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
    <!-- Modal content container -->
    <div class="relative z-10 w-full max-w-md mx-auto my-auto rounded-lg shadow-lg" >
      <!-- Image -->
      <img src={imageUrl} alt={altText} class="w-full h-auto rounded-lg" >
      <!-- Close button -->
      <button
        class="absolute top-0 right-0 m-2 text-tertiary-500 hover:text-tertiary-800"
        on:click={onClose}
      >
        <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 1 0 1.414-1.414L11.414 10z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
