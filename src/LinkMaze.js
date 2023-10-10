import './linkMaze.css';
import { useState, useEffect } from 'react';

/*
0 = maze wall
1 = goal
2 = route to goal
3 = side route
*/

function LinkMaze() {
    const [mazeState, setMazeState] = useState([]);

    useEffect(() => {
        setMazeState(createMaze(80, 40, 2));
    }, []);

    function createMaze(sizeX, sizeY, goalCount) {
        var maze = [];
        for (let x = 0; x < sizeX; x++) {
            maze[x] = [];
            for (let y = 0; y < sizeY; y++) {
                if (x == 0 || y == 0 || x == sizeX - 1 || y == sizeY - 1) {
                    maze[x][y] = -1;
                } else {
                    maze[x][y] = 0;
                }
            }
        }
        console.log(maze);

        let locationX = 2;
        let locationY = Math.floor(sizeY / (goalCount + 1));
        for (let goal = 0; goal < goalCount; goal++) {
            console.log("creating goal");
            maze = placeGoal(maze, locationX, locationY * (goal + 1), 3, 3);
            console.log("creating route");
            maze = createRoute(maze, locationX + 3, locationY * (goal + 1), sizeX - 2, locationY * (goal + 1));
        }
        return maze;
    }


    //place a goal at a location (todo, prone to errors, choose x,y within maze range)
    function placeGoal(maze, locationX, locationY, sizeX, sizeY) {
        for (let x = locationX; x < locationX + sizeX; x++) {
            for (let y = locationY; y < locationY + sizeY; y++) {
                maze[x][y] = 1;
            }
        }
        return maze;
    }

    //creates a route from a goal to the finish line
    function createRoute(maze, startX, startY, endX, endY) {
        var result = [];

        try {
            traverseMaze(maze, startX, startY, endX, endY, [], result, "right", 0);
        } catch {
            try {
                traverseMaze(maze, startX, startY, endX, endY, [], result, "right", 0);
            } catch {
                traverseMaze(maze, startX, startY, endX, endY, [], result, "right", 0);
            }
        }

        for (let i = 0; i < result.length; i++) {
            let x = result[i][0];
            let y = result[i][1];
            maze[x][y] = 2;
        }
        return maze;
    }

    function traverseMaze(maze, x, y, goalX, goalY, path, result, lastDirection, depth) {
        if (
            x < 0 ||
            y < 0 ||
            x >= maze.length ||
            y >= maze[0].length ||
            maze[x][y] != 0 ||
            maze[x][y] == -1
        ) {
            return false;
        }
        if(depth > 1000){
            throw new Error("depth exceeded maximum");
        }

        console.log("currently at x: " + x + " y: " + y);

        path.push([x, y]);

        if (x === goalX && y === goalY) {
            result.push(...path);
            return true;
        } else {

            const possibleDirections = new Set(["left", "up", "right", "down"]);
            possibleDirections.delete(lastDirection);
            while (possibleDirections.size > 0) {
                switch (getBiasedDirection(x, y, goalX, goalY, possibleDirections, depth)) {
                    case "left":
                        if (traverseMaze(maze, x - 1, y, goalX, goalY, path, result, "left", depth + 1)) {
                            return true;
                        }
                        possibleDirections.delete("left");
                        break;
                    case "up":
                        if (traverseMaze(maze, x, y + 1, goalX, goalY, path, result, "up", depth + 1)) {
                            return true;
                        }
                        possibleDirections.delete("up");
                        break;
                    case "right":
                        if (traverseMaze(maze, x + 1, y, goalX, goalY, path, result, "right", depth + 1)) {
                            return true;
                        }
                        possibleDirections.delete("right");
                        break;
                    case "down":
                        if (traverseMaze(maze, x, y - 1, goalX, goalY, path, result, "down", depth + 1)) {
                            return true;
                        }
                        possibleDirections.delete("down");
                        break;
                    default:
                        possibleDirections.clear();
                }
            }
        }
        path.pop();
    }

    //returns 
    function getBiasedDirection(x, y, goalX, goalY, possibleDir, depth) {
        let directions = [];
        console.log("depth: " + depth);
        console.log(Math.sin((Math.PI / 32) * depth));
        let sinBias = Math.sin((Math.PI) * depth);
        if (possibleDir.has("left")) {
            directions.push("left");
            if (goalX < x) {
                directions.push("left");
            }
        }

        if (possibleDir.has("up")) {
            directions.push("up");
            if (goalY > y) {
                directions.push("up");
            }
            if (sinBias > 0) {
                directions.push("up");
            }
        }

        if (possibleDir.has("right")) {
            directions.push("right");
            if (goalX > x) {
                directions.push("right");
            }
        }

        if (possibleDir.has("down")) {
            directions.push("down");
            if (goalY < y) {
                directions.push("down");
            }
            if (sinBias < 0) {
                directions.push("down");
            }
        }
        return directions[getRandom(0, directions.length - 1)];
    }

    //returns a random non-zero positive number
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //render maze
    let mazeWalls = [];
    for (let x = 0; x < mazeState.length; x++) {
        for (let y = 0; y < mazeState[x].length; y++) {
            if (mazeState[x][y] == 0) {
                mazeWalls.push(<div
                    className="wall"
                    key={`${x}_${y}`}
                    style={{
                        gridColumn: x + 1,// + "/ span 1"
                        gridRow: y + 1// + "/ span 1",
                    }}
                />);
            }
        }
    }




    return (
        <div className="maze-Container">
            <div className="maze" id="maze">
                {mazeWalls}
            </div>
        </div>
    );
}
export default LinkMaze;


