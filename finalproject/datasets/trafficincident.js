$(() => {
    const URL1 = 'https://data.calgary.ca/resource/35ra-9556.json';
    // Get the template from the page
    var template = $('#card-template').html();
    var list;
    var $displayForm = $('#displayData');

    ObtainData(URL1);

    $('#tfcIncdtInfo').on('keyup', () => {
        var keyword = $('#tfcIncdtInfo').val();

        switch($('#searchValue').val()) {
            case "info":
                SearchInfo(keyword);
                break;
            case "date":
                SearchDate(keyword);
                break;
            case "description":
                SearchDescription(keyword);
                break;
        }
    })

    $('#searchValue').on('change', () => {
        $('#displayData').empty();
    })

    function ObtainData($url) {
        $.ajax({
            async: false, // Will not get data when use async call.
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
    // Search By Info
    function SearchInfo(info) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.incident_info.startsWith(info)) {
                addEntry(value);
            }
        })
    }

    // Search By Date
    function SearchDate(date) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.start_dt.startsWith(date)) {
                addEntry(value);
            }
        })
    }

    // Search By Description
    function SearchDescription(desc) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.description.includes(desc)) {
                addEntry(value);
            }
        })
    }

    function addEntry(entry) {
        // If No rows yet, add the header
        // if ($displayForm.children().length==0) {
        //     var HTMLfragment = `
        //     <div class="hdr">
        //     <span>Incident Info</span>
        //     <span>Date</span>
        //     <span>Description</span>
        //     <span>Latitude</span>
        //     <span>Longitude</span>
        //     </div>
        //     `;
        //     $displayForm.append(HTMLfragment);
        // }
        // Render the template
        $displayForm.append(Mustache.render(template, entry));
    }
})