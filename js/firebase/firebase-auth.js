import { auth } from './firebase-init.js';

import {
    createUserWithEmailAndPassword, //회원가입
    signInWithEmailAndPassword, //로그인
    updateProfile, //프로필 표시 이름
    sendEmailVerification, //이메일 인증 보내기
    sendPasswordResetEmail, //비밀번호 재설정 이메일 보내기
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup, //팝업을 이용한 쇼셜 로그인
    signOut, //로그아웃 처리
    deleteUser, //현재 로그인된 사용자 계정 삭제
    reauthenticateWithCredential, // 이메일/비번으로 재인증 처리
    reauthenticateWithPopup, // 소셜로그인 계정 재인증 처리
    EmailAuthProvider, // 이메일/비번 인증용 Provider 생성
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

//회원가입 함수
export const signup = async(email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(
        //계정생성 - 이메일, 비번, 사용자이름 정보는 userCredential에 저장
        auth,
        email,
        password
    );

    //방금 가입한 사용자의 이름(nickname)을 Firebase 사용자 정보에 저장
    await updateProfile(userCredential.user, {
        //방금 회원가입해서 생성된 사용자 객체
        displayName: displayName //사용자 이름으로저장할 값
    })

    //사용자의 이메일 주소로 인증
    await sendEmailVerification(userCredential.user);

    return userCredential.user
}

//구글로그인
export const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("google 로그인 성공: ", user);
    return user;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("로그인 창이 닫혔습니다. 다시 시도해주세요.");
    } else if (error.code === "auth/network-request-failed") {
      throw new Error(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    } else {
      console.error("google 로그인 실패: ", error);
      throw new Error("구글 로그인에 실패했습니다. 다시 시도해주세요");
    }
  }
};


//github 로그인
export const githubLogin = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Github 로그인 성공: ", user);
    return user;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("로그인 창이 닫혔습니다. 다시 시도해주세요.");
    } else if (error.code === "auth/network-request-failed") {
      throw new Error(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    } else {
      console.error("Github 로그인 실패: ", error);
      throw new Error("깃허브 로그인에 실패했습니다. 다시 시도해주세요");
    }
  }
};

// login이라는 로그인 함수를 만듭니다.
export const login = async (email, password) => {
  //이메일과 비밀번호로 로그인 시도하고, 로그인 성공 시 정보를 userCredential에 저장합니다.
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    //만약 사용자가 이메일 인증을 안 했다면, 에러를 발생시켜 로그인 실패 처리합니다.
    if (!userCredential.user.emailVerified) {
      throw new Error("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
    }

    //로그인에 성공하면 콘솔에 사용자 정보를 출력합니다 (개발 확인용).
    console.log("로그인 성공: ", userCredential.user);

    //로그인된 사용자 객체를 결과로 반환합니다.
    return userCredential.user;
  } catch (error) {
    //이메일이나 비밀번호가 틀렸을 때 보여줄 사용자 메시지를 설정합니다.
    if (error.code === "auth/invalid-credential") {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error(
        "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요."
      )
    } else if (error.code === "auth/wrong-password") {
      throw new Error("비밀번호가 틀렸습니다."
      )     
    } else if (error.code === "auth/user-not-found") {
      throw new Error("등록되지 않은 이메일입니다."
      )
    }
    else {
      throw error;
    }
  }
};

//로그아웃
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('로그아웃 성공');
    alert("성공적으로 로그아웃이 되었습니다.")
    window.location.href = 'login.html'
  } catch (error) {
    console.log('로그아웃 실패 : ', error)
  }
}

/* 비밀번호 재설정 */
/* 
  firebase 서버에 요청을 보내고 응답을 기다려야 하므로 await를 선언
  이메일 전송이 끝날 때까지 기다려서 에러여부를 판단
*/
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email); //해당 이메일 주소로 비밀번호 재설정 링크를 보냄.
}

//회원탈퇴 -> firebaseauth.js에 붙여넣기
// 계정 삭제 함수 정의
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser; // 현재 로그인 중인 사용자 정보 가져오기

    if (!user) {
      // 로그인 상태가 아닐 경우
      alert("로그인이 필요합니다"); // 알림 띄우고
      return; // 함수 종료
    }

    if (
      user.providerData.some((provider) => provider.providerId == "google.com")
    ) {
      // 구글 계정으로 로그인한 경우
      const provider = new GoogleAuthProvider(); // 구글 Provider 생성
      await reauthenticateWithPopup(user, provider); // 팝업으로 사용자 재인증
      alert("Google 사용자 재인증 성공");
    } else if (
      user.providerData.some((provider) => provider.providerId == "github.com")
    ) {
      // 깃허브 계정으로 로그인한 경우
      const provider = new GithubAuthProvider(); // 깃허브 Provider 생성
      await reauthenticateWithPopup(user, provider); // 팝업으로 사용자 재인증
      alert("Github 사용자 재인증 성공");
    } else {
      // 이메일/비밀번호 로그인 사용자의 경우
      const email = user.email; // 현재 로그인된 사용자의 이메일 추출
      const password = prompt("비밀번호를 입력하세요: "); // 사용자에게 비밀번호 입력 받기

      if (!password) {
        // 비밀번호를 입력하지 않았다면
        alert("비밀번호를 입력해야합니다."); // 경고창 띄우고
        return; // 함수 종료
      }

      const credential = EmailAuthProvider.credential(email, password); // 이메일과 비밀번호로 인증 정보 생성
      await reauthenticateWithCredential(user, credential); // 해당 정보로 재인증
      alert("이메일 사용자 재인증 성공");
    }

    await deleteUser(user); // 인증된 사용자 계정 삭제 실행
    alert("계정이 성공적으로 삭제되었습니다."); // 성공 메시지 출력
    window.location.href = "signup.html"; // 회원가입 페이지로 이동
  } catch (error) {
    // 인증 정보가 너무 오래됐을 경우 등, 오류 처리
    if (error.code === "auth/requires-recent-login") {
      alert("최근 인증정보가 필요합니다."); // 재로그인 요청 메시지
    } else {
      console.error("계정삭제실패: ", error.message); // 콘솔에 상세 오류 출력
      alert("계정을 삭제할 수 없습니다. 다시 시도해주세요"); // 사용자 알림
    }
  }
};