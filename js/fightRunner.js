async function loadFight() {
  const response = await fetch("fights/sample_fight.json");
  const fight = await response.json();

  await loadEssentials();

  for (let name of fight.assets.sprites) {
    sprites[name] = await loadImage(name, "sprites");
  }

  if (fight.player && fight.player.sprite) {
    sprites[fight.player.sprite] = await loadImage(fight.player.sprite, "sprites");
    player.sprite = fight.player.sprite;
  }

  if (fight.player && fight.player.color) {
    player.color = fight.player.color;
  }

  return fight;
}

function gameLoop(fight) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (sprites[fight.enemy.sprite]) {
    ctx.drawImage(sprites[fight.enemy.sprite], 150, 50, 100, 100);
  }

  drawHeart();
  drawBullets();
  updateBullets();
  drawUI(fight);

  requestAnimationFrame(() => gameLoop(fight));
}

loadFight().then(fight => {
  fight.attacks.forEach(a => {
    if (a.pattern === "down_rain") {
      for (let i = 0; i < 10; i++) {
        spawnBullet("bullet", { x: i * 40, y: 0, dy: 2 });
      }
    }
  });
  gameLoop(fight);

  if (fight.script) {
    try {
      eval(fight.script);
    } catch (e) {
      console.error("Script error:", e);
    }
  }
});
