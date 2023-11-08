let map;

(g=>
    {
        var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
        b = b[c] || (b[c]={});
        var d = b.maps||(b.maps={}), r = new Set, e = new URLSearchParams, u=()=>h || 
            (h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");
        for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);
        a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));
        a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));
        d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "AIzaSyAI6ezp2EJ9_ax8nEEGWU39I3EON_hEaLA", v: "beta"});

async function initMap(markerList){
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        zoom: 7,
        center: {lat: 39.77463, lng: -86.22029},
        mapId: "DEMO_MAP_ID",
    });

    console.log(Object.keys(markerList).length);
    if (Object.keys(markerList).length > 0 && Object.keys(markerList).length < 25){
        for (const key in markerList){
            if (markerList.hasOwnProperty(key)){
                var marker = new google.maps.Marker({
                    position: markerList[key],
                    title:key,
                    map: map,
                    optimized: true 
                });
            }
        }
    }
}

const searchButton = document.getElementById("submitButton");
const zipCodeEntry = document.getElementById("enterZipCodeBox");
const countyEntryDropDown = document.getElementById("countySelector");
searchButton.addEventListener('click', async (e) => {
    const categoryDropdwon = $('#serviceSelector').select2();
    const zipCode = zipCodeEntry.value;
    const county = countyEntryDropDown.value;
    const categories = categoryDropdwon.val();
    let locationTerm = `zip=${zipCode}`;
    if (zipCode === "" || zipCode.length !== 5) {
        locationTerm = `county=${county.split(" ")[0]}`;
    }
    const query = "http://localhost:3500/data?" + `${locationTerm}&` + `svc=${categories.join("&svc=")}`.replaceAll(" ", "%20");
    
    try {
        const markerDict = await handleQuery(query);
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

function searchByTerm(term) {
    const apiKey = "AIzaSyAI6ezp2EJ9_ax8nEEGWU39I3EON_hEaLA";
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(term)}&key=${apiKey}`;
    return fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                const location = data.results[0].geometry.location;
                return { lat: location.lat, lng: location.lng };
            } else {
                throw new Error("Error occurred while fetching data.");
            }
        })
        .catch(error => {
            console.error("Error occurred:", error);
            throw error;
        });
}


function handleQuery(query) {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";
    let markerDict = {};
    fetch(query)
        .then(response => response.json())
        .then(data => {
            const searchPromises = data.map(service => {
                return searchByTerm(`${service.address_1}%20${service.city}%20IN`)
                    .then(locationList => {
                        markerDict[service.site_name] = locationList;
                    })
            });
            return Promise.all(searchPromises)
                .then(() => {
                    initMap(markerDict);
                    return data;
                })
        })
        .then(data => {
            data.forEach(service => {
                cardContainer.innerHTML += `
                <div class="col-md-12">
                    <div class="card mb-3">
                        <div class="card-header">
                            ${service.site_name} - ${service.service_website !== "" ? `<a href=${service.service_website}>${service.service_website}</a>` : service.site_number} 
                        </div>
                        <div class="card-body">
                            <p>Address: ${service.address_1}, ${service.city}, IN</p>
                            <p>Schedule: ${service.site_schedule}</p>
                            <p>Eligibility: ${service.site_eligibility}</p>
                            <p>Description: ${service.agency_desc}</p>
                            <p>Service Type: ${service.taxonomy_name}</p>
                        </div>
                    </div>
                </div>`;
            });
            if (cardContainer.innerHTML === "") {
                cardContainer.innerHTML = "<h1>SEARCH RETURNED NO RESULTS</h1>";
            }
        });
}

function getTaxonomies() {
    const serviceSelector = document.getElementById("serviceSelector");
    serviceSelector.innerHTML = "";
    fetch("http://localhost:3500/taxonomies")
    .then(response => response.json())
    .then(dataArray => {
        dataArray.forEach(tax => {
            serviceSelector.innerHTML = serviceSelector.innerHTML += `<option value="${tax}">${tax}</option>`
        })
    });
}

initMap({});
getTaxonomies();