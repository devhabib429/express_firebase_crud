const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set, get, child, value, update, remove } = require('firebase/database');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB96guk2QYgcaCe51ruJNEt8jhqBb31c-8",
    authDomain: "mynodeapi-53dd8.firebaseapp.com",
    databaseURL: "https://mynodeapi-53dd8-default-rtdb.firebaseio.com",
    projectId: "mynodeapi-53dd8",
    storageBucket: "mynodeapi-53dd8.appspot.com",
    messagingSenderId: "515039825519",
    appId: "1:515039825519:web:266008af86a9d17b1f479a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

const api = express();
api.use(express.json());

// Define a POST route to save data to Firebase
api.post('/data', async (req, res) => {
    const data = req.body;

    try {
        // Push data to Firebase
        const newRef = push(ref(database, 'data'));
        await set(newRef, data);

        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Failed to save data' });
    }
});

// Define a GET route to retrieve data from Firebase
api.get('/data', async (req, res) => {
    try {
        const snapshot = await get(child(ref(database), 'data'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: 'Failed to retrieve data' });
    }
});

// Define a PUT/PATCH route to update data in Firebase
api.patch('/data/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        const dataRef = ref(database, 'data', id);
        await update(dataRef, updatedData);

        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Failed to update data' });
    }
});
// Define a DELETE route to remove data from Firebase
api.delete('/data/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const dataRef = ref(database, 'data', id);
        await remove(dataRef);

        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Failed to delete data' });
    }
});

// Start the server
const port = 3000;
api.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
