import './style.css'
import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import galaxyVertexShader from './shaders/galaxy/vertex.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const texture = new THREE.TextureLoader().load('textures/circle.png');


var geometry;
let material;
let points;
var circleGeometry;

const parameters = {}
parameters.count = 22700
parameters.size = 12
parameters.radius = 1.0
parameters.radius2 = 10.0
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

const generateGalaxy = () => {

  // const positions = new Float32Array(parameters.count * 3)
  // const colors = new Float32Array(parameters.count * 3)
  // const scales = new Float32Array(parameters.count * 1)
  // const randomness = new Float32Array(parameters.count * 3)
  //
  //
  // const insideColor = new THREE.Color(parameters.insideColor)
  // const outsideColor = new THREE.Color(parameters.outsideColor)


  circleGeometry = new THREE.CircleGeometry(1, 6);

  geometry = new THREE.InstancedBufferGeometry();
  geometry.index = circleGeometry.index;
  geometry.attributes = circleGeometry.attributes;

  const translateArray = new Float32Array(parameters.count * 3);
  const outArray = new Float32Array(parameters.count * 3);
  // const cubeArray = new Float32Array(parameters.count * 3);
  var inc = Math.PI * (3 - Math.sqrt(5));
  var x = 0;
  var y = 0;
  var z = 0;
  var r = 0;
  var phi = 0;
  // var radius = 1.0;

  var x2 = 0;
  var y2 = 0;
  var z2 = 0;
  var r2 = 0;


  for (let i = 0, i3 = 0, l = parameters.count; i < l; i++, i3 += 3) {

    var off = 2 / parameters.count;
    y = i * off - 1 + off / 2;
    r = Math.sqrt(1 - y * y);
    phi = i * inc;
    x = Math.cos(phi) * r;
    z = (0, Math.sin(phi) * r);
    x *= parameters.radius * Math.random(); // but vary the radius to not just be on the surface
    y *= parameters.radius * Math.random();
    z *= parameters.radius * Math.random();
    translateArray[i3 + 0] = x;
    translateArray[i3 + 1] = y;
    translateArray[i3 + 2] = z;


    var off = 2 / parameters.count;
    y2 = i * off - 1 + off / 2;
    r = Math.sqrt(1 - y2 * y2);
    phi = i * inc;
    x2 = Math.cos(phi) * r;
    z2 = (0, Math.sin(phi) * r);
    x2 *= parameters.radius2 * Math.random(); // but vary the radius to not just be on the surface
    y2 *= parameters.radius2 * Math.random();
    z2 *= parameters.radius2 * Math.random();
    outArray[i3 + 0] = x2;
    outArray[i3 + 1] = y2;
    outArray[i3 + 2] = z2;



  }

  geometry.setAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3));
  geometry.setAttribute('zoomOut', new THREE.InstancedBufferAttribute(outArray, 3));


  /**
   * Material
   */
  material = new THREE.ShaderMaterial({
    depthWrite: true,
    depthWrite: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTime: {
        value: 0.0
      },
      map: {
        value: texture
      },
      radius: {
        value: 1.0
      }
    }

  })

  gui.add(material.uniforms.radius, 'value').min(0).max(10).step(0.1).name('radius');

  // console.log(material.uniforms.map.value);
  /**
   * Points
   */
  // points = new THREE.Points(geometry, material)

  points = new THREE.Mesh(geometry, material);
  points.scale.set(600, 600, 600);
  // console.log(points);
  scene.add(points)


}



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight / 2
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight / 2

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setSize(window.innerWidth, window.innerHeight);
})

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 1, 40000);
camera.position.z = 1600;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //update material
  const time = performance.now() * 0.0005;
  material.uniforms.uTime.value = time;

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

generateGalaxy()

tick()