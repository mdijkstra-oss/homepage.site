import { SimpleIcon } from 'simple-icons'
import { IconValue } from './icons'

export function iconValueFromSI(si: SimpleIcon): IconValue {
  return {
    svgString: si.svg,
    color: `#${si.hex}`,
    title: si.title,
  }
}

export function iconValueFromDataUrl(dataUrl: string, color: string, title: string): IconValue {
  return {
    svgString: dataUrlToSvgString(dataUrl),
    color,
    title,
  }
}

function dataUrlToSvgString(dataUrl: string): string {
  if (!isThemeableSvg(dataUrl)) {
    throw new Error('Imported data url is not a themable SVG')
  }

  return decodeURIComponent(dataUrl.replace('data:image/svg+xml,', ''))
}

function isThemeableSvg(dataUrl: string) {
  if (!dataUrl.startsWith('data:image/svg+xml,')) return false
  const svgString = decodeURIComponent(dataUrl.replace('data:image/svg+xml,', ''))
  if (svgString.includes('fill="#') || svgString.includes('stroke="#')) return false
  return true
}
