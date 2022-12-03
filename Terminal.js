const { terminal: term } = require('terminal-kit');

class Spinner {
	static #spinner = null;

	static async show() {
		this.#spinner = await term.spinner('dotSpinner');
		term(' Tap your card 💳 ');
	}

	static stop() {
		this.#spinner.animate(false);
		term.clear();
	}
}

module.exports = class Terminal {
	static init() {
		term.clear();
		return this;
	}

	static showSpinner() {
		/*await*/ Spinner.show();
		return this;
	}

	static hideSpinner() {
		Spinner.stop();
		return this;
	}

	static sendResultTable(card_id) {
		term.table(
			[
				[' 💳 Card ID', ' 👤 Student Name', ' 🎓 Student ID'],
				[` ${card_id}`, ' Melanie Spence', ' 12345678'],
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
	}
};
