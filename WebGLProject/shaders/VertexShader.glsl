attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uCameraViewMatrix;
uniform mat4 uModelMatrix;

varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;

void main() {
    gl_Position = uProjectionMatrix * uCameraViewMatrix * uModelMatrix * aVertexPosition; // Projektion <- Camera <- Welt <- Model
    vTextureCoord = aTextureCoord;
    vColor = aVertexColor;
}