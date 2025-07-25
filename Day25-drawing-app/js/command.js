export class DrawCommand {
  constructor(points, context, color = 'black') {
    this.points = points; // Array of {x, y}
    this.context = context;
    this.color = color;
  }

  execute() {
    const ctx = this.context;
    if (this.points.length < 2) return;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.stroke();
  }
}
