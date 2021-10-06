export default function loadBulk() {
	const script = document.createElement('script');
	script.src = 'https://cdn.jsdelivr.net/npm/snitchbot/dist/bulk.js';
	document.head.appendChild(script);
}