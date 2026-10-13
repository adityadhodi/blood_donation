
const historyForm = document.getElementById("historyForm");
const historyList = document.getElementById("historyList");
const historyMessage = document.getElementById("historyMessage");
const historyDateInput = document.getElementById("historyDate");

// Donation dates cannot be in the future.
historyDateInput.max = new Date().toISOString().split("T")[0];

function getHistoryRecords() {
    try {
        const records = JSON.parse(
            localStorage.getItem("lifedropHistory") || "[]"
        );

        return Array.isArray(records) ? records : [];
    } catch (error) {
        return [];
    }
}

function showHistoryMessage(message, type) {
    historyMessage.textContent = message;
    historyMessage.className = "history-message " + type;
}

function updateHistoryStats(records) {
    document.getElementById("historyTotal").textContent =
        records.length;

    const groups = new Set(
        records.map(record => record.bloodGroup)
    );

    document.getElementById("historyGroups").textContent =
        groups.size;

    document.getElementById("historyCount").textContent =
        `${records.length} record${records.length === 1 ? "" : "s"}`;
}

function renderHistory() {
    const records = getHistoryRecords()
        .slice()
        .sort((a, b) => b.donationDate.localeCompare(a.donationDate));

    historyList.replaceChildren();
    updateHistoryStats(records);

    if (records.length === 0) {
        const empty = document.createElement("div");
        empty.className = "history-empty";

        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.textContent = "🩸";

        const heading = document.createElement("h3");
        heading.textContent = "No history yet";

        const message = document.createElement("p");
        message.textContent =
            "Add a fictional record using the form.";

        empty.append(icon, heading, message);
        historyList.appendChild(empty);
        return;
    }

    records.forEach(function (record) {
        const card = document.createElement("article");
        card.className = "history-record";

        const badge = document.createElement("div");
        badge.className = "history-blood-icon";
        badge.textContent = record.bloodGroup;

        const details = document.createElement("div");
        details.className = "history-record-details";

        const heading = document.createElement("h3");
        heading.textContent = record.name;

        const date = document.createElement("p");
        date.textContent = "Donation date: " + record.donationDate;

        const city = document.createElement("p");
        city.textContent = "City: " + record.city;

        const facility = document.createElement("p");
        facility.textContent = "Facility: " + record.facility;

        const label = document.createElement("span");
        label.className = "demo-label";
        label.textContent = "DEMO RECORD — NOT VERIFIED";

        details.append(heading, date, city, facility, label);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-history";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            "Delete demo history record for " + record.name
        );

        deleteButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Delete this demo history record?"
            );

            if (!confirmed) {
                return;
            }

            const remaining = getHistoryRecords().filter(function (item) {
                return item.id !== record.id;
            });

            try {
                localStorage.setItem(
                    "lifedropHistory",
                    JSON.stringify(remaining)
                );

                renderHistory();
                showHistoryMessage(
                    "Demo history record deleted.",
                    "success"
                );
            } catch (error) {
                showHistoryMessage(
                    "Could not update browser storage.",
                    "error"
                );
            }
        });

        card.append(badge, details, deleteButton);
        historyList.appendChild(card);
    });
}

historyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!historyForm.checkValidity()) {
        historyForm.reportValidity();
        return;
    }

    const donationDate = historyDateInput.value;
    const today = new Date().toISOString().split("T")[0];

    if (donationDate > today) {
        showHistoryMessage(
            "Donation date cannot be in the future.",
            "error"
        );
        return;
    }

    const record = {
        id: crypto.randomUUID(),
        name: document.getElementById("historyName").value.trim(),
        bloodGroup: document.getElementById("historyBloodGroup").value,
        donationDate: donationDate,
        city: document.getElementById("historyCity").value.trim(),
        facility: document.getElementById("historyFacility").value.trim()
    };

    try {
        const records = getHistoryRecords();
        records.push(record);

        localStorage.setItem(
            "lifedropHistory",
            JSON.stringify(records)
        );

        historyForm.reset();
        historyDateInput.max = new Date().toISOString().split("T")[0];

        renderHistory();

        showHistoryMessage(
            "Demo history record saved successfully.",
            "success"
        );
    } catch (error) {
        showHistoryMessage(
            "Could not save the record. Check browser storage settings.",
            "error"
        );
    }
});

renderHistory();
