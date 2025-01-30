type FunctionArgs = (...args: unknown[]) => unknown

export function throttleFn(fn: FunctionArgs, wait: number, trailing: boolean = false, leading: boolean = true): FunctionArgs {
  let lastCallTime: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: unknown[]) {
    const now = Date.now()

    if (lastCallTime === null && leading) {
      lastCallTime = now
      fn(...args)
      return
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (trailing && (lastCallTime === null || now - lastCallTime >= wait)) {
        fn(...args)
      }
      lastCallTime = null
      timeoutId = null
    }, wait)

    if (lastCallTime === null) {
      lastCallTime = Date.now()
    }
  }
}
