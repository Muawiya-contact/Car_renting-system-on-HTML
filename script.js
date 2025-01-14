// Vehicles array
const vehicles = [
  { reg: "STU-543", type: "Car", brand: "Honda Civic", price: 7000, rented: false },
  { reg: "VWX-876", type: "Bike", brand: "Harley Davidson", price: 4000, rented: false },
  { reg: "YZA-135", type: "Truck", brand: "Volvo FH", price: 12000, rented: false },
];

let totalEarnings = 0;
let pin = "1234";

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
        <span>${v.reg} - ${v.type} (${v.brand})</span> - ${v.price} PKR/day ${status}
        <button class="copy-btn" onclick="copyReg('${v.reg}')">Copy Reg</button>
        <div class="copy-msg" id="msg-${v.reg}">Copied!</div>
      </div>
    `;
  });
}

// Copy registration number
function copyReg(reg) {
  const regField = document.createElement("textarea");
  regField.value = reg;
  document.body.appendChild(regField);
  regField.select();
  document.execCommand("copy");
  document.body.removeChild(regField);

  const msg = document.getElementById(`msg-${reg}`);
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 1500);
}

// Show rent form
function showRentForm() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("rent-form").classList.remove("hidden");

  const vehicleSelect = document.getElementById("vehicle-select");
  vehicleSelect.innerHTML = "";
  vehicles.forEach((v) => {
    if (!v.rented) {
      vehicleSelect.innerHTML += `<option value="${v.reg}">${v.reg} - ${v.type} (${v.brand})</option>`;
    }
  });
}

// Rent vehicle
function rentVehicle() {
  const selectedReg = document.getElementById("vehicle-select").value;
  const rentDays = document.getElementById("rent-days").value;

  const vehicle = vehicles.find((v) => v.reg === selectedReg);
  if (vehicle && rentDays > 0) {
    vehicle.rented = true;
    const rentCost = vehicle.price * rentDays;
    totalEarnings += rentCost;

    alert(`You have rented the ${vehicle.type} (${vehicle.brand}) for ${rentDays} days. Total cost: ${rentCost} PKR.`);
    document.getElementById("rent-form").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
  } else {
    alert("Invalid input. Please try again.");
  }
}

// Show return form
function showReturnForm() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("return-form").classList.remove("hidden");

  const returnSelect = document.getElementById("return-select");
  returnSelect.innerHTML = "";
  vehicles.forEach((v) => {
    if (v.rented) {
      returnSelect.innerHTML += `<option value="${v.reg}">${v.reg} - ${v.type} (${v.brand})</option>`;
    }
  });
}

// Return vehicle
function returnVehicle() {
  const selectedReg = document.getElementById("return-select").value;

  const vehicle = vehicles.find((v) => v.reg === selectedReg);
  if (vehicle) {
    vehicle.rented = false;
    alert(`You have successfully returned the ${vehicle.type} (${vehicle.brand}).`);
    document.getElementById("return-form").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
  } else {
    alert("Invalid input. Please try again.");
  }
}

// View earnings
function viewEarnings() {
  alert(`Total earnings: ${totalEarnings} PKR.`);
}
