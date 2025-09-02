const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "7dddee5fddacc2e08e647b7154e5e29c",
      /* redirect_uri: "https://shyoo9977-afk.github.io/firebase-auth-demo/kakao-callback.html", */
      redirect_uri: "https://127.0.0.1:5500/kakao-callback.html",
      code: code,
    }),
  })
    .then((res) => res.json())
    .then((tokenData) => {
      return fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
    })
    .then((res) => res.json())
    .then((userData) => {
      const nickname = userData.kakao_account.profile.nickname;
      const email = userData.kakao_account.email;

      // 사용자 정보를 localStorage에 저장
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("email", email);
      localStorage.setItem("isLoggedIn", "true");

      // index로 이동
      window.location.href = "../index.html";  // index.html
    })
    .catch((err) => {
      console.error("카카오 로그인 실패", err);
      alert("로그인 실패");
    });
}
