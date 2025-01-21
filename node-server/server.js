const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { Pool } = require('pg');


const pool = new Pool({
    user: 'postgres',       // Replace with your PostgreSQL username
    host: 'localhost',          // Replace with your database host
    database: 'postgres',   // Replace with your database name
    password: 'Mposkou2',   // Replace with your PostgreSQL password
    port: 5432,                 // Default PostgreSQL port
  });




// Middleware
app.use(cors()); // Enable CORS for cross-origin requests

// Middleware to parse plain text data
app.use(express.text()); // Parses plain text payloads





//functions starting here
//login function
app.post('/login/data', async (req, res) => {
    const body = req.body; // Plain text data as a string

    const params = new URLSearchParams(body);
    const name = params.get('name');
    const password = params.get('password');

    const result = await pool.query('SELECT * FROM users WHERE name = $1 AND password = $2', [name, password]);

    if (result.rows.length > 0) {
        res.send('200');
    } else {
        res.send('User not found');
    }
});


//register function
app.post('/register/data', (req, res) => {
    const body = req.body; // Plain text data as a string
    console.log('Received raw data:', body);

    const params = new URLSearchParams(body);
    const name = params.get('name');
    const mail = params.get('mail');
    const password = params.get('password');
    const country = params.get('country');
    const zipcode = params.get('zipcode');
    const date = new Date();

    // Respond back to the client
    console.log('Parsed Data:', { name, mail, password, country, zipcode });
   
    const registerquery = `
    INSERT INTO users (name, mail, password, country, zip_code, date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
    `;

    const values = [name, mail, password, country, zipcode, date];

    pool.query(registerquery, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data into database.');
        }
        console.log('Inserted data with ID:', result.rows[0].id);
        res.send(`100`);
    });

});


app.get('/parking/data', async (req, res) => {
    try {
      // Query the database for parking locations with the additional fields
      const result = await pool.query('SELECT id, name, latitude, longitude, link, stars, hrate, spots FROM parkings');
  
      // Send the data as JSON
      console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching parking data:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.use(express.json());

  app.post('/reservations/data', async (req, res) => {
    const {
      parkingId,
      parkingName,
      startingDateTime,
      finishingDateTime,
      totalCost,
      rate,
      username,
      hours,
    } = req.body;
  
    // Validate the data
    if (!parkingId || !parkingName || !startingDateTime || !finishingDateTime || !totalCost || !rate || !username || !hours) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Prepare the SQL query to insert the reservation data into the database
    const insertQuery = `
     INSERT INTO reservations (
  parking_id, 
  parking_name, 
  starting_date_time, 
  finishing_date_time, 
  total_cost, 
  rate, 
  username, 
  hours
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
);
    `;
  
    // Execute the query to save the data into the database
    try {
      const result = await pool.query(insertQuery, [
        parkingId,
        parkingName,
        startingDateTime,
        finishingDateTime,
        totalCost,
        rate,
        username,
        hours,
      ]);
  
      // Log the inserted reservation for confirmation
      console.log('Reservation saved to database:', result.rows[0]);
  
      // Send a success response back to the client
      return res.status(200).json({ message: 'Reservation data saved successfully', reservation: result.rows[0] });
    } catch (error) {
      console.error('Error saving reservation to database:', error);
      return res.status(500).json({ error: 'Failed to save reservation data to the database' });
    }
  });

  app.get('/getreservations', async (req, res) => {
    const { username } = req.query; // Get the username from query parameters
  
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    try {
      // Query to fetch reservations for the provided username
      const query = `
        SELECT 
          id, 
          parking_id, 
          parking_name, 
          starting_date_time, 
          finishing_date_time, 
          total_cost, 
          rate, 
          username, 
          hours, 
          created_at
        FROM reservations
        WHERE username = $1
        ORDER BY starting_date_time DESC;`;
  
      // Execute the query with the provided username
      const result = await pool.query(query, [username]);
  
      // Check if reservations were found
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No reservations found for this username' });
      }
  
      // Send the reservations as a response
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Error fetching reservations' });
    }
  });




  app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parses JSON payloads

// Fetch reservations by parking name
app.get('/reservations', async (req, res) => {
    const { parkingName } = req.query;
    if (!parkingName) {
        return res.status(400).send({ error: 'Parking name is required' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM reservations WHERE parking_name = $1',
            [parkingName]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Update reservation status
app.post('/reservations/status', async (req, res) => {
    const { reservationId, status } = req.body;
    if (!reservationId || !status) {
        return res.status(400).send({ error: 'Reservation ID and status are required' });
    }

    try {
        await pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2',
            [status, reservationId]
        );
        res.send({ message: 'Reservation status updated successfully' });
    } catch (error) {
        console.error('Error updating reservation status:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
