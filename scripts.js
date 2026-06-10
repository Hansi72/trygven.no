//Todo loop all elements instead
function speedUp() {
    objects[0].direction = { x: objects[1].direction.x * 2, y: objects[1].direction.y * 2 };
    objects[1].direction = { x: objects[1].direction.x * 2, y: objects[1].direction.y * 2 };
    objects[2].direction = { x: objects[2].direction.x * 2, y: objects[2].direction.y * 2 };
    objects[3].direction = { x: objects[3].direction.x * 2, y: objects[3].direction.y * 2 };
}
document.getElementById("kiwi").onclick = speedUp;