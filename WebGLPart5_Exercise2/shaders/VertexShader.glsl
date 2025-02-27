attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}