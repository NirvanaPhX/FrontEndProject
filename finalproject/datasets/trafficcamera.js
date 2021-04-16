$(() => {
    const URL = 'https://data.calgary.ca/resource/k7p9-kppz.json';
    // Get the template from the page
    var template = $('#card-template').html();
    var list;
    var $displayForm = $('#displayData');

    ObtainData(URL);

    $('#inputValue').on('keyup', () => {
        var keyword = $('#inputValue').val();

        switch($('#searchValue').val()) {
            case "quad":
                SearchQuadrant(keyword);
                break;
            case "loc":
                SearchLocation(keyword);
                break;
            case "desc":
                SearchDescription(keyword);
                break;
        }
    })

    $('#searchValue').on('change', () => {
        $('#displayData').empty();
    })

    function ObtainData($url) {
        $.ajax({
            async: false, // May not get correct data when use async call.
            type: 'GET',
            url: $url,
            success: function (data) {
                console.log('Data successfully loaded');
                $.each(data, () => {
                    list = data;
                })
            },
            // Handle Unexpeted AJAX failure
            error: () => {
                console.log("Something went wrong.");
            },
            statusCode: {
            // Handle 400 and 500 errors
                404: () => {console.log("page not found");},
                500: () => {console.log("Server Error");}
            }
        });
    }


    //Create functions for each searching criteria
    // Search By Quadrant 
    function SearchQuadrant(quadrant) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.quadrant.toUpperCase() == quadrant.toUpperCase()) {
                addEntry(value);
            }
        })
    }

    // Search By Date
    function SearchLocation(loc) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.camera_location.includes(loc)) {
                addEntry(value);
            }
        })
    }

    // Search By Description
    function SearchDescription(desc) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.camera_url.description.includes(desc)) {
                addEntry(value);
            }
        })
    }

    function addEntry(entry) {

        HTMLfragment = `
        <div class="card">
            <div class="card-match">
                <label>Match</label>
            </div>
            <div class="card-field">
                <label><strong>Camera URL: </strong><a href="${entry.camera_url.url}" target="_blank">Click to see a example photo</a></label>
            </div>
            <div class="card-field">
                <label><strong>Quadrant: </strong>${entry.quadrant}</label>
            </div>
            <div class="card-field">
                <label><strong>Camera Description:</strong>${entry.camera_url.description}</label>
            </div>
            <div class="card-field">
                <label><strong>Location:</strong>${entry.camera_location}</label>
            </div>
            <div class="card-field">
                <label><a href="https://www.google.com/maps/search/?api=1&query=${entry.point.coordinates[1]},${entry.point.coordinates[0]}" target="_blank">Locate on Google Map</a></label>
            </div>
        `;

        $displayForm.append(HTMLfragment);

    }
})