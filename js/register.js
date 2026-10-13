
const donorForm = document.getElementById("donorForm");
const formMessage = document.getElementById("formMessage");
const lastDonationInput = document.getElementById("lastDonation");

// Do not allow a future last-donation date.
if (lastDonationInput) {
    lastDonationInput.max = new Date().toISOString().split("T")[0];
}

if (donorForm) {
    donorForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!donorForm.checkValidity()) {
            donorForm.reportValidity();
            return;
        }

        const lastDonation = lastDonationInput.value;

        if (lastDonation &&
            lastDonation > new Date().toISOString().split("T")[0]) {
            showMessage("Last donation date cannot be in the future.", "error");
            return;
        }

        const donor = {
            id: Date.now(),
            name: document.getElementById("name").value.trim(),
            age: Number(document.getElementById("age").value),
            bloodGroup: document.getElementById("bloodGroup").value,
            city: document.getElementById("city").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            lastDonation: lastDonation,
            availability: document.getElementById("availability").value,
            registeredAt: new Date().toISOString()
        };

        if (donor.age < 18 || donor.age > 100) {
            showMessage("Please enter a valid age.", "error");
            return;
        }

        try {
            const savedDonors = JSON.parse(
                localStorage.getItem("lifedropDonors") || "[]"
            );

            if (!Array.isArray(savedDonors)) {
                throw new Error("Invalid saved donor data");
            }

            savedDonors.push(donor);

            localStorage.setItem(
                "lifedropDonors",
                JSON.stringify(savedDonors)
            );

            showMessage(
                "Registration saved successfully for this demo!",
                "success"
            );

            donorForm.reset();
            lastDonationInput.max =
                new Date().toISOString().split("T")[0];

        } catch (error) {
            showMessage(
                "Could not save registration. Check browser storage settings.",
                "error"
            );
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "form-message " + type;
    formMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}
