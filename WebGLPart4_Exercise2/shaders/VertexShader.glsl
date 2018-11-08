attribute vec4 aVertexPosition;

uniform mat4 uProjectionMat;
uniform mat4 uModelMat;

void main() {
    vec4 pos = uModelMat * aVertexPosition;
    //vec3 pos = uProjectionMat * uModelMat * aVertexPosition;
    gl_Position = pos; //vec4(pos.xy, 0, pos.z);
}