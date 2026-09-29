const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connection URI and Database Name
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'express_mongo_task';

let db, usersCollection;

// Connect to MongoDB and start the Express server
async function startServer() {
  try {
    await client.connect();
    db = client.db(dbName);
    usersCollection = db.collection('users');
    console.log('Connected successfully to MongoDB server');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

startServer();

// -------------------------------------------------------------------------
// 1- Use POST to add 5 users (or any number) to the collection and return them
// -------------------------------------------------------------------------
app.post('/users', async (req, res) => {
  try {
    const usersData = req.body; // Can be a single user object or an array of users

    if (Array.isArray(usersData)) {
      const result = await usersCollection.insertMany(usersData);
      const insertedUsers = await usersCollection.find({
        _id: { $in: Object.values(result.insertedIds) }
      }).toArray();
      return res.status(201).json({
        message: 'Users added successfully',
        count: result.insertedCount,
        data: insertedUsers
      });
    } else {
      const result = await usersCollection.insertOne(usersData);
      const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
      return res.status(201).json({
        message: 'User added successfully',
        data: insertedUser
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// 2- Use GET to retrieve all users from the collection
// -------------------------------------------------------------------------
app.get('/users', async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.status(200).json({
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// 3- Use GET by ID to retrieve a specific user using _id
// -------------------------------------------------------------------------
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// 4- Use PATCH to update a user using _id and return the updated user
// -------------------------------------------------------------------------
app.patch('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: 'after' } // Returns the updated document
    );

    // Note: depending on mongodb driver version, use value or check result
    const updatedUser = result.value || await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------
// 5- Use DELETE by ID to delete a user using _id and return confirmation message
// -------------------------------------------------------------------------
app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});