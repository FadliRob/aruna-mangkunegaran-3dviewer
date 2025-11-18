class Joystick {
    constructor(container) {
        this.container = container;
        this.value = { x: 0, y: 0 };

        this.create();
        this.bindEvents();
    }

    create() {
        this.base = document.createElement("div");
        this.stick = document.createElement("div");

        Object.assign(this.base.style, {
            position: "absolute",
            width: "120px",
            height: "120px",
            background: "#ffffff30",
            borderRadius: "50%"
        });

        Object.assign(this.stick.style, {
            position: "absolute",
            width: "60px",
            height: "60px",
            background: "#ffffff80",
            borderRadius: "50%",
            left: "30px",
            top: "30px"
        });

        this.container.appendChild(this.base);
        this.base.appendChild(this.stick);
    }

    bindEvents() {
        let active = false;
        let startX = 0, startY = 0;

        this.base.addEventListener("touchstart", (e) => {
            active = true;
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        });

        this.base.addEventListener("touchmove", (e) => {
            if (!active) return;
            const t = e.touches[0];
            let dx = t.clientX - startX;
            let dy = t.clientY - startY;

            dx = Math.max(-40, Math.min(40, dx));
            dy = Math.max(-40, Math.min(40, dy));

            this.stick.style.transform = `translate(${dx}px, ${dy}px)`;

            this.value.x = dx / 40;
            this.value.y = dy / 40;
        });

        this.base.addEventListener("touchend", () => {
            active = false;
            this.stick.style.transform = `translate(0px, 0px)`;
            this.value = { x: 0, y: 0 };
        });
    }
}
