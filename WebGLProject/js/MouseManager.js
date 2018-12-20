export function MouseManager(newCanvas) {
    let ctx = {
        movement : {
            x : 0,
            y : 0
        }
    };

    // Forking for different browsers
    newCanvas.requestPointerLock = newCanvas.requestPointerLock || newCanvas.mozRequestPointerLock;
    document.exitPointerLock = newCanvas.exitPointerLock || newCanvas.mozExitPointerLock;

    // Set up event listener for pointer lock
    newCanvas.onclick = function() { newCanvas.requestPointerLock(); };

    // pointerlockchange handling (for different browsers)
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);


    function lockChangeAlert() {
        if (document.pointerLockElement === newCanvas || document.mozPointerLockElement === newCanvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", updatePosition, false);
        }
    }


    function updatePosition(e) {
        ctx.movement.x += e.movementX;
        ctx.movement.y += e.movementY;
    }


    this.getMovement = function() {
        let currMovement = {
            x : ctx.movement.x,
            y : ctx.movement.y
        };

        ctx.movement.x = 0;
        ctx.movement.y = 0;

        return currMovement;
    }
}







/*

// pointer lock object forking for cross browser

    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
        document.mozExitPointerLock;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    function lockChangeAlert() {
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", updatePosition, false);
        }
    }
*/