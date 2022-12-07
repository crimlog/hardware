const { appendFile, mkdir } = require('node:fs/promises');
const { relative } = require('node:path');
const moment = require('moment');
const { serializeError } = require('serialize-error');

module.exports = class Logger {
	static async log(content, type = 'log') {
		type !== 'error' && !!content && content.constructor === Object && (content = JSON.stringify(content));

		//create directory first, if it does not exist
		await mkdir('./' + relative(process.cwd(), 'log/'), { recursive: true });

		switch (type) {
			case 'log':
				appendFile(
					'./' + relative(process.cwd(), 'log/log.log'),
					`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${content}\n`
				);

			case 'error':
				appendFile(
					'./' + relative(process.cwd(), 'log/error.log'),
					`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${JSON.stringify(serializeError(content))}\n`
				);
		}
	}

	static error(content) {
		return this.log(content, 'error');
	}
};
