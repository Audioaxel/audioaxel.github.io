

// #region Something Button ▼
var testPlayBtn = document.getElementById('testPlayButton');
testPlayBtn.addEventListener('click', playAudio);

function playAudio() {
 console.log('Play Audio');
 startAudioVisualizer()
}

/* ================================ */

var testPlayBtn = document.getElementById('testSomethingButton');
testPlayBtn.addEventListener('click', testSomething);

function testSomething() {
  console.log('Test Something');
}

// After DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  onAfterMounted();
});
function onAfterMounted() {
  console.log('DOM ist geladen.');
}
// #endregion Something Button ▲



// Audio
let audioCtx;
let audio;
let audioSource;
let fftSize = 128; /* setup irgendwas */
let barWidth;
let barHeight;


const canvas = document.getElementById('audioVisualizer');
const ctx = canvas.getContext('2d');

function startAudioVisualizer() {
	setupAudioVisualizer();

	audio.play();

	// old
	function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);

        drawVisualiserBasic(bufferLength, x, barWidth, barHeight, dataArray);
        
        requestAnimationFrame(animate);
    }
    animate();
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

	// new STuff
	barWidth = canvas.width / bufferLength * 1.3;
}

// TESTE DIE DURCH

function drawVisualiserBasic(bufferLength, x, barWidth, barHeight, dataArray) {

    for (let i = 3; i < bufferLength; i++) {
        barHeight = dataArray[i] * .2;
        ctx.fillStyle = '#5b2843';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
    }
    
};