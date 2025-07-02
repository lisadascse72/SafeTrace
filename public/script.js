document.getElementById("sosBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const status = document.getElementById("status");

  if (!name) {
    status.innerHTML = "<p class='error'>❗ Please enter your name.</p>";
    return;
  }

  if (!navigator.geolocation) {
    status.innerHTML = "<p class='error'>❌ Geolocation not supported by your browser.</p>";
    return;
  }

  status.innerHTML = "<p>📡 Getting your location...</p>";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const time = new Date().toLocaleString();
      const data = {
        name,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        time
      };

      fetch("/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((res) => {
          status.innerHTML = "<p class='success'>✅ SOS sent successfully!</p>";
          document.getElementById("name").value = "";
        })
        .catch(() => {
          status.innerHTML = "<p class='error'>❌ Failed to send SOS. Try again.</p>";
        });
    },
    (err) => {
      status.innerHTML = `<p class='error'>📍 Location error: ${err.message}</p>`;
    }
  );
});
