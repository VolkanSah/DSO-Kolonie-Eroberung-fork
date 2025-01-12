// ==UserScript==
// @name         DSO-Kolonie-Eroberung
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zeigt die Kampfliste als rechtsbündiges Overlay an, ohne die Originalwebsite zu beeinflussen. Verschiebbar und mit Schließen-Button.
// @author       Cali
// @match        https://www.diesiedleronline.de/de/spielen
// @grant        none
// ==/UserScript==
// date: 2025-01-10

(function () {
    'use strict';

    // HTML für die Tabelle erstellen
    const html = `
        <div id="kampfliste-container">
            <div id="kampfliste-header">
                <div id="kampfliste-title">DSO-Kolonie-Eroberung</div>
                <div id="kampfliste-buttons">
                    <button id="button-move-up">▲</button>
                    <button id="button-move-down">▼</button>
                    <button id="button-close">X</button>
                </div>
            </div>
            <table id="kampfliste-overlay">
                <thead>
                    <tr>
                        <th>Gegner</th>
                        <th>Anzahl</th>
                        <th>Kampfeinheiten</th>
                        <th>Anzahl</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Räuberbogenschützen</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Räuberrekruten</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Räuberreiterei</td><td><select class="numberSelect"></select></td><td>Angriffsinfanterie</td><td></td></tr>
                    <tr><td>Raufbolde</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Schläger</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Räuberlangbogenschützen</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Söldnerreiterei</td><td><select class="numberSelect"></select></td><td>Angriffsinfanterie</td><td></td></tr>
                    <tr><td>Söldnerbogenschützen</td><td><select class="numberSelect"></select></td><td>Angriffsinfanterie</td><td></td></tr>
                    <tr><td>Söldnerinfanterie</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Söldnerstreitrosse</td><td><select class="numberSelect"></select></td><td>Angriffsinfanterie</td><td></td></tr>
                    <tr><td>Söldnerscharfschützen</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Söldnerduellanten</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Chuck</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Wilde Waltraut</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Metallgebiss</td><td><select class="numberSelect"></select></td><td>Angriffsinfanterie</td><td></td></tr>
                    <tr><td>Einäugiger Bert</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Stinktier</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Graubart</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                    <tr><td>Der Schatten</td><td><select class="numberSelect"></select></td><td>Angriffsreiterei</td><td></td></tr>
                    <tr><td>Narbe</td><td><select class="numberSelect"></select></td><td>Angriffsinfanterie</td><td></td></tr>
                    <tr><td>Drak der Verschlinger</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen<br>Angriffsinfanterie<br>Angriffsreiterei</td><td><br></td></tr>
                    <tr><td>Wachhunde</td><td><select class="numberSelect"></select></td><td>Schwere Bogenschützen<br>Schwere Infanterie<br>Schwere Reiterei<br>Wachmann</td><td></td></tr>
                </tbody>
            </table>
        </div>
    `;

    // CSS-Styling für die Tabelle
    const css = `
#kampfliste-container {
    position: fixed;
    top: 50px;
    right: 50px;
    width: 20vw; /* Adjust width as needed */
    max-height: 90vh; /* Ensure it fits within the viewport */
    background-color: rgba(0, 0, 0, 0.9);
    color: red;
    border: 1px solid #ccc;
    z-index: 9999;
    font-size: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: auto;
}

#kampfliste-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #444;
    color: cyan;
    padding: 5px 10px;
    cursor: move;
}

#kampfliste-title {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
}

#kampfliste-overlay {
    width: 100%;
    border-collapse: collapse;
    overflow-y: auto; /* Make the table scrollable */
}

#kampfliste-overlay th, #kampfliste-overlay td {
    border: 1px solid black;
    padding: 4px;
    text-align: left;
}

#kampfliste-overlay th {
    background-color: #555;
}

#kampfliste-buttons {
    display: flex;
    gap: 5px;
}

#button-move-up, #button-move-down {
    background: green;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
}

#button-move-up:hover, #button-move-down:hover {
    background: gold;
    color: green;
}

#button-close {
    background: red;
    color: white;
    border: none;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    width: 48px;
}

#button-close:hover {
    background: orange;
    color: green;
}

select {
    width: 100%;
    padding: 5px;
    background-color: #fff;
}

    `;

    // CSS zur Seite hinzufügen
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // HTML zur Seite hinzufügen
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // Schließen-Button Funktionalität
    document.getElementById('button-close').addEventListener('click', () => {
        document.getElementById('kampfliste-container').remove();
    });

    // Verschieben der Tabelle
    const containerDiv = document.getElementById('kampfliste-container');
    const tableHeader = containerDiv.querySelector('thead'); // Wählt den Tabellenkopf aus
    const moveUpButton = document.getElementById('button-move-up');
    const moveDownButton = document.getElementById('button-move-down');

    moveUpButton.addEventListener('click', () => {
        const currentTop = parseInt(window.getComputedStyle(containerDiv).top, 10);
        containerDiv.style.top = `${Math.max(currentTop - 1000, 0)}px`; // Nach oben verschieben
    });

    moveDownButton.addEventListener('click', () => {
        const currentTop = parseInt(window.getComputedStyle(containerDiv).top, 10);
        const headerHeight = tableHeader.offsetHeight;
        const maxHeight = window.innerHeight - headerHeight-20; // Begrenzung auf Höhe der Tabellenleiste
        containerDiv.style.top = `${Math.min(currentTop + 1000, maxHeight)}px`; // Nach unten verschieben
    });

    // Funktion zum Anpassen der Sichtbarkeit des Tabelleninhalts
    function adjustTableVisibility() {
        const containerRect = containerDiv.getBoundingClientRect();
        const headerRect = tableHeader.getBoundingClientRect();

        if (containerRect.top + headerRect.height >= window.innerHeight) {
            containerDiv.style.height = `${headerRect.height}px`;
        } else {
            containerDiv.style.height = ''; // Zurücksetzen auf Standardhöhe
        }
}

    // Event-Listener für das Verschieben und Anpassen der Sichtbarkeit
    moveUpButton.addEventListener('click', adjustTableVisibility);
    moveDownButton.addEventListener('click', adjustTableVisibility);

    // Drag & Drop Funktionalität
    const header = document.getElementById('kampfliste-header');

    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - containerDiv.offsetLeft;
        offsetY = e.clientY - containerDiv.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            containerDiv.style.left = `${e.clientX - offsetX}px`;
            containerDiv.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Dropdown-Optionen und Logik (wie in deinem bestehenden Code)
    function createDropdownOptions() {
        const rows = document.querySelectorAll("tbody tr");
        rows.forEach((row, index) => {
            const select = row.cells[1].querySelector(".numberSelect");
                if (index >= 21) { // Berechnung Zeile 22 (Wachhunde)
                    for (let i = 10; i <= 150; i += 10) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.textContent = i;
                        select.appendChild(option);
                    }
                }
                  else if (index >= 20) { // Berechnung Zeile 21 (Drak der Verschlinger)
                    for (let i = 1; i <= 5; i++) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.textContent = i;
                        select.appendChild(option);
                    }
                }
                  else if (index >= 12) { // Berechnung ab Zeile 13 (Chuck)
                    for (let i = 1; i <= 5; i++) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.textContent = i;
                        select.appendChild(option);
                    }
                }
                  else {
                    for (let i = 20; i <= 120; i += 20) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.textContent = i;
                        select.appendChild(option);
                    }
                  }
                select.addEventListener('change', updateColumn4);
                updateColumn4({ target: select }); // Initial update

        });

    }
        function updateColumn4(event) {
            const select = event.target;
            const selectedValue = parseInt(select.value);
            const row = select.parentElement.parentElement;
            const cell4 = row.cells[3];

            // Überprüfen ob es die Zeile für Räuberbogenschützen, Räuberreiterei oder Schläger ist
            if (["Räuberbogenschützen", "Räuberreiterei", "Schläger"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 20:
                        cell4.textContent = 20;
                        break;
                    case 40:
                        cell4.textContent = 48;
                        break;
                    case 60:
                        cell4.textContent = 38;
                        break;
                    case 80:
                        cell4.textContent = 47;
                        break;
                    case 100:
                        cell4.textContent = 56;
                        break;
                    case 120:
                        cell4.textContent = 65;
                        break;
                    default:
                        cell4.textContent = '20';
                        break;
                }
            }

            // Überprüfen ob es die Zeile für Räuberrekruten ist
            if (row.cells[0].textContent === "Räuberrekruten") {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 20:
                        cell4.textContent = 20;
                        break;
                    case 40:
                        cell4.textContent = 26;
                        break;
                    case 60:
                        cell4.textContent = 32;
                        break;
                    case 80:
                        cell4.textContent = 38;
                        break;
                    case 100:
                        cell4.textContent = 44;
                        break;
                    case 120:
                        cell4.textContent = 50;
                        break;
                    default:
                        cell4.textContent = '20';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Raufbolde, Söldnerstreitrosse, Söldnerscharfschützen oder Söldnerduellanten"ist
            if (["Raufbolde", "Söldnerstreitrosse", "Söldnerscharfschützen", "Söldnerduellanten"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 20:
                        cell4.textContent = 20;
                        break;
                    case 40:
                        cell4.textContent = 31;
                        break;
                    case 60:
                        cell4.textContent = 42;
                        break;
                    case 80:
                        cell4.textContent = 53;
                        break;
                    case 100:
                        cell4.textContent = 64;
                        break;
                    case 120:
                        cell4.textContent = 75;
                        break;
                    default:
                        cell4.textContent = '20';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Räuberlangbogenschützen ist
            if (row.cells[0].textContent === "Räuberlangbogenschützen") {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 20:
                        cell4.textContent = 20;
                        break;
                    case 40:
                        cell4.textContent = 32;
                        break;
                    case 60:
                        cell4.textContent = 44;
                        break;
                    case 80:
                        cell4.textContent = 56;
                        break;
                    case 100:
                        cell4.textContent = 68;
                        break;
                    case 120:
                        cell4.textContent = 80;
                        break;
                    default:
                        cell4.textContent = '20';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Söldnerreiterei, Söldnerbogenschützen oder Söldnerinfanterie ist
            if (["Söldnerreiterei", "Söldnerbogenschützen", "Söldnerinfanterie"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 20:
                        cell4.textContent = 20;
                        break;
                    case 40:
                        cell4.textContent = 34;
                        break;
                    case 60:
                        cell4.textContent = 48;
                        break;
                    case 80:
                        cell4.textContent = 62;
                        break;
                    case 100:
                        cell4.textContent = 76;
                        break;
                    case 120:
                        cell4.textContent = 90;
                        break;
                    default:
                        cell4.textContent = '20';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Chuck ist
            if (["Chuck"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.textContent = 20;
                        break;
                    case 2:
                        cell4.textContent = 34;
                        break;
                    case 3:
                        cell4.textContent = 48;
                        break;
                    case 4:
                        cell4.textContent = 62;
                        break;
                    case 5:
                        cell4.textContent = 76;
                        break;
                     default:
                        cell4.textContent = '1';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Wilde Waltraut ist
            if (["Wilde Waltraut"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.textContent = 20;
                        break;
                    case 2:
                        cell4.textContent = 25;
                        break;
                    case 3:
                        cell4.textContent = 30;
                        break;
                    case 4:
                        cell4.textContent = 35;
                        break;
                    case 5:
                        cell4.textContent = 40;
                        break;
                     default:
                        cell4.textContent = '20';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Metallgebiss, Einäugiger Bert oder Stinktier ist
            if (["Metallgebiss", "Einäugiger Bert", "Stinktier"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.textContent = 20;
                        break;
                    case 2:
                        cell4.textContent = 31;
                        break;
                    case 3:
                        cell4.textContent = 42;
                        break;
                    case 4:
                        cell4.textContent = 53;
                        break;
                    case 5:
                        cell4.textContent = 64;
                        break;
                     default:
                        cell4.textContent = '20';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Graubart ist
            if (["Graubart"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.textContent = 40;
                        break;
                    case 2:
                        cell4.textContent = 64;
                        break;
                    case 3:
                        cell4.textContent = 88;
                        break;
                    case 4:
                        cell4.textContent = 112;
                        break;
                    case 5:
                        cell4.textContent = 136;
                        break;
                     default:
                        cell4.textContent = '40';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Der Schatten ist
            if (["Der Schatten"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.textContent = 40;
                        break;
                    case 2:
                        cell4.textContent = 67;
                        break;
                    case 3:
                        cell4.textContent = 94;
                        break;
                    case 4:
                        cell4.textContent = 121;
                        break;
                    case 5:
                        cell4.textContent = 148;
                        break;
                     default:
                        cell4.textContent = '40';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Narbe ist
            if (["Narbe"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.textContent = 40;
                        break;
                    case 2:
                        cell4.textContent = 62;
                        break;
                    case 3:
                        cell4.textContent = 84;
                        break;
                    case 4:
                        cell4.textContent = 106;
                        break;
                    case 5:
                        cell4.textContent = 128;
                        break;
                     default:
                        cell4.textContent = '40';
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Drak der Verschlinger ist
            if (["Drak der Verschlinger"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 1:
                        cell4.innerHTML = "60<br>60<br>60";
                        break;
                    case 2:
                        cell4.innerHTML = "104<br>104<br>104";
                        break;
                    case 3:
                        cell4.innerHTML = "148<br>148<br>148";
                        break;
                    case 4:
                        cell4.innerHTML = "192<br>192<br>192";
                        break;
                    case 5:
                        cell4.innerHTML = "236<br>236<br>236";
                        break;
                     default:
                        cell4.innerHTML = "60<br>60<br>60";
                        break;
                }
            }
            // Überprüfen ob es die Zeile für Wachhunde ist
            if (["Wachhunde"].includes(row.cells[0].textContent)) {
                // Setze die entsprechenden Werte in Spalte 4
                switch (selectedValue) {
                    case 10:
                        cell4.innerHTML = "10<br>10<br>10<br>10";
                        break;
                    case 20:
                        cell4.innerHTML = "16<br>16<br>16<br>14";
                        break;
                    case 30:
                        cell4.innerHTML = "22<br>22<br>22<br>18";
                        break;
                    case 40:
                        cell4.innerHTML = "28<br>28<br>28<br>22";
                        break;
                    case 50:
                        cell4.innerHTML = "34<br>34<br>34<br>26";
                        break;
                    case 60:
                        cell4.innerHTML = "40<br>40<br>40<br>30";
                        break;
                    case 70:
                        cell4.innerHTML = "46<br>46<br>46<br>34";
                        break;
                    case 80:
                        cell4.innerHTML = "52<br>52<br>52<br>38";
                        break;
                    case 90:
                        cell4.innerHTML = "58<br>58<br>58<br>42";
                        break;
                    case 100:
                        cell4.innerHTML = "64<br>64<br>64<br>46";
                        break;
                    case 110:
                        cell4.innerHTML = "70<br>70<br>70<br>50";
                        break;
                    case 120:
                        cell4.innerHTML = "76<br>76<br>76<br>54";
                        break;
                    case 130:
                        cell4.innerHTML = "82<br>82<br>82<br>58";
                        break;
                    case 140:
                        cell4.innerHTML = "88<br>88<br>88<br>62";
                        break;
                    case 150:
                        cell4.innerHTML = "94<br>94<br>94<br>66";
                        break;
                     default:
                        cell4.innerHTML = "10<br>10<br>10<br>10";
                        break;
                }
            }
        }

    createDropdownOptions();
})();
