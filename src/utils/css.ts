export function classnames(...args: (string | Record<string, unknown>)[]): string {
  const classes: string[] = []

  for (const arg of args) {
    if (typeof arg === 'string') {
      classes.push(arg)
    } else {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}
