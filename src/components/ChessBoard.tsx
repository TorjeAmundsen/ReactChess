import { useEffect, useState } from "react";
import { TeamId, BoardPosition, SinglePiece } from "./Types";
import { Rook, Knight, Bishop, Queen, King, Pawn, BLACK, WHITE } from "./Pieces";

const createBackline = (row: 0 | 7, color: TeamId): SinglePiece[] => {
  return [
    new Rook(0, row, color),
    new Bishop(1, row, color),
    new Knight(2, row, color),
    new Queen(3, row, color),
    new King(4, row, color),
    new Knight(5, row, color),
    new Bishop(6, row, color),
    new Rook(7, row, color),
  ];
};

const createPawns = (row: 1 | 6, color: TeamId) => {
  const pawns: Pawn[] = [];
  for (let i = 0; i < 8; i++) {
    pawns.push(new Pawn(i, row, color));
  }
  return pawns;
};

const createNewBlankMatrix = (arrayHeight: number, arrayWidth: number) => {
  const matrix: null[][] = [];
  for (let i = 0; i < arrayHeight; i++) {
    const col = [];
    for (let j = 0; j < arrayWidth; j++) {
      col.push(null);
    }
    matrix.push(col);
  }
  return matrix;
};

export default function ChessBoard() {
  const [currentPosition, setCurrentPosition] = useState<BoardPosition>([]);
  const [visualizedTiles, setVisualizedTiles] = useState<(string | null)[][]>(
    createNewBlankMatrix(8, 8)
  );

  const createStartingPosition = () => {
    const board = [];
    let currentTeamId: TeamId = BLACK;
    for (let row = 0; row < 8; row++) {
      if (row === 0 || row === 7) {
        board.push(createBackline(row, currentTeamId));
      } else if (row === 1 || row === 6) {
        board.push(createPawns(row, currentTeamId));
        currentTeamId = WHITE;
      } else {
        board.push(new Array(8).fill(null));
      }
    }
    setCurrentPosition(board);
  };

  const handleClick = (e: React.MouseEvent, tile: SinglePiece | null) => {
    if (tile === null) {
      setVisualizedTiles(createNewBlankMatrix(8, 8));
      return;
    }
    if (e.altKey) {
      setCurrentPosition((prev) => {
        const newPosition = [...prev];
        newPosition[tile.row][tile.col] = null;
        return newPosition;
      });
    } else {
      const moves = tile.getPossibleMoves(currentPosition);
      console.log(moves);
      setVisualizedTiles(() => {
        const newVisualizedTiles: (null | string)[][] = createNewBlankMatrix(8, 8);
        for (const { col, row, isAttack } of moves) {
          newVisualizedTiles[row][col] = isAttack ? "possible-attack " : "possible-move ";
        }
        newVisualizedTiles[tile.row][tile.col] = "currently-selected ";
        return newVisualizedTiles;
      });
      setCurrentPosition((prev) => [...prev]);
    }
  };

  useEffect(() => {
    createStartingPosition();
  }, []);

  return (
    <>
      {currentPosition.map((row, rowIdx) =>
        row.map((tile, colIdx) => {
          let classList = rowIdx % 2 ? "tile odd " : "tile ";
          const visualizationClass = visualizedTiles[rowIdx][colIdx];
          if (visualizationClass) classList += visualizationClass;
          if (tile === null)
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={classList}
                onClick={(e) => {
                  handleClick(e, tile);
                }}
              ></div>
            );
          classList += tile.color === WHITE ? "white " : "black ";
          return (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={classList}
              onClick={(e) => {
                handleClick(e, tile);
              }}
            >
              {tile.symbol}
            </div>
          );
        })
      )}
    </>
  );
}
