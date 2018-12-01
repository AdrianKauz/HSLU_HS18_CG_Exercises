export function CameraViewMatrix() {
    let currentMatrix = null;
    let distance = 1.0;
    let currentPosition = [1.00, 1.00, 0.60];
    let lookAtPosition = [0.0, 0.0, 0.0];
    let up = [0.0, 0.0, 1.0];
    const stepSizeZoom = 0.01;
    const stepSizeRotation = 0.01;


    this.getMatrix = function() {
        return currentMatrix;
    };


    this.getCameraPosition = function() {
        return currentPosition;
    };


    this.setUpDirection = function(newXDirection, newYDirection, newZDirection) {
        up = [newXDirection, newYDirection, newZDirection];

        refreshMatrix();
    };


    this.setPosition = function(newXPosition, newYPosition, newZPosition) {
        currentPosition = [newXPosition, newYPosition, newZPosition];

        refreshMatrix();
    };


    this.setLookAtPosition = function(newXPosition, newYPosition, newZPosition) {
        lookAtPosition = [newXPosition, newYPosition, newZPosition];

        refreshMatrix();
    };

    this.setDistance = function(newDistance) {
        distance = newDistance;

        refreshMatrix();
    }


    this.rotateLeft = function() {
        currentPosition[0] += stepSizeRotation;
        currentPosition[1] += stepSizeRotation;

        refreshMatrix();
    };


    this.rotateRight = function() {
        currentPosition[0] -= stepSizeRotation;
        currentPosition[1] -= stepSizeRotation;

        refreshMatrix();
    };


    this.rotateUp = function() {
        currentPosition[2] += stepSizeRotation;
        up[2] = (Math.cos(currentPosition[2]) > 0) ? 1 : -1;

        refreshMatrix();
    };


    this.rotateDown = function() {
        currentPosition[2] -= stepSizeRotation;
        up[2] = (Math.cos(currentPosition[2]) > 0) ? 1 : -1;

        refreshMatrix();
    };


    this.zoomIn = function() {
        if(distance > 0.1) {
            distance -= stepSizeZoom;
        }

        refreshMatrix();
    };


    this.zoomOut = function() {
        if(distance < 5) {
            distance += stepSizeZoom;
        }

        refreshMatrix();
    };


    function refreshMatrix() {
        currentMatrix = mat4.create();

        mat4.lookAt(currentMatrix,
            [
                Math.sin(currentPosition[0]) * distance * Math.cos(currentPosition[2]),
                Math.cos(currentPosition[1]) * distance * Math.cos(currentPosition[2]),
                Math.sin(currentPosition[2]) * distance,
            ],
            lookAtPosition,
            up);
    }
}