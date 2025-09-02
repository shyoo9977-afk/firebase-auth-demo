Kakao.init('fe5a758c1951da79cdf5bdda5e71ad46');
Kakao.isInitialized();

console.log(Kakao.isInitialized())

document.getElementById("kakao-login-btn").addEventListener('click', () => {
    Kakao.Auth.authorize({
     redirectUri: 'http://127.0.0.1:5500/kakao-callback.html'
    });
})


