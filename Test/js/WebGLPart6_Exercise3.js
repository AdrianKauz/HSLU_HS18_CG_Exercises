import { PolygonCube } from './PolygonCube.js';
import { CartesianObject } from './CartesianObject.js';
import { rgbToV4 } from '../../js/HelperFunctions.js';
import { KeyPressManager } from '../../js/KeyPressManager.js';
import { CameraViewMatrix } from './CameraViewMatrix.js';
import { SolidSphere } from './SolidSphere.js';
import { SimpleSolidSphere } from './SimpleSolidSphere.js';
import { LightObject } from './LightObject.js';
import { OrbitalObject } from './OrbitalObject.js';
import { Config } from './Config.js';

// Register function to call after document has loaded
window.onload = startup;

// Globals
let gl = null;
let smallSolidSphere = null;
let cartesianObject = null;
let lightObject = null;
let orbitalObject = null;


let canvasHeight = 0;
let canvasWidth = 0;
const keyPressManager = new KeyPressManager();
const cameraViewMatrix = new CameraViewMatrix();

const config = new Config();

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
        orbitalObjects : new Map(),
        orbitalChain : null
    },
    canvas : {
        height : 0,
        width : 0,
        ratio : 0
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
    ctx.canvas.height = canvas.height;
    ctx.canvas.width = canvas.width;
    ctx.canvas.ratio = ctx.canvas.width / ctx.canvas.height;
    gl = createGLContext(canvas);
    initGL();

    ctx.textures.set("Sun", loadTexture(gl, "./img/sun.jpg"));
    ctx.textures.set("DeepSpace", loadTexture(gl, "./img/8k_deep_space_004.png"));
    ctx.textures.set("Mercury", loadTexture(gl, "./img/2k_planet_mercury.jpg"));
    ctx.textures.set("NeptuneMoon", loadTexture(gl, "./img/1k_neptune_moon.png"));
    ctx.textures.set("Earth", loadTexture(gl, "./img/2k_planet_earth_with_clouds.jpg"));
    ctx.textures.set("Venus", loadTexture(gl, "./img/2k_planet_venus.jpg"));
    ctx.textures.set("Mars", loadTexture(gl, "./img/2k_planet_mars.jpg"));
    ctx.textures.set("Jupiter", loadTexture(gl, "./img/2k_planet_jupiter.jpg"));
    ctx.textures.set("Moon", loadTexture(gl, "./img/2k_moon.jpg"));

    // Cartesian axis
    cartesianObject = new CartesianObject();
    cartesianObject.setShaderAttributes(ctx.attributes);
    cartesianObject.setShaderUniforms(ctx.uniforms);
    cartesianObject.setColor(rgbToV4(255, 255, 255));
    cartesianObject.setTicks(40);
    cartesianObject.init(gl);

    // Orbital Objects
    defineOrbitalObjects();

    // Solid Spheres
    ctx.objects.deepSpaceSphere = new SolidSphere(gl, 40, 40);
    ctx.objects.deepSpaceSphere.setShaderAttributes(ctx.attributes);
    ctx.objects.deepSpaceSphere.setShaderUniforms(ctx.uniforms);
    ctx.objects.deepSpaceSphere.setTexture(ctx.textures.get("DeepSpace"));
    ctx.objects.deepSpaceSphere.setPosition(0.0, 0.0, 0.0);
    ctx.objects.deepSpaceSphere.setScaling(40.0, 40.0, 40.0);
    ctx.objects.deepSpaceSphere.setColor(255, 0, 0);
    ctx.objects.deepSpaceSphere.setRotation(Math.PI/2.7,0,0);

    // Light Object
    lightObject = new LightObject(gl);
    lightObject.setShaderAttributes(ctx.attributes);
    lightObject.setShaderUniforms(ctx.uniforms);
    lightObject.setPosition(0.0, 0.0, 0.0);
    lightObject.setColor(255, 255, 255);
    lightObject.init(gl);

    // CameraMatrix
    cameraViewMatrix.setPosition(-Math.PI/3, Math.PI/3*2, Math.PI / 5);
    cameraViewMatrix.setUpDirection(0.0, 0.0, 1.0);
    cameraViewMatrix.setLookAtPosition(0.0, 0.0, 0.0);
    cameraViewMatrix.setDistance(5.0);

    // ProjektionMatrix
    setUpProjectionMatrix();

    // Key-Listener
    keyPressManager.beginListening('ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-');

    // Start Animation-Loop
    animationLoop();
}


function defineOrbitalObjects() {
    // Sun (Defines first object in the orbital chain)
    let sunModel = new SimpleSolidSphere(gl, 40, 40);
    sunModel.setShaderAttributes(ctx.attributes);
    sunModel.setShaderUniforms(ctx.uniforms);
    sunModel.setTexture(ctx.textures.get("Sun"));

    let sunObject = new OrbitalObject();
    sunObject.setAllInOneConfig(sunModel, config.orbitalObjects.sun, config.dimensions);

    let mercuryModel = new SimpleSolidSphere(gl, 40, 40);
    mercuryModel.setShaderAttributes(ctx.attributes);
    mercuryModel.setShaderUniforms(ctx.uniforms);
    mercuryModel.setTexture(ctx.textures.get("Mercury"));
    mercuryModel.enableLighting();

    let mercuryObject = new OrbitalObject();
    mercuryObject.setAllInOneConfig(mercuryModel, config.orbitalObjects.mercury, config.dimensions);

    let venusModel = new SimpleSolidSphere(gl, 40, 40);
    venusModel.setShaderAttributes(ctx.attributes);
    venusModel.setShaderUniforms(ctx.uniforms);
    venusModel.setTexture(ctx.textures.get("Venus"));
    venusModel.enableLighting();

    let venusObject = new OrbitalObject();
    venusObject.setAllInOneConfig(venusModel, config.orbitalObjects.venus, config.dimensions);

    let earthModel = new SimpleSolidSphere(gl, 40, 40);
    earthModel.setShaderAttributes(ctx.attributes);
    earthModel.setShaderUniforms(ctx.uniforms);
    earthModel.setTexture(ctx.textures.get("Earth"));
    earthModel.enableLighting();

    let earthObject = new OrbitalObject();
    earthObject.setAllInOneConfig(earthModel, config.orbitalObjects.earth, config.dimensions);

    let moonModel = new SimpleSolidSphere(gl, 40, 40);
    moonModel.setShaderAttributes(ctx.attributes);
    moonModel.setShaderUniforms(ctx.uniforms);
    moonModel.setTexture(ctx.textures.get("Moon"));
    moonModel.enableLighting();

    let moonObject = new OrbitalObject();
    moonObject.setAllInOneConfig(moonModel, config.orbitalObjects.moon, config.dimensions);

    let marsModel = new SimpleSolidSphere(gl, 40, 40);
    marsModel.setShaderAttributes(ctx.attributes);
    marsModel.setShaderUniforms(ctx.uniforms);
    marsModel.setTexture(ctx.textures.get("Mars"));
    marsModel.enableLighting();

    let marsObject = new OrbitalObject();
    marsObject.setAllInOneConfig(marsModel, config.orbitalObjects.mars, config.dimensions);

    let jupiterModel = new SimpleSolidSphere(gl, 40, 40);
    jupiterModel.setShaderAttributes(ctx.attributes);
    jupiterModel.setShaderUniforms(ctx.uniforms);
    jupiterModel.setTexture(ctx.textures.get("Jupiter"));
    jupiterModel.enableLighting();

    let jupiterObject = new OrbitalObject();
    jupiterObject.setAllInOneConfig(jupiterModel, config.orbitalObjects.jupiter, config.dimensions);


    sunObject.addChild(mercuryObject);
    sunObject.addChild(venusObject);
    earthObject.addChild(moonObject);
    sunObject.addChild(earthObject);
    sunObject.addChild(marsObject);
    sunObject.addChild(jupiterObject);

    ctx.objects.orbitalChain = sunObject;
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
    setUpAttributesAndUniforms();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
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
    const aspect = ctx.canvas.ratio;
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
    else {
        refreshScene(currTimeStamp - ctx.timeStamp);
        drawScene();

        ctx.timeStamp = currTimeStamp;
    }

    window.requestAnimationFrame(animationLoop);
}


function refreshScene(deltaTime) {
    if(keyPressManager.isPressed('ArrowLeft')) { cameraViewMatrix.rotateLeft(); }
    if(keyPressManager.isPressed('ArrowRight')) { cameraViewMatrix.rotateRight(); }
    if(keyPressManager.isPressed('ArrowUp')) { cameraViewMatrix.rotateUp(); }
    if(keyPressManager.isPressed('ArrowDown')) { cameraViewMatrix.rotateDown(); }
    if(keyPressManager.isPressed('+')) { cameraViewMatrix.zoomIn(); }
    if(keyPressManager.isPressed('-')) { cameraViewMatrix.zoomOut(); }

    //orbitalObject.refreshModel(deltaTime);
    ctx.objects.orbitalChain.refreshModel(deltaTime);
}


/**
 * Draw the scene.
 */
function drawScene() {
    "use strict";
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let cameraMatrix = cameraViewMatrix.getMatrix();

    disableTextureMode();
    disableLighting();
    // First draw and set cartesian and light object
    cartesianObject.draw(gl, cameraMatrix);
    lightObject.refreshLightPosition(gl, cameraMatrix);
    lightObject.draw(gl);

    // Then draw all orbital objects
    enableTextureMode();
    ctx.objects.deepSpaceSphere.draw(gl, cameraMatrix);
    ctx.objects.orbitalChain.draw(gl, cameraMatrix);
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