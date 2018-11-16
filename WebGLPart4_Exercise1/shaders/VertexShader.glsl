attribute vec4 aVertexPosition;

uniform mat4 uProjectionMat;

void main() {
    gl_Position = aVertexPosition;
}