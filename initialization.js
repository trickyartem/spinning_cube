class making {
    constructor(fragS, vertS, p, bIBO, bVBO, posAL, colAL) {
        this.fragS = fragS; // fragmentShader
        this.vertS = vertS; // vertexShader
        this.p     = p;     // program
        this.bIBO  = bIBO;  // boxIndexBufferObject
        this.bVBO  = bVBO   // boxVertBufferObject
        this.posAL = posAL; // positionAttributeLocation
        this.colAL = colAL; // colorAttributeLocation
    };

    createCompileShader() {
        this.fragS = gl.createShader(gl.FRAGMENT_SHADER);
        this.vertS = gl.createShader(gl.VERTEX_SHADER);

        gl.shaderSource(this.fragS, fragmentShaderText);
        gl.shaderSource(this.vertS, vertexShaderText);
    
        gl.compileShader(this.fragS);
        if (!gl.getShaderParameter(this.fragS, gl.COMPILE_STATUS)) {
            console.error('error compiling fragment shader', gl.getShaderInfoLog(this.fragS));
        }

        gl.compileShader(this.vertS);
        if (!gl.getShaderParameter(this.vertS, gl.COMPILE_STATUS)) {
            console.error('error compiling vertex shader', gl.getShaderInfoLog(this.vertS));
        }
    }

    createProgAttachShader() {
        this.p = gl.createProgram();

        gl.attachShader(this.p, this.fragS);
        gl.attachShader(this.p, this.vertS);
        gl.linkProgram(this.p);
        if (!gl.getProgramParameter(this.p, gl.LINK_STATUS)) {
            console.error('error linking program', gl.getProgramInfoLog(this.p));
        }
    }

    bindBuffers() {
        this.bVBO = gl.createBuffer();
        this.bIBO = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bVBO);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(boxVert),
            gl.STATIC_DRAW
        );

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(boxIndexes),
            gl.STATIC_DRAW
        );
    }

    attribs() {
        this.posAL = gl.getAttribLocation(this.p, 'vertPosition');
        this.colAL = gl.getAttribLocation(this.p, 'vertColor');

        gl.vertexAttribPointer(
            this.posAL,
            3,
            gl.FLOAT,
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.vertexAttribPointer(
            this.colAL,
            3,
            gl.FLOAT,
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );
    }

    enableEverything() {
        gl.enableVertexAttribArray(this.posAL);
        gl.enableVertexAttribArray(this.colAL);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
    }
}