attribute vec4 aVertexPosition;

uniform mat4 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    vec4 pos = /*uProjectionMat **/ aVertexPosition;
    //vec3 pos = uProjectionMat * uModelMat * aVertexPosition;
    gl_Position = pos; //vec4(pos.xy, 0, pos.z);
}