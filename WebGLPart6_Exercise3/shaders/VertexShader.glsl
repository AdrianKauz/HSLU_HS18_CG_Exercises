attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vVertexPositionEye;
varying vec3 vNormalEye;

void main() {
    // calculate the vertex position in eye Coordinate
    vec4 vVertexPositionEye4 = uModelViewMatrix * aVertexPosition;
    vVertexPositionEye = vVertexPositionEye4.xyz / vVertexPositionEye4.w;

    // calculate the normal vector in eye coordinates
    vNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // transform and calculate texture coordinates
    vTextureCoord = aTextureCoord;

    // set color for fragment shaded
    vColor = aVertexColor;

    gl_Position = uProjectionMatrix * vVertexPositionEye4;
    gl_PointSize = 10.0;
}