import { CanvasManager } from './canvas.js';
import { CommandHistory } from './history.js';

const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

const history = new CommandHistory();
const manager = new CanvasManager(canvas, ctx, history);

document.getElementById('undo').addEventListener('click', () => {
  history.undo(ctx, () => manager.clearCanvas());
});

document.getElementById('redo').addEventListener('click', () => {
  history.redo();
});

document.getElementById('clear').addEventListener('click', () => {
  manager.clearCanvas();
  history.clear();
});
