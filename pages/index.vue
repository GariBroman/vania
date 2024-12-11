<script setup lang="ts">
const { $game } = useNuxtApp()
const { gameState, initGame } = $game
const showMemories = ref(false)

onMounted(() => {
  initGame()
})
</script>

<template>
  <div class="game-wrapper">
    <GameCanvas v-if="gameState.isGameStarted && !showMemories" />
    <MemoriesAlbum v-if="showMemories" />
    
    <div class="game-ui">
      <div v-if="!gameState.isGameStarted" class="start-screen">
        <h1>Путешествие по миру поздравлений</h1>
        <p>Отправляйтесь в увлекательное путешествие по волшебному миру и собирайте уникальные воспоминания!</p>
        <button @click="initGame">Начать игру</button>
      </div>
      
      <div v-if="gameState.isGameCompleted" class="completion-screen">
        <h2>Поздравляем!</h2>
        <p>Вы прошли все уровни и собрали {{ gameState.collectedCards.length }} открыток!</p>
        <p>Теперь вы можете посмотреть все собранные воспоминания в альбоме!</p>
        <button @click="showMemories = true">Открыть альбом воспоминаний</button>
      </div>
      
      <div v-if="gameState.isGameStarted && !gameState.isGameCompleted && !showMemories" class="game-hud">
        <div class="level-info">
          <h3>{{ getLevelName(gameState.currentLevel) }}</h3>
          <div class="level-progress">
            Уровень {{ gameState.currentLevel }} из 3
          </div>
        </div>
        <div class="cards-info">
          Собрано открыток: {{ gameState.collectedCards.length }}
        </div>
      </div>

      <CollectedCards v-if="gameState.isGameStarted && !showMemories" />
      
      <!-- Кнопка возврата из альбома воспоминаний -->
      <button
        v-if="showMemories"
        class="back-button"
        @click="showMemories = false"
      >
        Вернуться в игру
      </button>
    </div>
  </div>
</template>

<script lang="ts">
const getLevelName = (level: number): string => {
  const names = {
    1: 'Лес чудес',
    2: 'Снежное королевство',
    3: 'Тропический остров'
  }
  return names[level as keyof typeof names] || 'Неизвестный уровень'
}
</script>

<style scoped>
.game-wrapper {
  height: 100vh;
  width: 100vw;
  position: relative;
  background: linear-gradient(to bottom, #1a1a1a, #2d572c);
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.game-ui > * {
  pointer-events: auto;
}

.start-screen,
.completion-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  padding: 20px;
}

.start-screen p,
.completion-screen p {
  max-width: 600px;
  margin: 20px 0;
  line-height: 1.5;
}

.game-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 15px;
  border-radius: 12px;
  min-width: 200px;
}

.level-info h3 {
  margin: 0 0 5px 0;
}

.level-progress {
  font-size: 0.9em;
  opacity: 0.8;
}

.cards-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

button {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  opacity: 0.9;
}

.back-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}
</style> 