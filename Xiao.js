require('dotenv').config();
const { OWNERS, XIAO_PREFIX, INVITE } = process.env;
const path = require('path');
const Client = require('./structures/Client');
const client = new Client({
	commandPrefix: XIAO_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
const activities = require('./assets/json/activity');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['info', 'Discord Information'],
		['random', 'Random Response'],
		['single', 'Single Response'],
		['events', 'Events'],
		['search', 'Search'],
		['analyze', 'Analyzers'],
		['games', 'Games'],
		['voice', 'Voice Channel'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['number-edit', 'Number Manipulation'],
		['other', 'Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));


client.login(process.env.BOT_TOKEN);
