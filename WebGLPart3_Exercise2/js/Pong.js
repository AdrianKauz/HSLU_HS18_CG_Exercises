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
const PLAYER_DEFAULT_VELOCITY = 10;



// Register function to call after document has loaded
window.onload = startup;

// Globals
var gl;
var rectangleManager = new RectangleManager();
var playerLeft = new PlayerObject();
var playerRight = new PlayerObject();
var ball = new BallObject();
var canvasHeigth = 0;
var canvasWidth = 0;

var ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uModelMatId: -1
};



function RectangleManager() {
    "use strict";
    this.rectangles = new Dictionary();
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
            this.rectangles.add(newName, newObject);
        }
    }


    this.drawAll = function() {
        for(var x = 0; x < this.rectangles.count(); x++) {
            var currRectangle = this.rectangles.get(x);

            if(currRectangle.isVisible) {
                var modelMat = mat3.create(); // New 3x3-Matrix

                mat3.fromTranslation(modelMat, [currRectangle.PosX, currRectangle.PosY]);
                mat3.scale(modelMat,modelMat, [currRectangle.Width, currRectangle.Height]);
                gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

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
    var canvas = document.getElementById("myCanvas");
    canvasHeigth = canvas.height;
    canvasWidth = canvas.width;
    gl = createGLContext(canvas);
    initGL();
    initObjects();
    addAllEventListener()
    draw();
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
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);
}


function initObjects() {
    var currRectangle = new RectangleObject();

    // First add moving objects
    currRectangle.setPosition(0, 0);
    currRectangle.setSize(20, 20);
    rectangleManager.addNewObject(BALL, currRectangle);
    ball.addRectangle(currRectangle);

    currRectangle = new RectangleObject();
    currRectangle.setPosition(-500, 0);
    currRectangle.setSize(100, 10);
    rectangleManager.addNewObject(LEFT_PLAYER, currRectangle);
    playerLeft.addRectangle(currRectangle)

    currRectangle = new RectangleObject();
    currRectangle.setPosition(500, 0);
    currRectangle.setSize(100, 10);
    rectangleManager.addNewObject(RIGHT_PLAYER, currRectangle);
    playerRight.addRectangle(currRectangle)

    // Add static objects
    currRectangle = new RectangleObject();
    currRectangle.setPosition(0, 0);
    currRectangle.setSize(700, 4);
    rectangleManager.addNewObject(NET, currRectangle);
}


var oldTimeStamp = null;
function gameLoop(newTimeStamp = 0) {
    if(oldTimeStamp === null) {
        oldTimeStamp = newTimeStamp
    }

    if((newTimeStamp - oldTimeStamp) > 10) {
        oldTimeStamp = newTimeStamp;
        refreshModel();
        draw();
    }
    window.requestAnimationFrame(gameLoop);
}


function refreshModel() {
    collisionHandling()
    playerLeft.refreshPosition();
    playerRight.refreshPosition();
    //refreshBall()
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


}


function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    rectangleManager.drawAll();
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
    this.PlayerVelocityY = PLAYER_DEFAULT_VELOCITY; // Pixel per Step
    this.PlayerRectangleObject = null;

    this.setVelocity = function(newVelocity) {
        this.PlayerVelocityY = newVelocity;
    }

    this.isTouchingY = function(newPosY) {
        return (newPosY < (this.PlayerRectangleObject.PosY + (this.PlayerRectangleObject.Height/2))) &&
            (newPosY > (this.PlayerRectangleObject.PosY - (this.PlayerRectangleObject.Height/2)))
    }

    this.refreshPosition = function() {
        if(this.PlayerRectangleObject != null) {
            if(this.PlayerIsMovingUp) {
                this.PlayerRectangleObject.PosY += this.PlayerVelocityY;
            }

            if(this.PlayerIsMovingDown) {
                this.PlayerRectangleObject.PosY -= this.PlayerVelocityY;
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
    this.VelocityX = 0; // Pixel per Step
    this.VelocityY = 0; // Pixel per Step
    this.BallRectangleObject = null;

    this.refreshPosition = function() {
        if(this.PlayerRectangleObject != null) {
            this.BallRectangleObject.PosX += this.VelocityX;
            this.BallRectangleObject.PosY += this.VelocityY;
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


/*
================
Dictionary()
================
*/
function Dictionary()
{
    this.arrDictionary = [];


    /**
     * Add new element to the dictionary.
     * @param {String} sKey
     * @param {Object} oObject
     * @returns {boolean}
     */
    this.add = function(sKey, oObject)
    {
        if (sKey !== "" && sKey.constructor === String) {
            for (var x = 0; x < this.arrDictionary.length; x++) {
                if (this.arrDictionary[x]._sKey === sKey) {
                    this.arrDictionary[x]._oObject = oObject;
                    return true;
                }
            }

            this.arrDictionary.push({_sKey : sKey, _oObject : oObject});
            return true;
        }

        return false;
    };


    /**
     * If exists, return object from dictionary element.
     * @param {String} sKey
     * @returns {Object}
     */
    this.get = function(Key)
    {
        if (Key.constructor === String) {
            for (var x = 0; x < this.arrDictionary.length; x++) {
                if(this.arrDictionary[x]._sKey === Key) {
                    return this.arrDictionary[x]._oObject;
                }
            }
        }

        if (Key.constructor === Number) {
            return this.arrDictionary[Key]._oObject;
        }

        return null;
    };


    /**
     * Checks if dictionary entry already exists
     * @param {String} sKey
     * @returns {object}
     */
    this.containsKey = function(sKey)
    {
        if (sKey.constructor === String) {
            for (var x = 0; x < this.arrDictionary.length; x++) {
                if(this.arrDictionary[x]._sKey === sKey) {
                    return true;
                }
            }

            return false;
        }

        return null;
    };


    /**
     * @param {Number} iPosition
     * @returns {String}
     */
    this.getKey = function(iPosition)
    {
        if (!isNaN(iPosition)) {
            if (iPosition < this.arrDictionary.length) {
                return this.arrDictionary[iPosition]._sKey;
            }
        }

        return null;
    };


    /**
     * Returns size of dictionary
     * @returns {number}
     */
    this.count = function()
    {
        return this.arrDictionary.length;
    };
}



