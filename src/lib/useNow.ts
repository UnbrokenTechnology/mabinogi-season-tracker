import { ref, onUnmounted } from 'vue'

// One shared ticking clock for the whole app.
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null
let subscribers = 0

export function useNow() {
  subscribers++
  if (!timer) {
    timer = setInterval(() => { now.value = new Date() }, 1000)
  }
  onUnmounted(() => {
    subscribers--
    if (subscribers <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  })
  return now
}
