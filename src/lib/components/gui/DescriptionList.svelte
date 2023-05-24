<script lang="ts">
	import { Cube } from "@steeze-ui/carbon-icons";
	import { Icon } from "@steeze-ui/svelte-icon";
	export let show:boolean = false;	
</script>

<div class={ show ? 'opacity-100' : 'opacity-0' }>
<dl class="flex shrink-1 list-dl text-sm -mt-4" >
	<div class='invisible md:visible'>
		   <span class="p-0 -ml-[8rem]"><h3 >Now Playing.</h3></span>
		<span>	
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
</div>