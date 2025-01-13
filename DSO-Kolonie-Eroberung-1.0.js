// ==UserScript==
// @name         Community Overlay Template mit Berechnungslogik
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Basis-Template für Community Overlays mit Drag & Drop und Berechnungslogik
// @author       YourName
// @match        https://www.diesiedleronline.de/de/spielen
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    // ===== HTML BEREICH BEISPIEL =====
    const html = `
        <div id="community-overlay">
            <div id="overlay-header">
                <div class="header-left">
                    <span class="overlay-title">Community Overlay</span>
                    <span class="overlay-version">v1.1</span>
                </div>
                <div class="header-right">
                    <button id="overlay-minimize">_</button>
                    <button id="overlay-close">×</button>
                </div>
            </div>
            <div id="overlay-content">
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
                        <tr><td>Raufbolde</td><td><select class="numberSelect"></select></td><td>Angriffsbogenschützen</td><td></td></tr>
                        <tr><td>Wachhunde</td><td><select class="numberSelect"></select></td><td>Schwere Bogenschützen<br>Schwere Infanterie<br>Schwere Reiterei<br>Wachmann</td><td></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // ===== CSS BEREICH =====
    const css = `
        /* Basis Styling */
        #community-overlay {
            position: fixed;
            top: 50px;
            left: 50px;
            width: auto;
            max-width: 90%;
            background: rgba(32, 34, 37, 0.95);
            border: 1px solid #40444b;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            color: #dcddde;
            font-family: Arial, sans-serif;
            z-index: 9999;
            user-select: none;
            overflow: hidden;
        }

        #overlay-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #2f3136;
            border-bottom: 1px solid #40444b;
            border-radius: 8px 8px 0 0;
            cursor: move;
        }

        #kampfliste-overlay {
            width: 100%;
            border-collapse: collapse;
            color: #ffffff;
        }

        #kampfliste-overlay th, #kampfliste-overlay td {
            border: 1px solid #ccc;
            padding: 4px;
            text-align: center;
        }

        #kampfliste-overlay th {
            background-color: #555;
        }

        select {
            width: 100%;
            padding: 4px;
        }
    `;

    function initializeOverlay() {
        // Basis-Setup des Overlays
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        const overlayContainer = document.createElement('div');
        overlayContainer.innerHTML = html;
        document.body.appendChild(overlayContainer);

        // Elemente
        const overlay = document.getElementById('community-overlay');
        const header = document.getElementById('overlay-header');
        const minimizeBtn = document.getElementById('overlay-minimize');
        const closeBtn = document.getElementById('overlay-close');
        const content = document.getElementById('overlay-content');

        // ===== BERECHNUNGSLOGIK =====
        function initializeDropdownLogic() {
            const enemyConfig = {
                "Räuberbogenschützen": { values: [20, 48, 38, 47, 56, 65] },
                "Räuberrekruten": { values: [20, 26, 32, 38, 44, 50] },
                "Raufbolde": { values: [20, 31, 42, 53, 64, 75] },
                "Wachhunde": { // habe ich nicht verstanden, nach deiner berechnung habe ich diese Logic! Sonst wie andere Einheiten bitte!
                    values: [ // anzeige demnach falsch bitte ohne <br>
                        "10<br>10<br>10<br>10",
                        "16<br>16<br>16<br>14",
                        "22<br>22<br>22<br>18"
                    ],
                    maxValue: 150,
                    step: 10
                },
            };

            function createDropdownOptions() {
                const rows = document.querySelectorAll("#kampfliste-overlay tbody tr");

                rows.forEach((row) => {
                    const enemyName = row.cells[0].textContent.trim();
                    const select = row.cells[1].querySelector(".numberSelect");
                    const cell4 = row.cells[3];

                    const config = enemyConfig[enemyName];
                    if (!config) return;

                    const maxValue = config.maxValue || 120;
                    const step = config.step || 20;

                    for (let i = step; i <= maxValue; i += step) {
                        const option = document.createElement("option");
                        option.value = i;
                        option.textContent = i;
                        select.appendChild(option);
                    }

                    select.addEventListener("change", () => {
                        const selectedValue = parseInt(select.value);
                        const values = config.values;

                        if (Array.isArray(values)) {
                            cell4.textContent = values[Math.floor(selectedValue / step) - 1] || values[0];
                        } else {
                            cell4.innerHTML = values;
                        }
                    });

                    select.dispatchEvent(new Event("change"));
                });
            }

            createDropdownOptions();
        }

        initializeDropdownLogic();

        // ===== BASIS-FUNKTIONEN ===== FINGER WEG ===== !
        let isDragging = false;
        let currentX = parseInt(localStorage.getItem('overlayX') || '50');
        let currentY = parseInt(localStorage.getItem('overlayY') || '50');
        let initialX, initialY;

        overlay.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                overlay.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('overlayX', currentX.toString());
                localStorage.setItem('overlayY', currentY.toString());
            }
        });

        minimizeBtn.addEventListener('click', () => {
            const isMinimized = content.style.display === 'none';
            content.style.display = isMinimized ? 'block' : 'none';
            minimizeBtn.textContent = isMinimized ? '_' : '□';
        });

        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
    }

    // Overlay starten
    initializeOverlay();
})();
