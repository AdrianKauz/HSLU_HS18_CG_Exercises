export function OrbitalObject() {
    const ctx = {
        model : null,
        matrix : null,
        child : [],
        parent : null,
        position : [],
        rotation : [],
        rotationVelocity : [Math.PI/10, 0.0, 0.0], // In radiant per second
        orbitalVelocity : [0.0, 0.0, 0.0]
    };


    this.setPosition = function(newPosX, newPosY, newPosZ) {
        ctx.position = [newPosX, newPosY, newPosZ];
    };


    this.setModel = function(newModel) {
        ctx.model = newModel;
    };


    this.draw = function(gl, newViewMatrix) {
        ctx.model.draw(gl, newViewMatrix);
    };


    this.getModel = function() {
        return ctx.model;
    };


    this.refreshModel = function(deltaTime) {
        ctx.matrix = mat4.create();

        if(ctx.rotationVelocity[0] !== 0.0) {
            ctx.rotation += ctx.rotationVelocity[0] * deltaTime;
            mat4.rotateX(ctx.matrix, ctx.matrix, ctx.rotation[0]);
        }

        if(ctx.rotationVelocity[1] !== 0.0) {
            mat4.rotateY(ctx.matrix, ctx.matrix, ctx.rotation[1]);
        }

        if(ctx.rotationVelocity[2] !== 0.0) {
            mat4.rotateZ(ctx.matrix, ctx.matrix, ctx.rotation[2]);
        }

        ctx.model.setModelMatrix(ctx.matrix);
    }
}