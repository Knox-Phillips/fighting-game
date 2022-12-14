const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

const background = new Sprite ({
  position:{
    x:0,
    y:0
  },
  imageSrc: "img/Background.png"
})


//Making a player object that we can hold
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

player.draw();
//Making a enemy object that we can hold
const enemy = new Fighter({
  position: {
    x: 500,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 50,
    y: 0,
  },
});
enemy.draw();
//Youtubers method for checking which keys are pressed so if we lift off of a and were holding d we still move instead of stopping
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({player,enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  }else if(player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player One Wins";
  }else if(enemy.health > player.health) {
    document.querySelector("#displayText").innerHTML = "Player Two Wins";
  }
}

let timer = 60;
let timerId
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({player, enemy})
  }
}
decreaseTimer();

//Animated the objects by requestiong key frames so the chacrathers cna move frame by frame
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update()

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //Player Movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3.5;
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 3.5;
  }

  //Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -3.5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 3.5;
  }

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //end game based on health
  if(enemy.health <=0 || player.health <= 0) {
      determineWinner({player,enemy,timerId})
  }

}
//Invoking the animate function
animate();
//Checking for which key is being pressed down code
window.addEventListener("keydown", (event) => {
  console.log(event);
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -10;
      break;
    case " ":
      player.attack();
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -10;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }

  //enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
