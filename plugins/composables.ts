import { useGame } from '~/composables/game/useGame'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      game: useGame()
    }
  }
}) 