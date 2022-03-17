var hasSearchClass;
var timer = null;
var searchArray = JSON.parse(localStorage.getItem('searchItems')) || [];

var currentFocus = -1;

// $(document).ready(function () {
//     setTimeout(function(){
//         $('.fadein_navbar').css('animation', 'none');
//         $('.navbar-nav-header').css('opacity', '1');
//      },500)
    
// });



$(window).on('load', function () {
    hasSearchClass = document.getElementsByClassName('search-results-page');
    hasSearchClass = hasSearchClass.length;
    // When user click on back or forward button from browser
    window.onpopstate = function () {
        if (hasSearchClass > 0) {
            var searchParams = new URLSearchParams(window.location.search);
            var text = searchParams.get("q");
            window.PacLife.Search.getResults(text);
        }
    };
});

/*execute the function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    if (hasSearchClass > 0) {
        var width = $(window).width();
        var searchBarDesktop = 1139;
        if (e.target.classList.contains("search-results-page") || e.target.classList.contains("search-results-page-subtitle") || e.target.classList.contains("search-header")) {
            if (width < searchBarDesktop) {
                var result = $('.search-nav-close-icon').hasClass('collapsed');
                if (!result) {
                    $('.search-nav-close-icon').click();
                }
            }
            else {
                var result = $('#historySearchItemsList').hasClass('d-none');
                if (!result) {
                    $('.showNavbar').click();
                }
            }
        }
    }
});


/*execute a function presses a key on the keyboard:*/
$(".inputValueSearch").keydown(function (e) {

    var x = document.getElementById("historySearchItemsList");
    var y = document.getElementById("historySearchItemsList");
    if (x) x = x.getElementsByTagName("li");
    if (y) y = y.getElementsByClassName("text-filter");

    if (e.keyCode === 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
        document.getElementById('inputSearchValue').value = y[currentFocus].innerHTML;
    }
    else if (e.keyCode == 38) { 
        e.preventDefault();
        //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        document.getElementById('inputSearchValue').value = y[currentFocus].innerHTML;
    }
    /*If the ENTER key is pressed, prevent the form from being submitted,*/
    else if (e.keyCode == 13) {
        e.preventDefault();
        var searchText = document.getElementById('inputSearchValue').value.toLowerCase();
        searchText = searchText.trim();
        var searchrootpath = $('#searchNavCollapse').data('searchrootpath');

        if (searchText !== "") {
            if (searchArray.indexOf(searchText) === -1) {
                searchArray.unshift(searchText);
                localStorage.setItem('searchItems', JSON.stringify(searchArray));
            }

        }
        if (hasSearchClass > 0) {
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
            else {
                if (searchText !== "") {
                    window.PacLife.Search.getResults(searchText);
                    if (history.pushState) {
                        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q=' + searchText;
                        window.history.pushState({ path: newurl }, '', newurl);
                    }
                }
                else {
                    if (history.pushState) {
                        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                        window.history.pushState({ path: newurl }, '', newurl);
                        window.PacLife.Search.getResults(searchText);

                    }
                }
            }
            // $('.searchItem').addClass('d-none');
            // $('.showNavbar').click();
            var width = $(window).width();
            var searchBarDesktop = 1139;
            if(width < searchBarDesktop){
                var result = $('.search-nav-close-icon').hasClass('collapsed');
                if (!result) {
                    $('.search-nav-close-icon').click();
                }
            }
            else{
                var hasShowClass = $('#searchNavCollapse').hasClass('show');
                if(hasShowClass){
                    $('.showNavbar').click();
                }
            }

        }
        else {
            window.location.href = searchrootpath + '.html?q=' + searchText;

        }

    }

});

// Execute when user click the submit button in desktop

$('.searchSubmit').click(function (e) {

    var searchrootpath = $('#searchNavCollapse').data('searchrootpath');

    var searchText = document.getElementById('inputSearchValue').value.toLowerCase();
    searchText = searchText.trim();
    if (searchArray.indexOf(searchText) === -1) {
        searchArray.unshift(searchText);
        localStorage.setItem('searchItems', JSON.stringify(searchArray));
    }
    setRedirectPage(searchText);
});
// // Execute when user click the submit button in mobile

$('.searchSubmit-mb').click(function (e) {
    var searchrootpath = $('#searchNavCollapse').data('searchrootpath');

    var searchText = document.getElementById('inputSearchValue').value.toLowerCase();
    searchText = searchText.trim();
    if (searchArray.indexOf(searchText) === -1) {
        searchArray.unshift(searchText);
        localStorage.setItem('searchItems', JSON.stringify(searchArray));
    }
    setRedirectPage(searchText);
});


$('.inputValueSearch').on('focus', function (e) {
    $('.searchItem').removeClass('d-none');

    if (searchArray.length > 5) {
        searchArray.pop()
    }
    var text = $('.inputValueSearch').val();
    var searchItems = '';
    var searchItemsList = [];

    // Will set the history list for the search 
    for (var i = 0; i < searchArray.length; i++) {
        if (searchArray[i]) {
            searchItems +=

                '<li data-item=' + searchArray[i].split(' ').join('_') + ' class="list-group-item search-group-item">'
                + '<span data-item=' + searchArray[i].split(' ').join('_') + ' class="material-icons history-icon mr-2 ">history</span>'
                + '<span class="text-filter" data-item=' + searchArray[i].split(' ').join('_') + '>' + searchArray[i] + '</span>'
                + '<span data-item=' + searchArray[i].split(' ').join('_') + ' class="material-icons search-icon-clear">clear</span></li>';
        }
    }

    searchItemsList.unshift(searchItems);
    $('.historySearchItems').empty();
    $('.historySearchItems').append(searchItemsList);
    $('.inputValueSearch').keydown();
    $('.historySearchItems').find('.search-group-item').each(function (i) {
        $(this).on("click", function (e) {
             // Exceute when user click on cross symbol to delete history
            if (e.target.innerHTML === 'clear') {
                var value = e.target.dataset.item.toString();
                value = value.split('_').join(' ');
                var index = searchArray.indexOf(value);
                if (index > -1) {
                    searchArray.splice(index, 1);
                }
                var searchItems = '';
                var searchItemsList = [];

                //Will set the updated history 

                for (var i = 0; i < searchArray.length; i++) {
                    if (searchArray[i]) {
                        searchItems +=
                            '<li data-item=' + searchArray[i].split(' ').join('_') + ' class="list-group-item search-group-item">'
                            + '<span data-item=' + searchArray[i].split(' ').join('_') + ' class="material-icons history-icon search-icon-history mr-2 ">history</span>'
                            + '<span class="text-filter" data-item=' + searchArray[i].split(' ').join('_') + '>' + searchArray[i] + '</span>'
                            + '<span data-item=' + searchArray[i].split(' ').join('_') + ' class="material-icons search-icon-clear">clear</span></li>';
                    }
                }

                searchItemsList.unshift(searchItems);
                $('.historySearchItems').empty();
                $('.historySearchItems').append(searchItemsList);
                localStorage.setItem('searchItems', JSON.stringify(searchArray));
                document.getElementById("inputSearchValue").focus();
            }
            else {

                // Select history from dropdown 

                var searchText = e.target.dataset.item.toString();
                searchText = searchText.split('_').join(' ');
                setHistorySearchData(searchText);
            }
        })
    })



});

$('.inputValueSearch').on('input', async function () {
    var text = $('.inputValueSearch').val();
    var resourcepath = $('#searchNavCollapse').data('resourcepath');
    var searchrootpath = $('#searchNavCollapse').data('searchrootpath');
    if (text.length === 0) {
        $(".inputValueSearch").focus();
        clearTimeout(timer);
    }
    else if (text.length >= 3) {
        $('.searchItem').removeClass('d-none');
        debounce(text, resourcepath, searchrootpath, 300);
    }
    else{
        $('.searchItem').addClass('d-none');
        $('.historySearchItems').empty();
        clearTimeout(timer);
    }
});


/**
 * @description - Will rediect the page if user is not on search result page otherwise it will call the ajax function 
 *                to get the data
 * @param {String} searchText - Text for search 
 */

function setRedirectPage(searchText) {
    searchText = searchText.trim();
    var searchrootpath = $('#searchNavCollapse').data('searchrootpath');
    if (hasSearchClass > 0) {
        if (searchText !== "") {
            window.PacLife.Search.getResults(searchText);
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q=' + searchText;
                window.history.pushState({ path: newurl }, '', newurl);
            }
        }
        else {
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.pushState({ path: newurl }, '', newurl);
                window.PacLife.Search.getResults(searchText);
            }
        }
        $('.showNavbar').click();
        $('.search-nav-close-icon').click();
    }
    else {
        window.location.href = searchrootpath + '.html?q=' + searchText;
    }

}

/**
 * @description - Will call the ajax function after the delay to perform debouncing 
 * @param {String} text - Word for search
 * @param {String} resourcepath - API path for search result 
 * @param {String} searchrootpath - search path
 * @param {Number} delay - delay for for the function call
 */

var debounce = function (text, resourcepath, searchrootpath, delay) {
    if (timer) {
        clearTimeout(timer);
        timer = setTimeout(
            function () {
                doAjax(text, resourcepath, searchrootpath)
            }, delay);
    }
    else {
        timer = setTimeout(function () {
            doAjax(text, resourcepath, searchrootpath)
        }, delay);
    }
}


/**
 * @description - Will Generate the auto suggestions for the search word
 * @param {String} text - Word for search
 * @param {String} resourcepath - API path for search result 
 * @param {String} searchrootpath - search path
 * 
 */
function doAjax(text, resourcepath, searchrootpath) {
    var filterArray = [];
    $.ajax({
        type: 'GET',
        url: '/bin/paclife/autosuggestions.json',
        data: { q: text, searchPaths: searchrootpath },
        success: function (data) {
            filterArray = data.suggestions;
            var searchItems = '';
            var searchItemsList = [];
            for (var i = 0; i < filterArray.length; i++) {
                if (filterArray[i]) {
                    searchItems +=
                        '<li data-item=' + filterArray[i] + ' class="list-group-item search-group-item">'
                        + '<span data-item=' + filterArray[i] + ' class="material-icons search-icon-nav mr-2 ">search</span>'
                        + '<span class="text-filter" data-item=' + filterArray[i] + '>' + filterArray[i] + '</span></li>';
                }
            }
            searchItemsList.unshift(searchItems);
            $('.historySearchItems').empty();
            $('.historySearchItems').append(searchItemsList);

            $('.historySearchItems').find('.search-group-item').each(function (i) {
                $(this).on("click", function (e) {
                    var searchText = e.target.dataset.item.toString();
                    searchText = searchText.split('_').join(' ');
                    $('.historySearchItems').empty();
                    document.getElementById('inputSearchValue').value = '';


                    setHistorySearchData(searchText);
                })
            })

        }

    });

}

/**
 * @description - will add the active class for the current item
 * @param {Object} x - refer the current item
 * 
 */

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "search-active":*/

    x[currentFocus].classList.add("search-active");
}

/**
 * @description - a function to remove the "active" class from all autocomplete items
 * @param {Object} x -  refer the current item
 */

function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("search-active");
    }
}


/**
 * @description - Will set the history in localstorage and set the url accordingly
 * @param {String} searchText - Word in text box OR word for search 
 */
function setHistorySearchData(searchText) {
    var searchrootpath = $('#searchNavCollapse').data('searchrootpath');
    searchText = searchText.trim();

    if (hasSearchClass > 0) {
        window.PacLife.Search.getResults(searchText);
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q=' + searchText;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        $('.showNavbar').click();
        $('.search-nav-close-icon').click();
    }
    else {
        window.location.href = searchrootpath + '.html?q=' + searchText;
    }

    if (searchArray.indexOf(searchText) === -1) {
        searchArray.unshift(searchText);
        localStorage.setItem('searchItems', JSON.stringify(searchArray));
    }
    $('.searchItem').addClass('d-none');
}


$(function () {
    var width = $(window).width();
    var searchBarDesktop = 1139;

    if (width < searchBarDesktop) {
        $(".desktopNav").remove();
    }
    else {
        $(".mobileNav").remove();
    }
    $('.navTopToggle').click(function (e) {

        var classExist = $('.search-nav-toggle-btn').is('.search-nav-toggle-btn', '.collapsed');
        if (classExist) {
            $(".cmp-navigation__group").addClass('hideNavbar');
            $("#searchNavCollapse.desktopNav").removeClass('close-container');
            $("#searchNavCollapse.desktopNav").addClass('open-container');
            document.getElementById("inputSearchValue").focus();
            $('.historySearchItems').addClass('open-searchlist');
            $('.searchItem').removeClass('d-none');
            currentFocus = -1;
        }
    });
    $('.showNavbar').click(function (e) {
        var classExist = $('.search-nav-toggle-btn').is('.search-nav-toggle-btn');
        if (classExist) {
            $("#searchNavCollapse.desktopNav").addClass('close-container');
            setTimeout(function () {
                $("#searchNavCollapse.desktopNav").removeClass('open-container');
            }, 600);
            $(".cmp-navigation__group").removeClass('hideNavbar');
            currentFocus = -1;

        }
        $('.inputValueSearch').val('');
        $('.searchItem').addClass('d-none');
        $('.historySearchItems').removeClass('open-searchlist');
        $('.historySearchItems').empty();
    });
    $('.plcorp-mobile-menu-btn').click(function (e) {
        var classExistForClose = $('.plcorp-mobile-menu-btn').is('.collapsed');
        if (classExistForClose) {
            $("body,html").addClass('overflow-body-class');
            $(".topnav").addClass('height-navbar');
        }
        else {
            $("body,html").removeClass('overflow-body-class');
            $(".topnav").removeClass('height-navbar');
        }
    });
    $('.search-nav-close-icon').click(function (e) {
        $("body,html").removeClass('overflow-body-class');
    });
    $('.search-nav-toggle-btn').click(function (e) {
        $("body,html").removeClass('overflow-body-class');
        $('html, body').animate({ scrollTop: 0 }, '300');
    });

    $('.search-nav-toggle-btn ').click(function (e) {
        $("#searchNavCollapse.mobileNav").addClass('open-container');
    });
    $('.search-nav-close-icon').click(function (e) {
        $("#searchNavCollapse.mobileNav").removeClass('open-container');

    });

});
