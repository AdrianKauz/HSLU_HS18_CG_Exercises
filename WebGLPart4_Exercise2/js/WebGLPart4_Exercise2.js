import { WireFrameCube } from './WireFrameCube.js';


// Register function to call after document has loaded
window.onload = startup;

// Globals
var gl;

var canvasHeight = 0;
var canvasWidth = 0;

const ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
let cubeObject = null;


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    gl = createGLContext(canvas);
    initGL();
    cubeObject = new WireFrameCube(gl);
    draw();
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
    setUpAttributesAndUniforms();
    //setUpWorldCoordinates();
    gl.clearColor(0.0, 0.0, 0.0, 1);
    //setUpBuffers();
}


/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    //ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}


function setUpBuffers(){
    "use strict";

    const vertices = [ -0.25, -0.25, 0.0,  // v0
                        0.25, -0.25, 0.0,  // v1
                        0.25,  0.25, 0.0,  // v2
                       -0.25,  0.25, 0.0]; // v3

    cubeObject.verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeObject.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const vertexIndices = [ 0, 1,
                            1, 2,
                            2, 3,
                            3, 0];

    cubeObject.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeObject.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
}


/**
 *  Setup the world coordinates
 */
function setUpWorldCoordinates() {
    const projectionMat = mat4.create();
    mat4.fromScaling(projectionMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMat);
}


/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    cubeObject.draw(gl, ctx.aVertexPositionId, ctx.uColorId)

    /*
    gl.uniform4f(ctx.uColorId, 1.0, 0.0, 0.0, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeObject.verticesBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeObject.indicesBuffer);
    gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 0);*/
}