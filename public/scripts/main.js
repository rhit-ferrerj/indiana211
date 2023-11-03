let map;

(g=>
    {var h,a,k,p="The Google Maps JavaScript API",
    c="google",l="importLibrary",q="__ib__",
    m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),
    r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(
        async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");
        for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);
        a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));
        a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));
        d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "AIzaSyAI6ezp2EJ9_ax8nEEGWU39I3EON_hEaLA", v: "beta"});

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

const searchButton = document.getElementById("submitButton");
const zipCodeEntry = document.getElementById("enterZipCodeBox");
const countyEntryDropDown = document.getElementById("countySelector");
searchButton.addEventListener('click', (e) => {
    const categoryDropdwon = $('#serviceSelector').select2();
    const zipCode = zipCodeEntry.value;
    const county = countyEntryDropDown.value;
    const categories = categoryDropdwon.val();
    let locationTerm = `zip=${zipCode}`;
    if (zipCode === "" || zipCode.length !== 5) {
        locationTerm = `county=${county.split(" ")[0]}`;
    }
    const query = "http://localhost:3500/data?" + `${locationTerm}&` + `svc=${categories.join("&svc=")}`.replaceAll(" ", "%20");
    handleQuery(query);
    console.log(query);
});

function searchByTerm(term) {
    const apiKey = "AIzaSyAI6ezp2EJ9_ax8nEEGWU39I3EON_hEaLA";
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(term)}&key=${apiKey}`;
    let locationList = [1, 2];
    fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        locationList[0] = location.lat;
        locationList[1] = location.lng;
        console.log(locationList);
        } else {
        console.error("Error occurred while fetching data.");
        }
    })
    .catch(error => console.error("Error occurred:", error));

}

function handleQuery(query) {
    fetch(query)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(service => {
            console.log(service.service_description);
        })
    })
}

initMap();