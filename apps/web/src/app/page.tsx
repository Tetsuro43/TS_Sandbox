"use client";
/* 
- コンポーネントのインポート方法
間違いではありませんが、「Path Alias（パスエイリアス）」を使うのがモダンな標準です。
*/
import { Button } from '@ascent/ui'; // パスエイリアス
 
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Architect Sandbox</h1>
      {/* 
        以下の書き方は間違いではないが、Reactらしくない。
        <Button
          children={'Button'}
        />

        アーキテクトの指摘: children は特別な Props であり、タグの**「間」**に書くのが標準的な流儀（Idiom）です。
        HTMLの <div>中身</div> と同じ感覚で書けるように設計されているからです。
        <Button>
          Button
        </Button>
      */}
      {/* フレックスボックスで横並び、gap-4で隙間を空ける */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* 1. Primary / Medium */}
        <Button variant="primary" size="md" onClick={() => console.log('Primary Clicked')}>
          登録する
        </Button>

        {/* 2. Secondary / Small */}
        <Button variant="secondary" size="sm" onClick={() => console.log('Secondary Clicked')}>
          キャンセル
        </Button>

        {/* 3. Danger / Large */}
        <Button variant="danger" size="lg" onClick={() => console.log('Danger Clicked')}>
          削除する
        </Button>

        {/* 4. Disabled */}
        <Button disabled>
          無効なボタン
        </Button>
      </div>


    </main>
  );
}