import { auth } from './firebase/firebase-init.js';
import { logout, deleteAccount } from './firebase/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js'


onAuthStateChanged(auth, (user) => {
    if (user) {
        alert(user);        
    } else {
        alert("로그인이 필요합니다");
        window.location.href = "login.html"
    }
})

document.getElementById('logout-button').addEventListener('click', async() => {
    try {
        const confirmed = confirm("정말로 로그아웃하시겠습니까?");

        if (confirmed) {
            await logout();
            window.location.href = "login.html"
        }

    } catch(error) {
        console.log("로그아웃 실패 : ", error.message);
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.")

    }
})

document.getElementById("delete-account-button").addEventListener('click', async() => {
    try {
        const confirf = confirm("정말로 계정을 삭제하시겠습니까?") ;
        if (!confirm) return;
        await deleteAccount();
    } catch(error) {
        console.log("계정삭제실패 : ", error.message);
        alert(error.essage)
    }
})


