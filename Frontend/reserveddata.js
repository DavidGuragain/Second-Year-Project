// Declare reservedDataContainer as a constant global variable
const reservedDataContainer = document.getElementById('reservedData');

// Fetch reservation data from the backend
fetch('http://localhost:3000/reservations')
  .then(response => response.json())
  .then(data => {
    data.reservations.forEach(reservation => {
      // Create a div element for each reservation
      const reservationItem = document.createElement('div');
      reservationItem.classList.add('reservation-item');
      id= reservation.reserveID;
      // Populate the reservation data into the div
      reservationItem.innerHTML = `
      <h2>${reservation.full_name}</h2>
      <p><strong>Vehicle Type:</strong> ${reservation.vehicle_type}</p>
      <p><strong>Preferred Date:</strong> ${reservation.preferred_date}</p>
      <p><strong>Email:</strong> ${reservation.email}</p>
      <p><strong>Contact Number:</strong> ${reservation.contact_number}</p>
      <p><strong>Message:</strong> ${reservation.message}</p>
      <button class="btn btn-update" onclick="editReservation(${reservation.reserveID})">Edit</button>
      <button class="btn btn-delete" onclick="deleteReservation(${reservation.reserveID})">Delete</button>
    `;
      // Append the reservation div to the container
      reservedDataContainer.appendChild(reservationItem);
    });
  })
  .catch(error => console.error('Error fetching reservation data:', error));

  function editReservation(reservationId) {
    window.location.href = `updateReserve.html?reservationId=${reservationId}`;
  }

// Function to delete a reservation
async function deleteReservation(reservationId) {
  fetch(`http://localhost:3000/reservations/${reservationId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        window.location.reload();
        console.log('Reservation deleted successfully');
      } else {
        console.error('Failed to delete reservation');
      }
    })
    .catch(error => console.error('Error deleting reservation:', error));
}

