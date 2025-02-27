import {defineNewBuffer} from "../../js/HelperFunctions.js";

export function CartesianObject() {
    this.ticks = 10;
    let color = [0.7, 0.7, 0.7, 0.1];
    let vertices = [];
    let indices = [];

    const buffer = {
        vertices : -1,
        edges : -1
    }


    this.setColor = function(newColor) {
        color = newColor;
    }


    this.setTicks = function(newNumberOfTicks) {
        this.ticks = newNumberOfTicks;
    }


    this.init = function(gl) {
        vertices = generateVertices(this.ticks);
        indices = generateIndices(this.ticks);
        buffer.vertices = defineNewBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        buffer.indices = defineNewBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }


    this.draw = function(gl, shaderContext) {
        // Define color
        gl.vertexAttrib4fv(shaderContext.aVertexColorId, color);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertices);
        gl.enableVertexAttribArray(shaderContext.aVertexPositionId);
        gl.vertexAttribPointer(shaderContext.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

        // Disable
        gl.disableVertexAttribArray(shaderContext.aVertexPositionId);
    }


    function generateVertices(newNumberOfTicks) {
        const stepSize = (1 / newNumberOfTicks);

        let pointsXAxis = [];
        let pointsYAxis = [];
        let pointsZAxis = [];

        // X-Axis
        for (let x = -newNumberOfTicks; x <= newNumberOfTicks; x++) {
            pointsXAxis.push(x * stepSize, 0.0, 0.0);
            pointsYAxis.push(0.0, x * stepSize, 0.0);
            pointsZAxis.push(0.0, 0.0, x * stepSize);
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