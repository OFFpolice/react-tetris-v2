import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';
import { hasWebAudioAPI } from '../../unit/music';

let initState = lastRecord && lastRecord.music !== undefined ? !!lastRecord.music : true;
if (!hasWebAudioAPI.data) {
  initState = false;
}
const music = (state = initState, action) => {
  switch (action.type) {
    case reducerType.MUSIC:
      if (!hasWebAudioAPI.data) { // If browser does not support WebAudioApi, sound effects cannot play
        return false;
      }
      return action.data;
    default:
      return state;
  }
};

export default music;
