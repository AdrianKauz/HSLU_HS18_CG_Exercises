attribute vec2 aVertexPosition;

uniform vec3 uProjectionMat;
uniform vec3 uModelMat;

void main() {
    gl_Position = vec4(uProjectionMat * vec3(aVertexPosition, 1), 1);
}