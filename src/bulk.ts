import { ReportLogs, LogsHandled } from './common/event-names';
import {
  init
} from './dom/init';
import { addLogs, print } from './logs';

interface LogEvent extends Event {
  detail: any
}

const logs = [];
const logTypes = {};
const location = init();

window.addEventListener(ReportLogs, (e: LogEvent) => {
  addLogs(e.detail);
  print(location);
  window.dispatchEvent(new CustomEvent(LogsHandled, {}));
});