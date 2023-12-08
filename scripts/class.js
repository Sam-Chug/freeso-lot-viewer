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

        this.tileSize = 27;
        this.sourceTileSize = 27;

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

                this.ctx.drawImage(this.tileList[231], drawX, drawY, this.tileSize, this.tileSize);
            }
        }
    }

    drawFloors() {

        for (let i = 0; i < this.lotObject.stories[0].floors.length; i++) {
            
            let floor = this.lotObject.stories[0].floors[i];

            let floorSpriteIndex = FLOOR_KVP[floor.value];
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

        this.segments = wallData.Segments.split(" ");
        this.segmentLength = parseInt(wallData._segments);

        this.level = parseInt(wallData._level);
        this.placement = parseInt(wallData._placement);

        this.x = parseInt(wallData._x);
        this.y = parseInt(wallData._y);
        
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
