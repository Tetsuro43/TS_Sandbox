/* 
【課題】 型安全な非同期フェッチ関数の作成
シナリオ: あなたは、APIからデータを取得する汎用的な関数 fetchData を作るよう指示されました。
この関数は、ユーザー情報だろうが商品情報だろうが、**「どんなデータ型でも」**扱える必要があります。
また、通信には成功もあれば失敗もあります。

要件:
Generics (T): 戻り値の型を呼び出し元で指定できるように、ジェネリクス <T> を使ってください。
Promiseの型: 非同期関数（async function）の戻り値は、必ず Promise<T> の形になります。これを明示してください。

擬似的な遅延とランダムエラー:
setTimeout を使って、擬似的に 1秒 待機してください。
Math.random() を使い、50%の確率でエラー（throw new Error("Failed")）を発生させ、50%の確率で成功データを返してください。

使用側 (Usage):
fetchData を使って User 型を取得しようとするコードを書いてください。
try-catch ブロックを使い、エラーハンドリングを行ってください。
*/

type User = {
  id: number;
  name: string;
};

// 1. Genericな非同期関数
// ヒント: async function fetchData<T>(...): Promise<T> { ... }
// async をつけておくと、「new Promise にたどり着く前にエラーが起きた場合も自動で reject にしてくれる」という安全装置の効果はある
async function fetchData<T>(data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // TODO: 
      // Math.random() > 0.5 なら resolve(data)
      // それ以外なら reject(new Error("Network Error"))
      if (Math.random() > 0.5) {
        resolve(data);
        return;
      }
      // Promiseの仕様上、一度 resolve された後に reject を呼んでも無視されるだけなので、
      // 致命的なバグにはなりませんが、「無駄な処理が走る」
      reject(new Error("Network Error"));
      return;
    }, 1000);
  });
}

// 2. 実行用関数 (即時実行関数などを使うと良い)
// 即時実行関数（IIFE (Immediately Invoked Function Expression)）: 定義した瞬間に実行される関数
/* 
即時実行関数の構造解剖図
この記号の羅列、分解すると単純です。
- (() => { ... }): 関数をカッコで囲む。これで「これは関数という『値』ですよ」と宣言します。（無名関数）
- (): 最後のカッコ。これは「実行せよ！」という命令スイッチです。
つまり、「名無しの関数を作って、即座にスイッチを押した」 状態です。

「await は async 関数の中でしか使えない」 という鉄の掟がある（※Top-level awaitを除く）
ただし、実は、現代の最新環境（ES Modules）では、このIIFEは不要です。 「Top-level await」という機能が標準化されたため、ファイルの直下にいきなり await を書いても動きます。
*/
(async () => {
  const mockUser: User = { id: 1, name: "Hanako" };

  console.log("Fetching data...");

  // TODO: try-catch で fetchData を呼び出す
  // 成功時: "Success: [名前]" を表示
  // 失敗時: "Failure: [エラーメッセージ]" を表示
  try {
    const result = await fetchData(mockUser);
    console.log(`Success: [${result.name}]`);
  } catch(e) {
    console.error(`Failure: [${e}]`)
  }
})();

/**
 * ---------------------------------------------------------
 * 🏛️ Architect's Note: 非同期処理と型の虎の巻
 * ---------------------------------------------------------
 * * ■ 1. コールバック関数で return すべきか？の判断基準
 * 結論: 「親玉（呼び出し元関数）」の型定義を見て決める。
 * * 【ケースA: return が必須 (Must)】
 * - 型定義: (arg: T) => U
 * - 代表例: Array.map, filter, reduce
 * - 理由:   親玉があなたの計算結果を受け取って活用するため。
 * 
 * * 【ケースB: return が無意味 (Void)】
 * - 型定義: (arg: T) => void
 * - 代表例: setTimeout, fs.readFile, addEventListener
 * - 理由:   親玉は「終わったことの通知」しか求めていない。
 * ここで return しても虚空に消える（無視される）。
 * - 対策:   値を外に渡したいなら、return ではなく Promise (resolve) を使うこと。
 * 
 * * ---------------------------------------------------------
 * * ■ 2. ジェネリクスでよく使うアルファベットの慣習
 * 意味を知れば、初見のコードでも意図が読めるようになる。
 * * - T (Type):    最初の型引数（とりあえずこれ）。
 * - U, V:        Tの次、その次。(例: map<U>(...): U[])
 * - K (Key):     オブジェクトのキー (例: keyof T)。
 * - V (Value):   オブジェクトの値。
 * - E (Element): 配列の要素。
 * - R (Return):  関数の戻り値。
 * 
 * * ---------------------------------------------------------
 * * ■ 3. async と new Promise の使い分け判断基準
 * 目的: 「過剰包装」を防ぎ、適切な道具を選ぶ。
 * * 【new Promise を使うべき時】
 * - 条件: 中で「Promise非対応の機能 (setTimeout, コールバックAPI)」を使う時。
 * - 役割: 古い機能をモダンなPromise環境に持ち込むための「変換アダプター」。
 * - 注意: この関数自体に async をつける必要はない（return new Promise で十分）。
 * 
 * * 【async を使うべき時】
 * - 条件: 中で `await` を使いたい時。または、ただの値をPromiseとして返したい時。
 * - 役割: Promiseチェーンをスッキリ書くための「魔法の包装紙 (Syntax Sugar)」。
 * * ---------------------------------------------------------
 */

