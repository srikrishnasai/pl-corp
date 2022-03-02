var SYNONYM_FETCH_DATA_URL = function () {
    return "/bin/updateSynonymWords.fetchAll.json?index=" + selectedSiteIndex;
};

var SYNONYM_REMOVE_URL = function () {
    return "/bin/updateSynonymWords.remove.json?index=" + selectedSiteIndex + "&id=";
};

var SYNONYM_ADD_URL = function () {
    return "/bin/updateSynonymWords.update.json?index=" + selectedSiteIndex + "&word=";
};

var REINDEX_URL = function () {
    return "/bin/addOrRemoveStopWords.reindex.json?index=" + selectedSiteIndex;
};

var SERVER_ERROR_MESSAGE = "Something went wrong on the server side. Sorry for the inconvenience";

var ROW_REMOVED_MESSAGE = "Row removed successfully";

/**
 * @description The time after which the search function would filter the result and show. Currently it's showing after 500ms
 */
var DEBOUNCE_TIMER = 500;

/**
 * @description Creates a coral tag with id tag-index-position of word in that index
 * @param {string} tagValue
 * @param {number} id - The index at which the word is there
 * @param {number} index - The index at which the word is in the line
 * @returns {HTMLCollection} - Returns a coral tag with id and value attribute to access that tag
 */
var createTag = function (tagValue, id, index) {
    var tag =
        '<coral-tag  value="' + tagValue + '" closable id=tag-' + id + "-" + index + ">" + tagValue + "</coral-tag>";
    return tag;
};

/**
 * @description Creates a new row with index , tags , edit and delete button
 * @param {string} data - The value of the  tags that needs to be created on that row
 * @param {number} id - The number of the row in the array
 * @returns {HTMLCollection} - It returns the table row with serial number , tags , edit and delete button
 */
var createRow = function (data, id) {
    var synonymWords = data.split(",");
    var tagsInRow = "";
    synonymWords.forEach(function (el, index) {
        if (el.trim().length > 0) {
            tagsInRow += createTag(el, id, index);
        }
    });

    var index = id + 1;

    var row =
        '<tr style="background:white" is="coral-table-row"><td class="coral-Table-row" role="row" is="coral-table-cell">' +
        index +
        '</td><td class="table" is="coral-table-cell">' +
        tagsInRow +
        '<input class="inputSynonym" disabled style="background:transparent" id="inputRow' +
        id +
        '" style="" type="text" /></td><td is="coral-table-cell" class="coral-Table-row" role="row"><button is="coral-button" id="edit' +
        id +
        '" variant="quiet" value="' +
        id +
        '" data-type="edit" icon="edit" iconsize="S" /></td><td is="coral-table-cell" class="coral-Table-row" role="row"><button is="coral-button" id="delete' +
        id +
        '" variant="quiet" data-type="delete" icon="delete" iconsize="S"></button></td></tr>';

    return row;
};

/**
 * @description It checks if the given word is already present in the object or not making sure that all entries are uniquw
 * @param {object} data - The object in which the words needs to be searched
 * @param {object} word - The word that needs to be searched in the given object
 * @returns {boolean} A boolean value telling if the word exists or not
 */
var checkIfWordExists = function (data, word) {
    var word = word.trim();
    return Object.keys(data).some(function (key) {
        return data[key].split(",").some(function (el) {
            return el.trim() === word;
        });
    });
};

/**
 * @description It searches for the index of a value in the original data. As the backend is 1-based we need to add +1 to the resultant index
 * @param {object} data - the original data object
 * @param {string} filteredData - the value that needs to be searched in the original data
 * @returns {number} - Returns the index where the current key and value is in original data
 */
var findOriginalIndex = function (data, filteredData) {
    return Object.keys(data).findIndex(function (el) {
        return data[el] === filteredData;
    });
};

/**
 * @description It will enable the reindex button in synonym
 */
var enableReindexButton = function () {
    $("#synonymReindex").removeAttr("disabled");
};

/**
 * @description It will disable the reindex button in synonym
 */
var disableReindexButton = function () {
    $("#synonymReindex").attr("disabled", "disabled");
};
/**
 * @description Empty the search input field
 */
function emptySearch() {
    $("#synonymSearch").val("");
}

/**
 * @description - To disable all the edit , delete and add button when user is inputting in anyone row
 * @param {boolean} disableState - The value of the disable state that need to be passes
 */
function changeButtonsDisableState(disableState) {
    $("#table2")
        .find("tr")
        .each(function () {
            var deleteButton = $(this).children("td").find("[data-type=delete]");
            var editButton = $(this).children("td").find("[data-type=edit]");
            if (deleteButton.length > 0) {
                deleteButton.attr("disabled", disableState);
            }
            if (editButton.length > 0 && editButton.first().attr("icon") === "edit") {
                editButton.attr("disabled", disableState);
            }
        });
    $("#synonym-button").attr("disabled", disableState);
}

/**
 * @description - Call the function when any check icon on any row is clicked to disable that row's input , show the delete icon, enable all the row CTA buttons and
 * change the check icon to edit icon
 * @param {DOMNode} editButton - The edit button whose properties needs to be changed
 * @param {*} deleteButton - The delete button whose properties needs to be changed
 * @param {*} inputElement - The input element which needs to be disabled
 */
function onCheckClicked(editButton, deleteButton, inputElement) {
    inputElement.attr("disabled", "disabled");
    editButton.first().attr("icon", "edit");
    deleteButton.removeAttr("disabled");
    deleteButton.attr("icon", "delete");
    changeButtonsDisableState(false);
    deleteButton.css("cursor", "pointer");
}

$(window).on("load", function () {
    var synonymData = {};
    var synonymTableBody = $("#table-body-2");
    var debounceTimer;
    var selectedIndex;
    var synonymDataCopy = {};
    var synonymDialog = document.querySelector("#synonymModal");
    var synonymToast = $("#snonymAlert");
    var toastTimer;
    var reindexButton = $("#synonymReindex");

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
        synonymToast.addClass("tool__toast--show");
        function removeToast() {
            synonymToast.removeClass("tool__toast--show");
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
        $("#synonym-button").removeAttr("disabled");
    }

    /**
     * @description Check the status of every AJAX call and if it's false show the error message sent from the server
     * @param {object} responseData - The data sent by the server. It contains data , message and status key
     */
    function checkAjaxStatus(responseData) {
        if (!responseData.status) {
            showAlert(responseData.message, false);
            return false;
        }
        return true;
    }

    /**
     * @description Function to be called on  initialization to load the data
     */
    function loadData() {
        $.ajax({
            url: SYNONYM_FETCH_DATA_URL(),
            type: "GET",
            error: function (xhr, ajaxOptions, thrownError) {
                synonymData = {};
                tableBodyData = noRecordFoundDueToServerIssue;
                synonymTableBody.append(tableBodyData);
                handleAjaxError(xhr, ajaxOptions, thrownError);
            },
            success: function (data) {
                synonymData = typeof data === DATA_TYPE_OBJECT ? data.data : JSON.parse(data.data);
                appendData(synonymData);
            },
        });
    }
    /** On Initial load do AJAX call to get the required data  Need to have setTimeout so that URL has selectedSiteIndex  */
    setTimeout(loadData, 0);

    function noIndexFoundCB() {
        synonymData = {};
        tableBodyData = noOakIndexConfigured;
        synonymTableBody.empty();
        synonymTableBody.append(tableBodyData);
    }

    $("#selectSite").on("change", function () {
        onSelectionChange(loadData, noIndexFoundCB);
        emptySearch();
    });

    /**
     * @description Handler to be called if needed to remove the whole row by doing an AJAX call and if it's success update the synonymData and rebuild the table
     * @param {number} index - The row number which needs to be deleted
     * @returns null
     */
    function removeIndex(index) {
        $.ajax({
            url: SYNONYM_REMOVE_URL() + index,
            type: "GET",
            error: handleAjaxError,
            success: function (data) {
                var responseData = typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                if (checkAjaxStatus(responseData)) {
                    synonymData = responseData.data;
                    showAlert(ROW_REMOVED_MESSAGE, true);
                    appendData(synonymData);
                    $("#synonymSearch").val("");
                    enableReindexButton();
                }
            },
        });
    }

    /**
     * @description It will debounce the search call till 500ms. So that no need to filter the data at every input. Filters the data and creates in to synonymDataCopy
     * @param {string} value - The string that needs to be searched
     */
    var debounceSearch = function (value) {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            if (!value) appendData(synonymData);
        }
        debounceTimer = setTimeout(function () {
            synonymDataCopy = JSON.parse(JSON.stringify(synonymData));
            searchIndex = Object.keys(synonymDataCopy).filter(function (el) {
                return synonymDataCopy[el].includes(value);
            });
            synonymDataCopy = searchIndex.map(function (el) {
                return synonymDataCopy[el];
            });
            appendData(synonymDataCopy);
        }, DEBOUNCE_TIMER);
    };

    /** Listener to listen when user is typing into search bar and sending that value to debounce search in lower case */
    $("#synonymSearch").on("input", function (e) {
        debounceSearch(e.target.value.toLowerCase());
    });

    /** Listener to listen to the clear button on the search bar. Clears synonymDataCopy variable and re creates the table  */
    $("#synonymSearch").on("coral-search:clear", function () {
        synonymDataCopy = {};
        appendData(synonymData);
    });

    /**
     * @description Handler to handle the click event when user interacts with the coral tag button
     * @param {object} e - Event object
     */
    function removeWord(e) {
        /** Respond to the click event if user click on the button or the coral icon child in the coral tag */
        if (["BUTTON", "CORAL-ICON"].includes(e.target.nodeName)) {
            var tagID = e.currentTarget.id.split("-");
            var lineNumber = parseInt(tagID[1]) + 1;
            var wordToBeDeleted = encodeURIComponent($(this).attr("value").trim());
            /** If user has searched some keywords and than editing than the lineNumber would differ from the original lineNumber so need to find out the original line number */
            if ($("#synonymSearch").val()) {
                lineNumber = findOriginalIndex(synonymData, synonymDataCopy[lineNumber - 1]) + 1;
            }
            if (synonymData[lineNumber].split(",").length === 1) {
                removeIndex(lineNumber);
            } else {
                $.ajax({
                    url: SYNONYM_REMOVE_URL() + lineNumber + "&word=" + wordToBeDeleted,
                    type: "GET",
                    error: handleAjaxError,
                    success: function (data) {
                        var responseData = typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                        if (checkAjaxStatus(responseData)) showAlert(wordToBeDeleted + " removed successfully", true);
                        synonymData[lineNumber] = responseData.data[lineNumber];
                        if ($("#synonymSearch").val()) {
                            var filteredLineNumber = parseInt(tagID[1]);
                            synonymDataCopy[filteredLineNumber] = responseData.data[lineNumber];
                        }
                        enableReindexButton();
                    },
                });
            }
        }
    }

    /**
     * @description Handler to handle the event when user clicks on the add button
     */
    function addWord() {
        var input = $("#synonym-input").val();
        if (input) {
            if (input.includes(" ")) {
                showAlert("Please enter one word only", false);
            } else if (input.includes("-")) {
                showAlert("Please enter word without hyphen", false);
            } else {
                if (!checkIfWordExists(synonymData, input)) {
                    $("#synonym-button").attr("disabled", "disabled");
                    $.ajax({
                        url: SYNONYM_ADD_URL() + encodeURIComponent(input.trim()),
                        type: "GET",
                        error: handleAjaxError,
                        success: function (data) {
                            var responseData = typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                            if (checkAjaxStatus(responseData)) {
                                synonymData = data.data;
                                showAlert(input + " added successfully", true);
                                /** Create a new table only so that all listeners are added */
                                appendData(synonymData);
                                $("#synonym-input").val("");
                                enableReindexButton();
                                emptySearch();
                                $("#synonym-button").removeAttr("disabled");
                            } else {
                                $("#synonym-button").removeAttr("disabled");
                            }
                        },
                    });
                } else {
                    $("#synonym-input").val("");
                    showAlert(input + " word already exists", false);
                }
            }
        } else {
            showAlert("Please enter a value", false);
        }
    }

    /**
     * @description Handler to handle the click event when delete button is clicked on the modal. Call the removeIndex function and remove the search input and hide the modal
     */
    function onDeleteHandler() {
        removeIndex(selectedIndex);
        $("#synonymSearch").val("");
        synonymDialog.hide();
    }

    /**
     * @description Handler to handle the reindex button click event by making the reindex ajax call. If successful showing success alert or else showing error alert
     */
    function reindexHandler() {
        $.ajax({
            url: REINDEX_URL(),
            type: "GET",
            error: handleAjaxError,
            success: function (data) {
                var responseData = typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                if (checkAjaxStatus(responseData)) {
                    showAlert("Reindex done successfully", true);
                    disableReindexButton();
                }
            },
        });
    }

    /**
     * @description Handler to handle the click event when user clicks on the trash icon
     * @param index The index which needs to be selected
     */
    function trashButtonHandler(index) {
        synonymDialog.show();
        if ($("#synonymSearch").val()) {
            selectedIndex = findOriginalIndex(synonymData, synonymDataCopy[index - 1]) + 1;
        } else selectedIndex = index;
    }

    /**
     * @description Append data will append the data in the table body if there's any data orelse it will show no record found
     * @param {object} data - The object that needs to be appended in the table body
     */
    var appendData = function (data) {
        console.time("Synonym DOM Paint time");
        synonymTableBody.empty();
        var tableBodyData = "";
        if (Array.isArray(data).length === 0 || Object.keys(data).length === 0) {
            synonymTableBody.append(noRecordFound);
        } else {
            Object.keys(data).forEach(function (el, index) {
                tableBodyData += createRow(data[el], index);
            });
            synonymTableBody.append(tableBodyData);
            changeButtonsDisableState(false);
            /**On each coral tag add listener so if user clicks on the cancel button ajax call can be made */
            $("coral-tag").each(function () {
                $(this).on("click", removeWord);
            });

            /** Add event listener to the button of table 2 only */
            $("#table2")
                .find("tr")
                .each(function (i) {
                    var inputElem = $(this).children("td").find("input");
                    var deleteButton = $(this).children("td").find("[data-type=delete]");
                    var editButton = $(this).children("td").find("[data-type=edit]");

                    if (deleteButton.length > 0) {
                        $(deleteButton.first()).on("click", function () {
                            trashButtonHandler(i);
                        });
                    }
                    if (editButton.length > 0) {
                        $(editButton.first()).on("click", function (e) {
                            var inputElement = $("#inputRow" + (i - 1));
                            /** If edit button has edit icon , enable the input , remove the delete icon and disable it */
                            var deleteButton = editButton.parent().next().children();
                            if (editButton.first().attr("icon") === "edit") {
                                inputElement.removeAttr("disabled");
                                inputElement.focus();
                                editButton.first().attr("icon", "check");
                                deleteButton.attr("disabled", "disabled");
                                deleteButton.attr("icon", "");
                                changeButtonsDisableState(true);
                                deleteButton.css("cursor", "inherit");
                            } else {
                                /** When check mark button is clicked check if there's input.If no input just revert the icons back. If there's input check if same word exists
                                 * and if search bar is on find it's real index value and if all conditions pass than make ajax call to add the word
                                 */
                                if (inputElement.val().trim().length > 0) {
                                    var inputElementValue = inputElement.val();
                                    var indexValue = i;
                                    if ($("#synonymSearch").val()) {
                                        indexValue = findOriginalIndex(synonymData, synonymDataCopy[i - 1]) + 1;
                                    }
                                    if (inputElementValue.includes(" ")) {
                                        showAlert("Please enter word without space", false);
                                    } else if (checkIfWordExists(synonymData, inputElementValue)) {
                                        showAlert(inputElementValue + " word already exists", false);
                                        inputElement.val("");
                                        onCheckClicked(editButton, deleteButton, inputElement);
                                    } else if (inputElementValue.includes("-")) {
                                        showAlert("Please enter word without hyphen", false);
                                    } else {
                                        inputElement.attr("disabled", "disabled");
                                        $.ajax({
                                            url:
                                                SYNONYM_ADD_URL() +
                                                encodeURIComponent(inputElementValue.trim()) +
                                                "&id=" +
                                                indexValue,
                                            type: "GET",
                                            error: function (xhr, ajaxOptions, thrownError) {
                                                handleAjaxError(xhr, ajaxOptions, thrownError);
                                                $(inputElem.first()).removeAttr("disabled");
                                            },
                                            success: function (data) {
                                                var responseData =
                                                    typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                                                if (checkAjaxStatus(responseData)) {
                                                    if ($("#synonymSearch").val())
                                                        synonymDataCopy[i - 1] = responseData.data[indexValue];
                                                    enableReindexButton();
                                                    synonymData[indexValue] = responseData.data[indexValue];
                                                    var tag = createTag(
                                                        inputElement.val(),
                                                        i - 1,
                                                        synonymData[indexValue].split(",").length
                                                    );

                                                    $(tag).insertBefore(inputElement);
                                                    var tagId =
                                                        "#tag-" +
                                                        (i - 1) +
                                                        "-" +
                                                        synonymData[indexValue].split(",").length;

                                                    $(tagId).on("click", removeWord);
                                                    showAlert(inputElement.val() + " added successfully", true);
                                                    inputElement.val("");
                                                    onCheckClicked(editButton, deleteButton, inputElement);
                                                }
                                            },
                                        });
                                    }
                                } else {
                                    onCheckClicked(editButton, deleteButton, inputElement);
                                }
                            }
                        });
                    }
                    /** Add keyup listener on the input field to save the word when user presses space */
                    if (inputElem.length > 0) {
                        $(inputElem.first()).keyup(function (e) {
                            // 13 is for enter
                            if (e.which === 32 && e.target.value) {
                                if (e.target.value.trim().length > 0) {
                                    var indexValue = i;
                                    if ($("#synonymSearch").val()) {
                                        indexValue = findOriginalIndex(synonymData, synonymDataCopy[i - 1]) + 1;
                                    }
                                    if (e.target.value.indexOf(" ") + 1 !== e.target.value.length) {
                                        showAlert("Please enter word without space", false);
                                    } else if (checkIfWordExists(synonymData, e.target.value.trim())) {
                                        showAlert(e.target.value + " word already exists", false);
                                        inputElem.first().val("");
                                        inputElem.first().focus();
                                    } else if (e.target.value.includes("-")) {
                                        showAlert("Please enter word without hyphen", false);
                                    } else {
                                        var inputElement = inputElem.first();
                                        $(inputElement).attr("disabled", "disabled");
                                        $.ajax({
                                            url:
                                                SYNONYM_ADD_URL() +
                                                encodeURIComponent(e.target.value.trim()) +
                                                "&id=" +
                                                indexValue,
                                            type: "GET",
                                            error: function (xhr, ajaxOptions, thrownError) {
                                                handleAjaxError(xhr, ajaxOptions, thrownError);
                                                $(inputElement).removeAttr("disabled");
                                            },
                                            success: function (data) {
                                                var responseData =
                                                    typeof data === DATA_TYPE_OBJECT ? data : JSON.parse(data);
                                                if (checkAjaxStatus(responseData)) {
                                                    if ($("#synonymSearch").val())
                                                        synonymDataCopy[i - 1] = responseData.data[indexValue];
                                                    var tag = createTag(
                                                        e.target.value,
                                                        i - 1,
                                                        synonymData[i].split(",").length
                                                    );
                                                    $(tag).insertBefore("#" + e.target.id);
                                                    var tagId =
                                                        "#tag-" + (i - 1) + "-" + synonymData[i].split(",").length;
                                                    enableReindexButton();
                                                    $(tagId).on("click", removeWord);
                                                    showAlert(e.target.value + " added successfully", true);
                                                    $(inputElement).val("");
                                                    synonymData[indexValue] = responseData.data[indexValue];
                                                    $(inputElement).removeAttr("disabled");
                                                    $(inputElement).focus();
                                                } else {
                                                    $(inputElement).removeAttr("disabled");
                                                    $(inputElement).focus();
                                                }
                                            },
                                        });
                                    }
                                } else $(inputElem.first()).val("");
                            }
                        });
                    }
                });
        }
        console.timeEnd("Synonym DOM Paint time");
    };

    /** Listener to listen the click event on add button */
    $("#synonym-button").on("click", addWord);

    /** Listener to listen the delete event on the delete button in the modal */
    synonymDialog.on("click", "#deleteSynonym", onDeleteHandler);

    /** Listener to listen to the reindex button click event */
    reindexButton.on("click", reindexHandler);

    /**Listener to listen to the enter key on the input box */
    $("#synonym-input").on("keyup", function (e) {
        if (e.which === 13 && e.target.value) {
            if (!$("#synonym-button").attr("disabled")) addWord();
        }
    });
});
