varying vec3 vColor;
uniform float uTime;


// void main()
// {
  //Circle
  // float strength = distance(gl_PointCoord,vec2(0.5));
  // strength = step(0.5,strength);
  // strength = 1.0-strength;
  //
  // gl_FragColor=vec4(vec3(strength),1.0);

  //Diffuse point pattern
  // float strength = distance(gl_PointCoord,vec2(0.5));
  // strength =strength*2.0;
  // strength = 1.0-strength;
  // gl_FragColor=vec4(vec3(strength),1.0);

  //Light Point Pattern
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength = 1.0-strength;
  // strength = pow(strength,10.0);
  //
  // vec3 color = mix(vec3(0.0),vColor,strength);

//   gl_FragColor=vec4(1.0,0.7,0.2,1.0);
//
// }


precision highp float;

		uniform sampler2D map;

		varying vec2 vUv;
		varying float vScale;

		// HSL to RGB Convertion helpers
		vec3 HUEtoRGB(float H){
			H = mod(H,1.0);
			float R = abs(H * 6.0 - 3.0) - 1.0;
			float G = 2.0 - abs(H * 6.0 - 2.0);
			float B = 2.0 - abs(H * 6.0 - 4.0);
			return clamp(vec3(R,G,B),0.0,1.0);
		}

		vec3 HSLtoRGB(vec3 HSL){
			vec3 RGB = HUEtoRGB(HSL.x);
			float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
			return (RGB - 0.5) * C + HSL.z;
		}

		void main() {
			vec4 diffuseColor = texture2D( map, vUv );
			// gl_FragColor = vec4( diffuseColor.xyz * HSLtoRGB(vec3(vScale/5.0, 1.0, 0.5)), diffuseColor.w );

      gl_FragColor = vec4(1.0, 0.3 , 0.2, diffuseColor.w );
			if ( diffuseColor.w < 0.5 ) discard;
		}
