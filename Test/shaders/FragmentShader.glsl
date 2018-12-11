precision mediump float;
varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vVertexPositionEye;
varying vec3 vNormal;

uniform bool uEnableTexture;
uniform bool uEnableLighting;

uniform sampler2D uSampler;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;

const float ambientFactor = 0.1;
const float shininess = 60.0;
const vec3 specularMaterialColor = vec3(0.3, 0.3, 0.3);

void main() {
    vec4 baseColor = (uEnableTexture) ? texture2D(uSampler, vTextureCoord) : vColor;

    if(uEnableLighting) {
        vec3 normal = normalize(vNormal);

        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // calculate light direction as seen from the vertex position
        vec3 surfaceToLightDirection = normalize(uLightPosition - vVertexPositionEye);


        // diffuse lighting
        float diffuseFactor = max(dot(normal, surfaceToLightDirection), 0.0);
        vec3 diffuseColor = uLightColor * vec3(baseColor) * diffuseFactor;

        // specular lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
           vec3 reflectionDir = reflect(surfaceToLightDirection, normal);
           vec3 eyeDir = normalize(vVertexPositionEye);
           float cosPhi = max(dot(reflectionDir, eyeDir), 0.0);
           float specularFactor = pow(cosPhi, shininess);

           specularColor = specularMaterialColor * specularFactor * uLightColor;
        }

        vec3 color = ambientColor + diffuseColor + specularColor;

        gl_FragColor = vec4(color, 1.0);

    }
    else {
        gl_FragColor = baseColor;
    }
}