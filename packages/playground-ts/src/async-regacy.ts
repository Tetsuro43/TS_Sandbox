// 【再現】コールバック地獄 (Pyramid of Doom)
// callback関数というのは、「処理が終わった後に、実行してほしい『次の命令書』」

function getUser(id: number, callback: (user: any) => void) {
  setTimeout(() => {
    console.log("1. ユーザー取得完了");
    callback({ id: id, name: "Taro" });
  }, 1000);
}

// 間違って以下のように同期コールバックで定義したら、非同期の本来の意味でのコールバックの意味を成さない
// コールバックはただの関数渡しであり、いつ実行するかは getUser 次第
// Promise や Async/Awaitは、構造的に「非同期であること」を強制してくれる

// function getUser(id: number, callback: (user: any) => void) {
//   callback({ id: id, name: "Taro" }); // ←定義箇所が誤り
//   setTimeout(() => {
//     console.log("1. ユーザー取得完了");
//   }, 1000);
// }

function checkPermissions(user: any, callback: (permitted: boolean) => void) {
  setTimeout(() => {
    console.log("2. 権限チェック完了");
    callback(true);
  }, 1000);
}

function showDetails(user: any) {
  setTimeout(() => {
    console.log(`3. 詳細表示: ${user.name}`);
  }, 1000);
}

// 実行: ネストが深くなり、右へ右へとコードが伸びていく
// getUser()の引数の(user) => {} がcallback関数 1秒後に"1. ユーザー取得完了"を出力し、checkPermittions()を実行
// 以下同様
getUser(1, (user) => {
  checkPermissions(user, (isPermitted) => {
    if (isPermitted) {
      showDetails(user);
      // もしここでエラーハンドリングが必要なら？
      // もしさらに処理が増えたら？
      // 可読性は最悪、デバッグは地獄。
    }
  });
});