const path = require('path');
const fs = require('fs');

function parentDirCheck(file_path) {
	full_path = path.basename(file_path);
	if (!fs.existsSync(full_path)) fs.mkdirSync(full_path, {recursive: true});

}

module.exports = parentDirCheck;