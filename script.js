$("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();

    $("#search-value").val("");

    weekDay(searchValue)
    searchForecast(searchValue)
    historyBar.push(searchValue);
    localStorage.setItem("search", JSON.stringify(historyBar));
    renderHistoryBar();
});

let historyBar = JSON.parse(localStorage.getItem("search")) || [];

$("#clear-button").on("click", function () {
    historyBar = [];
    renderHistoryBar();
});

function searchForecast(searchValue) {
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=51532d704a6d1621b8661ec4a5906bba&units=imperial`,
        dataType: "json",
    }).then(function (data) {
        console.log(data)

        $("#today").empty()

        //creating a card for appending weather data
        var title = $("<h3>").addClass("card-title").text(data.name + " " + "(" + todaysDate + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " \u00B0F");
        var icon = (`<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">`)
        var cardBody = $("<div>").addClass("card-body");

        cardBody.append(title, icon, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        uvIndex(data.coord.lat, data.coord.lon);
    })
}

function uvIndex(lat, lon) {
    $.ajax({
        type: "GET",
        url: 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=51532d704a6d1621b8661ec4a5906bba&units=imperial',
        dataType: "json",
    }).then(function (data) {
        console.log(data)

        if (data.value <= 2) {
            var fav = $("<span>").addClass("badge badge-pill badge-success").text("UV Index: " + data.value);
        } else if (data.value >= 5) {
            var sev = $("<span>").addClass("badge badge-pill badge-danger").text("UV Index: " + data.value);
        } else if (data.value >= 3 || data.value <= 5) {
            var mod = $("<span>").addClass("badge badge-pill badge-warning").text("UV Index: " + data.value);
        };
        $("#today .card-body").append(fav, sev, mod);
    })
}

var todaysDate = moment().format('MMM. Do, YYYY');

function weekDay(searchValue) {
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=51532d704a6d1621b8661ec4a5906bba&units=imperial`,
        dataType: "json",
    })
        .then(function (data) {
            console.log(data)

            $(".fiveDayTitle").empty()
            $("#oneWeek").empty()

            var fiveCast = $("<h3>").addClass("fiveDayTitle").text("5-Day Forecast: ")
            $(".fourHead").append(fiveCast);
            for (i = 0; i < 40; i = i + 8) {
                var card = $("<div>").addClass("card ml-3 mb-3 card5");
                var temp = $("<p>").addClass("card-text text5").text("Temperature: " + data.list[i].main.temp + " \u00B0F");
                var humid = $("<p>").addClass("card-text text5").text("Humidity: " + data.list[i].main.humidity + "%");
                var icon = (`<img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">`);
                var cardBody = $("<div>").addClass("card-body body5");

                let currentDate = new Date(data.list[i].dt_txt);
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                var forecastDate = $("<h3>").addClass("card-title title 5").text(month + "/" + day + "/" + year);

                cardBody.append(forecastDate, icon, temp, humid);
                card.append(cardBody);
                $("#oneWeek").append(card);
            }
        });
}

function renderHistoryBar() {
    var cityList = document.getElementById("cityList");
    cityList.innerHTML = "";

    for (let i = 0; i < historyBar.length; i++) {
        const enterCity = document.createElement("input");

        enterCity.setAttribute("type", "text");
        enterCity.setAttribute("readonly", true);
        enterCity.setAttribute("class", "form-control d-block bg-primary text-white");
        enterCity.setAttribute("value", historyBar[i]);
        enterCity.addEventListener("click", function () {
            searchForecast(enterCity.value);
            weekDay(enterCity.value);
        })
        cityList.append(enterCity);
    }
}

renderHistoryBar();
if (historyBar.length > 0) {
    searchForecast(historyBar[historyBar.length - 1]);
    weekDay(historyBar[historyBar.length - 1]);
}

// });