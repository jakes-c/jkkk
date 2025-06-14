export default class Breakable {
  constructor(x, y, width = 32, height = 32) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.broken = false;
  }

  draw(context) {
    if (!this.broken) {
      context.fillStyle = "#b5651d";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  onHit(byPlayer = true) {
    if (byPlayer && !this.broken) {
      this.broken = true;
      // Add sound or animation here if needed
    }
  }
}