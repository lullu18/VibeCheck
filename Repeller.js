// Entity B: Light, Numerous, Trapped, Pushes A
class Repeller extends Particle {
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
        if (hit) this.vel.mult(0.8);
    }

    display() {
        noStroke();
        // Variable alpha based on speed for twinkling effect
        let alpha = map(this.vel.mag(), 0, this.maxSpeed, 100, 255);
        fill(red(this.col), green(this.col), blue(this.col), alpha);
        circle(this.pos.x, this.pos.y, this.size);
    }
}
