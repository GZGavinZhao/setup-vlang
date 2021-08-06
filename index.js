// const core = require('@actions/core');
// const github = require('@actions/github');
const fs = require('fs');
const yauzl = require('yauzl');
var https = require('follow-redirects').https;

try {
	var vlangUrl = 'https://github.com/vlang/v';
	// var version = core.getInput('version');
	var os = process.platform;
	var version = '0.2.1'

	if (version.length == 40) {
		// It's a commit hash!
	} else if (version.startsWith('weekly') || version.includes('.')) { // SOMEONE HELP WITH REGEXP!
		vlangUrl += '/releases/download/' + version + '/v_';

		// Not sure how to check for arm?
		switch (os) {
			case 'win32':
				vlangUrl += 'windows';
				break;
			case 'darwin':
				vlangUrl += 'macos';
				break;
			case 'linux':
				vlangUrl += 'linux';
				break;
			default:
				throw `OS ${os} not supported!`;
		}

		// HELP: DETECT ARM
		vlangUrl += '.zip'

		// Download Github release
		console.log(`Downloading V version ${version} for OS ${os}...`);
		(async () => {
			https.get(vlangUrl, (res) => {
				const path = `${__dirname}/vlang.zip`;
				const filePath = fs.createWriteStream(path);
				res.pipe(filePath);
				filePath.on('finish', () => {
					filePath.close();
					console.log('Download Completed');
				});
			});
		})

		// Unzip compiler
		yauzl.open(`${__dirname}/vlang.zip`, { lazyEntries: true }, function (err, zipfile) {
			if (err) throw err;
			zipfile.readEntry();
			zipfile.on("entry", function (entry) {
				if (/\/$/.test(entry.fileName)) {
					// Directory file names end with '/'.
					// Note that entries for directories themselves are optional.
					// An entry's fileName implicitly requires its parent directories to exist.
					zipfile.readEntry();
				} else {
					// file entry
					zipfile.openReadStream(entry, function (err, readStream) {
						if (err) throw err;
						readStream.on("end", function () {
							zipfile.readEntry();
						});
						readStream.pipe('somewhere');
					});
				}
			});
		});
		console.log('Unzipped archive!');
	} else {

	}
} catch (error) {
	console.log(error);
	// core.setFailed(error.message);
}