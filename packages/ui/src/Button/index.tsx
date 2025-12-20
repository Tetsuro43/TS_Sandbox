"use client";
/* 
【課題】汎用的な「Buttonコンポーネント」の設計
ただの <button> タグではなく、デザインシステムの一部として機能する Button コンポーネントを作成してください。

要件:
ディレクトリ構成: apps/frontend/components/ui/Button.tsx に作成すること。 （※ app ディレクトリの外に components を作るのが一般的な設計パターンです）

Props設計 (Interface):
HTMLの標準的なボタン属性（onClick, disabled, type など）を全て受け取れるようにすること。(React.ButtonHTMLAttributes を継承する)
variant: 'primary' (青色) | 'secondary' (灰色) | 'danger' (赤色) の3パターンでの見た目を切り替えられること。デフォルトは primary。
size: 'sm' | 'md' | 'lg' の3サイズ。デフォルトは md。

スタイリング:
Tailwind CSS を使用し、variant と size に応じてクラス名を動的に切り替えること。
押した時のスタイル（:active）やホバー時のスタイル（:hover）も考慮すること。

Children:
ボタンの中身（テキストやアイコン）は children で受け取ること。

解説要求: 提出時に、「なぜ ...props (スプレッド構文) を button タグに渡しているのか？」 そのアーキテクチャ上の意図を説明してください。
*/

import React from 'react';

// TODO: ここで ButtonHTMLAttributes を継承しつつ、variant と size を追加定義する
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

// バリエーションごとのTailwindクラス定義（Lookup Tableパターン）
/* 
Lookup Table とは？
プログラミング用語で、「キー（名前）に対応する値（中身）を、辞書のように登録しておいたオブジェクト」 のことです。 「条件分岐 (if/switch)」を「辞書引き」に変えるテクニックです。

// ❌ 初心者パターン (if文や三項演算子)
// 読むのも書くのも大変、遅い
let className = "";
if (variant === 'primary') {
  className = "bg-blue-600";
} else if (variant === 'danger') {
  className = "bg-red-600";
}

// ⭕️ Lookup Table パターン (今回の実装)
// 定義とロジックが分離され、追加が簡単。一瞬で値が取れる。
const variants = {
  primary: "bg-blue-600", // キー: 値
  danger:  "bg-red-600",
};
// 使う時
const className = variants[variant];
*/
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

// サイズごとのTailwindクラス定義
const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

/* 
良い実装
- 引数部分の{}は分割代入
Reactのコンポーネントは、ルールとして 「引数は必ず『props』という1つのオブジェクト」 で受け取ります。
{}を書くことで引数を受け取った瞬間に、箱(props)を開封して中身を取り出す！
props の中にある className, variant, children... を変数として宣言する
https://zenn.dev/yamap_web/articles/c197f56924b3fa

- 型の関係: ButtonProps という型定義の中に className や children (※React.FCを使わない場合は明示が必要なこともありますが、HTMLAttributesに含まれることが多い) が定義されているから、
TypeScriptは「あ、この引数の中には className があるはずだね」と理解してくれます。

- ...props が2回出ているのはなぜ？（超重要）
実はこの ... (3点リーダー)、書いてある場所によって意味が全く違います。

1回目: 関数の引数での ...props
これは 「残余引数 (Rest Parameters)」 と呼ばれます。 「残ったものを全部この袋に入れて！」という意味です。
...props (残り全部): onClick や disabled など、上で指名されなかった全てのプロパティを「props」という名前の新しいオブジェクトにまとめる。

2回目: buttonタグの中での {...props}
これは 「スプレッド構文 (Spread Syntax)」 と呼ばれます。 「袋の中身をぶちまける！」という意味です。
<button {...props}>
意味:
さっきまとめた「残り全部」の袋（onClick, disabled等が入ってる）を、
buttonタグの属性として一つ一つ展開する。
*/
export const Button = ({
  className = "",
  variant = "primary", // propsから variant を抜き出す
  size = "md",
  children,
  ...props // 残り(onClickとか)を props という袋に入れる (Rest)
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      // 抜き出した variantなど を使う
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props} // 残りの袋の中身を全部タグにつける (Spread)
    >
      {children}
    </button>
  )
}

/* 
間違い実装 
1. スタイルのマッピングロジックがない
2. 親から渡された className を捨てている
3. React.FC は現在、Reactコミュニティでは「非推奨ではないが、推奨もされない」微妙な立ち位置
   ジェネリクスの扱いなどが面倒なため。 現代のモダンな書き方では、通常の関数宣言を使うのが主流です。
*/
// export const Button: React.FC<ButtonProps> = ({
//   className,
//   variant = 'primary',
//   size = 'md',
//   children,
//   ...props 
// }) => {
//   // TODO: variant と size に基づいて Tailwind のクラスを生成するロジック
//   // ヒント: "base-class " + "variant-class " + "size-class"
//   const baseStyles = "rounded font-medium transition-colors focus:outline-none focus:ring-2";
  
//   const variantStyles = variant;
//   const sizeStyles = size;

//   return (
//     <button 
//       className={`${baseStyles} ${variantStyles} ${sizeStyles}`} // クラスを結合
//       {...props} // 残りのprops（onClickなど）を展開して渡す
//     >
//       {children}
//     </button>
//   );
// };