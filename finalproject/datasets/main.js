$(() => {
    const URL1 = 'https://data.calgary.ca/resource/35ra-9556.json';
    const URL2 = 'https://data.calgary.ca/resource/k7p9-kppz.json';
    const URL3 = 'https://data.calgary.ca/resource/848s-4m4z.json';
    const URL4 = 'https://data.calgary.ca/resource/c2es-76ed.json';

    // Handle OnClick event and load corresponding page into main page

    // Load Traffic Incident Page
    $('#tfcIncident').on('click', () => {
        const tfcincdtURL = './trafficincident.html';

        $('#displayForm').empty();
        $('#displayForm').load(tfcincdtURL);
        $('#displayForm').css({"padding":"2rem"});
    })
    // Load Traffic Camera Page
    $('#tfcCamera').on('click', () => {
        const tfcCamURL = './trafficcamera.html';

        $('#displayForm').empty();
        $('#displayForm').load(tfcCamURL);
        $('#displayForm').css({"padding":"2rem"});
    })
    // Load Crime Stats Page
    $('#crmStat').on('click', () => {
        const crmStatURL = './crimestat.html';

        $('#displayForm').empty();
        $('#displayForm').load(crmStatURL);
        $('#displayForm').css({"padding":"2rem"});
    })
    // Load Building Permit Page
    $('#bldPermit').on('click', () => {
        const bldPermitURL = './buildingpermit.html';

        $('#displayForm').empty();
        $('#displayForm').load(bldPermitURL);
        $('#displayForm').css({"padding":"2rem"});
    })

    // $('#searchValue').on('change', () => )
// 
    // function DisplaySearch() {
        // switch()
    // }

    function ObtainData($url) {
        $.ajax({
            async: false, // Will not get data when use async call.
            type: 'GET',
            url: $url,
            // dataType: "",
            success: function (data) {
                console.log('Data successfully loaded');
                $.each(data, () => {
                    list = data;
                })
            },
            error: () => {
                console.log("Something went wrong.");
            },
            // Handle 400 and 500 errors
            statusCode: {
                404: () => { console.log("page not found"); },
                500: () => { console.log("Server Error"); }
            }
        });
    }
})