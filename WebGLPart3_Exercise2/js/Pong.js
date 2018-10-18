//
// DI Computer Graphics
//
// WebGL Exercises
//

// Constants
const BALL = "Ball";
const NET = "Net";
const LEFT_PLAYER = "LeftPad";
const RIGHT_PLAYER = "RightPad";



// Register function to call after document has loaded
window.onload = startup;

// Globals
var gl;
var rectangleManager;

const ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uModelMatId: -1
};


function RectangleObject() {
    "use strict";
    this.Height = 0;
    this.Width = 0;
    this.PosX = 0;
    this.PosY = 0;
    this.ModelMatrix = -1;
    this.Color = -1;
}


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

    this.createNewRectangle = function(newName) {
        this.rectangles.add(newName, new RectangleObject());
    }

    this.setSize = function(name, newHeight, newWidth) {
        this.rectangles.get(name).Height = newHeight;
        this.rectangles.get(name).Width = newWidth;
    }

    this.setPosition = function(name, newPosX, newPosY) {
        this.rectangles.get(name).PosX = newPosX;
        this.rectangles.get(name).PosY = newPosY;
    }

    this.moveVertical = function(name, delta) {
        this.rectangles.get(name).PosY += delta;
    }

    this.drawAll = function() {
        for(var x = 0; x < this.rectangles.count(); x++) {
            var currRectangle = this.rectangles.get(x);
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


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    addAllEventListener()
    initGL();
    initObjects();
    draw();
}


function addAllEventListener() {
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shaders/VertexShader.glsl', 'shaders/FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpWorldCoordinates();
    rectangleManager = new RectangleManager();
    rectangleManager.initBuffer();

    gl.clearColor(0.0, 0.0, 0.0, 1);
    window.requestAnimationFrame(gameLoop);
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
    rectangleManager.createNewRectangle(BALL);
    rectangleManager.setSize(BALL, 20, 20);
    rectangleManager.setPosition(BALL, 0, 0);

    rectangleManager.createNewRectangle(LEFT_PLAYER);
    rectangleManager.setSize(LEFT_PLAYER, 100, 10);
    rectangleManager.setPosition(LEFT_PLAYER, -500, 0);

    rectangleManager.createNewRectangle(RIGHT_PLAYER);
    rectangleManager.setSize(RIGHT_PLAYER, 100, 10);
    rectangleManager.setPosition(RIGHT_PLAYER, 500, 0);

    rectangleManager.createNewRectangle(NET);
    rectangleManager.setSize(NET, 700, 4);
    rectangleManager.setPosition(NET, 0, 0);
}


var oldTimeStamp = null;
function gameLoop(newTimeStamp = 0) {
    if(oldTimeStamp === null) {
        oldTimeStamp = newTimeStamp
    }

    if((newTimeStamp - oldTimeStamp) > 10) {
        oldTimeStamp = newTimeStamp;
        draw();
    }
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    moveLeftPlayer();
    rectangleManager.drawAll();
}

var moveDown = false;
var moveUp = false;


function Players() {

}











function moveLeftPlayer() {
    if(moveDown) {
        rectangleManager.moveVertical(LEFT_PLAYER, 8);
    }

    if(moveUp) {
        rectangleManager.moveVertical(LEFT_PLAYER, -8);
    }


}



document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "w":
            moveUp = true;
            break;
        case "a":
            moveDown = true;
            break;
        default:
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case "w":
            moveUp = false;
            break;
        case "a":
            moveDown = false;
            break;
        default:
            break;
    }
});





















/*



// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    uProjectionMatId: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

*/











/**
 * Draw the scene.
 *//*
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    var modelMat = mat3.create(); // New 3x3-Matrix
    console.log(modelMat);
    mat3.fromTranslation(modelMat, [200,200]);
    mat3.scale(modelMat,modelMat, [100, 100]);
    console.log(modelMat);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);


    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
*/
// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
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



