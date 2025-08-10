import React from "react";

const Tile = ({ tile, onClick }) => {
  return (
    <div
      className={`tile ${tile.flipped || tile.matched ? 'flipped' : ''} ${tile.matched ? 'matched' : ''}`}
      onClick={() => onClick(tile)}
    >
      <div className="tile-inner">
        <div className="tile-front">
          <img src={tile.image} alt={tile.name} />
          <div className="fruit-name">{tile.name}</div>
        </div>
        <div className="tile-back">
          <span>?</span>
        </div>
      </div>
    </div>
  );
};

export default Tile;
