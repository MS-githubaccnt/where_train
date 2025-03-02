import express from 'express';
import fs from 'fs';
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 3000;
const FILE_PATH = 'data.json'; // Path to your JSON file

app.get('/', (req, res) => {
    try {
        // Read JSON from file
        const jsonData = fs.readFileSync(FILE_PATH, 'utf-8');
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).json({ error: 'Error reading JSON file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
