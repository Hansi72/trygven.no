import './linkMaze.css';
import { useState, useEffect } from 'react';

function LinkMaze() {
    const [mazeState, setMazeState] = useState([]);
    const [mazeSize, setMazeSize] = useState([]);

    useEffect(() => {
        const maze = document.getElementById("maze");
        var mazeSizeX;
        var mazeSizeY;
        if (maze.offsetWidth > maze.offsetHeight) {
            //landscape
            mazeSizeX = Math.max(Math.floor(maze.offsetWidth / 10), 200);
            mazeSizeY = Math.floor(mazeSizeX * (maze.offsetHeight / maze.offsetWidth));
        } else {
            //portrait
            mazeSizeY = Math.max(Math.floor(maze.offsetHeight / 10), 200);
            mazeSizeX = Math.floor(mazeSizeY * (maze.offsetWidth / maze.offsetHeight));
        }

        setMazeSize([mazeSizeX, mazeSizeY]);
        setMazeState(createMaze(mazeSizeX, mazeSizeY, 0, false));
    }, []);

    function createMaze(sizeX, sizeY, difficulty, hasRoute) {
        var maze = [];
        for (let x = 0; x < sizeX; x++) {
            maze[x] = [];
            for (let y = 0; y < sizeY; y++) {
                //create an outer wall
                if (x === 0 || y === 0 || y === sizeY - 1) {
                    maze[x][y] = 1;
                //or normal wall
                } else {
                    maze[x][y] = 0;
                }
            }
        }

        let locationX = Math.floor(sizeX * 0.1);
        let locationY = Math.floor(sizeY / 2);
        if (hasRoute) {
            maze = createRoute(maze, locationX, locationY, sizeX - locationX, locationY, difficulty);
        }
        maze = placeGoal(maze, locationX, locationY, sizeX * 0.15, sizeY * 0.7);
        maze = placeStart(maze, sizeX - locationX, locationY, sizeX * 0.15, sizeY * 0.7);

        //add anti-cheat blocks halway through the maze
        const halfPoint = Math.floor(sizeX/2);
        for(let y = 0; y < sizeY; y++){
            for(let x = halfPoint - 10; x < halfPoint + 10; x++){
                if(maze[x][y] === 4){
                    maze[x][y] = 5;
                }
            }
        }
        return maze;
    }

    //place a goal at a location
    function placeGoal(maze, locationX, locationY, sizeX, sizeY) {
        return placeSquare(maze, locationX, locationY, sizeX, sizeY, 2);
    }

    //creates a location for startButton
    function placeStart(maze, locationX, locationY, sizeX, sizeY) {
        return placeSquare(maze, locationX, locationY, sizeX, sizeY, 3);
    }

    //creates an open square in the maze (todo, prone to errors, choose x,y within maze range)
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

    //creates a route from a given goal to the finish line
    function createRoute(maze, startX, startY, endX, endY, difficulty) {
        var result = [];

        try {
            traverseMaze(maze, startX, startY, endX, endY, [], result, "right", 0);
        } catch {
            try {
                result = [];
                traverseMaze(maze, startX, startY, endX, endY, [], result, "right", 0);
            } catch {
                result = [];
                traverseMaze(maze, startX, startY, endX, endY, [], result, "right", 0);
            }
        }

        for (let i = 0; i < result.length; i++) {
            let x = result[i][0];
            let y = result[i][1];
            for (let offset = 0; offset < difficulty; offset++) {
                try {
                    maze[x - offset][y] = 4;
                    maze[x + offset][y] = 4;
                    maze[x][y - offset] = 4;
                    maze[x][y + offset] = 4;
                } catch {
                    //catch nothing, just ignore out of bounds
                }
            }
        }
        return maze;
    }

    //recursively finds a path from x, y to goalX, goalY. pushes resulting path to result.
    function traverseMaze(maze, x, y, goalX, goalY, path, result, lastDirection, depth) {
        if (
            x < 0 ||
            y < 0 ||
            x >= maze.length ||
            y >= maze[0].length ||
            maze[x][y] !== 0 ||
            maze[x][y] === 1
        ) {
            return false;
        }

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

    //returns a semi-random direction string. Biased towards goal and a sinus curve
    function getBiasedDirection(x, y, goalX, goalY, possibleDir, depth) {
        let directions = [];
        let sinBias = Math.sin((Math.PI / (mazeSize[1] * 5)) * depth);
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

    //returns a random number in given range
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //classNames of maze elements
    const wallTypes = ["wall", "wall", "goal", "start", "route", "antiCheat"];
    let mazeWalls = [];
    //render maze
    for (let x = 0; x < mazeState.length; x++) {
        for (let y = 0; y < mazeState[x].length; y++) {
            mazeWalls.push(<div
                className={wallTypes[mazeState[x][y]]}
                key={`${x}_${y}`}
                style={{
                    gridColumn: x + 1,// + "/ span 1"
                    gridRow: y + 1// + "/ span 1",
                }}
            />);
        }
    }

    var isCheater;
    function handleGameStart(difficulty) {
        document.removeEventListener('pointermove', handleGame);
        isCheater = true
        setMazeState(createMaze(mazeSize[0], mazeSize[1], difficulty, true));
        document.getElementById("mazeText").innerHTML = "Å nei! Lenkene er fanget i enden av hulen! <br/> Velg en vanskelighetsgrad for å redde dem!";
        document.getElementById("mazeText").style.color = "white";
        document.addEventListener('pointermove', handleGame);

        const elements = document.getElementsByClassName('mazeLink');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.style.pointerEvents = "auto";
            element.style.textDecoration = "none";
        }
    }

    //Tracks mouseposition and stops the game at win/loss condition based
    function handleGame(event) {
        const elementBeneathMouse = document.elementFromPoint(event.clientX, event.clientY);
        const elementClass = elementBeneathMouse.className;
        if (elementClass === "wall") {
            handleGameStop("lose");
        } else if (elementClass === "goal" || elementClass === "mazeLink") {
            if(isCheater){
                handleGameStop("cheat");
            }else{
                handleGameStop("win");
            }
        }
        if(elementClass === "antiCheat"){
            isCheater = false;
        }
    };

    function handleGameStop(result) {
        setMazeState(createMaze(mazeSize[0], mazeSize[1], 2, false));
        document.removeEventListener('pointermove', handleGame);
        const textField = document.getElementById("mazeText");
        if (result === "win") {
            //victory condition
            textField.innerHTML = "Gratulerer! Lenkene er reddet!";
            textField.style.color = "green";
        } else if (result === "lose" || result === "cheat") {
            //lose condition
            textField.innerHTML = "Rykk tilbake til start!";
            textField.style.color = "red";

            const elements = document.getElementsByClassName('mazeLink');
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                element.style.pointerEvents = "none";
                element.style.textDecoration = "line-through";
            }
            if(result === "cheat"){
                textField.innerHTML += "<br/> Det er ikke lov å jukse!";
            }
        }
    };

    return (
        <div className="maze-Container">
            <div className="maze" id="maze">
                {mazeWalls}
            </div>
            <div className="mazeText" id="mazeText">
                Å nei! Lenkene er fanget i enden av hulen! <br /> Velg en vanskelighetsgrad for å redde dem!
            </div>
            <div className="mazeLink-Container" id="mazeLinks">
                <a className="mazeLink" href="https://github.com/Hansi72">Github</a>
                {/*<a className="mazeLink" href="https://git.app.uib.no/hans.rorlien">GitLab</a>*/}
                <a className="mazeLink" href="https://www.linkedin.com/in/hans-trygve-r%C3%B8rlien-a70392228/">LinkedIn</a>
                <a className="mazeLink" href="https://lykilinn.no">Molecular moods</a>
            </div>
            <div className="button-container">
                <button className="button easy" onClick={() => handleGameStart(5)}>
                    Lett
                </button>
                <button className="button medium" onClick={() => handleGameStart(2)}>
                    Middels
                </button>
                <button className="button hard" onClick={() => handleGameStart(1)}>
                    Vanskelig
                </button>
            </div>
        </div>
    );
}
export default LinkMaze;


