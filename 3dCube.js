const canvas = document.getElementById('can');
const gl     = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

let vertexShader;
let fragmentShader;
let program;
let boxIndexBufferObject;
let boxVertBufferObject;
let positionAttribLocation;
let colorAttribLocation;

const make = new making (
    vertexShader,
    fragmentShader,
    program,
    boxIndexBufferObject,
    boxVertBufferObject,
    positionAttribLocation,
    colorAttribLocation
);

make.createCompileShader();
make.createProgAttachShader();
make.bindBuffers();
make.attribs();

vertexShader           = make.vertS;
fragmentShader         = make.fragS;
program                = make.p;
boxIndexBufferObject   = make.bIBO;
boxVertBufferObject    = make.bVBO;
colorAttribLocation    = make.colAL;
positionAttribLocation = make.posAL;

make.enableEverything();
gl.useProgram(program);

const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
const matViewUniformLocation  = gl.getUniformLocation(program, 'mView');
const matProjUniformLocation  = gl.getUniformLocation(program, 'mProj');

const worldMatrix = identity();
const viewMatrix  = identity();
const projMatrix  = identity();

glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.clientHeight, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

const xRotMat        = identity();
const yRotMat        = identity();
const zRotMat        = identity();
const identityMatrix = identity();
let allMat           = identity();

let far = -10;
let x   = 0;
let y   = 0;
const loop = function() {
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, far], [x, y, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotMat, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotMat, identityMatrix, angle, [1, 0, 0]);
    glMatrix.mat4.rotate(zRotMat, identityMatrix, angle, [0, 0, 1]);

    glMatrix.mat4.mul(allMat, yRotMat, xRotMat);
    glMatrix.mat4.mul(allMat, allMat, zRotMat);

    glMatrix.mat4.mul(worldMatrix, allMat, xRotMat);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.5, 0.85, 0.6, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, boxIndexes.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
