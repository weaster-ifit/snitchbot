import { ReportLogs, LogsHandled } from './common/event-names';
import { getNextColor } from './color';
import buildDOMElements from './dom/main';

interface LogEvent extends Event {
  detail: any
}

(function() {

  const logs = [];
  const logColors = {};

  window.addEventListener(ReportLogs, (e: LogEvent) => {
    e.detail.forEach(log => logs.push(log));
    printLogs({ logs, location: container });
    window.dispatchEvent(new CustomEvent(LogsHandled, {}));
  });

  const { container } = buildDOMElements();

  function printLogs({ logs, location }) {
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
        } 
        log.rgb = logColors[type];
      }
    });

    filterLogs({ logs, location });
  }

  function filterLogs({
    logs,
    location,
    filter = () => true
  }) {
    logs.filter(filter)
      .forEach(log => addLogToDOM(log, location));
  }

  function convertToString(nonString) {
    try {
      return JSON.stringify(nonString, null, 2);
    } catch (e) {
      return 'Error logging entry: ' + e.message;
    }
  }

  function addLogToDOM(
    { type, data, rgb, t },
    location
  ) {
    const event = document.createElement('div');
    event.className = 'entry';
    event.style.backgroundColor = 'rgba(' + rgb.join(', ') + ', .4)';
    event.style.borderColor = 'rgb(' + rgb.join(', ') + ')';
    const title = document.createElement('h2');
    title.textContent = type || 'Anonymous Log';
    title.style.backgroundColor = 'rgb(' + rgb.join(', ') + ')';
    event.appendChild(title);
    const time = document.createElement('div');
    time.className = 'timestamp';
    time.textContent = t;
    event.appendChild(time);

    if (data) {
      const entry = document.createElement('pre');
      const textContent = typeof data === 'string'
        ? data
        : convertToString(data);
      entry.textContent = textContent;
      title.addEventListener('click', () => navigator.clipboard.writeText(textContent));
      event.appendChild(entry);
    }

    location.insertBefore(event, location.firstChild);
  }
})();