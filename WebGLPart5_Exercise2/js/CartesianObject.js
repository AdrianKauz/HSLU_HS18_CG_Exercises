export function CartesianObject() {
    this.ticks = 10;
    this.color = [0.7, 0.7, 0.7, 1.0];
    this.vertices = [];
    this.indices = [];
    this.bufferVertices = null;
    this.bufferEdges = null;

    this.setColor = function(newColor) {
        this.color = newColor;
    }

    this.setTicks = function(newNumberOfTicks) {
        this.ticks = newNumberOfTicks;
    }

    this.init = function(gl) {
        this.vertices = generateVertices(this.ticks);
        this.indices = generateIndices(this.ticks);
        this.bufferVertices = setVerticesBuffer(gl, this.vertices);
        this.bufferEdges = setEdgesBuffer(gl, this.indices);
    }


    this.draw = function(gl, aVertexPositionId, aVertexColorId) {
        gl.disableVertexAttribArray(aVertexColorId);
        gl.vertexAttrib4fv(aVertexColorId, this.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPositionId);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
        gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }


    function setVerticesBuffer(gl, newVertices) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newVertices), gl.STATIC_DRAW);

        return newBuffer;
    }


    function setEdgesBuffer(gl, newIndices) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(newIndices), gl.STATIC_DRAW);

        return newBuffer;
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