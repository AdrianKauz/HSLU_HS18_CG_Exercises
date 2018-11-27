import { PolygonCube } from './PolygonCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4, rgbaToV4 } from '../../js/HelperFunctions.js';
import { KeyPressManager } from '../../js/KeyPressManager.js';
import { CameraViewMatrix } from './CameraViewMatrix.js';
import { SolidSphere } from './solidSphere.js';

// Register function to call after document has loaded
window.onload = startup;

// Globals
let gl = null;
let leftCube = null;
let solidSphere = null;
let rightCube = null;
let cartesianObject = null;

let canvasHeight = 0;
let canvasWidth = 0;
const keyPressManager = new KeyPressManager();
const cameraViewMatrix = new CameraViewMatrix();

const ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    aTextureCoordId: -1,
    aVertexColorId: -1,
    uModelMatrixId: -1,
    uCameraViewMatrix: -1,
    uSampler: -1,
    uTextureModeOn: -1
};

let texBuffer = [1];


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    const canvas = document.getElementById("myCanvas");
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    gl = createGLContext(canvas);
    initGL();

    texBuffer[0] = loadTexture(gl, "./img/lena_512x512.png");

    // Left Cube
    leftCube = new PolygonCube(gl);
    leftCube.setVertexColorId(ctx.aVertexColorId);
    leftCube.setVertexPositionId(ctx.aVertexPositionId);
    leftCube.setModelMatrixId(ctx.uModelMatrixId);
    leftCube.setScaling(0.25, 0.25, 0.25);
    leftCube.moveTo(0.0, -0.5, 0.0);
    leftCube.setRotation(Math.PI/4, 0, 0);

    // Solid Sphere
    solidSphere = new SolidSphere(gl, 30, 30);

    // Right Cube
    rightCube = new PolygonCube(gl);
    rightCube.setTextureCoordId(ctx.aTextureCoordId);
    rightCube.setVertexColorId(ctx.aVertexColorId);
    rightCube.setVertexPositionId(ctx.aVertexPositionId);
    rightCube.setModelMatrixId(ctx.uModelMatrixId);
    rightCube.setSampler(ctx.uSampler);
    rightCube.setTexture(texBuffer[0]);
    rightCube.enableTexture();
    rightCube.setScaling(0.25, 0.25, 0.25);
    rightCube.moveTo(0.0, 0.5, 0.0);
    rightCube.setRotation(Math.PI/4, 0, 0);

    cartesianObject = new CartesianObject();
    cartesianObject.setModelMatrixId(ctx.uModelMatrixId);
    cartesianObject.setColor(rgbToV4(255, 255, 255));
    cartesianObject.setTicks(80);
    cartesianObject.init(gl);

    //cameraViewMatrix.setPosition(1.00, 1.00, 0.60);
    cameraViewMatrix.setPosition(Math.PI/2, Math.PI/2, Math.PI/8);
    cameraViewMatrix.setUpDirection(0.0, 0.0, 1.0);
    cameraViewMatrix.setLookAtPosition(0.0, 0.0, 0.0);
    cameraViewMatrix.setDistance(0.9);
    cameraViewMatrix.updateShader(gl, ctx.uCameraViewMatrix);

    setUpProjectionMatrix();

    keyPressManager.beginListening('ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-');

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
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");

    ctx.uCameraViewMatrix = gl.getUniformLocation(ctx.shaderProgram, 'uCameraViewMatrix');
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, 'uProjectionMatrix');
    ctx.uModelMatrixId = gl.getUniformLocation(ctx.shaderProgram, 'uModelMatrix');
    ctx.uSampler = gl.getUniformLocation(ctx.shaderProgram, 'uSampler');
    ctx.uTextureModeOn = gl.getUniformLocation(ctx.shaderProgram, 'uTextureModeOn');
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
    const pixel = new Uint8Array([0, 0, 0, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image()
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
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
    if(keyPressManager.isPressed('ArrowLeft')) { cameraViewMatrix.rotateLeft(); }
    if(keyPressManager.isPressed('ArrowRight')) { cameraViewMatrix.rotateRight(); }
    if(keyPressManager.isPressed('ArrowUp')) { cameraViewMatrix.rotateUp(); }
    if(keyPressManager.isPressed('ArrowDown')) { cameraViewMatrix.rotateDown(); }
    if(keyPressManager.isPressed('+')) { cameraViewMatrix.zoomIn(); }
    if(keyPressManager.isPressed('-')) { cameraViewMatrix.zoomOut(); }

    leftCube.addRotationX(-0.01);
    leftCube.addRotationY(-0.005);
    rightCube.addRotationX(-0.008);
    rightCube.addRotationY(-0.005);

    cameraViewMatrix.updateShader(gl, ctx.uCameraViewMatrix);
}


/**
 * Draw the scene.
 */
function drawScene() {
    "use strict";
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all blank items
    gl.uniform1i(ctx.uTextureModeOn, 0);
    cartesianObject.draw(gl, ctx);
    leftCube.draw(gl);

    let newModelMatrix = mat4.create();
    mat4.translate(newModelMatrix, newModelMatrix, [0.25, 0, 0]);
    mat4.scale(newModelMatrix, newModelMatrix, [0.20, 0.20, 0.20]);
    gl.uniformMatrix4fv(ctx.uModelMatrixId, false, newModelMatrix);
    solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, null, [1.0, 0.0, 0.0]);

    // Draw all textured items
    gl.uniform1i(ctx.uTextureModeOn, 1);
    rightCube.draw(gl);
}