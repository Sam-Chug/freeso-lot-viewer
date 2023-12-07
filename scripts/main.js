window.addEventListener("DOMContentLoaded", function() {

    lotViewerMain.start();
});

lotViewerMain = function() {

    function start() {

        console.log("Starting Lot Viewer");
    }

    return {
        start: start
    }
}();