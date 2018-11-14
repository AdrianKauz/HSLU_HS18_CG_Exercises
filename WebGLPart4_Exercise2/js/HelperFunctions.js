export function rgbToV4(redValue, greenValue, blueValue) {
    return [redValue / 255, greenValue / 255, blueValue / 255, 1.0];
}

export function rgbaToV4(redValue, greenValue, blueValue, alphaValue) {
    return [redValue / 255, greenValue / 255, blueValue / 255, alphaValue];
}