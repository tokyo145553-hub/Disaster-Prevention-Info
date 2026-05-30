// ==========================================
// TEB防災 共通処理
// app.js
// ==========================================

// ダークモード
const themeBtn = document.getElementById("themeBtn");

themeBtn?.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem("darkMode", dark);

    themeBtn.textContent = dark ? "☀️" : "🌙";

});

// 起動時
window.addEventListener("load", () => {

    const darkMode =
        localStorage.getItem("darkMode") === "true";

    if (darkMode) {

        document.body.classList.add("dark");

        if (themeBtn)
            themeBtn.textContent = "☀️";

    }

});

// ==========================================
// 時計
// ==========================================

function updateClock() {

    const now = new Date();

    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");

    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const sec = String(now.getSeconds()).padStart(2, "0");

    const text =
        `${y}/${m}/${d} ${h}:${min}:${sec}`;

    const clock = document.getElementById("clock");

    if (clock)
        clock.textContent = text;

}

updateClock();

setInterval(updateClock, 1000);

// ==========================================
// 共通更新時刻
// ==========================================

let lastUpdate = null;

function setLastUpdate() {

    lastUpdate = new Date();

    console.log(
        "[更新]",
        lastUpdate.toLocaleString("ja-JP")
    );

}

// ==========================================
// 共通通知
// ==========================================

function showNotification(title, body) {

    if (!("Notification" in window))
        return;

    if (Notification.permission === "granted") {

        new Notification(title, {
            body: body,
            icon: "assets/logo.png"
        });

    }

}

async function requestNotificationPermission() {

    if (!("Notification" in window))
        return;

    if (Notification.permission === "default") {

        await Notification.requestPermission();

    }

}

requestNotificationPermission();

// ==========================================
// Service Worker登録
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {

                console.log(
                    "Service Worker 登録成功"
                );

            })
            .catch(err => {

                console.error(
                    "Service Worker 登録失敗",
                    err
                );

            });

    });

}

// ==========================================
// ローディング表示
// ==========================================

function setLoading(id, text = "読み込み中...") {

    const el = document.getElementById(id);

    if (!el) return;

    el.innerHTML =
        `<div class="loading">${text}</div>`;

}

// ==========================================
// エラー表示
// ==========================================

function setError(id, text = "取得失敗") {

    const el = document.getElementById(id);

    if (!el) return;

    el.innerHTML =
        `<div class="error">${text}</div>`;

}

// ==========================================
// 起動ログ
// ==========================================

console.log(
    "TEB防災 総合情報システム 起動"
);
