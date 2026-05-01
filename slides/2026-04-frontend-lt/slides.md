---
marp: true
theme: lt-teal
paginate: true
header: "#intro #lt"
footer: "@ezakichi3207  /  fukuoka.ts #2026"
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
  <div class="avatar"><span>avatar</span></div>
  <div class="info">

<p style="font-family:var(--font-mono);font-size:15px;color:var(--fg-dim);letter-spacing:0.06em;margin:0">name —</p>

## Your Name

| role   | :: | Frontend Engineer   |
|--------|----|---------------------|
| org    | :: | SaaS Company, Inc.  |
| x      | :: | *@ezakichi3207*     |
| github | :: | *github.com/you*    |
| blog   | :: | *blog.example.com*  |

  </div>
</div>

<div style="position:absolute;bottom:93px;right:67px">
  <lt-postit rotate="-5">普段は React<br>と TypeScript<br>書いてます</lt-postit>
</div>

---

<!-- _class: agenda -->
<!-- header: "#agenda" -->

<lt-kicker>agenda</lt-kicker>

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

<div style="position:absolute;top:133px;right:120px">
  <lt-sticker rotate="8" color="peach">NEW</lt-sticker>
</div>

---

<!-- _class: body-text -->
<!-- header: "#key-message" -->

<lt-kicker>key message</lt-kicker>

## ビルドは早ければ早いほど *正義。*

> でも、本当に大事なのは「壊れないビルド」

---

<!-- _class: bullets -->
<!-- header: "#approach" -->

<lt-kicker>approach</lt-kicker>

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

<lt-kicker>example</lt-kicker>

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

<lt-kicker>demo</lt-kicker>

## 実際の *画面*

![screenshot placeholder](assets/placeholder.png)

本番のダッシュボード（モック）

---

<!-- _class: quote -->
<!-- header: "#quote" -->

<lt-kicker>reference</lt-kicker>

> Premature optimization is the root of all evil — yet we should not pass up our opportunities in that critical 3%.

**Donald Knuth** · Structured Programming with go to Statements

---

<!-- _class: compare -->
<!-- header: "#result" -->

<lt-kicker>result</lt-kicker>

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
