/*
Initial steps
We are using two canvases here, one canvas for pen strokes and eraser, the other for marker strokes
The marker canvas is placed above the pen canvas with its opacity set to 50% and the initial visibility of the canvas is hidden
On component mount we set the context of both canvases and set their respective heights and widths to be that of the window. 
By default when user tries to make a stroke we make him use a pen of thickness 3px. The user can choose to change the thickness of the pen by clicking on the
pen and selecting the desired thickness.
When user selects the marker we make the marker canvas visible and make marker strokes of this canvas and ignoring mouse move events on the pen canvas.
Since the opacity of the canvas is 50% and background is transparent we see marker strokes on top of the pen strokes with opacity.
We want to remove the marker strokes every time a new stroke is made for this we set new marker canvas context everytime user make a new stroke with marker or a pen or a eraser.
We finally add an ability to change the colors from the color palette. We just set the color of the marker as well as pen when the new color is chosen.

*/
import React from "react";
import "./App.css";
import Board from "./Board.js";
import Marker from "./Marker.js";
import { Colors, Tools } from "./Tools.js";
import ErrorBoundary from "./ErrorBoundary.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.toolSelect = this.toolSelect.bind(this);
    this.colorSelect = this.colorSelect.bind(this);
    this.showToolThickness = this.showToolThickness.bind(this);
    this.brushSizeSelect = this.brushSizeSelect.bind(this);
  }
  /* Setting context for main canvas*/
  createCanvas = () => {
    if (!(this.context instanceof CanvasRenderingContext2D)) {
      this.context = this.myboard.getContext("2d");
      this.myboard.height = window.innerHeight;
      this.myboard.width = window.innerWidth;
    }
  };

  /* Setting context for marker context*/
  setMarkerContext = () => {
    this.markerContext = this.markerBoard.getContext("2d");
    this.markerBoard.height = window.innerHeight;
    this.markerBoard.width = window.innerWidth;
  };

  componentDidMount() {
    this.createCanvas();
    this.setMarkerContext();
  }

  /* setting brush size for pen */
  brushSizeSelect = (thickness) => {
    this.brushThickness = thickness;
    this.hideToolThickness();
  };

  /* setting color for pen and marker*/
  colorSelect = (penColor, e) => {
    this.hideToolThickness();
    this.pencolor = penColor;
  };

  /* hiding the brush thickness selector */
  hideToolThickness = () => {
    let circleContainer = document.getElementById("circle-container");
    circleContainer.style.visibility = "hidden";
  };

  /* showing the brush thickness selector */
  showToolThickness = () => {
    let circleContainer = document.getElementById("circle-container");
    circleContainer.style.visibility = "visible";
  };

  /* on selecting pen/eraser/marker */
  toolSelect = (tool, e) => {
    this.hideToolThickness();
    this.tool = tool;
    if (this.tool === "marker") {
      this.showMarker = true;
      this.markerBoard.style.visibility = "visible";
    } else {
      this.showMarker = false;
      if (tool === "pen") this.showToolThickness();
      //this.markerBoard.style.visibility = "hidden";
    }
  };

  /* JSX to render Color palette*/
  renderColorPalette = () => {
    let colorBlocks = Colors.map((eachColor) => {
      return (
        <>
          <div
            key={eachColor.color}
            className="color-block"
            style={{ backgroundColor: eachColor.color }}
            onClick={() => this.colorSelect(eachColor.color)}
          ></div>
          <div className={"pen-thickness"}>{eachColor.color}</div>
        </>
      );
    });
    return <div className="color-palette">{colorBlocks}</div>;
  };

  /* JSX to render pen, marker and eraser tools*/
  renderBrushes = () => {
    let tools = Tools.map((eachTool) => {
      return (
        <>
          <div
            key={eachTool.tool}
            className="tool-box"
            onClick={() => this.toolSelect(eachTool.tool)}
          >
            <img className="tool" src={eachTool.src} />
          </div>
          <div className={"pen-thickness"}>{eachTool.tool}</div>
          {eachTool.tool === "pen" && (
            <div className="brush-container">{this.renderBrushSize()}</div>
          )}
        </>
      );
    });
    return <div className="tools-container">{<>{tools}</>}</div>;
  };

  /*JSX to render brush thickness widget */
  renderBrushSize = () => {
    let arr = [0, 0, 0];
    let circles = arr.map((_, index) => {
      let width = `${(index + 1) * 4}px`;
      let val = 2 * index + 1;
      return (
        <div
          style={{ width: width, height: width }}
          className="circle"
          onClick={() => this.brushSizeSelect(val)}
        />
      );
    });
    return (
      <div id="circle-container" className="circle-container">
        {circles}
      </div>
    );
  };

  /* Calculating the exact canvas coordinates using its offset values */
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

  //start writing with pen or start erasing
  startBrush = (e) => {
    if (this.showMarker) return;
    this.createCanvas();
    this.drawing = true;
    this.draw(e);
  };

  /* stop writing with pen or stop erasing*/
  stopBrush = (e) => {
    if (this.showMarker) return;
    this.drawing = false;
    this.context.beginPath();
  };

  makeStroke = (e, context, brushThickness, lineCap, color) => {
    let { X, Y } = this.getCanvasCoordinates(e);
    context.lineWidth = brushThickness;
    context.lineCap = lineCap;
    context.strokeStyle = color;
    context.lineTo(X, Y);
    context.stroke();
    context.beginPath();
    context.moveTo(X, Y);
  };

  /* this is called when we are draging the mouse to erase the contents of the canvas*/
  erase = (e) => {
    this.makeStroke(e, this.context, 25, "round", "white");
  };

  /* this is called when we are dragging the mouse with marker selected */
  drawUsingMarker = (e) => {
    if (!this.showMarker) return;
    const color = this.pencolor || "black";
    this.makeStroke(e, this.markerContext, 20, "square", color);
  };

  /* this is called when we are draging the mouse with pen selected*/
  drawUsingPen = (e) => {
    const brushThickness = this.brushThickness || 3;
    const color = this.pencolor || "black";
    this.makeStroke(e, this.context, brushThickness, "round", color);
  };

  /*decides whether draging the mouse should cause erase or pen write based on the tool chosen */
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

  /* called when user stops using marker*/
  stopMarker = (e) => {
    if (!this.showMarker) return;
    this.markerDrawing = false;
    this.markerContext.beginPath();
  };

  /* called when we are drawing with marker*/
  markerDraw = (e) => {
    if (!this.showMarker) return;
    if (!this.markerDrawing) return;
    this.drawUsingMarker(e);
  };

  /* called when we start using marker*/
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
      <ErrorBoundary>
        <div className="App">
          <div className="side-bar">
            {this.renderBrushes()}
            {this.renderColorPalette()}
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
      </ErrorBoundary>
    );
  }
}
