export function CameraViewMatrix() {
    let ctx = {
        matrix : null,
        positions : {
            camera : [0.0, 0.0, 0.0],
            lookAt : [0.0, 0.0, 0.0],
            up : [0.0, 0.0, 1.0]
        },
        vectors : {
            positionCameraToLookAt : [0.0, 0.0, 0.0],
        },
        movement : {
            horizontal : [0.0, 0.0, 0.0],
            vertical : [0.0, 0.0, 0.0],
            stepSize : 0.01
        }
    };

    let currentMatrix = null;
    let distance = 1.0;
    let currentPosition = [1.0, 1.0, 0.60];
    let lookAtPosition = [0.0, 0.0, 0.0];
    let up = [0.0, 0.0, 1.0];
    const stepSizeZoom = 0.01;
    const stepSizeRotation = 0.01;


    ctx.positions.camera = [-0.5, -0.5, 0.5];
    ctx.positions.lookAt = [0.0, 0.0, 0.0];
    refreshVectors();

    this.getMatrix = function() {
        return ctx.matrix;
    }


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
        if(distance < 20) {
            distance += stepSizeZoom;
        }

        refreshMatrix();
    };


    this.moveLeft = function() {
            vec3.cross(ctx.movement.horizontal, ctx.positions.up, ctx.vectors.positionCameraToLookAt);
            vec3.normalize(ctx.movement.horizontal, ctx.movement.horizontal)
            vec3.scale(ctx.movement.horizontal, ctx.movement.horizontal, ctx.movement.stepSize);

        refreshMatrix();
    };


    this.moveRight = function() {
            vec3.cross(ctx.movement.horizontal, ctx.vectors.positionCameraToLookAt, ctx.positions.up);
            vec3.normalize(ctx.movement.horizontal, ctx.movement.horizontal);
            vec3.scale(ctx.movement.horizontal, ctx.movement.horizontal, ctx.movement.stepSize);

        refreshMatrix();
    };


    this.rotateLeftAlternate = function() {
        // Mit Kreuzprodukt der LookAt- und Up-Vektoren
        let cameraToLookAtVektor = vec3.create();
        vec3.subtract(cameraToLookAtVektor, ctx.lookAt, ctx.position);

        let sideVektor = vec3.create();
        vec3.cross(sideVektor, ctx.up, cameraToLookAtVektor);
        vec3.normalize(sideVektor, sideVektor);
        vec3.scale(sideVektor, sideVektor, stepSizeRotation);

        let translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, sideVektor);

        vec3.transformMat4(ctx.position, ctx.position, translationMatrix);

        console.log(sideVektor);
        refreshMatrix();
    };


    function refreshVectors() {
        ctx.vectors.positionCameraToLookAt = vec3.create();
        vec3.subtract(ctx.vectors.positionCameraToLookAt, ctx.positions.lookAt, ctx.positions.camera);
    }


    function refreshMatrix() {
        // First refresh positions
        let translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, ctx.movement.horizontal);

        vec3.transformMat4(ctx.positions.camera, ctx.positions.camera, translationMatrix);
        vec3.transformMat4(ctx.positions.lookAt, ctx.positions.lookAt, translationMatrix);
        //vec3.transformMat4(ctx.positions.up, ctx.positions.up, translationMatrix);

        console.log(ctx.positions);

        ctx.matrix = mat4.create();
        mat4.lookAt(ctx.matrix, ctx.positions.camera, ctx.positions.lookAt, ctx.positions.up);
    }


    function refreshMatrixOld() {
        ctx.matrix = mat4.create();

        mat4.lookAt(ctx.matrix, ctx.positions.camera, ctx.positions.lookAt, ctx.positions.up);

        /*
        mat4.lookAt(currentMatrix,
            [
                Math.sin(currentPosition[0]) * distance * Math.cos(currentPosition[2]),
                Math.cos(currentPosition[1]) * distance * Math.cos(currentPosition[2]),
                Math.sin(currentPosition[2]) * distance,
            ],
            lookAtPosition,
            up);*/
    }
}