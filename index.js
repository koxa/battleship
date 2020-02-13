class Battleship {

}

class Board {
    constructor(x = 10, y = 10, ships = [5, 4, 3, 2, 1]) {
        this.x = x;
        this.y = y;
        this.generateBoard(x, y);
        this.generateShips(ships);
        this.drawBoard();
        //console.log('board', this.board);
    }

    drawBoard() {
        for(let x = 0; x< this.board.length; x++ ) {
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

    generateShips(ships) {
        if (!this.board.length || !this.board[0].length) {
            throw new Error('There should be at least 1 cell in a board');
        }
        for (let ship of ships) {
            let shipCoords = this.generateShip(ship);
            console.log(shipCoords);
            this.putShip(shipCoords);
        }
    }

    putShip(shipCoords) {
        for (let coord of shipCoords) {
            let XY = coord.split(':');
            this.board[XY[0]][XY[1]] = 1;
        }
    }

    generateShip(shipLen, dir = Math.random() >= 0.5, prevPos = [], times = 0) {
        times++;
        const posX = Math.floor(Math.random() * this.x);
        const posY = Math.floor(Math.random() * this.y);
        if (prevPos.indexOf(posX + ':' + posY) > -1) {
            return this.generateShip(shipLen, !dir, prevPos, times);
        }
        let ship = [];
        for (let i = 0; i < shipLen; i++) {
            let x = dir ? posX + i : posX;
            let y = dir ? posY : posY + 1;
            console.log('trying x:' + x, ' y:' + y);
            let val = this.board[x] ? this.board[x][y] : undefined;
            if (val === undefined || val === 1) {
                prevPos.push(posX + ':' + posY);
                return this.generateShip(shipLen, !dir, prevPos, times);
            } else {
                ship.push(x + ':' + y);
            }
        }
        // record ship on board
        console.log('ship generated after ' + times + ' times');
        return ship;
    }

}

class Ship {

}

new Board();