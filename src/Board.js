import React from 'react';
import './Board.css';

export default class Board extends React.Component{
    render(){
        return (<canvas className="board" ref={this.props.inputRef} onMouseMove={this.props.onMouseMove} onMouseUp={this.props.onMouseUp} onMouseDown={this.props.onMouseDown}></canvas>)
    }
}
