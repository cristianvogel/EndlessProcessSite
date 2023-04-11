// functions to retrieve filenames from a folder

const folder = './src/lib/audio/mp3';

function getFilesFromFolder(folder) {
	const fs = require('fs');
	const path = require('path');
	const files = fs.readdirSync(folder);
	const filesArray = [];
	files.forEach((file) => {
		filesArray.push(path.join(folder, file));
	});
	return filesArray;
}
