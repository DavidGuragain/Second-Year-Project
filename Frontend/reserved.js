const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const vehicleType = document.getElementById('vehicleType').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('http://localhost:3000/reserved', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vehicleType, preferredDate, fullName, email, contactNumber, message })
        });

        if (response.ok) {
            // Handle success with toastr setTimeout(() => {
                window.location.reload();
          
        } else {
            // Handle error
            toastr.error('Failed to submit form');
            console.error('Failed to submit form:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        toastr.error('An error occurred while submitting the form');
    }
});
