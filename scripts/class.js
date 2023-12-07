class LotObject{
    constructor(lotData) {

        // Get arrays from lotData json
        this.objects = lotData.house.objects;
        this.lotSize = parseInt(lotData.house.size);
        
        // Parse floor
        this.floors = this.parseFloor(lotData.house.world.floors.floor);
        this.floorCount = this.getStoryCount(this.floors);
        console.log(this.floors)

        // Parse wall
        this.walls = this.parseWall(lotData.house.world.walls.wall);
        console.log(this.walls);

        this.lotRenderer = new LotRenderer(this);
        // Next, build compressed list of every wall coordinate pair, floor coordinate and id, object coordinate and id
    }

    //#region Floor
    parseFloor(floorList) {

        let floorObjects = new Array();
        for (let i = 0; i < floorList.length; i++) floorObjects.push(new Floor(floorList[i]));
        return floorObjects;
    }

    getStoryCount(floors) {

        let maxFloor = 0;
        for (let i = 0; i < floors.length; i++) if (floors[i].level > maxFloor) maxFloor = floors[i].level;
        return maxFloor + 1;
    }
    //#endregion

    //#region Walls
    parseWall(wallList) {

        let wallObjects = new Array();
        for (let i = 0; i < wallList.length; i++) wallObjects.push(new Wall(wallList[i]));
        return wallObjects;
    }
    //#endregion
}

class LotRenderer{
    constructor(lotObject) {

        // Static variables
        this.canvas = document.getElementById("lot-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.tileSize = 24;
        this.sourceTileSize = 27;

        // Buildable variables
        this.tileList = this.ripTilesFromTileSheet();

        // Settable variables
        this.lotObject = lotObject;

        this.setCanvasSize();
        this.drawFloors();
        //this.testSpriteSheet();
    }

    //#region Draw functions
    setCanvasSize() {

        this.canvas.width = this.tileSize * this.lotObject.lotSize;
        this.canvas.height = this.tileSize * this.lotObject.lotSize;
    }

    drawFloors() {

        for (let i = 0; i < this.lotObject.floors.length; i++) {
            
            let floor = this.lotObject.floors[i];

            let floorSpriteIndex = FLOOR_KVP[floor.value];
            console.log(floor.value, floorSpriteIndex);
            let drawX = floor.x * this.tileSize;
            let drawY = floor.y * this.tileSize;

            this.ctx.drawImage(this.tileList[floorSpriteIndex], drawX, drawY);
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
    drawTest() {

        for (let x = 0; x < this.lotSize; x++) {
            for (let y = 0; y < this.lotSize; y++) {

                let xPos = x * this.tileSize;
                let yPos = y * this.tileSize;

                this.ctx.fillStyle = ((x + y) % 2 == 1) ? "gray" : "white";
                this.ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);
            }
        }
    }

    testSpriteSheet() {

        for (let i = 0; i < this.tileList.length; i++) {

            let drawX = (i % 16) * this.tileSize;
            let drawY = Math.floor(i / 16) * this.tileSize;

            this.ctx.drawImage(this.tileList[i], drawX, drawY);
        }
    }
    //#endregion
}


class Floor{
    constructor(floorData) {

        this.level = parseInt(floorData._level);
        this.x = parseInt(floorData._x);
        this.y = parseInt(floorData._y);
        this.value = parseInt(floorData._value);
    }
}

class Wall{
    constructor(wallData) {

        this.segments = wallData.Segments.split(" ");
        this.segmentLength = parseInt(wallData._segments);

        this.level = parseInt(wallData._level);
        this.placement = parseInt(wallData._placement);

        this.x = parseInt(wallData._x);
        this.y = parseInt(wallData._y);
        
        this.wallDecor = {
            
            // Diagonal floor segments
            tls: parseInt(wallData._tls),
            trs: parseInt(wallData._trs),

            // Wallpaper
            tlp: parseInt(wallData._tlp),
            trp: parseInt(wallData._trp),

            // Has door?
            blp: parseInt(wallData._blp),
            brp: parseInt(wallData._brp),
        }
    }
}
