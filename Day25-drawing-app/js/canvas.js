import { DrawCommand } from './command.js';

export class CanvasManager {
  constructor(canvas, ctx, history) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.history = history;
    this.drawing = false;
    this.currentPath = [];

    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
  }

  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  startDrawing(event) {
    this.drawing = true;
    this.currentPath = [this.getMousePos(event)];
  }

  draw(event) {
    if (!this.drawing) return;
    const pos = this.getMousePos(event);
    this.currentPath.push(pos);

    // Live preview
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'black';
    this.ctx.beginPath();
    const prev = this.currentPath[this.currentPath.length - 2];
    this.ctx.moveTo(prev.x, prev.y);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (!this.drawing) return;
    this.drawing = false;

    const cmd = new DrawCommand([...this.currentPath], this.ctx);
    this.history.executeCommand(cmd);
    this.currentPath = [];
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
