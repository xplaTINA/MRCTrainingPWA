const publicKey = "BJTWR9XBBeqSrW-q8Tw_5zi3M9pP9MxjoVoeddcCysSfpbuxwoY9VL1qS2PucnQVnw4eRrdtVUGjhZylj331YPA";

// 通知の登録を行う関数
async function subscribeNotification(reg) {
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
        id: "web-test",
        endpoint: endpoint,
        p256dh: p256dh,
        auth: auth,
      }),
    }
  );
}

async function postMessage() {
  const senderID = document.getElementById("senderID").value;
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
        conversationId: "0",
        timestamp: new Date().toISOString(),
        messageID: "0",
        messageText: messageText,
        receiverID: receiverID,
        senderID: senderID,
      }),
    }
  );
}

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
};