const apiKey = "25324c8224a28a2b23fdb35ce923947e";
const baseUrl = "https://api.openweathermap.org/data/2.5";
const iconUrl = "https://api.openweathermap.org/img/wn/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const cityName = document.querySelector("#city-name");
const dateTime = document.querySelector("#date-time");
const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const pressure = document.querySelector("#pressure");
const forecastContainer = document.querySelector("#forecast-container");


document.addEventListener("DOMContentLoaded", function () {
    ;

    function dayNightTheme() {
        let date = new Date();
        let hour = date.getHours();


        if (hour >= 7 && hour < 19) {
            document.body.classList.remove("night")
        }
        else {
            document.body.classList.add("night")
        }
    }

    dayNightTheme();

    searchBtn.addEventListener("click", handleGetData())
    cityInput.addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
            handleGetData();
        }
    });

    function handleGetData() {
        let city = cityInput.value.trim();

        if (city) {
            getForecastWeather(city);
            getCurrentWeather(city);
            cityInput.value = "";
        }
    }

    async function getCurrentWeather(city) {
        try {
            let response = await fetch(`${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`);

            if (!response.ok) {
                if (response.status == 404) {
                    alert("Город не найден, проверьте название города");
                }
                else {
                    alert("Произошла ошибка при получении данных о погоде");
                }
                return;
            }

            let data = await response.json();
            updateWeatherUI(data);
            console.log(data);
            console.log(data.main.temp);
            console.log(data.weather[0].description);
            console.log(iconUrl + data.weather[0].icon + ".png");





            // console.log(response);
            // console.log(`${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`);


        } catch (error) {
            console.log("Ошибка: ", error);
            alert("Произошла ошибка при получении данных о погоде");
        }
    }

    async function getForecastWeather(city) {
        try {
            let response = await fetch(`${baseUrl}/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`);

            if (!response.ok) {
                if (response.status == 404) {
                    alert("Город не найден, проверьте название города");
                }
                else {
                    alert("Произошла ошибка при получении данных о погоде");
                }
                return;
            }

            let data = await response.json();
            console.log(data);
            updateForecastUI(data);







            // console.log(response);
            // console.log(`${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`);


        } catch (error) {
            console.log("Ошибка: ", error);
            alert("Произошла ошибка при получении данных о погоде");
        }
    }

    function updateWeatherUI(data) {
        cityName.textContent = data.name + ", " + data.sys.country;

        let dateOption = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        dateTime.textContent = new Date().toLocaleDateString("ru-RU", dateOption)

        let iconCode = data.weather[0].icon;
        weatherIcon.src = iconUrl + iconCode + "@2x.png";


        temperature.textContent = Math.round(data.main.temp) + "°C";
        weatherDescription.textContent = data.weather[0].description;


        feelsLike.textContent = Math.round(data.main.feels_like) + "°C";
        windSpeed.textContent = data.wind.speed + " м/c";
        humidity.textContent = data.main.humidity + "%";
        pressure.textContent = data.main.pressure + "кПа";




    }


    function updateForecastUI(data) {
        let dailyForecasts = {};

        for (let item of data.list) {
            let date = new Date(item.dt * 1000);
            let hour = date.getHours();
            let day = date.toISOString().split("T")[0];

            if (hour == 12 || !dailyForecasts[day]) {
                dailyForecasts[day] = item;
            }

            // console.log(dailyForecasts);



        }

        let weekForecasts = Object.values(dailyForecasts).slice(0, 8);

        for (let forecast of weekForecasts) {
            // console.log(forecast);
            let date = new Date(forecast.dt * 1000);
            let dayName = getDayName(date);

            let forecastItem = document.createElement("div");
            forecastItem.className = "forecast-item";

            forecastItem.innerHTML = `
            <h3>${dayName}</h3>
            <img src='${iconUrl}${forecast.weather[0].icon}@2x.png'>\
            <p>${Math.round(forecast.main.temp)}℃</p>
            <p>${forecast.weather[0].description}</p>

        `;


            forecastContainer.append(forecastItem);
        }
    }

    function getDayName(date) {
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return days[date.getDay()];
    }


    getForecastWeather("Москва");
    getCurrentWeather("Москва");

});