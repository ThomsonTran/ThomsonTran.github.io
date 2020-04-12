//canvas set up
const canvas = document.getElementById("scene");
const c = canvas.getContext("2d");

canvas.height = window.innerHeight * 0.6;
canvas.width = window.innerWidth * 0.6;

window.addEventListener("resize", function (e) {
    canvas.width = window.innerWidth * 0.6;

    if (this.window.innerWidth > 1000) {
        canvas.height = window.innerHeight * 0.6 - 75;
    } else {
        canvas.height = window.innerHeight * 0.6 - 200;
    }
});

//sliders
var numSlider = document.getElementById("numSlider");
numSlider.oninput = function () {
    numOfCircles = this.value;
    init();
};

var sizeSlider = document.getElementById("sizeSlider");
sizeSlider.oninput = function () {
    sizeCoefficient = this.value / 4;
};

var canvasSlider = document.getElementById("canvasSlider");
canvasSlider.oninput = function () {
    canvas.height = window.innerHeight * (this.value / 100);
    canvas.width = window.innerWidth * (this.value / 100);
};

//mouse
var mouseX;
var mouseY;

function getCursorPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}
canvas.addEventListener("mousemove", function (e) {
    getCursorPosition(canvas, e);
});

canvas.addEventListener("mouseout", function (e) {
    mouseX = undefined;
    mouseY = undefined;
});

// animation set up
var sizeCoefficient = 1;
var startOfCanvas = 0;
var colorArray = ["#384C66", "#539DFF", "#7EABE6", "#575D66"];
var circleArray = [];

var maxRadius = 70;
var numOfCircles = 1000;

var requestAnimation;

function Circle(x, y, dy, dx, radius) {
    const randomIndexOfColorArray = Math.floor(
        Math.random() * colorArray.length
    );

    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[randomIndexOfColorArray];
    this.opacity = 0;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius * sizeCoefficient, 0, 2 * Math.PI);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.lineWidth = 1;
        c.stroke();
        c.closePath();
    };

    this.update = function () {
        if (
            this.x + this.radius * sizeCoefficient >= canvas.width ||
            this.x - this.radius * sizeCoefficient <= startOfCanvas
        ) {
            this.dx = -this.dx;
        }
        if (
            this.y + this.radius * sizeCoefficient >= canvas.height ||
            this.y - this.radius * sizeCoefficient <= startOfCanvas
        ) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        this.ifCircleIsCloseToMouseIncreaseRadius();
        this.draw();
    };

    this.ifCircleIsCloseToMouseIncreaseRadius = function () {
        if (
            mouseX - this.x < 70 &&
            mouseX - this.x > -70 &&
            mouseY - this.y < 70 &&
            mouseY - this.y > -70 &&
            this.opacity <= 1
        ) {
            this.opacity += 0.1;
            this.opacity = Math.min(1, this.opacity);
        } else if (this.opacity > 0) {
            this.opacity -= 0.05;
            this.opacity = Math.max(0, this.opacity);
        }
    };
}

function init() {
    circleArray = [];
    for (let index = 0; index < numOfCircles; index++) {
        let radius = Math.random() * 10 + 2;

        //spawms circles away from edge of canvas to avoid collision with edges on start
        let x =
            Math.random() * (canvas.width - 4 * radius * sizeCoefficient) +
            2 * radius * sizeCoefficient;
        let y =
            Math.random() * (canvas.height - 4 * radius * sizeCoefficient) +
            2 * radius * sizeCoefficient;
        let dx = (Math.random() - 0.5) * 8;
        let dy = (Math.random() - 0.5) * 8;
        circleArray.push(new Circle(x, y, dy, dx, radius));
    }
    cancelAnimationFrame(requestAnimation);
    animate();
}

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    circleArray.forEach((circle) => {
        circle.update();
    });

    requestAnimation = requestAnimationFrame(animate);
}

init();
