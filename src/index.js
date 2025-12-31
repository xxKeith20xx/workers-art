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
  <title>Psychedelic Vision</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
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
let pg; // Off-screen graphics buffer for feedback effect
let particles = [];
let kaleidoscopeSegments = 8;
let hueShift = 0;
let noiseScale = 0.005;
let time = 0;
let ripples = [];

function preload() {
  img = loadImage('https://imagedelivery.net/baAa4fwjctZfuBzZ3hvtGA/59a00d14-cc58-4c62-e9c1-fc4d1184f900/public');
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
}

function draw() {
  time += 0.01;
  hueShift = (hueShift + 0.5) % 360;
  
  // Feedback: draw previous frame slightly scaled and rotated for trails
  push();
  translate(width/2, height/2);
  rotate(0.003);
  scale(1.005);
  tint(0, 0, 100, 85);
  image(pg, 0, 0);
  pop();
  
  // Dark overlay for fade effect
  noStroke();
  fill(0, 0, 0, 8);
  rect(0, 0, width, height);
  
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
</script>

<body>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}
