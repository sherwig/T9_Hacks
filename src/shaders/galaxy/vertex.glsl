

precision highp float;
		uniform float uTime;

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
			mvPosition.xyz += position * scale ;
			vUv = uv;
			gl_Position = projectionMatrix * mvPosition;

    }
