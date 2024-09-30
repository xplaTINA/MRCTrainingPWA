        // ページ読み込み時に保存されたユーザーIDを表示
        window.onload = function() {
            var savedUserID = localStorage.getItem('userID');
            if (savedUserID) {
                document.getElementById('userID').value = savedUserID;
            }
        };

        // ユーザーIDを保存する
        function saveUserID() {
            var userID = document.getElementById('userID').value;
            if (userID) {
                localStorage.setItem('userID', userID);
                window.location.href = 'home.html';
            } else {
                alert('ユーザーIDを入力してください。');
            }
        }