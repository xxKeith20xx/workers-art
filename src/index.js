const catImageUrl =
  "https://imagedelivery.net/baAa4fwjctZfuBzZ3hvtGA/59a00d14-cc58-4c62-e9c1-fc4d1184f900/public";

export default {
  async fetch() {
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#071329">
    <title>Cosmic Shore Cat</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/2.3.2/p5.min.js" integrity="sha512-ng/OAtMqIV4Mbny+ffpcazmh1ll3TVgauAzXXgA+41oiZUDQd7i3NU8W6jqo1Ab6hlKdkPyxPIiceff2QfMbTg==" crossorigin="anonymous"></script>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; overflow: hidden; background: #030718; }
      body { touch-action: none; }
      canvas { display: block; cursor: crosshair; }
    </style>
  </head>
  <body>
    <script>
      const catImageUrl = ${JSON.stringify(catImageUrl)};
      let catImage;
      let cat;
      let target;
      let stars = [];
      let sparkles = [];
      let ripples = [];
      let hasInteracted = false;

      function preload() {
        catImage = loadImage(catImageUrl);
      }

      function setup() {
        createCanvas(windowWidth, windowHeight);
        pixelDensity(min(2, window.devicePixelRatio || 1));
        colorMode(HSB, 360, 100, 100, 100);
        resetScene();
      }

      function resetScene() {
        const waterline = height * 0.74;
        cat = { x: width * 0.5, y: waterline - 72, vx: 0, vy: 0, bob: random(TWO_PI) };
        target = createVector(cat.x, cat.y);
        stars = Array.from({ length: max(100, floor(width * height / 8500)) }, makeStar);
        sparkles = Array.from({ length: 100 }, makeSparkle);
        ripples = [];
      }

      function makeStar() {
        return {
          x: random(width), y: random(height * 0.57), size: random(0.5, 2.5),
          phase: random(TWO_PI), speed: random(0.4, 1.4), hue: random() < 0.2 ? random(185, 245) : random(35, 65)
        };
      }

      function makeSparkle() {
        return {
          x: random(width), y: random(height * 0.51, height * 0.78), size: random(1, 4),
          phase: random(TWO_PI), speed: random(1, 3)
        };
      }

      function draw() {
        const time = millis() / 1000;
        drawSky(time);
        drawMoon(time);
        drawOcean(time);
        drawBeach(time);
        updateCat();
        drawRipples();
        drawCat();
        drawInstructions();
      }

      function drawSky(time) {
        const horizon = height * 0.54;
        noStroke();
        for (let y = 0; y < horizon; y += 3) {
          const depth = y / horizon;
          fill(238 + depth * 30, 70 - depth * 22, 13 + depth * 14);
          rect(0, y, width, 3);
        }

        for (const star of stars) {
          const pulse = 0.55 + sin(time * star.speed + star.phase) * 0.45;
          fill(star.hue, 36, 100, 13 * pulse);
          circle(star.x, star.y, star.size * 6);
          fill(star.hue, 28, 100, 65 + pulse * 30);
          circle(star.x, star.y, star.size);
        }

        // A low aurora connects the sky to the luminous sea.
        for (let x = -80; x < width + 80; x += 20) {
          const y = height * 0.49 + sin(x * 0.012 + time * 0.4) * 20;
          fill(165 + sin(time * 0.2 + x) * 24, 74, 100, 4);
          ellipse(x, y, 85, 115);
        }
      }

      function drawMoon(time) {
        const x = width * 0.77;
        const y = height * 0.19;
        const diameter = min(width, height) * 0.1;
        noStroke();
        for (let glow = diameter * 2.3; glow > diameter; glow -= 12) {
          fill(188, 65, 100, map(glow, diameter * 2.3, diameter, 1, 9));
          circle(x, y, glow);
        }
        fill(48, 10, 100, 94);
        circle(x, y, diameter);
        fill(195, 22, 100, 20);
        circle(x - diameter * 0.13, y - diameter * 0.07, diameter * 0.37);

        for (let reflectionY = height * 0.56; reflectionY < height * 0.77; reflectionY += 7) {
          const spread = map(reflectionY, height * 0.56, height * 0.77, 15, width * 0.24);
          const wobble = sin(time * 2.2 + reflectionY * 0.13) * 18;
          fill(186, 38, 100, 12);
          rect(x - spread / 2 + wobble, reflectionY, spread, 2);
        }
      }

      function drawOcean(time) {
        const horizon = height * 0.53;
        const shoreline = height * 0.79;
        noStroke();
        for (let y = horizon; y < shoreline; y += 3) {
          const depth = (y - horizon) / (shoreline - horizon);
          fill(212 - depth * 22, 73, 22 + depth * 22);
          rect(0, y, width, 3);
        }

        noFill();
        for (let layer = 0; layer < 11; layer++) {
          const y = horizon + layer * (shoreline - horizon) / 10;
          const amplitude = 4 + layer * 1.8;
          stroke(183 + layer * 3, 68, 92, 18 + layer * 2);
          strokeWeight(0.8 + layer * 0.1);
          beginShape();
          for (let x = -20; x < width + 20; x += 14) {
            vertex(x, y + sin(x * 0.018 + time * (1.4 + layer * 0.06)) * amplitude + sin(x * 0.045 - time) * amplitude * 0.35);
          }
          endShape();
        }

        noStroke();
        for (const sparkle of sparkles) {
          const shimmer = sin(time * sparkle.speed + sparkle.phase);
          if (shimmer > 0.3) {
            fill(186, 28, 100, map(shimmer, 0.3, 1, 0, 40));
            ellipse(sparkle.x, sparkle.y, sparkle.size * (1 + shimmer * 3), 1.2);
          }
        }
      }

      function drawBeach(time) {
        const start = height * 0.77;
        noStroke();
        for (let y = start; y < height; y += 3) {
          const depth = (y - start) / (height - start);
          fill(250, 26 - depth * 8, 18 + depth * 10);
          rect(0, y, width, 3);
        }

        noFill();
        for (let line = 0; line < 4; line++) {
          stroke(174, 44, 100, 44 - line * 7);
          strokeWeight(2.4 - line * 0.35);
          beginShape();
          for (let x = -20; x < width + 20; x += 12) {
            vertex(x, start + line * 21 + sin(x * 0.025 + time * 1.8 + line * 2) * (5 + line));
          }
          endShape();
        }
      }

      function updateCat() {
        target.y = constrain(target.y, height * 0.43, height * 0.745);
        const direction = createVector(target.x - cat.x, target.y - cat.y);
        const distance = direction.mag();
        if (distance > 3) {
          direction.normalize();
          const speed = min(0.18 + distance * 0.012, 4.7);
          cat.vx += direction.x * speed * 0.12;
          cat.vy += direction.y * speed * 0.12;
        }
        cat.vx *= 0.88;
        cat.vy *= 0.88;
        cat.x = constrain(cat.x + cat.vx, 45, width - 45);
        cat.y = constrain(cat.y + cat.vy, height * 0.43, height * 0.745);
        cat.bob += 0.052;
        if ((abs(cat.vx) + abs(cat.vy) > 0.45) && frameCount % 7 === 0) addRipple(cat.x - cat.vx * 7, cat.y + 38, false);
      }

      function drawCat() {
        const size = constrain(min(width, height) * 0.29, 155, 275);
        const facing = cat.vx < -0.1 ? -1 : 1;
        push();
        translate(cat.x, cat.y + sin(cat.bob) * 5);
        scale(facing, 1);
        rotate(constrain(cat.vy * 0.025, -0.11, 0.11) * facing);
        noStroke();
        for (let glow = size * 1.15; glow > size * 0.38; glow -= size * 0.12) {
          fill(183, 75, 100, map(glow, size * 1.15, size * 0.38, 1, 9));
          ellipse(0, size * 0.24, glow * 1.45, glow * 0.42);
        }
        imageMode(CENTER);
        if (catImage && catImage.width > 1) {
          image(catImage, 0, -size * 0.13, size, size);
        } else {
          fill(280, 12, 11);
          ellipse(0, -size * 0.12, size * 0.72, size * 0.68);
          triangle(-size * 0.3, -size * 0.3, -size * 0.13, -size * 0.69, -size * 0.02, -size * 0.3);
          triangle(size * 0.03, -size * 0.3, size * 0.17, -size * 0.69, size * 0.32, -size * 0.3);
        }
        pop();
      }

      function addRipple(x, y, big) {
        ripples.push({ x: x, y: constrain(y, height * 0.46, height * 0.79), radius: big ? 8 : 2, speed: big ? 2.7 : 1.15, life: big ? 100 : 38 });
        if (ripples.length > 36) ripples.shift();
      }

      function drawRipples() {
        noFill();
        for (let i = ripples.length - 1; i >= 0; i--) {
          const ripple = ripples[i];
          ripple.radius += ripple.speed;
          ripple.life -= 1.5;
          if (ripple.life <= 0) { ripples.splice(i, 1); continue; }
          stroke(180, 65, 100, ripple.life * 0.45);
          strokeWeight(1.2 + ripple.life * 0.012);
          ellipse(ripple.x, ripple.y, ripple.radius * 2.6, ripple.radius * 0.56);
        }
      }

      function drawInstructions() {
        noStroke();
        textAlign(LEFT, TOP);
        fill(200, 35, 100, 84);
        textSize(constrain(width * 0.017, 12, 17));
        text("COSMIC SHORE", 22, 22);
        fill(200, 16, 100, 68);
        textSize(constrain(width * 0.013, 11, 14));
        text("Guide the cat with your mouse or finger · click the water to call it", 22, 47);
        if (!hasInteracted) {
          textAlign(CENTER, CENTER);
          fill(190, 34, 100, 88);
          textSize(constrain(width * 0.024, 15, 22));
          text("The tide follows your hand", width / 2, height * 0.89);
        }
      }

      function moveCat(x, y, splash) {
        target.set(x, y);
        hasInteracted = true;
        if (splash) addRipple(x, y, true);
      }

      function mouseMoved() { moveCat(mouseX, mouseY, false); }
      function mousePressed() { moveCat(mouseX, mouseY, true); return false; }
      function touchStarted() { moveCat(touches[0].x, touches[0].y, true); return false; }
      function touchMoved() { if (touches.length) moveCat(touches[0].x, touches[0].y, false); return false; }
      function keyPressed() { if (key === "r" || key === "R") resetScene(); }
      function windowResized() { resizeCanvas(windowWidth, windowHeight); resetScene(); }
    </script>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "no-cache"
      }
    });
  }
};
