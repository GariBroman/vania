<script setup lang="ts">
import { gsap } from 'gsap'
import * as THREE from 'three'

const props = defineProps<{
  levelNumber: number
  scene: THREE.Scene
}>()

// Level-specific objects
let levelObjects: THREE.Object3D[] = []
let cards: THREE.Mesh[] = []

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Level configurations
const levelConfigs = {
  1: {
    name: 'Лес чудес',
    backgroundColor: new THREE.Color(0x2d572c),
    cardPositions: [
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(2, 0, 0),
    ],
    decorations: [
      {
        type: 'tree',
        positions: [
          new THREE.Vector3(-3, -1, -1),
          new THREE.Vector3(3, -1, -1),
          new THREE.Vector3(0, -1, -2),
        ]
      },
      {
        type: 'flower',
        positions: [
          new THREE.Vector3(-1.5, -1, 0),
          new THREE.Vector3(1.5, -1, 0),
          new THREE.Vector3(0, -1, 1),
        ]
      }
    ]
  },
  2: {
    name: 'Снежное королевство',
    backgroundColor: new THREE.Color(0x87ceeb),
    cardPositions: [
      new THREE.Vector3(-2, -1, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(2, -1, 0),
    ],
    decorations: [
      {
        type: 'snowflake',
        positions: [
          new THREE.Vector3(-3, 2, -1),
          new THREE.Vector3(3, 2, -1),
          new THREE.Vector3(0, 3, -1),
        ]
      },
      {
        type: 'icecrystal',
        positions: [
          new THREE.Vector3(-2, -2, -1),
          new THREE.Vector3(2, -2, -1),
        ]
      }
    ]
  },
  3: {
    name: 'Тропический остров',
    backgroundColor: new THREE.Color(0x20b2aa),
    cardPositions: [
      new THREE.Vector3(-2, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(2, 1, 0),
    ],
    decorations: [
      {
        type: 'palm',
        positions: [
          new THREE.Vector3(-3, -1, -1),
          new THREE.Vector3(3, -1, -1),
        ]
      },
      {
        type: 'wave',
        positions: [
          new THREE.Vector3(-2, -2, 0),
          new THREE.Vector3(0, -2, 0),
          new THREE.Vector3(2, -2, 0),
        ]
      }
    ]
  }
}

const createCard = (position: THREE.Vector3) => {
  const geometry = new THREE.PlaneGeometry(1, 1.5)
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  })
  
  const card = new THREE.Mesh(geometry, material)
  card.position.copy(position)
  
  // Add glow effect
  const glowGeometry = new THREE.PlaneGeometry(1.2, 1.7)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  card.add(glow)
  glow.position.z = -0.1
  
  // Add floating animation
  gsap.to(card.position, {
    y: position.y + 0.2,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  // Add rotation animation
  gsap.to(card.rotation, {
    y: Math.PI * 2,
    duration: 5,
    repeat: -1,
    ease: 'none'
  })
  
  return card
}

const createDecoration = (type: string, position: THREE.Vector3) => {
  let decoration: THREE.Mesh

  switch (type) {
    case 'tree':
      decoration = createTree(position)
      break
    case 'flower':
      decoration = createFlower(position)
      break
    case 'snowflake':
      decoration = createSnowflake(position)
      break
    case 'icecrystal':
      decoration = createIceCrystal(position)
      break
    case 'palm':
      decoration = createPalm(position)
      break
    case 'wave':
      decoration = createWave(position)
      break
    default:
      return null
  }

  if (decoration) {
    levelObjects.push(decoration)
    props.scene.add(decoration)
  }
}

const createTree = (position: THREE.Vector3) => {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 1, 8),
    new THREE.MeshPhongMaterial({ color: 0x8b4513 })
  )
  
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 1, 8),
    new THREE.MeshPhongMaterial({ color: 0x228b22 })
  )
  
  leaves.position.y = 0.8
  trunk.add(leaves)
  trunk.position.copy(position)
  
  return trunk
}

const createFlower = (position: THREE.Vector3) => {
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
    new THREE.MeshPhongMaterial({ color: 0x228b22 })
  )
  
  const petalGeometry = new THREE.CircleGeometry(0.15, 5)
  const petalMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff69b4,
    side: THREE.DoubleSide
  })
  
  for (let i = 0; i < 5; i++) {
    const petal = new THREE.Mesh(petalGeometry, petalMaterial)
    petal.rotation.z = (i * Math.PI * 2) / 5
    petal.position.y = 0.3
    stem.add(petal)
  }
  
  stem.position.copy(position)
  return stem
}

const createSnowflake = (position: THREE.Vector3) => {
  const group = new THREE.Group()
  
  const material = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  })
  
  for (let i = 0; i < 6; i++) {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.1),
      material
    )
    arm.rotation.z = (i * Math.PI) / 3
    group.add(arm)
  }
  
  group.position.copy(position)
  
  // Add rotation animation
  gsap.to(group.rotation, {
    z: Math.PI * 2,
    duration: 8,
    repeat: -1,
    ease: 'none'
  })
  
  return group
}

const createIceCrystal = (position: THREE.Vector3) => {
  const crystal = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 0.8, 6),
    new THREE.MeshPhongMaterial({ 
      color: 0xadd8e6,
      transparent: true,
      opacity: 0.6
    })
  )
  
  crystal.position.copy(position)
  
  // Add floating animation
  gsap.to(crystal.position, {
    y: position.y + 0.2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  return crystal
}

const createPalm = (position: THREE.Vector3) => {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8),
    new THREE.MeshPhongMaterial({ color: 0x8b4513 })
  )
  
  const leafGeometry = new THREE.PlaneGeometry(1, 0.3)
  const leafMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x228b22,
    side: THREE.DoubleSide
  })
  
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial)
    leaf.position.y = 0.7
    leaf.rotation.z = (i * Math.PI * 2) / 5
    leaf.rotation.x = Math.PI / 4
    trunk.add(leaf)
  }
  
  trunk.position.copy(position)
  return trunk
}

const createWave = (position: THREE.Vector3) => {
  const wave = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.3),
    new THREE.MeshPhongMaterial({ 
      color: 0x40e0d0,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
  )
  
  wave.position.copy(position)
  
  // Add wave animation
  gsap.to(wave.rotation, {
    z: 0.2,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  return wave
}

const initLevel = () => {
  const config = levelConfigs[props.levelNumber as keyof typeof levelConfigs]
  if (!config) return
  
  // Set background color
  props.scene.background = config.backgroundColor
  
  // Create cards
  config.cardPositions.forEach(position => {
    const card = createCard(position)
    cards.push(card)
    props.scene.add(card)
    levelObjects.push(card)
  })
  
  // Create decorations
  config.decorations.forEach(decoration => {
    decoration.positions.forEach(position => {
      createDecoration(decoration.type, position)
    })
  })
}

onMounted(() => {
  initLevel()
})

onUnmounted(() => {
  // Clean up level objects
  levelObjects.forEach(obj => {
    props.scene.remove(obj)
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose()
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose())
      } else {
        obj.material.dispose()
      }
    }
  })
})
</script>

<template>
  <div class="level-container">
    <!-- Level-specific UI elements can go here -->
  </div>
</template>

<style scoped>
.level-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style> 