import React from 'react'
import Interval from './Interval'
import Timer from './Timer'
import './App.css';

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      brkLength: 5,
      seshLength: 25,
      isRunning: false,
      timerType: 'Session',
      timer: 1500,
      interval: null,
    }
  }
  setBrkLength(time) {
    this.handleLength(
      'brkLength',
      time,
      this.state.brkLength,
      'Break'
    );
  }

  setSeshLength(time) {
    this.handleLength(
      'seshLength',
      time,
      this.state.seshLength,
      'Session'
    );
  }

  handleLength(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === 'running') {
      return;
    }
    if (this.state.timerType !== timerType) {
      console.log(timerType)
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

  handleTimer(){
    if(this.state.isRunning){
      clearInterval(this.interval);
      this.setState({ isRunning: false });
    }else{
      this.setState({ isRunning: true });
      this.interval = setInterval(()=> {
        if(this.state.timer <= 0){
          if (this.state.interval) {
            this.state.interval.cancel();
          }
          this.audioBeep.play();
          this.setState({
            timerType: this.state.timerType === "Session" 
            ? "Break" 
            : "Session",
            timer: (this.state.timerType === "Session") 
              ? (this.state.brkLength * 60) 
              : (this.state.seshLength * 60),

          })
        }else{
          this.setState({timer : this.state.timer - 1})
      }}, 1000);
    }
  }
  
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  reset() {
    this.setState({
      brkLength: 5,
      seshLength: 25,
      isRunning: false,
      timerType: 'Session',
      timer: 1500,
      interval: null,
    });
    this.componentWillUnmount()
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render(){
    console.log(this.state.timer)
    console.log(this.state.intervalID)
    return (
      <div className='App'>
        <h1 className='header'>25 + 5 Clock</h1>
        <div className='timer'>
          <div className='face'>
            <Timer
              type={this.state.timerType}
              countDown={this.clockify()}
              onClickStart={()=>{this.handleTimer()}}
              onClickReset={()=>{this.reset()}}
            />
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


