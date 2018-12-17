export function CameraViewMatrix() {
    let ctx = {
        matrix : null,
        vectors : {
            cameraPos : [0.0, 0.0, 0.0],
            cameraFront : [0.0, 0.0, 0.0],
            cameraUp : [0.0, 0.0, 1.0],
            cameraTarget : [0.0, 0.0, 0.0],
            cameraDirection : [0.0, 0.0, 0.0],
            cameraRightDirection : [0.0, 0.0, 0.0],
            cameraUpDirection : [0.0, 0.0 , 0.0],
            up : [0.0, 1.0, 0.0]
        },
        movement : {
            horizontal : [0.0, 0.0, 0.0],
            vertical : [0.0, 0.0, 0.0],
            yaw : 0.0,
            pitch : 0.0,
            stepSize : 0.01
        },
        yaw : -90.0,
        pitch : 0.0
    };

    let currentMatrix = null;
    let distance = 1.0;
    let currentPosition = [1.0, 1.0, 0.60];
    let lookAtPosition = [0.0, 0.0, 0.0];
    let up = [0.0, 0.0, 1.0];
    const stepSizeZoom = 0.01;
    const stepSizeRotation = 0.01;


    ctx.vectors.cameraPos = [0.0, 0.0, 3.0];
    ctx.vectors.cameraFront = [0.0, 0.0, -1.0];
    ctx.vectors.cameraUp = [0.0, 1.0, 0.0];

    refreshVectors();

    this.getMatrix = function() {
        return ctx.matrix;
    }

/*
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
*/
    this.setDistance = function(newDistance) {
        distance = newDistance;

        refreshMatrix();
    };

/*
    this.rotateLeftOld = function() {
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
*/

    this.moveLeft = function() {
        let tempVector = vec3.create();
        vec3.cross(tempVector, ctx.vectors.cameraFront, ctx.vectors.cameraUp);
        vec3.normalize(tempVector, tempVector);
        vec3.scale(tempVector, tempVector, ctx.movement.stepSize);
        vec3.subtract(ctx.vectors.cameraPos, ctx.vectors.cameraPos, tempVector);
        refreshMatrix();


        /*vec3.cross(ctx.movement.horizontal, ctx.vectors.cameraDirection, ctx.c.up);
        vec3.normalize(ctx.movement.horizontal, ctx.movement.horizontal)
        vec3.scale(ctx.movement.horizontal, ctx.movement.horizontal, ctx.movement.stepSize);

        refreshMatrix();*/
    };


    this.moveRight = function() {
        let tempVector = vec3.create();
        vec3.cross(tempVector, ctx.vectors.cameraFront, ctx.vectors.cameraUp);
        vec3.normalize(tempVector, tempVector);
        vec3.scale(tempVector, tempVector, ctx.movement.stepSize);
        vec3.add(ctx.vectors.cameraPos, ctx.vectors.cameraPos, tempVector);
        refreshMatrix();
    };


    this.moveForward = function () {
        let tempVector = vec3.create();
        vec3.scale(tempVector, ctx.vectors.cameraFront, ctx.movement.stepSize);
        vec3.add(ctx.vectors.cameraPos, ctx.vectors.cameraPos, tempVector);

        refreshMatrix();
    };


    this.moveBackward = function () {
        let tempVector = vec3.create();
        vec3.scale(tempVector, ctx.vectors.cameraFront, ctx.movement.stepSize);
        vec3.subtract(ctx.vectors.cameraPos, ctx.vectors.cameraPos, tempVector);

        refreshMatrix();
    };


    this.rotateRight = function() {
        ctx.yaw += ctx.movement.stepSize * 100;

        refreshCameraFront();
        refreshMatrix();
    };


    this.rotateLeft = function() {
        ctx.yaw -= ctx.movement.stepSize * 100;

        refreshCameraFront();
        refreshMatrix();
    };


    this.rotateUp = function() {
        ctx.pitch += ctx.movement.stepSize * 100;

        ctx.vectors.up[1] = (ctx.pitch >= 90.0) ? -1 : 1;


        if(ctx.pitch > 89.0) {
            ctx.pitch = 89.0;
        }

        if(ctx.pitch < -89.0) {
            ctx.pitch = -89.0;
        }

        refreshCameraFront();
        refreshMatrix();
    };


    this.rotateDown = function() {
        ctx.pitch -= ctx.movement.stepSize * 100;

        if(ctx.pitch > 89.0) {
            ctx.pitch = 89.0;
        }

        if(ctx.pitch < -89.0) {
            ctx.pitch = -89.0;
        }

        refreshCameraFront();
        refreshMatrix();
    };


    function refreshCameraFront() {
        let tempVector = vec3.create();
        tempVector[0] = Math.cos(degToRad(ctx.pitch)) * Math.cos(degToRad(ctx.yaw));
        tempVector[1] = Math.sin(degToRad(ctx.pitch));
        tempVector[2] = Math.cos(degToRad(ctx.pitch)) * Math.sin(degToRad(ctx.yaw));
        vec3.normalize(ctx.vectors.cameraFront, tempVector);
    }


    function refreshVectors() {
        // Camera direction
        ctx.vectors.cameraDirection = vec3.create();
        vec3.subtract(ctx.vectors.cameraDirection, ctx.vectors.cameraPos, ctx.vectors.cameraTarget);
        vec3.normalize(ctx.vectors.cameraDirection, ctx.vectors.cameraDirection);

        // Camera Right direction
        ctx.vectors.cameraRightDirection = vec3.create();
        vec3.cross(ctx.vectors.cameraRightDirection, ctx.vectors.up, ctx.vectors.cameraDirection);
        vec3.normalize(ctx.vectors.cameraRightDirection, ctx.vectors.cameraRightDirection);

        // Camera Up direction
        vec3.cross(ctx.vectors.cameraUpDirection, ctx.vectors.cameraDirection, ctx.vectors.cameraRightDirection);
    }


    function refreshMatrix() {
        ctx.matrix = mat4.create();
        let tempVector = new vec3.create();
        vec3.add(tempVector, ctx.vectors.cameraPos, ctx.vectors.cameraFront);

        mat4.lookAt(ctx.matrix, ctx.vectors.cameraPos, tempVector, ctx.vectors.cameraUp);
        console.log(ctx.matrix);
    }


    function degToRad(newDegreesValue) {
        return newDegreesValue * Math.PI / 180;
    }
}