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

const matWorldUniformLocation = glUtil.setMatrix('mWorld', false, false);
const matProjUniformLocation  = glUtil.setMatrix('mProj',  false, true);
const matViewUniformLocation  = glUtil.setMatrix('mView',  true , false);

// const viewMatrix  = identity();
const viewMatrix  = glUtil.viewMatrix;

const xRotMat        = identity();
const yRotMat        = identity();
const zRotMat        = identity();
const identityMatrix = identity();
let allMat           = identity();

const loop = function() {
    // glUtil.dynamicCamera();
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, far], [x, y, 0], [0, 1, 0]);
    glUtil.gl.uniformMatrix4fv(matViewUniformLocation, FALSE, viewMatrix);
    
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotMat, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotMat, identityMatrix, angle, [1, 0, 0]);
    glMatrix.mat4.rotate(zRotMat, identityMatrix, angle, [0, 0, 1]);

    glMatrix.mat4.mul(allMat, yRotMat, xRotMat);
    glMatrix.mat4.mul(allMat, allMat, zRotMat);

    glMatrix.mat4.mul(glUtil.worldMatrix, allMat, xRotMat);
    glUtil.gl.uniformMatrix4fv(matWorldUniformLocation, FALSE, glUtil.worldMatrix);
    
    glUtil.draw(TRIANGLES);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);



// const matProjUniformLocation  = gl.getUniformLocation(program, 'mProj');
// const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
// const matViewUniformLocation  = gl.getUniformLocation(program, 'mView');
// const glUtil.worldMatrix = identity();
// const glUtil.projMatrix  = identity();
// glMatrix.mat4.perspective(
//     glUtil.projMatrix,
//     glMatrix.glMatrix.toRadian(45),
//     canvas.width / canvas.clientHeight,
//     0.1,
//     1000.0
// );

// gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, glUtil.worldMatrix);
// gl.uniformMatrix4fv(matProjUniformLocation,  gl.FALSE, glUtil.projMatrix);


// gl.clearColor(0.5, 0.85, 0.6, 1.0);
// gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
// gl.drawElements(gl.TRIANGLES, boxIndexes.length, gl.UNSIGNED_SHORT, 0);
