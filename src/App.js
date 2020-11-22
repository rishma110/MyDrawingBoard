import React from "react";
import "./App.css";
import Board from "./Board.js";
import Marker from "./Marker.js";
import { Colors, Tools } from "./Tools.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMarker: false,
    };
  }

  createCanvas = () => {
    this.context = this.myboard.getContext("2d");
    this.myboard.height = window.innerHeight;
    this.myboard.width = window.innerWidth;
  };

  componentDidMount() {
    this.createCanvas();
  }

  colorSelect = (penColor, e) => {
    this.pencolor = penColor;
  };

  toolSelect = (tool, e) => {
    this.tool = tool;
    this.setState(
      {
        showMarker: tool === "marker",
      },
      () => {
        console.log(this.context);
        if (this.state.showMarker) {
          this.setMarkerContext();
        } else {
          this.markerContext = null;
        }
      }
    );
  };

  renderColorPalette = () => {
    let colorBlocks = Colors.map((eachColor) => {
      return (
        <div
          className="color-block"
          style={{ backgroundColor: eachColor.color }}
          onClick={this.colorSelect.bind(this, eachColor.color)}
        ></div>
      );
    });
    return <div className="color-palette">{colorBlocks}</div>;
  };

  renderBrushes = () => {
    let tools = Tools.map((eachTool) => {
      return (
        <div
          className="tool-box"
          onClick={this.toolSelect.bind(this, eachTool.tool)}
        >
          <img className="tool" src={eachTool.src} />
        </div>
      );
    });
    return <div class="tools-container">{tools}</div>;
  };

  getCanvasCoordinates = (e) => {
    let offsetX = this.state.showMarker
      ? this.markerBoard.getBoundingClientRect().left
      : this.myboard.getBoundingClientRect().left;
    let offsetY = this.state.showMarker
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
    if (this.state.showMarker) return;
    this.drawing = true;
    this.draw(e);
  };

  stopBrush = (e) => {
    if (this.state.showMarker) return;
    this.drawing = false;
    this.context.beginPath();
  };

  erase = (e) => {
    let { X, Y } = this.getCanvasCoordinates(e);
    this.context.lineWidth = 10;
    this.context.lineCap = "round";
    this.context.globalAlpha = 1;
    this.context.strokeStyle = "white";
    this.context.lineTo(X, Y);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(X, Y);
  };

  drawUsingMarker = (e) => {
    let { X, Y } = this.getCanvasCoordinates(e);
    this.markerContext.lineWidth = 5;
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
    if (!this.drawing || this.state.showMarker) return;
    switch (this.tool) {
      case "eraser":
        return this.erase(e);
      case "pen":
      default:
        return this.drawUsingPen(e);
    }
  };

  stopMarker = (e) => {
    if (this.tool === "marker") {
      this.drawing = false;
      this.markerContext.beginPath();
    }
  };

  markerDraw = (e) => {
    if (!this.markerContext) {
      this.setMarkerContext();
    }
    if (this.tool === "marker") {
      this.drawUsingMarker(e);
    }
  };

  setMarkerContext = () => {
    if (!this.markerContext) {
      this.markerContext = this.markerBoard.getContext("2d");
      this.markerBoard.height = window.innerHeight;
      this.markerBoard.width = window.innerWidth;
    }
  };

  startMarker = (e) => {
    if (!this.markerContext) {
      this.setMarkerContext();
    }
    if (this.tool === "marker") {
      this.drawing = true;
      this.markerDraw(e);
    }
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state.showMarker !== nextState.showMarker;
  // }
  render() {
    return (
      <div className="App">
        {this.renderColorPalette()}
        {this.renderBrushes()}
        <div className="canvas-container">
          <Board
            inputRef={(el) => (this.myboard = el)}
            onMouseMove={this.draw}
            onMouseUp={this.stopBrush}
            onMouseDown={this.startBrush}
          />
          {this.state.showMarker && (
            <Marker
              highlighterRef={(el) => (this.markerBoard = el)}
              onMarkerMouseMove={this.markerDraw}
              onMarkerMouseUp={this.stopMarker}
              onMarkerMouseDown={this.startMarker}
            />
          )}
        </div>
      </div>
    );
  }
}
