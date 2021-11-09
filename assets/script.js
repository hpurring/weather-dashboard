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
            displayWeather(data);
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
        getCurrentWeather();
        cityInputEl.value = "";
    } else {
        alert("Please search for a city.");
    }
};

function displayWeather(data) {
    // temp,  wind, humidity,
    var temp = Math.round(((data.main.temp - 273.15) * 1.8) + 32);
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    console.log(temp);
    console.log(wind);
    console.log(humidity);

    if (data.length === 0) {
        cityInfoEl.textContent = "No city found.";
        return;
    };
}


searchEl.addEventListener("submit", searchHandler);