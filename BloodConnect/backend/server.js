const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "bloodconnect_secret_2026";

const User = require("./models/User");
const BloodRequest = require("./models/BloodRequest");
const Donation = require("./models/Donation");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.log("MongoDB connection error:", error));

app.get("/", (req, res) => {
    res.send("BloodConnect Backend is Running!");
});

// User Registration
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        if (!["donor", "receiver"].includes(role)) {
            return res.status(400).json({
                message: "Role must be donor or receiver"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// User Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

       const token = jwt.sign(
    {
        id: user._id,
        role: user.role
    },
    JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

res.status(200).json({
    message: "Login successful",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {

        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        if (user.role !== "admin") {
    return res.status(403).json({
        message: "Admin access required"
    });
}

req.user = user;

next();
    });
}



// Update Donor Profile
app.put("/api/donor/profile/:id", async (req, res) => {
    try {
        const {
    bloodGroup,
    location,
    phone,
    isAvailable,
    bloodComponents
} = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role !== "donor") {
            return res.status(403).json({
                message: "Only donors can update donor profile"
            });
        }

        user.bloodGroup = bloodGroup || "";
user.location = location || "";
user.phone = phone || "";
user.isAvailable = Boolean(isAvailable);

user.bloodComponents =
    bloodComponents && bloodComponents.length > 0
        ? bloodComponents
        : ["Whole Blood"];

        await user.save();

        res.status(200).json({
            message: "Donor profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodGroup: user.bloodGroup,
                location: user.location,
                phone: user.phone,
                isAvailable: user.isAvailable
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Search Available Donors
app.get("/api/donors/search", async (req, res) => {
    try {
        const { bloodGroup, location } = req.query;

        const filter = {
            role: "donor",
            isAvailable: true
        };

        if (bloodGroup) {
            filter.bloodGroup = bloodGroup;
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        const donors = await User.find(filter).select(
            "name bloodGroup location phone isAvailable"
        );

        res.status(200).json({
            count: donors.length,
            donors
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Create Blood Request
app.post("/api/requests", async (req, res) => {
    try {
        const {
    receiver,
    bloodGroup,
    bloodComponent,
    units,
    location,
    hospital,
    emergency,
    message
} = req.body;

        if (!receiver || !bloodGroup || !units || !location || !hospital) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const user = await User.findById(receiver);

        if (!user) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        if (user.role !== "receiver") {
            return res.status(403).json({
                message: "Only receivers can create blood requests"
            });
        }

        const bloodRequest = new BloodRequest({
    receiver,
    bloodGroup,
    bloodComponent,
    units,
    location,
    hospital,
    emergency,
    message
});

        await bloodRequest.save();

        res.status(201).json({
            message: "Blood request created successfully",
            request: bloodRequest
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Find Matching Donors for a Blood Request
app.get("/api/requests/:id/matching-donors", async (req, res) => {
    try {
        const bloodRequest = await BloodRequest.findById(req.params.id);

      

        if (!bloodRequest) {
            return res.status(404).json({
                message: "Blood request not found"
            });
        }
const donors = await User.find({
    role: "donor",
    bloodGroup: bloodRequest.bloodGroup,
    location: {
        $regex: bloodRequest.location,
        $options: "i"
    },
    isAvailable: true,
    bloodComponents: bloodRequest.bloodComponent
}).select("name bloodGroup location phone isAvailable bloodComponents");

        res.status(200).json({
            requestId: bloodRequest._id,
            count: donors.length,
            donors
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.put("/api/requests/:id/respond", async (req, res) => {
    try {
        const { donorId, action } = req.body;

        if (!donorId || !action) {
            return res.status(400).json({
                message: "donorId and action are required"
            });
        }

        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({
                message: "Action must be accept or reject"
            });
        }

        const bloodRequest = await BloodRequest.findById(req.params.id);

        if (!bloodRequest) {
            return res.status(404).json({
                message: "Blood request not found"
            });
        }

        const donor = await User.findById(donorId);

        if (!donor) {
            return res.status(404).json({
                message: "Donor not found"
            });
        }

        if (donor.role !== "donor") {
            return res.status(403).json({
                message: "Only donors can respond to requests"
            });
        }

        if (action === "accept") {
    bloodRequest.status = "accepted";
    bloodRequest.donor = donorId;
    await bloodRequest.save();

            return res.status(200).json({
                message: "Blood request accepted successfully",
                request: bloodRequest
            });
        }

       bloodRequest.status = "cancelled";
await bloodRequest.save();

res.status(200).json({
    message: "Blood request rejected successfully",
    request: bloodRequest
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.put("/api/requests/:id/complete", async (req, res) => {
    try {
        const { donorId } = req.body;

        if (!donorId) {
            return res.status(400).json({
                message: "donorId is required"
            });
        }

        const bloodRequest = await BloodRequest.findById(req.params.id);

        if (!bloodRequest) {
            return res.status(404).json({
                message: "Blood request not found"
            });
        }

        if (bloodRequest.status !== "accepted") {
            return res.status(400).json({
                message: "Only accepted requests can be completed"
            });
        }

        const donor = await User.findById(donorId);

        if (!donor || donor.role !== "donor") {
            return res.status(403).json({
                message: "Valid donor is required"
            });
        }

        const donation = new Donation({
            donor: donorId,
            receiver: bloodRequest.receiver,
            bloodRequest: bloodRequest._id,
            bloodGroup: bloodRequest.bloodGroup,
            units: bloodRequest.units,
            hospital: bloodRequest.hospital
        });

        await donation.save();

        bloodRequest.status = "completed";
        await bloodRequest.save();

        res.status(200).json({
            message: "Donation completed successfully",
            donation,
            request: bloodRequest
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/api/donations/donor/:donorId", async (req, res) => {
    try {
        const donor = await User.findById(req.params.donorId);

        if (!donor || donor.role !== "donor") {
            return res.status(404).json({
                message: "Donor not found"
            });
        }

        const donations = await Donation.find({
            donor: req.params.donorId
        })
        .populate("receiver", "name email")
        .populate("bloodRequest", "location hospital emergency")
        .sort({ donationDate: -1 });

        res.status(200).json({
            count: donations.length,
            donations
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.get("/api/requests/receiver/:receiverId", async (req, res) => {
    try {
        const receiver = await User.findById(req.params.receiverId);

        if (!receiver || receiver.role !== "receiver") {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        const requests = await BloodRequest.find({
            receiver: req.params.receiverId
        })
        .populate("donor", "name email bloodGroup location phone")
        .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// =========================
// DONOR BLOOD REQUESTS
// =========================

app.get("/api/requests/donor/:donorId", async (req, res) => {
    try {
        const donor = await User.findById(req.params.donorId);

        if (!donor || donor.role !== "donor") {
            return res.status(404).json({
                message: "Donor not found"
            });
        }

        const requests = await BloodRequest.find({
            bloodGroup: donor.bloodGroup,
            location: {
                $regex: donor.location,
                $options: "i"
            },
            status: "pending"
        })
        .populate("receiver", "name email")
        .sort({ emergency: -1, createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.get("/api/requests/donor/:donorId/accepted", async (req, res) => {
    try {
        const donor = await User.findById(req.params.donorId);

        if (!donor || donor.role !== "donor") {
            return res.status(404).json({
                message: "Donor not found"
            });
        }

        const requests = await BloodRequest.find({
            donor: req.params.donorId,
            status: "accepted"
        })
        .populate("receiver", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`BloodConnect server running on http://localhost:${PORT}`);
});


app.get("/api/admin/stats", authenticateToken, async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalDonors = await User.countDocuments({
            role: "donor"
        });

        const totalReceivers = await User.countDocuments({
            role: "receiver"
        });

        const totalRequests = await BloodRequest.countDocuments();

        const pendingRequests = await BloodRequest.countDocuments({
            status: "pending"
        });

        const completedRequests = await BloodRequest.countDocuments({
            status: "completed"
        });

        const totalDonations = await Donation.countDocuments();

        res.status(200).json({
            totalUsers,
            totalDonors,
            totalReceivers,
            totalRequests,
            pendingRequests,
            completedRequests,
            totalDonations
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load admin statistics"
        });
    }
});


app.get("/api/admin/overview", authenticateToken, async (req, res) => {
    try {

        const users = await User.find()
            .select("name email role bloodGroup location isAvailable createdAt")
            .sort({ createdAt: -1 });

        const requests = await BloodRequest.find()
            .populate("receiver", "name email")
            .populate("donor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            users,
            requests
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load admin overview"
        });
    }
});