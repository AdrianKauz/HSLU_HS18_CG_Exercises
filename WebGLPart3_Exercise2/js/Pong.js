//
// DI Computer Graphics
//
// WebGL Exercises
//

// Constants
const BALL = "Ball";
const NET = "Net";
const LEFT_PLAYER_NAME = "LeftPlayer";
const LEFT_PLAYER = "LeftPad";
const LEFT_PLAYER_DOWN = "a";
const LEFT_PLAYER_UP = "q";
const RIGHT_PLAYER_NAME = "RightPlayer";
const RIGHT_PLAYER = "RightPad";
const RIGHT_PLAYER_DOWN = "l";
const RIGHT_PLAYER_UP = "p";


// Ball
const BALL_DEFAULT_HEIGHT = 20;
const BALL_DEFAULT_WIDTH = 20;
const BALL_DEFAULT_VELOCITY = 360; // PPS (Pixel per Second)

// Paddles
const PADDLES_DEFAULT_HEIGHT = 100;
const PADDLES_DEFAULT_WIDTH = 10;
const PADDLES_DEFAULT_VELOCITY = 480; // PPS (Pixel per Second)


// Register function to call after document has loaded
window.onload = startup;

// Globals
var gl;
const rectangleManager = new RectangleManager();
const playerLeft = new PlayerObject();
const playerRight = new PlayerObject();
const ball = new BallObject();
var canvasHeight = 0;
var canvasWidth = 0;
var fpsWebElement = null;

const ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uModelMatId: -1
};


function RectangleManager() {
    "use strict";
    this.rectangles = [];
    this.buffer = -1;
    this.vertices = [ -0.5, -0.5,
                       0.5, -0.5,
                       0.5,  0.5,
                      -0.5,  0.5];

    this.initBuffer = function() {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }


    this.addNewObject = function(newName, newObject) {
        if(newObject != null) {
            this.rectangles.push(newObject);
        }
    }


    this.drawAll = function() {
        var currRectangle;

        for(currRectangle of this.rectangles) {
            if(currRectangle.isVisible) {
                mat3.fromTranslation(currRectangle.ModelViewMatrix, [currRectangle.PosX, currRectangle.PosY]);
                mat3.scale(currRectangle.ModelViewMatrix, currRectangle.ModelViewMatrix, [currRectangle.Width, currRectangle.Height]);
                gl.uniformMatrix3fv(ctx.uModelMatId, false, currRectangle.ModelViewMatrix);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(ctx.aVertexPositionId);

                gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            }
        }
    }
}


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    fpsWebElement = document.getElementById("fps_viewer");
    var canvas = document.getElementById("myCanvas");
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    gl = createGLContext(canvas);
    initGL();
    initObjects();
    addAllEventListener()
    gameLoop();
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpWorldCoordinates();
    gl.clearColor(0.0, 0.0, 0.0, 1);
    rectangleManager.initBuffer();
}


/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}


/**
 *  Setup the world coordinates
 */
function setUpWorldCoordinates() {
    const projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);
}


function initObjects() {
    var currRectangle = new RectangleObject();

    // First add moving objects
    currRectangle.setPosition(0, 0);
    currRectangle.setSize(BALL_DEFAULT_HEIGHT, BALL_DEFAULT_WIDTH);
    rectangleManager.addNewObject(BALL, currRectangle);
    ball.addRectangle(currRectangle);

    currRectangle = new RectangleObject();
    currRectangle.setPosition(-500, 0);
    currRectangle.setSize(PADDLES_DEFAULT_HEIGHT, PADDLES_DEFAULT_WIDTH);
    rectangleManager.addNewObject(LEFT_PLAYER, currRectangle);
    playerLeft.addRectangle(currRectangle)

    currRectangle = new RectangleObject();
    currRectangle.setPosition(500, 0);
    currRectangle.setSize(PADDLES_DEFAULT_HEIGHT, PADDLES_DEFAULT_WIDTH);
    rectangleManager.addNewObject(RIGHT_PLAYER, currRectangle);
    playerRight.addRectangle(currRectangle)

    // Add static objects
    currRectangle = new RectangleObject();
    currRectangle.setPosition(0, 0);
    currRectangle.setSize(700, 4);
    rectangleManager.addNewObject(NET, currRectangle);
}


var oldTimeStamp = null;
function gameLoop(currTimeStamp) {
    if(oldTimeStamp == null) {
        oldTimeStamp = currTimeStamp;
    }

    refreshModel(currTimeStamp - oldTimeStamp);
    drawScene();

    oldTimeStamp = currTimeStamp;
    window.requestAnimationFrame(gameLoop);
}


function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    rectangleManager.drawAll();
}


function refreshModel(deltaTime) {
    if(!isNaN(deltaTime)) {
        ball.refreshPosition(deltaTime);
        playerLeft.refreshPosition(deltaTime);
        playerRight.refreshPosition(deltaTime);
        collisionHandling();
    }
}


function collisionHandling() {
    // Left Player
    if(playerLeft.isTouchingY(340)) {
        playerLeft.PlayerIsMovingUp = false;
    }

    if(playerLeft.isTouchingY(-340)) {
        playerLeft.PlayerIsMovingDown = false;
    }

    // Right Player
    if(playerRight.isTouchingY(340)) {
        playerRight.PlayerIsMovingUp = false;
    }

    if(playerRight.isTouchingY(-340)) {
        playerRight.PlayerIsMovingDown = false;
    }

    // Ball
    if(ball.isTouchingY(340)) {
        ball.invertDirectionY();
    }

    if(ball.isTouchingY(-340)) {
        ball.invertDirectionY();
    }

    if(ball.isTouchingX(630)) {
        ball.invertDirectionX();
    }

    if(ball.isTouchingX(-630)) {
        ball.invertDirectionX();
    }




}


function addAllEventListener() {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case LEFT_PLAYER_UP:
                playerLeft.PlayerIsMovingUp = true;
                break;
            case LEFT_PLAYER_DOWN:
                playerLeft.PlayerIsMovingDown = true;
                break;
            case RIGHT_PLAYER_UP:
                playerRight.PlayerIsMovingUp = true;
                break;
            case RIGHT_PLAYER_DOWN:
                playerRight.PlayerIsMovingDown = true;
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case LEFT_PLAYER_UP:
                playerLeft.PlayerIsMovingUp = false;
                break;
            case LEFT_PLAYER_DOWN:
                playerLeft.PlayerIsMovingDown = false;
                break;
            case RIGHT_PLAYER_UP:
                playerRight.PlayerIsMovingUp = false;
                break;
            case RIGHT_PLAYER_DOWN:
                playerRight.PlayerIsMovingDown = false;
                break;
            default:
                break;
        }
    });
}



/*
================
PlayerObject()
================
*/
function PlayerObject() {
    this.PlayerIsMovingUp = false;
    this.PlayerIsMovingDown = false;
    this.PlayerVelocityY = PADDLES_DEFAULT_VELOCITY; // Pixel per second
    this.PlayerRectangleObject = null;

    this.setVelocity = function(newVelocity) {
        this.PlayerVelocityY = newVelocity;
    }

    this.isTouchingY = function(newPosY) {
        return (newPosY < (this.PlayerRectangleObject.PosY + (this.PlayerRectangleObject.Height/2))) &&
            (newPosY > (this.PlayerRectangleObject.PosY - (this.PlayerRectangleObject.Height/2)))
    }

    this.refreshPosition = function(deltaTime) {
        if(this.PlayerRectangleObject != null) {
            const moveDeltaY = ((this.PlayerVelocityY * deltaTime) / 1000);

            if(this.PlayerIsMovingUp) {
                this.PlayerRectangleObject.PosY += moveDeltaY;
            }

            if(this.PlayerIsMovingDown) {
                this.PlayerRectangleObject.PosY -= moveDeltaY;
            }
        }
    }

    this.addRectangle = function(newRectangle) {
        if(newRectangle != null) {
            this.PlayerRectangleObject = newRectangle;
        }
    }
}


/*
================
BallObject()
================
*/
function BallObject() {
    this.VelocityX = BALL_DEFAULT_VELOCITY; // Pixel per Step
    this.VelocityY = BALL_DEFAULT_VELOCITY; // Pixel per Step
    this.BallRectangleObject = null;

    this.setVelocity = function(newVelocityX, newVelocityY) {
        this.VelocityX = newVelocityX;
        this.VelocityY = newVelocityY;
    }

    this.invertDirectionX = function() {
        this.VelocityX = -this.VelocityX;
    }

    this.invertDirectionY = function() {
        this.VelocityY = -this.VelocityY;
    }

    this.isTouchingX = function(newPosX) {
        return (newPosX < (this.BallRectangleObject.PosX + (this.BallRectangleObject.Width/2))) &&
            (newPosX > (this.BallRectangleObject.PosX - (this.BallRectangleObject.Width/2)))
    }

    this.isTouchingY = function(newPosY) {
        return (newPosY < (this.BallRectangleObject.PosY + (this.BallRectangleObject.Height/2))) &&
            (newPosY > (this.BallRectangleObject.PosY - (this.BallRectangleObject.Height/2)))
    }

    this.refreshPosition = function(deltaTime) {
        const moveDeltaX = ((this.VelocityX * deltaTime) / 1000);
        const moveDeltaY = ((this.VelocityY * deltaTime) / 1000);

        if(this.BallRectangleObject != null) {
            this.BallRectangleObject.PosX += moveDeltaX;
            this.BallRectangleObject.PosY += moveDeltaY;
        }
    }

    this.addRectangle = function(newRectangle) {
        if(newRectangle != null) {
            this.BallRectangleObject = newRectangle;
        }
    }
}


/*
================
RectangleObject()
================
*/
function RectangleObject() {
    "use strict";
    this.Height = 0;
    this.Width = 0;
    this.PosX = 0;
    this.PosY = 0;
    this.ModelViewMatrix = mat3.create();
    this.isVisible = true;

    this.setPosition = function(newPosX, newPosY) {
        this.PosX = newPosX;
        this.PosY = newPosY;
    }

    this.setSize = function(newHeight, newWidth) {
        this.Height = newHeight;
        this.Width = newWidth;
    }
}