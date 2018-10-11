attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;

void main() {
    // to complete
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vColor = aVertexColor;
}