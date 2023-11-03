const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 3500;

app = express();

const jsonData = JSON.parse(fs.readFileSync('realResources.json', 'utf-8'));

// app.get('/data/county/:county', (req, res) => {
//     const cty = req.params.county;
//     const filteredData = jsonData.filter((item) => item.county === cty);

//     if (filteredData.length > 0){
//         res.json(filteredData);
//     } else {
//         res.status(404).json({error: 'No data found for requested county'});
//     }
// });

// app.get('/data/zip/:zip', (req, res) => {
//     const z = req.params.zip;
//     const filteredData = jsonData.filter((item) => item.zipcode === z);

//     if (filteredData.length > 0){
//         res.json(filteredData);
//     } else {
//         res.status(404).json({error: 'No data found for requested county'});
//     }
// });

// app.get('/data/service', (req, res) => {
//     const {svc} = req.query;

//     if (svc) {
//         const svcList = Array.isArray(svc) ? svc : [svc];
//         const filteredData = jsonData.filter(item => svcList.includes(item.service_name));
//         res.json(filteredData);
//     } else {
//         res.json(jsonData);
//     }
// });


app.get('/data', (req, res) => {

    const {county, zip, svc} = req.query;

    let filteredData = jsonData;

    if(county) {
        console.log(county);
        filteredData = filteredData.filter(item => item.county === county);
    }

    if(zip) {
        console.log(zip);
        filteredData = filteredData.filter(item => item.zipcode === zip);
    }

    if (svc) {
        const svcList = Array.isArray(svc) ? svc : [svc];
        filteredData = filteredData.filter(item => svcList.includes(item.taxonomy_name));
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.json(filteredData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

