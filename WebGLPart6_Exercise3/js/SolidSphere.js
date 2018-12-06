import { defineNewBuffer, rgbToV4 } from "../../js/HelperFunctions.js";

/**
 *
 * Define a sphere that can be drawn with a color
 */

/**
 *
 * @param gl the gl object for which to define the sphere
 * @param latitudeBands the number of bands along the latitude direction
 * @param longitudeBands the number of bands along the longitude direction
 *
 */
export function SolidSphere(gl, newLatitudeBands, newLongitudeBands) {
    "use strict";
    const ctx = {
        attributes : {
            aVertexPositionId : -1,
            aVertexColorId : -1,
            aVertexNormalId : -1
        },
        uniforms : {
            uModelViewMatrixId : -1,
            uNormalMatrixId : -1
        },
        latitudeBands : newLatitudeBands,
        longitudeBands : newLongitudeBands,
        buffer : {
            vertices : -1,
            indices : -1,
            normals : -1,
            textcoords : -1
        },
        modelViewMatrix : null,
        triangleCounter : 0,
        vertices : [],
        normals : [],
        indices : [],
        textcoords : [],
        scaling : [1.0, 1.0, 1.0],
        position : [0.0, 0.0, 0.0],
        color : [255, 0, 0]
    };

    // Generate Vertices, Indices, Normals and Texturecoords
    defineVerticesAndTexture(ctx.latitudeBands, ctx.longitudeBands);
    defineIndices(ctx.latitudeBands, ctx.longitudeBands);
    ctx.triangleCounter = ctx.latitudeBands * ctx.longitudeBands * 2;

    // Set Buffers
    ctx.buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.vertices), gl.STATIC_DRAW);
    ctx.buffer.normals = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.normals), gl.STATIC_DRAW);
    ctx.buffer.textcoords = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.textcoords), gl.STATIC_DRAW);
    ctx.buffer.indices = defineNewBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ctx.indices), gl.STATIC_DRAW);


    this.setVertexPositionId = function(newVertexPositionId) {
        ctx.attributes.aVertexPositionId = newVertexPositionId;
    };


    this.setVertexColorId = function(newVertexColorId) {
        ctx.attributes.aVertexColorId = newVertexColorId;
    };


    this.setVertexNormal = function (newVertexNormalId) {
        ctx.attributes.aVertexNormalId = newVertexNormalId;
    };


    this.setModelViewMatrixId = function(newModelViewMatrixId) {
        ctx.uniforms.uModelViewMatrixId = newModelViewMatrixId;
    };


    this.setNormalMatrix = function(NewNormalMatrixId) {
        ctx.uniforms.uNormalMatrixId = NewNormalMatrixId;
    };


    this.setScaling = function(newXScale, newYScale, newZScale) {
        ctx.scaling = [newXScale, newYScale, newZScale];
    };


    this.setPosition = function(newPosX, newPosY, newPosZ) {
        ctx.position = [newPosX, newPosY, newPosZ];
    };


    this.setColor = function(newRed, newGreen, newBlue) {
        ctx.color = [newRed, newGreen, newBlue];
    };


    this.setCoordDetails = function(newLatitude, newLongitude) {
        ctx.latitudeBands = newLatitude;
        ctx.longitudeBands = newLongitude;
    };


    this.draw = function(gl, newCameraMatrix) {
        "use strict";
        refreshModelViewMatrix(newCameraMatrix);
        gl.uniformMatrix4fv(ctx.uniforms.uModelViewMatrixId, false, ctx.modelViewMatrix);

        // Generate Normal Matrix
        let normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, ctx.modelViewMatrix);
        gl.uniformMatrix3fv(ctx.uniforms.uNormalMatrixId, false, normalMatrix);

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.vertexAttribPointer(ctx.attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        // color is directly specified as an attribute here, as it is valid for the whole object
        gl.disableVertexAttribArray(ctx.attributes.aVertexColorId);
        gl.vertexAttrib4fv(ctx.attributes.aVertexColorId, rgbToV4(ctx.color[0], ctx.color[1], ctx.color[2]));

        // normal
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.normals);
        gl.enableVertexAttribArray(ctx.attributes.aVertexNormalId);
        gl.vertexAttribPointer(ctx.attributes.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);

        // elements
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ctx.buffer.indices);
        gl.drawElements(gl.TRIANGLES, ctx.triangleCounter * 3 ,gl.UNSIGNED_SHORT, 0);

        // disable the arrays
        gl.disableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.disableVertexAttribArray(ctx.attributes.aVertexNormalId);
    }


    function defineVerticesAndTexture(latitudeBands, longitudeBands) {
        "use strict";
        // define the vertices of the sphere
        let vertices = [];
        let normals = [];
        let textcoords = [];

        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            let theta = latNumber * Math.PI / latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                let phi = longNumber * 2 * Math.PI / longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                // position (and normals as it is a unit sphere)
                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                // texture coordinates
                let u = 1 - (longNumber / longitudeBands);
                let v = 1 - (latNumber / latitudeBands);

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                normals.push(x);
                normals.push(y);
                normals.push(z);

                textcoords.push(u);
                textcoords.push(v);
            }
        }

        ctx.vertices = vertices;
        ctx.normals = normals;
        ctx.textcoords = textcoords;
    }


    function defineIndices(latitudeBands, longitudeBands) {
        "use strict";
        let indices = [];

        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;

                indices.push(first);
                indices.push(first + 1);
                indices.push(second);

                indices.push(second);
                indices.push(first + 1);
                indices.push(second + 1);
            }
        }

        ctx.indices = indices;
    }


    function refreshModelViewMatrix(newCameraMatrix) {
        ctx.modelViewMatrix = mat4.create();

        mat4.translate(ctx.modelViewMatrix, newCameraMatrix, ctx.position);
        mat4.scale(ctx.modelViewMatrix, ctx.modelViewMatrix, ctx.scaling);
    }
}