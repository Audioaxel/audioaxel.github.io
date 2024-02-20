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
let playerContainer;
let visualizer;
let analyser;
let bufferLength;
let dataArray;
let fftSize = 64; /* setup irgendwas */
let animIntervall = 50; /* setup irgendwas */
let elements = [];
let elements_offset = - 10;


/* ================================= */

function startAudioVisualizer() {
	playerContainer = document.getElementById('playerContainer');

	setupAudioVisualizer();

	audio.play();

	visualizer = document.getElementById('audioVisualizer');
	createVisualElements();

	setInterval(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		analyser.getByteFrequencyData(dataArray);
		drawVisualizer(bufferLength, 0, barWidth, barHeight, dataArray);
		animatePlayerContainer(playerContainer);
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

/*
	Draw Visualizeritem = item > 150 ? item / 15 : item * 1.5;
	150 ??
	15 lässt die elemente weiter nach innen fallen
	1.5 ??
*/
function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
	for (let i = 0; i < bufferLength + elements_offset; i++) {
		let item = dataArray[i];
		item = item > 150 ? item / 15 : item * 1.5;
		elements[i].style.transform = `rotateZ(
			${i * (360 / (bufferLength + elements_offset))}deg) translate(
				-50%, ${clamp(item, 0, 12)}px)`; // 80, 108
	}
}

/* Min & Max Height of Element */
const clamp = (num, min, max) => {
	if(num >= max) return max;
	if(num <= min) return min;
	return num;
}

// Hier nochmal ran
function animatePlayerContainer(player)
{
    let volume = currentVolume();
    let softVolume = 0;

    softVolume = softVolume * 0.9 + volume * 0.1;
    player.style.transform = 'scale(' + 
    // -> takes 2args: hoizonal & vertical scale
    (1 + softVolume * 5), (1 + softVolume * 4) + ')';   
}


function currentVolume() 
{
    analyser.getByteTimeDomainData(dataArray);
    let normSamples = [...dataArray].map(e => e/128 - 1);
    let sum = 0;

    // -> cycle through normalized samplesArray & square each element
    for (let i = 0; i < normSamples.length; i++) {
        // -> add it to total sum number (move all numbers to positive one)
        sum += normSamples[i] * normSamples[i];
    }
    //  averrage Volume
    let volume = Math.sqrt(sum / normSamples.length);
    return volume;
}
// #endregion Canvas ▲