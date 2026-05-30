// ==========================================
// TEB防災
// earthquake.js
// ==========================================

const P2P_URL =
"https://api.p2pquake.net/v2/history?codes=551&limit=50";

let quakeCache = [];

// ==========================================
// 初期化
// ==========================================

window.addEventListener(
    "load",
    () => {

        loadEarthquake();

        setInterval(
            loadEarthquake,
            60000
        );

    }
);

// ==========================================
// 地震取得
// ==========================================

async function loadEarthquake() {

    try {

        const res =
            await fetch(P2P_URL);

        const data =
            await res.json();

        quakeCache = data;

        renderEarthquake(
            data
        );

    }

    catch(err){

        console.error(
            "地震情報取得失敗",
            err
        );

        setError(
            "quakeList",
            "地震情報取得失敗"
        );

    }

}

// ==========================================
// 描画
// ==========================================

function renderEarthquake(
    data
) {

    const area =
        document.getElementById(
            "quakeList"
        );

    if(!area) return;

    area.innerHTML = "";

    data.forEach(eq=>{

        const hypo =
            eq.earthquake
            ?.hypocenter;

        if(!hypo) return;

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "item";

        const scale =
            convertScale(
                eq.earthquake
                .maxScale
            );

        div.innerHTML = `

<b>${hypo.name}</b><br>

最大震度：
${scale}<br>

M：
${eq.earthquake.magnitude}<br>

深さ：
${eq.earthquake.depth}km

`;

        div.addEventListener(
            "click",
            ()=>{

                jumpToEarthquake(
                    eq
                );

            }
        );

        area.appendChild(
            div
        );

    });

}

// ==========================================
// 震度変換
// ==========================================

function convertScale(
    scale
){

    const table = {

        10:"1",
        20:"2",
        30:"3",
        40:"4",

        45:"5弱",
        50:"5強",

        55:"6弱",
        60:"6強",

        70:"7"

    };

    return (
        table[scale]
        || "-"
    );

}

// ==========================================
// 地図移動
// ==========================================

function jumpToEarthquake(
    eq
){

    const hypo =
        eq.earthquake
        ?.hypocenter;

    if(!hypo)
        return;

    const lat =
        hypo.latitude;

    const lon =
        hypo.longitude;

    if(
        lat &&
        lon &&
        typeof moveToLocation
        === "function"
    ){

        moveToLocation(
            lat,
            lon,
            7
        );

    }

    if(
        typeof showEpicenter
        === "function"
    ){

        showEpicenter(

            lat,
            lon,

            `
            ${hypo.name}<br>
            M${eq.earthquake.magnitude}
            `

        );

    }

}

// ==========================================
// 最新地震
// ==========================================

function getLatestEarthquake(){

    if(
        quakeCache.length
        === 0
    )
        return null;

    return quakeCache[0];

}

// ==========================================
// 最大震度色
// ==========================================

function getIntensityColor(
    scale
){

    switch(scale){

        case 10:
            return "#6ee7b7";

        case 20:
            return "#34d399";

        case 30:
            return "#facc15";

        case 40:
            return "#fb923c";

        case 45:
            return "#f97316";

        case 50:
            return "#ef4444";

        case 55:
            return "#dc2626";

        case 60:
            return "#991b1b";

        case 70:
            return "#7f1d1d";

        default:
            return "#64748b";

    }

}

// ==========================================
// 地図震源一括表示
// ==========================================

function drawRecentEarthquakes(){

    quakeCache.forEach(
        eq=>{

            const hypo =
                eq.earthquake
                ?.hypocenter;

            if(!hypo)
                return;

            if(
                typeof showEpicenter
                !== "function"
            )
                return;

            showEpicenter(

                hypo.latitude,

                hypo.longitude,

                `
                ${hypo.name}
                <br>
                M${eq.earthquake.magnitude}
                `

            );

        }
    );

}
