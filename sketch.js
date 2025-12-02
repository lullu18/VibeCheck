let attractors = [];
let repellers = [];
let maxAttractors = 15; // Maximum number of Attractors
let countRepellers = 400; // Number of Repellers (Repellers > Attractors)
let centerPos;

function setup() {
  createCanvas(800, 600);
  centerPos = createVector(width / 2, height / 2);

  // Initialize Repellers (scattered everywhere)
  for (let i = 0; i < countRepellers; i++) {
    repellers.push(new Repeller(random(width), random(height)));
  }
}

function draw() {
  // Space trail effect
  background(10, 10, 25, 50);

  // Use additive blending for glowing space effect
  blendMode(ADD);

  // Draw Central Generator
  noStroke();
  fill(255, 100, 50, 100 + sin(frameCount * 0.1) * 50);
  circle(centerPos.x, centerPos.y, 60 + sin(frameCount * 0.05) * 10);

  fill(255, 200);
  circle(centerPos.x, centerPos.y, 20);

  // Generate Attractors occasionally
  if (attractors.length < maxAttractors && frameCount % 60 === 0) {
    attractors.push(new Attractor(centerPos.x, centerPos.y));
  }

  // Calculate Interactions: Attractor pulls Repeller, Repeller pushes Attractor
  for (let a of attractors) {
    for (let r of repellers) {
      // Vector pointing from Repeller to Attractor
      let force = p5.Vector.sub(a.pos, r.pos);
      let d = force.mag();
      d = constrain(d, 5, 200); // Constrain distance for stability

      // Magnitude of force (G * m1 * m2 / r^2)
      // We tweak G for visual effect
      let strength = (1 * a.mass * r.mass) / (d * d);

      force.setMag(strength);

      // Attractor pulls Repeller (Attraction)
      r.applyForce(force);

      // Repeller pushes Attractor (Repulsion) - Reverse the force vector
      let repelForce = force.copy();
      repelForce.mult(-0.8); // Repeller pushes Attractor slightly weaker to keep Attractor central-ish
      a.applyForce(repelForce);
    }
  }

  // Update and Display Attractors
  for (let i = attractors.length - 1; i >= 0; i--) {
    let a = attractors[i];
    a.update();
    a.display();
    if (a.isDead()) {
      attractors.splice(i, 1);
    }
  }

  // Update and Display Repellers
  for (let r of repellers) {
    r.update();
    r.edges();
    r.display();
  }

  blendMode(BLEND); // Reset blend mode
}