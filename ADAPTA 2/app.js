const statusDiv = document.getElementById('status');
const dataList = document.getElementById('data-list');
const weatherInfo = document.getElementById('weather-info');
const diseaseAnalysis = document.getElementById('disease-analysis');
const preventiveList = document.getElementById('preventive-list');

let healthyCount = 0;
let affectedCount = 0;

const ctx = document.getElementById('healthChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Healthy', 'Affected'],
    datasets: [{
      label: 'Crop Health',
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true
  }
});

function updateChart() {
  chart.data.datasets[0].data = [healthyCount, affectedCount];
  chart.update();
}

function getPreventiveTips(disease) {
  const tips = {
    "Leaf Spot": [
      "Apply fungicides with copper or mancozeb.",
      "Ensure proper plant spacing to reduce humidity.",
      "Remove infected leaves."
    ],
    "Rust": [
      "Use resistant varieties.",
      "Avoid overhead irrigation.",
      "Apply sulfur-based fungicides."
    ],
    "Healthy": ["Continue monitoring crop health regularly."]
  };
  return tips[disease] || ["Consult an agronomist for accurate diagnosis."];
}

// Simulated weather info
function updateWeather() {
  const temp = (20 + Math.random() * 10).toFixed(1);
  const weatherTypes = ["Sunny", "Cloudy", "Rainy"];
  const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  weatherInfo.textContent = `Temperature: ${temp}°C | Condition: ${weather}`;
}

setInterval(updateWeather, 6000);

// Fetch crop data from backend every 5 seconds
function fetchCropData() {
  fetch('http://localhost:3000/getCropData')
    .then(response => response.json())
    .then(data => {
      const listItem = document.createElement('li');
      listItem.textContent = `📍 ${data.location} | 🌡️ ${data.temperature}°C | 🧫 ${data.disease}`;
      dataList.prepend(listItem);

      if (data.disease === "Healthy") {
        healthyCount++;
      } else {
        affectedCount++;
        diseaseAnalysis.textContent = `Recent detection: ${data.disease}`;
        preventiveList.innerHTML = "";
        getPreventiveTips(data.disease).forEach(tip => {
          const li = document.createElement('li');
          li.textContent = tip;
          preventiveList.appendChild(li);
        });
      }

      updateChart();
    })
    .catch(error => {
      statusDiv.textContent = '🔴 Failed to fetch data';
      console.error('Error fetching data:', error);
    });
}

setInterval(fetchCropData, 5000); // Poll every 5 seconds
