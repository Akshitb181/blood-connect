
// =========================
// REGISTER MODAL
// =========================

function showRegister() {
    const modal = document.getElementById("registerModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function closeRegister() {
    const modal = document.getElementById("registerModal");

    if (modal) {
        modal.style.display = "none";
    }
}


// =========================
// LOGIN
// =========================

function showLogin() {
    window.location.href = "/login.html";
}


// =========================
// REGISTER FORM
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const role = document.getElementById("registerRole").value;

        const message = document.getElementById("registerMessage");

        message.textContent = "Creating account...";
        message.style.color = "#666";

        try {

            const response = await fetch("/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })

            });

            const data = await response.json();

            if (response.ok) {

                message.textContent = "Account created successfully.";
                message.style.color = "#25a55f";

                registerForm.reset();

            } else {

                message.textContent =
                    data.message || "Registration failed.";

                message.style.color = "#d92d3f";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

            message.style.color = "#d92d3f";
        }

    });

}


// =========================
// LOGIN FORM
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        message.textContent = "Logging in...";
        message.style.color = "#666";

        try {

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "bloodConnectUser",
                    JSON.stringify(data.user)
                );

                localStorage.setItem("bloodConnectToken", data.token);

            
                message.textContent =
                    "Login successful.";

                message.style.color = "#25a55f";

                setTimeout(function () {

                    if (data.user.role === "admin") {
    window.location.href = "/admin.html";
} else {
    window.location.href = "/dashboard.html";
}

                }, 500);

            } else {

                message.textContent =
                    data.message || "Login failed.";

                message.style.color = "#d92d3f";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

            message.style.color = "#d92d3f";
        }

    });

}


// =========================
// DASHBOARD
// =========================

const loggedInUser = JSON.parse(
    localStorage.getItem("bloodConnectUser")
);

if (window.location.pathname.endsWith("dashboard.html")) {

    if (!loggedInUser) {

        window.location.href = "/login.html";

    } else {

        const userName =
            document.getElementById("userName");

        const userRole =
            document.getElementById("userRole");

        const userAvatar =
            document.getElementById("userAvatar");

        const welcomeText =
            document.getElementById("welcomeText");

        const dashboardDescription =
            document.getElementById("dashboardDescription");


        if (userName) {
            userName.textContent =
                loggedInUser.name;
        }

        if (userRole) {
            userRole.textContent =
                loggedInUser.role === "donor"
                    ? "Blood Donor"
                    : "Blood Receiver";
        }

        if (userAvatar) {
            userAvatar.textContent =
                loggedInUser.name
                    .charAt(0)
                    .toUpperCase();
        }

        if (welcomeText) {
            welcomeText.textContent =
                `Welcome back, ${loggedInUser.name}`;
        }


        if (loggedInUser.role === "donor") {

            document.getElementById(
                "donorDashboard"
            ).style.display = "block";

            document.getElementById("donorNavigation").style.display="block";
document.getElementById("receiverNavigation").style.display="none";

            if (dashboardDescription) {
                dashboardDescription.textContent =
                    "Manage your donor profile, blood requests and donation history.";
            }

        } else {

            document.getElementById(
                "receiverDashboard"
            ).style.display = "block";

            document.getElementById("receiverNavigation").style.display="block";
document.getElementById("donorNavigation").style.display="none";

            if (dashboardDescription) {
                dashboardDescription.textContent =
                    "Find blood donors and manage your blood requests.";
            }

        }

    }

}


// =========================
// LOGOUT
// =========================

function logoutUser() {

    localStorage.removeItem(
        "bloodConnectUser"
    );

    window.location.href = "/";

}

// =========================
// DONOR PROFILE
// =========================

function showDonorProfile() {

    const content = document.getElementById("donorContent");

    if (!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">

            <div class="dashboard-form-header">
                <div>
                    <span class="dashboard-label">
                        <i class="bi bi-person-heart"></i>
                        Donor Profile
                    </span>

                    <h2>Complete Your Donor Profile</h2>

                    <p>
                        Add your blood group and location so receivers
                        can find you when they need blood.
                    </p>
                </div>
            </div>

            <form id="donorProfileForm">

                <div class="dashboard-form-grid">

                    <div class="dashboard-form-group">

                        <label>Blood Group</label>

                        <select id="donorBloodGroup" required>

                            <option value="">Select blood group</option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>

                        </select>

                    </div>


                    <div class="dashboard-form-group">

                        <label>Location</label>

                        <input
                            type="text"
                            id="donorLocation"
                            placeholder="e.g. Ghaziabad"
                            required
                        >

                    </div>


                    <div class="dashboard-form-group">

                        <label>Phone Number</label>

                        <input
                            type="tel"
                            id="donorPhone"
                            placeholder="Enter your phone number"
                            required
                        >

                    </div>


                    <div class="dashboard-form-group donor-availability">

    <label>Available for Donation?</label>

    <label class="availability-toggle">

        <input
            type="checkbox"
            id="donorAvailable"
        >

        <span>
            I am currently available to donate blood
        </span>

    </label>

</div>

<div class="dashboard-form-group">

    <label for="donorComponents">
        Blood Components
    </label>

    <select id="donorComponents" multiple>

        <option value="Whole Blood">Whole Blood</option>
        <option value="Red Blood Cells">Red Blood Cells</option>
        <option value="Platelets">Platelets</option>
        <option value="Plasma">Plasma</option>

    </select>

    <small>
        Hold Ctrl to select multiple components.
    </small>

</div>

                </div>


                <button
                    type="submit"
                    class="dashboard-primary-btn"
                >
                    Save Donor Profile
                    <i class="bi bi-check-lg"></i>
                </button>

                <p
                    id="donorProfileMessage"
                    class="dashboard-form-message"
                ></p>

            </form>

        </div>
    `;


    document
        .getElementById("donorProfileForm")
        .addEventListener("submit", saveDonorProfile);

}


// =========================
// SAVE DONOR PROFILE
// =========================



async function saveDonorProfile(event) {

    event.preventDefault();

    const bloodGroup =
        document.getElementById("donorBloodGroup").value;

    const location =
        document.getElementById("donorLocation").value;

    const phone =
        document.getElementById("donorPhone").value;

    const isAvailable =
        document.getElementById("donorAvailable").checked;

        const bloodComponents =
    Array.from(
        document.getElementById("donorComponents").selectedOptions
    ).map(option => option.value);

    const message =
        document.getElementById("donorProfileMessage");

    message.textContent = "Saving profile...";
    message.style.color = "#666";

    try {

        const response = await fetch(
            `/api/donor/profile/${loggedInUser.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
    bloodGroup,
    location,
    phone,
    isAvailable,
    bloodComponents
})
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Donor profile saved successfully.";

            message.style.color = "#25a55f";

            loggedInUser.bloodGroup =
                data.user.bloodGroup;

            loggedInUser.location =
                data.user.location;

            loggedInUser.phone =
                data.user.phone;

            loggedInUser.isAvailable =
                data.user.isAvailable;

            localStorage.setItem(
                "bloodConnectUser",
                JSON.stringify(loggedInUser)
            );

            localStorage.setItem(
                "donorProfileCompleted",
                "true"
            );

            const profileButton =
                document.getElementById("donorProfileButton");

            if (profileButton) {

                profileButton.innerHTML =
                    `Donor Profile <i class="bi bi-check-circle"></i>`;

            }

            document.getElementById("donorContent").innerHTML = `
    <div class="dashboard-form-card">

        <div class="dashboard-form-header">

            <span class="dashboard-label">
                <i class="bi bi-check-circle"></i>
                Donor Profile
            </span>

            <h2>Your Donor Profile is Complete</h2>

            <p>
                Your donor information has been saved successfully.
                You can now receive matching blood requests.
            </p>

        </div>

        <button
            class="dashboard-primary-btn"
            onclick="showDonorProfile()"
        >
            Edit Donor Profile
            <i class="bi bi-pencil"></i>
        </button>

    </div>
`;

        } else {

            message.textContent =
                data.message || "Unable to save profile.";

            message.style.color = "#d92d3f";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "#d92d3f";

    }

}

// =========================
// DONOR BLOOD REQUESTS
// =========================

async function showDonorRequests() {

    const content = document.getElementById("donorContent");

    if (!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">
            <div class="dashboard-form-header">
                <span class="dashboard-label">
                    <i class="bi bi-droplet-half"></i>
                    Blood Requests
                </span>

                <h2>Blood Requests Near You</h2>

                <p>
                    View pending and accepted blood requests
                    that match your blood group and location.
                </p>
            </div>

            <div id="donorRequestsList">
                <p>Loading blood requests...</p>
            </div>
        </div>
    `;

    try {

        const pendingResponse = await fetch(
            `/api/requests/donor/${loggedInUser.id}`
        );

        const acceptedResponse = await fetch(
            `/api/requests/donor/${loggedInUser.id}/accepted`
        );

        const pendingData = await pendingResponse.json();
        const acceptedData = await acceptedResponse.json();

        const list =
            document.getElementById("donorRequestsList");

        if (!pendingResponse.ok || !acceptedResponse.ok) {

            list.innerHTML = `
                <p>Unable to load blood requests.</p>
            `;

            return;
        }

        const requests = [
            ...pendingData.requests.map(request => ({
                ...request,
                requestType: "pending"
            })),

            ...acceptedData.requests.map(request => ({
                ...request,
                requestType: "accepted"
            }))
        ];

        if (requests.length === 0) {

            list.innerHTML = `
                <div class="dashboard-empty">
                    <i class="bi bi-inbox"></i>

                    <h3>No matching requests</h3>

                    <p>
                        There are currently no pending or accepted
                        blood requests matching your profile.
                    </p>
                </div>
            `;

            return;
        }

        list.innerHTML = requests.map(request => `

            <div class="request-card">

                <div>

                    <span class="request-blood-group">
                        ${request.bloodGroup}
                    </span>

                    ${request.emergency ? `
                        <span class="request-emergency">
                            Emergency
                        </span>
                    ` : ""}

                    ${request.requestType === "accepted" ? `
                        <span class="request-status status-accepted">
                            Accepted
                        </span>
                    ` : ""}

                    <h3>
                        ${request.hospital}
                    </h3>

                    <p>
                        <i class="bi bi-geo-alt"></i>
                        ${request.location}
                    </p>

                    <p>
                        <strong>${request.units}</strong>
                        unit(s) required
                    </p>

                    ${request.message ? `
                        <p>${request.message}</p>
                    ` : ""}

                </div>

                <div class="request-actions">

                    ${request.requestType === "accepted" ? `

                        <button
                            class="dashboard-primary-btn"
                            onclick="completeDonation('${request._id}')"
                        >
                            Complete Donation
                            <i class="bi bi-check-circle"></i>
                        </button>

                    ` : `

                        <button
                            class="dashboard-primary-btn"
                            onclick="respondToBloodRequest('${request._id}', 'accept')"
                        >
                            Accept Request
                            <i class="bi bi-check-lg"></i>
                        </button>

                        <button
                            class="dashboard-secondary-btn"
                            onclick="respondToBloodRequest('${request._id}', 'reject')"
                        >
                            Reject
                            <i class="bi bi-x-lg"></i>
                        </button>

                    `}

                </div>

            </div>

        `).join("");

    } catch (error) {

        console.error(error);

        const list =
            document.getElementById("donorRequestsList");

        if (list) {
            list.innerHTML = `
                <p>Unable to connect to server.</p>
            `;
        }
    }
}


// =========================
// ACCEPT BLOOD REQUEST
// =========================

async function respondToBloodRequest(requestId, action) {

    try {

        const response = await fetch(
            `/api/requests/${requestId}/respond`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    donorId: loggedInUser.id,
                    action: action
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(data.message);

            showDonorRequests();

        } else {

            alert(data.message || "Unable to respond.");
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");
    }
}


async function completeDonation(requestId) {

    if (!confirm("Are you sure the blood donation has been completed?")) {
        return;
    }

    try {

        const response = await fetch(
            `/api/requests/${requestId}/complete`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    donorId: loggedInUser.id
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Donation completed successfully.");

            showDonorRequests();

        } else {

            alert(
                data.message ||
                "Unable to complete donation."
            );
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");
    }
}

// =========================
// DONATION HISTORY
// =========================

async function showDonationHistory() {

    const content = document.getElementById("donorContent");

    if (!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">

            <div class="dashboard-form-header">

                <span class="dashboard-label">
                    <i class="bi bi-clock-history"></i>
                    Donation History
                </span>

                <h2>Your Donation History</h2>

                <p>
                    View the blood donations you have completed
                    through BloodConnect.
                </p>

            </div>

            <div id="donationHistoryList">
                <p>Loading donation history...</p>
            </div>

        </div>
    `;

    try {

        const response = await fetch(
            `/api/donations/donor/${loggedInUser.id}`
        );

        const data = await response.json();

        const list =
            document.getElementById("donationHistoryList");

        if (!response.ok) {

            list.innerHTML = `
                <p>
                    ${data.message || "Unable to load donation history."}
                </p>
            `;

            return;
        }

        if (data.count === 0) {

            list.innerHTML = `
                <div class="dashboard-empty">

                    <i class="bi bi-droplet"></i>

                    <h3>No donations yet</h3>

                    <p>
                        Your completed blood donations
                        will appear here.
                    </p>

                </div>
            `;

            return;
        }

        list.innerHTML = data.donations.map(donation => {

            const donationDate =
                new Date(donation.donationDate)
                    .toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });

            return `

                <div class="request-card">

                    <div>

                        <span class="request-blood-group">
                            ${donation.bloodGroup}
                        </span>

                        <span class="request-status status-completed">
                            Completed
                        </span>

                        <h3>
                            ${donation.hospital}
                        </h3>

                        <p>
                            <i class="bi bi-geo-alt"></i>
                            ${donation.bloodRequest?.location || "Location not available"}
                        </p>

                        <p>
                            <strong>${donation.units}</strong>
                            unit(s) donated
                        </p>

                        <p>
                            <i class="bi bi-calendar3"></i>
                            ${donationDate}
                        </p>

                        <p>
                            <i class="bi bi-person"></i>
                            Receiver:
                            ${donation.receiver?.name || "Not available"}
                        </p>

                    </div>

                </div>

            `;

        }).join("");

    } catch (error) {

        console.error(error);

        const list =
            document.getElementById("donationHistoryList");

        if (list) {

            list.innerHTML = `
                <p>
                    Unable to connect to server.
                </p>
            `;

        }
    }
}

// =========================
// FIND BLOOD DONORS
// =========================

function showFindDonors() {

    const content =
        document.getElementById("receiverContent");

    if (!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">

            <div class="dashboard-form-header">

                <span class="dashboard-label">
                    <i class="bi bi-search"></i>
                    Find Blood Donors
                </span>

                <h2>Find a Blood Donor</h2>

                <p>
                    Search available donors by blood group
                    and location.
                </p>

            </div>

            <form id="findDonorForm">

                <div class="dashboard-form-grid">

                    <div class="dashboard-form-group">

                        <label>Blood Group</label>

                        <select id="searchBloodGroup" required>

                            <option value="">
                                Select blood group
                            </option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>

                        </select>

                    </div>

                    <div class="dashboard-form-group">

                        <label>Location</label>

                        <input
                            type="text"
                            id="searchLocation"
                            placeholder="e.g. Ghaziabad"
                            required
                        >

                    </div>

                </div>

                <button
                    type="submit"
                    class="dashboard-primary-btn"
                >
                    Search Donors
                    <i class="bi bi-search"></i>
                </button>

            </form>

            <div id="donorSearchResults"></div>

        </div>
    `;

    document
        .getElementById("findDonorForm")
        .addEventListener("submit", searchBloodDonors);
}


// =========================
// SEARCH BLOOD DONORS
// =========================

async function searchBloodDonors(event) {

    event.preventDefault();

    const bloodGroup =
        document.getElementById("searchBloodGroup").value;

    const location =
        document.getElementById("searchLocation").value;

    const results =
        document.getElementById("donorSearchResults");

    results.innerHTML = `
        <p>Searching for available donors...</p>
    `;

    try {

        const response = await fetch(
            `/api/donors/search?bloodGroup=${encodeURIComponent(bloodGroup)}&location=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        if (!response.ok) {

            results.innerHTML = `
                <p>
                    ${data.message || "Unable to search donors."}
                </p>
            `;

            return;
        }

        if (data.count === 0) {

            results.innerHTML = `
                <div class="dashboard-empty">

                    <i class="bi bi-person-x"></i>

                    <h3>No donors found</h3>

                    <p>
                        No available donors match this blood
                        group and location.
                    </p>

                </div>
            `;

            return;
        }

        results.innerHTML = `
            <div class="dashboard-form-header donor-results-header">

                <h2>
                    ${data.count} donor${data.count > 1 ? "s" : ""} found
                </h2>

            </div>

            ${data.donors.map(donor => `

                <div class="request-card">

                    <div>

                        <span class="request-blood-group">
                            ${donor.bloodGroup}
                        </span>

                        <h3>
                            ${donor.name}
                        </h3>

                        <p>
                            <i class="bi bi-geo-alt"></i>
                            ${donor.location}
                        </p>

                        <p>
                            <i class="bi bi-telephone"></i>
                            ${donor.phone || "Phone unavailable"}
                        </p>

                    </div>

                    <div class="request-status">
                        Available
                    </div>

                </div>

            `).join("")}
        `;

    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <p>Unable to connect to server.</p>
        `;
    }
}


// =========================
// REQUEST BLOOD
// =========================

function showBloodRequestForm() {

    const content =
        document.getElementById("receiverContent");

    if (!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">

            <div class="dashboard-form-header">

                <span class="dashboard-label">
                    <i class="bi bi-droplet-fill"></i>
                    Blood Request
                </span>

                <h2>Request Blood</h2>

                <p>
                    Submit a blood request and matching donors
                    can respond to it.
                </p>

            </div>


            <form id="bloodRequestForm">

                <div class="dashboard-form-grid">

                    <div class="dashboard-form-group">

                        <label>Blood Group</label>

                        <select id="requestBloodGroup" required>

                            <option value="">
                                Select blood group
                            </option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>

                        </select>

                        <div class="dashboard-form-group">

    <label for="requestBloodComponent">
        Required Blood Component
    </label>

    <select id="requestBloodComponent" required>

        <option value="Whole Blood">
            Whole Blood
        </option>

        <option value="Red Blood Cells">
            Red Blood Cells
        </option>

        <option value="Platelets">
            Platelets
        </option>

        <option value="Plasma">
            Plasma
        </option>

    </select>

</div>

                    </div>


                    <div class="dashboard-form-group">

                        <label>Units Required</label>

                        <input
                            type="number"
                            id="requestUnits"
                            min="1"
                            value="1"
                            required
                        >

                    </div>


                    <div class="dashboard-form-group">

                        <label>Location</label>

                        <input
                            type="text"
                            id="requestLocation"
                            placeholder="e.g. Ghaziabad"
                            required
                        >

                    </div>


                    <div class="dashboard-form-group">

                        <label>Hospital</label>

                        <input
                            type="text"
                            id="requestHospital"
                            placeholder="Enter hospital name"
                            required
                        >

                    </div>

                </div>


                <div class="dashboard-form-group">

                    <label>Message</label>

                    <textarea
                        id="requestMessage"
                        rows="4"
                        placeholder="Add any additional information..."
                    ></textarea>

                </div>


                <div class="request-emergency-option">

                    <label class="availability-toggle">

                        <input
                            type="checkbox"
                            id="requestEmergency"
                        >

                        <span>
                            This is an emergency blood request
                        </span>

                    </label>

                </div>


                <button
                    type="submit"
                    class="dashboard-primary-btn"
                >
                    Submit Blood Request
                    <i class="bi bi-send"></i>
                </button>


                <p
                    id="bloodRequestMessage"
                    class="dashboard-form-message"
                ></p>

            </form>

        </div>
    `;


    document
        .getElementById("bloodRequestForm")
        .addEventListener(
            "submit",
            submitBloodRequest
        );
}


// =========================
// SUBMIT BLOOD REQUEST
// =========================

async function submitBloodRequest(event) {

    event.preventDefault();

    const bloodGroup =
        document.getElementById("requestBloodGroup").value;

        const bloodComponent =
    document.getElementById("requestBloodComponent").value;

    const units =
        document.getElementById("requestUnits").value;

    const location =
        document.getElementById("requestLocation").value;

    const hospital =
        document.getElementById("requestHospital").value;

    const emergency =
        document.getElementById("requestEmergency").checked;

    const message =
        document.getElementById("requestMessage").value;

    const statusMessage =
        document.getElementById("bloodRequestMessage");

    statusMessage.textContent =
        "Submitting blood request...";

    statusMessage.style.color = "#666";


    try {

        const response = await fetch(
            "/api/requests",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    receiver: loggedInUser.id,
                    bloodGroup,
                    units: Number(units),
                    location,
                    hospital,
                    emergency,
                    message
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            statusMessage.textContent =
                "Blood request created successfully.";

            statusMessage.style.color =
                "#25a55f";

            document
                .getElementById("bloodRequestForm")
                .reset();

        } else {

            statusMessage.textContent =
                data.message ||
                "Unable to create blood request.";

            statusMessage.style.color =
                "#d92d3f";
        }


    } catch (error) {

        console.error(error);

        statusMessage.textContent =
            "Unable to connect to server.";

        statusMessage.style.color =
            "#d92d3f";
    }
}

// =========================
// REQUEST HISTORY
// =========================

async function showRequestHistory() {

    const content =
        document.getElementById("receiverContent");

    if (!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">

            <div class="dashboard-form-header">

                <span class="dashboard-label">
                    <i class="bi bi-clock-history"></i>
                    Request History
                </span>

                <h2>Your Blood Requests</h2>

                <p>
                    Track the status of blood requests you
                    have submitted.
                </p>

            </div>

            <div id="requestHistoryList">
                <p>Loading request history...</p>
            </div>

        </div>
    `;

    try {

        const response = await fetch(
            `/api/requests/receiver/${loggedInUser.id}`
        );

        const data = await response.json();

        const list =
            document.getElementById("requestHistoryList");

        if (!response.ok) {

            list.innerHTML = `
                <p>
                    ${data.message ||
                    "Unable to load request history."}
                </p>
            `;

            return;
        }

        if (data.count === 0) {

            list.innerHTML = `
                <div class="dashboard-empty">

                    <i class="bi bi-inbox"></i>

                    <h3>No requests yet</h3>

                    <p>
                        Your blood requests will appear here.
                    </p>

                </div>
            `;

            return;
        }

        list.innerHTML = data.requests.map(request => {

            let statusClass = "";

            if (request.status === "accepted") {
                statusClass = "status-accepted";
            }

            if (request.status === "completed") {
                statusClass = "status-completed";
            }

            if (request.status === "cancelled") {
                statusClass = "status-cancelled";
            }

            return `

                <div class="request-card">

                    <div>

                        <span class="request-blood-group">
                            ${request.bloodGroup}
                        </span>

                        ${request.emergency ? `
                            <span class="request-emergency">
                                Emergency
                            </span>
                        ` : ""}

                        <h3>
                            ${request.hospital}
                        </h3>

                        <p>
                            <i class="bi bi-geo-alt"></i>
                            ${request.location}
                        </p>

                        <p>
                            <strong>${request.units}</strong>
                            unit(s) requested
                        </p>

                        ${request.donor ? `
                            <p>
                                Donor:
                                <strong>
                                    ${request.donor.name}
                                </strong>
                            </p>
                        ` : ""}

                    </div>

                    <div class="request-status ${statusClass}">
                        ${request.status}
                    </div>

                </div>

            `;

        }).join("");

    } catch (error) {

        console.error(error);

        document.getElementById(
            "requestHistoryList"
        ).innerHTML = `
            <p>Unable to connect to server.</p>
        `;
    }
}

async function showActiveRequests(){
 const content=document.getElementById("receiverContent");
 if(!content)return;

 content.innerHTML=`
 <div class="dashboard-form-card">
   <div class="dashboard-form-header">
     <span class="dashboard-label">
       <i class="bi bi-activity"></i>Active Requests
     </span>
     <h2>Your Active Blood Requests</h2>
     <p>Track blood requests that are currently pending or have been accepted.</p>
   </div>

   <div id="activeRequestsList">
     <p>Loading active requests...</p>
   </div>
 </div>`;

 try{
   const response=await fetch(`/api/requests/receiver/${loggedInUser.id}`);
   const data=await response.json();

   const list=document.getElementById("activeRequestsList");

   if(!response.ok){
     list.innerHTML=`<p>${data.message||"Unable to load active requests."}</p>`;
     return;
   }

   const activeRequests=data.requests.filter(
     request=>request.status==="pending" || request.status==="accepted"
   );

   if(activeRequests.length===0){
     list.innerHTML=`
       <div class="dashboard-empty">
         <i class="bi bi-check-circle"></i>
         <h3>No active requests</h3>
         <p>You currently have no pending or accepted blood requests.</p>
       </div>`;
     return;
   }

   list.innerHTML=activeRequests.map(request=>{
     let statusClass="";

     if(request.status==="accepted"){
       statusClass="status-accepted";
     }

     return `
       <div class="request-card">
         <div>
           <span class="request-blood-group">${request.bloodGroup}</span>

           ${request.emergency
             ? `<span class="request-emergency">Emergency</span>`
             : ""}

           <h3>${request.hospital}</h3>

           <p>
             <i class="bi bi-geo-alt"></i>
             ${request.location}
           </p>

           <p>
             <strong>${request.units}</strong> unit(s) requested
           </p>

           ${request.donor
             ? `<p><i class="bi bi-person"></i> Donor: <strong>${request.donor.name}</strong></p>`
             : `<p><i class="bi bi-person-x"></i> Waiting for a donor</p>`}
         </div>

         <div class="request-actions">
   <div class="request-status ${statusClass}">
      ${request.status}
   </div>

   <button class="dashboard-primary-btn"
      onclick="showMatchingDonors('${request._id}')">
      View Matches <i class="bi bi-people"></i>
   </button>
</div>
       </div>
     `;
   }).join("");

 }catch(error){
   console.error(error);

   const list=document.getElementById("activeRequestsList");

   if(list){
     list.innerHTML=`<p>Unable to connect to server.</p>`;
   }
 }
}

async function loadAdminDashboard() {

    try {

       const token = localStorage.getItem("bloodConnectToken");

const statsResponse = await fetch("/api/admin/stats", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});
        const stats = await statsResponse.json();

        if (!statsResponse.ok) {
            throw new Error("Unable to load statistics");
        }

        document.getElementById("totalUsers").textContent =
            stats.totalUsers;

        document.getElementById("totalDonors").textContent =
            stats.totalDonors;

        document.getElementById("totalReceivers").textContent =
            stats.totalReceivers;

        document.getElementById("totalDonations").textContent =
            stats.totalDonations;

        document.getElementById("totalRequests").textContent =
            stats.totalRequests;

        document.getElementById("pendingRequests").textContent =
            stats.pendingRequests;

        document.getElementById("completedRequests").textContent =
            stats.completedRequests;


        const overviewResponse =
    await fetch("/api/admin/overview", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

        const overview =
            await overviewResponse.json();

        if (!overviewResponse.ok) {
            throw new Error("Unable to load overview");
        }

const usersContainer =
    document.getElementById("adminUsers");

usersContainer.innerHTML = `
    <div class="admin-data-toolbar">

        <div class="admin-data-summary">
            <strong>${overview.users.length}</strong>
            <span>registered users</span>
        </div>

        <div class="admin-data-controls">

            <div class="admin-search-box">
                <i class="bi bi-search"></i>

                <input
                    type="text"
                    id="adminUserSearch"
                    placeholder="Search users..."
                    oninput="filterAdminUsers()"
                >
            </div>

            <select
                id="adminUserFilter"
                onchange="filterAdminUsers()"
                class="admin-filter-select"
            >
                <option value="all">All users</option>
                <option value="donor">Donors</option>
                <option value="receiver">Receivers</option>
            </select>

        </div>

    </div>

    <div class="admin-table-wrapper">

        <table class="admin-data-table">

            <thead>
                <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Blood Group</th>
                    <th>Location</th>
                    <th>Account</th>
                </tr>
            </thead>

            <tbody id="adminUsersTableBody">

                ${
                    overview.users.length === 0
                    ?
                    `
                    <tr>
                        <td colspan="6">
                            <div class="admin-table-empty">
                                <i class="bi bi-people"></i>
                                <h3>No users found</h3>
                                <p>There are currently no registered users.</p>
                            </div>
                        </td>
                    </tr>
                    `
                    :
                    overview.users.map(user => `

                        <tr
                            class="admin-user-row"
                            data-name="${user.name.toLowerCase()}"
                            data-email="${user.email.toLowerCase()}"
                            data-role="${user.role}"
                        >

                            <td>

                                <div class="admin-user-cell">

                                    <div class="admin-user-avatar">
                                        ${user.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>${user.name}</strong>
                                        <span>
                                            ID: ${String(user._id).slice(-6)}
                                        </span>
                                    </div>

                                </div>

                            </td>

                            <td>

                                <div class="admin-contact-cell">

                                    <span>
                                        <i class="bi bi-envelope"></i>
                                        ${user.email}
                                    </span>

                                    ${
                                        user.phone
                                        ?
                                        `
                                        <span>
                                            <i class="bi bi-telephone"></i>
                                            ${user.phone}
                                        </span>
                                        `
                                        :
                                        ""
                                    }

                                </div>

                            </td>

                            <td>

                                <span class="admin-role-badge ${user.role}">

                                    <i class="bi ${
                                        user.role === "donor"
                                        ? "bi-heart-pulse"
                                        : "bi-person-heart"
                                    }"></i>

                                    ${
                                        user.role.charAt(0).toUpperCase()
                                        + user.role.slice(1)
                                    }

                                </span>

                            </td>

                            <td>

                                ${
                                    user.bloodGroup
                                    ?
                                    `
                                    <span class="admin-blood-badge">
                                        ${user.bloodGroup}
                                    </span>
                                    `
                                    :
                                    `
                                    <span class="admin-muted-value">
                                        Not provided
                                    </span>
                                    `
                                }

                            </td>

                            <td>

                                <span class="admin-location-cell">

                                    <i class="bi bi-geo-alt"></i>

                                    ${
                                        user.location || "Not provided"
                                    }

                                </span>

                            </td>

                            <td>

                                <span class="admin-account-status">
                                    <span></span>
                                    Active
                                </span>

                            </td>

                        </tr>

                    `).join("")
                }

            </tbody>

        </table>

    </div>
`;


        const requestsContainer =
    document.getElementById("adminRequests");

requestsContainer.innerHTML = `

    <div class="admin-data-toolbar">

        <div class="admin-data-summary">
            <strong>${overview.requests.length}</strong>
            <span>blood requests</span>
        </div>

        <div class="admin-data-controls">

            <div class="admin-search-box">
                <i class="bi bi-search"></i>

                <input
                    type="text"
                    id="adminRequestSearch"
                    placeholder="Search requests..."
                    oninput="filterAdminRequests()"
                >
            </div>

            <select
                id="adminRequestFilter"
                onchange="filterAdminRequests()"
                class="admin-filter-select"
            >
                <option value="all">All requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>

        </div>

    </div>

    <div class="admin-table-wrapper">

        <table class="admin-data-table admin-request-table">

            <thead>
                <tr>
                    <th>Blood</th>
                    <th>Request</th>
                    <th>Receiver</th>
                    <th>Donor</th>
                    <th>Location</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody id="adminRequestsTableBody">

                ${
                    overview.requests.length === 0
                    ?
                    `
                    <tr>
                        <td colspan="6">

                            <div class="admin-table-empty">

                                <i class="bi bi-droplet"></i>

                                <h3>No blood requests</h3>

                                <p>
                                    There are currently no blood requests.
                                </p>

                            </div>

                        </td>
                    </tr>
                    `
                    :
                    overview.requests.map(request => `

                        <tr
                            class="admin-request-row"
                            data-search="
                                ${(request.hospital || "").toLowerCase()}
                                ${(request.location || "").toLowerCase()}
                                ${(request.receiver?.name || "").toLowerCase()}
                                ${(request.donor?.name || "").toLowerCase()}
                                ${(request.bloodGroup || "").toLowerCase()}
                            "
                            data-status="${request.status}"
                        >

                            <td>

                                <div class="admin-request-blood">

                                    <span class="admin-blood-badge">
                                        ${request.bloodGroup}
                                    </span>

                                    <strong>
                                        ${request.units}
                                        unit${request.units > 1 ? "s" : ""}
                                    </strong>

                                </div>

                            </td>

                            <td>

                                <div class="admin-request-info">

                                    <strong>
                                        ${request.hospital || "Hospital not provided"}
                                    </strong>

                                    <span>
                                        ${
                                            request.bloodComponent ||
                                            "Whole Blood"
                                        }
                                    </span>

                                    ${
                                        request.emergency
                                        ?
                                        `
                                        <span class="admin-emergency-badge">
                                            <i class="bi bi-exclamation-triangle-fill"></i>
                                            Emergency
                                        </span>
                                        `
                                        :
                                        ""
                                    }

                                </div>

                            </td>

                            <td>

                                <div class="admin-person-cell">

                                    <div class="admin-person-avatar">
                                        ${
                                            request.receiver?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "R"
                                        }
                                    </div>

                                    <span>
                                        ${
                                            request.receiver?.name ||
                                            "Unknown"
                                        }
                                    </span>

                                </div>

                            </td>

                            <td>

                                ${
                                    request.donor
                                    ?
                                    `
                                    <div class="admin-person-cell">

                                        <div class="admin-person-avatar donor-avatar">
                                            ${
                                                request.donor.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                            }
                                        </div>

                                        <span>
                                            ${request.donor.name}
                                        </span>

                                    </div>
                                    `
                                    :
                                    `
                                    <span class="admin-muted-value">
                                        Not assigned
                                    </span>
                                    `
                                }

                            </td>

                            <td>

                                <span class="admin-location-cell">

                                    <i class="bi bi-geo-alt"></i>

                                    ${
                                        request.location ||
                                        "Not provided"
                                    }

                                </span>

                            </td>

                            <td>

                                <span class="admin-request-status ${request.status}">
                                    <span></span>
                                    ${
                                        request.status
                                            .charAt(0)
                                            .toUpperCase()
                                        +
                                        request.status.slice(1)
                                    }
                                </span>

                            </td>

                        </tr>

                    `).join("")
                }

            </tbody>

        </table>

    </div>
`;
    } catch (error) {

        console.error(error);

        alert("Unable to load admin dashboard.");

    }
}


function adminLogout() {

    localStorage.removeItem("bloodConnectUser");
    localStorage.removeItem("bloodConnectToken");
    localStorage.removeItem("donorProfileCompleted");

    window.location.href = "/";

}


if (window.location.pathname === "/admin.html") {

    const adminUser =
        JSON.parse(localStorage.getItem("bloodConnectUser"));

    if (!adminUser || adminUser.role !== "admin") {

        alert("Admin login required.");

        window.location.href = "/login.html";

    } else {

        loadAdminDashboard();

    }
}


async function showMatchingDonors(requestId){
    const content = document.getElementById("receiverContent");
    if(!content) return;

    content.innerHTML = `
        <div class="dashboard-form-card">
            <div class="dashboard-form-header">
                <span class="dashboard-label">
                    <i class="bi bi-people"></i> Donor Matches
                </span>
                <h2>Matching Blood Donors</h2>
                <p>Donors matching this blood request are shown below.</p>
            </div>

            <div id="matchingDonorsList">
                <p>Finding matching donors...</p>
            </div>
        </div>
    `;

    try{
        const response = await fetch(
            `/api/requests/${requestId}/matching-donors`
        );

        const data = await response.json();
        const list = document.getElementById("matchingDonorsList");

        if(!response.ok){
            list.innerHTML = `
                <p>${data.message || "Unable to find matching donors."}</p>
            `;
            return;
        }

        if(data.count === 0){
            list.innerHTML = `
                <div class="dashboard-empty">
                    <i class="bi bi-person-x"></i>
                    <h3>No matching donors found</h3>
                    <p>No available donor currently matches this request.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = `
            <div class="dashboard-form-header">
                <h2>${data.count} Matching Donor${data.count > 1 ? "s" : ""}</h2>
            </div>

            ${data.donors.map(donor => `
                <div class="request-card">
                    <div>
                        <span class="request-blood-group">
                            ${donor.bloodGroup}
                        </span>

                        <h3>${donor.name}</h3>

                        <p>
                            <i class="bi bi-geo-alt"></i>
                            ${donor.location}
                        </p>

                        <p>
                            <i class="bi bi-telephone"></i>
                            ${donor.phone || "Phone unavailable"}
                        </p>
                    </div>

                    <div class="request-status status-completed">
                        Available
                    </div>
                </div>
            `).join("")}
        `;
    }
    catch(error){
        console.error(error);

        const list = document.getElementById("matchingDonorsList");

        if(list){
            list.innerHTML = `
                <p>Unable to connect to server.</p>
            `;
        }
    }
}

function adminScrollTo(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}


function filterAdminRequests() {

    const searchInput =
        document.getElementById("adminRequestSearch");

    const filter =
        document.getElementById("adminRequestFilter");

    const rows =
        document.querySelectorAll(".admin-request-row");

    if (!searchInput || !filter) return;

    const search =
        searchInput.value.toLowerCase().trim();

    const status =
        filter.value;

    rows.forEach(row => {

        const searchableText =
            row.dataset.search || "";

        const requestStatus =
            row.dataset.status || "";

        const matchesSearch =
            searchableText.includes(search);

        const matchesStatus =
            status === "all" ||
            requestStatus === status;

        row.style.display =
            matchesSearch && matchesStatus
            ? ""
            : "none";
    });
}


function filterAdminUsers() {

    const searchInput = document.getElementById("adminUserSearch");
    const filter = document.getElementById("adminUserFilter");

    const rows = document.querySelectorAll(".admin-user-row");

    if (!searchInput || !filter) return;

    const search = searchInput.value.toLowerCase().trim();
    const role = filter.value;

    rows.forEach(row => {

        const name = row.dataset.name || "";
        const email = row.dataset.email || "";
        const userRole = row.dataset.role || "";

        const matchesSearch =
            name.includes(search) ||
            email.includes(search);

        const matchesRole =
            role === "all" ||
            userRole === role;

        row.style.display =
            matchesSearch && matchesRole
            ? ""
            : "none";
    });
}