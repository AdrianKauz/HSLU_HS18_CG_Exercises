export function CameraViewMatrix() {
    let ctx = {
        matrix : null,
        matrixHasChanged : false,
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
        speed : {
            mouse : 0.001,
            keypress : 0.01
        },
        yaw : 270.0,
        pitch : 0.0
    };

    // Initial
    ctx.vectors.cameraPos = [0.0, 0.0, 1.0];
    ctx.vectors.cameraFront = [0.0, 0.0, -1.0];
    ctx.vectors.cameraUp = [0.0, 1.0, 0.0];
    refreshVectors();


    this.getMatrix = function() {
        if(ctx.matrixHasChanged) {
            ctx.matrixHasChanged = false;
            refreshCameraFront();
            refreshMatrix();
        }

        return ctx.matrix;
    };


    this.getCurrentCameraInfos = function() {
      return {
          position : ctx.vectors.cameraPos,
          yaw : ctx.yaw,
          pitch : ctx.pitch
      }
    };


    this.moveLeft = function() {
        moveHorizontal(ctx.speed.keypress * -1);
    };


    this.moveRight = function() {
        moveHorizontal(ctx.speed.keypress);
    };


    this.moveForward = function () {
        moveVertical(ctx.speed.keypress);
    };


    this.moveBackward = function () {
        moveVertical(ctx.speed.keypress * -1);
    };


    this.rotateWithMouse = function(newMouseMovement) {
        refreshYaw(ctx.speed.mouse * 100 * newMouseMovement.x);
        refreshPitch(ctx.speed.mouse * 100 * newMouseMovement.y * -1);
    };


    this.rotateRight = function() {
        refreshYaw(ctx.speed.keypress * 100);
    };


    this.rotateLeft = function() {
        refreshYaw(ctx.speed.keypress * -100);
    };


    this.rotateUp = function() {
        refreshPitch(ctx.speed.keypress * -100);
    };


    this.rotateDown = function() {
        refreshPitch(ctx.speed.keypress * 100);
    };


    function moveHorizontal(newDistance) {
        let tempVector = vec3.create();
        vec3.cross(tempVector, ctx.vectors.cameraFront, ctx.vectors.cameraUp);
        vec3.normalize(tempVector, tempVector);
        vec3.scale(tempVector, tempVector, newDistance);
        vec3.add(ctx.vectors.cameraPos, ctx.vectors.cameraPos, tempVector);

        ctx.matrixHasChanged = true;
    }


    function moveVertical(newDistance) {
        let tempVector = vec3.create();
        vec3.scale(tempVector, ctx.vectors.cameraFront, newDistance);
        vec3.add(ctx.vectors.cameraPos, ctx.vectors.cameraPos, tempVector);

        ctx.matrixHasChanged = true;
    }


    function refreshYaw(newDeltaAngle) {
        ctx.yaw += newDeltaAngle;
        ctx.yaw += 360.0;
        ctx.yaw = ctx.yaw % 360.0;

        ctx.matrixHasChanged = true;
    }


    function refreshPitch(newDeltaAngle) {
        ctx.pitch += newDeltaAngle;
        ctx.pitch = ctx.pitch % 360.0;

        if(ctx.pitch > 89.0) {
            ctx.pitch = 89.0;
        }

        if(ctx.pitch < -89.0) {
            ctx.pitch = -89.0;
        }

        ctx.matrixHasChanged = true;
    }


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
    }


    function degToRad(newDegreesValue) {
        return newDegreesValue * Math.PI / 180;
    }
}