---
marp: true
theme: lt-teal
paginate: true
header: "#intro #lt"
footer: "@ezakichi3207  /  fukuoka.ts #2026"
qr_slide: 2026-04-frontend-lt
---

<!-- _class: title -->

`[ TECH MEETUP / 2026.04 ]`

# Frontend *LT.*

// 5min talk · template edition

<lt-deco>
  <lt-sticker rotate="-2">@ezakichi3207</lt-sticker>
  <lt-badge>5min LT</lt-badge>
  <lt-sticker rotate="3" color="peach">v1.0</lt-sticker>
</lt-deco>


---

<!-- _class: whoami -->
<!-- header: "#self-intro" -->

<lt-kicker>$ whoami</lt-kicker>

<div class="whoami-grid">
  <div class="avatar"><img src="assets/profile.jpg" alt="えざきち" /></div>
  <div class="info">

<p style="font-family:var(--font-mono);font-size:22px;color:var(--fg-dim);letter-spacing:0.06em;margin:0">name —</p>

## えざきち

| role   | :: | Product Engineer           |
|--------|----|----------------------------|
| org    | :: | サイボウズ株式会社 / kintone開発 |
| x      | :: | *<a href="https://x.com/ezakichi3207" target="_blank">@ezakichi3207</a>* |
| github | :: | *<a href="https://github.com/shoken3207" target="_blank">shoken3207</a>* |
| site   | :: | *<a href="https://zakki-portfolio.vercel.app/" target="_blank">zakki-portfolio</a>* |

  </div>
</div>

<div style="position:absolute;bottom:120px;right:80px;display:flex;flex-direction:column;align-items:center;gap:12px">
  <img src="assets/PXL_20260426_081005823.MP.jpg" style="width:260px;height:260px;object-fit:cover;border-radius:8px;border:1.5px solid var(--border);box-shadow:4px 6px 14px rgba(0,0,0,0.18);transform:rotate(3deg)" />
  <lt-postit rotate="-5">最近、鳥取・岡山<br>旅行に行ってきました</lt-postit>
</div>


---

<!-- _class: agenda -->
<!-- header: "#agenda" -->

## 本日 *話すこと*

1. 問題提起 — 何が起きているか `1 min`
2. やったこと — アプローチ `2 min`
3. 結果 — Before / After `1.5 min`
4. 学び と これから `0.5 min`


---

<!-- _class: section-divider -->
<!-- header: "#section" -->

—— section / 01
*problem*

# まずは*現状*

<div style="position:absolute;top:200px;right:180px">
  <lt-sticker rotate="8" color="peach">NEW</lt-sticker>
</div>


---

<!-- _class: body-text -->
<!-- header: "#key-message" -->

## ビルドは早ければ早いほど *正義。*

> でも、本当に大事なのは「壊れないビルド」


---

<!-- _class: bullets -->
<!-- header: "#approach" -->

## 3つの *改善ポイント*

- **依存グラフを可視化する**
  どのパッケージがボトルネックかを最初に把握する
- **キャッシュ戦略を見直す**
  Turbopack/Vite のキャッシュ層を理解して使い切る
- **計測を CI に組み込む**
  PR ごとにビルド時間の差分を可視化


---

<!-- _class: code-slide -->
<!-- header: "#code #vite" -->

## 差分は *数行で済む*

`vite.config.ts`

```ts
// build config
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
  cacheDir: "./.vite-cache",
});
```

> 設定はシンプルに保つのがコツ


---

<!-- _class: image-slide -->
<!-- header: "#demo" -->

## 実際の *画面*

![screenshot placeholder](assets/placeholder.png)

本番のダッシュボード（モック）


---

<!-- _class: quote -->
<!-- header: "#quote" -->

> Premature optimization is the root of all evil — yet we should not pass up our opportunities in that critical 3%.

**Donald Knuth** · Structured Programming with go to Statements


---

<!-- _class: compare -->
<!-- header: "#result" -->

## ビルド時間が *1/3 に*

<lt-compare>
<lt-panel type="before">

### 180秒

- 毎 PR ごとにフルビルド
- キャッシュは活用できず
- PR レビュー前に離席

</lt-panel>
<lt-panel type="after">

### 55秒

- 差分のみリビルド
- リモートキャッシュ共有
- CI 上で完結

</lt-panel>
</lt-compare>


---

<!-- _class: closing -->
<!-- header: "#outro" -->

— fin

# Thank *you.*

ご清聴ありがとうございました

<lt-deco>
  <lt-sticker rotate="-2">@ezakichi3207</lt-sticker>
  <lt-badge>questions / comments</lt-badge>
  <lt-sticker rotate="4" color="peach">thx!</lt-sticker>
</lt-deco>


<lt-prompt>logout</lt-prompt>
