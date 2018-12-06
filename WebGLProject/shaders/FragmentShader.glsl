precision mediump float;
varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;

uniform sampler2D uSampler;
uniform bool uTextureModeOn;

void main() {
    gl_FragColor = (uTextureModeOn) ? texture2D(uSampler, vTextureCoord) : vColor;
}