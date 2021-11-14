var cityInfoEl = document.querySelector("#city-info");


var getCurrentWeather = function() {
    // format the github api url
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInputEl.value.trim() + '&appid=e58ce6fcd378144b93c4b6f45a5073c8';
  
    // make a get request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            displayWeather(data)
            getCityCoordinates(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to OpenWeather.');
      });
  };

var searchEl = document.querySelector("#search");
var cityInputEl = document.querySelector("#city-name");

var searchHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    console.log(cityName);
    if (cityName) {
        saveSearch();
        getCurrentWeather();
        cityInputEl.value = "";
    } else {
        alert("Please search for a city.");
    }

    // save searches

//     function saveSearch
//     city list = fetch city list
//     if city_list doesn't exist => create a new array, push the items and set in local storage
//     else => use the city_list got from storage, push new item and set in local storage
    function saveSearch() {
        cityList = JSON.parse(localStorage.getItem("City-List"));
        console.log(cityList);
        if (!cityList) {
            savedItems = [];
            savedItems.push(cityName);
            localStorage.setItem("City-List", JSON.stringify(savedItems));
            console.log(savedItems);
            }
        else {
            savedItems = [];
            savedItems.push(cityName);
            savedItems.push(cityList);
            localStorage.setItem("City-List", JSON.stringify(savedItems));
        }
    };
};

function displayWeather(data) {
    // temp,  wind, humidity,
    var temp = Math.round(((data.main.temp - 273.15) * 1.8) + 32);
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    console.log(temp);
    console.log(wind);
    console.log(humidity);
    
    var tempEl = document.getElementById("temp");
    tempEl.innerHTML = temp;

    var windEl = document.getElementById("wind");
    windEl.innerHTML = wind;

    var humidityEl = document.getElementById("humidity");
    humidityEl.innerHTML = humidity;

    var cityNameEl = document.getElementById("search-term");
    cityNameEl.innerHTML = data.name + ", " + data.sys.country;

    if (data.length === 0) {
        cityInfoEl.textContent = "No city found.";
        return;
    };
}

function getCityCoordinates(data) {
    var longitude = data.coord.lon;
    var latitude = data.coord.lat;
    console.log(longitude);
    console.log(latitude);
    forecast();

    function forecast() {
        var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly&appid=e58ce6fcd378144b93c4b6f45a5073c8";

        fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            console.log(data.daily[0].dt);
            getDates(data);
            console.log(data.daily[0].temp.day);
            getTemp(data);
            getWind(data);
            getHumidity(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to OpenWeather.');
      });

      function getDates(data) {
        for (let i = 0; i < 5; i++) {
            var milliseconds = data.daily[0].dt * 1000;
            var dateObject = new Date(milliseconds);
            var date = dateObject.toLocaleString("en-US");
            console.log(date);
        }
      };

      function getTemp(data) {
          for (let i = 0; i < 5; i++) {
            var forecastTemp = Math.round(((data.daily[i].temp.day - 273.15) * 1.8) + 32);
            console.log(forecastTemp);
          }
      }

      function getWind(data) {
        for (let i = 0; i < 5; i++) {
            var forecastWind = data.daily[0].wind_speed;
            console.log(forecastWind);
            }
        };

    function getHumidity(data) {
        for (let i = 0; i < 5; i++) {
            var forecastHumidity = data.daily[0].humidity;
            console.log(forecastHumidity);
            }; 
        };
    };
};

function showPrevious() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    };
    for (x = 0; x < values.length; x++) {
        $(".previous-searches").prepend("<button class='previous-search mt-1'>" + values[x] + "</button>");
    };
};

// function getSavedItems() {
//     var savedSearchesEl = document.getElementById("saved-searches");
//     var savedButton = document.createElement("button");
//     savedButton.innterHTML = localStorage.getItem("City");
//     savedSearchesEl.append(savedButton);

// };

searchEl.addEventListener("submit", searchHandler);
showPrevious();