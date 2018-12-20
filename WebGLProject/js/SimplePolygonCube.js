import {flattenArray2D, rgbToV4, rgbaToV4, stretchArray, defineNewBuffer} from "../../js/HelperFunctions.js";

export function SimplePolygonCube(gl) {
    const ctx = {
        attributes : {
            aVertexPositionId : -1,
            aVertexColorId : -1,
            aVertexNormalId : -1,
            aTextureCoordId : -1
        },
        uniforms : {
            uModelMatrixId : -1,
            uViewMatrixId : -1,
            uNormalMatrixId : -1,
            uSamplerId : -1,
            uEnableLightingId : -1,
            uEnableSpecularId : -1,
            uEnableTextureId : -1
        },
        buffer : {
            vertices : -1,
            indices : -1,
            colors : -1,
            textures : -1,
            normals : -1
        },
        matrices : {
            model : null,
            view : null,
            normal : null
        },
        color : [255, 0, 0],
        texture : null,
        isLighted : false,
        alpha : {
            enable : false,
            sfactor : null,
            dfactor : null,
        }
    };

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
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

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

        // Bottom Side
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Right Side
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Left Side (Mirrored)
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ];

    let colors = [
        rgbToV4(0, 0, 0), // Front Side
        rgbToV4(0, 0, 0), // Back Side
        rgbToV4(0, 0, 0), // Top Side
        rgbToV4(0, 0, 0), // Bottom Side
        rgbToV4(0, 0, 0), // Right Side
        rgbToV4(0, 0, 0)  // Left Side
    ];

    const normals = [
        [ 0.0,  0.0,  1.0], // Front Side Normal
        [ 0.0,  0.0, -1.0], // Back Side Normal
        [ 0.0,  1.0,  0.0], // Top Side Normal
        [ 0.0, -1.0,  0.0], // Bottom Side Normal
        [ 1.0,  0.0,  0.0], // Right Side Normal
        [-1.0,  0.0,  0.0]  // Left Side Normal
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
    ctx.buffer.textures = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    ctx.buffer.normals = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(flattenArray2D(stretchArray(normals, 4))), gl.STATIC_DRAW);


    this.setShaderAttributes = function(newAttributes) {
        ctx.attributes.aVertexPositionId = newAttributes.aVertexPositionId;
        ctx.attributes.aVertexColorId = newAttributes.aVertexColorId;
        ctx.attributes.aVertexNormalId = newAttributes.aVertexNormalId;
        ctx.attributes.aTextureCoordId = newAttributes.aTextureCoordId;
    };


    this.setShaderUniforms = function(newUniforms) {
        ctx.uniforms.uModelMatrixId = newUniforms.uModelMatrixId;
        ctx.uniforms.uViewMatrixId = newUniforms.uViewMatrixId;
        ctx.uniforms.uNormalMatrixId = newUniforms.uNormalMatrixId;
        ctx.uniforms.uSamplerId = newUniforms.uSamplerId;
        ctx.uniforms.uEnableLightingId = newUniforms.uEnableLightingId;
        ctx.uniforms.uEnableSpecularId = newUniforms.uEnableSpecularId;
        ctx.uniforms.uEnableTextureId = newUniforms.uEnableTextureId;
    };


    this.setTexture = function(newTexture) {
        ctx.texture = newTexture;
    };


    this.setColor = function(newRed, newGreen, newBlue) {
        ctx.color = [newRed, newGreen, newBlue];
    };


    this.setModelMatrix = function(newModelmatrix) {
        ctx.matrices.model = newModelmatrix;
    };


    this.enableLighting = function() {
        ctx.isLighted = true;
    };


    this.enableAlpha = function(sFactor, dFactor) {
        ctx.alpha.enable = true;
        ctx.alpha.sfactor = sFactor;
        ctx.alpha.dfactor = dFactor
    };


    this.disableLighting = function() {
        ctx.isLighted = false;
    };


    this.draw = function(gl, newViewMatrix) {
        "use strict";
        // Set Matrices
        ctx.matrices.view = newViewMatrix;
        refreshNormalMatrix();

        gl.uniformMatrix4fv(ctx.uniforms.uViewMatrixId, false, ctx.matrices.view);
        gl.uniformMatrix4fv(ctx.uniforms.uModelMatrixId, false, ctx.matrices.model);
        gl.uniformMatrix3fv(ctx.uniforms.uNormalMatrixId, false, ctx.matrices.normal);

        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.vertexAttribPointer(ctx.attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        if(ctx.texture != null) {
            // Texture
            gl.uniform1i(ctx.uniforms.uEnableTextureId, 1);
            gl.uniform1i(ctx.uniforms.uSampler, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.textures);
            gl.enableVertexAttribArray(ctx.attributes.aTextureCoordId);
            gl.vertexAttribPointer(ctx.attributes.aTextureCoordId, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, ctx.texture);

            gl.vertexAttrib4fv(ctx.attributes.aVertexColorId, rgbaToV4(0, 0, 0, 0.0));
        }
        else {
            // Colors
            gl.uniform1i(ctx.uniforms.uEnableTextureId, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.colors);
            gl.enableVertexAttribArray(ctx.attributes.aVertexColorId);
            gl.vertexAttribPointer(ctx.attributes.aVertexColorId, 4, gl.FLOAT, false, 0, 0);
        }

        // Normals
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.normals);
        gl.enableVertexAttribArray(ctx.attributes.aVertexNormalId);
        gl.vertexAttribPointer(ctx.attributes.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);

        // Model reacts with lighting
        if(ctx.isLighted) {
            gl.uniform1i(ctx.uniforms.uEnableLightingId, 1);
        }

        // Transparency
        if(ctx.alpha.enable) {
            gl.enable(gl.BLEND);
            gl.blendFunc(ctx.alpha.sfactor, ctx.alpha.dfactor);
            gl.uniform1i(ctx.uniforms.uEnableSpecularId, 0);
        }

        // Indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ctx.buffer.indices);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        // Disable the arrays, alpha, lighting
        if(ctx.texture != null) {
            gl.disableVertexAttribArray(ctx.attributes.aTextureCoordId);
        }

        if(ctx.alpha.enable) {
            gl.disable(gl.BLEND);
        }

        gl.disableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.disableVertexAttribArray(ctx.attributes.aVertexColorId);
        gl.disableVertexAttribArray(ctx.attributes.aVertexNormalId);
        gl.uniform1i(ctx.uniforms.uEnableLightingId, 0);
        gl.uniform1i(ctx.uniforms.uEnableSpecularId, 1);
    };


    function refreshNormalMatrix() {
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, ctx.matrices.view, ctx.matrices.model);

        ctx.matrices.normal = mat3.create();
        mat3.normalFromMat4(ctx.matrices.normal, modelViewMatrix);
    }
}