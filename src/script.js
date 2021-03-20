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

/**
 * Galaxy
 */
// const parameters = {}
// parameters.count = 200000
// parameters.size = 0.005
// parameters.radius = 5
// parameters.branches = 3
// parameters.spin = 1
// parameters.randomness = 0.5
// parameters.randomnessPower = 3
// parameters.insideColor = '#ff6030'
// parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null
var circleGeometry;

const parameters = {}
parameters.count = 50000
parameters.size = 12
parameters.radius = .05

const generateGalaxy = () => {
  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const scales = new Float32Array(parameters.count * 1)
  const randomness = new Float32Array(parameters.count * 3)


  const insideColor = new THREE.Color(parameters.insideColor)
  const outsideColor = new THREE.Color(parameters.outsideColor)


  circleGeometry = new THREE.CircleGeometry(1, 6);

  //Don't understand this
  geometry = new THREE.InstancedBufferGeometry();
  geometry.index = circleGeometry.index;
  geometry.attributes = circleGeometry.attributes;

  const translateArray = new Float32Array(parameters.count * 3);
  // const cubeArray = new Float32Array(parameters.count * 3);
  var inc = Math.PI * (3 - Math.sqrt(5));
  var x = 0;
  var y = 0;
  var z = 0;
  var r = 0;
  var phi = 0;
  var radius = 1.0;


  for (let i = 0, i3 = 0, l = parameters.count; i < l; i++, i3 += 3) {

    var off = 2 / parameters.count;
    y = i * off - 1 + off / 2;
    r = Math.sqrt(1 - y * y);
    phi = i * inc;
    x = Math.cos(phi) * r;
    z = (0, Math.sin(phi) * r);
    x *= radius * Math.random(); // but vary the radius to not just be on the surface
    y *= radius * Math.random();
    z *= radius * Math.random();
    translateArray[i3 + 0] = x;
    translateArray[i3 + 1] = y;
    translateArray[i3 + 2] = z;


    // Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b


  }

  geometry.setAttribute('position', new THREE.InstancedBufferAttribute(translateArray, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


  // for (let i = 0; i < parameters.count; i++) {
  //   const i3 = i * 3






  // Position
  // const radius = Math.random() * parameters.radius
  //
  // const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
  //
  //
  // positions[i3] = Math.cos(branchAngle) * radius
  // positions[i3 + 1] = 0.0
  // positions[i3 + 2] = Math.sin(branchAngle) * radius

  //randomness
  // const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
  // const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
  // const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
  // randomness[i3] = randomX
  // randomness[i3 + 1] = randomY
  // randomness[i3 + 2] = randomZ







  //scale
  // scales[i] = Math.random();
  // }

  // geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  //
  // geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  // geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))


  /**
   * Material
   */
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    // vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTime: {
        value: 0
      },
      uSize: {
        value: 30 * renderer.getPixelRatio()
      }
    }

  })

  /**
   * Points
   */
  // points = new THREE.Points(geometry, material)

  points = new THREE.Mesh(geometry, material);
  points.scale.set(500, 500, 500);
  console.log(points);
  scene.add(points)
}


// gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
// gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
// gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
// gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
// gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
// gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
// gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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
})

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 3
// camera.position.y = 3
// camera.position.z = 3

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 40000);
camera.position.z = 1400;
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
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

generateGalaxy()

tick()
