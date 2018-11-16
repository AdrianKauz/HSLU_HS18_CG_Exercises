export function WireFrameCube(gl, newColor = [1.0, 0.0, 0.0, 1.0]) {
    this.color = newColor;
    this.vertices = [
        // Front
        -0.5, -0.5,  0.5, // v0
         0.5, -0.5,  0.5, // v1
         0.5,  0.5,  0.5, // v2
        -0.5,  0.5,  0.5, // v3

        // Back
        -0.5, -0.5, -0.5, // v0
         0.5, -0.5, -0.5, // v1
         0.5,  0.5, -0.5, // v2
        -0.5,  0.5, -0.5, // v3
    ];

    this.indices = [
        // Front edges
        0, 1,
        1, 2,
        2, 3,
        3, 0,

        // Back edges
        4, 5,
        5, 6,
        6, 7,
        7, 4,

        // Side edges
        0, 4,
        1, 5,
        2, 6,
        3, 7
    ];

    this.bufferVertices = defineVertices(gl, this.vertices);
    this.bufferEdges = defineEdges(gl, this.indices);


    this.draw = function(gl, aVertexPositionId, aVertexColorId) {
        gl.uniform4fv(aVertexColorId, this.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(aVertexPositionId);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
        gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    function defineVertices(gl, vertices) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        return newBuffer;
    }

    function defineEdges(gl, indices) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return newBuffer;
    }
}