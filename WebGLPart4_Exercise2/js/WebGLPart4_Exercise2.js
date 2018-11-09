import { WireFrameCube } from './WireFrameCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4 } from './helper.js';

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
    uModelViewMat: -1
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

    cubeObject = new WireFrameCube(gl, rgbToV4(0, 153, 255));
    cartesianObject = new CartesianObject();
    cartesianObject.setColor(rgbToV4(255, 255, 255));
    cartesianObject.setTicks(40);
    cartesianObject.init(gl);

    setUpModelViewMatrix();
    setUpProjectionMatrix();
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
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMat = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
}

function setUpModelViewMatrix() {
    const modelViewMatrix = mat4.create();
    const cameraPosition = [0.70, 0.90, 1.50];
    const cameraLookingAt = [0.0, 0.0, 0.0];
    const cameraUp = [0.0, 1.0, 0.0];

    mat4.lookAt(modelViewMatrix, cameraPosition, cameraLookingAt, cameraUp);
    gl.uniformMatrix4fv(ctx.uModelViewMat, false, modelViewMatrix);
}

function setUpProjectionMatrix() {
    const projectionMatrix = mat4.create();
    const fieldOfView = 90 * Math.PI / 180;
    const aspect = canvasWidth / canvasHeight;
    const zNear = 0.01;
    const zFar = 40.0;

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMatrix);
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