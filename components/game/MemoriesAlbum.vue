<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import WebApp from '@twa-dev/sdk'
import { gsap } from 'gsap'
import type { Memory } from '~/composables/game/useGame'

const { gameState, getUnlockedMemories, getMemoriesByCategory } = useGame()

const selectedMemory = ref<Memory | null>(null)
const selectedCategory = ref<Memory['category'] | 'all'>('all')

const categories = {
  all: 'Все воспоминания',
  poet: 'Поэты',
  writer: 'Писатели',
  musician: 'Музыканты',
  personal: 'Личные моменты'
}

const filteredMemories = computed(() => {
  if (selectedCategory.value === 'all') {
    return getUnlockedMemories()
  }
  return getMemoriesByCategory(selectedCategory.value)
})

const showMemoryDetails = (memory: Memory) => {
  selectedMemory.value = memory
  // Анимация появления модального окна
  nextTick(() => {
    const modalContent = document.querySelector('.modal-content')
    if (modalContent) {
      gsap.fromTo(modalContent,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      )
    }
  })
}

const closeMemoryDetails = () => {
  // Анимация закрытия модального окна
  const modalContent = document.querySelector('.modal-content')
  if (modalContent) {
    gsap.to(modalContent, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        selectedMemory.value = null
      }
    })
  }
}

const shareMemory = (memory: Memory) => {
  WebApp.showPopup({
    title: 'Поделиться воспоминанием',
    message: `Поделиться "${memory.title}"?`,
    buttons: [
      {
        id: 'share',
        type: 'default',
        text: 'Поделиться'
      },
      {
        id: 'cancel',
        type: 'cancel',
        text: 'Отмена'
      }
    ]
  })
}

// Анимация появления карточек при монтировании
onMounted(() => {
  nextTick(() => {
    const cards = document.querySelectorAll('.memory-item')
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    })
  })
})
</script>

<template>
  <div class="memories-album">
    <h2>Альбом воспоминаний</h2>
    
    <!-- Категории -->
    <div class="categories-nav">
      <button
        v-for="(label, category) in categories"
        :key="category"
        class="category-button"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category as Memory['category'] | 'all'"
      >
        {{ label }}
      </button>
    </div>
    
    <div v-if="filteredMemories.length === 0" class="no-memories">
      <p>В этой категории пока нет разблокированных воспоминаний</p>
    </div>
    
    <div v-else class="memories-grid">
      <div
        v-for="memory in filteredMemories"
        :key="memory.id"
        class="memory-item"
        @click="showMemoryDetails(memory)"
      >
        <div class="memory-preview">
          <img
            v-if="memory.type === 'photo'"
            :src="memory.url"
            :alt="memory.title"
            class="memory-image"
          />
          <video
            v-else
            :src="memory.url"
            class="memory-video"
            controls
          />
          <div class="memory-overlay">
            <div class="memory-category">{{ categories[memory.category] }}</div>
          </div>
        </div>
        <div class="memory-info">
          <h3>{{ memory.title }}</h3>
          <p class="memory-author">{{ memory.author }}</p>
        </div>
      </div>
    </div>

    <!-- Модальное окно с деталями воспоминания -->
    <Transition name="fade">
      <div v-if="selectedMemory" class="memory-modal" @click.self="closeMemoryDetails">
        <div class="modal-content">
          <button class="close-button" @click="closeMemoryDetails">&times;</button>
          
          <div class="memory-content">
            <img
              v-if="selectedMemory.type === 'photo'"
              :src="selectedMemory.url"
              :alt="selectedMemory.title"
              class="memory-full-image"
            />
            <video
              v-else
              :src="selectedMemory.url"
              class="memory-full-video"
              controls
              autoplay
            />
          </div>
          
          <div class="memory-details">
            <div class="memory-category-badge">
              {{ categories[selectedMemory.category] }}
            </div>
            <h2>{{ selectedMemory.title }}</h2>
            <p class="author">{{ selectedMemory.author }}</p>
            <p class="quote">{{ selectedMemory.quote }}</p>
            
            <button class="share-button" @click="shareMemory(selectedMemory)">
              Поделиться воспоминанием
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.memories-album {
  padding: 20px;
  color: white;
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95));
}

.no-memories {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 20px auto;
  max-width: 600px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.categories-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.category-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button.active {
  background: var(--tg-theme-button-color);
  transform: scale(1.05);
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.memory-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.memory-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.memory-preview {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.memory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.memory-item:hover .memory-overlay {
  opacity: 1;
}

.memory-category {
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.memory-image,
.memory-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.memory-item:hover .memory-image,
.memory-item:hover .memory-video {
  transform: scale(1.1);
}

.memory-info {
  padding: 15px;
}

.memory-info h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
}

.memory-author {
  margin: 5px 0 0;
  font-size: 0.9em;
  opacity: 0.8;
}

.memory-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.memory-content {
  max-height: 60vh;
  overflow: hidden;
}

.memory-full-image,
.memory-full-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.memory-details {
  padding: 30px;
  position: relative;
}

.memory-category-badge {
  display: inline-block;
  background: var(--tg-theme-button-color);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.memory-details h2 {
  margin: 0 0 10px;
  text-align: left;
}

.author {
  font-style: italic;
  opacity: 0.8;
  margin: 0 0 20px;
}

.quote {
  font-size: 1.1em;
  line-height: 1.6;
  margin: 0 0 30px;
  white-space: pre-line;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  position: relative;
}

.quote::before,
.quote::after {
  content: '"';
  font-size: 2em;
  opacity: 0.3;
  position: absolute;
}

.quote::before {
  top: 0;
  left: 10px;
}

.quote::after {
  bottom: -10px;
  right: 10px;
}

.share-button {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 1.1em;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.share-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .memories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    padding: 10px;
  }

  .memory-details {
    padding: 20px;
  }

  .quote {
    font-size: 1em;
    padding: 15px;
  }
}
</style> 