function zoomIn() {
    far++;
}

function zoomOut() {
    far--;
}

function moveRight() {
    x += 0.3;
}

function moveLeft() {
    x -= 0.3;
}

function moveUp() {
    y += 0.1;
}

function moveDown() {
    y -= 0.1;
}

function reset() {
    y   = 0;
    x   = 0;
    far = -10;
}
