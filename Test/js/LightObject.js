import { defineNewBuffer, rgbToV3, rgbToV4 } from "../../js/HelperFunctions.js";

export function LightObject(gl) {
    const ctx = {
        attributes : {
            aVertexPositionId : -1,
            aVertexColorId : -1
        },
        uniforms : {
            uModelMatrixId : -1,
            uViewMatrixId : -1,
            uLightPositionId : -1,
            uLightColorId : -1
        },
        buffer : {
            vertices : -1
        },
        matrices : {
            model : mat4.create(),
            view : null
        },
        position : [0.0, 0.0, 0.0],
        color : [255, 255, 255]
    };

    // Set Buffer
    ctx.buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(ctx.position), gl.STATIC_DRAW);


    this.setShaderAttributes = function(newAttributes) {
        ctx.attributes.aVertexPositionId = newAttributes.aVertexPositionId;
        ctx.attributes.aVertexColorId = newAttributes.aVertexColorId;
    };


    this.setShaderUniforms = function(newUniforms) {
        ctx.uniforms.uModelMatrixId = newUniforms.uModelMatrixId;
        ctx.uniforms.uViewMatrixId = newUniforms.uViewMatrixId;
        ctx.uniforms.uLightPositionId = newUniforms.uLightPositionId;
        ctx.uniforms.uLightColorId = newUniforms.uLightColorId;
    };


    this.setVertexPositionId = function(newVertexPositionId) {
        ctx.attributes.aVertexPositionId = newVertexPositionId;
    };


    this.setPosition = function(newPosX, newPosY, newPosZ) {
      ctx.position = [newPosX, newPosY, newPosZ];
    };


    this.setColor = function(newRed, newGreen, newBlue) {
        ctx.color = [newRed, newGreen, newBlue];
    };


    this.init = function(gl) {
        gl.uniform3fv(ctx.uniforms.uLightPositionId, ctx.position);
        gl.uniform3fv(ctx.uniforms.uLightColorId, rgbToV3(ctx.color[0], ctx.color[1], ctx.color[2]));
    };


    this.draw = function(gl) {
        // Set ModelMatrix
        gl.uniformMatrix4fv(ctx.uniforms.uModelMatrixId, false, ctx.matrices.model);

        // Color
        gl.vertexAttrib4fv(ctx.attributes.aVertexColorId, rgbToV4(ctx.color[0], ctx.color[1], ctx.color[2]));

        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.vertexAttribPointer(ctx.attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, 1);

        // Disable
        gl.disableVertexAttribArray(ctx.attributes.aVertexPositionId);
    };


    this.refreshLightPosition = function(gl, newViewMatrix) {
        let newPosition = vec3.create();

        ctx.matrices.view = newViewMatrix;
        vec3.transformMat4(newPosition, ctx.position, ctx.matrices.view);

        gl.uniform3fv(ctx.uniforms.uLightPositionId, newPosition);
    };
}