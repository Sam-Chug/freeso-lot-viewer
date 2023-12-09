var lotDataHolder;

window.addEventListener("DOMContentLoaded", async e => {

    console.time("Loading images");
    await loadUtils.loadAllImages();
    console.timeEnd("Loading images");

    console.log("Starting Lot Viewer");
    lotViewerMain.start();
});

lotViewerMain = function() {

    function start() {
        
    }

    return {
        start: start
    }
}();