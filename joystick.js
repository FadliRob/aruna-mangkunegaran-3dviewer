class Joystick {
    constructor(container, maxDistance = 40) {
        this.container = container;
        this.maxDistance = maxDistance;

        this.value = { x: 0, y: 0 };

        this.base = document.createElement("div");
        this.stick = document.createElement("div");

        Object.assign(this.base.style, {
            position: "absolute",
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50%"
        });

        Object.assign(this.stick.style, {
            position: "absolute",
            width: "60px",
            height: "60px",
            background: "rgba(255,255,255,0.6)",
            borderRadius: "50%",
            left: "20px",
            top: "20px"
        });

        container.appendChild(this.base);
        container.appendChild(this.stick);

        this.active = false;

        const move = (e) => {
            if (!this.active) return;
            const rect = this.container.getBoundingClientRect();

            const x = e.touches[0].clientX - rect.left - 50;
            const y = e.touches[0].clientY - rect.top - 50;

            const dist = Math.hypot(x, y);
            const angle = Math.atan2(y, x);

            const limited = Math.min(this.maxDistance, dist);

            const stickX = Math.cos(angle) * limited;
            const stickY = Math.sin(angle) * limited;

            this.stick.style.transform = `translate(${stickX}px, ${stickY}px)`;

            this.value.x = stickX / this.maxDistance;
            this.value.y = stickY / this.maxDistance;
        };

        container.addEventListener("touchstart", () => this.active = true);
        container.addEventListener("touchend", () => {
            this.active = false;
            this.value = { x: 0, y: 0 };
            this.stick.style.transform = "translate(0px, 0px)";
        });

        container.addEventListener("touchmove", move);
    }
}
