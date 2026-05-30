// ==========================================
// TEB防災
// app.js
// ==========================================

console.log(
    "TEB防災 起動"
);

// ==========================================
// 時計
// ==========================================

function updateClock(){

    const now =
        new Date();

    const y =
        now.getFullYear();

    const mo =
        String(
            now.getMonth()+1
        ).padStart(2,"0");

    const d =
        String(
            now.getDate()
        ).padStart(2,"0");

    const h =
        String(
            now.getHours()
        ).padStart(2,"0");

    const mi =
        String(
            now.getMinutes()
        ).padStart(2,"0");

    const s =
        String(
            now.getSeconds()
        ).padStart(2,"0");

    const clock =
        document.getElementById(
            "clock"
        );

    if(!clock)
        return;

    clock.textContent =
        `${y}/${mo}/${d} ${h}:${mi}:${s}`;

}

updateClock();

setInterval(
    updateClock,
    1000
);

// ==========================================
// ダークモード
// ==========================================

const themeBtn =
document.getElementById(
    "themeBtn"
);

function loadTheme(){

    const saved =
        localStorage.getItem(
            "theme"
        );

    if(saved === "light"){

        document.body.classList.add(
            "light"
        );

        if(themeBtn)
            themeBtn.textContent =
            "☀️";

    }

}

function toggleTheme(){

    document.body.classList.toggle(
        "light"
    );

    const light =
        document.body.classList.contains(
            "light"
        );

    localStorage.setItem(
        "theme",
        light
        ? "light"
        : "dark"
    );

    if(themeBtn){

        themeBtn.textContent =
        light
        ? "☀️"
        : "🌙";

    }

}

themeBtn?.addEventListener(
    "click",
    toggleTheme
);

loadTheme();

// ==========================================
// ナビ現在地
// ==========================================

function activateNav(){

    const current =
        location.pathname
        .split("/")
        .pop();

    document
    .querySelectorAll(
        ".sidebar nav a"
    )
    .forEach(link=>{

        const href =
            link.getAttribute(
                "href"
            );

        if(
            href === current
        ){

            link.classList.add(
                "active"
            );

        }

    });

}

activateNav();

// ==========================================
// 通知
// ==========================================

async function initNotification(){

    if(
        !(
            "Notification"
            in window
        )
    )
        return;

    if(
        Notification.permission
        === "default"
    ){

        try{

            await Notification
            .requestPermission();

        }
        catch(err){

            console.error(err);

        }

    }

}

initNotification();

// ==========================================
// 通知表示
// ==========================================

function showNotification(
    title,
    body
){

    if(
        !(
            "Notification"
            in window
        )
    )
        return;

    if(
        Notification.permission
        !== "granted"
    )
        return;

    new Notification(
        title,
        {
            body,
            icon:
            "assets/logo.png"
        }
    );

}

// ==========================================
// Service Worker
// ==========================================

if(
    "serviceWorker"
    in navigator
){

    window.addEventListener(
        "load",
        ()=>{

            navigator
            .serviceWorker
            .register(
                "./service-worker.js"
            )
            .then(()=>{

                console.log(
                    "Service Worker 登録成功"
                );

            })
            .catch(err=>{

                console.error(
                    err
                );

            });

        }
    );

}

// ==========================================
// 共通UI
// ==========================================

function setLoading(
    id,
    text="読み込み中..."
){

    const el =
        document.getElementById(
            id
        );

    if(!el)
        return;

    el.innerHTML =
    `
    <div class="loading">
        ${text}
    </div>
    `;

}

function setError(
    id,
    text="取得失敗"
){

    const el =
        document.getElementById(
            id
        );

    if(!el)
        return;

    el.innerHTML =
    `
    <div class="error">
        ${text}
    </div>
    `;

}

// ==========================================
// 共通更新時刻
// ==========================================

let lastUpdate = null;

function setLastUpdate(){

    lastUpdate =
        new Date();

    console.log(
        "更新:",
        lastUpdate
        .toLocaleString(
            "ja-JP"
        )
    );

}
