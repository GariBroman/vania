import WebApp from '@twa-dev/sdk'
import { ref } from 'vue'

interface Memory {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string
  author: string
  quote: string
  unlocked: boolean
  category: 'poet' | 'writer' | 'musician' | 'personal'
}

export interface GameState {
  currentLevel: number
  collectedCards: string[]
  isGameStarted: boolean
  isGameCompleted: boolean
  memories: Memory[]
  unlockedMemories: string[]
}

// Предварительно заданные воспоминания
const predefinedMemories: Memory[] = [
  {
    id: 'memory1',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:41:02.jpg',
    title: 'Пожелание от А.С. Пушкина',
    author: 'Александр Сергеевич Пушкин',
    quote: 'Храни меня, мой талисман,\nХрани меня во дни гоненья,\nВо дни раскаянья, волненья:\nТы в день печали был мне дан.',
    unlocked: false,
    category: 'poet'
  },
  {
    id: 'memory2',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:09.jpg',
    title: 'Поздравление от С.А. Есенина',
    author: 'Сергей Александрович Есенин',
    quote: 'Счастлив тем, что целовал я женщин,\nМял цветы, валялся на траве\nИ зверье, как братьев наших меньших,\nНикогда не бил по голове.',
    unlocked: false,
    category: 'poet'
  },
  {
    id: 'memory3',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:14.jpg',
    title: 'Пожелание от А.А. Ахматовой',
    author: 'Анна Андреевна Ахматова',
    quote: 'Я научилась просто, мудро жить,\nСмотреть на небо и молиться Богу,\nИ долго перед вечером бродить,\nЧтоб утомить ненужную тревогу.',
    unlocked: false,
    category: 'poet'
  },
  {
    id: 'memory4',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:17.jpg',
    title: 'Напутствие от В.С. Высоцкого',
    author: 'Владимир Семёнович Высоцкий',
    quote: 'Я не люблю фатального исхода,\nОт жизни никогда не устаю.\nЯ не люблю любое время года,\nКогда веселых песен не пою.',
    unlocked: false,
    category: 'musician'
  },
  {
    id: 'memory5',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:19.jpg',
    title: 'Послание от М.И. Цветаевой',
    author: 'Марина Ивановна Цветаева',
    quote: 'Уж сколько их упало в эту бездну,\nРазверстую вдали!\nНастанет день, когда и я исчезну\nС поверхности земли.',
    unlocked: false,
    category: 'poet'
  },
  {
    id: 'memory6',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:23.jpg',
    title: 'Праздничный момент',
    author: 'Семейный архив',
    quote: 'Особенные моменты, которые хочется сохранить навсегда',
    unlocked: false,
    category: 'personal'
  },
  {
    id: 'memory7',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:31.jpg',
    title: 'Размышление от И.А. Бродского',
    author: 'Иосиф Александрович Бродский',
    quote: 'Не выходи из комнаты, не совершай ошибку.\nЗачем тебе Солнце, если ты куришь Шипку?\nЗа дверью бессмысленно все, особенно - возглас счастья.',
    unlocked: false,
    category: 'poet'
  },
  {
    id: 'memory8',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:36.jpg',
    title: 'Мудрость от Л.Н. Толстого',
    author: 'Лев Николаевич Толстой',
    quote: 'Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.',
    unlocked: false,
    category: 'writer'
  },
  {
    id: 'memory9',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:38.jpg',
    title: 'Наблюдение от А.П. Чехова',
    author: 'Антон Павлович Чехов',
    quote: 'В человеке должно быть все прекрасно: и лицо, и одежда, и душа, и мысли.',
    unlocked: false,
    category: 'writer'
  },
  {
    id: 'memory10',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:41.jpg',
    title: 'Воспоминание о празднике',
    author: 'Семейный архив',
    quote: 'Каждый момент радости - это драгоценный камень в ожерелье нашей жизни',
    unlocked: false,
    category: 'personal'
  },
  {
    id: 'memory11',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:48.jpg',
    title: 'Семейные традиции',
    author: 'Семейный архив',
    quote: 'Традиции - это нити, связывающие поколения воедино',
    unlocked: false,
    category: 'personal'
  },
  {
    id: 'memory12',
    type: 'photo',
    url: '/game/memories/IMAGE 2024-12-11 21:42:54.jpg',
    title: 'Счастливые моменты',
    author: 'Семейный архив',
    quote: 'В каждой улыбке - история, в каждом объятии - целая жизнь',
    unlocked: false,
    category: 'personal'
  }
]

export const useGame = () => {
  const gameState = ref<GameState>({
    currentLevel: 1,
    collectedCards: [],
    isGameStarted: false,
    isGameCompleted: false,
    memories: [...predefinedMemories],
    unlockedMemories: []
  })

  const initGame = () => {
    // Initialize Telegram Web App
    WebApp.ready()
    WebApp.expand()

    // Set initial game state
    gameState.value.isGameStarted = true
  }

  const completeLevel = () => {
    // Разблокируем воспоминание при завершении уровня
    const unlockedMemory = gameState.value.memories.find(
      m => !m.unlocked && !gameState.value.unlockedMemories.includes(m.id)
    )
    
    if (unlockedMemory) {
      unlockedMemory.unlocked = true
      gameState.value.unlockedMemories.push(unlockedMemory.id)
      
      // Показываем уведомление о разблокировке воспоминания
      WebApp.showPopup({
        title: 'Новое воспоминание!',
        message: `Вы разблокировали: ${unlockedMemory.title}`,
        buttons: [
          {
            id: 'view',
            type: 'default',
            text: 'Посмотреть'
          },
          {
            id: 'continue',
            type: 'cancel',
            text: 'Продолжить игру'
          }
        ]
      })
    }

    gameState.value.currentLevel++
    if (gameState.value.currentLevel > 3) {
      gameState.value.isGameCompleted = true
    }
  }

  const collectCard = (cardId: string) => {
    if (!gameState.value.collectedCards.includes(cardId)) {
      gameState.value.collectedCards.push(cardId)
    }
  }

  const resetGame = () => {
    gameState.value = {
      currentLevel: 1,
      collectedCards: [],
      isGameStarted: true,
      isGameCompleted: false,
      memories: [...predefinedMemories],
      unlockedMemories: []
    }
  }

  const getUnlockedMemories = () => {
    return gameState.value.memories.filter(m => m.unlocked)
  }

  const getMemoriesByCategory = (category: Memory['category']) => {
    return gameState.value.memories.filter(m => m.unlocked && m.category === category)
  }

  return {
    gameState,
    initGame,
    completeLevel,
    collectCard,
    resetGame,
    getUnlockedMemories,
    getMemoriesByCategory
  }
} 