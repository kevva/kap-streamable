'use strict';
const fs = require('fs');
const FormData = require('form-data');

const action = async context => {
	const endpoint = 'https://api.streamable.com/upload';
	const filePath = await context.filePath();
	const form = new FormData();

	context.setProgress('Uploading…');
	form.append('file', fs.createReadStream(filePath));

	const response = await context.request(endpoint, {
		method: 'post',
		body: form
	});

	const shortcode = JSON.parse(response.body).shortcode;

	context.copyToClipboard(`https://streamable.com/${shortcode}`);
	context.notify('URL to the video has been copied to the clipboard');
};

const streamable = {
	title: 'Share on Streamable',
	formats: ['gif', 'mp4', 'webm', 'apng'],
	action
};

exports.shareServices = [streamable];
