import React from 'react';
import './App.css';
import Board from './Board.js';
import {Colors} from './Colors.js';

export default class App extends React.Component{
  constructor(props){
    super(props);
    //this.myboard = React.createRef();
  }

  createCanvas = () => {
    this.context = this.myboard.getContext("2d");
    this.myboard.height = window.innerHeight;
    this.myboard.width = window.innerWidth;
  }

  componentDidMount(){
    this.createCanvas();
  };

  colorSelect = (penColor, e) => {
    this.pencolor = penColor;
  }

  renderColorPalette = () =>{
    let colorBlocks = Colors.map((eachColor)=>{
      return <div className="color-block" style={{backgroundColor: eachColor.color}} onClick={this.colorSelect.bind(this, eachColor.color)}></div>
    })
    return <div className="color-palette">{colorBlocks}</div>
  }

  // drawingCanvas = ref => {
	// 	this.myboard = ref;
  // };
  
  startBrush = (e) => {
    this.drawing = true;
    this.draw(e);
  }

  stopBrush = (e) => {
    this.drawing = false;
    this.context.beginPath();
  }

  draw = (e)=>{
    if(!this.drawing)return;
        this.context.lineWidth = 10;
        this.context.lineCap = "round";
        this.context.strokeStyle = this.pencolor || 'black';
        this.context.lineTo(e.clientX, e.clientY);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(e.clientX, e.clientY);
  }

  //<canvas ref={this.drawingCanvas} className="board" onMouseMove={this.draw} onMouseUp={this.stopBrush} onMouseDown={this.startBrush}>
       // </canvas>

  render(){
    return (
      <div className="App">
          {this.renderColorPalette()}
        <div className="canvas-container">
        <Board inputRef={el => this.myboard = el} onMouseMove={this.draw} onMouseUp={this.stopBrush} onMouseDown={this.startBrush}/>
        </div>
      </div>
    );
  }
};
