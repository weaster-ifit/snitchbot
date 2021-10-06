import { ReportLogs, LogsHandled } from './common';

interface LogSyncEvent extends Event {
  detail: any
}

declare var __PACKAGE_NAME__: string;
declare var __PACKAGE_VERSION__: string;
declare var __IS_PRODUCTION_BUILD__: boolean;

(function() {
  window.addEventListener(ReportLogs, (e: LogSyncEvent) => {
  	printLogs(e.detail);
    window.dispatchEvent(new CustomEvent(LogsHandled, {}));
  });

  const colors = [
    [0, 140, 50],
    [95, 92, 255],
    [4, 199, 163],
    [212, 9, 2],
    [232, 145, 5],
    [131, 33, 217],
    [179, 4, 123]
  ];
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
  style.textContent = `
    .toggler {
      position: absolute;
      cursor: pointer;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: green;
      transform: rotateZ(0);
      transition: all .5s;
      color: white;
      z-index: 1001
    }
    aside {
      font-family: sans-serif;
      position: fixed;
      top: 40px;
      width: 0;
      transition: all .5s;
      border: 1px solid #333;
      box-shadow: 0 0 2px #FFF;
      padding: 0;
      overflow: hidden;
      z-index: 1000;
      right: -820px;
      width: 800px;
    }
    aside.active {
      right: -5px;
    }
    @media (max-width: 888px) {
      aside {
        right: calc(0 - 90vw - 20px);
      }
      aside.active {
        width: 90vw;
      }
    }
      aside .header {
        padding: 5px;
        font-size: 10px;
        color: white;
        background-color: #111;
      }
      aside .wrapper {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        height: calc(90vh - 60px);
        background-color:#333;
      }
      aside .entry {
        margin: 10px 10px 10px 20px;
        padding: 5px;
        color: rgb(255, 255, 255);
        text-shadow: 0 0 3px black;
        width: calc(100% - 55px);
        border: 1px solid;
      }
        .entry h2 {
          margin: 0 0 10px;
          padding: 3px 0 3px 5px;
          text-align: left;
          font-size: 12px;
        }
        .entry .timestamp {
          font-size: 10px;
        }
        .entry pre {
          padding: 5px;
          background-color: #FEFEFE;
          color: #333;
          overflow: scroll;
          text-shadow: none;
        }`;
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
          let color = colors.shift();
          logColors[type] = color;
          colors.push(color);
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