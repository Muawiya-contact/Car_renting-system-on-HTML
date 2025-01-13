const vehicles = [
  { reg: "STU-543", type: "Car", brand: "Honda Civic", price: 7000, rented: false },
  { reg: "VWX-876", type: "Bike", brand: "Harley Davidson", price: 4000, rented: false },
  { reg: "YZA-135", type: "Truck", brand: "Volvo FH", price: 12000, rented: false },
];

let totalEarnings = 0;
let pin = "1234";

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

function showRentForm
