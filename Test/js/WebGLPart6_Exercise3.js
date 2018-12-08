import { PolygonCube } from './PolygonCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4 } from '../../js/HelperFunctions.js';
import { KeyPressManager } from '../../js/KeyPressManager.js';
import { CameraViewMatrix } from './CameraViewMatrix.js';
import { SolidSphere } from './SolidSphere.js';
import { LightObject } from './LightObject.js';
import { OrbitalObject } from './OrbitalObject.js';

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
let orbitalObject = null;


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
        uModelMatrixId : -1,
        uViewMatrixId : -1,
        uProjectionMatrix : -1,
        uSamplerId : -1,
        uEnableTextureId : -1,
        uEnableLightingId : -1,
        uNormalMatrixId : -1,
        uLightPositionId : -1,
        uLightColorId : -1
    },
    objects : {
        deepSpaceSphere : null,
        sun : null
    },
    timeStamp : null,
    textures : new Map()
};

let texBuffer = [1];

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    const canvas = document.getElementById("myCanvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    gl = createGLContext(canvas);
    initGL();

    ctx.textures.set("sun", loadTexture(gl, "./img/sun.jpg"));

    texBuffer[0] = loadTexture(gl, "./img/lena_512x512.png");
    texBuffer[1] = loadTexture(gl, "./img/space_8k.png");
    texBuffer[2] = loadTexture(gl, "./img/sun.jpg");
    texBuffer[3] = loadTexture(gl, "./img/2k_planet_neptune.jpg");

    // Cartesian axis
    cartesianObject = new CartesianObject();
    cartesianObject.setShaderAttributes(ctx.attributes);
    cartesianObject.setShaderUniforms(ctx.uniforms);
    cartesianObject.setColor(rgbToV4(255, 255, 255));
    cartesianObject.setTicks(40);
    cartesianObject.init(gl);

    // Cubes
    /*blankCube = new PolygonCube(gl);
    blankCube.setVertexColorId(ctx.attributes.aVertexColorId);
    blankCube.setVertexPositionId(ctx.attributes.aVertexPositionId);
    blankCube.setVertexNormal(ctx.attributes.aVertexNormalId);
    blankCube.setModelViewMatrixId(ctx.uniforms.uModelViewMatrixId);
    blankCube.setNormalMatrix(ctx.uniforms.uNormalMatrixId);
    blankCube.setScaling(0.25, 0.25, 0.25);
    blankCube.moveTo(0.0, 0.5, 0.0);
    blankCube.setRotation(Math.PI / 4, 0, 0);
*//*
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
*/
    // Solid Spheres
    ctx.objects.deepSpaceSphere = new SolidSphere(gl, 40, 40);
    ctx.objects.deepSpaceSphere.setShaderAttributes(ctx.attributes);
    ctx.objects.deepSpaceSphere.setShaderUniforms(ctx.uniforms);
    ctx.objects.deepSpaceSphere.setTexture(texBuffer[1]);
    ctx.objects.deepSpaceSphere.setPosition(0.0, 0.0, 0.0);
    ctx.objects.deepSpaceSphere.setScaling(30.0, 30.0, 30.0);
    ctx.objects.deepSpaceSphere.setColor(255, 0, 0);
    ctx.objects.deepSpaceSphere.setRotation(Math.PI/2.7,0,0);

    ctx.objects.sun = new SolidSphere(gl, 80, 80);
    ctx.objects.sun.setShaderAttributes(ctx.attributes);
    ctx.objects.sun.setShaderUniforms(ctx.uniforms);
    ctx.objects.sun.setTexture(texBuffer[2]);
    ctx.objects.sun.setPosition(0.0, 0.0, 0.0);
    ctx.objects.sun.setScaling(0.5, 0.5, 0.5);
    ctx.objects.sun.setColor(255, 210, 0);

    smallSolidSphere = new SolidSphere(gl, 40, 40);
    smallSolidSphere.setShaderAttributes(ctx.attributes);
    smallSolidSphere.setShaderUniforms(ctx.uniforms);
    smallSolidSphere.setTexture(texBuffer[3]);
    smallSolidSphere.setPosition(-3.0, 0.0, 0.0);
    smallSolidSphere.setScaling(0.3, 0.3, 0.3);
    smallSolidSphere.setColor(255, 255, 255);
    smallSolidSphere.setRotation(Math.PI/2,0,0);

    // Light Object
    lightObject = new LightObject(gl);
    lightObject.setShaderAttributes(ctx.attributes);
    lightObject.setShaderUniforms(ctx.uniforms);
    lightObject.setPosition(0.0, 0.0, 0.0);
    lightObject.setColor(255, 255, 200);
    lightObject.init(gl);

    // CameraMatrix
    cameraViewMatrix.setPosition(Math.PI / 3, Math.PI / 3, Math.PI / 5);
    cameraViewMatrix.setUpDirection(0.0, 0.0, 1.0);
    cameraViewMatrix.setLookAtPosition(0.0, 0.0, 0.0);
    cameraViewMatrix.setDistance(2.0);


    // Orbital TestObject
    let currModel = new SolidSphere(gl, 40, 40);
    currModel.setShaderAttributes(ctx.attributes);
    currModel.setShaderUniforms(ctx.uniforms);
    currModel.setScaling(0.2, 0.2, 0.2);
    currModel.setTexture(ctx.textures.get("sun"));
    currModel.setPosition(0.0, 0.0, 0.0);
    currModel.setRotation(Math.PI,0,0);

    orbitalObject = new OrbitalObject();
    orbitalObject.setModel(currModel);
    orbitalObject.setPosition(0.0, 0.0, 0.0);






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
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
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

    ctx.uniforms.uModelMatrixId = gl.getUniformLocation(ctx.shaderProgram, 'uModelMatrix');
    ctx.uniforms.uViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, 'uViewMatrix');
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
    const zNear = 0.001;
    const zFar = 55.0;

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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = url;

    return texture;
}


function animationLoop(currTimeStamp) {
    if(ctx.timeStamp == null) {
        ctx.timeStamp = currTimeStamp;
    }

    refreshScene(currTimeStamp - ctx.timeStamp);
    drawScene();

    ctx.timeStamp = currTimeStamp;
    window.requestAnimationFrame(animationLoop);
}


function refreshScene(deltaTime) {
    if(keyPressManager.isPressed('ArrowLeft')) { cameraViewMatrix.rotateLeft(); }
    if(keyPressManager.isPressed('ArrowRight')) { cameraViewMatrix.rotateRight(); }
    if(keyPressManager.isPressed('ArrowUp')) { cameraViewMatrix.rotateUp(); }
    if(keyPressManager.isPressed('ArrowDown')) { cameraViewMatrix.rotateDown(); }
    if(keyPressManager.isPressed('+')) { cameraViewMatrix.zoomIn(); }
    if(keyPressManager.isPressed('-')) { cameraViewMatrix.zoomOut(); }

    orbitalObject.refreshModel(deltaTime);

    /*
    blankCube.addRotationX(-0.01);
    blankCube.addRotationY(-0.005);
    texturedCube.addRotationX(0.008);
    texturedCube.addRotationY(0.005);*/
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
    lightObject.refreshLightPosition(gl, cameraMatrix);
    lightObject.draw(gl);
    enableLighting();




    // Draw all textured items
    enableTextureMode();
    //smallSolidSphere.draw(gl, cameraMatrix);
    disableLighting();
    //ctx.objects.sun.draw(gl, cameraMatrix);
    orbitalObject.draw(gl, cameraMatrix);

    ctx.objects.deepSpaceSphere.draw(gl, cameraMatrix);

    //texturedCube.draw(gl, cameraMatrix);
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