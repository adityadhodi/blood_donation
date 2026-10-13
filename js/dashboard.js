
const bloodGroups = [
    "A+", "A-", "B+", "B-",
    "O+", "O-", "AB+", "AB-"
];

function readLocalRecords(key) {
    try {
        const records = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(records) ? records : [];
    } catch (error) {
        return [];
    }
}

function updateNumber(id, value) {
    document.getElementById(id).textContent = value;
}

function updateBloodGroupChart(donors) {
    const chart = document.getElementById("bloodGroupChart");
    chart.replaceChildren();

    if (donors.length === 0) {
        const message = document.createElement("p");
        message.className = "no-data";
        message.textContent = "No donor records available.";
        chart.appendChild(message);
        return;
    }

    const counts = {};

    bloodGroups.forEach(function (group) {
        counts[group] = 0;
    });

    donors.forEach(function (donor) {
        if (Object.hasOwn(counts, donor.bloodGroup)) {
            counts[donor.bloodGroup]++;
        }
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    bloodGroups.forEach(function (group) {
        const row = document.createElement("div");
        row.className = "group-row";

        const label = document.createElement("span");
        label.className = "group-label";
        label.textContent = group;

        const track = document.createElement("div");
        track.className = "bar-track";

        const fill = document.createElement("div");
        fill.className = "bar-fill";

        fill.style.width = (counts[group] / maxCount * 100) + "%";

        track.appendChild(fill);

        const count = document.createElement("span");
        count.className = "group-count";
        count.textContent = counts[group];

        row.append(label, track, count);
        chart.appendChild(row);
    });
}

function updateDashboard() {
    const donors = readLocalRecords("lifedropDonors");
    const requests = readLocalRecords("lifedropRequests");

    const interested = donors.filter(function (donor) {
        return donor.availability === "Interested";
    });

    const pending = requests.filter(function (request) {
        return !request.status || request.status === "Pending";
    });

    const matched = requests.filter(function (request) {
        return request.status === "Matched";
    });

    const fulfilled = requests.filter(function (request) {
        return request.status === "Fulfilled";
    });

    const other = requests.length - pending.length -
                  matched.length - fulfilled.length;

    updateNumber("totalDonors", donors.length);
    updateNumber("totalRequests", requests.length);
    updateNumber("interestedDonors", interested.length);
    updateNumber("fulfilledRequests", fulfilled.length);

    updateNumber("pendingRequests", pending.length);
    updateNumber("matchedRequests", matched.length);
    updateNumber("fulfilledStatusRequests", fulfilled.length);
    updateNumber("otherRequests", other);

    updateBloodGroupChart(donors);
}

document.getElementById("refreshDashboard")
    .addEventListener("click", updateDashboard);

// Display the current locally stored statistics.
updateDashboard();
