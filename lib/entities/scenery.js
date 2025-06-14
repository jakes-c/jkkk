import Entity from './entity';
import Sprite from './sprite';

class Ground extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 0, 16, 16);
    super('ground', sprite, xPos, yPos, width, height);
  }
}

class Pipe extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 180, 35, 35);

    super('pipe', sprite, xPos, yPos, width, height);
  }
}
class Brick extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 18, 18, 18);

    super('brick', sprite, xPos, yPos, width, height);
  }
}
class Shrub extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 198.5, 162.5, 53, 17);

    super('shrub', sprite, xPos, yPos, width, height);
  }
}

class Mountain extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 0, 90, 39);

    super('mountain', sprite, xPos, yPos, width, height);
  }
}

class SmallCloud extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 64.5, 0, 33, 24);

    super('cloud', sprite, xPos, yPos, width, height);
  }
}

class MediumCloud extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 24.5, 48, 24);

    super('cloud', sprite, xPos, yPos, width, height);
  }
}

class LargeCloud extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 0, 64, 24);

    super('cloud', sprite, xPos, yPos, width, height);
  }
}

class Flag extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 289, 153, 16, 27);

    super('flag', sprite, xPos, yPos, width, height);
  }
}

class Flagpole extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 289, 163, 16, 18);

    super('flag', sprite, xPos, yPos, width, height);
  }
}

class Castle extends Entity {
  constructor(tileset, xPos, yPos, width, height) {
    const sprite = new Sprite(tileset, 0, 0, 80, 80);

    super('flag', sprite, xPos, yPos, width, height);
  }
}

// --- Moving Platform (basic horizontal movement) ---
class MovingPlatform extends Entity {
  constructor(tileset, xPos, yPos, width, height, pathLength = 64, speed = 1) {
    // You can change the sprite below to match your asset
    const sprite = new Sprite(tileset, 0, 0, width, height);
    super('movingPlatform', sprite, xPos, yPos, width, height);
    this.pathLength = pathLength; // How far it moves back and forth
    this.speed = speed;
    this.startX = xPos;
    this.direction = 1;
    this.distanceMoved = 0;
  }

  update() {
    this.xPos += this.speed * this.direction;
    this.distanceMoved += Math.abs(this.speed);

    if (this.distanceMoved >= this.pathLength) {
      this.direction *= -1;
      this.distanceMoved = 0;
    }
  }
}

export {
  Ground,
  Pipe,
  Brick,
  Shrub,
  Mountain,
  SmallCloud,
  MediumCloud,
  LargeCloud,
  Flag,
  Flagpole,
  Castle,
  MovingPlatform, // <-- Added export for MovingPlatform
};