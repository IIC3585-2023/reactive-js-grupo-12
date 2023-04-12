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

// posicion del pacman (indices de la matriz)
let pacX = getXPixPos(0);
let pacY = getYPixPos(0);

const ghosts = [
  {
    x: 5,
    y: 3
  },
  {
    x: 0,
    y: 5
  }
]

console.log('----', ghosts[0].x)

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
}

const drawDots = () => {
  // crea un punto en el tablero si hay uno en MAP en la posicion correspondiente
  for (let y = 0; y <= 8; y++) {
    for (let x = 0; x <= 17; x++) {
      if (MAP[y][x] == '.') {
        drawDot(y, x);
      }
    }
  }
}

const drawGhost = (y, x) => {
  const centerX = getXPixPos(x) + POSWIDTH/2 + 1
  const centerY = getYPixPos(y) + POSHEIGHT/2
  const radius = 15;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'red';
  context.fill();
  context.lineWidth = 5;
  context.stroke();
}

const drawGhosts = () => {
  ghosts.forEach((ghost) => {
    drawGhost(ghost.y, ghost.x);
  });
}

const drawPacman = () => {
  // dibuja al pacman en la posicion dada por las variables pacX y pacY
  context.beginPath();
  context.arc(pacX + POSWIDTH/2, pacY + POSHEIGHT/2, 15, 0.25 * Math.PI, 1.75 * Math.PI);
  context.lineTo(pacX + POSWIDTH/2, pacY + POSHEIGHT/2);
  context.fillStyle = 'yellow';
  context.fill();
}

const update = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
  drawPacman();
  drawGhosts();
  // en cada frame, modificar las variables pacX, pacY para mover el pacman.
  // para poner/esconder un punto, modificar MAP
}
// update();
setInterval(update, 1000 / 5); // esto actualiza puntos y pacman 5 veces por segundo






