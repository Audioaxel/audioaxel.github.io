// #region Test ▼
function testButtonClick() {
  alert('Der Button wurde geklickt!');
}

var button = document.getElementById('testButton');
button.addEventListener('click', startAudioVisualizer);
// #endregion Test ▲

// #region Canvas ▼
// Canvas
let canvas;
let ctx;

let barWidth;
let barHeight;

// Audio
let audioCtx;
let audio;
let audioSource;

// Animation
let visualizer;
let analyser;
let bufferLength;
let dataArray;
let fftSize = 64; /* setup irgendwas */
let animIntervall = 50; /* setup irgendwas */
let elements = [];
let elements_offset = - 10;

/* ================================= */
// Element
const elem = document.getElementById('roundButton');
// Setup analyser


/* ================================= */

function startAudioVisualizer() {
	setupAudioVisualizer();
	audio.play();

	visualizer = document.getElementById('audioVisualizer');
	createVisualElements();

	setInterval(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		analyser.getByteFrequencyData(dataArray);
		drawVisualizer(bufferLength, 0, barWidth, barHeight, dataArray);
	}, animIntervall);

}

function setupAudioVisualizer() {

	// Canvas Context
	canvas = document.getElementById('audioVisualizerCanvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');

	// Audio Context
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	audio = new Audio('assets/audio/Techno.mp3');
	audioSource = audioCtx.createMediaElementSource(audio);

	// Setup Analyser
	analyser = audioCtx.createAnalyser();
	audioSource.connect(analyser);
	analyser.connect(audioCtx.destination);
	analyser.fftSize = fftSize;

	// Setup Animation
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);

	barWidth = canvas.width / bufferLength;
}

function createVisualElements() {
	for(let i = 0; i < bufferLength + elements_offset; i++) {
		const element = document.createElement('span');
		element.classList.add('element');
		elements.push(element);
		visualizer.appendChild(element);
	}
}

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
	for (let i = 0; i < bufferLength + elements_offset; i++) {
		let item = dataArray[i];
		item = item > 150 ? item / 1.5 : item * 1.5;
		elements[i].style.transform = `rotateZ(
			${i * (360 / (bufferLength + elements_offset))}deg) translate(
				-50%, ${clamp(item, 80, 108)}px)`; // 80, 108
	}
}

/* Min & Max Height of Element */
const clamp = (num, min, max) => {
	if(num >= max) return max;
	if(num <= min) return min;
	return num;
}
// #endregion Canvas ▲