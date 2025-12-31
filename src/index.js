addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>https://p5-js.martinelli.dev/</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.2/p5.min.js"></script>
</head>
<style>
  body {
    margin: 0;
    background-color: black;
    overflow: hidden;
    cursor: none;
  }
</style>

<script>
let img;
let silverSurfer;
let pg; // Off-screen graphics buffer for feedback effect
let particles = [];
let stars = [];
let shootingStars = [];
let kaleidoscopeSegments = 8;
let hueShift = 0;
let noiseScale = 0.005;
let time = 0;
let ripples = [];
let goldenRatio = 1.618033988749;
let nebulaOffset = 0;
let surferX, surferY, surferAngle = 0;
let surferPath = []; // Trail behind Silver Surfer

function preload() {
  img = loadImage('https://imagedelivery.net/baAa4fwjctZfuBzZ3hvtGA/59a00d14-cc58-4c62-e9c1-fc4d1184f900/public');
  // Silver Surfer - replace with your own Cloudflare Images URL if needed
  silverSurfer = loadImage('https://upload.wikimedia.org/wikipedia/en/5/5f/Silver_Surfer.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pg = createGraphics(width, height);
  pg.colorMode(HSB, 360, 100, 100, 100);
  imageMode(CENTER);
  pg.imageMode(CENTER);

  // Initialize particles
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }
  
  // Initialize starfield with depth layers - MORE STARS!
  for (let i = 0; i < 800; i++) {
    stars.push(new Star());
  }
  
  // Initialize Silver Surfer position
  surferX = width * 0.2;
  surferY = height * 0.5;
}

function draw() {
  time += 0.008;
  nebulaOffset += 0.002;
  hueShift = (hueShift + 0.3) % 360;

  // Deeper feedback: draw previous frame scaled and rotated for hypnotic tunnel
  push();
  translate(width/2, height/2);
  rotate(sin(time * 0.3) * 0.005);
  scale(1.008);
  tint(0, 0, 100, 92);
  image(pg, 0, 0);
  pop();

  // Subtle dark overlay
  noStroke();
  fill(0, 0, 0, 5);
  rect(0, 0, width, height);
  
  // Draw space background elements
  drawNebula();
  drawStarfield();
  updateShootingStars();
  
  // Draw Silver Surfer soaring through the cosmos
  drawSilverSurfer();

  // Draw sacred geometry behind kaleidoscope
  drawSacredGeometry();
  
  // Draw fractal spirals
  drawFractalSpirals();

  // Draw kaleidoscope of the image
  drawKaleidoscope();

  // Draw flowing energy waves
  drawEnergyWaves();

  // Update and draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Draw ripples
  updateRipples();

  // Draw mouse trail / cursor effect
  drawCursor();

  // Copy current frame to buffer for feedback
  pg.image(get(), width/2, height/2);
  
  // Randomly spawn shooting stars
  if (random() < 0.02) {
    shootingStars.push(new ShootingStar());
  }
}

function drawKaleidoscope() {
  let segments = kaleidoscopeSegments;
  let angle = TWO_PI / segments;

  push();
  translate(width/2, height/2);

  // Pulsing scale based on noise
  let pulse = map(noise(time * 2), 0, 1, 0.8, 1.2);
  let breathe = sin(time * 0.5) * 0.1 + 1;

  for (let i = 0; i < segments; i++) {
    push();
    rotate(angle * i + time * 0.1);

    // Mirror every other segment
    if (i % 2 === 1) {
      scale(-1, 1);
    }

    // Apply psychedelic tint - cycle through rainbow
    let h = (hueShift + i * (360 / segments)) % 360;
    tint(h, 70, 100, 60);

    // Distort image position with noise
    let offsetX = noise(time + i) * 50 - 25;
    let offsetY = noise(time + i + 100) * 50 - 25;

    // Draw the image slice
    let imgSize = min(width, height) * 0.4 * pulse * breathe;
    image(img, offsetX, offsetY, imgSize, imgSize);

    pop();
  }
  pop();
}

function drawEnergyWaves() {
  noFill();

  for (let wave = 0; wave < 5; wave++) {
    let h = (hueShift + wave * 60) % 360;
    stroke(h, 80, 100, 40);
    strokeWeight(2 + wave);

    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = height/2 +
              sin(x * 0.01 + time * 2 + wave) * 100 +
              noise(x * noiseScale, time + wave) * 150 - 75;
      curveVertex(x, y);
    }
    endShape();
  }
}

// Nebula - soft cosmic gas clouds
function drawNebula() {
  noStroke();
  for (let i = 0; i < 8; i++) {
    let nx = noise(nebulaOffset + i * 100) * width;
    let ny = noise(nebulaOffset + i * 200 + 50) * height;
    let size = noise(nebulaOffset + i * 300) * 400 + 100;
    let h = (hueShift + i * 45 + 180) % 360;
    
    // Layered glow for soft nebula effect
    for (let j = 5; j > 0; j--) {
      fill(h, 60, 80, 3);
      ellipse(nx, ny, size * j * 0.4, size * j * 0.3);
    }
  }
}

// Parallax starfield with twinkling
function drawStarfield() {
  for (let star of stars) {
    star.update();
    star.display();
  }
}

// Shooting stars
function updateShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    s.update();
    s.display();
    if (s.isDead()) {
      shootingStars.splice(i, 1);
    }
  }
}

// Silver Surfer soaring through the cosmos
function drawSilverSurfer() {
  // Smooth figure-8 / infinity path through space
  let pathSpeed = 0.3;
  let targetX = width/2 + sin(time * pathSpeed) * width * 0.35;
  let targetY = height/2 + sin(time * pathSpeed * 2) * height * 0.25;
  
  // Smooth movement towards target
  surferX += (targetX - surferX) * 0.02;
  surferY += (targetY - surferY) * 0.02;
  
  // Calculate angle based on movement direction
  let dx = targetX - surferX;
  let dy = targetY - surferY;
  let targetAngle = atan2(dy, dx);
  surferAngle += (targetAngle - surferAngle) * 0.1;
  
  // Store path for cosmic trail
  surferPath.push({x: surferX, y: surferY, hue: hueShift});
  if (surferPath.length > 60) surferPath.shift();
  
  // Draw cosmic energy trail
  noFill();
  for (let i = 0; i < surferPath.length - 1; i++) {
    let p = surferPath[i];
    let alpha = map(i, 0, surferPath.length, 0, 50);
    let weight = map(i, 0, surferPath.length, 1, 8);
    let h = (p.hue + i * 2) % 360;
    
    stroke(h, 70, 100, alpha);
    strokeWeight(weight);
    
    let p2 = surferPath[i + 1];
    line(p.x, p.y, p2.x, p2.y);
    
    // Add sparkles along trail
    if (i % 5 === 0) {
      noStroke();
      fill(h, 50, 100, alpha * 0.8);
      let sparkleSize = random(3, 8);
      ellipse(p.x + random(-10, 10), p.y + random(-10, 10), sparkleSize, sparkleSize);
    }
  }
  
  // Draw Silver Surfer with cosmic glow
  push();
  translate(surferX, surferY);
  rotate(surferAngle);
  
  // Outer cosmic aura
  noStroke();
  for (let i = 5; i > 0; i--) {
    let h = (hueShift + i * 30 + 200) % 360; // Silver/blue tones
    fill(h, 40, 100, 8);
    ellipse(0, 0, 120 + i * 20, 80 + i * 15);
  }
  
  // Draw the Silver Surfer image
  tint(0, 0, 100, 90); // Silver tint
  let surferSize = min(width, height) * 0.12;
  image(silverSurfer, 0, 0, surferSize, surferSize * 1.5);
  
  // Surfboard energy glow
  let glowH = (hueShift + 180) % 360;
  fill(glowH, 80, 100, 30);
  ellipse(0, surferSize * 0.4, surferSize * 0.8, 10);
  
  pop();
  
  // Power cosmic particles emanating from surfer
  if (frameCount % 2 === 0) {
    particles.push(new Particle(surferX, surferY, true));
  }
}

// Sacred geometry - Flower of Life pattern
function drawSacredGeometry() {
  push();
  translate(width/2, height/2);
  rotate(time * 0.05);
  
  let baseRadius = min(width, height) * 0.3;
  let pulse = sin(time) * 0.1 + 1;
  
  noFill();
  strokeWeight(1);
  
  // Draw overlapping circles in flower of life pattern
  for (let ring = 0; ring < 3; ring++) {
    let numCircles = ring === 0 ? 1 : 6 * ring;
    let ringRadius = ring * baseRadius * 0.15 * pulse;
    
    for (let i = 0; i < numCircles; i++) {
      let angle = (TWO_PI / numCircles) * i + time * 0.02;
      let x = cos(angle) * ringRadius;
      let y = sin(angle) * ringRadius;
      let h = (hueShift + ring * 40 + i * 10) % 360;
      
      stroke(h, 50, 100, 15);
      ellipse(x, y, baseRadius * 0.3 * pulse, baseRadius * 0.3 * pulse);
    }
  }
  
  // Central seed of life
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i;
    let x = cos(angle) * baseRadius * 0.08 * pulse;
    let y = sin(angle) * baseRadius * 0.08 * pulse;
    let h = (hueShift + i * 60) % 360;
    stroke(h, 70, 100, 20);
    ellipse(x, y, baseRadius * 0.15 * pulse, baseRadius * 0.15 * pulse);
  }
  
  pop();
}

// Fractal golden spirals
function drawFractalSpirals() {
  push();
  translate(width/2, height/2);
  
  // Draw multiple spiral arms
  for (let arm = 0; arm < 4; arm++) {
    push();
    rotate(arm * HALF_PI + time * 0.1);
    drawGoldenSpiral(1);
    pop();
    
    push();
    rotate(arm * HALF_PI + time * 0.1);
    scale(-1, 1);
    drawGoldenSpiral(-1);
    pop();
  }
  pop();
}

function drawGoldenSpiral(direction) {
  noFill();
  let maxSize = min(width, height) * 0.4;
  let spiralHue = (hueShift + direction * 90) % 360;
  
  beginShape();
  for (let t = 0; t < 8; t += 0.02) {
    // Golden spiral: r = a * e^(b * theta)
    let r = 5 * pow(goldenRatio, t * 0.5) * (sin(time * 2) * 0.2 + 0.8);
    if (r > maxSize) break;
    
    let x = r * cos(t * direction + time * 0.5);
    let y = r * sin(t * direction + time * 0.5);
    
    let h = (spiralHue + t * 20) % 360;
    stroke(h, 80, 100, map(r, 0, maxSize, 60, 10));
    strokeWeight(map(r, 0, maxSize, 1, 4));
    
    curveVertex(x, y);
  }
  endShape();
  
  // Add fibonacci circles along spiral
  for (let i = 1; i < 8; i++) {
    let r = 5 * pow(goldenRatio, i * 0.8);
    if (r > maxSize) break;
    
    let x = r * cos(i * direction + time * 0.5);
    let y = r * sin(i * direction + time * 0.5);
    let h = (spiralHue + i * 30) % 360;
    
    noFill();
    stroke(h, 70, 100, 30);
    strokeWeight(1);
    ellipse(x, y, r * 0.3, r * 0.3);
  }
}

function drawCursor() {
  let mx = mouseX || width/2;
  let my = mouseY || height/2;

  // Glowing orb at cursor
  for (let i = 5; i > 0; i--) {
    let h = (hueShift + i * 20) % 360;
    fill(h, 80, 100, 20);
    noStroke();
    ellipse(mx, my, i * 30, i * 30);
  }

  // Trailing particles from cursor
  if (frameCount % 3 === 0) {
    particles.push(new Particle(mx, my, true));
    if (particles.length > 300) {
      particles.shift();
    }
  }
}

function updateRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.radius += 5;
    r.alpha -= 2;

    if (r.alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }

    noFill();
    stroke((hueShift + r.radius) % 360, 80, 100, r.alpha);
    strokeWeight(3);
    ellipse(r.x, r.y, r.radius * 2);
  }
}

function mousePressed() {
  // Create ripple on click
  ripples.push({
    x: mouseX,
    y: mouseY,
    radius: 10,
    alpha: 100
  });

  // Burst of particles
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(mouseX, mouseY, true));
  }
}

function keyPressed() {
  // Change kaleidoscope segments with number keys
  if (key >= '3' && key <= '9') {
    kaleidoscopeSegments = parseInt(key);
  }
  // Reset with 'r'
  if (key === 'r' || key === 'R') {
    pg.clear();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.imageMode(CENTER);
}

// Particle class for flowing energy
class Particle {
  constructor(x, y, fromMouse = false) {
    if (fromMouse) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D().mult(random(2, 5));
    } else {
      this.pos = createVector(random(width), random(height));
      this.vel = createVector(0, 0);
    }
    this.acc = createVector(0, 0);
    this.size = random(2, 8);
    this.hue = random(360);
    this.life = 255;
    this.fromMouse = fromMouse;
    this.noiseOffset = random(1000);
  }

  update() {
    if (this.fromMouse) {
      this.life -= 3;
      this.vel.mult(0.98);
    } else {
      // Flow field movement
      let angle = noise(
        this.pos.x * noiseScale,
        this.pos.y * noiseScale,
        time
      ) * TWO_PI * 4;

      this.acc = p5.Vector.fromAngle(angle).mult(0.5);
      this.vel.add(this.acc);
      this.vel.limit(3);

      // Attract towards center slightly
      let center = createVector(width/2, height/2);
      let toCenter = p5.Vector.sub(center, this.pos);
      toCenter.mult(0.0005);
      this.vel.add(toCenter);
    }

    this.pos.add(this.vel);
    this.hue = (this.hue + 1) % 360;

    // Wrap around edges
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  display() {
    if (this.fromMouse && this.life <= 0) return;

    let alpha = this.fromMouse ? this.life / 255 * 80 : 60;
    let h = (this.hue + hueShift) % 360;

    noStroke();
    fill(h, 80, 100, alpha);

    // Draw with glow effect
    for (let i = 3; i > 0; i--) {
      fill(h, 80, 100, alpha / i);
      ellipse(this.pos.x, this.pos.y, this.size * i, this.size * i);
    }
  }

  isDead() {
    return this.fromMouse && this.life <= 0;
  }
}

// Star class for parallax starfield
class Star {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.z = random(1, 3); // Depth layer (1=far, 3=close)
    this.size = map(this.z, 1, 3, 1, 4);
    this.speed = map(this.z, 1, 3, 0.1, 0.5);
    this.twinkleSpeed = random(0.02, 0.08);
    this.twinkleOffset = random(TWO_PI);
    this.hue = random() < 0.1 ? random(200, 280) : 0; // Some blue/purple stars
    this.saturation = this.hue === 0 ? 0 : 30;
  }
  
  update() {
    // Slow drift towards center for depth effect
    let dx = (this.x - width/2) * 0.0002 * this.z;
    let dy = (this.y - height/2) * 0.0002 * this.z;
    this.x += dx;
    this.y += dy;
    
    // Reset if off screen
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
      // Spawn from edges
      if (random() < 0.5) {
        this.x = random() < 0.5 ? 0 : width;
        this.y = random(height);
      } else {
        this.x = random(width);
        this.y = random() < 0.5 ? 0 : height;
      }
    }
  }
  
  display() {
    let twinkle = sin(frameCount * this.twinkleSpeed + this.twinkleOffset);
    let brightness = map(twinkle, -1, 1, 50, 100);
    let alpha = map(twinkle, -1, 1, 40, 90);
    
    noStroke();
    fill(this.hue, this.saturation, brightness, alpha);
    
    // Glow effect for brighter stars
    if (this.z > 2) {
      fill(this.hue, this.saturation, brightness, alpha * 0.3);
      ellipse(this.x, this.y, this.size * 3, this.size * 3);
    }
    
    fill(this.hue, this.saturation, brightness, alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Shooting star class
class ShootingStar {
  constructor() {
    // Start from random edge
    this.x = random(width);
    this.y = random(-50, height * 0.3);
    this.angle = random(PI * 0.1, PI * 0.4);
    this.speed = random(15, 25);
    this.length = random(50, 150);
    this.life = 255;
    this.hue = random(180, 280);
  }
  
  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.life -= 8;
  }
  
  display() {
    let alpha = map(this.life, 0, 255, 0, 100);
    
    // Draw trail
    for (let i = 0; i < this.length; i += 5) {
      let trailX = this.x - cos(this.angle) * i;
      let trailY = this.y - sin(this.angle) * i;
      let trailAlpha = map(i, 0, this.length, alpha, 0);
      let trailSize = map(i, 0, this.length, 3, 0.5);
      
      noStroke();
      fill(this.hue, 50, 100, trailAlpha);
      ellipse(trailX, trailY, trailSize, trailSize);
    }
    
    // Bright head
    fill(0, 0, 100, alpha);
    ellipse(this.x, this.y, 4, 4);
  }
  
  isDead() {
    return this.life <= 0 || this.x > width + 100 || this.y > height + 100;
  }
}
</script>

<body>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}
