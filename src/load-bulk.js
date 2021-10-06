export default function loadBulk() {
	const script = document.createElement('script');
	script.src = __IS_PRODUCTION_BUILD__
		? 'https://cdn.jsdelivr.net/npm/snitchbot/dist/bulk.js'
		: './dist/bulk.js';
	document.head.appendChild(script);
}