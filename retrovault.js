function searchGame() {
    const form = document.getElementById("game-form");

    if (!form.reportValidity()) {
        return;
    }

    const search = document.getElementById("game-search").value.trim();

    if (search.length < 2) {
        document.getElementById("search-status").textContent =
            "Please enter at least two characters.";
        return;
    }

    const platform = document.getElementById("game-platform").value;
    fetch("https://retrobase-collection.com/api/public/v1/games?search="
        + search + "&platform=" + platform)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
            }
            return response.json();
        })
        .then(result => {
            const gameDetails = document.getElementById("game-details");
            gameDetails.innerHTML = "";
            console.log(result);

            const game = result.data.find(
                game => game.name.toLowerCase() === search.toLowerCase()
            );

            if (game) {
                document.getElementById("search-status").textContent =
                    "Game found: " + game.name;
                document.getElementById("artwork-panel").hidden = false;
                document.getElementById("synopsis-panel").hidden = false;
                document.getElementById("bottomsection").classList.add("resizefont");
                document.getElementById("gametitle").textContent = game.name;
                document.getElementById("gameplatform").textContent =
                    game.platform?.name ?? "Unknown platform";
                document.getElementById("gameyear").textContent = game.year;
                document.getElementById("gamepublisher").textContent = game.publisher;
                document.getElementById("gamedeveloper").textContent = game.developer;
                document.getElementById("gamegenre").textContent = game.genre;
                document.getElementById("game-info").hidden = false;

                const cover = game.media?.find(image =>
                    image.type === "box-2D" && image.region === "eu"
                );

                const artwork = document.getElementById("game-artwork");
                artwork.innerHTML = "";

                if (cover) {
                    const image = document.createElement("img");
                    image.src = cover.url;
                    image.alt = "Box artwork for " + game.name;

                    artwork.appendChild(image);
                } else {
                    artwork.textContent = "NO ARTWORK AVAILABLE";
                }

                const synopsis = document.getElementById("game-synopsis");
                synopsis.innerHTML = ""

                if (game.synopses?.en) {
                    synopsis.textContent = game.synopses.en;
                } else {
                    synopsis.textContent = "No synopsis available.";
                }

            } else {

                document.getElementById("search-status").textContent =
                    "No matching game found.";

                if (search === "") {
                    document.getElementById("gametitle").textContent = "You must enter a game title to search.";
                } else {
                    document.getElementById("gametitle").textContent = "GAME NOT FOUND";
                }

                document.getElementById("gameplatform").textContent = "";
                document.getElementById("gameyear").textContent = "";
                document.getElementById("gamepublisher").textContent = "";
                document.getElementById("gamedeveloper").textContent = "";
                document.getElementById("gamegenre").textContent = "";
                document.getElementById("game-artwork").innerHTML = "";
                document.getElementById("game-synopsis").textContent = "";
                document.getElementById("artwork-panel").hidden = true;
                document.getElementById("synopsis-panel").hidden = true;
                document.getElementById("game-info").hidden = true;

            }

        })
        .catch(error => {
            console.error("Error fetching game data:", error);

            document.getElementById("search-status").textContent =
                "Unable to retrieve game information. Please try again.";
        });
}
function clearGameDetails() {
    const gameDetails = document.getElementById("game-details");
    gameDetails.innerHTML = "";
    const searchInput = document.getElementById("game-search");
    searchInput.value = "";
    document.getElementById("bottomsection").classList.remove("resizefont");
    document.getElementById("gametitle").textContent = "Featured Games";
    document.getElementById("gameplatform").textContent = "Check out our collection of classic games!";
    document.getElementById("gameyear").textContent = "";
    document.getElementById("gamepublisher").textContent = "";
    document.getElementById("gamedeveloper").textContent = "";
    document.getElementById("gamegenre").textContent = "";
    document.getElementById("game-artwork").innerHTML = "";
    document.getElementById("game-synopsis").textContent = "";
    document.getElementById("artwork-panel").hidden = true;
    document.getElementById("synopsis-panel").hidden = true;
    document.getElementById("game-info").hidden = true;
    document.getElementById("search-status").textContent = "";
}

const input = document.getElementById("game-search");
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("redbutton").click();
    }

    if (event.key === "Escape") {
        event.preventDefault();
        document.getElementById("greenbutton").click();
    }
});