export function CameraViewMatrix() {
    let currentMatrix = null;
    let distanceMultiplicator = 1.3;
    let currentPosition = [1.00, 1.00, 0.60];
    let lookAtPosition = [0.0, 0.0, 0.0];
    let up = [0.0, 0.0, 1.0];
    const stepSizeZoom = 0.01;
    const stepSizeRotation = 0.01;

    refreshMatrix();

    this.updateShader = function(gl, matrixLocation) {
        gl.uniformMatrix4fv(matrixLocation, false, currentMatrix);
    }

    this.rotateLeft = function() {
        currentPosition[0] += stepSizeRotation;
        currentPosition[1] += stepSizeRotation;
        refreshMatrix();
    }

    this.rotateRight = function() {
        currentPosition[0] -= stepSizeRotation;
        currentPosition[1] -= stepSizeRotation;
        refreshMatrix();
    }

    this.rotateUp = function() {
        currentPosition[2] += stepSizeRotation;
        up[2] = (Math.cos(currentPosition[2]) > 0) ? 1 : -1;

        refreshMatrix();
    }

    this.rotateDown = function() {
        currentPosition[2] -= stepSizeRotation;
        up[2] = (Math.cos(currentPosition[2]) > 0) ? 1 : -1;
        refreshMatrix();
    }

    this.zoomIn = function() {
        if(distanceMultiplicator > 0.1) {
            distanceMultiplicator -= stepSizeZoom;
        }

        refreshMatrix();
    }

    this.zoomOut = function() {
        if(distanceMultiplicator < 5) {
            distanceMultiplicator += stepSizeZoom;
        }

        refreshMatrix();
    }

    function refreshMatrix() {
        currentMatrix = mat4.create();

        mat4.lookAt(currentMatrix,
            [
                Math.sin(currentPosition[0]) * distanceMultiplicator * Math.cos(currentPosition[2]),
                Math.cos(currentPosition[1]) * distanceMultiplicator * Math.cos(currentPosition[2]),
                Math.sin(currentPosition[2]) * distanceMultiplicator,
            ],
            lookAtPosition,
            up);
    }
}