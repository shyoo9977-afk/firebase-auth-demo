import { auth } from "./firebase/firebase-init.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userUid = document.getElementById("user-uid");
const userCreated = document.getElementById("user-created");
const userLastLogin = document.getElementById("user-last-login");
const userVerified = document.getElementById("user-verified");

onAuthStateChanged(auth, (user) => {
    console.log(user)
    if (user) {
        userName.textContent = user.displayName || "이름없음";
        userEmail.textContent= user.email;
        userUid.textContent= user.uid;

        const createdDate = new Date(user.metadata.creationTime);
        userCreated.textContent = createdDate.toLocaleDateString("ko-KR", {
            year: 'numeric',
            month: "long",
            day: "numeric"
        }); 

        const lastLoginDate = new Date(user.metadata.creationTime);
        userLastLogin.textContent = lastLoginDate.toLocaleDateString("ko-KR", {
            year: 'numeric',
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })

        userVerified.textContent = user.emailVerified ? "인증됨" : "인증필요";
        userVerified.className = user.emailVerified ? "ml-2 text-green-600" : "ml-2 text-red-600"
    } else {
        alert("로그인이 필요합니다");
        window.location.href="login.html"
    }
})
