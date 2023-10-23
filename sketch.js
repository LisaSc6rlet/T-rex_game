//Variáveis
var trex, trexCorrendo, trexMorto;
var chao, chaoImg, chaoInvisivel;
var canvas;
var gravidade = 2; //y positivo é para baixo
var forcaPulo = -24; //y é para cima
var nuvem, nuvemImg;
var ob1, ob2, ob3, ob4, ob5, ob6;
var play = 1
var end = 0
var gameState = play;
var grupoObstaculos;
var grupoNuvens;
var gameOver, gameOverImg
var restart, restartImg
var jumpSound, dieSound, checkpointSound

//carregar animações
function preload() {
  trexCorrendo = loadAnimation("t1.png", "t3.png", "t4.png");
  trexMorto = loadAnimation("trex_collided.png")
  chaoImg = loadImage('ground2.png');
  nuvemImg = loadImage('cloud.png');
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

}

function setup() {

  if (isMobileDevice()) {
    canvas = createCanvas(windowWidth, 320);
  }
  else {
    canvas = createCanvas(600, 200); //larg, alt
    canvas.center();
  }



  //crie um sprite de trex
  trex = createSprite(50, 150, 20, 50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("morto", trexMorto);
  //adicione dimensão ao trex
  trex.scale = 0.5;


  //crie um sprite ground (solo)
  chao = createSprite(300, 170, 600, 20); //x, y,larg, alt
  chao.addImage("chao", chaoImg);


  chaoInvisivel = createSprite(70, 230)
  chaoInvisivel.visible = false


  gameOver = createSprite( width / 2, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5
  restart = createSprite(width / 2, 145);
  restart.addImage(restartImg);
  restart.scale = 0.5;



  grupoObstaculos = createGroup();
  grupoNuvens = createGroup();
  score = 0;
  trex.setCollider("circle", 0, 0);
  console.log(score);



}

function draw() {// desenhar

  background(180); //fundo








  if (gameState === play) {
    chao.velocityX = -(7 + score / 500);

    score = score + 1
    restart.visible = false;
    gameOver.visible = false;

    if (chao.x < 0) {
      chao.x = chao.width / 2;
    }
    var noChao = trex.collide(chaoInvisivel)

    if ((touches.length > 0 || keyDown("space")) && noChao) { // E
      trex.velocityY = forcaPulo;
      jumpSound.play();
      touches = [];
      //console.log(touches);
    }
    trex.velocityY += gravidade;
    gerarNuvens();
    gerarObstaculos();

    if (grupoObstaculos.isTouching(trex)) {
      gameState = end;
      dieSound.play();
    }
    if (score > 0 && score % 300 === 0) {
      checkpointSound.play();

    }

  }
  else if (gameState === end) {
    trex.changeAnimation("morto");
    restart.visible = true;
    gameOver.visible = true;
    chao.velocityX = 0;
    trex.velocityY = 0;
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);

    grupoNuvens.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);

    if (touches.length > 0 || mousePressedOver(restart)) {
      //gameState === play
      reset();
      touches = [];
    }

  }
  trex.collide(chaoInvisivel)
  drawSprites(); //desenha os sprite
  fill("white")
  text("Score:" + score, width - 60, 30);
}

//gera um resultado igual a zero somente quando o frameCount é múltiplo de 60
//como 0, 60, 120, 180 etc..
function reset() {
  gameState = play
  restart.visible = false;
  gameOver.visible = false;
  trex.changeAnimation("correndo");
  grupoNuvens.destroyEach();
  grupoObstaculos.destroyEach();
  score = 0;
}
//criando a função
function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite( width + 50, 50, 40, 10);
    nuvem.addImage('nuvem', nuvemImg)
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(30, 100))
    nuvem.depth = trex.depth;
    nuvem.lifetime = width + 50
    trex.depth = trex.depth + 1;
    // console.log(nuvem.depth, trex.depth) 


    //fórmula: tempo = distancia/velocidade
    //meu caso: 600/3 = 200
    //acrescentei mais + porque criei a nuvem 50pixels a mais do 600 de largura

    //problema aqui é que os sprites criados a cada geração das nuvens
    //nao é destruido e é alocado a memoria do computador, para cada sprite que é gerado

    grupoNuvens.add(nuvem);

  }

}

function gerarObstaculos() {

  var intervaloBase = 60;
  if (score > 500) {
    intervaloBase = 30;
  }

  if (frameCount % intervaloBase === 0) {
    var obstaculo = createSprite( width + 50, 160, 10, 40);
    obstaculo.velocityX = -(7 + score / 300);

    var rand = Math.round(random(1, 6))
    console.log(rand)

    switch (rand) {
      case 1: obstaculo.addImage(ob1);
        obstaculo.scale = 1
        break;
      case 2: obstaculo.addImage(ob2);
        obstaculo.scale = 1
        break;
      case 3: obstaculo.addImage(ob3);
        obstaculo.scale = 0.7
        break;
      case 4: obstaculo.addImage(ob4);
        obstaculo.scale = 0.5
        break;
      case 5: obstaculo.addImage(ob5);
        obstaculo.scale = 0.5
        break;
      case 6: obstaculo.addImage(ob6);
        obstaculo.scale = 0.5
        break;
    }

    obstaculo.lifetime = width + 50;
    grupoObstaculos.add(obstaculo);
  }

}


//if(trex.isTouching(obstaculo)){
//trex.collide(obstaculo)
//}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}