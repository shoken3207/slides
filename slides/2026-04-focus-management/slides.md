---
marp: true
theme: lt-teal
paginate: true
header: "#a11y #focus"
footer: "@ezakichi3207  /  fukuoka.ts #2026"
qr_slide: 2026-04-focus-management
---

<!-- _class: title -->

`[ TECH MEETUP / 2026.04 ]`

# Focus *Management.*

// 5min talk · web frontend edition

<lt-deco>
  <lt-sticker rotate="-2">@ezakichi3207</lt-sticker>
  <lt-badge>5min LT</lt-badge>
  <lt-sticker rotate="3" color="peach">a11y</lt-sticker>
</lt-deco>


---

<!-- _class: whoami -->
<!-- header: "#self-intro" -->

<lt-kicker>$ whoami</lt-kicker>

<div class="whoami-grid">
  <div class="avatar"><span>avatar</span></div>
  <div class="info">

<p style="font-family:var(--font-mono);font-size:22px;color:var(--fg-dim);letter-spacing:0.06em;margin:0">name —</p>

## Your Name

| role   | :: | Frontend Engineer   |
|--------|----|---------------------|
| org    | :: | SaaS Company, Inc.  |
| x      | :: | *@ezakichi3207*     |
| github | :: | *github.com/you*    |
| blog   | :: | *blog.example.com*  |

  </div>
</div>

<div style="position:absolute;bottom:140px;right:100px">
  <lt-postit rotate="-5">普段は React<br>と TypeScript<br>書いてます</lt-postit>
</div>


---

<!-- _class: agenda -->
<!-- header: "#agenda" -->

<lt-kicker>agenda</lt-kicker>

## 本日 *話すこと*

1. フォーカスとは何か `0.5 min`
2. よくある壊れパターン `1.5 min`
3. 実装テクニック3選 `2 min`
4. まとめ と これから `1 min`


---

<!-- _class: section-divider -->
<!-- header: "#section" -->

—— section / 01
*what is focus?*

# *フォーカス*とは

<div style="position:absolute;top:200px;right:180px">
  <lt-sticker rotate="8" color="peach">基礎</lt-sticker>
</div>


---

<!-- _class: body-text -->
<!-- header: "#key-message" -->

<lt-kicker>key message</lt-kicker>

## フォーカスは「今どこにいるか」を *ユーザーに伝える唯一の手段。*

> キーボードユーザーやスクリーンリーダー利用者にとって、フォーカスの迷子は操作不能と同義


---

<!-- _class: bullets -->
<!-- header: "#basics" -->

<lt-kicker>basics</lt-kicker>

## フォーカスが *重要な理由*

- **キーボード操作の起点になる**
  Tab/Shift+Tab で UI を移動するすべてのユーザーに影響する
- **スクリーンリーダーの読み上げ対象を決定する**
  フォーカスが当たった要素のラベルが音声として伝わる
- **視覚的なフィードバックを提供する**
  `:focus-visible` で「今ここ」を示す唯一のインジケーター


---

<!-- _class: section-divider -->
<!-- header: "#section" -->

—— section / 02
*broken patterns*

# よくある*壊れ方*


---

<!-- _class: bullets -->
<!-- header: "#anti-patterns" -->

<lt-kicker>anti-patterns</lt-kicker>

## フォーカスが *壊れる3つのパターン*

- **モーダルを開いてもフォーカスが移動しない**
  背景側を Tab で移動できてしまい、モーダルの意味がなくなる
- **動的コンテンツ追加後にフォーカスが消える**
  SPA のルーティングやリスト更新で focus が body に戻る
- **削除操作後のフォーカスが宙に浮く**
  リストアイテム削除後、次にどこにフォーカスすべきか未定義


---

<!-- _class: code-slide -->
<!-- header: "#code #trap" -->

<lt-kicker>bad example</lt-kicker>

## モーダルの *フォーカス迷子*

`Modal.tsx`

```tsx
// フォーカス管理なし — 背景が操作可能なまま
function Modal({ isOpen, children }) {
  if (!isOpen) return null;
  return (
    <div className="overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}
```

> フォーカスがモーダル内に閉じ込められず、裏側を Tab で移動できてしまう


---

<!-- _class: section-divider -->
<!-- header: "#section" -->

—— section / 03
*solutions*

# 実装*テクニック*

<div style="position:absolute;top:200px;right:180px">
  <lt-sticker rotate="8" color="mustard">実践</lt-sticker>
</div>


---

<!-- _class: code-slide -->
<!-- header: "#code #focus-trap" -->

<lt-kicker>technique 01</lt-kicker>

## フォーカス *トラップ*

`useModal.ts`

```tsx
const dialogRef = useRef<HTMLDialogElement>(null);

// <dialog> 要素なら showModal() でフォーカストラップが自動
const openModal = () => dialogRef.current?.showModal();
const closeModal = () => dialogRef.current?.close();

// 閉じたとき、トリガー要素にフォーカスを戻す
const onClose = () => triggerRef.current?.focus();
```

> `<dialog>` + `showModal()` でブラウザネイティブのフォーカストラップを得る


---

<!-- _class: code-slide -->
<!-- header: "#code #route" -->

<lt-kicker>technique 02</lt-kicker>

## ルート遷移時の *フォーカスリセット*

`useFocusOnNavigate.ts`

```tsx
function useFocusOnNavigate() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // ルート変更時に main 要素へフォーカスを移動
    mainRef.current?.focus();
  }, [location.pathname]);

  return mainRef;
}
```

> SPA 遷移後にページ先頭へフォーカスを戻し、読み上げ順を保証する


---

<!-- _class: code-slide -->
<!-- header: "#code #delete" -->

<lt-kicker>technique 03</lt-kicker>

## 削除後の *フォーカス制御*

`TodoList.tsx`

```tsx
const handleDelete = (index: number) => {
  setItems((prev) => prev.filter((_, i) => i !== index));
  // 次の要素 or 前の要素にフォーカスを移す
  requestAnimationFrame(() => {
    const next = listRef.current
      ?.children[Math.min(index, items.length - 2)];
    (next as HTMLElement)?.focus();
  });
};
```

> 削除後のフォーカス先を明示的に決めることで、ユーザーの迷子を防ぐ


---

<!-- _class: compare -->
<!-- header: "#result" -->

<lt-kicker>result</lt-kicker>

## フォーカス管理の *Before / After*

<lt-compare>
<lt-panel type="before">

### 未管理

- モーダルの裏が操作可能
- ルート遷移でフォーカスが消える
- 削除後にどこにいるか不明
- キーボードユーザーが離脱

</lt-panel>
<lt-panel type="after">

### 管理済み

- dialog でトラップ自動化
- 遷移時に main へリセット
- 削除後は隣接要素にフォーカス
- Tab 操作だけで完結

</lt-panel>
</lt-compare>


---

<!-- _class: quote -->
<!-- header: "#quote" -->

<lt-kicker>reference</lt-kicker>

> The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect.

**Tim Berners-Lee** · W3C


---

<!-- _class: bullets -->
<!-- header: "#tips" -->

<lt-kicker>practical tips</lt-kicker>

## 明日から *できること*

- **`:focus-visible` を消さない**
  `outline: none` の全体適用をやめ、ブラウザデフォルトを活かす
- **`<dialog>` を積極的に使う**
  自前フォーカストラップよりブラウザネイティブが安全かつ簡潔
- **Tab キーでの手動テストを習慣にする**
  マウスを使わずに一通り操作してみるだけで多くの問題が見つかる


---

<!-- _class: closing -->
<!-- header: "#outro" -->

— fin

# Thank *you.*

フォーカスを制するものが a11y を制す

<lt-deco>
  <lt-sticker rotate="-2">@ezakichi3207</lt-sticker>
  <lt-badge>questions / comments</lt-badge>
  <lt-sticker rotate="4" color="peach">thx!</lt-sticker>
</lt-deco>


<lt-prompt>logout</lt-prompt>
