import {defineNewBuffer, rgbToV3, rgbToV4, multiplyMat4V3} from "../../js/HelperFunctions.js";

export function LightObject(gl) {
    const ctx = {
        attributes : {
            aVertexPositionId : -1,
            aVertexColorId : -1
        },
        uniforms : {
            uModelViewMatrixId : -1,
            uLightPositionId : -1,
            uLightColorId : -1
        },
        buffer : {
            vertices : -1
        },
        modelViewMatrix : null,
        position : [10.0, 10.0, 10.0],
        color : [255, 255, 255]
    }

    const vertices = [0.0, 0.0, 0.0];

    // Set Buffer
    ctx.buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    this.setVertexPositionId = function(newVertexPositionId) {
        ctx.attributes.aVertexPositionId = newVertexPositionId;
    };


    this.setModelViewMatrixId = function(newModelViewMatrixId) {
        ctx.uniforms.uModelViewMatrixId = newModelViewMatrixId;
    };


    this.setVertexColorId = function(newVertexColorId) {
        ctx.attributes.aVertexColorId = newVertexColorId;
    };


    this.setLightPositionId = function(newLightPositionId) {
        ctx.uniforms.uLightPositionId = newLightPositionId;
    };


    this.setLightColorId = function(newLightColorId) {
        ctx.uniforms.uLightColorId = newLightColorId;
    };


    this.draw = function(gl, newCameraMatrix) {
        // Set ModelMatrix
        refreshModelViewMatrix(newCameraMatrix);
        gl.uniformMatrix4fv(ctx.uniforms.uModelViewMatrixId, false, ctx.modelViewMatrix);

        // Light
        //gl.uniform3fv(ctx.uniforms.uLightPositionId, multiplyMat4V3(ctx.modelViewMatrix, ctx.position) );
        gl.uniform3fv(ctx.uniforms.uLightPositionId, ctx.position);
        gl.uniform3fv(ctx.uniforms.uLightColorId, rgbToV3(ctx.color[0], ctx.color[1], ctx.color[2]));

        // Color
        gl.vertexAttrib4fv(ctx.attributes.aVertexColorId, rgbToV4(ctx.color[0], ctx.color[1], ctx.color[2]));

        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.vertexAttribPointer(ctx.attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, 1);

        // Disable
        gl.disableVertexAttribArray(ctx.attributes.aVertexPositionId);
    }


    function refreshModelViewMatrix(newCameraMatrix) {
        ctx.modelViewMatrix = mat4.create();
        mat4.translate(ctx.modelViewMatrix, newCameraMatrix, ctx.position);
    }
}


//gl.uniform3fv(ctx.uniforms.uLightPositionId, multiplyMat4V3(cameraMatrix, [20.0, 20.0, 20.0]));
//gl.uniform3fv(ctx.uniforms.uLightPositionId, [20.0, 20.0, 20.0]);
//gl.uniform3fv(ctx.uniforms.uLightColorId, [1.0, 1.0, 1.0]);