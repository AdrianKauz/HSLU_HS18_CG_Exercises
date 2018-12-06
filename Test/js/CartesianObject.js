import {defineNewBuffer} from "../../js/HelperFunctions.js";

export function CartesianObject() {
    this.ticks = 10;
    let color = [0.7, 0.7, 0.7, 0.1];
    let vertices = [];
    let indices = [];

    const ctx = {
        attributes : {
            aVertexColorId : -1,
            aVertexPositionId : -1
        },
        uniforms : {
            uModelMatrixId : -1,
            uViewMatrixId : -1
        },
        matrices : {
            model : mat4.create()
        },
        buffer : {
            vertices : -1,
            edges : -1
        }
    };


    this.setShaderAttributes = function(newAttributes) {
        ctx.attributes.aVertexPositionId = newAttributes.aVertexPositionId;
        ctx.attributes.aVertexColorId = newAttributes.aVertexColorId;
    };


    this.setShaderUniforms = function(newUniforms) {
        ctx.uniforms.uModelMatrixId = newUniforms.uModelMatrixId;
        ctx.uniforms.uViewMatrixId = newUniforms.uViewMatrixId;
    };


    this.setColor = function(newColor) {
        color = newColor;
    };


    this.setTicks = function(newNumberOfTicks) {
        this.ticks = newNumberOfTicks;
    };


    this.init = function(gl) {
        vertices = generateVertices(this.ticks);
        indices = generateIndices(this.ticks);
        ctx.buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        ctx.buffer.indices = defineNewBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    };


    this.draw = function(gl, newViewMatrix) {
        // Set Matrices
        gl.uniformMatrix4fv(ctx.uniforms.uModelMatrixId, false, ctx.matrices.model);
        gl.uniformMatrix4fv(ctx.uniforms.uViewMatrixId, false, newViewMatrix);

        // Define color
        gl.vertexAttrib4fv(ctx.attributes.aVertexColorId, color);

        gl.bindBuffer(gl.ARRAY_BUFFER, ctx.buffer.vertices);
        gl.enableVertexAttribArray(ctx.attributes.aVertexPositionId);
        gl.vertexAttribPointer(ctx.attributes.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ctx.buffer.indices);
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

        // Disable
        gl.disableVertexAttribArray(ctx.attributes.aVertexPositionId);
    }


    function generateVertices(newNumberOfTicks) {
        const stepSize = (1 / newNumberOfTicks);

        let pointsXAxis = [];
        let pointsYAxis = [];
        let pointsZAxis = [];

        // X-Axis
        for (let x = -newNumberOfTicks; x <= newNumberOfTicks; x++) {
            pointsXAxis.push(x * stepSize * 3, 0.0, 0.0);
            pointsYAxis.push(0.0, x * stepSize * 3, 0.0);
            pointsZAxis.push(0.0, 0.0, x * stepSize * 3);
        }

        return pointsXAxis.concat(pointsYAxis).concat(pointsZAxis);
    }


    function generateIndices(newNumberOfTicks) {
        let indices = [];
        let offsetYVertices = newNumberOfTicks * 2 + 1;
        let offsetZVertices = newNumberOfTicks * 4 + 2;

        for(let x = 0; x < newNumberOfTicks * 2; x++ ) {
            if (x % 2 == 0) {
                indices.push(x, x + 1);
                indices.push(x + offsetYVertices, x + offsetYVertices + 1);
                indices.push(x + offsetZVertices, x + offsetZVertices + 1);
            }
        }

        return indices;
    }
}