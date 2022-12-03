const reader = require('rpi-mfrc522-nodejs');
const Terminal = require('./Terminal');

const READER_PINS = [[2, 22]];

const handleRead = function (data) {
	const [card_id] = data ?? [];
	if (!card_id) return;

	// call the api or something
	Terminal.hideSpinner();
	Terminal.sendResultTable(card_id);
	Terminal.showSpinner();
};

Terminal.init().showSpinner();

reader.onRfidChange(READER_PINS, handleRead);
