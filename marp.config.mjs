import { Marp } from '@marp-team/marp-core'
import { readFileSync } from 'node:fs'
import QRCodeLib from 'qrcode'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const SLIDES_BASE_URL = pkg.config?.slidesBaseUrl ?? ''

/**
 * QRCode.create() (sync) でQRデータを生成し、SVG data URI を返す
 */
function generateQRDataUri(text) {
  const qr = QRCodeLib.create(text, { errorCorrectionLevel: 'M' })
  const { data, size } = qr.modules
  const margin = 2
  const total = size + margin * 2

  let rects = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) {
        rects += `<rect x="${x + margin}" y="${y + margin}" width="1" height="1"/>`
      }
    }
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}">`,
    `<rect width="100%" height="100%" fill="#fff"/>`,
    rects,
    `</svg>`,
  ].join('')

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * markdown-it plugin: frontmatter の qr_slide から QR コードを自動生成し
 * 全スライドの末尾に <lt-qr> を自動挿入する
 */
function qrPlugin(md) {
  md.core.ruler.push('qr_parse', (state) => {
    const match = state.src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (match) {
      const fm = match[1].match(/qr_slide:\s*(.+)/)
      if (fm) state.env.__qrSlide = fm[1].trim()
    }
    const body = state.src.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    state.env.__totalSlides = body.split(/\n---\s*\n/).length
  })

  const originalRender = md.renderer.render.bind(md.renderer)

  md.renderer.render = (tokens, options, env) => {
    let html = originalRender(tokens, options, env)

    if (env.__qrSlide) {
      const url = `${SLIDES_BASE_URL}/${env.__qrSlide}/`
      const imgTag = `<img src="${generateQRDataUri(url)}" alt="QR" />`
      const total = env.__totalSlides || 1

      const largeQr = `<lt-qr>\n  ${imgTag}\n  <span>scan to view slides</span>\n</lt-qr>\n`
      const smallQr = `<lt-qr>\n  ${imgTag}\n</lt-qr>\n`

      let slideIndex = 0
      html = html.replace(/<\/section>/g, (match) => {
        const isFirstOrLast = slideIndex === 0 || slideIndex === total - 1
        const qr = isFirstOrLast ? largeQr : smallQr
        slideIndex++
        return `${qr}${match}`
      })
    }

    return html
  }
}

class QRMarp extends Marp {
  constructor(opts = {}) {
    super(opts)
    this.markdown.use(qrPlugin)
  }
}

/** @type {import('@marp-team/marp-cli').Config} */
export default {
  engine: QRMarp,
  html: true,
  themeSet: ['./themes'],
}
