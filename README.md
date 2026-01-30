# 🌤️ App del Clima – Open-Meteo

## 📌 Descripción del Proyecto
Esta aplicación web permite consultar el clima actual de una o varias ciudades utilizando la **API de Open-Meteo**.  
Muestra información como la temperatura, velocidad del viento y un **pronóstico por horas de las próximas 12 horas**, calculado a partir de la hora actual del usuario.

La aplicación cuenta con una interfaz moderna y responsiva desarrollada con **Bootstrap**, incluye **modo oscuro**, **favoritos**, y optimizaciones como **caché en el navegador** para mejorar el rendimiento y la experiencia de usuario.

---

## 🚀 Funcionalidades
- Consulta del clima actual por ciudad.
- Búsqueda de múltiples ciudades separadas por coma.
- Pronóstico de las **próximas 12 horas** desde la hora actual.
- Visualización del clima con iconos dinámicos.
- Modo oscuro (Dark Mode) con persistencia.
- Sistema de favoritos con opción de agregar y eliminar ciudades.
- Uso de caché en `localStorage` para evitar consultas innecesarias.
- Interfaz responsiva usando Bootstrap.

---

## 🛠️ Tecnologías Utilizadas
- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Bootstrap 5  
- Open-Meteo API  

---

## ⚙️ Instrucciones de Instalación
1. Descarga o clona este repositorio.
2. Asegúrate de tener un navegador web moderno (Chrome, Edge, Firefox).
3. Abre el archivo `index.html` en el navegador.
4. No se requieren dependencias adicionales ni instalación de paquetes.

---

## 📖 Guía de Uso
1. Ingresa una ciudad o varias ciudades separadas por coma (ej: `Bogotá, Madrid, Lima`).
2. Presiona el botón **Consultar**.
3. Visualiza el clima actual de cada ciudad.
4. Haz clic en **“⏱️ Próximas 12h”** para ver el pronóstico horario.
5. Agrega ciudades a **Favoritos** para acceder rápidamente.
6. Activa o desactiva el **Modo Oscuro** según tu preferencia.

---

## 🖼️ Ejemplo de Resultados
```txt
🌍 Bogotá, Colombia
🌡️ Temperatura: 18 °C
🌬️ Viento: 6 km/h

Pronóstico próximas 12 horas:
11:00 → 18 °C
12:00 → 20 °C
13:00 → 22 °C
...
