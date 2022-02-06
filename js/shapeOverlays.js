class ShapeOverlays {
    constructor(elm) {
        this.elm = elm; // svg paths in html
        this.path = elm.querySelectorAll("path");
        this.numPoints = 8;
        this.duration = 800;
        this.delayPointsArray = [];
        this.delayPointsMax = 180;
        this.delayPerPath = 70;
        this.timeStart = Date.now();
        this.isOpened = false;
        this.isAnimating = false;
    }
    toggle() {
        this.isAnimating = true;
        const range = Math.random() * Math.PI * 2;
        for (var i = 0; i < this.numPoints; i++) {
            const radian = (i / (this.numPoints - 1)) * Math.PI * 2;
            this.delayPointsArray[i] = ((Math.sin(radian + range) + 1) / 2) * this.delayPointsMax;
        }
        if (this.isOpened === false) {
            this.open();
        } else {
            this.close();
        }
    }
    open() {
        this.isOpened = true;
        this.elm.classList.add("is-opened"); // here it adds the classes to the svg paths in html
        this.timeStart = Date.now();
        this.renderLoop();
    }
    close() {
        this.isOpened = false;
        this.elm.classList.remove("is-opened"); // and here it removes them
        this.timeStart = Date.now();
        this.renderLoop();
    }
    updatePath(time) {
        const points = [];
        for (var i = 0; i < this.numPoints + 1; i++) {
            points[i] = ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100;
        }

        let str = "";
        str += this.isOpened ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
        for (var i = 0; i < this.numPoints - 1; i++) {
            const p = ((i + 1) / (this.numPoints - 1)) * 100;
            const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
            str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
        }
        str += this.isOpened ? `V 0 H 0` : `V 100 H 0`;
        return str;
    }
    render() {
        if (this.isOpened) {
            for (var i = 0; i < this.path.length; i++) {
                this.path[i].setAttribute("d", this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
            }
        } else {
            for (var i = 0; i < this.path.length; i++) {
                this.path[i].setAttribute("d", this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
            }
        }
    }
    renderLoop() {
        this.render();
        if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
            requestAnimationFrame(() => {
                this.renderLoop();
            });
        } else {
            this.isAnimating = false;
        }
    }
}

(function () {
    const elmOverlay = document.querySelector(".shape-overlays");
    const overlay = new ShapeOverlays(elmOverlay);
    const load_screen__text = document.getElementById("load_screen__text");
    const load_screen = document.getElementById("load");
    overlay.isOpened = true;

    window.addEventListener("load", function () {
        // Scroll Top
        setTimeout(function () {
            load_screen__text.style.opacity = "0";
        }, 1000);

        setTimeout(function () {
            load_screen.style.backgroundColor = "transparent";
            overlay.toggle();
        }, 2000);

        // Remove the loader
        setTimeout(function () {
            document.body.removeChild(load_screen);
        }, 3000);
    });
})();
