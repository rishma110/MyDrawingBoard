//functional canvas component that is used to display marker strokes
import React from "react";
import "./Board.css";

const Marker = (props) => {
  return (
    <canvas
      className="marker"
      ref={props.highlighterRef}
      onMouseMove={props.onMarkerMouseMove}
      onMouseUp={props.onMarkerMouseUp}
      onMouseDown={props.onMarkerMouseDown}
    />
  );
};

export default Marker;
