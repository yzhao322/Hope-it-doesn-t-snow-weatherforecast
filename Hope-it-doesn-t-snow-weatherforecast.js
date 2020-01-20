$(document).ready(function () {
    var apikey = '32a55012de85e83a06c44c9985df662a';
    var index = 0;

    function init() {
        $('h6').remove();
        $('ol').remove();
        $('.col-2').remove();
    }

    function getData(url, fiveDayForecastUrl) {
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (currentweatherData) {
                var icon = currentweatherData.weather[0].icon;
                var d = new Date();
                var date = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();
                var tempInK = currentweatherData.main.temp; //temp in Kelvin
                var tempInC = tempInK - 273.15; // temp in Celsius;
                var tempInF = (tempInC * 9 / 5) + 32; // temp in Fahrenheit
                var windSpeed = currentweatherData.wind.speed;
                var Humidity = currentweatherData.main.humidity;
                var weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                var lon = currentweatherData.coord.lon;
                var lat = currentweatherData.coord.lat;
                var currentUVindexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&apikey=${apikey}`;
                fetch(currentUVindexUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (currentUVI) {
                        var UVI = currentUVI.value;
                        $('h3').empty().text(currentweatherData.name).css('font-family', " 'IM Fell Great Primer SC', serif");
                        $('h3').append($('<img>').attr('src', weatherIcon));
                        $('.date').empty().append(date);
                        $('.Temp').empty().text("Temperature: " + tempInC.toFixed(2) + String.fromCharCode(176) + "C /" + tempInF.toFixed(2)+ String.fromCharCode(176) + "F");
                        $('.Wind-speed').empty().text("Wind Speed: " + windSpeed + " MPH");
                        $('.Humidity').empty().text("Humidity: " + Humidity + "%");
                        var Uvi = $('<p>').text(" "+UVI+ " ").css('background-color', 'grey').css('color', 'white').css('display','inline-block').css('border-radius','3px');
                        $('.UV-index').empty().text("UV Index: ").append(Uvi);

                        
                    })
                fetch(fiveDayForecastUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (fiveDayForecastData) {
                        var fiveDayForecast = [fiveDayForecastData.list[8], fiveDayForecastData.list[16], fiveDayForecastData.list[24], fiveDayForecastData.list[32], fiveDayForecastData.list[39]];
                        for (var i = 0; i < 5; i++) {
                            var newDiv = $('<div>').attr('class', 'col-2');
                            $('#Five-Day-Forecast').append(newDiv);
                            var date = $('<h6>').append(fiveDayForecast[i].dt_txt.slice(0, 10)).css('text-align', 'center').css('padding-top', '10px');
                            newDiv.append(date);
                            var tempInK = fiveDayForecast[i].main.temp; //temp in Kelvin
                            var tempInC = tempInK - 273.15; // temp in Celsius;
                            var tempInF = (tempInC * 9 / 5) + 32; // temp in Fahrenheit
                            var Humidity = fiveDayForecast[i].main.humidity;
                            var icon = fiveDayForecast[i].weather[0].icon;
                            var weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                            date.append($('<p>').append($('<img>').attr('src', weatherIcon)));
                            var temp = $('<p>').append("Temperature: " + '<br>' + tempInC.toFixed(2)+ String.fromCharCode(176) + "C /" + tempInF.toFixed(2)+ String.fromCharCode(176) + "F");
                            date.append(temp);
                            var Hum = $('<p>').append("Humidity: " + Humidity + " % ");
                            date.append(Hum);
                        }
                        //media query for small display
                        if ($(window).width() <= 660) {
                            $('.col-2').addClass('col-6').removeClass('col-2');
                        }
                    });
            })


    }


    if ("geolocation" in navigator) { //check geolocation available 
        //try to get user current location using getCurrentPosition() method
        navigator.geolocation.getCurrentPosition(function (position) {
            var url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude.toFixed(2)}&lon=${position.coords.longitude.toFixed(2)}&apikey=${apikey}`;
            var fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude.toFixed(2)}&lon=${position.coords.longitude.toFixed(2)}&apikey=${apikey}`;
            getData(url, fiveDayForecastUrl);

        });
    } else {
        alert("Sorry, your browser does not support geolocation services.");
    }


    
    $('button').click(function () {
        init();
        var cityName = $('input').val();
        var Url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&apikey=${apikey}`;
        var fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&apikey=${apikey}`;
        $('.list-group').prepend($('<li>').attr('class', 'list-group-item').text(cityName));
        getData(Url, fiveDayForecastUrl);
        localStorage.setItem('cityname' + index, JSON.stringify(cityName));
        index++;
    })
    $('.search-history').click(function (event) {
        event.preventDefault();
        init();
        var cityName = event.toElement.innerText;
        var Url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&apikey=${apikey}`;
        var fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&apikey=${apikey}`;
        getData(Url, fiveDayForecastUrl);
    })

    //show recent 10 search histories
    function showrecentsearch() {
        for (var i = 0; i < 10; i++) {
            if (localStorage.getItem('cityname' + i) != null) {
                var cityname = JSON.parse(localStorage.getItem('cityname' + i));
                $('.list-group').prepend($('<li>').attr('class', 'list-group-item').text(cityname));
            }
        }
    }
    showrecentsearch();

    //media query for medium display
    if ($(window).width() <= 960) {
        $("#Search-City").before($("#Today-Weather"));
        $('.col-3').addClass('col-12').removeClass('col-3');
        $('.col-9').addClass('col-12').removeClass('col-9');
    }


})