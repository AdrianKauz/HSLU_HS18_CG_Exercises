attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vVertexPositionEye;
varying vec3 vNormal;

void main() {
    // calculate the vertex position in eye Coordinate
    vec4 vVertexPositionMV = uViewMatrix * uModelMatrix * aVertexPosition;
    vVertexPositionEye = vVertexPositionMV.xyz / vVertexPositionMV.w;

    // calculate the normal vector in eye coordinates
    vNormal = normalize(uNormalMatrix * aVertexNormal);

    // transform and calculate texture coordinates
    vTextureCoord = aTextureCoord;

    // set color for fragment shaded
    vColor = aVertexColor;

    // Set Pointsize for
    gl_PointSize = 5.0;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
}