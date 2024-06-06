  // Function to retrieve URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Retrieve the reservationId from URL parameters
  const reservationId = getUrlParameter('reservationId');

  // Fetch reservation data based on the reservationId
  fetch(`http://localhost:3000/reservations/${reservationId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Populate form fields with fetched reservation data
      document.getElementById('vehicleType').value = data.vehicle_type;
      const preferredDate = new Date(data.preferred_date);
      const formattedDate = preferredDate.toISOString().split('T')[0];
      document.getElementById('preferredDate').value = formattedDate;
      document.getElementById('fullName').value = data.full_name;
      document.getElementById('email').value = data.email;
      document.getElementById('contactNumber').value = data.contact_number;
      document.getElementById('message').value = data.message;
    })
    .catch(error => console.error('Error fetching reservation data:', error));

  // Handle form submission to update reservation
  document.getElementById('edit-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Fetch updated data from form fields
    const vehicleType = document.getElementById('vehicleType').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const message = document.getElementById('message').value;

    // Construct updated reservation object
    const updatedReservation = {
      vehicle_type: vehicleType,
      preferred_date: preferredDate,
      full_name: fullName,
      email: email,
      contact_number: contactNumber,
      message: message
    };

    // Send PUT request to update reservation
    fetch(`http://localhost:3000/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedReservation)
    })
      .then(response => {
        if (response.ok) {
          console.log('Reservation updated successfully');
          // Redirect back to the previous page or to a confirmation page
          window.location.href = 'displayReserve.html';
        } else {
          console.error('Failed to update reservation');
        }
      })
      .catch(error => console.error('Error updating reservation:', error));
  });