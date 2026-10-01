import store from '../store';

// Use Web Audio API
const AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext
);

const hasWebAudioAPI = {
  data: !!AudioContext && location.protocol.indexOf('http') !== -1,
};


const music = {};

(() => {
  if (!hasWebAudioAPI.data) {
    return;
  }
  const url = '/music.mp3';
  const context = new AudioContext();
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';

  req.onload = () => {
    context.decodeAudioData(req.response, (buf) => { // Decode audio into buffer
      const getSource = () => { // Create audio source
        const source = context.createBufferSource();
        source.buffer = buf;
        source.connect(context.destination);
        return source;
      };

      music.killStart = () => { // Game start sound plays only once
        music.start = () => {};
      };

      music.start = () => { // Game start
        music.killStart();
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 3.7202, 3.6224);
      };

      music.clear = () => { // Clear lines
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 0, 0.7675);
      };

      music.fall = () => { // Immediate fall / hard drop
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 1.2558, 0.3546);
      };

      music.gameover = () => { // Game over
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 8.1276, 1.1437);
      };

      music.rotate = () => { // Rotate
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.2471, 0.0807);
      };

      music.move = () => { // Move
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.9088, 0.1437);
      };
    },
    (error) => {
      if (window.console && window.console.error) {
        window.console.error(`Audio: ${url} load error`, error);
        hasWebAudioAPI.data = false;
      }
    });
  };

  req.send();
})();

export {
  hasWebAudioAPI,
  music,
};

export default {
  hasWebAudioAPI,
  music,
};


