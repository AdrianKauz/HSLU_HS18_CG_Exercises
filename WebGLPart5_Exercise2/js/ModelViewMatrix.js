export function ModelViewMatrix() {
    let currentMatrix = null;
    let distanceMultiplicator = 1.3;
    let currentPosition = [1.00, 0.60, 1.00];
    let lookAtPosition = [0.0, 0.0, 0.0];
    let up = [0.0, 1.0, 0.0];
    refreshMatrix();

    this.updateVertexShader = function(gl, matrixLocation) {
        gl.uniformMatrix4fv(matrixLocation, false, currentMatrix);
    }

    this.rotateLeft = function() {
        currentPosition[0] += 0.010;
        currentPosition[2] += 0.010;
        refreshMatrix();
    }

    this.rotateRight = function() {
        currentPosition[0] -= 0.010;
        currentPosition[2] -= 0.010;
        refreshMatrix();
    }

    this.rotateUp = function() {
        currentPosition[1] += 0.010;
        up[1] = (Math.cos(currentPosition[1]) > 0) ? 1 : -1;

        refreshMatrix();
    }

    this.rotateDown = function() {
        currentPosition[1] -= 0.010;
        up[1] = (Math.cos(currentPosition[1]) > 0) ? 1 : -1;
        refreshMatrix();
    }

    this.zoomIn = function() {
        if(distanceMultiplicator > 0.1) {
            distanceMultiplicator -= 0.01;
        }

        refreshMatrix();
    }

    this.zoomOut = function() {
        if(distanceMultiplicator < 5) {
            distanceMultiplicator += 0.01;
        }

        refreshMatrix();
    }

    function refreshMatrix() {
        currentMatrix = mat4.create();

        mat4.lookAt(currentMatrix,
            [
                Math.sin(currentPosition[0]) * distanceMultiplicator * Math.cos(currentPosition[1]),
                Math.sin(currentPosition[1]) * distanceMultiplicator,
                Math.cos(currentPosition[2]) * distanceMultiplicator * Math.cos(currentPosition[1])
            ],
            lookAtPosition,
            up);
    }
}