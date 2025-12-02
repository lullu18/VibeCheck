let particlesA = [];
let particlesB = [];
let maxA = 15; // Maximum number of A particles
let countB = 400; // Number of B particles (B > A)
let centerPos;

function setup() {
  createCanvas(800, 600);
  centerPos = createVector(width / 2, height / 2);
  
  // Initialize B particles (scattered everywhere)
  for (let i = 0; i < countB; i++) {
    particlesB.push(new ParticleB(random(width), random(height)));
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

  // Generate A particles occasionally
  if (particlesA.length < maxA && frameCount % 60 === 0) {
    particlesA.push(new ParticleA(centerPos.x, centerPos.y));
  }

  // Calculate Interactions: A pulls B, B pushes A
  for (let a of particlesA) {
    for (let b of particlesB) {
      // Vector pointing from B to A
      let force = p5.Vector.sub(a.pos, b.pos);
      let d = force.mag();
      d = constrain(d, 5, 200); // Constrain distance for stability
      
      // Magnitude of force (G * m1 * m2 / r^2)
      // We tweak G for visual effect
      let strength = (1 * a.mass * b.mass) / (d * d);
      
      force.setMag(strength);
      
      // A pulls B (Attraction)
      b.applyForce(force);
      
      // B pushes A (Repulsion) - Reverse the force vector
      let repelForce = force.copy();
      repelForce.mult(-0.8); // B pushes A slightly weaker to keep A central-ish
      a.applyForce(repelForce);
    }
  }

  // Update and Display A
  for (let i = particlesA.length - 1; i >= 0; i--) {
    let a = particlesA[i];
    a.update();
    a.display();
    if (a.isDead()) {
      particlesA.splice(i, 1);
    }
  }

  // Update and Display B
  for (let b of particlesB) {
    b.update();
    b.edges();
    b.display();
  }
  
  blendMode(BLEND); // Reset blend mode
}

// ---------------------------------------------------------
// Particle Classes
// ---------------------------------------------------------

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}

// Entity A: Heavy, Generated from center, Pulls B
class ParticleA extends Particle {
  constructor(x, y) {
    super(x, y);
    this.vel.mult(0.5); // Initial slow drift
    this.mass = 50;     // Heavy
    this.size = random(20, 40);
    this.life = 255;
    this.decay = random(0.5, 1.5);
    // Color: Warm/Star-like
    this.col = color(random(200, 255), random(100, 200), 50);
  }

  update() {
    super.update();
    this.life -= this.decay;
    
    // Friction to keep them from flying off too fast due to B's push
    this.vel.mult(0.95); 
  }

  display() {
    noStroke();
    // Halo
    fill(red(this.col), green(this.col), blue(this.col), this.life * 0.3);
    circle(this.pos.x, this.pos.y, this.size * 2);
    // Core
    fill(red(this.col), green(this.col), blue(this.col), this.life);
    circle(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.life < 0;
  }
}

// Entity B: Light, Numerous, Trapped, Pushes A
class ParticleB extends Particle {
  constructor(x, y) {
    super(x, y);
    this.mass = 2; // Light
    this.vel.mult(2); // Move faster
    this.size = random(2, 5);
    // Color: Cool/Cosmic dust
    this.col = color(random(50, 100), random(150, 255), 255);
    this.maxSpeed = 8;
  }

  update() {
    super.update();
    this.vel.limit(this.maxSpeed);
  }

  edges() {
    let hit = false;
    if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -1;
      hit = true;
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
      hit = true;
    }
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
      hit = true;
    } else if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
      hit = true;
    }
    
    // If it hits a wall, dampen energy slightly
    if(hit) this.vel.mult(0.8);
  }

  display() {
    noStroke();
    // Variable alpha based on speed for twinkling effect
    let alpha = map(this.vel.mag(), 0, this.maxSpeed, 100, 255);
    fill(red(this.col), green(this.col), blue(this.col), alpha);
    circle(this.pos.x, this.pos.y, this.size);
  }
}