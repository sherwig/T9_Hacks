
// uniform float uSize;
// uniform float uTime;
// // attribute float aScale;
// // attribute vec3 aRandomness;
// varying vec3 vColor;
//
// //Can't send uv as a varying because each vertex is a particle
// //Have to use gl_PointCoord instead
// void main()
// {
//   // position
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   //spin
//   // float angle = atan(modelPosition.x,modelPosition.z);
//   // float distanceToCenter = length(modelPosition.xz);
//   // float angleOffset = (1.0/distanceToCenter)*uTime*0.2;
//   //
//   // angle+=angleOffset;
//   //
//   // modelPosition.x = cos(angle)*distanceToCenter;
//   // modelPosition.z = sin(angle)*distanceToCenter;
//   // modelPosition.z *= sin(angle)*distanceToCenter;
//   // modelPosition.y += sin(uTime*0.2);
//
//   // modelPosition.x+=aRandomness.x;
//   // modelPosition.y+=aRandomness.y;
//   // modelPosition.z+=aRandomness.z;
//
//   vec4 viewPosition = viewMatrix * modelPosition;
//   vec4 projectedPosition = projectionMatrix * viewPosition;
//
//
//
//   gl_Position = projectedPosition;
//
//   //size
//   // gl_PointSize = aScale * uSize;
//   // gl_PointSize *= ( 1.0 / - viewPosition.z );
//
//   //color
//   vColor=color;
// }


precision highp float;
		// uniform mat4 modelViewMatrix;
		// uniform mat4 projectionMatrix;
		uniform float uTime;

		// attribute vec3 position;
		// attribute vec2 uv;
		attribute vec3 translate;
    attribute vec3 zoomOut;

		varying vec2 vUv;
		varying float vScale;

		void main() {

      vec3 offsetter = mix(translate, zoomOut, abs(sin(uTime*0.2)));

			vec4 mvPosition = modelViewMatrix * vec4( offsetter, 1.0 );
			vec3 trTime = vec3(translate.x + uTime,translate.y + uTime,translate.z + uTime);
			float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );


			vScale = scale;
			scale = scale * 10.0 + 10.0;
      // position +=50.0 +sin(25.0*uTime);
			mvPosition.xyz += position * scale ;
			vUv = uv;

      // mvPosition.xyz +=mix(translate, zoomOut, abs(sin(uTime)));

      // mvPosition.x += 1000.0+sin(200.0*uTime);
      // mvPosition.y += 1000.0+sin(200.0*uTime);
			gl_Position = projectionMatrix * mvPosition;

    }
