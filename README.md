BATTLESHIP BASIC ONE PLAYER GAME

1) To generate game instantiate BattleShip class with params: Vertical Size, Horizontal Size, Array of Ship Sizes
Example: const BS = new Battleship(10, 10, [5, 4, 3, 2, 1]);
2) To attack run .attack(x, y) on BS instance
example: BS.attack(5,5);

Important issues left to do:
1) Board generation may exceed call stack in case ship can't be placed
2) Implement configurable GAP between ships