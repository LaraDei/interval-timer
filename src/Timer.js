import React from 'react'

export default class Timer extends React.Component{
    render(){
        return(
            <div className='Timer'>
                <div id="timer-label">{this.props.type}</div>
                <div id="time-left">{this.props.countDown}</div>
            </div>
            
        )
    }
}