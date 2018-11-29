precision mediump float;
varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;
varying vec3 vVertexPositionEye3;
varying vec3 vNormalEye;

uniform sampler2D uSampler;
uniform bool uTextureModeOn;

void main() {
    vec4 baseColor = (uTextureModeOn) ? texture2D(uSampler, vTextureCoord) : vColor;

    gl_FragColor = baseColor;
}