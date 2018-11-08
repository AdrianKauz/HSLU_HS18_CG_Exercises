import { WireFrameCube } from './WireFrameCube.js';
import { CartesianObject } from './CartesianObject.js';

// Register function to call after document has loaded
window.onload = startup;

// Globals
var gl;

var canvasHeight = 0;
var canvasWidth = 0;

const ctx = {
    shaderProgram: -1,
    //uProjectionMatId: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
let cubeObject = null;
let cartesianObject = null;

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
    cartesianObject = new CartesianObject();
    cartesianObject.setDefaults();
    cartesianObject.init(gl);

    setUpModelMatrix();
    draw();
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
    setUpAttributesAndUniforms();
    gl.clearColor(0.0, 0.0, 0.0, 1);
}


/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    //ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

function setUpModelMatrix() {
    let modelViewMatrix = mat4.create();
    let cameraPosition = [0.1, 0.03, 0.02];
    let cameraLookingAt = [0.0, 0.0, 0.0];
    let cameraUp = [0.0, -1.0, 0.0];

    mat4.lookAt(modelViewMatrix, cameraPosition, cameraLookingAt, cameraUp)

    //let projection = mat4.create();
    //projection = mat4.perspective(projection, Math.PI * 0.25, 1, 0.0001, 500)


    //let final = mat4.multiply(projection, view);

/*
    mat4.perspective(modelMat, Math.PI * 0.25, 1, 0.0001, 500);
    mat4.lookAt(modelMat, cameraPosition, cameraLookingAt, cameraUp);
*/
    gl.uniformMatrix4fv(ctx.uModelMatId, false, modelViewMatrix);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    cubeObject.draw(gl, ctx.aVertexPositionId, ctx.uColorId)
    cartesianObject.draw(gl, ctx.aVertexPositionId, ctx.uColorId)
}