let ostatniaA = [];
let ostatniaB = [];
let historia =
    JSON.parse(localStorage.getItem("historia")) || [];
    wyswietlHistorie();

function wyswietlHistorie() {

    document.getElementById("history").innerHTML =
        historia
            .map(h => `<li>${h}</li>`)
            .join("");

}
let players = [];

fetch("players.json")
.then(response => response.json())
.then(data => {
    players = data;
    pokazZawodnikow();
});

function pokazZawodnikow() {

    const div = document.getElementById("players");

    players.forEach((player,index) => {

        div.innerHTML += `
        <div>
            <input type="checkbox"
                   id="p${index}">
           <label>
${player.name}
</label>
        </div>
        `;
    });
}

function losujDruzyny() {

    const obecni = [];

    players.forEach((player, index) => {

        if (document.getElementById(`p${index}`).checked) {
            obecni.push(player);
        }

    });

    if (obecni.length < 2) {
        alert("Zaznacz co najmniej 2 zawodników");
        return;
    }

    let najlepszaA = [];
    let najlepszaB = [];
    let najmniejszaRoznica = 9999;

    for (let i = 0; i < 1000; i++) {

        const mieszani = [...obecni];

        mieszani.sort(() => Math.random() - 0.5);

        const teamA = [];
        const teamB = [];

        let sumaA = 0;
        let sumaB = 0;

        mieszani.forEach(player => {

            if (sumaA <= sumaB) {
                teamA.push(player);
                sumaA += player.level;
            } else {
                teamB.push(player);
                sumaB += player.level;
            }

        });

        const roznica = Math.abs(sumaA - sumaB);

        if (roznica < najmniejszaRoznica) {

            najmniejszaRoznica = roznica;
            najlepszaA = [...teamA];
            najlepszaB = [...teamB];

        }
    }

    document.getElementById("teamA").innerHTML =
        najlepszaA.map(p => `<li>${p.name}</li>`).join("");

    document.getElementById("teamB").innerHTML =
        najlepszaB.map(p => `<li>${p.name}</li>`).join("");
        ostatniaA = najlepszaA;
ostatniaB = najlepszaB;
        const wpis =
    new Date().toLocaleString() +
    " | A: " +
    najlepszaA.map(p => p.name).join(", ") +
    " | B: " +
    najlepszaB.map(p => p.name).join(", ");

historia.unshift(wpis);

localStorage.setItem(
    "historia",
    JSON.stringify(historia)
);

wyswietlHistorie();


}
function wyczyscHistorie() {

    historia = [];

    localStorage.removeItem("historia");

    document.getElementById("history").innerHTML = "";

}
function zaznaczWszystkich() {

    players.forEach((player, index) => {

        document.getElementById(`p${index}`).checked = true;

    });

}
function odznaczWszystkich() {

    players.forEach((player, index) => {

        document.getElementById(`p${index}`).checked = false;

    });

}
function wyslijWhatsApp() {

    if (ostatniaA.length === 0) {

        alert("Najpierw wylosuj drużyny");

        return;
    }

    let tekst =
`🏐 LOSOWANIE SKŁADÓW

🟢 ZIELONI

${ostatniaA.map(p => p.name).join("\n")}

🟡 ZŁOCI

${ostatniaB.map(p => p.name).join("\n")}
`;

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(tekst),
        "_blank"
    );
}

function dodajZawodnika() {

    const nazwa = prompt("Podaj imię i nazwisko zawodnika");

    if (!nazwa) return;

    const poziom = Number(prompt("Podaj poziom zawodnika (1-6)"));

    if (isNaN(poziom)) return;

    players.push({
        name: nazwa,
        level: poziom
    });

    document.getElementById("players").innerHTML = "";

    pokazZawodnikow();

    document.getElementById(
        `p${players.length - 1}`
    ).checked = true;

}
