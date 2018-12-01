export function rgbToV3(redValue, greenValue, blueValue) {
    return [redValue / 255, greenValue / 255, blueValue / 255];
}

export function rgbToV4(redValue, greenValue, blueValue) {
    return [redValue / 255, greenValue / 255, blueValue / 255, 1.0];
}

export function rgbaToV4(redValue, greenValue, blueValue, alphaValue) {
    return [redValue / 255, greenValue / 255, blueValue / 255, alphaValue];
}

export function stretchArray(array, n) {
    if (array != undefined && array != null) {
        const newArray = new Array(array.length * n);

        let index = 0;
        for (let x = 0; x < array.length; x++) {
            for (let y = 0; y < n; y++) {
                newArray[index++] = array[x];
            }
        }

        return newArray;
    }

    return null;
}

export function flattenArray2D(array) {
    return [].concat.apply([], array);
}

export function defineNewBuffer(gl, newArrayType, newDataArray, newUsageType) {
    const newBuffer = gl.createBuffer();
    gl.bindBuffer(newArrayType, newBuffer);
    gl.bufferData(newArrayType, newDataArray, newUsageType);
    gl.bindBuffer(newArrayType, null);

    return newBuffer;
}

export function multiplyMat4V3(newMat4Array, new3DVector) {
    let a00 = newMat4Array[0],  a01 = newMat4Array[1],  a02 = newMat4Array[2],  a03 = newMat4Array[3];
    let a10 = newMat4Array[4],  a11 = newMat4Array[5],  a12 = newMat4Array[6],  a13 = newMat4Array[7];
    let a20 = newMat4Array[8],  a21 = newMat4Array[9],  a22 = newMat4Array[10], a23 = newMat4Array[11];
    let a30 = newMat4Array[12], a31 = newMat4Array[13], a32 = newMat4Array[14], a33 = newMat4Array[15];

    let b0 = new3DVector[0], b1 = new3DVector[1], b2 = new3DVector[2]

    let x = a00 * b0 + a01 * b1 + a02 * b2 + a03;
    let y = a10 * b0 + a11 * b1 + a12 * b2 + a13;
    let z = a20 * b0 + a21 * b1 + a22 * b2 + a23;
    let w = a30 * b0 + a31 * b1 + a32 * b2 + a33;

    return [x, y, z];
}