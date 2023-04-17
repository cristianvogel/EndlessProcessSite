/**
   * Get all files in the folder.
    @About 
    The import.meta.glob function originates from ECMAScript 2020 (ES2020) 
    and is supported in modern browsers and Node.js versions 14.17.0 and later.
    but we cannot  use a template literal in the glob with Vite right now. 
    Therefore the folderName variable should only be used as a reference here. 
    Don't try and splice it in 🤷🏽
   */

/** GLOB_FOLDER_NAME 'lib/audio/mp3'  */

export function getFiles(): Array<string> {
	let fileNames: string[] = [];
	try {
		const files = import.meta.glob(`../../lib/audio/mp3/*`) as Record<string, () => Promise<any>>;
		const filePaths = Object.keys(files);
		fileNames = filePaths.map((filePath) => filePath.replace(`../audio/mp3/`, ''));
	} catch (error) {
		console.error(error);
	}
	return fileNames;
}
