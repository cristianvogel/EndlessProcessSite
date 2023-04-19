/**
   * Get all files in the folder.
    @About 
    The import.meta.glob cannot accept anything but a literal. 
    Therefore the folderName variable is  only used as a reference here, and I will repeat the function for the Speech files path.
	>>>>>>>>>>>>>>>>
    Don't try and splice the glob path in 🤷🏽
	Don't have a D.R.Y attack.

	 DEFAULT_GLOB_PATH = '../../../static/audio/mp3/*'  
 */

export function getMusicFiles(): Array<string> {
	let fileNames: string[] = [];

	const files = import.meta.glob('../../../static/audio/mp3/*', {
		eager: true,
		import: 'default'
	});
	console.log('files: ', files);
	// remove  /static/ from the file path
	const filePaths: Array<string> = Object.values(files).map((file) => {
		let trimmed = file.replace('/static/', '');
		return trimmed;
	});

	return filePaths as Array<string>;
}

export function getSpeechFiles(): Array<string> {
	let fileNames: string[] = [];

	const files = import.meta.glob('../../../static/audio/mp3/speech/*', {
		eager: true,
		import: 'default'
	});
	console.log('files: ', files);
	// remove  /static/ from the file path
	const filePaths: Array<string> = Object.values(files).map((file) => {
		let trimmed = file.replace('/static/', '');
		return trimmed;
	});

	return filePaths as Array<string>;
}
