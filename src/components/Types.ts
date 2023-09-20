import { Rook, Bishop, Knight, King, Queen } from "./Pieces";

export type SinglePiece = Rook | Bishop | Knight | King | Queen;

export type BoardPosition = (SinglePiece | null)[][];

export type TeamId = 0 | 1;

export type Direction = {
  col: number;
  row: number;
  hasCollided?: boolean;
};

export type PossibleMove = {
  col: number;
  row: number;
  isAttack: boolean;
};
