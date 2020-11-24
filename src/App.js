import React from "react";
import "./App.css";
import Board from "./Board.js";
import Marker from "./Marker.js";
import { Colors, Tools } from "./Tools.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.toolSelect = this.toolSelect.bind(this);
    this.colorSelect = this.colorSelect.bind(this);
  }

  createCanvas = () => {
    if (!(this.context instanceof CanvasRenderingContext2D)) {
      this.context = this.myboard.getContext("2d");
      this.myboard.height = window.innerHeight;
      this.myboard.width = window.innerWidth;
    }
  };

  setMarkerContext = () => {
    this.markerContext = this.markerBoard.getContext("2d");
    this.markerBoard.height = window.innerHeight;
    this.markerBoard.width = window.innerWidth;
  };

  componentDidMount() {
    this.createCanvas();
    this.setMarkerContext();
  }

  colorSelect = (penColor, e) => {
    this.pencolor = penColor;
  };

  toolSelect = (tool, e) => {
    this.tool = tool;
    if (this.tool === "marker") {
      this.showMarker = true;
      this.markerBoard.style.visibility = "visible";
    } else {
      this.showMarker = false;
      //this.markerBoard.style.visibility = "hidden";
    }
  };

  renderColorPalette = () => {
    let colorBlocks = Colors.map((eachColor) => {
      return (
        <div
          key={eachColor.color}
          className="color-block"
          style={{ backgroundColor: eachColor.color }}
          onClick={() => this.colorSelect(eachColor.color)}
        ></div>
      );
    });
    return <div className="color-palette">{colorBlocks}</div>;
  };

  renderBrushes = () => {
    let tools = Tools.map((eachTool) => {
      return (
        <div
          key={eachTool.tool}
          className="tool-box"
          onClick={() => this.toolSelect(eachTool.tool)}
        >
          <img className="tool" src={eachTool.src} />
        </div>
      );
    });
    return <div className="tools-container">{tools}</div>;
  };

  getCanvasCoordinates = (e) => {
    let offsetX = this.showMarker
      ? this.markerBoard.getBoundingClientRect().left
      : this.myboard.getBoundingClientRect().left;
    let offsetY = this.showMarker
      ? this.markerBoard.getBoundingClientRect().top
      : this.myboard.getBoundingClientRect().top;
    let X = e.clientX - offsetX;
    let Y = e.clientY - offsetY;
    return {
      X,
      Y,
    };
  };

  startBrush = (e) => {
    if (this.showMarker) return;
    this.createCanvas();
    this.drawing = true;
    this.draw(e);
  };

  stopBrush = (e) => {
    if (this.showMarker) return;
    this.drawing = false;
    this.context.beginPath();
  };

  erase = (e) => {
    let { X, Y } = this.getCanvasCoordinates(e);
    this.context.lineWidth = 25;
    this.context.lineCap = "round";
    this.context.globalAlpha = 1;
    this.context.strokeStyle = "white";
    this.context.lineTo(X, Y);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(X, Y);
  };

  drawUsingMarker = (e) => {
    if (!this.showMarker) return;
    let { X, Y } = this.getCanvasCoordinates(e);
    this.markerContext.lineWidth = 20;
    this.markerContext.lineCap = "square";
    this.markerContext.globalCompositeOperation = "source-over";
    this.markerContext.strokeStyle = this.pencolor || "black";
    this.markerContext.lineTo(X, Y);
    this.markerContext.stroke();
    this.markerContext.beginPath();
    this.markerContext.moveTo(X, Y);
  };

  drawUsingPen = (e) => {
    let { X, Y } = this.getCanvasCoordinates(e);
    this.context.lineWidth = 3;
    this.context.lineCap = "round";
    this.context.globalAlpha = 1;
    this.context.strokeStyle = this.pencolor || "black";
    this.context.lineTo(X, Y);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(X, Y);
  };

  draw = (e) => {
    if (!this.drawing || this.showMarker) return;
    switch (this.tool) {
      case "eraser":
        return this.erase(e);
      case "pen":
      default:
        return this.drawUsingPen(e);
    }
  };

  stopMarker = (e) => {
    if (!this.showMarker) return;
    this.markerDrawing = false;
    this.markerContext.beginPath();
  };

  markerDraw = (e) => {
    if (!this.showMarker) return;
    if (!this.markerDrawing) return;
    this.drawUsingMarker(e);
  };

  startMarker = (e) => {
    if (!this.showMarker) {
      this.markerBoard.style.visibility = "hidden";
      this.startBrush(e);
    }
    this.markerContext = null;
    this.setMarkerContext();
    this.markerDrawing = true;
    this.markerDraw(e);
  };

  render() {
    return (
      <div className="App">
        <div className="side-bar">
          {this.renderColorPalette()}
          {this.renderBrushes()}
        </div>
        <div className="canvas-container">
          <Board
            inputRef={(el) => (this.myboard = el)}
            onMouseMove={this.draw}
            onMouseUp={this.stopBrush}
            onMouseDown={this.startBrush}
          />
          <Marker
            highlighterRef={(el) => (this.markerBoard = el)}
            onMarkerMouseMove={this.markerDraw}
            onMarkerMouseUp={this.stopMarker}
            onMarkerMouseDown={this.startMarker}
          />
        </div>
      </div>
    );
  }
}

//TO-DOs
//componentdidcatch
//errorboundaries
//comments
