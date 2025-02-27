import { PolygonCube } from './PolygonCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4 } from '../../js/HelperFunctions.js';
import { KeyPressManager } from '../../js/KeyPressManager.js';
import { CameraViewMatrix } from './CameraViewMatrix.js';
import { SolidSphere } from './SolidSphere.js';
import { LightObject } from './LightObject.js';

// Register function to call after document has loaded
window.onload = startup;

// Globals
let gl = null;
let blankCube = null;
let bigSolidSphere = null;
let mediumSolidSphere = null;
let smallSolidSphere = null;
let texturedCube = null;
let cartesianObject = null;
let lightObject = null;

let canvasHeight = 0;
let canvasWidth = 0;
const keyPressManager = new KeyPressManager();
const cameraViewMatrix = new CameraViewMatrix();

const ctx = {
    shaderProgram : -1,
    uProjectionMatId : -1,
    attributes : {
        aVertexPositionId : -1,
        aTextureCoordId : -1,
        aVertexColorId : -1,
        aVertexNormalId : -1
    },
    uniforms : {
        uModelViewMatrixId : -1,
        uSamplerId : -1,
        uEnableTextureId : -1,
        uEnableLightingId : -1,
        uNormalMatrixId : -1,
        uLightPositionId : -1,
        uLightColorId : -1
    }
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

    // Cartesian axis
    cartesianObject = new CartesianObject();
    cartesianObject.setVertexColorId(ctx.attributes.aVertexColorId);
    cartesianObject.setVertexPositionId(ctx.attributes.aVertexPositionId);
    cartesianObject.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    cartesianObject.setColor(rgbToV4(255, 255, 255));
    cartesianObject.setTicks(80);
    cartesianObject.init(gl);

    // Cubes
    blankCube = new PolygonCube(gl);
    blankCube.setVertexColorId(ctx.attributes.aVertexColorId);
    blankCube.setVertexPositionId(ctx.attributes.aVertexPositionId);
    blankCube.setVertexNormal(ctx.attributes.aVertexNormalId);
    blankCube.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    blankCube.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    blankCube.setScaling(0.25, 0.25, 0.25);
    blankCube.moveTo(0.0, 0.5, 0.0);
    blankCube.setRotation(Math.PI / 4, 0, 0);

    texturedCube = new PolygonCube(gl);
    texturedCube.setTextureCoordId(ctx.attributes.aTextureCoordId);
    texturedCube.setVertexColorId(ctx.attributes.aVertexColorId);
    texturedCube.setVertexPositionId(ctx.attributes.aVertexPositionId);
    texturedCube.setVertexNormal(ctx.attributes.aVertexNormalId);
    texturedCube.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    texturedCube.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    texturedCube.setSampler(ctx.uniforms.uSamplerId);
    texturedCube.setTexture(texBuffer[0]);
    texturedCube.enableTexture();
    texturedCube.setScaling(0.35, 0.35, 0.35);
    texturedCube.moveTo(0.0, -0.5, 0.0);
    texturedCube.setRotation(Math.PI / 4, 0, 0);

    // Solid Spheres
    bigSolidSphere = new SolidSphere(gl, 40, 40);
    bigSolidSphere.setVertexPositionId(ctx.attributes.aVertexPositionId);
    bigSolidSphere.setVertexColorId(ctx.attributes.aVertexColorId);
    bigSolidSphere.setVertexNormal(ctx.attributes.aVertexNormalId);
    bigSolidSphere.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    bigSolidSphere.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    bigSolidSphere.setPosition(-0.7, 0.0, 0.0);
    bigSolidSphere.setScaling(0.3, 0.3, 0.3);
    bigSolidSphere.setColor(255, 0, 0);

    mediumSolidSphere = new SolidSphere(gl, 40, 40);
    mediumSolidSphere.setVertexPositionId(ctx.attributes.aVertexPositionId);
    mediumSolidSphere.setVertexColorId(ctx.attributes.aVertexColorId);
    mediumSolidSphere.setVertexNormal(ctx.attributes.aVertexNormalId);
    mediumSolidSphere.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    mediumSolidSphere.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    mediumSolidSphere.setPosition(0.0, 0.0, 0.0);
    mediumSolidSphere.setScaling(0.2, 0.2, 0.2);
    mediumSolidSphere.setColor(0, 255, 0);

    smallSolidSphere = new SolidSphere(gl, 40, 40);
    smallSolidSphere.setVertexPositionId(ctx.attributes.aVertexPositionId);
    smallSolidSphere.setVertexColorId(ctx.attributes.aVertexColorId);
    smallSolidSphere.setVertexNormal(ctx.attributes.aVertexNormalId);
    smallSolidSphere.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    smallSolidSphere.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    smallSolidSphere.setPosition(0.5, 0.0, 0.0);
    smallSolidSphere.setScaling(0.1, 0.1, 0.1);
    smallSolidSphere.setColor(0, 0, 255);

    // Light Object
    lightObject = new LightObject(gl);
    lightObject.setVertexPositionId(ctx.attributes.aVertexPositionId);
    lightObject.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    lightObject.setVertexColorId(ctx.attributes.aVertexColorId);
    lightObject.setLightColorId(ctx.uniforms.uLightColorId);
    lightObject.setLightPositionId(ctx.uniforms.uLightPositionId);
    lightObject.setPosition(10.0, 20.0, 15.0);
    lightObject.setColor(255, 255, 255);
    lightObject.init(gl);

    // CameraMatrix
    cameraViewMatrix.setPosition(Math.PI / 3, Math.PI / 3, Math.PI / 5);
    cameraViewMatrix.setUpDirection(0.0, 0.0, 1.0);
    cameraViewMatrix.setLookAtPosition(0.0, 0.0, 0.0);
    cameraViewMatrix.setDistance(2.0);

    // ProjektionMatrix
    setUpProjectionMatrix();

    // Key-Listener
    keyPressManager.beginListening('ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-');

    // Start Animation-Loop
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
    ctx.attributes.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, 'aVertexPosition');
    ctx.attributes.aTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, 'aTextureCoord');
    ctx.attributes.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.attributes.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");

    ctx.uniforms.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, 'uModelViewMatrix');
    ctx.uniforms.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, 'uProjectionMatrix');
    ctx.uniforms.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, 'uSampler');
    ctx.uniforms.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, 'uEnableTexture');
    ctx.uniforms.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, 'uEnableLighting');
    ctx.uniforms.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, 'uNormalMatrix');
    ctx.uniforms.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, 'uLightPosition');
    ctx.uniforms.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, 'uLightColor');
}


function setUpProjectionMatrix() {
    const projectionMatrix = mat4.create();
    const fieldOfView = glMatrix.toRadian(40) /*Math.PI * 0.5*/;
    const aspect = canvasWidth / canvasHeight;
    const zNear = 0.1;
    const zFar = 30.0;

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    gl.uniformMatrix4fv(ctx.uniforms.uProjectionMatId, false, projectionMatrix);
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

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    };

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

    blankCube.addRotationX(-0.01);
    blankCube.addRotationY(-0.005);
    texturedCube.addRotationX(0.008);
    texturedCube.addRotationY(0.005);
}


/**
 * Draw the scene.
 */
function drawScene() {
    "use strict";
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let cameraMatrix = cameraViewMatrix.getMatrix();

    // Draw all blank items
    disableTextureMode();
    disableLighting();
    cartesianObject.draw(gl, cameraMatrix);
    enableLighting();
    blankCube.draw(gl, cameraMatrix);
    bigSolidSphere.draw(gl, cameraMatrix);
    smallSolidSphere.draw(gl, cameraMatrix);
    mediumSolidSphere.draw(gl, cameraMatrix);

    // Draw all textured items
    enableTextureMode();
    texturedCube.draw(gl, cameraMatrix);
}


function enableTextureMode() {
    gl.uniform1i(ctx.uniforms.uEnableTextureId, 1);
}


function disableTextureMode() {
    gl.uniform1i(ctx.uniforms.uEnableTextureId, 0);
}


function enableLighting() {
    gl.uniform1i(ctx.uniforms.uEnableLightingId, 1);
}


function disableLighting() {
    gl.uniform1i(ctx.uniforms.uEnableLightingId, 0);
}