const SHIP_HIT = 'ship_hit';
const SHIP_MISS = 'ship_miss';
const SHIP_ALREADY_ATTACKED = 'ship_already_attacked';
const SHIP_SUNK = 'ship_sunk';

class Battleship {
    constructor(maxX, maxY, shipSizes = [5, 4, 3, 2, 1]) {
        const totalCells = maxX * maxY;
        const totalShipCells = shipSizes.reduce((num, acc) => acc + num, 0);
        if (totalCells < totalShipCells) {
            throw new Error('Board size is smaller than total ship sizes');
        }
        this.board = new Board(maxX, maxY, shipSizes);
        this.totalShips = shipSizes.length;
        this.totalSunk = 0;
        this.won = false;
        this.board.printBoard();
    }

    attack(x, y) { // convert 1:maxX to 0:maxX-1
        if (this.won) {
            console.log('GAME ALREADY WON. IGNORING');
            return;
        }
        x = x - 1;
        y = y - 1;
        const ship = this.board.getShip(x, y); // get reference to ship if available
        if (ship) {
            const result = ship.hit(x, y); // hit ship's body
            switch (result) {
                case SHIP_HIT:
                    console.log('SHIP HIT');
                    break;
                case SHIP_ALREADY_ATTACKED:
                    console.log('SHIP ALREADY ATTACKED');
                    break;
                case SHIP_SUNK:
                    console.log('SHIP SUNK');
                    this.totalSunk++;
                    if (this.totalShips === this.totalSunk) {
                        this.won = true;
                        console.log('WIN');
                    }
                    break;
                default:
                    console.log('something else', result);
            }
        } else {
            console.log('SHIP MISS');
        }
    }

}

class Board {
    constructor(maxX = 10, maxY = 10, shipSizes = [5, 4, 3, 2, 1]) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.generateBoard(maxX, maxY);
        this.generateShips(shipSizes);
    }

    printBoard() {
        for (let x = 0; x < this.board.length; x++) {
            console.log(this.board[x].join(' '));
        }
    }

    generateBoard(sizeX, sizeY) {
        this.board = [];
        for (let x = 0; x < sizeX; x++) {
            this.board[x] = [];
            for (let y = 0; y < sizeY; y++) {
                this.board[x][y] = 0;
            }
        }
    }

    getShip(x, y) {
        return this.board[x][y] instanceof Ship ? this.board[x][y] : null;
    }

    generateShips(shipSizes) {
        if (!this.board.length || !this.board[0].length) {
            throw new Error('There should be at least 1 cell in a board');
        }
        for (let shipLen of shipSizes) {
            let ship = this.genShip(shipLen);
            this.placeShip(ship);
        }
    }

    placeShip(ship) {
        for (let coord of ship.getCoords()) {
            this.board[coord.x][coord.y] = ship;
        }
    }

    genShip(shipLen, retries = 0) {
        //todo: check whether there is enough space left on board to fit new ship, otherwise stop generation
        //todo: gap between ships
        const startX = Math.floor(Math.random() * this.maxX); // 0 to 9
        const startY = Math.floor(Math.random() * this.maxY); // 0 to 9
        const dir = Math.random() >= 0.5; // random direction; true = add X, false = add Y
        const checkPos = dir ? startX : startY;
        const checkMax = dir ? this.maxX : this.maxY;
        // check if ship can fit into row/column
        if (checkPos + shipLen > checkMax) {
            return this.genShip(shipLen, ++retries);
        } else {
            // check if ship collides with other ships
            const ship = new Ship(shipLen, startX, startY, dir);
            if (this.isCollision(ship)) {
                return this.genShip(shipLen, ++retries);
            }
            console.log('ship generated in ' + retries + ' retries');
            return ship;
        }
    }

    isCollision(ship) {
        for (let coord of ship.getCoords()) {
            if (this.board[coord.x][coord.y] instanceof Ship) {
                return true
            }
        }
        return false;
    }
}

class Ship {
    constructor(len = 1, startX, startY, dir) {
        this.len = len;
        this.startX = startX;
        this.startY = startY;
        this.dir = dir;
        this.uniqueHits = 0;
        this.sunk = false;
        this.body = [];
        for (let i = 0; i < this.len; i++) {
            this.body[i] = 1; // fill body to track hits, 1 means not hit
        }
    }

    toString() {
        return '' + this.len;
    }

    getCoords() {
        const out = [];
        for (let i = 0; i < this.len; i++) {
            out.push({
                x: this.dir ? this.startX + i : this.startX,
                y: this.dir ? this.startY : this.startY + i
            })
        }
        return out;
    }

    getXYIndex(x, y) {
        const xMax = this.dir ? this.startX + this.len : this.startX;
        const yMax = this.dir ? this.startY : this.startY + this.len;
        if (x >= this.startX && x <= xMax) {
            if (y >= this.startY && y <= yMax) {
                return this.dir ? x - this.startX : y - this.startY;
            }
        }
        return -1;
    }

    hit(x, y) {
        const hitIndex = this.getXYIndex(x, y);
        if (hitIndex < 0) {
            return SHIP_MISS;
        }
        const val = this.body[hitIndex];
        if (val) {
            if (val === 1) {
                // hit
                this.uniqueHits++;
                this.body[hitIndex] = 2; // mark as hit
                if (this.uniqueHits === this.len) {
                    this.sunk = true;
                    return SHIP_SUNK;
                }
                return SHIP_HIT;
            } else if (val === 2) {
                // already attacked
                return SHIP_ALREADY_ATTACKED
            }
        } else {
            // missed
            return SHIP_MISS;
        }
    }
}

//SAMPLE GAME 10X10, 5 ships with sizes 5,4,3,2,1
const BS = new Battleship(10, 10, [5, 4, 3, 2, 1]);
// ATTACKING EACH CELL
for (let i = 0; i < 10; i++) {
    for (let n = 0; n < 10; n++) {
        BS.attack(i + 1, n + 1);
    }
}