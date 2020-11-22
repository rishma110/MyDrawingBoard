import React from "react";
import "./Board.css";

export default class Board extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <canvas
        className="board"
        ref={this.props.inputRef}
        onMouseMove={this.props.onMouseMove}
        onMouseUp={this.props.onMouseUp}
        onMouseDown={this.props.onMouseDown}
      />
    );
  }
}
