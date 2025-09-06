import {Board, seededBoard} from "@/domain/conway/board";
import { useEffect, useRef, useState } from "react";
import {tickBoard} from "@/domain/conway/rules";
import vars from './../../variables.module.css'
console.log({ vars })
export interface BackgroundProps {
    seed?: number;
    delay?: number;
    lineWidth: number;
    lineColor: string;
    backgroundColor: string;
    cellColor: string;
    cellSize: number;
}

export const Background = ({
                               seed = Date.now(),
                               delay = 1000,
                               lineWidth = 1,
                               lineColor = vars.backgroundLinesDark,
                               backgroundColor = vars.backgroundDark,
                               cellColor = vars.promptBlue,
                               cellSize = 20,
                           }: BackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentBoard, setCurrentBoard] = useState<Board>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const displayWidth = canvas.offsetWidth;
        const displayHeight = canvas.offsetHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        setDimensions({ width: displayWidth, height: displayHeight });
    }, []);

    useEffect(() => {
        const width = Math.ceil(dimensions.width / cellSize)
        const height = Math.ceil(dimensions.height / cellSize)
        console.log("Board", { width, height })
        const { board } = seededBoard(
            width,
            height,
            seed
        );
        setCurrentBoard(board);
    }, [seed, dimensions, cellSize]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentBoard((prevBoard) => tickBoard(prevBoard));
        }, delay);

        return () => clearInterval(intervalId);
    }, [delay]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = dimensions;
        const horizontalCount = Math.floor(width / cellSize);
        const verticalCount = Math.floor(height / cellSize);

        const drawBackground = () => {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
        };

        const drawGridLines = () => {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            for (let x = 0; x <= horizontalCount; x++) {
                ctx.beginPath();
                ctx.moveTo(x * cellSize, 0);
                ctx.lineTo(x * cellSize, height);
                ctx.stroke();
            }
            for (let y = 0; y <= verticalCount; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * cellSize);
                ctx.lineTo(width, y * cellSize);
                ctx.stroke();
            }
        };

        const drawCells = (board: Board) => {
            board.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell === 1) {
                        ctx.fillStyle = cellColor;
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                });
            });
        };

        drawBackground();
        drawCells(currentBoard);
        drawGridLines();
    }, [
        currentBoard,
        dimensions,
        cellSize,
        lineWidth,
        lineColor,
        backgroundColor,
        cellColor,
    ]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};
