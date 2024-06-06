const express = require('express');
const app = express();
const cors = require('cors');
const { QueryTypes } = require('sequelize');
const {sequelize, users ,reserves} = require('./Model/Index');
const bcrypt = require('bcrypt')
const mysql = require('mysql');


const db = mysql.createPool({
    connectionLimit: 10, // Adjust as needed
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hamro'
  });
  


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

const emailRegex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/;

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)

    try {
        if (!username || !email || !password) {
            return res.status(401).json({ error: "Please fill all the fields!" });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please provide a valid Gmail address" });
        }

        const checkEmail = await users.findAll({
            where: {
                Email: email
            }
        });

        const pass = bcrypt.hashSync(password, 10);

        if (checkEmail.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        await sequelize.query('INSERT INTO users (UserName, Email, Password) VALUES (?, ?, ?)', {
            type: QueryTypes.INSERT,
            replacements: [username, email, pass]
        });

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) { 
        return res.status(400).json({ error: "fill input" }); 
    }

    const user = await users.findOne({
        where: {
            Email: email
        }
    });

    if (!user) {
        return res.status(401).json({ error: "User does not exist." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.Password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorrect password." });
    }
    return res.status(200).json({ message: "Login successful." });
});

app.post('/reserved', (req, res) => {
    const { vehicleType, preferredDate, fullName, email, contactNumber, message } = req.body;
  
    // Insert data into MySQL database
    const sql = 'INSERT INTO reserved (vehicle_type, preferred_date, full_name, email, contact_number, message) VALUES (?, ?, ?, ?, ?, ?)';
    sequelize.query(sql, {
        replacements: [vehicleType, preferredDate, fullName, email, contactNumber, message],
        type: QueryTypes.INSERT
    })
    .then(result => {
        res.status(200).json({ message: 'Data inserted successfully' });
    })
    .catch(err => {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
});

// Define the route handler for GET /reservations
app.get('/reservations', (req, res) => {
    // Get a connection from the pool
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection from pool:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      // Execute the SQL query to fetch reservation data
      const fetchReservationsQuery = 'SELECT * FROM reserved';
      connection.query(fetchReservationsQuery, (queryErr, results) => {
        // Release the connection back to the pool
        connection.release();
  
        if (queryErr) {
          console.error('Error fetching reservations:', queryErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        
        // Send the fetched reservation data as a JSON response
        res.status(200).json({ reservations: results });
      });
    });
  });
// end of getting reservations details


//start of deleting reservations
app.delete('/reservations/:id', (req, res) => {
    // Get the reservation ID from the request parameters
    const reservationId = req.params.id;

  
    // Get a connection from the pool
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection from pool:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      // Execute the SQL query to delete the reservation
      const sql = 'DELETE FROM reserved WHERE reserveID = ?';
      connection.query(sql, [reservationId], (queryErr, results) => {
        // Release the connection back to the pool
        connection.release();
  
        if (queryErr) {
          console.error('Error deleting reservation:', queryErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        
        // Check if any rows were affected (if a reservation was deleted)
        if (results.affectedRows === 1) {
          res.status(200).json({ message: 'Reservation deleted successfully' });
        } else {
          res.status(404).json({ error: 'Reservation not found' });
        }
      });
    });
  });
//   end of delete api 


//getting reserve details by id 
app.get('/reservations/:id', (req, res) => {
    const reservationId = req.params.id;
  
    // Acquire a connection from the pool
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Fetch reservation data from the database based on reservationId
      connection.query('SELECT * FROM reserved WHERE reserveID = ?', [reservationId], (error, results) => {
        // Release the connection back to the pool
        connection.release();
  
        if (error) {
          console.error('Error fetching reservation data:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
  
        // Send the fetched reservation data as JSON response
        res.json(results[0]);
      });
    });
  });

//end of getting reserver by id 

// start of update apii
app.put('/reservations/:id', (req, res) => {
    const reservationId = req.params.id;
    const updatedData = req.body;
  
    // Acquire a connection from the pool
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Update the reservation in the database
      connection.query('UPDATE reserved SET ? WHERE reserveID = ?', [updatedData, reservationId], (error, results) => {
        // Release the connection back to the pool
        connection.release();
  
        if (error) {
          console.error('Error updating reservation:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
  
        // Send a success response
        res.json({ message: 'Reservation updated successfully' });
      });
    });
  });
  
  
//end of uodate api  



app.listen(3000, () => {
    console.log("The server is running");
});
