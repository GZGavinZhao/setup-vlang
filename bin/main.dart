import 'dart:io';

void main(List<String> args) {
	final version = args[0];
	var url = 'https://github.com/vlang/v/archive/refs/tags/';

	if (version.startsWith('weekly')) {
		url += version + '.tar.gz';
		
	} else if (version.length == 40) {
		// It's a commit hash
		
	} else {

	}
}