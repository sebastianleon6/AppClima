const CACHE_DURATION = 60 * 60 * 1000;
const favoritesDiv = document.getElementById("favorites");
const resultDiv = document.getElementById("result");

document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
});

/* 🌙 Dark Mode */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

/* 🌤️ Iconos según temperatura */
function getWeatherIcon(temp) {
  if (temp <= 5) return "bi-snow";
  if (temp <= 15) return "bi-cloud-drizzle";
  if (temp <= 25) return "bi-cloud-sun";
  return "bi-sun";
}

/* 🔍 Consulta principal */
async function getWeather() {
  resultDiv.innerHTML = "";
  const input = document.getElementById("cityInput").value;

  if (!input) {
    resultDiv.innerHTML = "<p class='text-danger'>❌ Ingresa al menos una ciudad</p>";
    return;
  }

  const cities = input.split(",").map(c => c.trim());
  for (const city of cities) {
    await processCity(city);
  }
}

async function processCity(city) {
  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      renderCard(data, true);
      return;
    }
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();
    if (!geoData.results) return;

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true` +
      `&hourly=temperature_2m` +
      `&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    const info = {
      name,
      country,
      temp: weatherData.current_weather.temperature,
      wind: weatherData.current_weather.windspeed,
      hourly: weatherData.hourly
    };

    localStorage.setItem(cacheKey, JSON.stringify({ data: info, timestamp: Date.now() }));
    renderCard(info);

  } catch (e) {
    console.error(e);
  }
}

/* 🧾 Renderizar tarjetas */
function renderCard(data, cache = false) {
  const icon = getWeatherIcon(data.temp);

  const col = document.createElement("div");
  col.className = "col-md-4";

  col.innerHTML = `
    <div class="card weather-card shadow-sm h-100">
      <div class="card-body">
        <i class="bi ${icon} fs-1 text-primary"></i>
        <h5 class="card-title mt-2">${data.name}, ${data.country}</h5>

        <p>
          🌡️ <strong>${data.temp} °C</strong><br>
          🌬️ ${data.wind} km/h
        </p>

        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-outline-warning btn-sm"
            onclick="addFavorite('${data.name}')">
            ⭐ Favorito
          </button>

          <button class="btn btn-outline-info btn-sm"
            onclick='showHourlyForecast(${JSON.stringify(data.hourly)})'>
            ⏱️ Próximas 12h
          </button>
        </div>

        ${cache ? "<span class='badge bg-secondary mt-2'>Caché</span>" : ""}
      </div>
    </div>
  `;
  resultDiv.appendChild(col);
}

/* ⭐ Favoritos */
function addFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
  }
}

function removeFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(c => c !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

function loadFavorites() {
  favoritesDiv.innerHTML = "";
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.forEach(city => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    col.innerHTML = `
      <div class="d-flex gap-1">
        <button class="btn btn-warning w-100"
          onclick="processCity('${city}')">
          ⭐ ${city}
        </button>
        <button class="btn btn-danger"
          onclick="removeFavorite('${city}')">
          🗑️
        </button>
      </div>
    `;
    favoritesDiv.appendChild(col);
  });
}

/* ⏱️ Pronóstico próximas 12 horas */
function showHourlyForecast(hourly) {
  const modal = new bootstrap.Modal(
    document.getElementById("hourlyModal")
  );
  const container = document.getElementById("hourlyContent");
  container.innerHTML = "";

  const now = new Date();

  const times = hourly.time;
  const temps = hourly.temperature_2m;

  // 🔑 Buscar el primer horario FUTURO real
  let startIndex = times.findIndex(t => new Date(t) >= now);

  // 🛡️ Seguridad por si no encuentra ninguno
  if (startIndex === -1) startIndex = 0;

  // Mostrar exactamente 12 horas
  for (let i = startIndex; i < startIndex + 12 && i < times.length; i++) {
    const hour = new Date(times[i]).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const col = document.createElement("div");
    col.className = "col-6 col-md-3";

    col.innerHTML = `
      <div class="hour-card shadow-sm">
        <strong>${hour}</strong><br>
        🌡️ ${temps[i]} °C
      </div>
    `;

    container.appendChild(col);
  }

  modal.show();
}


/* 🚀 PWA */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
