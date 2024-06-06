const btn = document.getElementById('btn');

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/register', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const responseData = await response.json();

    if (response.ok) {
        toastr.success(responseData.message); // Display success message
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        setTimeout(() => {
            window.location.href = '../pages/login.html';
        }, 1000); // 5000 milliseconds = 5 seconds
    } else {
        toastr.error(responseData.error); // Display error message
    }
});


