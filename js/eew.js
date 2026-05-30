// ==========================================
// TEB防災
// eew.js
// ==========================================

let eewData = null;
let eewSocket = null;

// ==========================================
// 初期化
// ==========================================

window.addEventListener(
    "load",
    () => {

        connectEEW();

    }
);

// ==========================================
// WebSocket接続
// ==========================================

function connectEEW() {

    try {

        // 実際のURLは配信元仕様に合わせる
        eewSocket = new WebSocket(
            "wss://example-eew-server"
        );

        eewSocket.onopen = () => {

            console.log(
                "EEW接続成功"
            );

        };

        eewSocket.onmessage = event => {

            try {

                const data =
                    JSON.parse(
                        event.data
                    );

                handleEEW(
                    data
                );

            }

            catch(err){

                console.error(err);

            }

        };

        eewSocket.onclose = () => {

            console.log(
                "EEW切断"
            );

            setTimeout(
                connectEEW,
                5000
            );

        };

        eewSocket.onerror =
            console.error;

    }

    catch(err){

        console.error(err);

    }

}

// ==========================================
// EEW受信
// ==========================================

function handleEEW(
    data
){

    eewData = data;

    renderEEW();

    drawEEW();

}

// ==========================================
// パネル描画
// ==========================================

function renderEEW(){

    const area =
        document.getElementById(
            "eewList"
        );

    if(!area)
        return;

    if(!eewData){

        area.innerHTML = `
        <div class="item">
        現在発表なし
        </div>
        `;

        return;

    }

    const hypo =
        eewData.hypocenter ||
        {};

    area.innerHTML = `

<div class="item">

<b>
緊急地震速報
</b>

<br>

震源：
${hypo.name || "-"}

<br>

M：
${eewData.magnitude || "-"}

<br>

深さ：
${eewData.depth || "-"}

km

<br>

最大予想震度：
${eewData.maxIntensity || "-"}

</div>

`;

}

// ==========================================
// 地図描画
// ==========================================

function drawEEW(){

    if(
        !eewData ||
        typeof showEEWEpicenter
        !== "function"
    )
        return;

    const hypo =
        eewData.hypocenter;

    if(!hypo)
        return;

    showEEWEpicenter(

        hypo.latitude,

        hypo.longitude,

        `
        EEW
        <br>
        ${hypo.name}
        <br>
        M${eewData.magnitude}
        `

    );

}

// ==========================================
// 解除
// ==========================================

function clearEEW(){

    eewData = null;

    renderEEW();

}

// ==========================================
// 最大予想震度色
// ==========================================

function getEEWColor(
    intensity
){

    switch(
        String(intensity)
    ){

        case "1":
            return "#6ee7b7";

        case "2":
            return "#34d399";

        case "3":
            return "#facc15";

        case "4":
            return "#fb923c";

        case "5弱":
            return "#f97316";

        case "5強":
            return "#ef4444";

        case "6弱":
            return "#dc2626";

        case "6強":
            return "#991b1b";

        case "7":
            return "#7f1d1d";

        default:
            return "#475569";

    }

}

// ==========================================
// 受信時通知
// ==========================================

function notifyEEW(){

    if(
        !eewData ||
        typeof showNotification
        !== "function"
    )
        return;

    showNotification(

        "緊急地震速報",

        `${eewData.hypocenter?.name || ""}
 最大予想震度 ${eewData.maxIntensity || "-"}`

    );

}
