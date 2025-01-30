import { log } from "console"

function debounce(func: () => void, delay: number = 3000): () => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func()
    }, delay)
  }
}

for (let i = 0; i < 10; i++) {
  debounce(() => log("Hello"))
}
