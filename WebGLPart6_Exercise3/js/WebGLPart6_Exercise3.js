import { PolygonCube } from './PolygonCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4, multiplyMat4V3 } from '../../js/HelperFunctions.js';
import { KeyPressManager } from '../../js/KeyPressManager.js';
import { CameraViewMatrix } from './CameraViewMatrix.js';
import { SolidSphere } from './SolidSphere.js';

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

    // Left Cube
    leftCube = new PolygonCube(gl);
    leftCube.setVertexColorId(ctx.attributes.aVertexColorId);
    leftCube.setVertexPositionId(ctx.attributes.aVertexPositionId);
    leftCube.setVertexNormal(ctx.attributes.aVertexNormalId);
    leftCube.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    leftCube.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    leftCube.setScaling(0.25, 0.25, 0.25);
    leftCube.moveTo(0.0, -0.5, 0.0);
    leftCube.setRotation(Math.PI/4, 0, 0);

    // Solid Sphere
    solidSphere = new SolidSphere(gl, 40, 40);

    // Right Cube
    rightCube = new PolygonCube(gl);
    rightCube.setTextureCoordId(ctx.attributes.aTextureCoordId);
    rightCube.setVertexColorId(ctx.attributes.aVertexColorId);
    rightCube.setVertexPositionId(ctx.attributes.aVertexPositionId);
    rightCube.setVertexNormal(ctx.attributes.aVertexNormalId);
    rightCube.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    rightCube.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    rightCube.setSampler(ctx.uniforms.uSamplerId);
    rightCube.setTexture(texBuffer[0]);
    rightCube.enableTexture();
    rightCube.setScaling(0.25, 0.25, 0.25);
    rightCube.moveTo(0.0, 0.5, 0.0);
    rightCube.setRotation(Math.PI/4, 0, 0);


    cameraViewMatrix.setPosition(Math.PI/2, Math.PI/2, Math.PI/8);
    cameraViewMatrix.setUpDirection(0.0, 0.0, 1.0);
    cameraViewMatrix.setLookAtPosition(0.0, 0.0, 0.0);
    cameraViewMatrix.setDistance(2.0);

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

    leftCube.addRotationX(-0.01);
    leftCube.addRotationY(-0.005);
    rightCube.addRotationX(-0.008);
    rightCube.addRotationY(-0.005);
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

    //console.log(multiplyMat4V3(cameraMatrix, [10.0, 20.0, 20.0]));

    //gl.uniform3fv(ctx.uniforms.uLightPositionId, multiplyMat4V3(cameraMatrix, [20.0, 20.0, 20.0]));
    gl.uniform3fv(ctx.uniforms.uLightPositionId, [20.0, 20.0, 20.0]);
    gl.uniform3fv(ctx.uniforms.uLightColorId, [1.0, 1.0, 1.0]);


    // Draw all blank items
    disableTextureMode();
    disableLighting();
    cartesianObject.draw(gl, cameraMatrix);
    enableLighting();
    leftCube.draw(gl, cameraMatrix);

    let newModelMatrix = mat4.create();
    mat4.translate(newModelMatrix, cameraMatrix, [0.0, 0.0, 0.0]);
    mat4.scale(newModelMatrix, newModelMatrix, [0.20, 0.20, 0.20]);
    gl.uniformMatrix4fv(ctx.uniforms.uModelViewMatrixId, false, newModelMatrix);
    let normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, newModelMatrix);
    gl.uniformMatrix3fv(ctx.uniforms.uNormalMatrixId, false, normalMatrix);
    solidSphere.draw(gl, ctx.attributes.aVertexPositionId, ctx.attributes.aVertexColorId, ctx.attributes.aVertexNormalId, [1.0, 0.0, 0.0]);

    // Draw all textured items
    enableTextureMode();
    rightCube.draw(gl, cameraMatrix);
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