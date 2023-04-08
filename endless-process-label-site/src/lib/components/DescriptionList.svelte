<script lang="ts">
	import { Scan } from "@steeze-ui/carbon-icons";
	import { Icon } from "@steeze-ui/svelte-icon";


</script>


<dl class="list-dl info mr-2">
	<div>
		<span class="badge bg-transparent">
			<Icon src={Scan} class="h-4"/>
		</span>
		<span class="flex-auto">
			<dt class="text-left">
				<slot name='Title'/>
			</dt>
			
			<dd class="text-right">
				〇 <slot name='Description'/>
			</dd>
		</span>
	</div>
</dl>