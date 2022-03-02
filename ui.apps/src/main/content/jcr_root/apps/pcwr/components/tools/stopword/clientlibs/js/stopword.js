var FETCH_DATA_URL = function () {
    return "/bin/addOrRemoveStopWords.fetchAll.json?index=" + selectedSiteIndex;
};
/**
 * @description Gives the which needs to be hit for that task
 * @param {string} apiCall
 * @param {string} value
 * @returns {string} URL which need to be hit for that request
 */
var getUrl = function (apiCall, value) {
    return "/bin/addOrRemoveStopWords." + apiCall + ".json?index=" + selectedSiteIndex + "&word=" + value;
};
/**
 * @description Creates a row of table with serial number , name a trash icon button
 * @param {string} name - The name of the stopword
 * @param {number} srNo - The serial number of the row
 * @param {number} index  - The index that needs to be added to the rows
 * @returns  {HTMLCollection} - Returns a row
 */
function createTableRow(name, srNo, index) {
    var row =
        '<tr is="coral-table-row" class="coral-Table-row" role="row" id="coral-id-' +
        index +
        '"><td is="coral-table-cell" class="coral-Table-cell">' +
        srNo +
        '</td> <td is="coral-table-cell" class="coral-Table-cell" role="gridcell" value="" id="coral-data-id-' +
        index +
        '">' +
        name +
        '</td><td is="coral-table-cell" class="coral-Table-cell" role="gridcell"><button id="button-"' +
        index +
        '" is="coral-button" variant="quiet" icon="close" iconsize="S"></button></td></tr>';

    return row;
}

/**
 * @description Clear the search of stopword tool
 */
function clearSearch() {
    $("#search").val("");
}

$(window).on("load", function () {
    var debounceTimer = null;
    var selectedIndex = null;
    var dialog = document.querySelector("#modal");
    var tableBody = $("#table-body");
    var toast = $("#alert");
    var toastTimer;
    var stopWordData = [];
    //Needed for search
    var stopWordDataCopy = [];

    /**
     * @description Showing toast notification and removing it after toast timer ends
     * @param {string} message  the message that need to be displayed
     * @param {boolean} success Is it a success message or a error message
     * @returns null
     */
    function showAlert(message, success) {
        $("coral-alert-content").html(message);
        var header = success ? "Success" : "Error";
        success ? $("coral-alert").removeClass("tool__toast--error") : $("coral-alert").addClass("tool__toast--error");
        $("coral-alert-header").html(header);
        toast.addClass("tool__toast--show");
        function removeToast() {
            toast.removeClass("tool__toast--show");
        }
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = setTimeout(removeToast, TOAST_TIMER);
        } else {
            toastTimer = setTimeout(removeToast, TOAST_TIMER);
        }
    }

    /**
     * @description To handle all the AJAX error and show alert
     * @param {xhr} xhr - xhr object
     * @param {string} ajaxOptions - Type of error thrown
     * @param {string} thrownError - Optional exception object if happened
     */
    function handleAjaxError(xhr, ajaxOptions, thrownError) {
        console.error(ajaxOptions);
        console.error(thrownError);
        showAlert(SERVER_ERROR_MESSAGE, false);
        $("#add-button").removeAttr("disabled");
    }

    /**
     * @description It will handle the success state of the AJAX call
     * @param {object} data - Response data coming from the API call
     */
    function successHandler(data) {
        data = typeof DATA_TYPE_OBJECT ? data : JSON.parse(data);
        $("#stopword-input").val("");
        if (data.status) {
            stopWordData = data.data;
            appendTableData(stopWordData);
            showAlert(data.message, data.status);
            $("#stopwordReindex").removeAttr("disabled");
            clearSearch();
        } else {
            showAlert(data.message, false);
        }
        $("#add-button").removeAttr("disabled");
    }

    /** Fetch the data during the initial load */
    function loadData() {
        $.ajax({
            url: FETCH_DATA_URL(),
            type: "GET",
            error: function (xhr, ajaxOptions, thrownError) {
                $("#table-body").empty();
                stopWordData = [];
                console.error(xhr.status);
                console.error(thrownError);
                tableBodyData = noRecordFoundDueToServerIssue;

                tableBody.append(tableBodyData);
                showAlert(SERVER_ERROR_MESSAGE, false);
            },
            success: function (data) {
                var responseData = typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                if (responseData.status) {
                    stopWordData = responseData.data;
                    appendTableData(stopWordData);
                } else showAlert(responseData.message, false);
            },
        });
    }

    setTimeout(loadData, 0);

    function noIndexFoundCB() {
        stopWordData = [];
        tableBodyData = noOakIndexConfigured;
        tableBody.empty();
        tableBody.append(tableBodyData);
    }

    /**Listener to listen to the option change event */
    $("#selectSite").on("change", function () {
        onSelectionChange(loadData, noIndexFoundCB);
        clearSearch();
    });

    /**
     * @description It will debounce the search call till 500ms. So that no need to filter the data at every input. Filters the data and creates in to stopwordDataCopy
     * @param {string} value String that needs to be searched
     */
    function debounceSearch(value) {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            if (!value) appendTableData(stopWordData);
        }
        debounceTimer = setTimeout(function () {
            stopWordDataCopy = JSON.parse(JSON.stringify(stopWordData));
            stopWordDataCopy = stopWordDataCopy.filter(function (el) {
                return el.includes(value);
            });
            appendTableData(stopWordDataCopy);
        }, DEBOUNCE_TIMER);
    }

    /**Listener when delete button is presses */
    dialog.on("click", "#deleteButton", function () {
        var value = encodeURIComponent(stopWordData[selectedIndex - 1]);
        $.ajax({
            url: getUrl("remove", value),
            type: "GET",
            error: handleAjaxError,
            success: successHandler,
        });
        $("#search").val("");
        dialog.hide();
    });

    /**Listener when user types in the input box  */
    $("#search").on("input", function (e) {
        debounceSearch(e.target.value.toLowerCase());
    });

    /** Listener when user clicks on the cancel button in the input box */
    $("#search").on("coral-search:clear", function (e) {
        appendTableData(stopWordData);
    });

    var appendTableData = function (data) {
        console.time("DOM paint time");
        $("#table-body").empty();
        var tableBodyData;
        if (data.length > 0) {
            data.forEach(function (el, id) {
                var srNo = id + 1;
                tableBodyData += createTableRow(el, srNo, id);
            });
        } else {
            tableBodyData = noRecordFound;
        }

        tableBody.append(tableBodyData);
        $("#stopwordTable")
            .find("tr")
            .each(function (i) {
                $(this)
                    .children("td")
                    .last()
                    .children("button")
                    .on("click", function () {
                        if ($("#search").val()) {
                            selectedIndex = stopWordData.findIndex(function (el) {
                                return el === stopWordDataCopy[i - 1];
                            });
                            selectedIndex += 1;
                            $("#dialogContent").html(
                                "Do you want to delete word <b>" + stopWordDataCopy[i - 1] + "</b> ?"
                            );
                        } else {
                            selectedIndex = i;
                            $("#dialogContent").html("Do you want to delete word <b>" + stopWordData[i - 1] + "</b> ?");
                        }

                        dialog.show();
                    });
            });
        console.timeEnd("DOM paint time");
    };

    var clickHandler = function (apiCall) {
        var input = $("#stopword-input").val();
        if (input) {
            if (input.includes(" ")) {
                showAlert("Please enter word without spaces", false);
            } else if (input.includes("-")) {
                showAlert("Please enter word without hyphen", false);
            } else {
                var url = getUrl(apiCall, encodeURIComponent(input.toLowerCase()));
                $("#add-button").attr("disabled", "disabled");
                $.ajax({
                    url: url,
                    type: "GET",
                    error: handleAjaxError,
                    success: successHandler,
                });
            }
        } else {
            showAlert("Input Empty", false);
        }
    };

    $("#add-button").on("click", function () {
        clickHandler("update");
    });
    $("#stopwordReindex").on("click", function () {
        $.ajax({
            url: REINDEX_URL(),
            type: "GET",
            error: handleAjaxError,
            success: function (data) {
                var responseData = typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                if (responseData.status) {
                    showAlert("Reindex done successfully", true);
                } else showAlert("Something went wrong", false);
            },
        });
        $("#stopwordReindex").attr("disabled", "disabled");
    });

    /**Listener to listen to the enter key on the input box */
    $("#stopword-input").on("keyup", function (e) {
        if (e.which === 13 && e.target.value && !$("#add-button").attr("disabled")) {
            clickHandler("update");
        }
    });
});
