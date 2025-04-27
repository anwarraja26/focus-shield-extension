// content.js
// Listens for messages from extension to play beep
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'play-beep') {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
      oscillator.connect(ctx.destination);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, 500);
    } catch (err) {
      console.warn('[content.js] Beep error:', err);
    }
  }
});