import { useGameStore } from './store/useGameStore'
import IntroScreen from './screens/IntroScreen'
import GameScreen from './screens/GameScreen'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  return screen === 'intro' ? <IntroScreen /> : <GameScreen />
}