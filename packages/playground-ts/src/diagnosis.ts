/* 
検索のためのヒント（Keywords）
迷子にならないよう、検索すべきキーワードを授けます。これらを組み合わせて調べてみてください。

TypeScript Discriminated Unions (判別可能なユニオン型)

TypeScript Type Guards (型ガード) または Narrowing (型の絞り込み)

TypeScript Generics interface (ジェネリクス)
*/

// 実行方法
// ~/Projects/Sandbox/TS_Sandbox/packages/typescript-lab で  npx tsx src/diagnosis.ts

// 1. レスポンスの型定義 (Discriminated Unionsを使用すること)
/* 
- プリミティブ型
string, number, boolean, null, undefined, symbol, bigintなど最も基本的で単純なデータ型です。
- オブジェクト型
配列、関数、クラス、オブジェクトリテラルなど

- リテラル型
特定の値のみを持つ型。例えば、"success" という文字列リテラル型は、"success" という値だけを許容します。プリミティブ型の特定の値だけを代入可能にする型を表現できます。
- ジェネリクス
型をパラメータとして受け取ることができる型。例えば、Array<T> はジェネリック型で、T は配列内の要素の型を表します。

- ユニオン型
type UploadStatus = InProgress | Success | Failure;
type InProgress = { done: boolean; progress: number };
type Success = { done: boolean };
type Failure = { done: boolean; error: Error };
- 判別可能なユニオン型の例(Descriminated Unions)
done: booleanがなくなり、typeというディスクリミネータが追加されたところです。typeの型がstringではなく、InProgressなどのリテラル型になったことも重要な変更点です。
type UploadStatus = InProgress | Success | Failure;
type InProgress = { type: "InProgress"; progress: number };
type Success = { type: "Success" };
type Failure = { type: "Failure"; error: Error };
*/
type ApiResponse<T> = {
  // TODO: ここに成功と失敗の型定義を記述
  status: 'success',
  data: T
} | {
  status: 'failure',
  error: string
}


// 2. ダミーのユーザー型 (テスト用)
type User = {
  id: number;
  name: string;
  email: string;
};

// 3. レスポンスを処理する関数
function handleResponse(response: ApiResponse<User>) {
  // TODO: 
  // response.status をチェックし、
  // 成功なら "User: [名前]" をコンソールに出力
  // 失敗なら "Error: [エラー内容]" をコンソールに出力
  // ※ここで型推論が効いていることが必須条件

  // レガシーなアンチパターン
  // if (response.status === 'success') {
  //   console.log("User: [" + response.data.name + "]")
  // } else {
  //   console.error("Error: [" + response.error + "]")
  // }

  // テンプレートリテラル
  // if (response.status === 'success') {
  //   console.log(`User: [${response.data.name}]`)
  // } else if(response.status === 'failure') {
  //   console.error(`Error: [${response.error}]`)
  // }

  // より堅牢 switch + assertNever
  // https://zenn.dev/asamin/articles/4996ed844ebaa1
  switch (response.status) {
    case 'success':
      console.log(`User: [${response.data.name}]`);
      break;
    case 'failure':
      console.error(`Error: [${response.error}]`);
      break;
    default:
      // ここが「網羅性チェック」の真髄。
      // もし 'pending' が増えたのに case を書き忘れていたら、
      // ここでTypeScriptが「お前、pendingの処理忘れてるぞ！」とコンパイルエラーを出してくれる。
      const _exhaustiveCheck: never = response;
      throw new Error(`Unhandled case: ${_exhaustiveCheck}`);
}
}

// --- 実行テスト用 (変更不要) ---
const successResponse: ApiResponse<User> = {
  status: 'success',
  data: { id: 1, name: 'Taro', email: 'taro@example.com' }
};

const errorResponse: ApiResponse<User> = {
  status: 'failure',
  error: 'Network Error'
};

handleResponse(successResponse);
handleResponse(errorResponse);