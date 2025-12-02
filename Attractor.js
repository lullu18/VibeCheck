// Entity A: Heavy, Generated from center, Pulls B
class Attractor extends Particle {
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
