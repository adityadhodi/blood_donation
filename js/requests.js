
const bloodRequestForm = document.getElementById("bloodRequestForm");
const requestMessage = document.getElementById("requestMessage");
const requestList = document.getElementById("requestList");

function getRequests() {
    try {
        const data = JSON.parse(
            localStorage.getItem("lifedropRequests") || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

const requestStatusFilter = document.getElementById("requestStatusFilter");

function showRequestMessage(message, type) {
    requestMessage.textContent = message;
    requestMessage.className = "request-message " + type;
}

function renderRequests() {
    const requests = getRequests();
    const selectedStatus = requestStatusFilter
        ? requestStatusFilter.value
        : "All";

    const filteredRequests = selectedStatus === "All"
        ? requests
        : requests.filter(function (request) {
            return request.status === selectedStatus;
        });

    requestList.innerHTML = "";

    if (filteredRequests.length === 0) {
        requestList.innerHTML = `
            <p class="empty-state">
                No requests found for this status.
            </p>
        `;
        return;
    }

    filteredRequests.slice().reverse().forEach(function (request) {
        const card = document.createElement("div");
        card.className = "request-card";

        const heading = document.createElement("h3");
        heading.textContent = request.patientName;

        const details = document.createElement("p");
        details.textContent =
            "Blood Group: " + request.bloodGroup +
            " | Units: " + request.units +
            " | City: " + request.city;

        const hospital = document.createElement("p");
        hospital.textContent = "Hospital: " + request.hospital;

        const statusLabel = document.createElement("label");
        statusLabel.textContent = "Request Status: ";

        const statusSelect = document.createElement("select");

        ["Pending", "Matched", "Fulfilled"].forEach(function (status) {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;

            if ((request.status || "Pending") === status) {
                option.selected = true;
            }

            statusSelect.appendChild(option);
        });

        statusSelect.addEventListener("change", function () {
            const allRequests = getRequests();

            const updatedRequests = allRequests.map(function (item) {
                if (String(item.id) === String(request.id)) {
                    return {
                        ...item,
                        status: statusSelect.value
                    };
                }

                return item;
            });

            localStorage.setItem(
                "lifedropRequests",
                JSON.stringify(updatedRequests)
            );

            renderRequests();
        });

        statusLabel.appendChild(statusSelect);

        card.appendChild(heading);
        card.appendChild(details);
        card.appendChild(hospital);
        card.appendChild(statusLabel);

        requestList.appendChild(card);
    });
}

if (requestStatusFilter) {
    requestStatusFilter.addEventListener("change", renderRequests);
}
renderRequests();
