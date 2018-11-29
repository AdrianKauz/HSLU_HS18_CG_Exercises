attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uCameraViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;
varying vec3 vVertexPositionEye3;
varying vec3 vNormalEye;

void main() {
    vec4 vVertexPositionEye4 = uModelMatrix * aVertexPosition;
    vVertexPositionEye3 = vVertexPositionEye4.xyz / vVertexPositionEye4.w;

    vNormalEye = normalize(uNormalMatrix * aVertexNormal);

    vTextureCoord = aTextureCoord;
    vColor = aVertexColor;

    gl_Position = uProjectionMatrix * uCameraViewMatrix * vVertexPositionEye4;
}