var lotDataHolder;

window.addEventListener("DOMContentLoaded", async e => {

    await loadUtils.loadAllImages();
    lotViewerMain.start();
});

lotViewerMain = function() {

    function start() {

        console.log("Starting Lot Viewer");
        let lotCanvas = new LotCanvas();
    }

    return {
        start: start
    }
}();