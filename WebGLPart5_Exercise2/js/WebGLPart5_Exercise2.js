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
    aTextureCoordId: -1,
    uModelViewMat: -1,
    uSampler: -1
};

let texBuffer = [1];


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

    texBuffer[0] = loadTexture(gl, "./img/lena_512x512.png");

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
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, 'aVertexPosition');
    ctx.aTextureCoordId =   gl.getAttribLocation(ctx.shaderProgram, 'aTextureCoord');

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, 'uProjectionMatrix');
    ctx.uModelViewMat = gl.getUniformLocation(ctx.shaderProgram, 'uModelViewMatrix');
    ctx.uSampler = gl.getUniformLocation(ctx.shaderProgram, 'uSampler');
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


function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image()
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    image.src = url;

    return texture;
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

    cubeObject.draw(gl, ctx.aVertexPositionId, ctx.aTextureCoordId, ctx.uSampler, texBuffer[0]);
    //cartesianObject.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId)
}