class LotObject{
    constructor(lotData) {

        this.objects = lotData.house.objects;

        this.world = lotData.house.world;
        this.walls = this.world.walls;
        this.floors = this.world.floors.floor;
    }
}

class LotCanvas{
    constructor(lotObject) {

        this.lotObject = lotObject;

        this.tileSize = 16;
        this.lotSize = 64 + 2;

        this.canvas = document.getElementById("lot-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.setCanvasSize();
        this.draw();
    }

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
}