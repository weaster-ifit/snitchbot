import { ReportLogs, LogsHandled } from './common';
import { getNextColor } from './color';

interface LogSyncEvent extends Event {
  detail: any
}

declare var __MAIN_STYLE__: string;
declare var __PACKAGE_NAME__: string;
declare var __PACKAGE_VERSION__: string;
declare var __IS_PRODUCTION_BUILD__: boolean;

(function() {
  window.addEventListener(ReportLogs, (e: LogSyncEvent) => {
  	printLogs(e.detail);
    window.dispatchEvent(new CustomEvent(LogsHandled, {}));
  });

  const logColors = {};

  let open = false;

  const toggler = document.createElement('div');
  toggler.className = 'toggler';
  toggler.textContent = '+';
  toggler.addEventListener('click', () => {
  	open = !open;
  	toggler.style.backgroundColor = open ? 'red' : 'green';
  	toggler.style.transform = open ? 'rotateZ(135deg)' : 'rotateZ(0)';
  	aside.className = open ? 'active' : '';
  });
  document.body.appendChild(toggler);

  const style = document.createElement('style');
  style.textContent = __MAIN_STYLE__;
  document.body.appendChild(style);

  const aside = document.createElement('aside');
  document.body.appendChild(aside);

  const header = document.createElement('div');
  header.className = 'header';
  const build = __IS_PRODUCTION_BUILD__ ? '' : '(local)';
  header.textContent = `${__PACKAGE_NAME__} v${__PACKAGE_VERSION__} ${build}`;
  aside.appendChild(header);

  const debug = document.createElement('div');
  debug.className = 'wrapper';
  aside.appendChild(debug);

  function printLogs(logs) {
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

  	filterLogs({ logs });
  }

  function filterLogs({ logs, filter = () => true }) {
    logs.filter(filter)
      .forEach(log => addLogToDOM(log));
  }

  function convertToString(nonString) {
    try {
      return JSON.stringify(nonString, null, 2);
    } catch (e) {
      return 'Error logging entry: ' + e.message;
    }
  }

  function addLogToDOM({ type, data, rgb, t }) {
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

    debug.insertBefore(event, debug.firstChild);
  }
})();