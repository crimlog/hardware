const reader = require('rpi-mfrc522-nodejs');
const Logger = require('./classes/Logger');
// const Terminal = require('./classes/Terminal');
const { request, gql } = require('graphql-request');

const READER_PINS = [[2, 22]]; // GPIO pins
let queueId = null;
const courseId = '636fe6844498e9db2cf95605';

const resolveStudentId = async function (cardId) {
	try {
		const res = await request({
			url: process.env.API_URL,
			document: gql`
				query studentByCardId($cardId: CardId!) {
					studentByCardId(cardId: $cardId) {
						id
					}
				}
			`,
			variables: { cardId },
		});

		if (!res?.studentByCardId?.id) throw 'Could not resolve student ID';
		return res.studentByCardId.id;
	} catch (e) {
		console.error(e);
		return null;
	}
};

const createAttendanceQueue = async function () {
	try {
		const foundQueue = await request({
			url: process.env.API_URL,
			document: gql`
				query attendanceQueueByCourseId($courseId: ObjectID!) {
					attendanceQueueByCourseId(courseId: $courseId) {
						id
					}
				}
			`,
			variables: { courseId },
		});
		if (!!foundQueue?.attendanceQueueByCourseId?.id) return (queueId = foundQueue.attendanceQueueByCourseId.id);

		const res = await request({
			url: process.env.API_URL,
			document: gql`
				mutation attendanceQueueCreate($attendanceQueue: AttendanceQueueInput!) {
					attendanceQueueCreate(attendanceQueue: $attendanceQueue) {
						id
					}
				}
			`,
			variables: {
				attendanceQueue: {
					courseId,
				},
			},
		});

		if (!res?.attendanceQueueCreate?.id) throw 'Could not create attendance queue';
		queueId = res.attendanceQueueCreate.id;
		return res.attendanceQueueCreate.id;
	} catch (e) {
		console.error(e);
		return null;
	}
};

const addStudentToQueue = async function (studentId) {
	if (!queueId) await createAttendanceQueue();
	console.log('queueId', queueId);

	const res = await request({
		url: process.env.API_URL,
		document: gql`
			mutation attendanceQueueAddStudent($queueId: ObjectID!, $studentId: Int!) {
				attendanceQueueAddStudent(queueId: $queueId, studentId: $studentId) {
					id
				}
			}
		`,
		variables: {
			queueId,
			studentId,
		},
	});

	console.log('addStudentToQueue', res);

	return res;
};

let currently_reading = false;
const handleRead = async function (data) {
	const [card_id] = data ?? [];
	if (!card_id) return; // ignore empty reads

	// throttle taps to prevent spam
	if (currently_reading) return;
	currently_reading = true;
	// Terminal.hideSpinner({ clear: false }).showProcessingSpinner();

	try {
		console.log('received input', card_id);
		console.log(process.env.API_URL);

		const studentId = await resolveStudentId(card_id);
		console.log('studentId', studentId);
		// ignore unknown NFC cards that don't map to students
		if (!studentId) {
			//TODO: display error in terminal
			currently_reading = false;
			return;
		}

		// add student to queue
		await addStudentToQueue(studentId);
	} catch (e) {
		throw e;
	} finally {
		// remove loading spinner, show result table
		// Terminal.hideSpinner().sendStudentTable(studentId).showTapSpinner();
		currently_reading = false;
	}
};

// initialize the terminal and show loading spinner
// Terminal.init().showTapSpinner();

// listen to new card reads
reader.onRfidChange(READER_PINS, handleRead);

process.on('unhandledRejection', (err) => {
	// since this is a console app, no console.log
	//Logger.error(err);
	console.error(err);
});
