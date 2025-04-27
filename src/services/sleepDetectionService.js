// sleepDetectionService.js
// Polls the local Flask server for sleep status and notifies after 5s, 10s, 15s of continuous sleep

const SLEEP_API_URL = 'http://127.0.0.1:5001/status';
let sleepDetected = false;
let sleepStartTimestamp = null;
let sleepNotifyTimeout = null;

function playBeep() {
  // Use Chrome TTS to emit a brief tone
  chrome.tts.speak('you are distracting please refocus', {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    enqueue: true
  });
}

function makePhoneCall() {
  console.log('[ACTION] Making phone call due to prolonged sleep detection!');
  fetch('http://localhost:5000/make_call', {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Call initiated:', data);
  })
  .catch(error => {
    console.error('Error initiating call:', error);
  });
}


function onSleepNotify() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Sleep Detected',
    message: 'You are sleeping. Please wake up!'
  });
}

// Default handlers for sleep notifications
function default5() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Sleep Detected',
    message: 'You are sleeping for 5 seconds. Please wake up!'
  });
}
function default10() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Sleep Detected',
    message: 'You are sleeping for 10 seconds. Please wake up!'
  });
  playBeep();
}

function default15() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Sleep Detected',
    message: 'You are sleeping for 15 seconds. Making a call!'
  });
  makePhoneCall();
}

function pollSleepStatus({ onInitial = onSleepNotify, on5Sec = default5, on10Sec = default10, on15Sec = default15 } = {}) {
  console.log('[DEBUG] Starting sleep status polling...');
  let notified5 = false;
  let notified10 = false;
  let notified15 = false;

  setInterval(() => {
    chrome.storage.local.get(['isTracking'], async ({ isTracking }) => {
      if (!isTracking) {
        // Reset when not tracking
        sleepDetected = false;
        sleepStartTimestamp = null;
        notified5 = false;
        notified10 = false;
        notified15 = false;
        if (sleepNotifyTimeout) {
          clearTimeout(sleepNotifyTimeout);
          sleepNotifyTimeout = null;
        }
        return;
      }
      try {
        const response = await fetch(SLEEP_API_URL);
        const data = await response.json();
        console.log('[DEBUG] Sleep API response:', data);

        if (data.sleeping) {
          const now = Date.now();
          if (!sleepDetected) {
            sleepDetected = true;
            sleepStartTimestamp = now;
            notified5 = false;
            notified10 = false;
            notified15 = false;
            onInitial();
          } else {
            const elapsed = Math.floor((now - sleepStartTimestamp) / 1000);
            if (!notified5 && elapsed >= 5) {
              notified5 = true;
              on5Sec();
            }
            if (!notified10 && elapsed >= 10) {
              notified10 = true;
              on10Sec();
            }
            if (!notified15 && elapsed >= 15) {
              notified15 = true;
              on15Sec();
            }
          }
        } else {
          // Reset when awake
          sleepDetected = false;
          sleepStartTimestamp = null;
          notified5 = false;
          notified10 = false;
          notified15 = false;
          if (sleepNotifyTimeout) {
            clearTimeout(sleepNotifyTimeout);
            sleepNotifyTimeout = null;
          }
        }
      } catch (err) {
        return;
        // console.error('[ERROR] Fetching sleep status failed:', err);
        // chrome.notifications.create({
        //   type: 'basic',
        //   iconUrl: 'icons/icon128.png',
        //   title: 'Sleep Detector Error',
        //   message: 'Cannot reach sleep detection server. Please start the backend.'
        // });
        sleepDetected = false;
        sleepStartTimestamp = null;
        notified5 = false;
        notified10 = false;
        notified15 = false;
        if (sleepNotifyTimeout) {
          clearTimeout(sleepNotifyTimeout);
          sleepNotifyTimeout = null;
        }
      }
    });
  }, 1000);
}

export default pollSleepStatus;
