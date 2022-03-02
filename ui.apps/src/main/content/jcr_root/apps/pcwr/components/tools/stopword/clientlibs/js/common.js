/** A global site selector index as  it needs to be passed as a query through every API call */
var selectedSiteIndex;

var noRecordFoundDueToServerIssue =
    '<tr is="coral-table-row" class="coral-Table-row"><td style="background: white"></td><td is="coral-table-cell"><p style="text-align: center;"> Could not find the record due to server error. Sorry for the inconvenience. </p></td><td style="background: white"></td><td style="background: white"></td>';

/**
 * @description HTML that needs to be shown when no record found
 */
var noRecordFound =
    '<tr is="coral-table-row" class="coral-Table-row"><td style="background: white"></td><td is="coral-table-cell"><p style="text-align: center;"> No record found</p></td><td style="background: white"></td><td style="background: white"></td>';

 /**
 * @description HTML that needs to be shown when no site index is found
 */
 var noOakIndexConfigured =    '<tr is="coral-table-row" class="coral-Table-row"><td style="background: white"></td><td is="coral-table-cell"><p style="text-align: center;"> No oak:index has been configured for this site.</p></td><td style="background: white"></td><td style="background: white"></td>';
    
/**
 * @description It creates the options for the select tag
 * @param {string} name - Label of the option
 * @param {string} value - The value of the option
 * @param {boolean} selected - The default selected option
 * @returns {HTMLCollection} - Return coral select item tag which needs to be appended to the coral select element
 */
function createOption(name, value, selected) {
    if (selected) {
        return "<coral-select-item value=" + value + " selected=" + selected + " >" + name + "</coral-select-item>";
    } else {
        return "<coral-select-item value=" + value + ">" + name + "</coral-select-item>";
    }
}

/**
 * @description The time after which the toast should be removed. Currently it's showing after 3000ms
 */

 var TOAST_TIMER = 3000;

 /** Data type object */
 var DATA_TYPE_OBJECT = "object"

/**
 * @description - When option from select tag change the option in other tab also and load the data
 * @param {function} loadData -  function to be triggered whenever the site index changes
 * @param {function} noIndexFoundCB - function to be triggered when no side index is found
 */
function onSelectionChange(loadData ,noIndexFoundCB) {
    selectedSiteIndex = $("#selectSite").val();
    if(selectedSiteIndex !== "null")
    setTimeout(loadData, 0);
    else noIndexFoundCB()
}

$(window).on("load", function () {
    var stopwordReindex = $("#stopwordReindex");
    var synonymReindex = $("#synonymReindex");

    var sites = $("#sitesData").attr("data-value");
    sites = JSON.parse(sites);

    var sitesArray = [];

    Object.keys(sites).forEach(function (el) {
        if(sites[el].includes(undefined , null) || sites[el].length === 0){
            sites[el]= "null"
        }
        sitesArray.push({
            value: sites[el],
            content: {
                textContent: el,
            },
        });
    });

    selectedSiteIndex = sitesArray[0].value;

    /**To update the select tag dynamically */
    var select = $("#selectSite").get(0);
    sitesArray.forEach(function(el) {
        select.items.add(el);
    });

    /**
     * @description Method to call the reindex API.
     */
    function callReindexAPI() {
        if (!(stopwordReindex.attr("disabled") && synonymReindex.attr("disabled"))) {
            var url = REINDEX_URL();
            $.ajax({
                url: url,
                type: "GET",
                success: function (data) {
                    stopwordReindex.attr("disabled", "disabled");
                    synonymReindex.attr("disabled", "disabled");
                },
            });
        }
    }

    /**Whenever user switches tab */
    document.addEventListener("visibilitychange", function logData() {
        if (document.visibilityState === "hidden") {
            callReindexAPI();
        }
    });

    /** If user's on synonym tab and comes to stopword tab call reindex API if needed */
    $("#stopwordTab").on("click", function () {
        if ($("#synonymTab").hasClass("is-selected")) {
            callReindexAPI();
        }
    });

    /** If user's on stopword tab and comes to synonym tab call reindex API if needed */
    $("#synonymTab").on("click", function () {
        if ($("#stopwordTab").hasClass("is-selected")) {
            callReindexAPI();
        }
    });
});
