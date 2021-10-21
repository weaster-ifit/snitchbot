import { ReportLogs, LogsHandled } from './common/event-names';
import { getNextColor } from './color';
import {
  addLogToDOM,
  addLogTypeToDOM,
  buildDOMElements
} from './dom/main';

interface LogEvent extends Event {
  detail: any
}

(function() {
  const logs = [];
  const logColors = {};
  const { logContainer, filterContainer } = buildDOMElements();

  window.addEventListener(ReportLogs, (e: LogEvent) => {
    e.detail.forEach(log => {
      if (!log.type) { log.type = 'Anonymous Log'; }
      logs.push(log)
    });
    printLogs({ logs, location: logContainer });
    window.dispatchEvent(new CustomEvent(LogsHandled, {}));
  });

  function printLogs({ logs, location, filter = () => true }) {
    while (location.firstChild) {
      location.removeChild(location.firstChild);
    }

    logs.forEach(log => {
      const { type, rgb } = log;
      if (rgb) {
        log.rgb = rgb;
      } else {
        if (!logColors[type]) {
          logColors[type] = getNextColor();
          addLogTypeToDOM(type, logColors[type], filterContainer);
        } 
        log.rgb = logColors[type];
      }
    });

    logs.filter(filter)
      .forEach(log => addLogToDOM(log, location))
  }
})();