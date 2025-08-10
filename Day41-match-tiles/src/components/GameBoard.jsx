import React, { useState, useEffect } from "react";
import Tile from "./Tile";

import apple from "../assets/apple.jpg";
import banana from "../assets/banana.jpg";
import cherry from "../assets/cherry.jpg";
import orange from "../assets/orange.jpeg";

const tileImages = [
  { image: apple, name: "Apple" },
  { image: banana, name: "Banana" },
  { image: cherry, name: "Cherry" },
  { image: orange, name: "Orange" },
];

export default function GameBoard() {
  const [tiles, setTiles] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Shuffle and duplicate tiles
  const shuffleTiles = () => {
    const shuffled = [...tileImages, ...tileImages]
      .map((tile) => ({ ...tile, id: Math.random(), flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setFirstChoice(null);
    setSecondChoice(null);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setTimer(0);
    setGameStarted(false);
  };

  useEffect(() => {
    shuffleTiles();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const handleChoice = (tile) => {
    if (!gameStarted) setGameStarted(true);
    
    if (!disabled && !tile.flipped && !tile.matched) {
      if (!firstChoice) {
        setFirstChoice(tile);
        flipTile(tile.id);
      } else if (firstChoice.id !== tile.id) {
        setSecondChoice(tile);
        flipTile(tile.id);
        setMoves(prev => prev + 1);
      }
    }
  };

  const flipTile = (id) => {
    setTiles((prev) =>
      prev.map((tile) =>
        tile.id === id ? { ...tile, flipped: true } : tile
      )
    );
  };

  const resetChoices = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.image === secondChoice.image) {
        setTiles((prev) =>
          prev.map((tile) =>
            tile.image === firstChoice.image
              ? { ...tile, matched: true }
              : tile
          )
        );
        setMatches(prev => prev + 1);
        resetChoices();
      } else {
        setTimeout(() => {
          setTiles((prev) =>
            prev.map((tile) =>
              tile.id === firstChoice.id || tile.id === secondChoice.id
                ? { ...tile, flipped: false }
                : tile
            )
          );
          resetChoices();
        }, 800);
      }
    }
  }, [firstChoice, secondChoice]);

  // Check for game completion
  useEffect(() => {
    if (matches === tileImages.length) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [matches]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <h1>Fruit Memory Game</h1>
      
      <div className="controls">
        <button onClick={shuffleTiles}>New Game</button>
        <div className="score-display">Moves: {moves}</div>
      </div>
      
      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{formatTime(timer)}</div>
          <div className="stat-label">Time</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{moves}</div>
          <div className="stat-label">Moves</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{matches}/4</div>
          <div className="stat-label">Matches</div>
        </div>
      </div>
      
      <div className="grid">
        {tiles.map((tile) => (
          <Tile 
            key={tile.id} 
            tile={tile} 
            onClick={handleChoice} 
          />
        ))}
      </div>
      
      {gameWon && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Congratulations! 🎉</h2>
            <p>You completed the game in {moves} moves and {formatTime(timer)}!</p>
            <button onClick={shuffleTiles}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}