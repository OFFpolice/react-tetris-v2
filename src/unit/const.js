import { List } from 'immutable';
import i18n from '../../i18n.json';

const blockShape = {
  I: [
    [1, 1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
};

const origin = {
  I: [[-1, 1], [1, -1]],
  L: [[0, 0]],
  J: [[0, 0]],
  Z: [[0, 0]],
  S: [[0, 0]],
  O: [[0, 0]],
  T: [[0, 0], [1, 0], [-1, 1], [0, -1]],
};

const blockType = Object.keys(blockShape);

const speeds = [800, 650, 500, 370, 250, 160];

const delays = [50, 60, 70, 80, 90, 100];

const fillLine = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const blankLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const blankMatrix = (() => {
  const matrix = [];
  for (let i = 0; i < 20; i++) {
    matrix.push(List(blankLine));
  }
  return List(matrix);
})();

const clearPoints = [100, 300, 700, 1500];

const StorageKey = 'REACT_TETRIS';

const lastRecord = (() => { // Previous game state
  let data = localStorage.getItem(StorageKey);
  if (!data) {
    return false;
  }
  try {
    if (window.btoa) {
      data = atob(data);
    }
    data = decodeURIComponent(data);
    data = JSON.parse(data);
  } catch (e) {
    if (window.console || window.console.error) {
      window.console.error('Error reading saved record:', e);
    }
    return false;
  }
  return data;
})();

const maxPoint = 999999;

const transform = (function () {
  const trans = ['transform', 'webkitTransform', 'msTransform', 'mozTransform', 'oTransform'];
  const body = document.body;
  return trans.filter((e) => body.style[e] !== undefined)[0];
}());

const eachLines = 20; // Increase speed every 20 cleared lines

const lan = 'en';

document.title = i18n.data.title[lan];

const i18nData = i18n.data;

export {
  blockShape,
  origin,
  blockType,
  speeds,
  delays,
  fillLine,
  blankLine,
  blankMatrix,
  clearPoints,
  StorageKey,
  lastRecord,
  maxPoint,
  eachLines,
  transform,
  lan,
  i18nData as i18n,
};

export default {
  blockShape,
  origin,
  blockType,
  speeds,
  delays,
  fillLine,
  blankLine,
  blankMatrix,
  clearPoints,
  StorageKey,
  lastRecord,
  maxPoint,
  eachLines,
  transform,
  lan,
  i18n: i18n.data,
};

