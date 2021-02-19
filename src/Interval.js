import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'

export default class Interval extends React.Component{
    render(){
        return(
            <div className='interval'>
                <div className='title' id={this.props.timerId}>
                    {this.props.title}
                </div>
                <div  className='time'id={this.props.lengthId}>
                    {this.props.length}
                </div>
                <div className='time-controls'>
                <button
                    id={this.props.decrementId}
                    onClick={this.props.onClick}
                    value="-"
                >
                    <FontAwesomeIcon icon={faArrowDown}/>
                </button>
                <button
                    id={this.props.incrementId}
                    onClick={this.props.onClick}
                    value="+"
                 >
                     <FontAwesomeIcon icon={faArrowUp}/>
                </button>
                </div>
            </div>
        )
    }
}