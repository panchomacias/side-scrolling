/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

// Declare variables
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables;
var canyons;
var trees;
var cloud;
var mountain;
var cameraPosX;
var flagpole;
var game_score;
var lives;

var platforms;

var enemies;

var jumpSound;

function preload() {
  soundFormats("mp3", "wav");

  jumpSound = loadSound("assets/jump.wav");
  jumpSound.setVolume(0.1);
}

function setup() {
  createCanvas(1024, 576);
  lives = 3;
  startGame();
}

function startGame() {
  floorPos_y = (height * 3) / 4;

  gameChar_x = width / 7;
  gameChar_y = floorPos_y;

  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  collectables = [
    { x_pos: 180, y_pos: floorPos_y - 100, isFound: false },
    { x_pos: 750, y_pos: floorPos_y - 100, isFound: false },
    { x_pos: 1200, y_pos: floorPos_y - 100, isFound: false },
    { x_pos: 1900, y_pos: floorPos_y - 100, isFound: false },
    { x_pos: 2500, y_pos: floorPos_y - 100, isFound: false },
    { x_pos: 3000, y_pos: floorPos_y - 150, isFound: false },
    { x_pos: 3500, y_pos: floorPos_y - 200, isFound: false },
    { x_pos: 4200, y_pos: floorPos_y - 150, isFound: false },
    { x_pos: 4800, y_pos: floorPos_y - 100, isFound: false },
  ];

  canyons = [
    { x_pos: 200, y_pos: 432, width: 120, height: 144 },
    { x_pos: 1000, y_pos: 432, width: 100, height: 144 },
    { x_pos: 1400, y_pos: 432, width: 100, height: 144 },
    { x_pos: 1800, y_pos: 432, width: 150, height: 144 },
    { x_pos: 2300, y_pos: 432, width: 180, height: 144 },
    { x_pos: 2800, y_pos: 432, width: 150, height: 144 },
    { x_pos: 3300, y_pos: 432, width: 200, height: 144 },
    { x_pos: 3900, y_pos: 432, width: 220, height: 144 },
    { x_pos: 4500, y_pos: 432, width: 240, height: 144 },
  ];

  trees = [];
  for (var x = 50; x <= 1300; x += 250) {
    var treeHeight = random(50, 120);
    var treeWidth = random(20, 35);
    var treeType = Math.floor(random(3));
    trees.push(createTree(x, floorPos_y, treeWidth, treeHeight, treeType));
    trees.push(createTree(50, floorPos_y, 25, 80, 0));
    trees.push(createTree(300, floorPos_y, 25, 80, 1));
    trees.push(createTree(550, floorPos_y, 25, 80, 2));
  }

  cloud = {
    x_pos: [
      50, 300, 600, 900, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400,
      4800,
    ],
    y_pos: 150,
    width: 100,
    height: 50,
    x_speed: 0.5,
  };

  mountain = {
    x_pos: [500, 700, 1150, 1800, 2400, 3100, 3800, 4500],
    y_pos: floorPos_y,
    width: 200,
    height: 200,
    color: [165, 42, 42],
  };

  platforms = [];
  for (var x = 50; x <= 850; x += 250) {
    var randomLength = random(50, 150);
    var randomHeight = random(floorPos_y - 50, floorPos_y - 100);
    platforms.push(createPlatforms(x, randomHeight, randomLength));
  }

  // Middle section - more challenging platforms
  platforms.push(createPlatforms(1800, floorPos_y - 100, 120));
  platforms.push(createPlatforms(2000, floorPos_y - 150, 100));
  platforms.push(createPlatforms(2200, floorPos_y - 200, 80));
  platforms.push(createMovingPlatform(2500, floorPos_y - 120, 100, 200, 1));

  // Staircase section
  platforms.push(createPlatforms(2900, floorPos_y - 80, 60));
  platforms.push(createPlatforms(3000, floorPos_y - 130, 60));
  platforms.push(createPlatforms(3100, floorPos_y - 180, 60));
  platforms.push(createPlatforms(3200, floorPos_y - 230, 60));

  // Final challenging section
  platforms.push(createMovingPlatform(3500, floorPos_y - 150, 80, 300, 1.5));
  platforms.push(createPlatforms(4000, floorPos_y - 120, 40));
  platforms.push(createMovingPlatform(4200, floorPos_y - 180, 60, 250, 2));
  platforms.push(createPlatforms(4400, floorPos_y - 200, 50));
  platforms.push(createPlatforms(4600, floorPos_y - 150, 60));
  platforms.push(createPlatforms(4800, floorPos_y - 100, 70));

  enemies = [];
  enemies.push(new Enemy(100, floorPos_y - 10, 100));
  // Early enemies - slower and less range
  enemies.push(new Enemy(400, floorPos_y - 10, 100, 0.5));
  enemies.push(new Enemy(800, floorPos_y - 10, 150, 0.7));

  // Middle section enemies - medium difficulty
  enemies.push(new Enemy(1500, floorPos_y - 10, 200, 1.0));
  enemies.push(new Enemy(2000, floorPos_y - 10, 250, 1.2));
  enemies.push(new Enemy(2500, floorPos_y - 130, 100, 1.0)); // On platform

  // Late enemies - faster and more range
  enemies.push(new Enemy(3000, floorPos_y - 10, 300, 1.5));
  enemies.push(new Enemy(3500, floorPos_y - 10, 250, 2.0));
  enemies.push(new Enemy(4000, floorPos_y - 10, 300, 2.5));
  enemies.push(new Enemy(4500, floorPos_y - 10, 350, 3.0));

  // Add checkpoints
  checkpoints = [
    { x_pos: 1500, isReached: false },
    { x_pos: 3000, isReached: false },
  ];

  cameraPosX = 0;

  flagpole = { x_pos: 5000, isReached: false };

  game_score = 0;
}

function draw() {
  cameraPosX = gameChar_x - width / 2;

  drawGrass();

  push();
  translate(-cameraPosX, 0);

  drawMountains();

  drawTrees();

  drawClouds();

  drawCollectable(collectables);

  checkCollectable(collectables);

  drawCanyon(canyons);

  checkCanyon(canyons);

  drawGameScore();

  drawFlagpole();

  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }

  if (flagpole.isReached == false) {
    checkFlagpole();
  }

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

    if (isContact) {
      if (lives > 0) {
        startGame();
        lives -= 1;
        break;
      }
    }
  }

  checkPlayerDie();

  for (var i = 0; i < collectables.length; i++) {
    if (!collectables[i].isFound) {
      drawCollectable(collectables[i]);
      checkCollectable(collectables[i]);
    }
  }

  for (var z = 0; z < canyons.length; z += 1) {
    drawCanyon(canyons[z]);
    checkCanyon(canyons[z]);
  }

  if (isLeft && isFalling) {
    fill(0);
    ellipse(gameChar_x, gameChar_y - 60, 15);
    fill(255);
    ellipse(gameChar_x - 5, gameChar_y - 60, 5);
    ellipse(gameChar_x - 2, gameChar_y - 60, 5);
    stroke(0);
    strokeWeight(2);
    line(gameChar_x, gameChar_y - 52, gameChar_x, gameChar_y - 25);
    line(gameChar_x, gameChar_y - 40, gameChar_x - 15, gameChar_y - 30);
    line(gameChar_x, gameChar_y - 40, gameChar_x + 15, gameChar_y - 50);
    line(gameChar_x, gameChar_y - 25, gameChar_x - 15, gameChar_y);
    line(gameChar_x, gameChar_y - 25, gameChar_x + 7, gameChar_y);
  } else if (isRight && isFalling) {
    fill(0);
    ellipse(gameChar_x, gameChar_y - 60, 15);
    fill(255);
    ellipse(gameChar_x + 5, gameChar_y - 60, 5);
    ellipse(gameChar_x + 2, gameChar_y - 60, 5);
    stroke(0);
    strokeWeight(2);
    line(gameChar_x, gameChar_y - 52, gameChar_x, gameChar_y - 25);
    line(gameChar_x, gameChar_y - 40, gameChar_x - 15, gameChar_y - 50);
    line(gameChar_x, gameChar_y - 40, gameChar_x + 15, gameChar_y - 30);
    line(gameChar_x, gameChar_y - 25, gameChar_x + 15, gameChar_y);
    line(gameChar_x, gameChar_y - 25, gameChar_x - 7, gameChar_y);
  } else if (isLeft) {
    fill(0);
    ellipse(gameChar_x, gameChar_y - 60, 15);
    fill(255);
    ellipse(gameChar_x - 5, gameChar_y - 60, 5);
    ellipse(gameChar_x - 2, gameChar_y - 60, 5);
    stroke(0);
    strokeWeight(2);
    line(gameChar_x, gameChar_y - 52, gameChar_x, gameChar_y - 25);
    line(gameChar_x, gameChar_y - 45, gameChar_x - 10, gameChar_y - 30);
    line(gameChar_x, gameChar_y - 45, gameChar_x - 5, gameChar_y - 30);
    line(gameChar_x, gameChar_y - 25, gameChar_x - 10, gameChar_y);
    line(gameChar_x, gameChar_y - 25, gameChar_x + 7, gameChar_y);
  } else if (isRight) {
    fill(0);
    ellipse(gameChar_x, gameChar_y - 60, 15);
    fill(255);
    ellipse(gameChar_x + 5, gameChar_y - 60, 5);
    ellipse(gameChar_x + 2, gameChar_y - 60, 5);
    stroke(0);
    strokeWeight(2);
    line(gameChar_x, gameChar_y - 52, gameChar_x, gameChar_y - 25);
    line(gameChar_x, gameChar_y - 45, gameChar_x + 10, gameChar_y - 30);
    line(gameChar_x, gameChar_y - 45, gameChar_x + 5, gameChar_y - 30);
    line(gameChar_x, gameChar_y - 25, gameChar_x + 10, gameChar_y);
    line(gameChar_x, gameChar_y - 25, gameChar_x - 7, gameChar_y);
  } else if (isFalling || isPlummeting) {
    fill(0);
    ellipse(gameChar_x, gameChar_y - 60, 15);
    fill(255);
    ellipse(gameChar_x - 3, gameChar_y - 60, 5);
    ellipse(gameChar_x + 3, gameChar_y - 60, 5);
    stroke(0);
    strokeWeight(2);
    line(gameChar_x, gameChar_y - 52, gameChar_x, gameChar_y - 25);
    line(gameChar_x, gameChar_y - 40, gameChar_x - 15, gameChar_y - 50);
    line(gameChar_x, gameChar_y - 40, gameChar_x + 15, gameChar_y - 50);
    line(gameChar_x, gameChar_y - 25, gameChar_x - 10, gameChar_y);
    line(gameChar_x, gameChar_y - 25, gameChar_x + 10, gameChar_y);
  } else {
    fill(0);
    ellipse(gameChar_x, gameChar_y - 60, 15);
    fill(255);
    ellipse(gameChar_x - 3, gameChar_y - 60, 5);
    ellipse(gameChar_x + 3, gameChar_y - 60, 5);
    stroke(0);
    strokeWeight(2);
    line(gameChar_x, gameChar_y - 52, gameChar_x, gameChar_y - 25);
    line(gameChar_x, gameChar_y - 45, gameChar_x - 15, gameChar_y - 40);
    line(gameChar_x, gameChar_y - 45, gameChar_x + 15, gameChar_y - 40);
    line(gameChar_x, gameChar_y - 25, gameChar_x - 5, gameChar_y);
    line(gameChar_x, gameChar_y - 25, gameChar_x + 5, gameChar_y);
  }
  pop();

  if (lives < 1) {
    fill(255);
    textSize(32);
    text("Game Over!", cameraPosX + width / 2 - 100, height / 2);
    textSize(16);
    text("Press 'r' to restart", cameraPosX + width / 2 - 100, height / 2 + 30);
  }

  if (flagpole.isReached) {
    fill(255);
    textSize(32);
    text("Level Complete!", cameraPosX + width / 2 - 100, height / 2);
  }

  if (isLeft == true) {
    gameChar_x -= 2;
  }

  if (isRight == true) {
    gameChar_x += 2;
  }

  if (gameChar_y < floorPos_y) {
    var isContact = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
        isContact = true;
        isFalling = false;
        break;
      }
    }
    if (isContact == false) {
      gameChar_y += 1;
      isFalling = true;
    }
  } else {
    isFalling = false;
  }
}

function keyPressed() {
  if (key == "R" || key == "r") {
    lives = 3;
    startGame();
    return;
  }
  if (lives < 1 || flagpole.isReached) return;

  if (key == "A" || keyCode == 65) {
    isLeft = true;
  }

  if (key == "D" || keyCode == 68) {
    isRight = true;
  }

  if (key == " " || key == "w") {
    if (!isFalling) {
      gameChar_y -= 100;
      jumpSound.play();
    }
  }

  if (isPlummeting == true) {
    isRight = false;
    isLeft = false;
  }
}

function keyReleased() {
  if (keyCode == 65) {
    isLeft = false;
  } else if (keyCode == 68) {
    isRight = false;
  }
}

function drawGrass() {
  background(80, 190, 240);

  fill(160, 120, 60);
  rect(0, floorPos_y + 20, width, height - (floorPos_y + 20));

  fill(60, 190, 60);
  rect(0, floorPos_y, width, 20);
}

function drawClouds() {
  for (var j = 0; j < cloud.x_pos.length; j++) {
    fill(255);
    stroke(0);
    strokeWeight(3);
    ellipse(cloud.x_pos[j], cloud.y_pos, cloud.width, cloud.height);
    ellipse(
      cloud.x_pos[j] - 20,
      cloud.y_pos - 15,
      cloud.width - 20,
      cloud.height - 20,
    );
    ellipse(
      cloud.x_pos[j] + 20,
      cloud.y_pos - 10,
      cloud.width - 30,
      cloud.height - 20,
    );
    cloud.x_pos[j] += cloud.x_speed;

    if (cloud.x_pos[j] - cameraPosX > width) {
      cloud.x_pos[j] = cameraPosX - 300;
    }
  }
}

function drawMountains() {
  for (var k = 0; k < mountain.x_pos.length; k++) {
    fill(mountain.color);
    triangle(
      mountain.x_pos[k],
      mountain.y_pos,
      mountain.x_pos[k] + mountain.width,
      mountain.y_pos,
      mountain.x_pos[k] + mountain.width / 2,
      mountain.y_pos - mountain.height,
    );
  }
}

function createTree(x, y, width, height, type = 0) {
  var tree = {
    x: x,
    y: y,
    width: width,
    height: height,
    type: type,
    draw: function () {
      strokeWeight(2);
      if (this.type === 0) {
        // Original tree type
        fill(139, 69, 19);
        rect(this.x, this.y - this.height, this.width, this.height);
        fill(85, 107, 47);
        triangle(
          this.x - this.width,
          this.y - this.height,
          this.x + this.width / 2,
          this.y - this.height * 1.5,
          this.x + this.width * 2,
          this.y - this.height,
        );
        triangle(
          this.x - this.width,
          this.y - this.height * 1.2,
          this.x + this.width / 2,
          this.y - this.height * 1.75,
          this.x + this.width * 2,
          this.y - this.height * 1.2,
        );
      } else if (this.type === 1) {
        fill(139, 69, 19); // Brown trunk
        rect(this.x, this.y - this.height, this.width, this.height);

        fill(148, 87, 235);
        ellipse(
          this.x + this.width / 2,
          this.y - this.height - this.height * 0.6,
          this.width * 5,
          this.height * 1.2,
        );

        fill(171, 130, 255);
        ellipse(
          this.x + this.width / 2,
          this.y - this.height - this.height * 0.7,
          this.width * 3,
          this.height * 0.7,
        );
      } else if (this.type === 2) {
        // Cactus type
        fill(34, 139, 34);
        rect(this.x, this.y - this.height, this.width, this.height);

        rect(
          this.x - this.width / 2,
          this.y - this.height * 0.6,
          this.width / 2,
          this.height * 0.4,
        );

        // Right arm
        rect(
          this.x + this.width,
          this.y - this.height * 0.6,
          this.width / 2,
          this.height * 0.4,
        );
      }
    },
  };
  return tree;
}

function drawTrees() {
  for (var i = 0; i < trees.length; i++) {
    trees[i].draw();
  }
}

function drawCanyon(t_canyon) {
  fill(100, 155, 255);
  rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, t_canyon.height);

  stroke(139, 69, 19);
  strokeWeight(1);

  line(
    t_canyon.x_pos,
    t_canyon.y_pos,
    t_canyon.x_pos,
    t_canyon.y_pos + t_canyon.height,
  );

  line(
    t_canyon.x_pos + t_canyon.width,
    t_canyon.y_pos,
    t_canyon.x_pos + t_canyon.width,
    t_canyon.y_pos + t_canyon.height,
  );

  noStroke();
}

function checkCanyon(t_canyon) {
  if (
    gameChar_x > t_canyon.x_pos &&
    gameChar_x < t_canyon.x_pos + t_canyon.width &&
    gameChar_y >= floorPos_y
  ) {
    isPlummeting = true;
    gameChar_y += 15;
  } else {
    isPlummeting = false;
  }
}

function drawCollectable(t_collectable) {
  if (t_collectable.isFound == false) {
    push();
    fill(255, 255, 0);
    stroke(0);
    strokeWeight(1.5);

    ellipse(t_collectable.x_pos, t_collectable.y_pos, 40, 15);

    beginShape();
    vertex(t_collectable.x_pos - 10, t_collectable.y_pos);
    vertex(t_collectable.x_pos, t_collectable.y_pos - 15);
    vertex(t_collectable.x_pos + 10, t_collectable.y_pos);
    endShape(CLOSE);
    pop();
  }
}

function checkCollectable(t_collectable) {
  if (
    dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 40
  ) {
    t_collectable.isFound = true;
    game_score += 1;
  }
}

function drawGameScore() {
  fill(255);
  textSize(16);
  text(`score: ${game_score}`.toUpperCase(), cameraPosX, 20);
}

function drawFlagpole() {
  push();
  strokeWeight(5);
  stroke(100);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);

  fill(255, 255, 255);
  noStroke();

  if (flagpole.isReached) {
    triangle(
      flagpole.x_pos,
      floorPos_y - 200,
      flagpole.x_pos,
      floorPos_y - 170,
      flagpole.x_pos + 20,
      floorPos_y - 185,
    );
  } else {
    triangle(
      flagpole.x_pos,
      floorPos_y - 50,
      flagpole.x_pos,
      floorPos_y - 20,
      flagpole.x_pos + 20,
      floorPos_y - 35,
    );
  }
  pop();
}

function checkFlagpole() {
  var d = abs(gameChar_x - flagpole.x_pos);
  var requiredScore = 7;
  if (d < 15 && game_score >= requiredScore) {
    flagpole.isReached = true;
  } else if (d < 15) {
    fill(255);
    textSize(16);
    text(
      `Collect at least score: ${requiredCollectables} items to finish!`,
      gameChar_x - 120,
      floorPos_y - 50,
    );
  }
}

function checkPlayerDie() {
  for (var i = 0; i < lives; i++) {
    noStroke();
    fill(255, 255, 255);
    textAlign(LEFT);
    text(`lives: ${lives}.`.toUpperCase(), cameraPosX + 15, 40);
  }
  if (gameChar_y >= height) {
    lives -= 1;
    if (lives > 0) {
      startGame();
    }
  }
}

function createPlatforms(x, y, length) {
  var p = {
    x: x,
    y: y,
    length: length,
    draw: function () {
      fill(255, 200, 255);
      stroke(200, 0, 200);
      strokeWeight(2);
      rect(this.x, this.y, this.length, 20, 8);

      stroke(180, 0, 180);
      strokeWeight(1);
      line(
        this.x + this.length * 0.25,
        this.y,
        this.x + this.length * 0.25,
        this.y + 20,
      );
      line(
        this.x + this.length * 0.5,
        this.y,
        this.x + this.length * 0.5,
        this.y + 20,
      );
      line(
        this.x + this.length * 0.75,
        this.y,
        this.x + this.length * 0.75,
        this.y + 20,
      );

      stroke(255, 200, 255);
      strokeWeight(2);
      line(this.x + 2, this.y + 2, this.x + this.length - 2, this.y + 2);

      noStroke();
    },
    checkContact: function (gameChar_x, gameChar_y) {
      if (gameChar_x > this.x && gameChar_x < this.x + this.length) {
        var d = this.y - gameChar_y;
        if (d >= 0 && d < 5) {
          return true;
        }
        return false;
      }
    },
  };
  return p;
}

function createMovingPlatform(x, y, length, range, speed) {
  var p = {
    x: x,
    y: y,
    length: length,
    range: range,
    speed: speed,
    direction: 1,
    originalX: x,

    update: function () {
      this.x += this.speed * this.direction;

      if (this.x > this.originalX + this.range) {
        this.direction = -1;
      } else if (this.x < this.originalX) {
        this.direction = 1;
      }
    },

    draw: function () {
      this.update();
      fill(255, 200, 255);
      stroke(0, 0, 200);
      rect(this.x, this.y, this.length, 20, 8);

      fill(0, 0, 200);
      noStroke();
      ellipse(this.x + 10, this.y + 10, 5, 5);
      ellipse(this.x + this.length - 10, this.y + 10, 5, 5);
    },

    checkContact: function (gameChar_x, gameChar_y) {
      if (gameChar_x > this.x && gameChar_x < this.x + this.length) {
        var d = this.y - gameChar_y;
        if (d >= 0 && d < 5) {
          if (this.direction > 0) {
            gameChar_x += this.speed;
          } else {
            gameChar_x -= this.speed;
          }
          return true;
        }
        return false;
      }
    },
  };
  return p;
}

function Enemy(x, y, range, speed = 1) {
  this.x = x;
  this.y = y;
  this.range = range;
  this.speed = speed;

  this.currentX = x;
  this.inc = this.speed;

  this.update = function () {
    this.currentX += this.inc;
    if (this.currentX >= this.x + this.range) {
      this.inc = this.speed * -1;
    } else if (this.currentX < this.x) {
      this.inc = this.speed;
    }
  };

  this.draw = function () {
    this.update();
    fill(255, 0, 0);
    ellipse(this.currentX, this.y, 20, 20);
    fill(0);
    ellipse(this.currentX - 5, this.y - 5, 2, 2);
    ellipse(this.currentX + 5, this.y - 5, 2, 2);
    ellipse(this.currentX, this.y + 5, 5, 5);
  };
  this.checkContact = function (gc_x, gc_y) {
    var d = dist(gc_x, gc_y, this.currentX, this.y);
    if (d < 20) {
      return true;
    }
    return false;
  };
}
