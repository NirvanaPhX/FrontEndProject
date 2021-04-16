$(() => {
    const URL = 'https://data.calgary.ca/resource/c2es-76ed.json';
    // Get the template from the page
    var template = $('#grid-template').html();
    var list;
    var $displayForm = $('#displayData-grid');

    ObtainData(URL);

    $('#inputValue').on('keyup', () => {
        var keyword = $('#inputValue').val();

        switch ($('#searchValue').val()) {
            case "permitnum":
                SearchNumber(keyword);
                break;
            case "permitclass":
                SearchClass(keyword);
                break;
            case "communityname":
                SearchName(keyword);
                break;
            case "locationaddress":
                SearchAddress(keyword);
                break;
        }
    })

    $('#searchValue').on('change', () => {
        $('#displayData').empty();
    })

    $('#inputValue').on('focus', () => {
        if ($('#searchValue').val() == "permitnum") {
            $('#tooltip').html("Exact Match");
            PopTooltip();
        } else if ($('#searchValue').val() == "") {
            HideTooltip();
        } else {
            $('#tooltip').html("Partial Match");
            PopTooltip();
        }
    })

    $('#inputValue').on('blur', () => {
        HideTooltip();
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
                404: () => { console.log("page not found"); },
                500: () => { console.log("Server Error"); }
            }
        });
    }


    //Create functions for each searching criteria
    function SearchNumber(permitnum) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.permitnum == permitnum) {
                addEntry(value);
            }
        })
    }

    function SearchClass(permitclass) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.permitclass.toUpperCase().includes(permitclass.toUpperCase())) {
                addEntry(value);
            }
        })
    }

    function SearchName(communityname) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.communityname.toUpperCase().includes(communityname.toUpperCase())) {
                addEntry(value);
            }
        })
    }

    function SearchAddress(address) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.locationaddresses.toUpperCase().includes(address.toUpperCase())) {
                addEntry(value);
            }
        })
    }


    function addEntry(entry) {
        //If No rows yet, add the header
        if ($displayForm.children().length == 0) {
            var HTMLfragment = `
            <div class="hdr bp">
            <span>Permit#</span>
            <span>Permit Class</span>
            <span>Community Name</span>
            <span>Address</span>
            <span>Location Type</span>
            <span>Total Area</span>
            <span>Map</span>
            </div>
            `;
            $displayForm.append(HTMLfragment);
        }
        // Render the template
        $displayForm.append(Mustache.render(template, entry))
    }

    function PopTooltip() {
        const idAppendTo = $('#tooltip');
        $(idAppendTo).show("fast");
    }

    function HideTooltip() {
        const idAppendTo = $('#tooltip');
        $(idAppendTo).hide("slow");
    }
})