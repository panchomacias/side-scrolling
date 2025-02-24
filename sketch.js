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
var tree;
var cloud;
var mountain;
var cameraPosX;
var flagpole;
var game_score;
var lives;

var jumpSound;

function preload() {
  soundFormats("mp3", "wav");

  //load your sounds here
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
  ];

  canyons = [
    { x_pos: 200, y_pos: 432, width: 120, height: 144 },
    { x_pos: 1000, y_pos: 432, width: 100, height: 144 },
    { x_pos: 1400, y_pos: 432, width: 100, height: 144 },
    { x_pos: 1800, y_pos: 432, width: 150, height: 144 },
  ];

  tree = {
    x_pos: [50, 450, 900, 1150, 1300],
    y_pos: floorPos_y,
    width: 20,
    height: 80,
  };

  cloud = {
    x_pos: [50, 300, 600, 900, 1200],
    y_pos: 150,
    width: 100,
    height: 50,
    x_speed: 0.5,
  };

  mountain = {
    x_pos: [500, 700, 1150],
    y_pos: floorPos_y,
    width: 200,
    height: 200,
    color: [165, 42, 42],
  };

  cameraPosX = 0;

  flagpole = { x_pos: 2000, isReached: false };

  game_score = 0;
}

function draw() {
  cameraPosX = gameChar_x - width / 2;

  drawGrass();

  push();
  translate(-cameraPosX, 0);

  drawTrees();

  drawClouds();

  drawMountains();

  drawCollectable(collectables);

  checkCollectable(collectables);

  drawCanyon(canyons);

  checkCanyon(canyons);

  drawGameScore();

  drawFlagpole();

  if (flagpole.isReached == false) {
    checkFlagpole();
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
    gameChar_y += 1;
    isFalling = true;
  } else {
    isFalling = false;
  }
}

function keyPressed() {
  if (lives < 1 || flagpole.isReached) return;

  if (key == "A" || keyCode == 65) {
    isLeft = true;
  }

  if (key == "D" || keyCode == 68) {
    isRight = true;
  }

  if (key == " " || key == "w") {
    if (!isFalling) {
      gameChar_y -= 80;
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

function drawTrees() {
  for (var i = 0; i < tree.x_pos.length; i++) {

    fill(139, 69, 19);
    rect(tree.x_pos[i], tree.y_pos - 80, tree.width, tree.height);

    fill(85, 107, 47);
    triangle(
      tree.x_pos[i] - tree.width,
      tree.y_pos - tree.height,
      tree.x_pos[i] + tree.width / 2,
      tree.y_pos - tree.height * 1.5,
      tree.x_pos[i] + tree.width * 2,
      tree.y_pos - tree.height,
    );

    triangle(
      tree.x_pos[i] - tree.width,
      tree.y_pos - tree.height * 1.2,
      tree.x_pos[i] + tree.width / 2,
      tree.y_pos - tree.height * 1.75,
      tree.x_pos[i] + tree.width * 2,
      tree.y_pos - tree.height * 1.2,
    );
  }

  for (var j = 0; j < tree.x_pos.length; j++) {
    fill(120, 80, 40);
    rect(tree.x_pos[j] * 2, tree.y_pos - 80, tree.width, tree.height);
    fill(60, 200, 80);
    ellipse(tree.x_pos[j] * 2 + tree.width / 2, tree.y_pos - 100, 70, 60);
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
    gameChar_y += 5;
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
  if (d < 15) {
    flagpole.isReached = true;
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
