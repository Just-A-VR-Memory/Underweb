const canvas = document.getElementById("game");
const ctx = canvas ? canvas.getContext("2d") : null;

let sprites = {};
let player = { x: 200, y: 250, size: 16, hp: 20, sprite: "ui/heart", color: null };
let bullets = [];

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") player.y -= 5;
  if (e.key === "ArrowDown") player.y += 5;
  if (e.key === "ArrowLeft") player.x -= 5;
  if (e.key === "ArrowRight") player.x += 5;
});

async function loadImage(name, folder) {
  return new Promise(res => {
    const img = new Image();
    img.src = `${folder}/${name}.png`;
    img.onload = () => res(img);
  });
}

async function loadEssentials() {
  const essentials = ["frame", "hpbar", "hpfill", "box", "heart"];
  for (let name of essentials) {
    sprites["ui/" + name] = await loadImage(name, "sprites/ui");
  }
}

function spawnBullet(sprite, opts) {
  bullets.push({
    sprite: sprite,
    x: opts.x || 0,
    y: opts.y || 0,
    dx: opts.dx || 0,
    dy: opts.dy || 1,
    size: opts.size || 16
  });
}

function drawSprite(name, x, y, size) {
  if (sprites[name]) {
    ctx.drawImage(sprites[name], x, y, size, size);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, size, size);
  }
}

function drawHeart() {
  const heartSprite = sprites[player.sprite];
  if (!heartSprite) return;
  if (player.color) {
    let off = document.createElement("canvas");
    off.width = player.size;
    off.height = player.size;
    let octx = off.getContext("2d");
    octx.drawImage(heartSprite, 0, 0, player.size, player.size);
    octx.globalCompositeOperation = "source-atop";
    octx.fillStyle = player.color;
    octx.fillRect(0, 0, player.size, player.size);
    ctx.drawImage(off, player.x, player.y, player.size, player.size);
  } else {
    ctx.drawImage(heartSprite, player.x, player.y, player.size, player.size);
  }
}

function drawBullets() {
  bullets.forEach(b => {
    drawSprite(b.sprite, b.x, b.y, b.size);
  });
}

function updateBullets() {
  bullets.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;
    if (
      b.x < player.x + player.size &&
      b.x + b.size > player.x &&
      b.y < player.y + player.size &&
      b.y + b.size > player.y
    ) {
      player.hp--;
    }
  });
}

function drawUI(fight) {
  ctx.drawImage(sprites["ui/frame"], 0, 0);
  ctx.drawImage(sprites["ui/hpbar"], 10, 10);
  ctx.drawImage(sprites["ui/hpfill"], 10, 10, fight.enemy.hp * 2, 20);
  ctx.fillStyle = "white";
  ctx.fillText(`${fight.enemy.name}`, 200, 25);
}
