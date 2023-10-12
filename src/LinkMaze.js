import './linkMaze.css';
import { useState, useEffect } from 'react';

/*
0 = maze wall
1 = goal
2 = route to goal
3 = start button
*/

function LinkMaze() {
    const [mazeState, setMazeState] = useState([]);
    const [triesState, setTriesState] = useState(1);

    var mazeSizeX = 100;
    var mazeSizeY = mazeSizeX * Math.floor((window.innerWidth/window.innerHeight));
    if(mazeSizeX % 2 === 0){
        mazeSizeX++;
    }
    if(mazeSizeY % 2 === 0){
        mazeSizeY++;
    }

    useEffect(() => {
        setMazeState(createEmptyMaze(mazeSizeX, mazeSizeY, 2));
    }, []);

    function createMaze(sizeX, sizeY) {
        var maze = [];
        for (let x = 0; x < sizeX; x++) {
            maze[x] = [];
            for (let y = 0; y < sizeY; y++) {
                //create an outer wall
                if (x == 0 || y == 0 || y == sizeY - 1) {
                    maze[x][y] = -1;
                } else {
                    maze[x][y] = 0;
                }
            }
        }

        let locationX = Math.floor(sizeX * 0.1);
        let locationY = Math.floor(sizeY / 2);
        maze = createRoute(maze, locationX, locationY, sizeX - locationX, locationY);
        maze = placeGoal(maze, locationX, locationY, sizeX * 0.15, sizeY * 0.7);
        maze = placeStart(maze, sizeX - locationX, locationY, sizeX * 0.15, sizeY * 0.7);
        return maze;
    }

    function createEmptyMaze(sizeX, sizeY) {
        var maze = [];
        for (let x = 0; x < sizeX; x++) {
            maze[x] = [];
            for (let y = 0; y < sizeY; y++) {
                //create an outer wall
                if (x == 0 || y == 0 || y == sizeY - 1) {
                    maze[x][y] = -1;
                } else {
                    maze[x][y] = 0;
                }
            }
        }

        let locationX = Math.floor(sizeX * 0.1);
        let locationY = Math.floor(sizeY / 2);
        maze = placeGoal(maze, locationX, locationY, sizeX * 0.15, sizeY * 0.7);
        maze = placeStart(maze, sizeX - locationX, locationY, sizeX * 0.15, sizeY * 0.7);
        return maze;
    }
   

    //place a goal at a location (todo, prone to errors, choose x,y within maze range)
    function placeGoal(maze, locationX, locationY, sizeX, sizeY) {
        return placeSquare(maze, locationX, locationY, sizeX, sizeY, 1);
    }

    //creates a location for startButton (todo, prone to errors, choose x,y within maze range))
    function placeStart(maze, locationX, locationY, sizeX, sizeY) {
        return placeSquare(maze, locationX, locationY, sizeX, sizeY, 3);
    }

    //todo
    function placeSquare(maze, locationX, locationY, sizeX, sizeY, value) {
        locationX = locationX - Math.floor(sizeX / 2);
        locationY = locationY - Math.floor(sizeY / 2);
        for (let x = locationX; x < locationX + sizeX; x++) {
            for (let y = locationY; y < locationY + sizeY; y++) {
                maze[x][y] = value;
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
        /*if(depth > 3000){
            throw new Error("depth exceeded maximum");
        }
*/
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
        let sinBias = Math.sin((Math.PI / (mazeSizeY * 5)) * depth);
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
            if (mazeState[x][y] == 0 || mazeState[x][y] == -1) {
                mazeWalls.push(<div
                    className="wall"
                    key={`${x}_${y}`}
                    style={{
                        gridColumn: x + 1,// + "/ span 1"
                        gridRow: y + 1// + "/ span 1",
                    }}
                />);
            } else if (mazeState[x][y] == 3) {
                mazeWalls.push(<div
                    className="start"
                    key={`${x}_${y}`}
                    style={{
                        gridColumn: x + 1,// + "/ span 1"
                        gridRow: y + 1// + "/ span 1",
                    }}
                />);
            } else if (mazeState[x][y] == 1) {
                mazeWalls.push(<div
                    className="goal"
                    key={`${x}_${y}`}
                    style={{
                        gridColumn: x + 1,// + "/ span 1"
                        gridRow: y + 1// + "/ span 1",
                    }}
                />);
            }
        }
    }


    function handleGameStart() {
        setTriesState(Math.min(triesState + 1, 5));
        setMazeState(createMaze(mazeSizeX, mazeSizeY, 2));
        console.log("game started");
        document.getElementById("mazeText").innerHTML = "Å nei! Lenkene er fanget i enden av hulen!";
        document.getElementById("mazeText").style.color = "white";
        document.addEventListener('pointermove', handleGame);
    }

    function handleGame(event){
          const elementBeneathMouse = document.elementFromPoint(event.clientX, event.clientY);
          //console.log('Element beneath mouse:', elementBeneathMouse);
          const mazeElement = elementBeneathMouse.className;
          if(mazeElement == "wall"){
            handleGameStop(false);
            console.log("crashed in a wall");
          }else if(mazeElement == "goal"){
            handleGameStop(true);
          }
      };

    function handleGameStop(result) {
        setMazeState(createEmptyMaze(mazeSizeX, mazeSizeY, 2));
        document.removeEventListener('pointermove', handleGame);
        const textField = document.getElementById("mazeText");
        if(result){
            textField.innerHTML = "Gratulerer! Lenkene er reddet!";
            textField.style.color = "green";
            //victory condition
        }else{
            //lose condition
            textField.innerHTML = "Rykk tilbake til start!";
            textField.style.color = "red";
        }
      };


    return (
        <div className="maze-Container">
            <div className="maze" id="maze">
                {mazeWalls}
            </div>
            <div className="mazeText" id="mazeText">
                Å nei! Lenkene er fanget i enden av hulen!
            </div>
            <div className="mazeLinks" id="mazeLinks">
                <href>Github</href>
                <href>LinkedIn</href>
            </div>
            <div className="button-container">
                <button className="startButton" onClick={(e) => handleGameStart(e)}> Start</button>
            </div>
        </div>
    );
}
export default LinkMaze;


