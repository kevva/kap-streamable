'use strict';
const fs = require('fs');
const FormData = require('form-data');

const action = async context => {
	const endpoint = 'https://api.streamable.com/upload';
	const filePath = await context.filePath();
	const form = new FormData();

	const credentials = `${context.config.get('username')}:${context.config.get('password')}`;
	const authorization = Buffer.from(credentials).toString('base64');

	context.setProgress('Uploading…');
	form.append('file', fs.createReadStream(filePath));

	const response = await context.request(endpoint, {
		method: 'post',
		body: form,
		headers: {authorization: `Basic ${authorization}`}
	});

	const {shortcode} = JSON.parse(response.body);

	context.copyToClipboard(`https://streamable.com/${shortcode}`);
	context.notify('URL to the video has been copied to the clipboard');
};

const streamable = {
	title: 'Share on Streamable',
	formats: ['gif', 'mp4', 'webm', 'apng'],
	action,
	config: {
		username: {
			title: 'Username',
			type: 'string',
			required: true
		},
		password: {
			title: 'Password',
			type: 'password',
			required: true
		}
	}
};

exports.shareServices = [streamable];
