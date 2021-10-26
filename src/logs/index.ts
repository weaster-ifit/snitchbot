import convertToString from '../common/convert-to-string';
import { getNextColor } from '../color';

const _logs = [];
const _logTypes = {};

export function addLogs(newLogs) {
  newLogs.forEach(log => {
    if (!log.type) { log.type = 'Anonymous Log'; }
    if (!_logTypes[log.type]) {
      
      _logTypes[log.type] = {
        color: log.rgb || getNextColor(),
        isActive: 1
      }
    }
    log.rgb = _logTypes[log.type].color;
    _logs.push(log);
  });
}

function addLogToDOM(
  { type, data, rgb, t },
  container
) {
  const event = document.createElement('div');
  event.className = 'entry';
  event.style.backgroundColor = 'rgba(' + rgb.join(', ') + ', .4)';
  event.style.borderColor = 'rgb(' + rgb.join(', ') + ')';
  const title = document.createElement('h2');
  title.textContent = type;
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

  container.insertBefore(event, container.firstChild);
}

function addLogTypeToDOM({ type, data, location }) {
  const item = document.createElement('div');
  item.className = 'item';
  item.textContent = type;
  item.style.backgroundColor = 'rgb(' + data.color.join(', ') + ')';
  item.style.opacity = data.isActive ? '1' : '.2';
  item.addEventListener('click', () => {
    data.isActive = !data.isActive;
    print(location);
  });
  location.filterContainer.appendChild(item);
}

function printLogs({ logs, location }) {
  const { logContainer, filterContainer } = location;

  while (logContainer.firstChild) {
    logContainer.removeChild(logContainer.firstChild);
  }
  while (filterContainer.firstChild) {
    filterContainer.removeChild(filterContainer.firstChild);
  }

  logs.forEach(log => addLogToDOM(log, logContainer));
  Object.keys(_logTypes).forEach(type => addLogTypeToDOM({ type, data: _logTypes[type], location }));
}

export function print(location) {
  printLogs({ logs: _logs.filter(log => _logTypes[log.type] && _logTypes[log.type].isActive), location });
}

export default {
  print,
  addLogs
}
