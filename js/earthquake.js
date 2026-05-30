// ==========================================
// TEB防災
// earthquake.js
// ==========================================

const P2P_URL =
"https://api.p2pquake.net/v2/history?codes=551&limit=50";

let earthquakeCache = [];

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

async function loadEarthquake(){

    try{

        const res =
            await fetch(
                P2P_URL
            );

        const data =
            await res.json();

        earthquakeCache =
            data;

        renderEarthquakeList(
            data
        );

        renderHomeEarthquake(
            data
        );

    }

    catch(err){

        console.error(
            err
        );

        setError(
            "quakeList",
            "地震情報取得失敗"
        );

    }

}

// ==========================================
// 地震一覧
// ==========================================

function renderEarthquakeList(
    data
){

    const area =
        document.getElementById(
            "quakeList"
        );

    if(!area)
        return;

    area.innerHTML = "";

    data.forEach(eq=>{

        const hypo =
            eq.earthquake
            ?.hypocenter;

        if(!hypo)
            return;

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "item";

        const intensity =
            convertScale(
                eq.earthquake
                .maxScale
            );

        item.innerHTML = `
            <b>
            ${hypo.name}
            </b>
            <br>
            最大震度:
            ${intensity}
            <br>
            M:
            ${eq.earthquake.magnitude}
            <br>
            深さ:
            ${eq.earthquake.depth}km
        `;

        item.addEventListener(
            "click",
            ()=>{

                jumpToEarthquake(
                    eq
                );

            }
        );

        area.appendChild(
            item
        );

    });

}

// ==========================================
// ホーム表示
// ==========================================

function renderHomeEarthquake(
    data
){

    const area =
        document.getElementById(
            "homeQuake"
        );

    if(!area)
        return;

    if(
        data.length === 0
    ){

        area.textContent =
        "地震情報なし";

        return;

    }

    const eq =
        data[0];

    const hypo =
        eq.earthquake
        ?.hypocenter;

    if(!hypo)
        return;

    area.innerHTML = `
        <b>
        ${hypo.name}
        </b>
        <br>
        最大震度:
        ${convertScale(
            eq.earthquake.maxScale
        )}
        <br>
        M:
        ${eq.earthquake.magnitude}
    `;

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

    if(
        typeof moveToLocation
        === "function"
    ){

        moveToLocation(
            hypo.latitude,
            hypo.longitude,
            7
        );

    }

    if(
        typeof showEpicenter
        === "function"
    ){

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
// 震度色
// ==========================================

function getIntensityColor(
    scale
){

    switch(scale){

        case 10:
            return "#60a5fa";

        case 20:
            return "#38bdf8";

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
// 最新地震
// ==========================================

function getLatestEarthquake(){

    if(
        earthquakeCache.length
        === 0
    )
        return null;

    return earthquakeCache[0];

}
