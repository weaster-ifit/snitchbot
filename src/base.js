import { ReportLogs, LogsHandled } from './common';
import loadBulk from './load-bulk';

let maxLogLength = 50;
let initCondition = () => window.location.search.indexOf(`use-${__PACKAGE_NAME__}`) >= 0;
let isLoaded = false;
let hasInit = false;

const logs = [];

function getLogs() {
	return logs;
}

function log({ type, data, color }) {
	logs.push({ type, data, color, t: new Date().toLocaleTimeString() });
	if (logs.length > maxLogLength) {
		logs.shift();
	}

	window.dispatchEvent(new CustomEvent(ReportLogs, {
		detail: getLogs()
	}));
}

function initialize({ condition } = {}) {
	if (condition && typeof condition === 'function') {
		initCondition = condition;
	}

	if (!hasInit && initCondition()) {
		hasInit = true;
		window.addEventListener(LogsHandled, () => logs = []);
		loadBulk();
	}
}

function init() {
	try {
		initialize();
	} catch (e) {
		window.addEventListener('DOMContentLoaded', initialize);
	}
}

export default {
	init,
	log
};

