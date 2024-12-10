require('dotenv').config();  
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors()); 


const openAIAPIKey = process.env.OPENAI_API_KEY;


app.post('/submit-journal', async (req, res) => {
  try {
    const { journalEntry } = req.body;

    if (!journalEntry) {
      return res.status(400).json({ error: "Journal entry is required" });
    }

    // Define the OpenAI API request
    const options = {
      method: 'POST',
      url: 'https://api.openai.com/v1/completions',
      headers: {
        'Authorization': `Bearer ${openAIAPIKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'text-davinci-003',
        prompt: `Reframe the following journal entry in a calm and positive way: \n\n${journalEntry}`,
        max_tokens: 100,
        temperature: 0.7
      }
    };

    // Call OpenAI API with retry logic
    const response = await fetchWithRetry(options.url, options);

    // Extract the calm reframed message from the response
    const calmMessage = response.data.choices[0].text.trim();

    // Send back the reframed calm message
    res.json({ calmMessage });

  } catch (error) {
    console.error('Error processing journal entry:', error);
    res.status(500).json({ error: 'There was an error processing your request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
