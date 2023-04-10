<script lang="ts">
	import { Scan , Cube} from "@steeze-ui/carbon-icons";
	import { Icon } from "@steeze-ui/svelte-icon";


</script>


<dl class="list-dl text-sm mr-2">
	<div>
		<span class="p-0 -mt-8"><h2 >Now Playing.</h2></span>
		<span class="badge bg-transparent">
			<Icon src={Scan} class="h-4"/>
		</span>
		<span class="flex-auto">
			<dt class="text-left uppercase">
			<span class="badge align-middle">
				<Icon src={Cube} class="h-4 rotate-180 "/>
			</span> 
		<slot name='Title'/>
			</dt>

			<dd class="text-left text-tertiary-600 ">
			<span class="badge align-middle">
				<Icon src={Cube} class="h-4"/>
			</span>
		<slot name='Description'/>
			</dd>
		</span>
	</div>
</dl>