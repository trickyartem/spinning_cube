class WebGLUtils {
    /**
     * 
     * @param {String} canvasId 
     */

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`canvas is not here with id #${canvasId}`)
        }

        this.gl      = this.canvas.getContext('webgl');

        if (!this.gl) {
            throw new Error('WebGL is not supported');
        }
        const {
            COLOR_BUFFER_BIT,
            DEPTH_BUFFER_BIT,
            CULL_FACE,
            CCW,
            BACK,
            DEPTH_TEST
        } = this.gl;

        this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
        this.gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
        this.shaders = [];
        this.buffers = [];

        this.gl.enable(CULL_FACE);
        this.gl.frontFace(CCW);
        this.gl.cullFace(BACK);
        this.gl.enable(DEPTH_TEST);
    }

    /**
     * 
     * @param {Number} type type of shader
     * @param {String} srcCode source code for shader
     * @param {String} shaderName shader name
     */

    loadShader(type, srcCode, shaderName) {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, srcCode);
    
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`error compiling ${shaderName}`, this.gl.getShaderInfoLog(shader));
        }
        this.shaders.push(shader);
    }

    createProg() {
        if (this.shaders.length === 0) {
            throw new Error('there is no shaders to link');
        }

        this.program = this.gl.createProgram();

        for (let i = 0; i < this.shaders.length; i++) {
            this.gl.attachShader(this.program, this.shaders[i]);
        }
    
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('error linking program', this.gl.getProgramInfoLog(this.program));
        }
    }

    /**
     * 
     * @param {Number} type type of buffer
     * @param {any} size type of array to create
     * @param {Array} elements array of elements
     * @param {Number} drawType how to draw
     */

    createBuffer(type, size, elements, drawType) {
        const buffer = this.gl.createBuffer();

        this.gl.bindBuffer(type, buffer);
        this.gl.bufferData(
            type,
            new size(elements),
            drawType
        );
        this.buffers.push(buffer);
    }

    /**
     * 
     * @param {String} name name of attribute
     * @param {Number} size 
     * @param {Number} type 
     * @param {Boolean} normalized 
     * @param {Number} stride 
     * @param {Number} offset 
     */

    createAttribPointer(name, size, type, normalized, stride, offset) {
        const attribLoc = this.gl.getAttribLocation(this.program, name);
        if (attribLoc < 0) {
            throw new Error(`Wrong name in attribute location: ${name}`);
        }

        this.gl.vertexAttribPointer(
            attribLoc,
            size,
            type,
            normalized,
            stride,
            offset
        );

        this.gl.enableVertexAttribArray(attribLoc);
    }

    use() {
        if (this.program === undefined) {
            throw new Error('Program does not exit');
        }

        this.gl.useProgram(this.program);
    }

    /**
     * 
     * @param {String} name where to set 
     * @param {mat4} mat4 matrix to load
     * @param {any} transpose gl.FALSE | gl.TRUE
     */

    loadUniformMatrix4(name, mat4, transpose) {
        const uniformLoc = this.gl.getUniformLocation(this.program, name);
        this.gl.uniformMatrix4fv(uniformLoc, transpose, mat4);
    }

    /**
     * 
     * @param {Number} type how to draw
     */

    // draw, can draw different types 
    draw = (type, callback) => {
        this.gl.clearColor(0.5, 0.85, 0.6, 1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        callback();
        this.gl.drawElements(type, boxIndexes.length, this.gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(() => this.draw(type, callback));
    }
}