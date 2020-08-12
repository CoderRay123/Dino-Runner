var dino, dinoImage, invisibleGround, groundImage, cacti, cactusImage1, cactusImage2, cactusImage3, cactusImage4, cactusImage5, cactusImage6, r, clouds, cloudImage, gameState, dinoXImage, gameOver, restart, gameOverImage, restartImage, score, jump, checkPoint, die, highScore;

function preload() {

  dinoImage = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cactusImage1 = loadImage("obstacle1.png");
  cactusImage2 = loadImage("obstacle2.png");
  cactusImage3 = loadImage("obstacle3.png");
  cactusImage4 = loadImage("obstacle4.png");
  cactusImage5 = loadImage("obstacle5.png");
  cactusImage6 = loadImage("obstacle6.png");
  cloudImage = loadImage("cloud.png");
  dinoXImage = loadAnimation("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");

  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
}

function setup() {
  createCanvas(800, 200);

  dino = createSprite(50, 175);
  dino.addAnimation("play", dinoImage);
  dino.addAnimation("collided", dinoXImage);
  dino.scale = 0.5;

  invisibleGround = createSprite(400, 195, 800, 10);
  invisibleGround.visible = false;

  ground = createSprite(400, 185);
  ground.addImage(groundImage);

  cacti = new Group();
  clouds = new Group();

  gameState = "play";

  gameOver = createSprite(400, 50);
  gameOver.addImage(gameOverImage);

  restart = createSprite(400, 125);
  restart.addImage(restartImage);
  restart.scale = 0.75

  score = 0;
  highScore = 0
}

function draw() {
  background(240);

  if (gameState === "play") {

    score = Math.round(getFrameRate() / 57.75) + score;

    if (score % 100 === 0 && score != 0) {
      checkPoint.play();
    }

    if (keyDown("space") && dino.y > 166) {
      dino.velocityY = -11
      jump.play();
    }

    dino.velocityY = dino.velocityY + 0.5

    dino.collide(invisibleGround);

    ground.velocityX = score / -100 - 5;

    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    spawnCactus();
    spawnCloud();

    gameOver.visible = false;
    restart.visible = false;

    if (cacti.isTouching(dino)) {
      gameState = "stop";
      die.play();
    }
  }

  if (gameState === "stop") {

    ground.velocityX = 0;
    cacti.setVelocityXEach(0);
    clouds.setVelocityXEach(0);
    cacti.setLifetimeEach(-1);
    clouds.setLifetimeEach(-1);
    dino.velocityY = 0;
    dino.changeAnimation("collided", dinoXImage);

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }
    
    if (score >= highScore){
      highScore = score;
    }
  }



  fill("black");
  textSize(20);
  text("High Score:  " + highScore,400,25)
  text("Score:  " + score, 600, 25);

  drawSprites();
}

function spawnCactus() {
  if (frameCount % 80 === 0) {
    r = Math.round(random(1, 6));
    var cactus = createSprite(825, 165);
    switch (r) {
      case 1:
        cactus.addImage(cactusImage1);
        break;
      case 2:
        cactus.addImage(cactusImage2);
        break;
      case 3:
        cactus.addImage(cactusImage3);
        break;
      case 4:
        cactus.addImage(cactusImage4);
        break;
      case 5:
        cactus.addImage(cactusImage5);
        break;
      case 6:
        cactus.addImage(cactusImage6);
        break;
      default:
        break;
    }
    cactus.velocityX = score / -100 - 5;
    cactus.scale = 0.75
    cactus.lifetime = 200;
    cacti.add(cactus);
  }
}

function spawnCloud() {
  if (frameCount % 150 === 0) {
    var cloud = createSprite(850, random(25, 125));
    cloud.addImage(cloudImage);
    cloud.velocityX = -3;
    cloud.depth = 0;
    cloud.lifetime = 300;
    clouds.add(cloud);
  }
}

function reset() {
  gameState = "play";
  cacti.destroyEach();
  clouds.destroyEach();
  dino.changeAnimation("play", dinoImage);
  score = 0

}