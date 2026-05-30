import { useEffect, useState } from 'react'

export function useTypewriter(examples: readonly string[]) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    let exIdx = 0,
      charIdx = 0,
      deleting = false
    let tid: ReturnType<typeof setTimeout>

    const tick = () => {
      const cur = examples[exIdx]
      if (!deleting) {
        charIdx++
        setTyped(cur.slice(0, charIdx))
        tid =
          charIdx === cur.length ? setTimeout(tick, 1400) : setTimeout(tick, 60)
        if (charIdx === cur.length) deleting = true
      } else {
        charIdx--
        setTyped(cur.slice(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          exIdx = (exIdx + 1) % examples.length
        }
        tid = charIdx === 0 ? setTimeout(tick, 400) : setTimeout(tick, 30)
      }
    }

    tid = setTimeout(tick, 800)
    return () => clearTimeout(tid)
  }, [examples])

  return typed
}

export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [_idx, setIdx] = useState(-1)

  const push = (cmd: string) => {
    setHistory(prev => [cmd, ...prev].slice(0, 50))
    setIdx(-1)
  }

  const navigate = (dir: 'up' | 'down', setInput: (v: string) => void) => {
    setIdx(prev => {
      const next =
        dir === 'up'
          ? Math.min(prev + 1, history.length - 1)
          : Math.max(prev - 1, -1)
      setInput(next === -1 ? '' : (history[next] ?? ''))
      return next
    })
  }

  return { push, navigate }
}
