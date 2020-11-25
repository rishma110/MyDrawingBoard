//stateless functional componenet to display pen strokes and eraser movements on a canvas;
import "./Board.css";

const Board = (props) => {
  return (
    <canvas
      className="board"
      ref={props.inputRef}
      onMouseMove={props.onMouseMove}
      onMouseUp={props.onMouseUp}
      onMouseDown={props.onMouseDown}
    />
  );
};

export default Board;
