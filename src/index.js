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
  let noiseSpeed = 0.05;
  let noiseHeight = 25;
  let img;
  let imgWidth, imgHeight;
  let offset = 0;
  let easing = 0.05;

  function preload() {
    // Load the bottom image from the canvas's assets directory.
    img = loadImage('https://imagedelivery.net/baAa4fwjctZfuBzZ3hvtGA/59a00d14-cc58-4c62-e9c1-fc4d1184f900/public');
  }

  function setup() {
    createCanvas(windowWidth, windowHeight);
    noiseY = height * 3 / 4;
  }


	function resizeImage() {
	// Resize the image to match the canvas size
	imgWidth = width;
	imgHeight = height;
	}

  function draw() {
    // Part 1: Background and Noise
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

    // Part 2: Image with Movement
    // Display the bottom image at full opacity.
    tint(255, 255);
	image(img, 0, 0, imgWidth, imgHeight);

    // Define dx as the rate at which the top image
    // moves with the cursor. The offset variable
    // delays the movement of the image.
    let dx = mouseX - img.width / 2 - offset;
    offset += dx * easing;

    // Display the top image at half opacity.
    tint(255, 127);
	image(img, offset, 0, imgWidth, imgHeight);
  }
function windowResized() {
    // Adjust canvas and image size when the window is resized
    resizeCanvas(windowWidth, windowHeight);
    resizeImage();
  }

  function resizeImage() {
    // Resize the image to match the canvas size
    imgWidth = width;
    imgHeight = height;
  }
</script>

</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}
