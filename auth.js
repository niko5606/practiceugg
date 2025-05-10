// ✅ Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB_rXWCXqQdi6tshyUiKLiDfSKqMzqu6KQ",
  authDomain: "login-b3b32.firebaseapp.com",
  projectId: "login-b3b32",
  storageBucket: "login-b3b32.appspot.com",
  messagingSenderId: "1078150727311",
  appId: "1:1078150727311:web:42c7bde4a5482c5daad2fa",
  databaseURL: "https://login-b3b32-default-rtdb.firebaseio.com"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// ✅ Register Logic (with new fields merged)
document.getElementById("submitSignUp").addEventListener("click", async (e) => {
  e.preventDefault();

  const fName = document.getElementById("fName").value.trim();
  const lName = document.getElementById("lName").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const studentID = document.getElementById("studentID").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("pEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  const messageDiv = document.getElementById("signUpMessage");

  if (!fName || !lName || !email || !password || !confirmPassword || !studentID || !contact || !address) {
    messageDiv.innerText = "Please fill in all fields.";
    messageDiv.style.display = "block";
    return;
  }

  if (password !== confirmPassword) {
    messageDiv.innerText = "Passwords do not match.";
    messageDiv.style.display = "block";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔹 Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: fName,
      lastName: lName,
      email,
      contact,
      address,
      studentID
    });

    // 🔹 Save to Realtime DB
    await set(ref(rtdb, "students/" + user.uid), {
      firstName: fName,
      lastName: lName,
      email,
      contact,
      address,
      studentID,
      plate: "",
      color: "",
      model: "",
      type: "",
      profileImageURL: "",
      vehicleImageURL: ""
    });

    // 🔹 Save user ID
    localStorage.setItem("loggedInUserId", user.uid);
    window.location.href = "../home page/homepage.html";

  } catch (error) {
    messageDiv.innerText = "Error: " + error.message;
    messageDiv.style.display = "block";
    console.error(error);
  }
});
