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