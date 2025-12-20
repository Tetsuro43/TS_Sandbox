type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

// TODO: User型から 'id' を除外し、かつ全てのプロパティを optional にした型を定義せよ
// ヒント: Partial<T>, Omit<T, K> を組み合わせる
/* 
- オプショナルプロパティ
オブジェクトのプロパティを 任意プロパティ として定義したい場合に使用する。
type Human = {
  name: string;    // 名前
  age: number;     // 年齢
  hobby?: string;  // 趣味(「?」を付加したことで、オプショナル(任意)なプロパティになる)
}

- Utility Types
https://typescriptbook.jp/reference/type-reuse/utility-types
ユーティリティ型(utility type)は、型から別の型を導き出してくれる型です。functionが実行時の世界の関数だとしたら、ユーティリティ型は型の世界の関数といったイメージです。
組み込みの型専用関数。下記が該当する。

- Parial<T>
https://typescriptbook.jp/reference/type-reuse/utility-types/partial

- Omit<T, K>
https://typescriptbook.jp/reference/type-reuse/utility-types/omit
Omit<T, Keys>は、オブジェクトの型TからKeysで指定したプロパティを除いたobject型を返すユーティリティ型です。
*/
type UpdateUserParams = Partial<Omit<User, "id">>; // Omit の Keysは文字列型である必要がある？そもそも文字列型？
// →いいえ、「ただの string 型」ではありません。 正確には 「User 型のキーとして存在している文字列リテラル型」 である必要があります。

function updateUser(existingUser: User, updates: UpdateUserParams): User {
  // TODO: existingUser に updates を上書きして新しい User を返す
  // ヒント: スプレッド構文 (...) を使う

  // 浅いコピー(shallow copy) オブジェクトのコピーの特性理解
  // https://gizanbeak.com/post/typescript-object-copy
  return {
    ...existingUser, 
    ...updates
  };
}

// --- テスト用 ---
const currentUser: User = { 
  id: 1, 
  name: 'Taro', 
  email: 'taro@example.com', 
  role: 'user' 
};

// nameだけ変えたい（idは変更できないし、指定する必要もない）
const updatedUser = updateUser(currentUser, { name: 'Jiro' });

console.log(`Original: ${currentUser.name}`);
console.log(`Updated: ${updatedUser.name}`);