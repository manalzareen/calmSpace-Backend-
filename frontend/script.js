async function reframeEntryToCalm(entry) {
    try {
        const response = await fetch('http://localhost:3000/submit-journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: entry }),
        });

        if (!response.ok) {
            throw new Error('Failed to connect to the server.');
        }

        const data = await response.json();
        return data.reframedText; 
    } catch (error) {
        console.error('Error reframing entry:', error);
        return 'Unable to process your request. Please try again later.';
    }
}

document.getElementById('submitButton').addEventListener('click', async () => {
    const userEntry = document.getElementById('journalInput').value;
    if (!userEntry.trim()) {
        alert('Please write something in the journal!');
        return;
    }

    const calmEntry = await reframeEntryToCalm(userEntry);
    document.getElementById('originalEntry').innerText = userEntry;
    document.getElementById('calmEntry').innerText = calmEntry;
    document.getElementById('responseContainer').style.display = 'block';
});

document.getElementById('submitButton').addEventListener('click', () => {
    const originalEntry = document.getElementById('originalEntry').innerText;
    const calmEntry = document.getElementById('calmEntry').innerText;

    const journal = JSON.parse(localStorage.getItem('calmJournal')) || [];
    journal.push({ original: originalEntry, calm: calmEntry, date: new Date().toISOString() });
    localStorage.setItem('calmJournal', JSON.stringify(journal));

    alert('Your entry has been saved!');
});

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('#submitButton');
    const journalInput = document.querySelector('#journalInput');
    const responseContainer = document.querySelector('#responseContainer'); 
  
   
    if (!submitButton || !journalInput || !responseContainer) {
      console.error("Required elements not found in the DOM");
      return;
    }
  
   
    submitButton.addEventListener('click', async () => {
      const userMessage = journalInput.value;
      if (!userMessage.trim()) {
        alert('Please enter a message.');
        return;
      }
      const calmMessage = await reframeEntryToCalm(userMessage);
      if (calmMessage) {
        responseContainer.innerText = `Calm Perspective: ${calmMessage}`;
      } else {
        alert('There was an error processing your request. Please try again later.');
      }
      journalInput.value = '';
    });
  });

