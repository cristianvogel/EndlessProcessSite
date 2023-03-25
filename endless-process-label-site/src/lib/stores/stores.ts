// CAV: This file is used to define the types used in the app

// todo: refactor this to use an object for holding post data

import { writable, type Writable } from 'svelte/store';

export const currentPostTitle = writable('');
export const currentPostContent:Writable<HtmlContent> = writable({rawHTML: '', sanitisedHTML:''});
export const currentPostID = writable('');
export const currentPostDate = writable('');