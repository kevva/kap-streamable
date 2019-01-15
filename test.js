import test from 'ava';
import kapPluginTest from 'kap-plugin-test';

const response = {
	body: '{"shortcode":"rfyj3"}'
};

test('request and copy to clipboard', async t => {
	const config = {
		username: 'marty',
		password: 'mcfly'
	};
	const plugin = kapPluginTest('unicorn.gif', {config});
	plugin.context.request.resolves(response);
	await plugin.run();

	const request = plugin.context.request.lastCall.args[1];
	delete request.body;

	t.is(plugin.context.request.lastCall.args[0], 'https://api.streamable.com/upload');
	t.deepEqual(request, {method: 'post', headers: {authorization: 'Basic bWFydHk6bWNmbHk='}});
	t.true(plugin.context.copyToClipboard.calledWith('https://streamable.com/rfyj3'));
});
