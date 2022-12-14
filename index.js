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
  imageSrc: "img/background.png",
})

const shop = new Sprite ({
  position:{
    x:615,
    y:128
  },
  imageSrc: "img/shop.png",
  scale : 2.75,
  framesMax: 6
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
  imageSrc:'img/samuraiMack/Idle.png',
  framesMax:8,
  scale:2.5,
  offset: {
    x:215,
    y:156
    },
    sprites: {
      idle: {
        imageSrc:'img/samuraiMack/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc:'img/samuraiMack/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc:'img/samuraiMack/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc:'img/samuraiMack/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc:'img/samuraiMack/Attack1.png',
        framesMax:6
      },
      takeHit: {
        imageSrc: 'img/samuraiMack/Take Hit - white silhouette.png',
        framesMax:4
      },
      death: {
        imageSrc: 'img/samuraiMack/Death.png',
        framesMax:6
      }
    },
    attackBox: {
      offset: {
        x:-35,
        y:53
      },
      width:185,
      height:50
    }
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
  imageSrc:'img/kenji/Idle.png',
  framesMax:4,
  scale:2.5,
  offset: {
    x:155,
    y:178
    },
    sprites: {
      idle: {
        imageSrc:'img/kenji/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc:'img/kenji/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc:'img/kenji/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc:'img/kenji/Fall.png',
        framesMax: 2
      },

      attack1: {
        imageSrc:'img/kenji/Attack1.png',
        framesMax:4
      },
      takeHit: {
        imageSrc: 'img/kenji/Take hit.png',
        framesMax:3
      },
      death: {
        imageSrc: 'img/samuraiMack/Death.png',
        framesMax:7
    }
  },
    attackBox: {
      offset: {
        x:55,
        y:50
      },
      width:185,
      height:50
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

decreaseTimer();

//Animated the objects by requestiong key frames so the chacrathers cna move frame by frame
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //Player Movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3.5;
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 3.5;
    player.switchSprite('run')
  }else {
    player.switchSprite('idle')

  }
//Only need to do it once
  if(player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if(player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -3.5;
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 3.5;
    enemy.switchSprite('run')
  }else {
    enemy.switchSprite('idle')

  }

  if(enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if(enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy hits
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking && player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //if player misses
  if(player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking && 
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //if enemy misses
  if(enemy.isAttacking && enemy.framesCurrent === 2) {
enemy.isAttacking = false }


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
      enemy.attack()  

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
