import React from 'react'
import Interval from './Interval'
import Timer from './Timer'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPause, faRedoAlt, faPlay } from '@fortawesome/free-solid-svg-icons'
import './App.css';

export default class App extends React.Component{
  constructor(){
    super()
    this.state = {
      brkLength: 5,
      seshLength: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
    }
  }
  setBrkLength(time) {
    console.log(time)
    this.lengthControl(
      'brkLength',
      time,
      this.state.brkLength,
      'Session'
    );
  }

  setSeshLength(time) {
    this.lengthControl(
      'seshLength',
      time,
      this.state.seshLength,
      'Break'
    );
  }

  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === 'running') {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === '-' && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === '+' && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === '-' && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60
      });
    } else if (sign === '+' && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60
      });
    }
  }

  clockify() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }

  timerControl() {
    if (this.state.timerState === 'stopped') {
      this.beginCountDown();
      this.setState({ timerState: 'running' });
    } else {
      this.setState({ timerState: 'stopped' });
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  }

  beginCountDown() {
    this.setState({
      intervalID: this.accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000)
    });
  }

  accurateInterval(fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function () {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function () {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel
    };
  };

  decrementTimer() {
    this.setState({ timer: this.state.timer - 1 });
  }

  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      if (this.state.timerType === 'Session') {
        this.beginCountDown();
        this.switchTimer(this.state.brkLength * 60, 'Break');
      } else {
        this.beginCountDown();
        this.switchTimer(this.state.seshLength * 60, 'Session');
      }
    }
  }

  warning(_timer) {
    if (_timer < 61) {
      this.setState({ alarmColor: { color: '#a50d0d' } });
    } else {
      this.setState({ alarmColor: { color: 'white' } });
    }
  }
  buzzer(_timer) {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  }

  switchTimer(num, str) {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: 'white' }
    });
  }


  reset() {
    this.setState({
      brkLength: 5,
      seshLength: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' }
    });
    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render(){
    return (
      <div className='App'>
        <h1 className='header'>25 + 5 Clock</h1>
        <div className='timer'>
          <div className='face'>
            <Timer
              type={this.state.timerType}
              countDown={this.clockify()}
            />
            <div className='controls'>
              <button id='start_stop' onClick={()=>{this.timerControl()}}>
                <FontAwesomeIcon icon={faPlay}/>
                {' '}/{' '}
                <FontAwesomeIcon icon={faPause}/>
              </button>
              <button id='reset' onClick={()=>{this.reset()}}>
                <FontAwesomeIcon icon={faRedoAlt}/> 
              </button>
            </div>
          </div>
          <div className='setup'>
            <Interval
              incrementId='break-increment'
              length={this.state.brkLength}
              lengthId='break-length'
              decrementId='break-decrement'
              onClick={(e)=>{this.setBrkLength(e.currentTarget.value)}}
              title='Break Length' 
              timerId='break-label'
            />
            <Interval
              incrementId='session-increment'
              length={this.state.seshLength}
              lengthId='session-length'
              decrementId='session-decrement'
              onClick={(e)=>{this.setSeshLength(e.currentTarget.value)}}
              title='Session Length'
              timerId='session-label'
            />
          </div>
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    )
  }
}


