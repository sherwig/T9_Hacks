
uniform float uSize;
uniform float uTime;
attribute float aScale;
attribute vec3 aRandomness;
varying vec3 vColor;

//Can't send uv as a varying because each vertex is a particle
//Have to use gl_PointCoord instead
void main()
{
  // position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  //spin
  float angle = atan(modelPosition.x,modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  //Divide by 1.0 to have the ones int he center move faster
  // float angleOffset = (1.0/distanceToCenter)*uTime*sin(uTime*0.5)*0.2;
  float angleOffset = (1.0/distanceToCenter)*uTime*0.2;

  angle+=angleOffset;

  modelPosition.x = cos(angle)*distanceToCenter;
  modelPosition.z = sin(angle)*distanceToCenter;
  // modelPosition.z *= sin(angle)*distanceToCenter;
  // modelPosition.y += sin(uTime*0.2);

  modelPosition.x+=aRandomness.x;
  modelPosition.y+=aRandomness.y;
  modelPosition.z+=aRandomness.z;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;



  gl_Position = projectedPosition;

  //size
  gl_PointSize = aScale * uSize;
  gl_PointSize *= ( 1.0 / - viewPosition.z );

  //color
  vColor=color;
}
