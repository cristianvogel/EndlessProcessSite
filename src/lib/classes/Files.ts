/**
    @Description Get all files in the folder.
    @Notes
    The import.meta.glob cannot accept anything but a literal. 
    Therefore the folderName variable is  only used as a reference here, and I will repeat the function for the Speech files path.
	>>>>>>>>>>>>>>>>
    Don't try and splice the glob path in 🤷🏽
	Don't have a D.R.Y attack.

	DEFAULT_GLOB_PATH = '../../../static/audio/mp3/*'  
 */



export function getMusicFiles(): string[] {
	let filePaths: string[] = [];
	let files
	if (process.env.NODE_ENV !== 'development') {
		files = import.meta.glob('./audiofiles/music/*', {
			eager: true,
			import: 'default'
		 })
	} else {
		files = import.meta.glob('../../../static/audiofiles/music/*', {
			eager: true,
			import: 'default'
		})
	}

	filePaths = Object.values(files).map((file) => {
		return file as string;
	});
	return filePaths as Array<string>;
}

export function getSpeechFiles(): string[] {
	let filePaths: string[] = [];
	let files
	if (process.env.NODE_ENV !== 'development') {
		files = import.meta.glob('./audiofiles/speech/*', {
			eager: true,
			import: 'default'
		 })
	} else {
		files = import.meta.glob('../../../static/audiofiles/speech/*', {
			eager: true,
			import: 'default'
		})
	};

	filePaths = Object.values(files).map((file) => {
		return file as string;
	});

	return filePaths as Array<string>;
}
