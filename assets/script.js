var cityInfoEl = document.querySelector("#city-info");
var savedItems = [];

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
        var cityList = JSON.parse(localStorage.getItem("City-List"));
        if (!cityList) {
            savedItems.push(cityName);        
            localStorage.setItem("City-List", JSON.stringify(savedItems));
        } else {
            cityList = JSON.parse(localStorage.getItem("City-List"));
            savedItems = cityList;
            savedItems.push(cityName);        
            localStorage.setItem("City-List", JSON.stringify(savedItems));
        };
    };    
};

// function getHistory() {
//     cityList = localStorage.getItem("City-List");
//     showPrevious();
// };

function displayWeather(data) {
    // temp,  wind, humidity,
    var temp = Math.round(((data.main.temp - 273.15) * 1.8) + 32);
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    console.log(temp);
    console.log(wind);
    console.log(humidity);

    var headerEl = document.getElementById("header");
    headerEl.innerHTML = "5-Day Forecast";
    
    var tempEl = document.getElementById("temp");
    tempEl.innerHTML = "Temperature: " + temp + "°F";

    var windEl = document.getElementById("wind");
    windEl.innerHTML = "Wind: " + wind + " mph";

    var humidityEl = document.getElementById("humidity");
    humidityEl.innerHTML = "Humidity: " + humidity + "%";

    var cityNameEl = document.getElementById("search-term");
    cityNameEl.innerHTML = "Current weather for: " + data.name + ", " + data.sys.country;

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

      datesArray = [];
      


      function getDates(data) {
        dateArray = [];
        for (let i = 0; i < 5; i++) {
            var milliseconds = data.daily[i].dt * 1000;
            var dateObject = new Date(milliseconds);
            var date = dateObject.toLocaleString("en-US");
            dateArray.push(date);
        }

        var date1 = document.getElementById("date1");
        date1.innerHTML = dateArray[0];

        var date2 = document.getElementById("date2");
        date2.innerHTML = dateArray[1];

        var date3 = document.getElementById("date3");
        date3.innerHTML = dateArray[2];

        var date4 = document.getElementById("date4");
        date4.innerHTML = dateArray[3];

        var date5 = document.getElementById("date5");
        date5.innerHTML = dateArray[4];

      };

      function getTemp(data) {
        tempArray = [];          
        for (let i = 0; i < 5; i++) {
        var forecastTemp = Math.round(((data.daily[i].temp.day - 273.15) * 1.8) + 32);
        tempArray.push(forecastTemp);
        }
        console.log(tempArray);

        var temp1 = document.getElementById("temp1");
        temp1.innerHTML = "Temperature: " + tempArray[0] + "°F";

        var temp2 = document.getElementById("temp2");
        temp2.innerHTML = "Temperature: " + tempArray[1] + "°F";

        var temp3 = document.getElementById("temp3");
        temp3.innerHTML = "Temperature: " + tempArray[2] + "°F";

        var temp4 = document.getElementById("temp4");
        temp4.innerHTML = "Temperature: " + tempArray[3] + "°F";

        var temp5 = document.getElementById("temp5");
        temp5.innerHTML = "Temperature: " + tempArray[4] + "°F";

        //   var tempEl = document.getElementById("temp");
        //     tempEl.innerHTML = temp;
      }

      function getWind(data) {
        windArray = [];
        for (let i = 0; i < 5; i++) {
            var forecastWind = data.daily[i].wind_speed;
            windArray.push(forecastWind);
            }
        console.log(windArray);
        
        var wind1 = document.getElementById("wind1");
        wind1.innerHTML = "Wind: " + windArray[0] + " mph";

        var wind2 = document.getElementById("wind2");
        wind2.innerHTML = "Wind: " + windArray[1] + " mph";

        var wind3 = document.getElementById("wind3");
        wind3.innerHTML = "Wind: " + windArray[2] + " mph";

        var wind4 = document.getElementById("wind4");
        wind4.innerHTML = "Wind: " + windArray[3] + " mph";
        
        var wind5 = document.getElementById("wind5");
        wind5.innerHTML = "Wind: " + windArray[4] + " mph";
        };

    function getHumidity(data) {
        humidityArray = [];
        for (let i = 0; i < 5; i++) {
            var forecastHumidity = data.daily[i].humidity;
            humidityArray.push(forecastHumidity);
            };
            console.log(humidityArray); 

        var hum1 = document.getElementById("humidity1");
        hum1.innerHTML = "Humidity: " + humidityArray[0] + "%";

        var hum2 = document.getElementById("humidity2");
        hum2.innerHTML = "Humidity: " + humidityArray[1] + "%";

        var hum3 = document.getElementById("humidity3");
        hum3.innerHTML = "Humidity: " + humidityArray[2] + "%";

        var hum4 = document.getElementById("humidity4");
        hum4.innerHTML = "Humidity: " + humidityArray[3] + "%";

        var hum5 = document.getElementById("humidity5");
        hum5.innerHTML = "Humidity: " + humidityArray[4] + "%";

        };


    };
};

function showPrevious() {
    var previousSearches = JSON.parse(localStorage.getItem("City-List"));
    if (previousSearches) {
      var savedSearchHeader = document.getElementById("saved-search-header");
      savedSearchHeader.innerHTML = "Saved Searches";
    for (let x = 0; x < previousSearches.length; x++) {
        $("#saved-searches").append("<button class='previous-search mt-1'>" + previousSearches[x] + "</button>");

    };
    } else {
        console.log("No previous searches.");
    }
    
    var searchButtons = document.getElementsByClassName("previous-search");
    var buttonInfo = Array.from(searchButtons);
    for (let i = 0; i < buttonInfo.length; i++) {
        buttonInfo[i].addEventListener('click', function() {
            // format the github api url
            var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + buttonInfo[i].innerHTML + '&appid=e58ce6fcd378144b93c4b6f45a5073c8';
              
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
            });
        }
    };
    // buttonInfo.forEach(v => v.addEventListener('click', function() {
    //     console.log(buttonInfo);
    // }));




searchEl.addEventListener("submit", searchHandler);
showPrevious();