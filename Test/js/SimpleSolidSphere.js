import { defineNewBuffer, rgbToV4, rgbaToV4 } from "../../js/HelperFunctions.js";

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
export function SimpleSolidSphere(gl, newLatitudeBands, newLongitudeBands) {
    "use strict";
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
            uEnableLightingId : -1
        },
        latitudeBands : newLatitudeBands,
        longitudeBands : newLongitudeBands,
        buffer : {
            vertices : -1,
            indices : -1,
            normals : -1,
            textures : -1
        },
        matrices : {
            model : null,
            view : null,
            normal : null
        },
        triangleCounter : 0,
        vertices : [],
        normals : [],
        indices : [],
        textures : [],
        color : [255, 0, 0],
        texture : null,
        isLighted : false
    };

    // Generate Vertices, Indices, Normals and Texturecoords
    defineVerticesAndTexture(ctx.latitudeBands, ctx.longitudeBands);
    defineIndices(ctx.latitudeBands, ctx.longitudeBands);
    ctx.triangleCounter = ctx.latitudeBands * ctx.longitudeBands * 2;

    // Set Buffers
    ctx.buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.vertices), gl.STATIC_DRAW);
    ctx.buffer.normals = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.normals), gl.STATIC_DRAW);
    ctx.buffer.textures = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.textures), gl.STATIC_DRAW);
    ctx.buffer.indices = defineNewBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ctx.indices), gl.STATIC_DRAW);


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
    };


    this.setTexture = function(newTexture) {
        ctx.texture = newTexture;
    };


    this.setModelMatrix = function(newModelmatrix) {
        ctx.matrices.model = newModelmatrix;
    };


    this.enableLighting = function() {
        ctx.isLighted = true;
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

        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.vertexAttribPointer(ctx.attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        if(ctx.texture != null) {
            // Texture
            gl.uniform1i(ctx.uSampler, 1);
            gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.textures);
            gl.enableVertexAttribArray(ctx.attributes.aTextureCoordId);
            gl.vertexAttribPointer(ctx.attributes.aTextureCoordId, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, ctx.texture);

            gl.vertexAttrib4fv(ctx.aVertexColorId, rgbaToV4(0, 0, 0, 0.0));
        }
        else {
            // Colors
            gl.disableVertexAttribArray(ctx.attributes.aVertexColorId);
            gl.vertexAttrib4fv(ctx.attributes.aVertexColorId, rgbToV4(ctx.color[0], ctx.color[1], ctx.color[2]));
        }

        // normal
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.normals);
        gl.enableVertexAttribArray(ctx.attributes.aVertexNormalId);
        gl.vertexAttribPointer(ctx.attributes.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);

        // model reacts with lighting
        if(ctx.isLighted) {
            gl.uniform1i(ctx.uniforms.uEnableLightingId, 1);
        }

        // elements
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ctx.buffer.indices);
        gl.drawElements(gl.TRIANGLES, ctx.triangleCounter * 3 ,gl.UNSIGNED_SHORT, 0);

        // disable the arrays
        if(ctx.texture != null) {
            gl.disableVertexAttribArray(ctx.aTextureCoordId);
        }

        gl.disableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.disableVertexAttribArray(ctx.attributes.aVertexNormalId);
        gl.disableVertexAttribArray(ctx.attributes.aVertexColorId);
        gl.uniform1i(ctx.uniforms.uEnableLightingId, 0);
    };


    function defineVerticesAndTexture(latitudeBands, longitudeBands) {
        "use strict";
        // define the vertices of the sphere
        let vertices = [];
        let normals = [];
        let textures = [];

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

                textures.push(u);
                textures.push(v);
            }
        }

        ctx.vertices = vertices;
        ctx.normals = normals;
        ctx.textures = textures;
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


    function refreshNormalMatrix() {
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, ctx.matrices.view, ctx.matrices.model);

        ctx.matrices.normal = mat3.create();
        mat3.normalFromMat4(ctx.matrices.normal, modelViewMatrix);
    }
}