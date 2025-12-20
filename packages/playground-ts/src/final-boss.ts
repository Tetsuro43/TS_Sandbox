/* 
実務では、APIから「配列」でデータが返ってくることがよくあります。 しかし、フロントエンドでは「配列の中身の型」だけを取り出して使いたい場合があります。

課題: 配列から要素の型を抜き出す UnwrapArray を作れ

要件:
- Conditional Types (条件付き型): T extends ... ? ... : ... の構文を使用すること。
- infer キーワード: 配列の中身を推論させるために infer を使うこと。
- 再帰は不要: 単純な1次元配列だけ扱えればOKです。

解説要求: infer というキーワードが何をしているのか、あなたの言葉で説明してください。
*/

// TODO: Tが配列ならその中身の型を、そうでなければTそのままを返す型を定義せよ
// ヒント: T extends Array<infer U> ? ... : ...
/* 
- inferはConditional Typesの中で使われる型演算子です。inferは「推論する」という意味でextendsの右辺にのみ書くことができます。
https://typescriptbook.jp/reference/type-reuse/conditional-types/infer
- infer・・・推論する

- extendsキーワードを用いることでジェネリクスの型Tを特定の型に限定することができます。
- extendsを使うと、型での条件分岐が可能になります。(extendsについてもまとめたい)

- 基本構文
type Extracted<T> = T extends SomeType<infer U> ? U : DefaultType;

T extends SomeType<infer U>
→ もし T が SomeType<...> の形なら、infer U によりその内部の型を U として抽出します。
? U : DefaultType
→ 条件が真なら U を、偽なら DefaultType を返します。
*/
type UnwrapArray<T> = T extends Array<infer U> ? U : T;


// --- テストケース (コンパイルエラーにならなければOK) ---

// ケース1: 文字列の配列 -> 文字列 になるべき
type T1 = UnwrapArray<string[]>;
// 期待: type T1 = string

// ケース2: 数値の配列 -> 数値 になるべき
type T2 = UnwrapArray<number[]>;
// 期待: type T2 = number

// ケース3: 配列じゃないもの -> そのまま になるべき
type T3 = UnwrapArray<string>;
// 期待: type T3 = string


// --- 実際にコードで確認 ---
function printItem(item: UnwrapArray<string[]>) {
  console.log(item); // ここで item は string 型として扱えるはず
}

printItem("Hello"); // OK
// printItem(123);  // Errorになるはず


/**
 * ---------------------------------------------------------
 * 🏛️ Architect's Note: extends の二面性と infer の正体
 * ---------------------------------------------------------
 * * ■ 1. extends キーワードの「2つの顔」
 * どこに書くかで意味が180度変わるため、文脈で判断すること。
 * * 【顔A: 制約 (Constraint)】
 * - 場所: ジェネリクスの定義側 (< > の中)
 * - 構文: <T extends string>
 * - 意味: 「足切りフィルター」。Tはstringかその派生型でなければならない。
 * - 役割: 不正な型の入力を防ぐ（コンパイルエラーにする）。
 * 
 * * 【顔B: 条件 (Condition)】
 * - 場所: 型定義の右辺 (= の右側)
 * - 構文: T extends string ? A : B
 * - 意味: 「分岐スイッチ (if文)」。もしTがstringに代入可能ならA、違うならB。
 * - 役割: 型の性質によって挙動を変える（Conditional Types）。
 * * ---------------------------------------------------------
 * * ■ 2. infer キーワード (Type Inference)
 * - 意味: 「型の方程式を解くための変数宣言」。
 * - ルール: Conditional Types (顔B) の extends 節の中だけで使える。
 * 
 * * 【イメージ: パターンマッチング】
 * 「T extends Array<infer U>」という記述は、以下の方程式を解いている。
 * * 入力された型 T  ==  Array< U(未知数) >
 * 
 * * 例: T が string[] の場合
 * Array<string> == Array< U >
 * よって、U = string と推論(infer)される。
 * * -> マッチしたら、その推論された U を ? の後の trueルート で使える。
 * ---------------------------------------------------------
 */