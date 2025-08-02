import { ref, readonly, watch } from 'vue'
import type { GameId } from '@/types'

// 从localStorage获取初始游戏状态
const getInitialGame = (): GameId => {
  try {
    const savedGame = localStorage.getItem('forzatune.gameCategory')
    return (savedGame as GameId) || 'fh5'
  } catch (error) {
    console.error('Failed to get game category from localStorage:', error)
    return 'fh5'
  }
}

// 全局游戏状态
const currentGame = ref<GameId>(getInitialGame())

// 游戏变化事件监听器
type GameChangeListener = (gameId: GameId) => void
const listeners = new Set<GameChangeListener>()

export function useGameState() {
  // 设置当前游戏
  const setCurrentGame = (gameId: GameId) => {
    console.log('🎮 setCurrentGame called:', { oldValue: currentGame.value, newValue: gameId })
    if (currentGame.value !== gameId) {
      currentGame.value = gameId
      console.log('🎮 Game state updated to:', gameId)
      // 保存到localStorage
      try {
        localStorage.setItem('forzatune.gameCategory', gameId)
      } catch (error) {
        console.error('Failed to save game category to localStorage:', error)
      }
      // 通知所有监听器
      console.log('🎮 Notifying listeners, count:', listeners.size)
      listeners.forEach(listener => listener(gameId))
    } else {
      console.log('🎮 Game state unchanged, skipping update')
    }
  }

  // 添加游戏变化监听器
  const onGameChange = (listener: GameChangeListener) => {
    listeners.add(listener)
    
    // 返回取消监听的函数
    return () => {
      listeners.delete(listener)
    }
  }

  // 获取当前游戏ID
  const getCurrentGame = () => currentGame.value

  return {
    currentGame: readonly(currentGame),
    setCurrentGame,
    onGameChange,
    getCurrentGame
  }
} 