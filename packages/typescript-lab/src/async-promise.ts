/* 
Promise: 「約束手形」です。
- pending: 約束中（処理中）
- fulfilled (resolved): 約束が守られた（成功）
- rejected: 約束が破られた（失敗）

new Promise(executor)
-> executor: (resolve, reject) => {}
*/
type User = {
  id: number,
  name: string
}


function getUserPromise(user: User): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // rejectの使用例
      if (user.id <= 0) {
        // IDが0以下なら失敗とみなす
        reject(new Error(`無効なIDです: ${user.id}`));
        return; // ★重要: resolveに行かないようにここで関数を終わらせる
      }

      console.log("1. ユーザー取得完了");
      resolve(user);
    }, 1000);
  });
}

function checkPermissionsPromise(user: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user.name !== "Taro") {
        reject(new Error(`権限がありません: ${user.name}`));
        return;
      }

      console.log("2. 権限チェック完了");
      resolve(true);
    }, 1000);
  });
}

const employee = {id: 10, name: "Jiro"};

// 実行: 縦にスッキリ並ぶ (Chain)
getUserPromise(employee)
  // 以下のuserは、getUserPromiseのresolve({ id: id, name: "Taro" });の引数を受け取る
  // この受け取った引数の名前は任意に付けることができる。userと名付けたが、中身は{ id: id, name: "Taro" }
  .then((employee) => {
    // 次の非同期処理を返すことでチェーンをつなぐ
    return checkPermissionsPromise(employee).then((isPermitted) => {
        return { employee, isPermitted }; // 値を受け渡すのが少し面倒
    });
  })
  .then(({ employee, isPermitted }) => {
    if (isPermitted) {
      console.log(`3. 詳細表示: ${employee.name}`);
    }
  })
  .catch((error) => {
    // どこでエラーが起きてもここでキャッチできる！
    console.error("エラー発生:", error);
  });