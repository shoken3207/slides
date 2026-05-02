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
 *
 * - 最初と最後のスライド: 大きい QR + ラベル
 * - その他のスライド: 小さい QR（ラベルなし）
 * - Markdown に <lt-qr> を手書きする必要なし
 */
function qrPlugin(md) {
  // frontmatter から qr_slide を読み取り、スライド総数を計算
  md.core.ruler.push('qr_parse', (state) => {
    const match = state.src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (match) {
      const fm = match[1].match(/qr_slide:\s*(.+)/)
      if (fm) state.env.__qrSlide = fm[1].trim()
    }
    // --- で分割してスライド数を数える（frontmatter の --- は除く）
    const body = state.src.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    state.env.__totalSlides = body.split(/\n---\s*\n/).length
    state.env.__currentSlide = 0
  })

  // スライド区切り（hr = ---）をカウント
  const originalHr =
    md.renderer.rules.hr || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.hr = (tokens, idx, options, env, self) => {
    env.__currentSlide = (env.__currentSlide || 0) + 1
    return originalHr(tokens, idx, options, env, self)
  }

  // 各スライドの最後のトークンを検出して QR を注入
  // open_close マーカーとして fence/html_block/paragraph 等の最後のレンダリング時に注入
  const originalRender = md.renderer.render.bind(md.renderer)

  md.renderer.render = (tokens, options, env) => {
    if (!env.__qrSlide) return originalRender(tokens, options, env)

    const url = `${SLIDES_BASE_URL}/${env.__qrSlide}/`
    const imgTag = `<img src="${generateQRDataUri(url)}" alt="QR" />`
    const total = env.__totalSlides || 1

    // 大きい QR（タイトル/クロージング用）
    const largeQr = `<lt-qr>\n  ${imgTag}\n  <span>scan to view slides</span>\n</lt-qr>\n`
    // 小さい QR（通常スライド用）
    const smallQr = `<lt-qr>\n  ${imgTag}\n</lt-qr>\n`

    let html = originalRender(tokens, options, env)

    // Marp は各スライドを <section>...</section> で区切る
    // 各 </section> の直前に QR を挿入
    let slideIndex = 0
    html = html.replace(/<\/section>/g, (match) => {
      const isFirstOrLast = slideIndex === 0 || slideIndex === total - 1
      const qr = isFirstOrLast ? largeQr : smallQr
      slideIndex++
      return `${qr}${match}`
    })

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
