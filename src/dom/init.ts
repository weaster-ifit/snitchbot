import convertToString from '../common/convert-to-string';

declare var __IS_PRODUCTION_BUILD__: boolean;
declare var __MAIN_STYLE__: string;
declare var __PACKAGE_NAME__: string;
declare var __PACKAGE_VERSION__: string;

let open = false;

export function init() {
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

export default {
  init
};