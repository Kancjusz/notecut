export function showGrid()
{
    let grid = [].slice.call(document.getElementsByClassName("tile"));

    if(!Array.isArray(grid)) return;

    grid.forEach(element => {
        element.classList.add("grid");
    });
}

export function hideGrid()
{
    let grid = [].slice.call(document.getElementsByClassName("tile"));

    if(!Array.isArray(grid)) return;

    grid.forEach(element => {
        element.classList.remove("grid");
    });
}