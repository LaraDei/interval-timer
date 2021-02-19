import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPause, faRedoAlt, faPlay } from '@fortawesome/free-solid-svg-icons'

export default class Timer extends React.Component{
    render(){
        return(
            <div className='Timer'>
                <div id="timer-label">{this.props.type}</div>
                <div id="time-left">{this.props.countDown}</div>
                <div className='controls'>
                <button id='start_stop' onClick={this.props.onClickStart}>
                    <FontAwesomeIcon icon={faPlay}/>
                    {' '}/{' '}
                    <FontAwesomeIcon icon={faPause}/>
                </button>
                <button id='reset' onClick={this.props.onClickReset}>
                    <FontAwesomeIcon icon={faRedoAlt}/> 
                </button>
            </div>
            </div>
            
        )
    }
}