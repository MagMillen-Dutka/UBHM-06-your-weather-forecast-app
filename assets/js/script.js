var cityInputEl = document.querySelector("#city-input");
var searchForm = document.querySelector("#search-form");
var clearBtn = document.querySelector("#clear-history-button");
var historySearch = document.querySelector("#search-history");
var todayWeather = document.querySelector("#today-weather");
var fiveForecast = document.querySelector("#fiveForecast");
var searchHistory = [];

// This will show the present day and five day future forecast

function forecast(event) {
    // This event is needed to stop page refreshing and clearing input. Do not remove.
    event.preventDefault();
    var cityName = cityInputEl.value;
    showWeather(cityName);
}
// This is the main code base which takes weather information via an API from Open Weather including city name and longitiude and latitude.
function showWeather(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=9dd332c2cdf5ad3eee158912aa75b747&units=imperial`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);
            var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=9dd332c2cdf5ad3eee158912aa75b747&units=imperial`;
            fetch(oneCallUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (fiveDayData) {
                    if (searchHistory.includes(currentData.name) === false) {
                        searchHistory.push(currentData.name);
                        localStorage.setItem("city", JSON.stringify(searchHistory));
                    }
                    showCity();
                    console.log(fiveDayData);
// All of the below is linked to the display of information including immediate name, date and weather for current day.
                    todayWeather.innerHTML = `<ul>
        <li class="title"><b> ${currentData.name} </b> on <span> ${moment(
                        currentData.dt,
                        "X"
                    ).format(" dddd Do MMMM YYYY")} </span></li>
        <li><img src ="http://openweathermap.org/img/wn/${currentData.weather[0].icon
                        }@2x.png" /></li>
        <li>Temperature: <b> ${currentData.main.temp} </b></li>
        <li>Wind Speed: <b> ${currentData.wind.speed} </b></li>
        <li>Humidity: <b> ${currentData.main.humidity} </b></li>
    </ul>
        `;
                    var cards = "";
                    for (var i = 1; i < 6; i++) {
                        cards =
                            cards +
                            `<ul class="col-12 col-xl-2 day rounded">
        <li>${moment(fiveDayData.daily[i].dt, "X").format(" dddd Do MMMM YYYY")}</li>
        <li><img src ="http://openweathermap.org/img/wn/${fiveDayData.daily[i].weather[0].icon
                            }@2x.png" ></li>
        <li>Temperature: <b> ${fiveDayData.daily[i].temp.day} </b></li>
        <li>Wind Speed: <b> ${fiveDayData.daily[i].wind_speed} </b></li>
        <li>Humidity: <b> ${fiveDayData.daily[i].humidity}</b></li>
    </ul>`;
                    }
                    fiveForecast.innerHTML = cards;
                });
        });
}
// This section relates to the storing of the cities and the information on the left hand side of the application.
function showCity() {
    if (localStorage.getItem("city")) {
        searchHistory = JSON.parse(localStorage.getItem("city"));
    }
    var cityList = "";
    for (var i = 0; i < searchHistory.length; i++) {
        cityList =
            cityList +
            `<button class="btn btn-secondary my-2" type="submit">${searchHistory[i]}</button>`;
    }
    historySearch.innerHTML = cityList;
    var myDashTwo = document.querySelectorAll(".my-2");
    for (var i = 0; i < myDashTwo.length; i++) {
        myDashTwo[i].addEventListener("click", function () {
            showWeather(this.textContent);
        });
    }
}
showCity();

searchForm.addEventListener("submit", forecast); 

function clearSearchHistory() {
    localStorage.clear();
    historySearch.innerHTML = "";
    searchHistory = [];
}
clearBtn.addEventListener("click", function () {
    clearSearchHistory();
});

// if the clear button is clicked, search history buttons are removed and local storage cleared
// localStorage.clear();
// location.reload();
