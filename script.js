const username = sessionStorage.getItem('userName');

async function subscribeNotification(reg) {
  publicKey = "BJTWR9XBBeqSrW-q8Tw_5zi3M9pP9MxjoVoeddcCysSfpbuxwoY9VL1qS2PucnQVnw4eRrdtVUGjhZylj331YPA";
  if (!reg) return;

  let result = null;
  try {
    result = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });
  } catch (e) {}
  return result;
}

async function postSubscription(endpoint, p256dh, auth) {
  const result = await fetch(
    "https://exa68x8b6c.execute-api.ap-northeast-1.amazonaws.com/PushNotification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: username,
        endpoint: endpoint,
        p256dh: p256dh,
        auth: auth,
      }),
    }
  );
}

async function postMessage() {
  const receiverID = document.getElementById("receiverID").value;
  const messageText = document.getElementById("messageText").value;

  const result = await fetch(
    "https://ar0tsxk0mj.execute-api.ap-northeast-1.amazonaws.com/PWA-Message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: username + "-" + receiverID,
        timestamp: new Date().toISOString(),
        messageID: generateSHA256Hash(username + "-" + receiverID + "-" + timestamp + "-" + senderID),
        messageText: messageText,
        receiverID: receiverID,
        senderID: senderID,
      }),
    }
  );
}

async function generateSHA256Hash(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 使用例
generateSHA256Hash("example-string").then(hash => {
  console.log(hash);  // 一意なID (64文字の16進数)
});

// ArrayBufferをStringに変換する関数
function ArrayBufferToString(arrayBuffer) {
  return btoa(
    String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

window.onload = async () => {
  navigator.serviceWorker.register("./service-worker.js");

  navigator.serviceWorker.ready.then((reg) => {
    document
      .getElementById("subscribe-button")
      .addEventListener("click", async () => {
        const subscription = await subscribeNotification(reg);
        if (!subscription) return;

        const endpoint = subscription.endpoint;
        const p256dh = ArrayBufferToString(subscription.getKey("p256dh"));
        const auth = ArrayBufferToString(subscription.getKey("auth"));

        await postSubscription(endpoint, p256dh, auth);
      });

    document
      .getElementById("send-message-button")
      .addEventListener("click", async () => {
        await postMessage();
      });
  });

  if (username) {
      document.getElementById('userName').textContent = username;
  } else {
      document.getElementById('userName').textContent = 'ゲスト';
  }
};

// メッセージコンテナを取得
const messageContainer = document.getElementById('messageContainer');

// メッセージを動的に追加する関数
function addMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = text;
    messageContainer.appendChild(messageElement);

    // 常に最新メッセージを表示するためにスクロールを下に移動
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function resetMessages() {
    messageContainer.innerHTML = '';  // メッセージをすべて削除
}

async function fetchData() {
    try {
        const response = await fetch(`https://ec2-18-179-43-56.ap-northeast-1.compute.amazonaws.com:5000/getdata`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Received data:', data);
            addMessage("data");
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

setInterval(fetchData, 10000);
// ボタンのクリックでデータ取得を呼び出す例
//document.getElementById('fetchButton').addEventListener('click', fetchData);

// サンプルメッセージを追加

//addMessage("お元気ですか？");
//addMessage("このメッセージはスクロール可能です。");
//addMessage("このメッセージはスクロール可能です。");
//addMessage("このメッセージはスクロール可能です。");