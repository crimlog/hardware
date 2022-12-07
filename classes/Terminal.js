const { terminal: term } = require('terminal-kit');

class Spinner {
	static #spinner = null;

	/**
	 * @param {object} args Destructured arguments
	 * @param {string} [args.text] Text to be displayed after spinner, on same line
	 * @param {Terminal.AnimatedTextOption} [args.type] Spinner type
	 */
	static async show({ text = ' Loading... ', type = 'dotSpinner' } = {}) {
		this.#spinner = await term.spinner(type);
		term(text);
	}

	/**
	 *
	 * @param {object} args Destructured arguments
	 * @param {boolean} [args.clear] Whether to clear the terminal after stopping the spinner
	 */
	static stop({ clear = true } = {}) {
		this.#spinner.animate(false);
		clear ? term.clear() : term('\n\n');
	}
}

module.exports = class Terminal {
	static init() {
		term.clear();
		return this;
	}

	static showTapSpinner() {
		/*await*/ Spinner.show({ text: ' Tap your card 💳 ' });
		return this;
	}

	static showProcessingSpinner() {
		/*await*/ Spinner.show({ type: 'lineSpinner', text: ' Processing... ' });
		return this;
	}

	static hideSpinner(opts = {}) {
		Spinner.stop(opts);
		return this;
	}

	/**
	 * Display in the terminal a table with the student's information
	 */
	static sendStudentTable({ id, cardId, first, last }) {
		term.table(
			[
				[' 👤 Student Name', ' 🎓 Student ID', ' 💳 Card ID'],
				[` ${first} ${last}`, ` ${id}`, ` ${cardId}`],
			],
			{
				hasBorder: true,
				borderChars: 'light',
				borderAttr: { color: 'brightred' },
				textAttr: { color: 'brightwhite' },
				firstRowTextAttr: { color: 'brightyellow' },
				width: 60,
				fit: true,
			}
		);
		term('\n');
		return this;
	}
};
