import convertToString from '../common/convert-to-string';

declare var __IS_PRODUCTION_BUILD__: boolean;
declare var __MAIN_STYLE__: string;
declare var __PACKAGE_NAME__: string;
declare var __PACKAGE_VERSION__: string;

let open = false;

export function buildDOMElements() {
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

  const filter = document.createElement('div');
  filter.className = 'filter';
  aside.appendChild(filter);

  const debug = document.createElement('div');
  debug.className = 'wrapper';
  aside.appendChild(debug);

  return {
    logContainer: debug,
    filterContainer: filter
  }
}

export function addLogToDOM(
  { type, data, rgb, t },
  location
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

  location.insertBefore(event, location.firstChild);
}

export function addLogTypeToDOM(type, color, location) {
  const item = document.createElement('div');
  item.className = 'item';
  item.textContent = type;
  console.log({ color });
  item.style.backgroundColor = 'rgb(' + color.join(', ') + ')';
  location.appendChild(item);
}

export default {
  buildDOMElements,
  addLogToDOM
};