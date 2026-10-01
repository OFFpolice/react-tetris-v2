import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import propTypes from 'prop-types';

import style from './index.module.less';

import Matrix from '../components/matrix';
import Decorate from '../components/decorate';
import NumberDisplay from '../components/number';
import Next from '../components/next';
import Music from '../components/music';
import Pause from '../components/pause';
import Point from '../components/point';
import Logo from '../components/logo';
import Keyboard from '../components/keyboard';

import { transform, lastRecord, speeds, i18n, lan } from '../unit/const';
import { visibilityChangeEvent, isFocus } from '../unit/';
import states from '../control/states';

const isSafeNumber = (val) => typeof val === 'number' && !isNaN(val) && isFinite(val);

const getWindowDimensions = () => {
  const w = (typeof window !== 'undefined' && window.innerWidth) ||
    (typeof document !== 'undefined' && document.documentElement && document.documentElement.clientWidth) ||
    (typeof document !== 'undefined' && document.body && document.body.clientWidth) ||
    640;
  const h = (typeof window !== 'undefined' && window.innerHeight) ||
    (typeof document !== 'undefined' && document.documentElement && document.documentElement.clientHeight) ||
    (typeof document !== 'undefined' && document.body && document.body.clientHeight) ||
    960;
  return {
    w: w > 0 ? w : 640,
    h: h > 0 ? h : 960,
  };
};

class App extends React.Component {
  constructor() {
    super();
    this.state = getWindowDimensions();
    this.resize = this.resize.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize, true);
    if (visibilityChangeEvent) {
      document.addEventListener(visibilityChangeEvent, () => {
        states.focus(isFocus());
      }, false);
    }

    if (lastRecord) {
      if (lastRecord.cur && !lastRecord.pause) {
        const speedRun = this.props.speedRun;
        let timeout = speeds[speedRun - 1] / 2;
        timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
        states.auto(timeout);
      }
      if (!lastRecord.cur) {
        states.overStart();
      }
    } else {
      states.overStart();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize, true);
  }
  resize() {
    this.setState(getWindowDimensions());
  }
  render() {
    let filling = 0;
    const size = (() => {
      const fallback = getWindowDimensions();
      const w = this.state.w > 0 ? this.state.w : fallback.w;
      const h = this.state.h > 0 ? this.state.h : fallback.h;
      const ratio = w > 0 ? h / w : 1.5;
      let scale = 1;
      let css = {};
      if (ratio < 1.4) {
        // Desktop / landscape: constrain to mobile device proportions (max-width 480px)
        const targetW = Math.min(w, 480, (h * 640) / 960);
        scale = Math.min(targetW / 640, h / 960);
        css = {
          marginTop: -480,
        };
      } else {
        // Mobile portrait: fit full width and stretch filling to cover entire screen
        scale = w / 640;
        if (scale > 0) {
          const rawFilling = (h - (960 * scale)) / scale / 3;
          filling = isSafeNumber(rawFilling) ? Math.max(0, rawFilling) : 0;
        } else {
          filling = 0;
        }
        const safePaddingTop = isSafeNumber(filling) ? Math.floor(filling) + 42 : 42;
        const safePaddingBottom = isSafeNumber(filling) ? Math.max(0, Math.floor(filling)) : 0;
        const safeMarginTop = isSafeNumber(filling) ? Math.floor(-480 - (filling * 1.5)) : -480;
        css = {
          paddingTop: safePaddingTop,
          paddingBottom: safePaddingBottom,
          marginTop: safeMarginTop,
        };
      }
      if (!isSafeNumber(scale) || scale <= 0) {
        scale = 1;
      }
      const transformKey = transform || 'transform';
      css[transformKey] = `scale(${scale})`;
      css.transformOrigin = 'center center';
      css.WebkitTransformOrigin = 'center center';
      return css;
    })();

    return (
      <div
        className={style.app}
        style={size}
      >
        <div className={classnames({ [style.rect]: true, [style.drop]: this.props.drop })}>
          <Decorate />
          <div className={style.screen}>
            <div className={style.panel}>
              <Matrix
                matrix={this.props.matrix}
                cur={this.props.cur}
                reset={this.props.reset}
              />
              <Logo cur={!!this.props.cur} reset={this.props.reset} />
              <div className={style.state}>
                <Point cur={!!this.props.cur} point={this.props.points} max={this.props.max} />
                <p>{ this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan] }</p>
                <NumberDisplay number={this.props.cur ? this.props.clearLines : this.props.startLines} />
                <p>{i18n.level[lan]}</p>
                <NumberDisplay
                  number={this.props.cur ? this.props.speedRun : this.props.speedStart}
                  length={1}
                />
                <p>{i18n.next[lan]}</p>
                <Next data={this.props.next} />
                <div className={style.bottom}>
                  <Music data={this.props.music} />
                  <Pause data={this.props.pause} />
                  <NumberDisplay time />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Keyboard filling={filling} keyboard={this.props.keyboard} />
      </div>
    );
  }
}

App.propTypes = {
  music: propTypes.bool.isRequired,
  pause: propTypes.bool.isRequired,
  matrix: propTypes.object.isRequired,
  next: propTypes.string.isRequired,
  cur: propTypes.object,
  dispatch: propTypes.func.isRequired,
  speedStart: propTypes.number.isRequired,
  speedRun: propTypes.number.isRequired,
  startLines: propTypes.number.isRequired,
  clearLines: propTypes.number.isRequired,
  points: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  reset: propTypes.bool.isRequired,
  drop: propTypes.bool.isRequired,
  keyboard: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pause: state.get('pause'),
  music: state.get('music'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
});

export default connect(mapStateToProps)(App);
