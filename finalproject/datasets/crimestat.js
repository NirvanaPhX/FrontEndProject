$(() => {
    const URL = 'https://data.calgary.ca/resource/848s-4m4z.json';
    // Get the template from the page
    var template = $('#grid-template').html();
    var list;
    var $displayForm = $('#displayData-grid');

    ObtainData(URL);

    $('#inputValue').on('keyup', () => {
        var keyword = $('#inputValue').val();

        switch($('#searchValue').val()) {
            case "sector":
                SearchSector(keyword);
                break;
            case "community":
                SearchCommunity(keyword);
                break;
            case "category":
                SearchCategory(keyword);
                break;
            case "year":
                SearchYear(keyword);
                break;
            case "count":
                SearchCount(keyword);
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
    function SearchSector(sector) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if (value.sector.toUpperCase() == sector.toUpperCase()) {
                addEntry(value);
            }
        })
    }

    function SearchCommunity(community) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.community_name.includes(community.toUpperCase())) {
                addEntry(value);
            }
        })
    }

    function SearchCategory(category) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.category.toUpperCase().includes(category.toUpperCase())) {
                addEntry(value);
            }
        })
    }

    function SearchCount(count) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.count === count) {
                addEntry(value);
            }
        })
    }

    function SearchYear(year) {
        $($displayForm).empty();
        $.each(list, (index, value) => {
            if(value.year == year) {
                addEntry(value);
            }
        })
    }

    function addEntry(entry) {
        //If No rows yet, add the header
        if ($displayForm.children().length==0) {
            var HTMLfragment = `
            <div class="hdr">
            <span>Sector</span>
            <span>Community Name</span>
            <span>Category</span>
            <span>Count</span>
            <span>Year</span>
            <span>Month</span>
            <span>Map</span>
            </div>
            `;
            $displayForm.append(HTMLfragment);
        }
        // Render the template
        $displayForm.append(Mustache.render(template, entry))
    }
})