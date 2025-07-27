import { ref, readonly, watch } from 'vue'
import type { GameId } from '@/types'

// 全局游戏状态
const currentGame = ref<GameId>('fh5')

// 游戏变化事件监听器
type GameChangeListener = (gameId: GameId) => void
const listeners = new Set<GameChangeListener>()

export function useGameState() {
  // 设置当前游戏
  const setCurrentGame = (gameId: GameId) => {
    if (currentGame.value !== gameId) {
      currentGame.value = gameId
      // 通知所有监听器
      listeners.forEach(listener => listener(gameId))
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