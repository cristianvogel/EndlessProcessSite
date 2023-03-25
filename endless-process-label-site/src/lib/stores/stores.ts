// CAV: This file is used to define the types used in the app

import { writable, type Writable } from 'svelte/store';

export const currentPostTitle = writable('');
export const currentPostContent:Writable<HtmlContent> = writable({rawHTML: '', sanitisedHTML:''});

