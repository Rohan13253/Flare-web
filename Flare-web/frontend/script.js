import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';


// Load Feather icons
document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) {
        feather.replace();
    }
});

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQ215nTIu5vDfouLR4HMagR5gG5go1gBQ",
    authDomain: "flare-cade7.firebaseapp.com",
    databaseURL: "https://flare-cade7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "flare-cade7",
    storageBucket: "flare-cade7.firebasestorage.app",
    messagingSenderId: "669669744684",
    appId: "1:669669744684:web:bded5f9b273e6c67b93189"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let sensorData = [];

// Listen for sensor data changes
const sensorsRef = ref(db, 'sensors');
onValue(sensorsRef, (snapshot) => {
  try {
    const data = snapshot.val();
    if (data) {
      sensorData = Object.entries(data).map(([id, values]) => ({
        id,
        name: values.name || `Sensor ${id}`,
        temp: values.temp || 0,
        humidity: values.humidity || 0,
        smoke: values.smoke || 0,
        status: getStatus(values.temp || 0, values.smoke || 0)
      }));
      updateSensorTable();
      updateMetricCards();
      updateAlertBox();
    }
  } catch (error) {
    console.error('Error processing sensor data:', error);
  }
}, (error) => {
  console.error('Error fetching sensor data:', error);
});

// Particle animation
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
        container.appendChild(particle);
    }
}

// Update sensor table data
function updateSensorTable() {
    const tbody = document.getElementById('sensor-table-body');
    tbody.innerHTML = '';

    sensorData.forEach(sensor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="sensor-name">
                <div class="sensor-status-dot ${sensor.status}"></div>
                ${sensor.name}
            </td>
            <td class="temp-${sensor.status}">${sensor.temp}°C</td>
            <td class="humidity-${sensor.status}">${sensor.humidity}%</td>
            <td class="smoke-${sensor.status}">${sensor.smoke} PPM</td>
            <td><span class="status-badge ${sensor.status}">${sensor.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Update metric cards
function updateMetricCards() {
    if (sensorData.length === 0) return;

    const avgTemp = sensorData.reduce((sum, sensor) => sum + sensor.temp, 0) / sensorData.length;
    const avgHumidity = sensorData.reduce((sum, sensor) => sum + sensor.humidity, 0) / sensorData.length;
    const avgSmoke = sensorData.reduce((sum, sensor) => sum + sensor.smoke, 0) / sensorData.length;

    document.getElementById('temperature-value').textContent = Math.round(avgTemp);
    document.getElementById('humidity-value').textContent = Math.round(avgHumidity);
    document.getElementById('smoke-value').textContent = Math.round(avgSmoke);
}

// Update alert box
function updateAlertBox() {
    const alertBox = document.getElementById('alert-box');
    const alertTitle = document.getElementById('alert-title');
    const alertMessage = document.getElementById('alert-message');

    const dangerSensors = sensorData.filter(sensor => sensor.status === 'danger');
    const warningSensors = sensorData.filter(sensor => sensor.status === 'warning');

    if (dangerSensors.length > 0) {
        alertBox.className = 'alert-box danger';
        alertTitle.textContent = 'Critical Alert: Fire Risk Detected';
        alertMessage.textContent = `${dangerSensors.length} sensor(s) reporting critical conditions!`;
    } else if (warningSensors.length > 0) {
        alertBox.className = 'alert-box warning';
        alertTitle.textContent = 'Warning: Elevated Risk Detected';
        alertMessage.textContent = `${warningSensors.length} sensor(s) reporting elevated conditions.`;
    } else {
        alertBox.className = 'alert-box';
        alertTitle.textContent = 'System Status: Normal';
        alertMessage.textContent = 'All sensors reporting normal conditions.';
    }
}

// Initialize Feather icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    createParticles();
});

// Toggle sidebar
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleBtn = document.getElementById('toggle-sidebar');

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    toggleIcon.setAttribute('data-feather', sidebar.classList.contains('collapsed') ? 'chevron-right' : 'chevron-left');
    feather.replace();
});


// Determine sensor status
function getStatus(temp, smoke) {
    if (temp > 45 || smoke > 300) return 'danger';
    if (temp > 40 || smoke > 200) return 'warning';
    return 'normal';
}