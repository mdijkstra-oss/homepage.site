type CSSKey = keyof CSSStyleDeclaration

export const mirrorTextStyles = (source: HTMLElement, target: HTMLElement) => {
  const textLayoutProps: CSSKey[] = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'fontVariant',
    'letterSpacing',
    'wordSpacing',
    'textTransform',
    'textIndent',
    'lineHeight',
  ] as const

  mirrorStyles(source, target, textLayoutProps)
}

const mirrorStyles = (source: HTMLElement, target: HTMLElement, styles: CSSKey[] = []) => {
  const computed = getComputedStyle(source)
  styles.forEach((prop) => {
    // @ts-expect-error Not all keys are writeable
    target.style[prop] = computed[prop]
  })
}
