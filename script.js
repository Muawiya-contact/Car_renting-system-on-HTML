// Vehicles array
const vehicles = [
  { reg: "STU-543", type: "Car", brand: "Honda Civic", price: 7000, rented: false },
  { reg: "VWX-876", type: "Bike", brand: "Harley Davidson", price: 4000, rented: false },
  { reg: "YZA-135", type: "Truck", brand: "Volvo FH", price: 12000, rented: false },
];

let totalEarnings = 0;
let pin = "1234";

// Utility function to go back to the main menu
function backToMenu() {
  document.querySelectorAll("main > div").forEach((div) => div.classList.add("hidden"));
  document.getElementById("main-menu").classList.remove("hidden");
}

// List available vehicles
function listAvailableVehicles() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("vehicle-list").classList.remove("hidden");

  const vehicleContainer = document.getElementById("vehicles");
  vehicleContainer.innerHTML = "";
  vehicles.forEach((v) => {
    const status = v.rented ? "(Rented)" : "(Available)";
    vehicleContainer.innerHTML += `
      <div class="vehicle">
        <strong>${v.reg}</strong> - ${v.type} (${v.brand}) - ${v.price} PKR/day ${status}
      </div>
    `;
  });
}

// Rent a vehicle
function rentVehicle(event) {
  event.preventDefault();

  const regNumber = document.getElementById("reg-number").value.trim();
  const name = document.getElementById("name").value.trim();
  const birthdate = document.getElementById("birthdate").value.trim();

  const vehicle = vehicles.find((v) => v.reg === regNumber && !v.rented);

  if (vehicle) {
    vehicle.rented = true;
    const rentCost = vehicle.price;
    totalEarnings += rentCost;

    alert(`Vehicle rented successfully!\n\nName: ${name}\nVehicle: ${vehicle.type} (${vehicle.brand})\nRegistration: ${vehicle.reg}\nDaily Rent: ${rentCost} PKR.`);
    backToMenu();
  } else {
    alert("Invalid registration number or vehicle is already rented.");
  }
}

// Return a vehicle
function returnVehicle(event) {
  event.preventDefault();

  const regNumber = document.getElementById("return-reg-number").value.trim();
  const vehicle = vehicles.find((v) => v.reg === regNumber && v.rented);

  if (vehicle) {
    vehicle.rented = false;
    alert(`Vehicle returned successfully!\n\nVehicle: ${vehicle.type} (${vehicle.brand})\nRegistration: ${vehicle.reg}`);
    backToMenu();
  } else {
    alert("Invalid registration number or vehicle is not currently rented.");
  }
}

// Calculate total earnings
function calculateEarnings() {
  alert(`Total earnings from rentals: ${totalEarnings} PKR.`);
}

// Change PIN
function showPinForm() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("pin-form").classList.remove("hidden");
}

function changePin(event) {
  event.preventDefault();

  const currentPin = document.getElementById("current-pin").value.trim();
  const newPin = document.getElementById("new-pin").value.trim();

  if (currentPin === pin) {
    pin = newPin;
    alert("Pin changed successfully!");
    backToMenu();
  } else {
    alert("Incorrect current pin.");
  }
}
