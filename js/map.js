// ==========================================
// TEB防災
// map.js
// ==========================================

let map;
let prefectureLayer;

const JAPAN_CENTER = [
    36.2048,
    138.2529
];

// ==========================================
// 初期化
// ==========================================

function initMap() {

    map = L.map("map", {

        zoomControl: true,
        attributionControl: true

    });

    map.setView(JAPAN_CENTER, 5);

    createBaseMap();

    loadPrefectureGeoJSON();

}

// ==========================================
// 背景地図
// ==========================================

function createBaseMap() {

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution:
            "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

}

// ==========================================
// GeoJSON読込
// ==========================================

async function loadPrefectureGeoJSON() {

    try {

        const response =
            await fetch(
                "./data/prefectures.geojson"
            );

        const geojson =
            await response.json();

        prefectureLayer =
            L.geoJSON(
                geojson,
                {
                    style: prefectureStyle,
                    onEachFeature:
                        onEachPrefecture
                }
            );

        prefectureLayer.addTo(map);

        console.log(
            "都道府県境界読込完了"
        );

    } catch (err) {

        console.error(
            "GeoJSON読込失敗",
            err
        );

    }

}

// ==========================================
// スタイル
// ==========================================

function prefectureStyle() {

    return {

        color: "#94a3b8",

        weight: 1,

        fillColor: "#334155",

        fillOpacity: 0.6

    };

}

// ==========================================
// 各都道府県
// ==========================================

function onEachPrefecture(
    feature,
    layer
) {

    const name =
        feature.properties.name ||
        "不明";

    layer.on({

        mouseover: e => {

            e.target.setStyle({

                weight: 2,
                fillOpacity: 0.9

            });

        },

        mouseout: e => {

            prefectureLayer.resetStyle(
                e.target
            );

        },

        click: () => {

            showPrefectureInfo(
                name
            );

        }

    });

}

// ==========================================
// 情報表示
// ==========================================

function showPrefectureInfo(
    prefecture
) {

    L.popup()

    .setLatLng(
        map.getCenter()
    )

    .setContent(
        `
        <b>${prefecture}</b><br>
        詳細情報取得準備中
        `
    )

    .openOn(map);

}

// ==========================================
// 地図移動
// ==========================================

function moveToLocation(
    lat,
    lon,
    zoom = 8
) {

    map.flyTo(
        [lat, lon],
        zoom,
        {
            duration: 1
        }
    );

}

// ==========================================
// 震源表示
// ==========================================

function showEpicenter(
    lat,
    lon,
    title
) {

    const marker =
        L.marker(
            [lat, lon]
        );

    marker
        .addTo(map)
        .bindPopup(title);

}

// ==========================================
// EEW震源表示
// ==========================================

function showEEWEpicenter(
    lat,
    lon,
    title
) {

    const marker =
        L.circleMarker(
            [lat, lon],
            {
                radius: 12,

                color: "#ff0000",

                fillColor: "#ff0000",

                fillOpacity: 0.8
            }
        );

    marker
        .addTo(map)
        .bindPopup(title);

}

// ==========================================
// 警報色塗り
// ==========================================

function updatePrefectureColor(
    prefectureName,
    color
) {

    prefectureLayer.eachLayer(
        layer => {

            if (
                layer.feature
                .properties
                .name ===
                prefectureName
            ) {

                layer.setStyle({

                    fillColor:
                        color

                });

            }

        }
    );

}

// ==========================================
// 初期化
// ==========================================

window.addEventListener(
    "load",
    initMap
);
