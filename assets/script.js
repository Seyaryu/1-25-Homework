var city = document.querySelector('#city');
var APIkey = 'd28ff2fdd51fb1d988dcf6c4582395c3';
var searchSubmit = document.getElementById('searchSubmit');
var cityWeather = document.getElementById('cityWeather');
var temperature = document.getElementById('temperature');
var sky = document.getElementById('sky');
var humidity = document.getElementById('humidity');
var icon = document.getElementById('icon');
var forecast = document.getElementById('forecast');
var uvIndex = document.getElementById('uvIndex');
var date = document.getElementById('date');
var wind = document.getElementById('wind');

//submit button
function submit() {

    //Populate main card
    function displayCurrentWeather(temp) {
        cityName.textContent = temp.name; 
        date.textContent = moment().format('dddd MMM Do');
        temperature.textContent = temp.main.temp + '°';
        icon.src = 'http://openweathermap.org/img/wn/' + temp.weather[0].icon + '.png';
        wind.textContent = 'Wind Speed: ' + temp.wind.speed;
        sky.textContent = temp.weather[0].main;
        humidity.textContent = 'Humidity: ' + temp.main.humidity + '%';

    }

    //Populate forecast cards
    function displayForecastWeather(temp) {

        //Clear old cards, if any
        forecast.innerHTML = '';

        //UV INdex is not listed in the API for 'data'. So it is being pulled from the other API
        uvIndex.textContent = 'UV Index: ' + temp.current.uvi; 

        //Change UV Index color based on number
        if (temp.current.uvi < 3) {
            uvIndex.style.color = 'rgb(238, 255, 0)';
        }else if (temp.current.uvi < 6) {
            uvIndex.style.color = 'rgb(255, 230, 0)';
        }else if (temp.current.uvi < 10) {
            uvIndex.style.color = 'rgb(255, 179, 0)';
        }else if (temp.current.uvi >= 10) {
            uvIndex.style.color = 'rgb(255, 38, 0)';
        }

        //Create forecast cards
        for (var i=0; i < 5; i++ ) {
            var dayName = document.createElement('p');
            dayName.textContent = moment().add(i+1,'days').format('dddd');
            
            var dayTemp = document.createElement('p');
            dayTemp.textContent = temp.daily[i].temp.day  + '°';

            var dayIcon = document.createElement('img');
            dayIcon.src = 'http://openweathermap.org/img/wn/' + temp.daily[i].weather[0].icon + '.png';

            var dayWind = document.createElement('p');
            dayWind.textContent = 'Wind: ' + temp.daily[i].wind_speed;

            var dayHumidity = document.createElement('p');
            dayHumidity.textContent = 'Humid: ' + temp.daily[i].humidity;

            var day = document.createElement('div');
            day.className = "forecastDay";            

            day.append(dayName);
            day.append(dayTemp);
            day.append(dayIcon);
            day.append(dayWind);
            day.append(dayHumidity);

            forecast.append(day);
        }

    }

    //Pull data from API
    async function getWeather() {
        //Current Weather
        var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=imperial&appid=${APIkey}`); 
        var data = await response.json();
        console.log(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=imperial&appid=${APIkey}`);
        console.log(data);

        console.log(data.coord.lon, data.coord.lat)
        //5-Day Forecast
        var forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${APIkey}`);
        var forecastData = await forecastResponse.json();
        console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${APIkey}`)
        console.log(forecastData);

        displayCurrentWeather(data);
        displayForecastWeather(forecastData);


    }

    getWeather();



    var addHistory = document.createElement('p');
    addHistory.classList.add('history');
    addHistory.textContent = city.value;
    addHistory.addEventListener('click', function() {
        city.value = this.textContent;
    
        submit();
    
    });

    document.getElementById('history').appendChild(addHistory);


};

searchSubmit.addEventListener('click', function() {
    submit()
});

city.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        submit()
    }
});
