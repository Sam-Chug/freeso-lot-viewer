class LotObject{
    constructor(lotData) {

        // Parse lot construction
        this.lotSize = parseInt(lotData.house.size);
        this.furnitureData = this.parseObject(lotData.house.objects.object);
        this.floorData = this.parseFloor(lotData.house.world.floors.floor);
        this.wallData = this.parseWall(lotData.house.world.walls.wall);
        
        // Separate stories
        this.storyCount = this.getStoryCount(this.floorData, this.wallData, this.furnitureData);
        this.stories = new Array(this.storyCount);
        for (let i = 0; i < this.storyCount; i++) this.stories[i] = new LotStory();
        this.separateFloors();

        // Send lot data to lot renderer
        this.lotRenderer = new LotRenderer(this);

        // Debug lot object
        console.log(this, lotData);
    }

    //#region Parse lot object
    parseFloor(floorList) {

        let floorObjects = new Array();
        if (!Array.isArray(floorList)) return floorObjects;
        for (let i = 0; i < floorList.length; i++) floorObjects.push(new Floor(floorList[i]));
        return floorObjects;
    }

    parseWall(wallList) {

        let wallObjects = new Array();
        if (!Array.isArray(wallList)) return wallObjects;
        for (let i = 0; i < wallList.length; i++) wallObjects.push(new Wall(wallList[i]));
        return wallObjects;
    }

    parseObject(furnitureList) {

        let furnitureObjects = new Array();
        if (!Array.isArray(furnitureList)) return furnitureObjects;
        for (let i = 0; i < furnitureList.length; i++) furnitureObjects.push(new Furniture(furnitureList[i]));
        return furnitureObjects;
    }

    getStoryCount(floors, walls, furniture) {

        let maxFloor = 0;
        for (let i = 0; i < floors.length; i++) if (floors[i].level > maxFloor) maxFloor = floors[i].level;
        for (let i = 0; i < walls.length; i++) if (walls[i].level > maxFloor) maxFloor = walls[i].level;
        for (let i = 0; i < furniture.length; i++) if (furniture[i].level > maxFloor) maxFloor = furniture[i].level;
        return maxFloor + 1;
    }

    separateFloors() {

        for (let i = 0; i < this.floorData.length; i++) {

            let floor = this.floorData[i];
            this.stories[floor.level].floors.push(floor);
        }

        for (let i = 0; i < this.wallData.length; i++) {

            let wall = this.wallData[i];
            this.stories[wall.level].walls.push(wall);
        }

        for (let i = 0; i < this.furnitureData.length; i++) {

            let object = this.furnitureData[i];
            this.stories[object.level].objects.push(object);
        }
    }
    //#endregion
}

class LotRenderer{
    constructor(lotObject) {

        // TODO: Create array of canvi for each floor

        // Static variables
        this.canvas = document.getElementById("lot-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.tileSize = TILE_SIZE;
        this.sourceTileSize = TILE_SIZE;

        // Buildable variables
        this.tileList = this.ripTilesFromTileSheet();

        // Settable variables
        this.lotObject = lotObject;

        // Draw lot
        console.time("Drawing Lot");
        this.setCanvasSize();
        this.drawEnvironment();
        this.drawFloors();
        console.timeEnd("Drawing Lot");
    }

    //#region Draw functions
    setCanvasSize() {

        this.canvas.width = this.tileSize * this.lotObject.lotSize;
        this.canvas.height = this.tileSize * this.lotObject.lotSize;
    }

    drawEnvironment() {

        for (let i = 0; i < this.lotObject.lotSize; i++) {
            for (let j = 0; j < this.lotObject.lotSize; j++) {

                let drawX = i * this.tileSize;
                let drawY = j * this.tileSize;

                this.ctx.drawImage(this.tileList[231][0], drawX, drawY, this.tileSize, this.tileSize);
            }
        }
    }

    drawFloors() {

        for (let i = 0; i < this.lotObject.stories[0].floors.length; i++) {
            
            let floor = this.lotObject.stories[0].floors[i];

            let floorSpriteIndex = FLOOR_KVP[floor.value];
            let drawX = floor.x * this.tileSize;
            let drawY = floor.y * this.tileSize;

            this.ctx.drawImage(this.tileList[floorSpriteIndex][0], drawX, drawY);
        }
    }
    //#endregion

    //#region Build sprite variables
    // TODO: Move this to another class
    ripTilesFromTileSheet() {

        // Build array of tile canvi
        let sourceX = 0, sourceY = 0;
        let tileSheet = new Array();
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 12; x++) {

                let tileStates = new Array(5);

                // Create main, full-tile canvas
                let fullTile = document.createElement("canvas");
                fullTile.width = this.tileSize;
                fullTile.height = this.tileSize;

                let ctx = fullTile.getContext("2d");
                ctx.drawImage(SPRITESHEET_FLOOR, sourceX, sourceY, this.sourceTileSize, this.sourceTileSize, 0, 0, this.tileSize, this.tileSize);
                tileStates[0] = fullTile;

                // Create partial, half-tile canvi
                for (let i = 0; i < 4; i++) {

                    let slicePath = this.getPartialTilePath(i);

                    let partialTile = document.createElement("canvas");
                    let partialCtx = partialTile.getContext("2d");
                    partialTile.width = this.tileSize;
                    partialTile.height = this.tileSize;

                    partialCtx.beginPath();
                    partialCtx.moveTo(slicePath[0], slicePath[1]);
                    for (let i = 1; i < slicePath.length / 2; i++) partialCtx.lineTo(slicePath[i * 2], slicePath[(i * 2) + 1]);
                    partialCtx.clip();
                    partialCtx.drawImage(fullTile, 0, 0);

                    tileStates[i + 1] = partialTile;
                }

                tileSheet.push(tileStates);
                sourceX += this.sourceTileSize;
            }
            sourceX = 0;
            sourceY += this.sourceTileSize;
        }
        console.log(tileSheet)
        return tileSheet;
    }

    getPartialTilePath(pathIndex) {

        if      (pathIndex == 0) return [0, 0, TILE_SIZE, TILE_SIZE, TILE_SIZE, 0];
        else if (pathIndex == 1) return [0, 0, 0, TILE_SIZE, TILE_SIZE, 0];
        else if (pathIndex == 2) return [0, 0, 0, TILE_SIZE, TILE_SIZE, TILE_SIZE];
        else if (pathIndex == 3) return [0, TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE, 0];
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

        this.canvas.width = 1000;
        this.canvas.height = 3000;

        for (let i = 0; i < this.tileList.length; i++) {
            for (let j = 0; j < this.tileList[i].length; j++) {

                let drawX = j * this.tileSize;
                let drawY = i * this.tileSize;

                this.ctx.drawImage(this.tileList[i][j], drawX, drawY);
            }
        }
    }
    //#endregion
}

class LotStory{
    constructor() {

        this.walls = new Array();
        this.floors = new Array();
        this.objects = new Array();
    }
}

class Furniture{
    constructor(furnitureData) {

        this.guid = parseInt(furnitureData._guid);
        this.group = parseInt(furnitureData._group);
        
        this.x = parseInt(furnitureData._x);
        this.y = parseInt(furnitureData._y);
        this.dir = parseInt(furnitureData._dir);
        this.level = parseInt(furnitureData._level);
    }
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

        this.x = parseInt(wallData._x);
        this.y = parseInt(wallData._y);

        this.level = parseInt(wallData._level);
        this.placement = parseInt(wallData._placement);

        // Decimal representation of wall direction bits
        // 1    Top Left
        // 2    Top Right
        // 4    Bottom Right
        // 8    Bottom Left
        // 16   HorizontalDiag
        // 32   VerticalDiag
        this.segmentLength = parseInt(wallData._segments).toString(2);
        this.segmentLength = parseInt("0".repeat(6 - this.segmentLength.length) + this.segmentLength);

        // A row of walls have single points that lead into the next
        // A single wall has two points that face eachother
        //  - Top Right and Bottom Left
        //  - Top Left and Bottom Right

        // String representation of wall direction
        this.segments = wallData.Segments.split(" ");

        this.wallDecor = {
            
            // Wallpaper
            paperRight: parseInt(wallData._tls),
            paperLeft: parseInt(wallData._trs),

            // Partial floors
            floorTopRight: parseInt(wallData._trp),
            floorTopLeft: parseInt(wallData._tlp),
            floorBottomRight: parseInt(wallData._brp),
            floorBottomLeft: parseInt(wallData._blp)
        };
    }

}
