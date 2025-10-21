// Fetch backend message
fetch("/api/message")
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").textContent = data.message;
    })
    .catch(error => {
        document.getElementById("message").textContent = "Error fetching backend message.";
        console.error(error);
    });
