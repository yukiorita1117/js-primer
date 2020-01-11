async function main() {
  try {
    const usetId = getUserId();
    const userInfo = await fetchUserInfo(usetId);
    const view = createView(userInfo);
    displayView(view);
  } catch (error) {
    console.error(`エラーが発生しました (${error})`);
  }
}

function fetchUserInfo(userId) {
  return fetch(
    `https://api.github.com/users/${encodeURIComponent(userId)}`
  ).then(response => {
    //okプロパティはHTTPステータスコードが200番台:true 400や500番台:false を返す
    if (!response.ok) {
      console.error("エラーレスポンスです", response);
    } else {
      // return console.log(response.json());
      //responseだけだとオブジェクト、response.json()でjson形式にしてPromiseの形で返す
      return response.json();
    }
  });
}

function getUserId() {
  const value = document.getElementById("userId").value;
  return encodeURIComponent(value);
}

function createView(userInfo) {
  return escapeHTML`
      <h4>${userInfo.name} (@${userInfo.login})</h4>
      <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
      <dl>
          <dt>Location</dt>
          <dd>${userInfo.location}</dd>
          <dt>Repositories</dt>
          <dd>${userInfo.public_repos}</dd>
      </dl>
      `;
}

function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}

//userInfoを取り出して、エスケープすべきか判断し、その後、元のように格納するタグ関数
function escapeHTML(strings, ...values) {
  //valuesにはuser情報が [yukio yukiorita1117 https://avatars3.githubusercontent.com/u/29562675?v=4 yukiorita1117 null 5] のように配列で入ってる
  //stringsにはviewで定義しているDOMが入ってる
  return strings.reduce((result, str, i) => {
    //currentindexをiで渡す。
    console.log(i);
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}

//普通はエスケープ処理はライブラリを使うけど今回は例外的に以下の関数で行う。
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
