let balls = [];
let worldRadius;

function setup() {
  createCanvas(700, 500, WEBGL);

  // this is the size of the world (invisible sphere)
  worldRadius = width / 2;

  // making 5 balls 
  for (let i = 0; i < 5; i++) {
    let startRadius = random(18, 28);

    // random starting position
    let startPos = createVector(
      random(-110, 110),
      random(-110, 110),
      random(-110, 110)
    );

    // this part is for so  they dont start in centre
    while (startPos.mag() < 60) {
      startPos = createVector(
        random(-110, 110),
        random(-110, 110),
        random(-110, 110)
      );
    }

    // random movement
    let startVel = createVector(
      random(-2.2, 2.2),
      random(-2.2, 2.2),
      random(-2.2, 2.2)
    );

    balls.push(new Ball(startPos, startVel, startRadius, i));
  }
}

function draw() {
  
  background(150, 195, 220);

  
  ambientLight(90);

  // moving light using sin and cos
  let lightX = sin(frameCount * 0.02);
  let lightZ = cos(frameCount * 0.02);
  directionalLight(255, 255, 255, lightX, -0.3, lightZ);

  // small rotation so it looks 3D
  rotateY(frameCount * 0.0015);

  // draw centre object (this is my surprise part)
  drawCentreObject();

  // move balls
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].detectEdge();
  }

  // check collisions between balls
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j]);
    }
  }

  // draw balls
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
  }
}


// this is the surprise part
// i added a small ball in the middle

function drawCentreObject() {
  push();
  noStroke();
  fill(255, 210, 120);
  sphere(15);
  pop();
}


class Ball {
  constructor(position, velocity, radius, index) {
    this.pos = position;
    this.vel = velocity;
    this.r = radius;

    // colours from my country flag (Afghanistan)
    // black red green
    let colourOptions = [
      [0, 0, 0],
      [200, 20, 20],
      [0, 140, 0]
    ];

    this.col = colourOptions[index % colourOptions.length];
  }

  // move ball
  move() {
    this.pos.add(this.vel);

    
    this.vel.x += random(-0.05, 0.05);
    this.vel.y += random(-0.05, 0.05);
    this.vel.z += random(-0.05, 0.05);

    this.vel.limit(3);
  }

  // draw ball
  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.col[0], this.col[1], this.col[2]);
    sphere(this.r);
    pop();
  }

  // edge check (keep balls inside sphere world)
  detectEdge() {
    let d = this.pos.mag();

    // if ball goes outside
    if (d + this.r > worldRadius) {
      let normal = this.pos.copy();

      if (normal.mag() === 0) {
        normal = createVector(1, 0, 0);
      }

      normal.normalize();

      // move it back inside
      this.pos = normal.copy().mult(worldRadius - this.r);

      // bounce back
      this.vel.mult(-1);
    }
  }

  // collision between balls
  checkCollision(other) {
    let d = p5.Vector.dist(this.pos, other.pos);
    let minDist = this.r + other.r;

    if (d < minDist) {
      let dir = p5.Vector.sub(this.pos, other.pos);

      // if same spot fix
      if (dir.mag() === 0) {
        dir = createVector(random(-1,1), random(-1,1), random(-1,1));
      }

      dir.normalize();

      // stop balls going inside each other
      let overlap = minDist - d;
      dir.mult(overlap / 2);

      this.pos.add(dir);
      other.pos.sub(dir);

      // simple bounce
      let temp = this.vel.copy();
      this.vel = other.vel.copy();
      other.vel = temp;

      // surprise extra
      // balls change size a bit when they hit
      this.r += random(-1, 1);
      other.r += random(-1, 1);

      this.r = constrain(this.r, 15, 34);
      other.r = constrain(other.r, 15, 34);
    }
  }
}



/*

REFERENCES (used for code)


p5.js createVector (for position and velocity)
https://p5js.org/reference/p5/createVector/

p5.js p5.Vector (for distance, normalize, etc)
https://p5js.org/reference/p5/p5.Vector/

p5.js sphere (for drawing balls)
https://p5js.org/reference/p5/sphere/

p5.js ambientLight
https://p5js.org/reference/p5/ambientLight/

p5.js directionalLight
https://p5js.org/reference/p5/directionalLight/

p5.js sin and cos (used for moving light)
https://p5js.org/reference/p5/sin/

general p5.js reference
https://p5js.org/reference/


JavaScript constructor
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor

*/