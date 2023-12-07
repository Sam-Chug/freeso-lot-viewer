class LotObject{
    constructor(lotData) {

        // Get arrays from lotData json
        this.objects = lotData.house.objects;
        this.walls = lotData.house.world.walls;

        this.floors = lotData.house.world.floors.floor;
        this.floorCount = this.getFloorCount(this.floors);

        // Next, build compressed list of every wall coordinate pair, floor coordinate and id, object coordinate and id
    }

    getFloorCount(floors) {

        let maxFloor = 0;
        for (let i = 0; i < floors.length; i++) {

            let floor = parseInt(floors[i]._level);
            if (floor > maxFloor) maxFloor = floor;
        }
        return maxFloor + 1;
    }
}

class LotCanvas{
    constructor() {

        // Static variables
        this.canvas = document.getElementById("lot-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.tileSize = 24;
        this.lotSize = 64 + 2;

        this.sourceTileSize = 27;

        // Buildable variables
        this.tileList = this.ripTilesFromTileSheet();

        this.setCanvasSize();
        //this.testSpriteSheet();
        //this.draw();
    }

    //#region Draw functions
    setCanvasSize() {

        this.canvas.width = this.tileSize * this.lotSize;
        this.canvas.height = this.tileSize * this.lotSize;
    }

    draw() {

        for (let x = 0; x < this.lotSize; x++) {
            for (let y = 0; y < this.lotSize; y++) {

                let xPos = x * this.tileSize;
                let yPos = y * this.tileSize;

                this.ctx.fillStyle = ((x + y) % 2 == 1) ? "gray" : "white";
                this.ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);
            }
        }
    }
    //#endregion

    //#region Build sprite variables
    ripTilesFromTileSheet() {

        // Build array of tile canvi
        let sourceX = 0, sourceY = 0;
        let tileSheet = new Array();
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 12; x++) {

                let canvas = document.createElement("canvas");
                canvas.width = this.tileSize;
                canvas.height = this.tileSize;

                let ctx = canvas.getContext("2d");
                ctx.drawImage(SPRITESHEET_FLOOR, sourceX, sourceY, this.sourceTileSize, this.sourceTileSize, 0, 0, this.tileSize, this.tileSize);
                tileSheet.push(canvas);

                sourceX += this.sourceTileSize;
            }
            sourceX = 0;
            sourceY += this.sourceTileSize;
        }
        return tileSheet;
    }
    //#endregion

    //#region Test functions
    testSpriteSheet() {

        for (let i = 0; i < this.tileList.length; i++) {

            let drawX = (i % 16) * this.tileSize;
            let drawY = Math.floor(i / 16) * this.tileSize;

            this.ctx.drawImage(this.tileList[i], drawX, drawY);
        }
    }
    //#endregion
}

