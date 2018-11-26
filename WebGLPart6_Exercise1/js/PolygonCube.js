import {flattenArray2D, rgbToV4, rgbaToV4, stretchArray, defineNewBuffer} from "../../js/HelperFunctions.js";

export function PolygonCube(gl) {
    const ctx = {
        aVertexPositionId : -1,
        aVertexColorId : -1,
        aTextureCoordId : -1,
        uModelMatrixId : -1,
        texture : null,
        buffer : {
            vertices : -1,
            indices : -1,
            colors : -1,
            textCoords : -1
        },
        modelMatrix : null,
        scaling : [1.0, 1.0, 1.0],
        position : [0.0, 0.0, 0.0],
        rotation : [0.0, 0.0, 0.0]
    }

    let drawTexture = false;

    const vertices = [
        // Front Side
        -0.5, -0.5,  0.5, // 00
         0.5, -0.5,  0.5, // 01
         0.5,  0.5,  0.5, // 02
        -0.5,  0.5,  0.5, // 03

        // Back Side
        -0.5, -0.5, -0.5, // 04
        -0.5,  0.5, -0.5, // 05
         0.5,  0.5, -0.5, // 06
         0.5, -0.5, -0.5, // 07

        // Top Side
        -0.5,  0.5, -0.5, // 08
        -0.5,  0.5,  0.5, // 09
         0.5,  0.5,  0.5, // 10
         0.5,  0.5, -0.5, // 11

        // Bottom Side
        -0.5, -0.5, -0.5, // 12
         0.5, -0.5, -0.5, // 13
         0.5, -0.5,  0.5, // 14
        -0.5, -0.5,  0.5, // 15

        // Right Side
         0.5, -0.5, -0.5, // 16
         0.5,  0.5, -0.5, // 17
         0.5,  0.5,  0.5, // 18
         0.5, -0.5,  0.5, // 19

        // Left Side
        -0.5, -0.5, -0.5, // 20
        -0.5, -0.5,  0.5, // 21
        -0.5,  0.5,  0.5, // 22
        -0.5,  0.5, -0.5  // 23
    ];

    const textureCoordinates = [
        // Front Side
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,
        1.0,  0.0,

        // Back Side
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Top Side
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Bottom Side (Mirrored)
        1.0,  0.0,
        0.0,  0.0,
        0.0,  1.0,
        1.0,  1.0,

        // Right Side
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Left Side (Mirrored)
        0.0,  1.0,
        1.0,  1.0,
        1.0,  0.0,
        0.0,  0.0
    ];

    let colors = [
        rgbToV4(255,  80,  14), // Front Side
        rgbToV4(255,  80,  14), // Back Side
        rgbToV4(255,  20,  20), // Top Side
        rgbToV4(255,  20,  20), // Bottom Side
        rgbToV4(255, 153,  15), // Right Side
        rgbToV4(255, 153,  15)  // Left Side
    ];

    const indices = [
        0,  1,  2,   0,  2,  3, // Front
        4,  5,  6,   4,  6,  7, // Back
        8,  9, 10,   8, 10, 11, // Top
       12, 13, 14,  12, 14, 15, // Bottom
       16, 17, 18,  16, 18, 19, // Right
       20, 21, 22,  20, 22, 23  // Left
    ];

    // Set Buffers
    ctx.buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    ctx.buffer.indices = defineNewBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    ctx.buffer.colors = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(flattenArray2D(stretchArray(colors, 4))), gl.STATIC_DRAW);
    ctx.buffer.textCoords = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    this.setVertexPositionId = function(newVertexPositionId) {
        ctx.aVertexPositionId = newVertexPositionId;
    };


    this.setVertexColorId = function(newVertexColorId) {
        ctx.aVertexColorId = newVertexColorId;
    };


    this.setTextureCoordId = function(newTextureCoordId) {
        ctx.aTextureCoordId = newTextureCoordId;
    };


    this.setModelMatrixId = function(newModelMatrixId) {
        ctx.uModelMatrixId = newModelMatrixId;
    };


    this.setTexture = function(newTexture) {
        ctx.texture = newTexture;
    };


    this.setScaling = function(newXScale, newYScale, newZScale) {
        ctx.scaling = [newXScale, newYScale, newZScale];
    };


    this.setRotation = function(newXRotation, newYRotation, newZRotation,) {
        ctx.rotation = [newXRotation, newYRotation, newZRotation];
    }


    this.addRotationX = function(newDeltaInRadiant) {
        ctx.rotation[0] += newDeltaInRadiant;
    }


    this.addRotationY = function(newDeltaInRadiant) {
        ctx.rotation[1] += newDeltaInRadiant;
    }


    this.addRotationZ = function(newDeltaInRadiant) {
        ctx.rotation[2] += newDeltaInRadiant;
    }


    this.moveTo = function(newPosX, newPosY, newPosZ) {
        ctx.position = [newPosX, newPosY, newPosZ];
    };


    this.enableTexture = function() {
        drawTexture = true;
    };


    this.disableTexture = function() {
        drawTexture = false;
    };


    this.draw = function(gl) {
        // Set ModelMatrix
        refreshModelMatrix();
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, ctx.modelMatrix);

        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        if(drawTexture) {
            // Texture
            gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.textCoords);
            gl.enableVertexAttribArray(ctx.aTextureCoordId);
            gl.vertexAttribPointer(ctx.aTextureCoordId, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, ctx.texture);
            gl.uniform1i(ctx.uSampler, 0);

            gl.vertexAttrib4fv(ctx.aVertexColorId, rgbaToV4(0, 0, 0, 0.0));
        }
        else {
            // Colors
            gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.colors);
            gl.enableVertexAttribArray(ctx.aVertexColorId);
            gl.vertexAttribPointer(ctx.aVertexColorId, 4, gl.FLOAT, false, 0, 0);
        }

        // Indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ctx.buffer.indices);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        // Disable
        if(drawTexture) {
            gl.disableVertexAttribArray(ctx.aTextureCoordId);
        }

        gl.disableVertexAttribArray(ctx.aVertexPositionId);
        gl.disableVertexAttribArray(ctx.aVertexColorId);
    };


    function refreshModelMatrix() {
        ctx.modelMatrix = mat4.create();

        mat4.translate(ctx.modelMatrix,ctx.modelMatrix, ctx.position);

        if((ctx.rotation[0] !== 1.0) && (ctx.rotation[1] !== 1.0) && (ctx.rotation[2] !== 1.0)) {
            mat4.scale(ctx.modelMatrix,ctx.modelMatrix, ctx.scaling);
        }

        if(ctx.rotation[0] !== 0.0) {
            mat4.rotateX(ctx.modelMatrix,ctx.modelMatrix, ctx.rotation[0]);
        }

        if(ctx.rotation[1] !== 0.0) {
            mat4.rotateY(ctx.modelMatrix,ctx.modelMatrix, ctx.rotation[1]);
        }

        if(ctx.rotation[2] !== 0.0) {
            mat4.rotateZ(ctx.modelMatrix,ctx.modelMatrix, ctx.rotation[2]);
        }


    };
}