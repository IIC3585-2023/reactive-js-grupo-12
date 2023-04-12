const PROBABILITY = 0.4

const {interval, timeInterval, fromEvent, filter} = rxjs;

const MAP = [
  [".",".",".",".","x",".",".",".",".",".",".",".",".","x",".",".",".","."],
  [".","x","x",".","x",".","x","x","x","x","x","x",".","x",".","x","x","."],
  [".","x",".",".",".",".",".",".",".",".",".",".",".",".",".",".","x","."],
  [".","x",".","x","x",".","x","x",".",".","x","x",".","x","x",".","x","."],
  [".",".",".",".",".",".","x",".",".",".",".","x",".",".",".",".",".","."],
  [".","x",".","x","x",".","x","x","x","x","x","x",".","x","x",".","x","."],
  [".","x",".",".",".",".",".",".",".",".",".",".",".",".",".",".","x","."],
  [".","x","x",".","x",".","x","x","x","x","x","x",".","x",".","x","x","."],
  [" ",".",".",".","x",".",".",".",".",".",".",".",".","x",".",".",".","."]
]

const canvas = document.getElementById('map');
const context = canvas.getContext('2d');

const MAPWIDTH = canvas.width
const MAPHEIGHT = canvas.height

const POSWIDTH = Math.floor(MAPWIDTH / 18)
const POSHEIGHT = Math.floor(MAPHEIGHT / 9)

const getXPixPos = (x) => (x) * POSWIDTH // de 0 a 17
const getYPixPos = (y) => (y) * POSHEIGHT // de 0 a 8

const PlayerA = {
  img : "player1.png",
  position:{
    pacMatrixX : 0,
    pacMatrixY : 0,
    pacXMove : 0,
    pacYMove : 1,
    pacX : getXPixPos(0),
    pacY : getYPixPos(0),
  },
  controls:[
  {key:'ArrowDown', x:0, y:1}, 
  {key:'ArrowUp', x:0, y:-1}, 
  {key:'ArrowLeft', x:-1, y:0}, 
  {key:'ArrowRight', x:1, y:0}
]}

const PlayerB = {
  img : "player2.png",
  position:{
    pacMatrixX : 17,
    pacMatrixY : 0,
    pacXMove : 0,
    pacYMove : 1,
    pacX : getXPixPos(17),
    pacY : getYPixPos(0),
  },
  controls:[
  {key:'s', x:0, y:1}, 
  {key:'w', x:0, y:-1}, 
  {key:'a', x:-1, y:0}, 
  {key:'d', x:1, y:0}
]}

const PlayerC = {
  img : "player3.png",
  position:{
    pacMatrixX : 17,
    pacMatrixY : 8,
    pacXMove : 0,
    pacYMove : 1,
    pacX : getXPixPos(17),
    pacY : getYPixPos(8),
  },
  controls:[
  {key:'k', x:0, y:1}, 
  {key:'i', x:0, y:-1}, 
  {key:'j', x:-1, y:0}, 
  {key:'l', x:1, y:0}
]}

const PlayerD = {
  img : "player4.png",
  position:{
    pacMatrixX : 0,
    pacMatrixY : 8,
    pacXMove : 0,
    pacYMove : 1,
    pacX : getXPixPos(0),
    pacY : getYPixPos(8),
  },
  controls:[
  {key:'g', x:0, y:1}, 
  {key:'t', x:0, y:-1}, 
  {key:'f', x:-1, y:0}, 
  {key:'h', x:1, y:0}
]}

const Players = [PlayerA, PlayerB, PlayerC, PlayerD]

let ghostMatrixX = 7;
let ghostMatrixY = 4;
let ghostXMove = 1;
let ghostYMove = 0;
let ghostX = getXPixPos(ghostMatrixX);
let ghostY = getYPixPos(ghostMatrixY);

const drawDot = (y, x) => {
  // crea un punto en la posicion x, y
  const centerX = getXPixPos(x) + POSWIDTH/2
  const centerY = getYPixPos(y) + POSHEIGHT/2
  const radius = 7;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();
  context.lineWidth = 5;
  context.stroke();
  return context;
}

const drawDots = () => {
  // crea un punto en el tablero si hay uno en MAP en la posicion correspondiente
  MAP.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col == ".") {
        drawDot(y, x);
      }
    });
  });
};

const base_image_pac = new Image(1, 1);
base_image_pac.src = "pacman.jpg";

const drawPacman = () => {
  Players.forEach((player) => {
    const base_image_pac = new Image(1, 1);
    base_image_pac.src = player.img;
    const {pacX, pacY} = player.position
    context.drawImage(base_image_pac, pacX + 10, pacY + 10, 30, 30);
  })
};

const base_image_ghost = new Image(1, 1);
base_image_ghost.src = "ghost.png";

const drawGhost = () => {
  context.drawImage(base_image_ghost, ghostX + 5, ghostY + 10, 30, 30);
};

const update = () => {
  // vuelve a dibujar los puntos, al pacman y los fantas en su nueva posición.
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
  drawPacman();
  drawGhost();
};

update();

let PAUSE = false
const time = interval(1000); // emits a value every second
const interal = time.pipe(timeInterval()); // adds timestamp to each emitted value
// tambien es un observable

const moveGhost = () => {
  ghostX = getXPixPos(ghostMatrixX);
  ghostY = getYPixPos(ghostMatrixY);
  ghostMatrixX += 1 * ghostXMove;
  ghostMatrixY += 1 * ghostYMove;
  update();
}

const checkGhostNextMove = () => {
  const list = [-1, 0, 1].sort((a, b) => 0.5 - Math.random());
  list.forEach((x) => {
    list.forEach((y) => {

      j = Math.random(1) ? x : y;
      i = j === x ? y : x;

      const nextX = ghostMatrixX + 1 * j;
      const nextY = ghostMatrixY + 1 * i;
      
        if (i !== ghostYMove && j!== ghostXMove && i!== j ) {

          if (nextY >= 0 && nextY <= 8 && nextX >= 0 && nextX <= 17) {
            if (MAP[nextY][nextX] !== "x") {
              ghostXMove = j;
              ghostYMove = i;
              return            
            }
          }
        }
    });
  });
}

let ghostSub = interal.subscribe((value) => {
  moveGhost()
});

interal.subscribe(() => {
  checkGhostNextMove();
});


const movePac = (x, y, position) =>{
  const nextX = position.pacMatrixX + 1 * x;
  const nextY = position.pacMatrixY + 1 * y;

  if (MAP[nextY][nextX]=== "x" || MAP[nextY][nextX]=== undefined || nextY < 0 || nextY > 8 || nextX < 0 && nextX > 17) {
    return
  }
  position.pacMatrixX  = nextX;
  position.pacMatrixY = nextY;
  position.pacX = getXPixPos(position.pacMatrixX);
  position.pacY = getYPixPos(position.pacMatrixY);
  update();
}

const eatDot = (position) => {
  if (MAP[position.pacMatrixY][position.pacMatrixX]=== ".") {
    MAP[position.pacMatrixY][position.pacMatrixX] = " ";
  };
  update();
}

const checkDead = (position) => {
  if (position.pacMatrixX === ghostMatrixX && position.pacMatrixY === ghostMatrixY) {
    ghostSub.unsubscribe();
    Players.forEach((player) => {
      player.controls.forEach((control) => {
        control.sub.unsubscribe();
      })
    })
    document.getElementById('lose').style.visibility = 'visible';
  }

}

const keyEvent = (control, position) => {
  const keyPress = fromEvent(document, 'keydown').pipe(
    filter((event) => event.key === control.key),
  );
  const keySub = keyPress.subscribe(() => {
    movePac(control.x,control.y, position);
    eatDot(position);
    checkDead(position);
  }); 
  return keySub
}

Players.forEach((player) => {
  const {position, controls} = player
  controls.forEach((control, index) => { 
  player.controls[index].sub = keyEvent(control, position);
 });
})

const pauseGame = () => {
  ghostSub.unsubscribe();
  Players.forEach((player) => {
    player.controls.forEach((control) => {
      control.sub.unsubscribe();
    })
  })
  document.getElementById('pause').style.visibility = 'visible';
  PAUSE = true;
}

const resumeGame = () => {
  ghostSub = interal.subscribe((value) => {
    moveGhost()   
  });

  Players.forEach((player) => {
    const {position, controls} = player
    controls.forEach((control, index) => { 
    player.controls[index].sub = keyEvent(control, position);
   })
  })
  document.getElementById('pause').style.visibility = 'hidden';
  PAUSE = false;
}

const keySpace = fromEvent(document, 'keydown').pipe(
  filter((event) => event.keyCode === 32),
);

keySpace.subscribe(() => {
  console.info("space")
  if (!PAUSE) {
    pauseGame();
  }else{
    resumeGame();
  }
});