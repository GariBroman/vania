<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const { gameState, completeLevel, collectCard } = useGame()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let composer: EffectComposer
let animationFrameId: number
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2

const initThree = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  
  if (!canvasRef.value) return
  
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  
  // Set up initial camera position
  camera.position.z = 5
  
  // Add basic lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(0, 1, 1)
  scene.add(directionalLight)
  
  // Add post-processing
  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
  )
  composer.addPass(bloomPass)
  
  // Start animation loop
  animate()
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  composer.render()
}

const handleResize = () => {
  if (!canvasRef.value) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

const handleClick = (event: MouseEvent) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0) {
    const object = intersects[0].object
    if (object instanceof THREE.Mesh && object.geometry instanceof THREE.PlaneGeometry) {
      // Animate card collection
      gsap.to(object.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: 'back.in',
        onComplete: () => {
          scene.remove(object)
          collectCard(`card-${Date.now()}`)
          
          // Check if all cards are collected
          const remainingCards = scene.children.filter(
            obj => obj instanceof THREE.Mesh && obj.geometry instanceof THREE.PlaneGeometry
          )
          
          if (remainingCards.length === 0) {
            // Add level completion animation
            const particles = createCompletionParticles()
            scene.add(particles)
            
            gsap.delayedCall(2, () => {
              scene.remove(particles)
              completeLevel()
            })
          }
        }
      })
    }
  }
}

const createCompletionParticles = () => {
  const particlesCount = 100
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particlesCount * 3)
  const colors = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10
    positions[i + 1] = (Math.random() - 0.5) * 10
    positions[i + 2] = (Math.random() - 0.5) * 10
    
    colors[i] = Math.random()
    colors[i + 1] = Math.random()
    colors[i + 2] = Math.random()
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  })
  
  const particles = new THREE.Points(geometry, material)
  
  // Animate particles
  gsap.to(particles.rotation, {
    y: Math.PI * 2,
    duration: 2,
    ease: 'power1.inOut'
  })
  
  gsap.to(material, {
    opacity: 0,
    duration: 2,
    ease: 'power1.inOut'
  })
  
  return particles
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', handleClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', handleClick)
  cancelAnimationFrame(animationFrameId)
  composer?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <div class="game-canvas-container">
    <canvas ref="canvasRef" class="game-canvas" />
    <GameLevel
      v-if="scene"
      :level-number="gameState.currentLevel"
      :scene="scene"
    />
  </div>
</template>

<style scoped>
.game-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.game-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  z-index: 1;
}
</style> 