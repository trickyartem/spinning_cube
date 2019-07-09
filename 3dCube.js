const glUtil = new WebGLUtils('can');

const {
    VERTEX_SHADER,
    FRAGMENT_SHADER,
    ELEMENT_ARRAY_BUFFER,
    ARRAY_BUFFER,
    STATIC_DRAW,
    FLOAT,
    FALSE,
    TRIANGLES,
    LINES,
    POINTS
} = glUtil.gl;

glUtil.loadShader(VERTEX_SHADER,   vertexShaderText,   'vertex shader');
glUtil.loadShader(FRAGMENT_SHADER, fragmentShaderText, 'fragment shader');

glUtil.createProg();

glUtil.createBuffer(ARRAY_BUFFER,         Float32Array, boxVert,    STATIC_DRAW);
glUtil.createBuffer(ELEMENT_ARRAY_BUFFER, Uint16Array,  boxIndexes, STATIC_DRAW);

glUtil.createAttribPointer(
         'vertPosition', 
          3, 
          FLOAT, 
    FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
);

glUtil.createAttribPointer(
         'vertColor',
          3,
          FLOAT,
    FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
);

glUtil.use();

let matProj  = identity();
glMatrix.mat4.perspective(
    matProj,
    glMatrix.glMatrix.toRadian(45),
    glUtil.canvas.width / glUtil.canvas.clientHeight,
    0.1,
    1000.0
);
glUtil.loadUniformMatrix4('mProj', matProj, FALSE);

const xRotMat        = identity();
const yRotMat        = identity();
const zRotMat        = identity();
const identityMatrix = identity();
let allMat           = identity();

const loop = () => {
    let matView  = identity();
    glMatrix.mat4.lookAt(matView, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
    glUtil.loadUniformMatrix4('mView', matView, FALSE);

    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotMat, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotMat, identityMatrix, angle, [1, 0, 0]);
    glMatrix.mat4.rotate(zRotMat, identityMatrix, angle, [0, 0, 1]);

    glMatrix.mat4.mul(allMat, yRotMat, xRotMat);
    glMatrix.mat4.mul(allMat, allMat, zRotMat);
    
    let matWorld = identity();
    glMatrix.mat4.mul(matWorld, allMat, xRotMat);
    glUtil.loadUniformMatrix4('mWorld', matWorld, FALSE);
}

glUtil.draw(TRIANGLES, loop);
