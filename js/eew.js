// ==========================================
// TEB防災
// eew.js
// Wolfx JMA EEW
// ==========================================

const WOLFX_EEW_WS =
"wss://ws-api.wolfx.jp/jma_eew";

let eewSocket = null;
let currentEEW = null;

// ==========================================
// 初期化
// ==========================================

window.addEventListener(
    "load",
    ()=>{

        connectEEW();

    }
);

// ==========================================
// 接続
// ==========================================

function connectEEW(){

    try{

        eewSocket =
        new WebSocket(
            WOLFX_EEW_WS
        );

        eewSocket.onopen =
        ()=>{

            console.log(
                "EEW接続成功"
            );

            try{

                eewSocket.send(
                    "query_jmaeew"
                );

            }
            catch(err){}

        };

        eewSocket.onmessage =
        event=>{

            try{

                const data =
                JSON.parse(
                    event.data
                );

                handleEEW(
                    data
                );

            }
            catch(err){

                console.error(
                    err
                );

            }

        };

        eewSocket.onclose =
        ()=>{

            console.log(
                "EEW切断"
            );

            setTimeout(
                connectEEW,
                5000
            );

        };

        eewSocket.onerror =
        err=>{

            console.error(
                err
            );

        };

    }
    catch(err){

        console.error(
            err
        );

    }

}

// ==========================================
// EEW処理
// ==========================================

function handleEEW(
    data
){

    if(
        data.type ===
        "heartbeat"
    ){

        try{

            eewSocket.send(
                "ping"
            );

        }
        catch(err){}

        return;

    }

    if(
        data.type !==
        "jma_eew"
    )
        return;

    if(
        data.isTraining
    )
        return;

    currentEEW = data;

    renderEEW();

    drawEEW();

    notifyEEW();

}

// ==========================================
// 描画
// ==========================================

function renderEEW(){

    const page =
    document.getElementById(
        "eewList"
    );

    const home =
    document.getElementById(
        "homeEEW"
    );

    const html =
    buildEEWHTML();

    if(page)
        page.innerHTML =
        html;

    if(home)
        home.innerHTML =
        html;

}

// ==========================================
// HTML生成
// ==========================================

function buildEEWHTML(){

    if(!currentEEW){

        return `
        <div class="item">
        現在発表されていません
        </div>
        `;

    }

    if(
        currentEEW.isCancel
    ){

        return `
        <div class="item">
        緊急地震速報は
        取消されました
        </div>
        `;

    }

    const color =
    getEEWColor(
        currentEEW
        .MaxIntensity
    );

    return `

<div
class="item"
style="
border-left:
6px solid ${color};
"
>

<b>

${currentEEW.Title}

</b>

<br>

震源地：
${currentEEW.Hypocenter}

<br>

最大予想震度：
${currentEEW.MaxIntensity}

<br>

M：
${currentEEW.Magunitude}

<br>

深さ：
${currentEEW.Depth}km

<br>

第
${currentEEW.Serial}
報

${
currentEEW.isFinal
? "<br>最終報"
: ""
}

</div>

`;

}

// ==========================================
// 地図描画
// ==========================================

function drawEEW(){

    if(
        !currentEEW
    )
        return;

    if(
        typeof showEEWEpicenter
        !== "function"
    )
        return;

    showEEWEpicenter(

        currentEEW.Latitude,

        currentEEW.Longitude,

        `
        ${currentEEW.Hypocenter}
        <br>
        M${currentEEW.Magunitude}
        <br>
        最大震度
        ${currentEEW.MaxIntensity}
        `

    );

}

// ==========================================
// 通知
// ==========================================

function notifyEEW(){

    if(
        !currentEEW
    )
        return;

    if(
        typeof showNotification
        !== "function"
    )
        return;

    showNotification(

        "緊急地震速報",

        `${currentEEW.Hypocenter}
最大震度
${currentEEW.MaxIntensity}`

    );

}

// ==========================================
// 色
// ==========================================

function getEEWColor(
    intensity
){

    switch(
        String(
            intensity
        )
    ){

        case "1":
            return "#60a5fa";

        case "2":
            return "#38bdf8";

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
            return "#64748b";

    }

}

// ==========================================
// 取得中EEW
// ==========================================

function getCurrentEEW(){

    return currentEEW;

}
