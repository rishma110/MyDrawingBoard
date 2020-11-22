import React from "react";
import "./Board.css";

export default class Board extends React.Component {
  render() {
    return (
      <canvas
        className="marker"
        ref={this.props.highlighterRef}
        onMouseMove={this.props.onMarkerMouseMove}
        onMouseUp={this.props.onMarkerMouseUp}
        onMouseDown={this.props.onMarkerMouseDown}
      />
    );
  }
}
