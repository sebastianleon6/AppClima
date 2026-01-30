const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

async function getWeather() {
  const input = document.getElementById("cityInput").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!input) {
    resultDiv.innerHTML = "❌ Ingresa al menos una ciudad";
    return;
  }

  const cities = input.split(",").map(c => c.trim());

  for (const city of cities) {
    await processCity(city, resultDiv);
  }
}

async function processCity(city, container) {
  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      renderCard(data, container, true);
      return;
    }
  }

  if (!navigator.onLine && cached) {
    renderCard(JSON.parse(cached).data, container, true, true);
    return;
  }

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geoRes.json();
    if (!geoData.results) return;

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const info = {
      name,
      country,
      temp: weatherData.current_weather.temperature,
      wind: weatherData.current_weather.windspeed,
      forecastMax: weatherData.daily.temperature_2m_max.slice(0,5),
      forecastMin: weatherData.daily.temperature_2m_min.slice(0,5)
    };

    localStorage.setItem(cacheKey, JSON.stringify({ data: info, timestamp: Date.now() }));
    renderCard(info, container);

  } catch (e) {
    console.error(e);
  }
}

function renderCard(data, container, cache = false, offline = false) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>🌍 ${data.name}, ${data.country}</h3>
    🌡️ Temp: <strong>${data.temp} °C</strong><br>
    🌬️ Viento: ${data.wind} km/h<br><br>
    <strong>📅 Pronóstico 5 días</strong><br>
    ${data.forecastMax.map((max, i) =>
      `Día ${i+1}: ${max}° / ${data.forecastMin[i]}°`
    ).join("<br>")}
    <br><br>
    ${cache ? "💾 Desde caché<br>" : ""}
    ${offline ? "📡 Sin conexión" : ""}
  `;

  container.appendChild(card);
}
