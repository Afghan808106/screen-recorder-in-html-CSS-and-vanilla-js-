let mediaRecorder;
let recordedChunks = [];
const videoElement = document.getElementById('video');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const downloadButton = document.getElementById('download-btn');
const micButton = document.getElementById('mic-btn');
const micStopButton = document.getElementById('mic-stop-btn');

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
downloadButton.addEventListener('click', downloadRecording);
micButton.addEventListener('click', startAudioRecording);
micStopButton.addEventListener('click', stopAudioRecording);

function startRecording() {
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    .then(function(stream) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function(event) {
        recordedChunks.push(event.data);
      };
      mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        videoElement.src = URL.createObjectURL(blob);
        downloadButton.disabled = false;
      };
      mediaRecorder.start();
      startButton.disabled = true;
      stopButton.disabled = false;
    })
    .catch(function(error) {
      console.error('Error accessing media devices.', error);
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

function downloadRecording() {
  if (recordedChunks.length === 0) {
    console.warn('No recording available.');
    return;
  }
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'recording.webm';
  a.click();
  window.URL.revokeObjectURL(url);
}

function startAudioRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function(event) {
        recordedChunks.push(event.data);
      };
      mediaRecorder.onstop = function() {
        console.log('Audio recording stopped.');
      };
      mediaRecorder.start();
      micButton.disabled = true;
      micStopButton.disabled = false;
    })
    .catch(function(error) {
      console.error('Error accessing audio devices.', error);
    });
}

function stopAudioRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    micButton.disabled = false;
    micStopButton.disabled = true;
  }
}