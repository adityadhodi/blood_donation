
const donorGrid = document.getElementById("donorGrid");
const resultsCount = document.getElementById("resultsCount");
const searchForm = document.getElementById("searchForm");
const searchBloodGroup = document.getElementById("searchBloodGroup");
const searchCity = document.getElementById("searchCity");
const resetSearch = document.getElementById("resetSearch");

function getDonors() {
    try {
        const data = JSON.parse(
            localStorage.getItem("lifedropDonors") || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function renderDonors(donors) {
    donorGrid.replaceChildren();

    resultsCount.textContent =
        `${donors.length} demo record${donors.length === 1 ? "" : "s"}`;

    if (donors.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";

        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.textContent = "🔍";

        const heading = document.createElement("h3");
        heading.textContent = "No matching donors found";

        const message = document.createElement("p");
        message.textContent =
            "Try another blood group or city, or register a demo donor.";

        empty.append(icon, heading, message);
        donorGrid.appendChild(empty);
        return;
    }

    donors.forEach(function (donor) {
        const card = document.createElement("article");
        card.className = "donor-card";

        const top = document.createElement("div");
        top.className = "donor-card-top";

        const badge = document.createElement("div");
        badge.className = "blood-badge";
        badge.textContent = donor.bloodGroup || "N/A";

        const identity = document.createElement("div");

        const name = document.createElement("h3");
        name.className = "donor-name";
        name.textContent = donor.name || "Demo donor";

        const city = document.createElement("p");
        city.className = "donor-city";
        city.textContent = donor.city || "City not provided";

        identity.append(name, city);
        top.append(badge, identity);

        const status = document.createElement("span");
        const interested = donor.availability === "Interested";

        status.className = interested
            ? "donor-status"
            : "donor-status unavailable";

        status.textContent = interested
            ? "Interested in donating"
            : "Not currently available";

        const details = document.createElement("div");
        details.className = "donor-details";

        const age = document.createElement("p");
        age.textContent = `Age: ${donor.age || "Not provided"}`;

        const lastDonation = document.createElement("p");
        lastDonation.textContent = donor.lastDonation
            ? `Last donation recorded: ${donor.lastDonation}`
            : "Last donation date: Not provided";

        details.append(age, lastDonation);
        card.append(top, status, details);
        donorGrid.appendChild(card);
    });
}

function searchDonors() {
    const bloodGroup = searchBloodGroup.value;
    const city = searchCity.value.trim().toLowerCase();

    const matches = getDonors().filter(function (donor) {
        const groupMatches =
            !bloodGroup || donor.bloodGroup === bloodGroup;

        const cityMatches =
            !city || (donor.city || "").toLowerCase().includes(city);

        return groupMatches && cityMatches;
    });

    renderDonors(matches);
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchDonors();
});

resetSearch.addEventListener("click", function () {
    searchForm.reset();
    searchDonors();
});

// Show all demo records when the page opens.
searchDonors();
