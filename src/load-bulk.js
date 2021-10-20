export default function loadBulk() {
  const script = document.createElement('script');
  script.src = __SCRIPT_SRC__;
  document.head.appendChild(script);
}