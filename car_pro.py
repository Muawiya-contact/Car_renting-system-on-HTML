import datetime
import os
import re

# Default pin code stored as a variable
PIN_CODE = "1234"

def file_read(filename):
    """Reads the contents of a file and returns a list of lines."""
    if not os.path.exists(filename):
        return []  # Return an empty list if the file doesn't exist
    with open(filename, "r") as myfile:
        return myfile.readlines()

def write_file(filename, data):
    """Writes a list of data to a file, overwriting its content."""
    with open(filename, "w") as myfile:
        myfile.writelines(data)

def append_to_file(filename, line):
    """Appends a single line of text to a file."""
    with open(filename, "a") as myfile:
        myfile.write(line + "\n")

def calculate_age(birthday_date):
    """Calculates the age of the client from their birthday."""
    try:
        client_birth_date = datetime.datetime.strptime(birthday_date, "%d/%m/%Y")
        today = datetime.datetime.today()
        age = today.year - client_birth_date.year - ((today.month, today.day) < (client_birth_date.month, client_birth_date.day))
        return age
    except ValueError:
        return None

def get_valid_date_input(prompt):
    """Continuously prompts the user to enter a valid date in DD/MM/YYYY format."""
    while True:
        date_input = input(prompt).strip()
        age = calculate_age(date_input)
        if age is not None:
            return date_input, age
        print("❌ Oops! Invalid date format. Please use DD/MM/YYYY (e.g., 11/03/2006).")

def get_valid_name_input(prompt):
    """Continuously prompts the user to enter a valid name (only letters)."""
    while True:
        name = input(prompt).strip().capitalize()
        if name.isalpha():
            return name
        print("❌ Name should contain only letters and start with a capital letter.")

def get_valid_email_input(prompt):
    """Continuously prompts the user to enter a valid email."""
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    while True:
        email = input(prompt).strip()
        if re.match(pattern, email):
            return email
        print("❌ Invalid email format. Please try again.")

def list_available_vehicles():
    """Displays the list of available vehicles."""
    vehicles = file_read("vehicles.txt")
    rented = [line.split(",")[0] for line in file_read("rentedVehicles.txt")]
    available_cars = [line for line in vehicles if line.split(",")[0] not in rented]

    print("\n🚘 **Available Vehicles for Rent** 🚘")
    for car in available_cars:
        print(f"  - {car.strip()}")

def rent_vehicle():
    """Handles the process of renting a vehicle."""
    vehicles = file_read("vehicles.txt")
    rented_cars = [line.split(",")[0] for line in file_read("rentedVehicles.txt")]

    while True:
        registration_number = input("🔎 Enter the registration number of the vehicle: ").strip().upper()
        if registration_number in [line.split(",")[0] for line in vehicles]:
            if registration_number in rented_cars:
                print("❌ Sorry, this vehicle is already rented.")
            else:
                break
        else:
            print("❌ Vehicle not found. Please enter a valid registration number.")

    birthday_date, age = get_valid_date_input("📅 Please enter your birth date (DD/MM/YYYY): ")
    if age < 18:
        print("❌ Sorry, you must be at least 18 years old to rent a vehicle.")
        return

    f_name = get_valid_name_input("👤 Please enter your first name: ")
    l_name = get_valid_name_input("👤 Please enter your last name: ")
    email = get_valid_email_input("📧 Please enter your email: ")

    append_to_file("customers.txt", f"{birthday_date},{f_name},{l_name},{email}")
    rent_start = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
    append_to_file("rentedVehicles.txt", f"{registration_number},{birthday_date},{rent_start}")

    print(f"🎉 **Congratulations, {f_name} {l_name}!** You've successfully rented the vehicle (Registration: {registration_number}) on {rent_start}.")

def return_vehicle():
    """Handles the process of returning a vehicle."""
    rented = file_read("rentedVehicles.txt")
    registration_number = input("🔙 Enter the registration number of the vehicle you're returning: ").strip().upper()

    rented_entry = next((line for line in rented if line.split(",")[0] == registration_number), None)
    if not rented_entry:
        print("❌ This vehicle is not rented.")
        return

    rented.remove(rented_entry)
    rented_data = rented_entry.split(",")

    rent_start = rented_data[2].strip()
    try:
        rent_start = datetime.datetime.strptime(rent_start, "%d/%m/%Y %H:%M")
    except ValueError as e:
        print(f"❌ Error parsing the rental start date: {e}")
        return

    rent_end = datetime.datetime.now()
    days_rented = max(1, (rent_end - rent_start).days)

    price_per_day = 0
    for line in file_read("vehicles.txt"):
        vehicle_data = line.split(",")
        if vehicle_data[0] == registration_number:
            try:
                price_per_day = int(vehicle_data[3].strip())
                break
            except (ValueError, IndexError):
                print(f"❌ Price missing or invalid for vehicle {registration_number}. Defaulting to 0 PKR per day.")
                price_per_day = 0
                break

    total_cost = days_rented * price_per_day

    write_file("rentedVehicles.txt", rented)
    append_to_file("transactions.txt", f"{registration_number},{rented_data[1]},{rented_data[2]},{rent_end.strftime('%d/%m/%Y %H:%M')},{days_rented},{total_cost}")

    print(f"💸 **Return Successful!** Your total cost is {total_cost} PKR. Thank you for using our service! 😊")

def count_earnings():
    """Calculates and displays total earnings from rentals."""
    transactions = file_read("transactions.txt")
    total = 0
    for line in transactions:
        try:
            total_cost = float(line.split(",")[-1])
            total += total_cost
        except ValueError:
            continue  # Ignore lines where total cost is not a valid number
    print(f"📊 **Total Earnings: {total} PKR** 💰")

def change_pin():
    """Allows the admin to change the pin code."""
    global PIN_CODE  # Declare PIN_CODE as global to modify its value
    current_pin = input("🔑 Enter the current pin code: ").strip()
    if current_pin == PIN_CODE:
        new_pin = input("🔑 Enter the new pin code: ").strip()
        confirm_pin = input("🔑 Confirm the new pin code: ").strip()
        if new_pin == confirm_pin:
            PIN_CODE = new_pin  # Update the global PIN_CODE
            print("✅ Pin code updated successfully!")
        else:
            print("❌ Pin codes do not match. Try again.")
    else:
        print("❌ Incorrect current pin code.")

def main():
    """Main menu and program execution logic."""
    while True:
        print("\n📋 **Welcome to Vehicle Rental System** 🚗")
        print("1️⃣  List of available vehicles")
        print("2️⃣  Rent a Vehicle")
        print("3️⃣  Return a Vehicle")
        print("4️⃣  View Total Earnings")
        print("5️⃣  Change Pin Code")
        print("0️⃣  Exit")

        choice = input("👉 Choose an option: ").strip()

        if choice == "1":
            list_available_vehicles()
        elif choice == "2":
            rent_vehicle()
        elif choice == "3":
            return_vehicle()
        elif choice == "4":
            print("🔑 Please, enter the pin code: ")
            pin = input("👉 Pin: ").strip()
            if pin == PIN_CODE:
                count_earnings()
            else:
                print("❌ Incorrect pin code.")
        elif choice == "5":
            change_pin()
        elif choice == "0":
            print("👋 Goodbye! See you next time. Stay safe! ✨")
            break
        else:
            print("❌ Invalid option. Please select a valid number.")

if __name__ == "__main__":
    main()
