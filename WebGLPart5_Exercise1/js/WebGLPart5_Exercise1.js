import { PolygonCube } from './PolygonCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4 } from '../../js/HelperFunctions.js';
import { KeyPressManager } from '../../js/KeyPressManager.js';
import { ModelViewMatrix } from './ModelViewMatrix.js';

// Register function to call after document has loaded
window.onload = startup;

// Globals
let gl = null;
let cubeObject = null;
let cartesianObject = null;

let canvasHeight = 0;
let canvasWidth = 0;
const keyPressManager = new KeyPressManager();
const modelViewMatrix = new ModelViewMatrix();

const ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    uModelViewMat: -1
};


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

    cubeObject = new PolygonCube(gl);
    cartesianObject = new CartesianObject();
    cartesianObject.setColor(rgbToV4(255, 255, 255));
    cartesianObject.setTicks(60);
    cartesianObject.init(gl);

    keyPressManager.beginListening('ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-');

    modelViewMatrix.updateVertexShader(gl, ctx.uModelViewMat);

    setUpProjectionMatrix();
    animationLoop();
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
    setUpAttributesAndUniforms();
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clearDepth(1.0);
}


/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelViewMat = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
}


function setUpProjectionMatrix() {
    const projectionMatrix = mat4.create();
    const fieldOfView = Math.PI * 0.5;
    const aspect = canvasWidth / canvasHeight;
    const zNear = 0.01;
    const zFar = 40.0;

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMatrix);
}

function animationLoop() {
    refreshScene();
    drawScene();

    window.requestAnimationFrame(animationLoop);
}


function refreshScene() {
    if(keyPressManager.isPressed('ArrowLeft')) { modelViewMatrix.rotateLeft(); }
    if(keyPressManager.isPressed('ArrowRight')) { modelViewMatrix.rotateRight(); }
    if(keyPressManager.isPressed('ArrowUp')) { modelViewMatrix.rotateUp(); }
    if(keyPressManager.isPressed('ArrowDown')) { modelViewMatrix.rotateDown(); }
    if(keyPressManager.isPressed('+')) { modelViewMatrix.zoomIn(); }
    if(keyPressManager.isPressed('-')) { modelViewMatrix.zoomOut(); }

    modelViewMatrix.updateVertexShader(gl, ctx.uModelViewMat);
}


/**
 * Draw the scene.
 */
function drawScene() {
    "use strict";
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    cubeObject.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId)
    cartesianObject.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId)
}