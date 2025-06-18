async function getMoveData() {
    const response = await fetch("https://pokeapi.co/api/v2/move/55");

    if (!response.ok) {
        throw new Error(`Response status bad: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
}

getMoveData();
