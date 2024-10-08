// ページ読み込み時に保存されたユーザーIDを表示
window.onload = function() {
    var savedUserID = sessionStorage.getItem('userName');
    if (savedUserID) {
        document.getElementById('userName').value = savedUserID;
    }
};

// ユーザーIDを保存する
function saveUserID() {
    var userID = document.getElementById('userName').value;
    if (userID) {
        sessionStorage.setItem('userName', userID);
        window.location.href = 'home.html';
    } else {
        alert('ユーザーIDを入力してください。');
    }
}