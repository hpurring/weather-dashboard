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

//search for a city
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

    $('#clear').on('click',()=> {
      console.log("Hi");
      localStorage.clear('City-List');
    });
    
 

    // save searches
//     
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


//display forecast data
function displayWeather(data) {
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

//access city coordinates to plug into forecast data
function getCityCoordinates(data) {
    var longitude = data.coord.lon;
    var latitude = data.coord.lat;
    console.log(longitude);
    console.log(latitude);
    forecast();


    //get forecast data
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
            getIcon(data);
            getTemp(data);
            getWind(data);
            getHumidity(data);
            getUv(data);
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

        var dates = ['#date1','#date2','#date3','#date4','#date5']
        
        dates.forEach(date => {
          $(date).text(dateArray[0]);
        });

      };

      // get weather icons
      function getIcon(data) {
        for (let i = 0; i < 5; i++) {
          var iconCode = data.daily[i].weather[0].icon;
          console.log(iconCode);
          var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
          $(`#icon${i+1}`).append('<img id="wicon"' + [i+1] + ' src=' + iconUrl + ' />')
          };
        };
      
      //get temperatures
      function getTemp(data) {
        tempArray = [];          
        for (let i = 0; i < 5; i++) {
        var forecastTemp = Math.round(((data.daily[i].temp.day - 273.15) * 1.8) + 32);
        tempArray.push(forecastTemp);
        }
        console.log(tempArray);

        for (let i = 1; i < 6; i++) {
          $("#temp"+i).text(`Temperature: ${tempArray[i-1]} °F`)
        }
      }

      //get wind speeds
      function getWind(data) {
        for (let i = 0; i < 5; i++) {
            $(`#wind${i+1}`).text(`Wind: ${data.daily[i].wind_speed} mph`)
            }
      };
    
    //get humidity levels
    function getHumidity(data) {
        humidityArray = [];
        for (let i = 0; i < 5; i++) {
            $(`#humidity${i+1}`).text(`Humidity: ${data.daily[i].humidity}%`)
            };
        };

    //get UV index
    function getUv(data) {
      var uvEl = document.getElementById("uv-index");
      uvIndex = data.daily[0].uvi;
      console.log(uvIndex);
      uvEl.innerHTML = "UV Index: " + uvIndex;

      if (uvIndex < 4) {
        uvEl.classList.add("bg-success");
        uvEl.classList.add("text-light");
      } else if (uvIndex < 8) {
        uvEl.classList.add("bg-warning");
        uvEl.classList.add("text-dark");
      } else {
        uvEl.classList.add("bg-danger");
        uvEl.classList.add("text-light");
      };

    }
  };
};

// show previous searches
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