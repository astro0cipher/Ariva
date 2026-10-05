/* =========================================
   AME COMMAND CENTER
   SECTION 04
   PLAYER + MATCH ENGINE
========================================= */


/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "ame_command_center_data";

const defaultData = {
    players: [],
    matches: [],
    scrims: [],
    tournaments: [],
    strategies: []
};


function loadData() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return structuredClone(defaultData);
        }

        const parsed = JSON.parse(saved);

        return {
            ...structuredClone(defaultData),
            ...parsed
        };

    } catch (error) {

        console.error("Data loading failed:", error);

        return structuredClone(defaultData);

    }

}


let appData = loadData();


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
    );

}


/* =========================
   SAFE ID
========================= */

function createId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================
   NAVIGATION
========================= */

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");

const sidebar =
    document.getElementById("sidebar");

const mobileMenu =
    document.getElementById("mobileMenu");


function showPage(pageId) {

    pages.forEach((page) => {

        page.classList.remove("active");

    });


    navItems.forEach((item) => {

        item.classList.remove("active");

    });


    const page =
        document.getElementById(pageId);


    const button =
        document.querySelector(
            `.nav-item[data-page="${pageId}"]`
        );


    if (page) {
        page.classList.add("active");
    }


    if (button) {
        button.classList.add("active");
    }


    if (sidebar) {
        sidebar.classList.remove("open");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach((item) => {

    item.addEventListener("click", () => {

        showPage(item.dataset.page);

    });

});


if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {

        if (sidebar) {
            sidebar.classList.toggle("open");
        }

    });

}


/* =========================
   PLAYER MODAL
========================= */

const playerModal =
    document.getElementById("playerModal");

const playerForm =
    document.getElementById("playerForm");

const playerModalTitle =
    document.getElementById("playerModalTitle");

const playerIdInput =
    document.getElementById("playerId");

const playerIgnInput =
    document.getElementById("playerIgn");

const playerJerseyInput =
    document.getElementById("playerJersey");

const playerRoleInput =
    document.getElementById("playerRole");

const playerSecondaryRoleInput =
    document.getElementById("playerSecondaryRole");

const playerStatusInput =
    document.getElementById("playerStatus");

const playerJoinDateInput =
    document.getElementById("playerJoinDate");

const playerNotesInput =
    document.getElementById("playerNotes");

const playerFormError =
    document.getElementById("playerFormError");


function openPlayerModal(player = null) {

    if (!playerForm || !playerModal) {
        return;
    }


    playerForm.reset();


    if (playerFormError) {
        playerFormError.textContent = "";
    }


    if (player) {

        if (playerModalTitle) {
            playerModalTitle.textContent = "Edit Player";
        }

        if (playerIdInput) {
            playerIdInput.value = player.id;
        }

        if (playerIgnInput) {
            playerIgnInput.value = player.ign || "";
        }

        if (playerJerseyInput) {
            playerJerseyInput.value = player.jersey || "";
        }

        if (playerRoleInput) {
            playerRoleInput.value = player.role || "";
        }

        if (playerSecondaryRoleInput) {
            playerSecondaryRoleInput.value =
                player.secondaryRole || "";
        }

        if (playerStatusInput) {
            playerStatusInput.value =
                player.status || "active";
        }

        if (playerJoinDateInput) {
            playerJoinDateInput.value =
                player.joinDate || "";
        }

        if (playerNotesInput) {
            playerNotesInput.value =
                player.notes || "";
        }

    } else {

        if (playerModalTitle) {
            playerModalTitle.textContent = "Add Player";
        }

        if (playerIdInput) {
            playerIdInput.value = "";
        }

    }


    playerModal.classList.add("open");

}


function closePlayerModal() {

    if (!playerModal) {
        return;
    }

    playerModal.classList.remove("open");

}


const openAddPlayerButton =
    document.getElementById("openAddPlayer");

const emptyAddPlayerButton =
    document.getElementById("emptyAddPlayer");

const closePlayerButton =
    document.getElementById("closePlayerModal");

const cancelPlayerButton =
    document.getElementById("cancelPlayer");


if (openAddPlayerButton) {

    openAddPlayerButton.addEventListener(
        "click",
        () => openPlayerModal()
    );

}


if (emptyAddPlayerButton) {

    emptyAddPlayerButton.addEventListener(
        "click",
        () => openPlayerModal()
    );

}


if (closePlayerButton) {

    closePlayerButton.addEventListener(
        "click",
        closePlayerModal
    );

}


if (cancelPlayerButton) {

    cancelPlayerButton.addEventListener(
        "click",
        closePlayerModal
    );

}


if (playerModal) {

    playerModal.addEventListener(
        "click",
        (event) => {

            if (event.target === playerModal) {
                closePlayerModal();
            }

        }
    );

}


/* =========================
   SAVE PLAYER
========================= */

if (playerForm) {

    playerForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const ign =
                playerIgnInput
                    ? playerIgnInput.value.trim()
                    : "";

            const jersey =
                playerJerseyInput
                    ? playerJerseyInput.value.trim()
                    : "";

            const role =
                playerRoleInput
                    ? playerRoleInput.value.trim()
                    : "";

            const secondaryRole =
                playerSecondaryRoleInput
                    ? playerSecondaryRoleInput.value.trim()
                    : "";

            const status =
                playerStatusInput
                    ? playerStatusInput.value
                    : "active";

            const joinDate =
                playerJoinDateInput
                    ? playerJoinDateInput.value
                    : "";

            const notes =
                playerNotesInput
                    ? playerNotesInput.value.trim()
                    : "";


            if (!ign || !jersey || !role) {

                if (playerFormError) {
                    playerFormError.textContent =
                        "IGN, Jersey Number and Primary Role are required.";
                }

                return;

            }


            const existingId =
                playerIdInput
                    ? playerIdInput.value
                    : "";


            const duplicate =
                appData.players.find(
                    (player) =>
                        player.ign.toLowerCase() ===
                            ign.toLowerCase() &&
                        player.id !== existingId
                );


            if (duplicate) {

                if (playerFormError) {
                    playerFormError.textContent =
                        "A player with this IGN already exists.";
                }

                return;

            }


            if (existingId) {

                const player =
                    appData.players.find(
                        (item) =>
                            item.id === existingId
                    );


                if (player) {

                    player.ign = ign;
                    player.jersey = jersey;
                    player.role = role;
                    player.secondaryRole = secondaryRole;
                    player.status = status;
                    player.joinDate = joinDate;
                    player.notes = notes;

                }

            } else {

                appData.players.push({

                    id: createId(),

                    ign,
                    jersey,
                    role,
                    secondaryRole,
                    status,
                    joinDate,
                    notes,

                    createdAt:
                        new Date().toISOString()

                });

            }


            saveData();

            renderPlayers();

            updateDashboard();

            updatePerformanceInputs();

            closePlayerModal();

        }
    );

}


/* =========================
   PLAYER STATS
========================= */

function getPlayerStats(playerId) {

    const matches =
        appData.matches.filter(
            (match) =>
                Array.isArray(match.playerPerformance) &&
                match.playerPerformance.some(
                    (item) =>
                        item.playerId === playerId
                )
        );


    let totalKills = 0;


    const performances =
        matches.map((match) => {

            const performance =
                (match.playerPerformance || []).find(
                    (item) =>
                        item.playerId === playerId
                );


            const kills =
                performance
                    ? Number(performance.kills || 0)
                    : 0;


            totalKills += kills;


            return {
                match,
                kills
            };

        });


    const averageKills =
        matches.length
            ? totalKills / matches.length
            : 0;


    const placements =
        matches
            .map((match) => Number(match.placement || 0))
            .filter((value) => value > 0);


    const averagePlacement =
        placements.length
            ? placements.reduce(
                (sum, value) => sum + value,
                0
            ) / placements.length
            : 0;


    let bestMatch = null;


    performances.forEach((item) => {

        if (!bestMatch) {

            bestMatch = item;

            return;

        }


        if (item.kills > bestMatch.kills) {

            bestMatch = item;

            return;

        }


        if (
            item.kills === bestMatch.kills &&
            Number(item.match.placement || 999) <
            Number(bestMatch.match.placement || 999)
        ) {

            bestMatch = item;

        }

    });


    const recent =
        [...performances]
            .sort(
                (a, b) =>
                    new Date(b.match.date) -
                    new Date(a.match.date)
            )
            .slice(0, 5);


    return {

        matches: matches.length,

        totalKills,

        averageKills,

        averagePlacement,

        bestMatch,

        recent

    };

}


/* =========================
   DELETE PLAYER
========================= */

function deletePlayer(playerId) {

    const player =
        appData.players.find(
            (item) =>
                item.id === playerId
        );


    if (!player) {
        return;
    }


    const hasMatchData =
        appData.matches.some(
            (match) =>
                Array.isArray(match.playerPerformance) &&
                match.playerPerformance.some(
                    (performance) =>
                        performance.playerId === playerId
                )
        );


    let message =
        `Delete ${player.ign} from the team?`;


    if (hasMatchData) {

        message +=
            "\n\nThis player has recorded match performance. Historical match data will remain.";

    }


    if (!confirm(message)) {
        return;
    }


    appData.players =
        appData.players.filter(
            (item) =>
                item.id !== playerId
        );


    saveData();

    renderPlayers();

    updatePerformanceInputs();

    updateDashboard();

}


/* =========================
   PLAYER PROFILE MODAL
========================= */

const playerProfileModal =
    document.getElementById("playerProfileModal");

const playerProfileContent =
    document.getElementById("playerProfileContent");

const closePlayerProfileButton =
    document.getElementById("closePlayerProfile");


function closePlayerProfile() {

    if (playerProfileModal) {
        playerProfileModal.classList.remove("open");
    }

}


function openPlayerProfile(playerId) {

    const player =
        appData.players.find(
            (item) =>
                item.id === playerId
        );


    if (!player) {
        return;
    }


    const stats =
        getPlayerStats(playerId);


    if (
        !playerProfileModal ||
        !playerProfileContent
    ) {
        return;
    }


    const bestMatchHTML =
        stats.bestMatch
            ? `
                <div class="profile-stat-card">
                    <span>BEST MATCH</span>
                    <strong>
                        ${stats.bestMatch.kills} K
                    </strong>
                    <small>
                        ${escapeHTML(
                            stats.bestMatch.match.map
                        )}
                        ·
                        #${escapeHTML(
                            stats.bestMatch.match.matchNumber
                        )}
                    </small>
                </div>
            `
            : `
                <div class="profile-stat-card">
                    <span>BEST MATCH</span>
                    <strong>—</strong>
                    <small>No match data</small>
                </div>
            `;


    const recentHTML =
        stats.recent.length
            ? stats.recent
                .map((item) => {

                    return `
                        <div class="profile-match-row">

                            <div>
                                <strong>
                                    ${escapeHTML(
                                        item.match.map
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        item.match.date
                                    )}
                                </small>
                            </div>

                            <div>
                                <strong>
                                    ${item.kills} K
                                </strong>

                                <small>
                                    #${item.match.placement}
                                </small>
                            </div>

                        </div>
                    `;

                })
                .join("")
            : `
                <div class="coming-soon">
                    No match performance yet.
                </div>
            `;


    playerProfileContent.innerHTML = `

        <div class="profile-header">

            <div>

                <span class="player-jersey">
                    #${escapeHTML(player.jersey)}
                </span>

                <h2>
                    ${escapeHTML(player.ign)}
                </h2>

                <p>
                    ${escapeHTML(player.role)}
                </p>

            </div>

        </div>


        <div class="profile-stats-grid">

            <div class="profile-stat-card">
                <span>MATCHES</span>
                <strong>
                    ${stats.matches}
                </strong>
            </div>

            <div class="profile-stat-card">
                <span>TOTAL KILLS</span>
                <strong>
                    ${stats.totalKills}
                </strong>
            </div>

            <div class="profile-stat-card">
                <span>AVG KILLS</span>
                <strong>
                    ${stats.averageKills.toFixed(2)}
                </strong>
            </div>

            <div class="profile-stat-card">
                <span>AVG PLACEMENT</span>
                <strong>
                    ${
                        stats.averagePlacement
                            ? stats.averagePlacement.toFixed(2)
                            : "—"
                    }
                </strong>
            </div>

            ${bestMatchHTML}

        </div>


        <div class="profile-section">

            <h3>Recent Performance</h3>

            <div class="profile-match-list">

                ${recentHTML}

            </div>

        </div>

    `;


    playerProfileModal.classList.add("open");

}


if (closePlayerProfileButton) {

    closePlayerProfileButton.addEventListener(
        "click",
        closePlayerProfile
    );

}


if (playerProfileModal) {

    playerProfileModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                playerProfileModal
            ) {
                closePlayerProfile();
            }

        }
    );

}


/* =========================
   PLAYER RENDER
========================= */

const playersList =
    document.getElementById("playersList");

const playersEmpty =
    document.getElementById("playersEmpty");

const playerCount =
    document.getElementById("playerCount");

const playerSearch =
    document.getElementById("playerSearch");


function renderPlayers() {

    if (!playersList) {
        return;
    }


    const search =
        playerSearch
            ? playerSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        appData.players.filter(
            (player) => {

                const searchable =
                    `${player.ign} ${player.role} ${player.jersey}`
                        .toLowerCase();

                return searchable.includes(search);

            }
        );


    playersList.innerHTML = "";


    if (playerCount) {

        playerCount.textContent =
            `${filtered.length} ${
                filtered.length === 1
                    ? "Player"
                    : "Players"
            }`;

    }


    if (filtered.length === 0) {

        playersList.style.display = "none";

        if (playersEmpty) {
            playersEmpty.style.display = "flex";
        }

        return;

    }


    playersList.style.display = "grid";

    if (playersEmpty) {
        playersEmpty.style.display = "none";
    }


    filtered.forEach((player) => {

        const stats =
            getPlayerStats(player.id);


        const card =
            document.createElement("article");


        card.className =
            "player-card";


        card.innerHTML = `

            <div class="player-card-top">

                <span class="player-jersey">
                    #${escapeHTML(player.jersey)}
                </span>

                <div class="player-actions">

                    <button
                        class="icon-button view-player"
                        data-id="${player.id}"
                        title="View profile"
                    >
                        View
                    </button>

                    <button
                        class="icon-button edit-player"
                        data-id="${player.id}"
                        title="Edit player"
                    >
                        ✎
                    </button>

                    <button
                        class="icon-button delete-player"
                        data-id="${player.id}"
                        title="Delete player"
                    >
                        ×
                    </button>

                </div>

            </div>


            <h3>
                ${escapeHTML(player.ign)}
            </h3>


            <p class="player-role">
                ${escapeHTML(player.role)}
            </p>


            <div class="player-meta">

                <span class="player-tag">
                    ${escapeHTML(
                        player.status || "active"
                    )}
                </span>

                ${
                    player.secondaryRole
                        ? `
                            <span class="player-tag">
                                ${escapeHTML(
                                    player.secondaryRole
                                )}
                            </span>
                        `
                        : ""
                }

            </div>


            <div class="player-quick-stats">

                <div>
                    <span>MATCHES</span>
                    <strong>${stats.matches}</strong>
                </div>

                <div>
                    <span>KILLS</span>
                    <strong>${stats.totalKills}</strong>
                </div>

                <div>
                    <span>AVG K</span>
                    <strong>
                        ${stats.averageKills.toFixed(2)}
                    </strong>
                </div>

            </div>

        `;


        playersList.appendChild(card);

    });


    attachPlayerActions();

}


function attachPlayerActions() {

    document
        .querySelectorAll(".view-player")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    openPlayerProfile(
                        button.dataset.id
                    );

                }
            );

        });


    document
        .querySelectorAll(".edit-player")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const player =
                        appData.players.find(
                            (item) =>
                                item.id ===
                                button.dataset.id
                        );


                    if (player) {
                        openPlayerModal(player);
                    }

                }
            );

        });


    document
        .querySelectorAll(".delete-player")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    deletePlayer(
                        button.dataset.id
                    );

                }
            );

        });

}


if (playerSearch) {

    playerSearch.addEventListener(
        "input",
        renderPlayers
    );

}


/* =========================
   MATCH MODAL
========================= */

const matchModal =
    document.getElementById("matchModal");

const matchForm =
    document.getElementById("matchForm");

const matchModalTitle =
    document.getElementById("matchModalTitle");

const matchIdInput =
    document.getElementById("matchId");

const matchTournamentInput =
    document.getElementById("matchTournament");

const matchDateInput =
    document.getElementById("matchDate");

const matchMapInput =
    document.getElementById("matchMap");

const matchNumberInput =
    document.getElementById("matchNumber");

const matchPlacementInput =
    document.getElementById("matchPlacement");

const matchPointsInput =
    document.getElementById("matchPoints");

const matchNotesInput =
    document.getElementById("matchNotes");

const playerPerformanceInputs =
    document.getElementById(
        "playerPerformanceInputs"
    );

const matchFormError =
    document.getElementById("matchFormError");


/* =========================
   OPEN MATCH MODAL
========================= */

function openMatchModal(match = null) {

    if (!matchModal || !matchForm) {

        console.error(
            "Match modal/form not found in HTML."
        );

        return;

    }


    matchForm.reset();


    if (matchFormError) {
        matchFormError.textContent = "";
    }


    if (match) {

        if (matchModalTitle) {
            matchModalTitle.textContent =
                "Edit Match";
        }

        if (matchIdInput) {
            matchIdInput.value =
                match.id;
        }

        if (matchTournamentInput) {
            matchTournamentInput.value =
                match.tournament || "";
        }

        if (matchDateInput) {
            matchDateInput.value =
                match.date || "";
        }

        if (matchMapInput) {
            matchMapInput.value =
                match.map || "";
        }

        if (matchNumberInput) {
            matchNumberInput.value =
                match.matchNumber || "";
        }

        if (matchPlacementInput) {
            matchPlacementInput.value =
                match.placement || "";
        }

        if (matchPointsInput) {
            matchPointsInput.value =
                match.points ?? "";
        }

        if (matchNotesInput) {
            matchNotesInput.value =
                match.notes || "";
        }

    } else {

        if (matchModalTitle) {
            matchModalTitle.textContent =
                "Add Match";
        }

        if (matchIdInput) {
            matchIdInput.value = "";
        }

        if (matchDateInput) {

            matchDateInput.value =
                new Date()
                    .toISOString()
                    .split("T")[0];

        }

    }


    updatePerformanceInputs(match);


    matchModal.classList.add("open");

}


/* =========================
   CLOSE MATCH MODAL
========================= */

function closeMatchModal() {

    if (!matchModal) {
        return;
    }

    matchModal.classList.remove("open");

}


/* =========================
   MATCH BUTTONS
========================= */

const openAddMatchButton =
    document.getElementById("openAddMatch");

const emptyAddMatchButton =
    document.getElementById("emptyAddMatch");

const closeMatchButton =
    document.getElementById("closeMatchModal");

const cancelMatchButton =
    document.getElementById("cancelMatch");


if (openAddMatchButton) {

    openAddMatchButton.addEventListener(
        "click",
        () => {

            openMatchModal();

        }
    );

}


if (emptyAddMatchButton) {

    emptyAddMatchButton.addEventListener(
        "click",
        () => {

            openMatchModal();

        }
    );

}


if (closeMatchButton) {

    closeMatchButton.addEventListener(
        "click",
        closeMatchModal
    );

}


if (cancelMatchButton) {

    cancelMatchButton.addEventListener(
        "click",
        closeMatchModal
    );

}


if (matchModal) {

    matchModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                matchModal
            ) {

                closeMatchModal();

            }

        }
    );

}


/* =========================
   PLAYER PERFORMANCE INPUTS
========================= */

function updatePerformanceInputs(match = null) {

    if (!playerPerformanceInputs) {
        return;
    }


    playerPerformanceInputs.innerHTML = "";


    if (appData.players.length === 0) {

        playerPerformanceInputs.innerHTML = `

            <div class="coming-soon">
                Add players first.
            </div>

        `;

        return;

    }


    appData.players.forEach((player) => {

        let previousKills = 0;


        if (
            match &&
            Array.isArray(match.playerPerformance)
        ) {

            const performance =
                match.playerPerformance.find(
                    (item) =>
                        item.playerId ===
                        player.id
                );


            if (performance) {

                previousKills =
                    Number(
                        performance.kills || 0
                    );

            }

        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "performance-input";


        wrapper.innerHTML = `

            <span>
                ${escapeHTML(player.ign)}
            </span>

            <input
                type="number"
                min="0"
                max="99"
                value="${previousKills}"
                data-player-id="${player.id}"
                class="player-kills-input"
            >

        `;


        playerPerformanceInputs.appendChild(
            wrapper
        );

    });

}


/* =========================
   SAVE MATCH
========================= */

if (matchForm) {

    matchForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (appData.players.length === 0) {

                if (matchFormError) {

                    matchFormError.textContent =
                        "Add at least one player before recording a match.";

                }

                return;

            }


            const tournament =
                matchTournamentInput
                    ? matchTournamentInput.value.trim()
                    : "";

            const date =
                matchDateInput
                    ? matchDateInput.value
                    : "";

            const map =
                matchMapInput
                    ? matchMapInput.value
                    : "";

            const matchNumber =
                matchNumberInput
                    ? Number(matchNumberInput.value)
                    : 0;

            const placement =
                matchPlacementInput
                    ? Number(matchPlacementInput.value)
                    : 0;

            const points =
                matchPointsInput
                    ? Number(matchPointsInput.value || 0)
                    : 0;

            const notes =
                matchNotesInput
                    ? matchNotesInput.value.trim()
                    : "";


            if (
                !date ||
                !map ||
                matchNumber <= 0 ||
                placement <= 0
            ) {

                if (matchFormError) {

                    matchFormError.textContent =
                        "Date, map, match number and placement are required.";

                }

                return;

            }


            const playerPerformance = [];


            document
                .querySelectorAll(
                    ".player-kills-input"
                )
                .forEach((input) => {

                    const kills =
                        Math.max(
                            0,
                            Number(input.value || 0)
                        );


                    playerPerformance.push({

                        playerId:
                            input.dataset.playerId,

                        kills

                    });

                });


            const totalPlayerKills =
                playerPerformance.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.kills || 0),
                    0
                );


            const existingId =
                matchIdInput
                    ? matchIdInput.value
                    : "";


            if (existingId) {

                const match =
                    appData.matches.find(
                        (item) =>
                            item.id ===
                            existingId
                    );


                if (!match) {

                    if (matchFormError) {

                        matchFormError.textContent =
                            "Match could not be found.";

                    }

                    return;

                }


                match.tournament =
                    tournament;

                match.date =
                    date;

                match.map =
                    map;

                match.matchNumber =
                    matchNumber;

                match.placement =
                    placement;

                match.points =
                    points;

                match.kills =
                    totalPlayerKills;

                match.playerPerformance =
                    playerPerformance;

                match.notes =
                    notes;

                match.updatedAt =
                    new Date().toISOString();


            } else {

                appData.matches.push({

                    id:
                        createId(),

                    tournament,

                    date,

                    map,

                    matchNumber,

                    placement,

                    points,

                    kills:
                        totalPlayerKills,

                    playerPerformance,

                    notes,

                    createdAt:
                        new Date().toISOString()

                });

            }


            saveData();

            renderMatches();

            updateDashboard();

            renderPlayers();

            closeMatchModal();

        }
    );

}


/* =========================
   MATCH RENDER
========================= */

const matchesList =
    document.getElementById("matchesList");

const matchesEmpty =
    document.getElementById("matchesEmpty");

const matchCount =
    document.getElementById("matchCount");

const matchSearch =
    document.getElementById("matchSearch");


function renderMatches() {

    if (!matchesList) {
        return;
    }


    const search =
        matchSearch
            ? matchSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        [...appData.matches]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .filter((match) => {

                const searchable =
                    `${match.tournament || ""} ${match.map || ""} ${match.matchNumber || ""}`
                        .toLowerCase();

                return searchable.includes(search);

            });


    matchesList.innerHTML = "";


    if (matchCount) {

        matchCount.textContent =
            `${filtered.length} ${
                filtered.length === 1
                    ? "Match"
                    : "Matches"
            }`;

    }


    if (filtered.length === 0) {

        matchesList.style.display = "none";

        if (matchesEmpty) {
            matchesEmpty.style.display = "flex";
        }

        return;

    }


    matchesList.style.display = "flex";

    if (matchesEmpty) {
        matchesEmpty.style.display = "none";
    }


    filtered.forEach((match) => {

        const card =
            document.createElement("article");


        card.className =
            "match-card";


        const performance =
            Array.isArray(match.playerPerformance)
                ? match.playerPerformance
                : [];


        const performanceHTML =
            performance
                .map((item) => {

                    const player =
                        appData.players.find(
                            (p) =>
                                p.id ===
                                item.playerId
                        );


                    const name =
                        player
                            ? player.ign
                            : "Removed Player";


                    return `

                        <div class="performance-player">

                            <span>
                                ${escapeHTML(name)}
                            </span>

                            <strong>
                                ${Number(item.kills || 0)} K
                            </strong>

                        </div>

                    `;

                })
                .join("");


        card.innerHTML = `

            <div class="match-card-top">

                <div class="match-main">

                    <div class="match-number">
                        #${escapeHTML(
                            match.matchNumber
                        )}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(
                                match.map
                            )}
                        </h3>

                        <div class="match-meta">

                            <span class="match-tag">
                                ${escapeHTML(
                                    match.date
                                )}
                            </span>

                            ${
                                match.tournament
                                    ? `
                                        <span class="match-tag">
                                            •
                                            ${escapeHTML(
                                                match.tournament
                                            )}
                                        </span>
                                    `
                                    : ""
                            }

                        </div>

                    </div>

                </div>


                <div class="player-actions">

                    <button
                        class="icon-button edit-match"
                        data-id="${match.id}"
                        title="Edit match"
                    >
                        ✎
                    </button>

                    <button
                        class="icon-button delete-match"
                        data-id="${match.id}"
                        title="Delete match"
                    >
                        ×
                    </button>

                </div>

            </div>


            <div class="match-result">

                <div class="match-result-item">
                    <span>PLACEMENT</span>
                    <strong>
                        #${Number(match.placement || 0)}
                    </strong>
                </div>

                <div class="match-result-item">
                    <span>KILLS</span>
                    <strong>
                        ${Number(match.kills || 0)}
                    </strong>
                </div>

                <div class="match-result-item">
                    <span>POINTS</span>
                    <strong>
                        ${Number(match.points || 0)}
                    </strong>
                </div>

            </div>


            <div class="match-performance">

                ${performanceHTML}

            </div>


            ${
                match.notes
                    ? `
                        <div class="match-notes">
                            ${escapeHTML(match.notes)}
                        </div>
                    `
                    : ""
            }

        `;


        matchesList.appendChild(card);

    });


    attachMatchActions();

}


/* =========================
   MATCH ACTIONS
========================= */

function attachMatchActions() {

    document
        .querySelectorAll(".edit-match")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const match =
                        appData.matches.find(
                            (item) =>
                                item.id ===
                                button.dataset.id
                        );


                    if (match) {
                        openMatchModal(match);
                    }

                }
            );

        });


    document
        .querySelectorAll(".delete-match")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    deleteMatch(
                        button.dataset.id
                    );

                }
            );

        });

}


/* =========================
   DELETE MATCH
========================= */

function deleteMatch(matchId) {

    const match =
        appData.matches.find(
            (item) =>
                item.id === matchId
        );


    if (!match) {
        return;
    }


    if (
        !confirm(
            `Delete Match #${match.matchNumber}?`
        )
    ) {
        return;
    }


    appData.matches =
        appData.matches.filter(
            (item) =>
                item.id !== matchId
        );


    saveData();

    renderMatches();

    renderPlayers();

    updateDashboard();

}


if (matchSearch) {

    matchSearch.addEventListener(
        "input",
        renderMatches
    );

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const players =
        appData.players;

    const matches =
        appData.matches;


    const totalKills =
        matches.reduce(
            (sum, match) =>
                sum +
                Number(match.kills || 0),
            0
        );


    const totalPoints =
        matches.reduce(
            (sum, match) =>
                sum +
                Number(match.points || 0),
            0
        );


    const playerCountElement =
        document.getElementById(
            "dashboardPlayerCount"
        );

    const matchCountElement =
        document.getElementById(
            "dashboardMatchCount"
        );

    const killCountElement =
        document.getElementById(
            "dashboardKillCount"
        );

    const pointCountElement =
        document.getElementById(
            "dashboardPointCount"
        );


    if (playerCountElement) {
        playerCountElement.textContent =
            players.length;
    }


    if (matchCountElement) {
        matchCountElement.textContent =
            matches.length;
    }


    if (killCountElement) {
        killCountElement.textContent =
            totalKills;
    }


    if (pointCountElement) {
        pointCountElement.textContent =
            totalPoints;
    }

}


/* =========================
   INITIALIZE
========================= */

renderPlayers();

renderMatches();

updateDashboard();

updatePerformanceInputs();

console.log(
    "AME Command Center loaded successfully."
);