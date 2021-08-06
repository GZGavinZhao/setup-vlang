import 'dart:io';

import 'package:http/http.dart';

void main(List<String> args) async {
	args = ['0.2.1'];
  final version = args[0];
  // final os = Platform.environment['RUNNER_OS'];
	final os = 'Linux';
	final arm = 'false';
  var url = 'https://github.com/vlang/v';

  try {
    assert(os != null && os.isNotEmpty);
  } catch (e) {
    throw Exception('Can\'t detect runner OS!');
  }

  if (version.length == 40) {
    // It's a commit hash
		throw Exception('Currently not supporting commit hash!');
  } else {
		url += '/archive/refs/tags/';

    url += version;

		switch (os) {
			case 'Linux':
				url += '/v_linux';
				break;
			case 'Windows':
				url += '/v_windows';
				break;
			case 'macOS':
				url += '/v_macos';
				break;
			default:
		}

		if (arm == 'true') {
			url += '_arm64';
		}

		url += '.zip';

		final request = await HttpClient().getUrl(Uri.parse(url));
		final response = await request.close();
		await response.pipe(File('v.zip').openWrite());
		
		print('File downloaded!');
  }
}