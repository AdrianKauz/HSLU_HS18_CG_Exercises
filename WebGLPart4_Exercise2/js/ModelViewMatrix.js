export function ModelViewMatrix() {
    let currentMatrix = null;
    let distanceMultiplicator = 1.3;
    let currentposition = [1.00, 1.00, 1.00];
    let lookAtPosition = [0.0, 0.0, 0.0];
    let up = [0.0, 1.0, 0.0];
    let refreshMatrix = true;

    this.updateMatrix = function(gl, matrixLocation) {
        if(refreshMatrix) {
            currentMatrix = mat4.create();

            mat4.lookAt(currentMatrix,
                        [
                            Math.sin(currentposition[0]) * distanceMultiplicator * Math.abs(Math.cos(currentposition[1])),
                            Math.sin(currentposition[1]) * distanceMultiplicator,
                            Math.cos(currentposition[2]) * distanceMultiplicator * Math.abs(Math.cos(currentposition[1]))
                        ],
                        lookAtPosition,
                        up);
            gl.uniformMatrix4fv(matrixLocation, false, currentMatrix);
            refreshMatrix = false;
        }
    }

    this.rotateLeft = function() {
        currentposition[0] += 0.010;
        currentposition[2] += 0.010;
        refreshMatrix = true;
    }

    this.rotateRight = function() {
        currentposition[0] -= 0.010;
        currentposition[2] -= 0.010;
        refreshMatrix = true;
    }

    this.rotateUp = function() {
        currentposition[1] += 0.010;
        refreshMatrix = true;
    }

    this.rotateDown = function() {
        currentposition[1] -= 0.010;
        refreshMatrix = true;
    }
}