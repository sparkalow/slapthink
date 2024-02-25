const img = new Image();
img.crossOrigin = "anonymous";
img.src = "/img/sketchOldman.jpeg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

img.addEventListener("load", () => {
    // ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, 0, 0,400, 300);
    img.style.display = "none";
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for(let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        console.log(red,green, blue)
    }
});

// window.addEventListener("resize", handleResize);
// handleResize();
// addParticles();
window.requestAnimationFrame(render);

function render() {
    ctx.canvas.width = 500;
    ctx.canvas.height = 300;
}