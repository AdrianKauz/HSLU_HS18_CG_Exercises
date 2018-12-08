export function OrbitalObject() {
    const ctx = {
        model : null,
        parentMatrix : null,
        matrix : null,
        parent : null,
        child : [],
        object : {
            position : [0.0, 0.0, 0.0],
            scaling : [1.0, 1.0, 1.0],
            initialOrientation : [0.0, 0.0, 0.0],
            currOrientation : [0.0, 0.0, 0.0],
            rotationVelocity : [0.0, 0.0, 0.0],
        },
        orbital : {
            velocity : 0.0,
            inclination : 0.0,
            radius : 0.0,
            orientation : 0.0
        }
    };


    this.setParentMatrix = function(newMatrix) {
        ctx.parentMatrix = newMatrix;
    }


    this.setModel = function(newModel) {
        ctx.model = newModel;
    };


    this.getModel = function() {
        return ctx.model;
    };

    this.addChild = function(newChild) {
        ctx.child.push(newChild);
    }


    //-------------------------------------------------------------------------
    // Object Stuff
    //-------------------------------------------------------------------------
    this.setObjectScaling = function(newXScale, newYScale, newZScale) {
        ctx.object.scaling = [newXScale, newYScale, newZScale];
    };

    this.setObjectOrientation = function(newXRotation, newYRotation, newZRotation,) {
        ctx.object.initialOrientation = [newXRotation, newYRotation, newZRotation];
    };

    /**
     * @param newVelocityX as Value in radiant/s
     * @param newVelocityY as Value in radiant/s
     * @param newVelocityZ as Value in radiant/s
     */
    this.setObjectRotationVelocity = function(newVelocityX, newVelocityY, newVelocityZ) {
        ctx.object.rotationVelocity = [newVelocityX, newVelocityY, newVelocityZ];
    };


    //-------------------------------------------------------------------------
    // Orbit Stuff
    //-------------------------------------------------------------------------
    /**
     * @param newRadius as float >= 0.0
     */
    this.setOrbitalRadius = function(newRadius) {
        ctx.orbital.radius = newRadius;
    };

    /**
     * @param newVelocity as Value in radiant/s
     */
    this.setOrbitalVelocity = function(newVelocity) {
        ctx.orbital.velocity = newVelocity;
    };


    /**
     * @param newInclination as Value in degrees
     */
    this.setOrbitalInclination = function(newInclination) {
        ctx.orbital.inclination = newInclination;
    };


    this.draw = function(gl, newViewMatrix) {
        ctx.model.draw(gl, newViewMatrix);
/*
        ctx.child.forEach(function (child) {
            child.draw(gl, newViewMatrix);
        })*/
    };


    this.refreshModel = function(deltaTime) {
        // Set initial Matrix
        ctx.matrix = (ctx.parentMatrix == null) ? mat4.create() : ctx.parentMatrix;

        // Tilt orbit around Y-Axis
        if(ctx.orbital.inclination !== 0.0) {
            mat4.rotateY(ctx.matrix, ctx.matrix, (ctx.orbital.inclination * Math.PI / 180));
        }

        // Rotate object around Z-Axis
        if(ctx.orbital.velocity !== 0.0) {
            ctx.orbital.orientation += (ctx.orbital.velocity / 1000) * deltaTime;
            ctx.orbital.orientation = ctx.orbital.orientation % (2 * Math.PI);

            mat4.rotateZ(ctx.matrix, ctx.matrix, ctx.orbital.orientation);
        }

        // Set distance
        mat4.translate(ctx.matrix, ctx.matrix, [ctx.orbital.radius, 0.0, 0.0]);

        // Rotate Object around itself
        if(ctx.object.rotationVelocity[0] !== 0.0) {
            ctx.object.currOrientation[0] += (ctx.object.rotationVelocity[0] / 1000) * deltaTime;
            ctx.object.currOrientation[0] = ctx.object.currOrientation[0] % (2 * Math.PI);

            mat4.rotateX(ctx.matrix, ctx.matrix, ctx.object.currOrientation[0]);
        }

        if(ctx.object.rotationVelocity[1] !== 0.0) {
            ctx.object.currOrientation[1] += (ctx.object.rotationVelocity[1] / 1000) * deltaTime;
            ctx.object.currOrientation[1] = ctx.object.currOrientation[1] % (2 * Math.PI);

            mat4.rotateY(ctx.matrix, ctx.matrix, ctx.object.currOrientation[1]);
        }

        if(ctx.object.rotationVelocity[2] !== 0.0) {
            ctx.object.currOrientation[2] += (ctx.object.rotationVelocity[2] / 1000) * deltaTime;
            ctx.object.currOrientation[2] = ctx.object.currOrientation[2] % (2 * Math.PI);

            mat4.rotateZ(ctx.matrix, ctx.matrix, ctx.object.currOrientation[2]);
        }

        // Initial Orientation
        mat4.rotateX(ctx.matrix, ctx.matrix, ctx.object.initialOrientation[0]);
        mat4.rotateY(ctx.matrix, ctx.matrix, ctx.object.initialOrientation[1]);
        mat4.rotateZ(ctx.matrix, ctx.matrix, ctx.object.initialOrientation[2]);

        // Scale Object
        if((ctx.object.scaling[0] !== 1.0) && (ctx.object.scaling[1] !== 1.0) && (ctx.object.scaling[2] !== 1.0)) {
            mat4.scale(ctx.matrix, ctx.matrix, ctx.object.scaling);
        }

        ctx.model.setModelMatrix(ctx.matrix);
/*
        ctx.child.forEach(function (child) {
            child.setParentMatrix(ctx.matrix);
            child.refreshModel(deltaTime);
        })*/
    }
}