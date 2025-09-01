import {login,googleLogin, githubLogin} from './firebase/firebase-auth.js';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("login-button");

//1. 에러 메세지를 보여주는 함수 
//텍스트를 보여주고 .hidden 클래스 숨기 -> 에러영역 표시 
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden')
}

//에러메시지 숨기기
const hideError = () => {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden')
}

document
  .getElementById("google-login-btn")
  .addEventListener("click", async () => {
    try {
      const user = await googleLogin();
      alert(`환영합니다, ${user.displayName}님!`);
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });

document
  .getElementById("github-login-btn")
  .addEventListener("click", async () => {
    try {
      const user = await githubLogin();
      alert(`환영합니다, ${user.displayName}님!`);
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });


//로그인 버튼이 클릭되면 아래 코드를 실행합니다 (비동기 처리 가능하게 async 사용).
submitButton.addEventListener("click", async () => {

    //클릭 시 기존 에러 메시지 숨기기부터 시작합니다.
    hideError();

    //사용자가 입력한 이메일과 비밀번호를 변수에 저장합니다. trim()은 공백을 제거합니다.
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    //이메일 또는 비밀번호 중 하나라도 비어 있으면 에러 메시지를 띄우고 함수 종료합니다.
    if(!email || !password) {
        showError("이메일과 비밀번호를 모두 입력해주세요.");
        return;
    }

    //입력값이 있으면 login() 함수를 실행해서 Firebase 로그인 시도 → 결과를 user에 저장합니다.
    try {
        const user = await login(email, password);

        //로그인 성공 시, 사용자 정보를 브라우저 콘솔에 출력합니다
        console.log("로그인된 사용자: ", user);
        alert(`로그인 성공! 환영합니다. ${user.displayName}님!`);

        //로그인 성공 후, 대시보드(또는 홈) 페이지로 자동 이동시킵니다.
        window.location.href = "dashboard.html";
    } catch(error) {
        console.error("로그인 실패: ", error.message);
        if(error.message.includes("이메일 인증")) {
            showError("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
        } else {
            showError(error.message);
        }
    }
})
