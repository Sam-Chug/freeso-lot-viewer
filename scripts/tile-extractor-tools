// This is all deprecated, but it helped rip a spritesheet of all floors, rotated from isometric to top-down square

// const TILE_IMAGES = [
//     new Image().src = `./images/floor-tiles/floor-page-1.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-2.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-3.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-4.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-5.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-6.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-7.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-8.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-9.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-10.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-11.bmp`,
//     new Image().src = `./images/floor-tiles/floor-page-12.bmp`,
// ];

class TileExtractor{
    constructor() {

        this.tileImages = new Array();
        this.cutImages();

        for (let i = 0; i < this.tileImages.length; i++) {

            this.rotateTile(this.tileImages[i]);
        }

        this.drawRotatedTiles();
    }

    drawRotatedTiles() {

        let realCanvas = document.getElementById("lot-canvas");
        let realCtx = realCanvas.getContext("2d");

        realCanvas.width = 1500;
        realCanvas.height = 1500;

        for (let i = 0; i < this.tileImages.length; i++) {

            let x = (i % 12) * 27;
            let y = Math.floor(i / 12) * 27;

            realCtx.drawImage(this.tileImages[i], x, y);
        }
    }

    cutImages() {

        for (let i = 0; i < 12; i++) {

            let x = 2;
            let y = 11;

            for (let j = 0; j < 2; j++) {

                for (let k = 0; k < 10; k++) {

                    let tileCanvas = new OffscreenCanvas(39, 39);
                    let tileCtx = tileCanvas.getContext("2d");
                    tileCtx.drawImage(TILE_SHEETS[i], x, y, 37, 18, 0, 0, 39, 39);
                    this.tileImages.push(tileCanvas);
                    x += 45;
                }
                x = 2;
                y += 45;
            }
        }
    }

    rotateTile(tileCanvas) {

        let tempCanvas = new OffscreenCanvas(39, 39);
        let tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(tileCanvas, 0, 0);

        let tileCtx = tileCanvas.getContext("2d");
        tileCanvas

        tempCtx.save();
        tempCtx.translate(tileCanvas.width / 2, tileCanvas.height / 2);
        tempCtx.rotate(-45 * Math.PI / 180);
        tempCtx.translate(-tileCanvas.width / 2, -tileCanvas.height / 2);
        tempCtx.drawImage(tileCanvas, 0, 0);
        tempCtx.restore();

        tileCanvas.width = 27;
        tileCanvas.height = 27;
        tileCtx.drawImage(tempCanvas, 6.5, 6.5, 27, 27, 0, 0, 27, 27);
    }
}

const TILE_SHEETS = new Array();

class TileLoader{
    constructor() {

        this.loadTileSheets(0);
    }

    loadTileSheets(tileNum) {

        if (tileNum > 11) {

            console.log("tile sheets loaded");
            return;
        }

        let tileSheet = new Image();
        tileSheet.onload = function() {

            TILE_SHEETS.push(tileSheet);
            tileLoader.loadTileSheets(tileNum + 1);
        }
        tileSheet.src = `./images/floor-tiles/floor-page-${tileNum + 1}.bmp`;
    }
}