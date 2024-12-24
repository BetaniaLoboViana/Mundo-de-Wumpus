let size; 
let world;
let agent;
let hasGold = false;


const container = document.getElementById("game-container");
const message = document.getElementById("message");
const boardSizeInput = document.getElementById("board-size");
const startGameButton = document.getElementById("start-game");


startGameButton.addEventListener("click", () => {
    size = parseInt(boardSizeInput.value);
    startGame();
});


function startGame() {
    agent = { x: size - 1, y: 0 };
    hasGold = false;
    message.textContent = "Pegue o ouro e volte ao início!";
    generateWorld();
    renderWorld();
}


function generateWorld() {
    world = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push({ type: "empty" }); 
        }
        world.push(row);
    }

    placeRandom("wumpus", 1);
    placeRandom("gold", 1);
    placeRandom("pit", Math.floor(size - 1)); 
}


function placeRandom(type, count) {
    while (count > 0) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (world[x][y].type === "empty" && !(x === agent.x && y === agent.y)) {
            world[x][y].type = type;
            count--;
        }
    }
}


function renderWorld() {
    container.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (let j = 0; j < size; j++) {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";

            if (i === agent.x && j === agent.y) {
                cellDiv.classList.add("agent");
                cellDiv.textContent = "A";
            } else if (world[i][j].type === "gold" && !hasGold) {
                cellDiv.classList.add("gold");
                cellDiv.textContent = "G";
            } else if (world[i][j].type === "wumpus") {
                cellDiv.classList.add("wumpus");
                cellDiv.textContent = "W";
            } else if (world[i][j].type === "pit") {
                cellDiv.classList.add("pit");
                cellDiv.textContent = "P";
            }

            rowDiv.appendChild(cellDiv);
        }
        container.appendChild(rowDiv);
    }
}


function moveAgent(dx, dy) {
    const newX = agent.x + dx;
    const newY = agent.y + dy;

    
    if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
        agent.x = newX;
        agent.y = newY;

        const currentCell = world[newX][newY];
        if (currentCell.type === "gold" && !hasGold) {
            hasGold = true;
            message.textContent = "Você pegou o ouro! Volte ao início!";
        } else if (currentCell.type === "wumpus") {
            message.textContent = "Você foi devorado pelo Wumpus! Reiniciando...";
            startGame();
        } else if (currentCell.type === "pit") {
            message.textContent = "Você caiu em um poço! Reiniciando...";
            startGame();
        } else if (agent.x === size - 1 && agent.y === 0 && hasGold) {
            message.textContent = "Parabéns! Você venceu!";
        } else {
            message.textContent = "Nada aqui... Continue explorando.";
        }
    } else {
        message.textContent = "Você bateu na parede!";
    }

    renderWorld();
}


document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            moveAgent(-1, 0);
            break;
        case "ArrowDown":
            moveAgent(1, 0);
            break;
        case "ArrowLeft":
            moveAgent(0, -1);
            break;
        case "ArrowRight":
            moveAgent(0, 1);
            break;
    }
});
