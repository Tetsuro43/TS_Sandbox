/* 
検索のためのヒント（Keywords）
迷子にならないよう、検索すべきキーワードを授けます。これらを組み合わせて調べてみてください。

TypeScript Discriminated Unions (判別可能なユニオン型)

TypeScript Type Guards (型ガード) または Narrowing (型の絞り込み)

TypeScript Generics interface (ジェネリクス)
*/


// 1. レスポンスの型定義 (Discriminated Unionsを使用すること)
type ApiResponse<T> = 
  // TODO: ここに成功と失敗の型定義を記述


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