import {flattenArray2D, rgbToV4, stretchArray} from "../../js/HelperFunctions.js";

export function PolygonCube(gl) {
    let vertices = [
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

    let colors = [
        rgbToV4(255, 201,  14), // Front Side
        rgbToV4(255, 201,  14), // Back Side
        rgbToV4(231,  78,  39), // Top Side
        rgbToV4(231,  78,  39), // Bottom Side
        rgbToV4(255, 153,  15), // Right Side
        rgbToV4(255, 153,  15)  // Left Side
    ];

    let indices = [
        0,  1,  2,   0,  2,  3, // Front
        4,  5,  6,   4,  6,  7, // Back
        8,  9, 10,   8, 10, 11, // Top
       12, 13, 14,  12, 14, 15, // Bottom
       16, 17, 18,  16, 18, 19, // Right
       20, 21, 22,  20, 22, 23  // Left
    ]

    let bufferVertices = defineVerticesBuffer(gl, vertices);
    let bufferIndices = defineIndicesBuffer(gl, indices);
    let bufferColors = defineColorsBuffer(gl, flattenArray2D(stretchArray(colors, 4)));

    this.draw = function(gl, aVertexPositionId, aVertexColorId) {

        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
        gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPositionId);

        // Colors
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferColors);
        gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexColorId);

        // Indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }


    function defineVerticesBuffer(gl, vertices) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        return newBuffer;
    }


    function defineIndicesBuffer(gl, indices) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return newBuffer;
    }


    function defineColorsBuffer(gl, colors) {
        const newBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return newBuffer;
    }

}