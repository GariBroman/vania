<script setup lang="ts">
import { WebApp } from '@twa-dev/sdk'

const { gameState } = useGame()

const shareCard = (cardId: string) => {
  WebApp.showPopup({
    title: 'Поделиться открыткой',
    message: 'Отправить эту открытку друзьям?',
    buttons: [
      {
        id: 'share',
        type: 'default',
        text: 'Отправить'
      },
      {
        id: 'cancel',
        type: 'cancel',
        text: 'Отмена'
      }
    ]
  }).then((buttonId) => {
    if (buttonId === 'share') {
      // Here you would implement the actual sharing logic
      // For now, we'll just show a success message
      WebApp.showAlert('Открытка отправлена!')
    }
  })
}
</script>

<template>
  <div class="collected-cards" v-if="gameState.collectedCards.length > 0">
    <h3>Собранные открытки</h3>
    <div class="cards-grid">
      <div
        v-for="cardId in gameState.collectedCards"
        :key="cardId"
        class="card-item"
        @click="shareCard(cardId)"
      >
        <div class="card-preview">
          <!-- В будущем здесь будет превью открытки -->
          🎉
        </div>
        <button class="share-button">
          Поделиться
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collected-cards {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 12px;
  color: white;
  max-width: 90%;
  width: 400px;
}

h3 {
  margin: 0 0 10px 0;
  text-align: center;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.card-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.card-item:hover {
  transform: scale(1.05);
}

.card-preview {
  font-size: 2em;
  margin-bottom: 5px;
}

.share-button {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  width: 100%;
}

.share-button:hover {
  opacity: 0.9;
}
</style> 