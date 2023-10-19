let map;

async function initMap(){
    const position = {lat: 39.4667, lng: -87.4139}
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 8,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Terre Haute",
    });

}

initMap();

let parsedData = null;

const response = await fetch('us-county-boundaries.json');
const data = await response.json();
data.array.forEach(addToDropdown(element));
const dropdown = document.getElementById("countySelector");

function addToDropdown(county) {
    const name = county.namelsad;
    const newPart = document.createElement("option");
    console.log(name);
};