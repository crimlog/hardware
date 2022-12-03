const reader = require('rpi-mfrc522-nodejs');
const Terminal = require('./Terminal');
const students = require('./data.json');

const READER_PINS = [[2, 22]]; // GPIO pins

let currently_reading = false;
const handleRead = async function (data) {
	const [card_id] = data ?? [];
	if (!card_id) return; // ignore empty reads

	// throttle taps to prevent spam
	if (currently_reading) return;
	currently_reading = true;
	Terminal.hideSpinner({ clear: false }).showProcessingSpinner();

	// mock api call
	// wait between 250 and 1500 ms
	await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1500) + 250));
	const student = students.find(({ cardId }) => cardId === card_id);
	if (!student) return (currently_reading = false); // ignore unknown NFC cards

	// remove loading spinner, show result table
	Terminal.hideSpinner().sendStudentTable(student).showTapSpinner();
	currently_reading = false;
};

// initialize the terminal and show loading spinner
Terminal.init().showTapSpinner();

// listen to new card reads
reader.onRfidChange(READER_PINS, handleRead);
