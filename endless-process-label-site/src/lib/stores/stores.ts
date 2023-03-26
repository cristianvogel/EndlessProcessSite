// CAV: This file is used to define the types used in the app

import { writable, type Writable } from 'svelte/store';

export const currentPost:Writable<CurrentPost> = writable({title: '', content: {rawHTML: '', sanitisedHTML:''}, featuredImageURL:'', id: '', date: '', cardIndex: ''});