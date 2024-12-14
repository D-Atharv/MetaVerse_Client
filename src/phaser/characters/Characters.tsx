interface Boundaries {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export default class Ship extends Phaser.GameObjects.Image {
  private speed: number; // Encapsulate speed as a property

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    speed: number
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this); // Add the ship to the scene
    this.speed = speed; // Initialize speed
  }

  // Set the scale of the ship
  public setShipScale(scale: number): void {
    this.setScale(scale);
  }

  // Move the ship based on cursor input and enforce boundaries
  public move(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    boundaries: Boundaries
  ): void {
    if (cursors.left?.isDown && this.x > boundaries.left) {
      this.x -= this.speed; 
    }
    if (cursors.right?.isDown && this.x < boundaries.right) {
      this.x += this.speed; 
    }
    if (cursors.up?.isDown && this.y > boundaries.top) {
      this.y -= this.speed; 
    }
    if (cursors.down?.isDown && this.y < boundaries.bottom) {
      this.y += this.speed; 
    }
  }
}
