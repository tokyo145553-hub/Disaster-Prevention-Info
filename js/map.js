// ==========================================
// TEB防災
// map.js
// ==========================================

let map;

let prefectureLayer = null;

let earthquakeMarkers = [];
let eewMarkers = [];

const JAPAN_CENTER = [
    36.2048,
    138.2529
];

// ==========================================
// 初期化
// ==========================================

window.addEventListener(
    "load",
    initMap
);

function initMap(){

    const mapElement =
        document.getElementById(
            "map"
        );

    if(!mapElement)
        return;

    map = L.map(
        "map",
        {
            zoomControl:true
        }
    );

    map.setView(
        JAPAN_CENTER,
        5
    );

    createBaseMap();

    loadPrefectureGeoJSON();

}

// ==========================================
// ベースマップ
// ==========================================

function createBaseMap(){

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
            attribution:
            "&copy; OpenStreetMap & CARTO",
            maxZoom:19
        }
    ).addTo(map);

}

// ==========================================
// 都道府県境界
// ==========================================

async function loadPrefectureGeoJSON(){

    try{

        const res =
            await fetch(
                "./data/prefectures.geojson"
            );

        const geojson =
            await res.json();

        prefectureLayer =
            L.geoJSON(
                geojson,
                {
                    style:
                    prefectureStyle,
                    onEachFeature:
                    onEachPrefecture
                }
            );

        prefectureLayer.addTo(
            map
        );

    }

    catch(err){

        console.error(
            "GeoJSON読込失敗",
            err
        );

    }

}

// ==========================================
// スタイル
// ==========================================

function prefectureStyle(){

    return {

        color:"#64748b",

        weight:1,

        fillColor:"#1e293b",

        fillOpacity:0.4

    };

}

// ==========================================
// イベント
// ==========================================

function onEachPrefecture(
    feature,
    layer
){

    const name =
        feature.properties.name ||
        "不明";

    layer.on({

        mouseover:e=>{

            e.target.setStyle({

                weight:2,

                fillOpacity:0.8

            });

        },

        mouseout:e=>{

            prefectureLayer
            ?.resetStyle(
                e.target
            );

        },

        click:()=>{

            showPrefectureInfo(
                name
            );

        }

    });

}

// ==========================================
// 都道府県情報
// ==========================================

function showPrefectureInfo(
    prefecture
){

    const detail =
        document.getElementById(
            "detail"
        );

    if(detail){

        detail.innerHTML = `
        <h3>
        ${prefecture}
        </h3>
        `;

    }

}

// ==========================================
// 地図移動
// ==========================================

function moveToLocation(
    lat,
    lon,
    zoom=7
){

    if(!map)
        return;

    map.flyTo(
        [lat,lon],
        zoom,
        {
            duration:1
        }
    );

}

// ==========================================
// 地震マーカー
// ==========================================

function showEpicenter(
    lat,
    lon,
    title
){

    if(!map)
        return;

    const marker =
        L.circleMarker(
            [lat,lon],
            {
                radius:8,

                color:"#f59e0b",

                fillColor:"#f59e0b",

                fillOpacity:0.8
            }
        );

    marker
        .addTo(map)
        .bindPopup(
            title
        );

    earthquakeMarkers.push(
        marker
    );

}

// ==========================================
// EEWマーカー
// ==========================================

function showEEWEpicenter(
    lat,
    lon,
    title
){

    if(!map)
        return;

    const marker =
        L.circleMarker(
            [lat,lon],
            {
                radius:12,

                color:"#ff0000",

                fillColor:"#ff0000",

                fillOpacity:1
            }
        );

    marker
        .addTo(map)
        .bindPopup(
            title
        );

    eewMarkers.push(
        marker
    );

}

// ==========================================
// マーカー削除
// ==========================================

function clearEarthquakeMarkers(){

    earthquakeMarkers.forEach(
        marker=>{

            map.removeLayer(
                marker
            );

        }
    );

    earthquakeMarkers = [];

}

function clearEEWMarkers(){

    eewMarkers.forEach(
        marker=>{

            map.removeLayer(
                marker
            );

        }
    );

    eewMarkers = [];

}

// ==========================================
// 警報色塗り
// ==========================================

function updatePrefectureColor(
    prefectureName,
    color
){

    if(
        !prefectureLayer
    )
        return;

    prefectureLayer.eachLayer(
        layer=>{

            const name =
            layer.feature
            ?.properties
            ?.name;

            if(
                name ===
                prefectureName
            ){

                layer.setStyle({

                    fillColor:
                    color,

                    fillOpacity:
                    0.8

                });

            }

        }
    );

}

// ==========================================
// 色リセット
// ==========================================

function resetPrefectureColors(){

    if(
        !prefectureLayer
    )
        return;

    prefectureLayer.eachLayer(
        layer=>{

            layer.setStyle({

                fillColor:
                "#1e293b",

                fillOpacity:
                0.4

            });

        }
    );

}

// ==========================================
// 全国表示
// ==========================================

function zoomJapan(){

    if(!map)
        return;

    map.setView(
        JAPAN_CENTER,
        5
    );

}
