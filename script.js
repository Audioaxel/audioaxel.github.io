
/* === Test ============================== */

// #region Play Button ▼
var testPlayBtn = document.getElementById('testPlayButton');
testPlayBtn.addEventListener('click', playAudio);

function playAudio() {
  if(audio === undefined) {
	startAudioVisualizer();
	isPlaying = true;
	return;
  }

  if(audio.paused) {
	audio.play();
	isPlaying = true;
  } else {
	audio.pause();
	clearInterval(intervalID);
	isPlaying = false;
  }
}
let isPlaying = false;

const btn = document.getElementById('playerContainer');
btn.addEventListener('click', e => {
	if (audio === undefined) {
		startAudioVisualizer();
		return;
	} else if (audio.paused) {
		startAudioVisualizer();
	} else {
		audio.pause();
		clearInterval(intervalID);
	}
	// audio.paused ? playAudio() : audio.pause();
	// btn.classList.toggle('btn-play');
	// btn.classList.toggle('btn-pause');
});

let intervalID;
// #endregion Play Button ▲

// #region Something Button ▼
var testPlayBtn = document.getElementById('testSomethingButton');
testPlayBtn.addEventListener('click', testSomething);

function testSomething() {
  console.log('Test Something');
	test();
}

// After DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  onAfterMounted();
});
function onAfterMounted() {
  console.log('DOM ist geladen.');
  test();
}



// #endregion Something Button ▲

// #region Audio Player Button ▼
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
function test() {
  playerContainer = document.getElementById('playerContainer');

	setupAudioVisualizer();
	visualizer = document.getElementById('audioVisualizer');
	createVisualElementsINIT();
  analyser.getByteFrequencyData(dataArray);

  dataArray = new Uint8Array(32).fill(255);
  console.log( bufferLength, dataArray);
	drawVisualizer(bufferLength, dataArray);
}

function startAudioVisualizer() {
	playerContainer = document.getElementById('playerContainer');

	setupAudioVisualizer();

	audio.play();

	visualizer = document.getElementById('audioVisualizer');
	// createVisualElements();

	intervalID = setInterval(() => {

		analyser.getByteFrequencyData(dataArray);

    // der hier macht position verändern
		drawVisualizer(bufferLength, dataArray);

		animatePlayerContainer(playerContainer);
    
	}, animIntervall);
}

function setupAudioVisualizer() {

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
}

function createVisualElements() {
	for(let i = 0; i < bufferLength + elements_offset; i++) {
		const element = document.createElement('span');
		element.classList.add('element');
		elements.push(element);
		visualizer.appendChild(element);
	}
}

function createVisualElementsINIT() {
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
function drawVisualizer(bufferLength, dataArray) {
	for (let i = 0; i < bufferLength + elements_offset; i++) {
		let item = dataArray[i];
		item = item > 150 ? item / 15 : item * 1.5;
		elements[i].style.transform = `rotateZ(
			${i * (360 / (bufferLength + elements_offset))}deg) translate(
				-50%, ${clamp(item, 13, 16)}px)`; // 80, 108
	}
}

/* Min & Max Height of Element */
const clamp = (num, min, max) => {
	if(num >= max) return max;
	if(num <= min) return min;
	return num;
}
// #endregion Audio Player Button ▲

// #region Audio Volume ▼
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
// #endregion Audio Volume ▲