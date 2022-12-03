const reader = require('rpi-mfrc522-nodejs');
const Terminal = require('./Terminal');

const READER_PINS = [[2, 22]]; // GPIO pins

const handleRead = function (data) {
	const [card_id] = data ?? [];
	if (!card_id) return; // ignore empty reads

	// call the api or something

	// remove loading spinner, show result table
	Terminal.hideSpinner();
	Terminal.sendResultTable(card_id);
	Terminal.showSpinner();
};

// initialize the terminal and show loading spinner
Terminal.init().showSpinner();

// listen to new card reads
reader.onRfidChange(READER_PINS, handleRead);
