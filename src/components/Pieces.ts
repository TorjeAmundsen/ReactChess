import { TeamId, BoardPosition, Direction, PossibleMove } from "./Types";

const UNICODE_PIECES = {
  bishop: "♝",
  king: "♚",
  knight: "♞",
  pawn: "♟",
  queen: "♛",
  rook: "♜",
};

export const WHITE = 0;
export const BLACK = 1;

const UP = { col: 0, row: -1 };
const DOWN = { col: 0, row: 1 };
const LEFT = { col: -1, row: 0 };
const RIGHT = { col: 1, row: 0 };
const DIAGONAL_UP_LEFT = { col: -1, row: -1 };
const DIAGONAL_UP_RIGHT = { col: 1, row: -1 };
const DIAGONAL_DOWN_LEFT = { col: -1, row: 1 };
const DIAGONAL_DOWN_RIGHT = { col: 1, row: 1 };
const KNIGHT_UP_LEFT = { col: -1, row: -2 };
const KNIGHT_UP_RIGHT = { col: 1, row: -2 };
const KNIGHT_DOWN_LEFT = { col: -1, row: 2 };
const KNIGHT_DOWN_RIGHT = { col: 1, row: 2 };
const KNIGHT_LEFT_UP = { col: -2, row: -1 };
const KNIGHT_LEFT_DOWN = { col: -2, row: 1 };
const KNIGHT_RIGHT_UP = { col: 2, row: -1 };
const KNIGHT_RIGHT_DOWN = { col: 2, row: 1 };

export class Piece {
  col: number;
  row: number;
  color: number;
  constructor(col: number, row: number, color: TeamId) {
    this.col = col;
    this.row = row;
    this.color = color;
  }
  isOutOfBounds(col: number, row: number) {
    if (col < 0 || col > 7 || row < 0 || row > 7) return true;
    return false;
  }
  getPossibleMovesFromMinMaxMoves(
    minMoves: number,
    maxMoves: number,
    directions: Direction[],
    board: BoardPosition
  ) {
    const possibleMoves: PossibleMove[] = [];
    for (let i = minMoves; i <= maxMoves; i++) {
      for (let j = 0; j < directions.length; j++) {
        const { col, row, hasCollided } = directions[j];
        const newCol = this.col + col * i;
        const newRow = this.row + row * i;
        if (this.isOutOfBounds(newCol, newRow) || hasCollided) continue;
        const tileBeingChecked = board[newRow][newCol];
        if (tileBeingChecked !== null) {
          directions[j].hasCollided = true;
          if (tileBeingChecked.color !== this.color) {
            possibleMoves.push({
              col: newCol,
              row: newRow,
              isAttack: true,
            });
          }
        } else {
          possibleMoves.push({
            col: newCol,
            row: newRow,
            isAttack: false,
          });
        }
      }
    }
    return possibleMoves;
  }
}

export class Rook extends Piece {
  symbol: string = UNICODE_PIECES.rook;
  hasMoved: boolean = false;
  public getPossibleMoves(board: BoardPosition) {
    const directions: Direction[] = [
      { ...UP, hasCollided: false },
      { ...DOWN, hasCollided: false },
      { ...LEFT, hasCollided: false },
      { ...RIGHT, hasCollided: false },
    ];

    const MIN_MOVES = 1;
    const MAX_MOVES = 7;

    return this.getPossibleMovesFromMinMaxMoves(MIN_MOVES, MAX_MOVES, directions, board);
  }
}

export class Bishop extends Piece {
  symbol: string = UNICODE_PIECES.bishop;
  public getPossibleMoves(board: BoardPosition) {
    const directions: Direction[] = [
      { ...DIAGONAL_UP_LEFT, hasCollided: false },
      { ...DIAGONAL_UP_RIGHT, hasCollided: false },
      { ...DIAGONAL_DOWN_LEFT, hasCollided: false },
      { ...DIAGONAL_DOWN_RIGHT, hasCollided: false },
    ];

    const MIN_MOVES = 1;
    const MAX_MOVES = 7;

    return this.getPossibleMovesFromMinMaxMoves(MIN_MOVES, MAX_MOVES, directions, board);
  }
}

export class Knight extends Piece {
  symbol: string = UNICODE_PIECES.knight;
  public getPossibleMoves(board: BoardPosition) {
    const directions: Direction[] = [
      { ...KNIGHT_UP_LEFT },
      { ...KNIGHT_UP_RIGHT },
      { ...KNIGHT_DOWN_LEFT },
      { ...KNIGHT_DOWN_RIGHT },
      { ...KNIGHT_LEFT_UP },
      { ...KNIGHT_LEFT_DOWN },
      { ...KNIGHT_RIGHT_UP },
      { ...KNIGHT_RIGHT_DOWN },
    ];

    const MIN_MOVES = 1;
    const MAX_MOVES = 1;

    return this.getPossibleMovesFromMinMaxMoves(MIN_MOVES, MAX_MOVES, directions, board);
  }
}

export class Queen extends Piece {
  symbol: string = UNICODE_PIECES.queen;
  public getPossibleMoves(board: BoardPosition) {
    const directions: Direction[] = [
      { ...UP, hasCollided: false },
      { ...DOWN, hasCollided: false },
      { ...LEFT, hasCollided: false },
      { ...RIGHT, hasCollided: false },
      { ...DIAGONAL_UP_LEFT, hasCollided: false },
      { ...DIAGONAL_UP_RIGHT, hasCollided: false },
      { ...DIAGONAL_DOWN_LEFT, hasCollided: false },
      { ...DIAGONAL_DOWN_RIGHT, hasCollided: false },
    ];

    const MIN_MOVES = 1;
    const MAX_MOVES = 7;

    return this.getPossibleMovesFromMinMaxMoves(MIN_MOVES, MAX_MOVES, directions, board);
  }
}

export class King extends Piece {
  symbol: string = UNICODE_PIECES.king;
  hasMoved: boolean = false;
  public getPossibleMoves(board: BoardPosition) {
    const directions: Direction[] = [
      UP,
      DOWN,
      LEFT,
      RIGHT,
      DIAGONAL_UP_LEFT,
      DIAGONAL_UP_RIGHT,
      DIAGONAL_DOWN_LEFT,
      DIAGONAL_DOWN_RIGHT,
    ];

    const MIN_MOVES = 1;
    const MAX_MOVES = 1;

    return this.getPossibleMovesFromMinMaxMoves(MIN_MOVES, MAX_MOVES, directions, board);
  }
}

export class Pawn extends Piece {
  symbol: string = UNICODE_PIECES.pawn;
  hasMoved: boolean = false;
  public getPossibleMoves(board: BoardPosition) {
    const isWhite = this.color === WHITE;

    const moveDirections: Direction = isWhite
      ? { ...UP, hasCollided: false }
      : { ...DOWN, hasCollided: false };
    const attackDirections: Direction[] = isWhite
      ? [DIAGONAL_UP_LEFT, DIAGONAL_UP_RIGHT]
      : [DIAGONAL_DOWN_LEFT, DIAGONAL_DOWN_RIGHT];

    const MIN_MOVES = 1;
    const MAX_MOVES = this.hasMoved ? 1 : 2;

    const possibleMoves = this.getPossibleMovesNoAttacks(
      MIN_MOVES,
      MAX_MOVES,
      moveDirections,
      board
    );
    const possibleAttacks = this.getPossibleAttacks(attackDirections, board);
    return [...possibleMoves, ...possibleAttacks];
  }
  private getPossibleMovesNoAttacks(
    minMoves: number,
    maxMoves: number,
    { row }: Direction,
    board: BoardPosition
  ) {
    const possibleMoves: PossibleMove[] = [];
    for (let i = minMoves; i <= maxMoves; i++) {
      const newRow = this.row + row * i;
      if (this.isOutOfBounds(this.col, newRow)) continue;
      const tileBeingChecked = board[newRow][this.col];
      if (tileBeingChecked === null) {
        possibleMoves.push({
          col: this.col,
          row: newRow,
          isAttack: false,
        });
      } else {
        break;
      }
    }
    return possibleMoves;
  }
  private getPossibleAttacks(directions: Direction[], board: BoardPosition) {
    const possibleAttacks: PossibleMove[] = [];
    for (const { col, row } of directions) {
      const newCol = this.col + col;
      const newRow = this.row + row;
      if (this.isOutOfBounds(newCol, newRow)) continue;
      const tileBeingChecked = board[newRow][newCol];
      if (tileBeingChecked !== null && tileBeingChecked.color !== this.color) {
        possibleAttacks.push({
          col: newCol,
          row: newRow,
          isAttack: true,
        });
      }
    }
    return possibleAttacks;
  }
}
