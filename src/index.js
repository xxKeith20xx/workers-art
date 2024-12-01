addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>p5.js Cloudflare Worker Sketch</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
</head>
<style>
    body {
      margin: 0;
      background-color: black;
    }
  </style>
  <script>
  let noiseY;
  let noiseSpeed = 0.01;
  let noiseHeight = 20;
  function setup() {
    createCanvas(windowWidth, windowHeight);
    noiseY = height * 3 / 4;
  }
  
  function draw() {
    background(0, 15);
  
    noStroke();
    fill(255);
    for (let i = 0; i < 10; i++) {
      let xrandom = random(width);
      let yrandom = random(height / 2);
      ellipse(xrandom, yrandom, 3, 3);
    }
  
    for (let j = 0; j < 3; j++) {
      let offsetY = j * 100;
      noFill();
      stroke(0, 0, 255, 10);
      strokeWeight(height / 2);
      beginShape();
      curveVertex(0, height / 2);
      for (let i = 0; i < width; i += 50) {
        let y = noise(frameCount * noiseSpeed + i + j) * noiseHeight + noiseY + offsetY;
        curveVertex(i, y);
      }
      curveVertex(width, height / 2);
      endShape(LINES);
    }
  
  }
  </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}