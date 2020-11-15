$(document).ready(function() {

$("search-button").on("click", function() {
    var searchValue = $("search-value").val();

$("#search-value").val("");


})


function searchWeather() {
    $.ajax({
        type: "GET" ,
        url: "https://openweathermap.org/api" + searchValue + "51532d704a6d1621b8661ec4a5906bba"
        units=imperial,
        dataType: "json",
    }).then(data) {
        console.log(data)
    
}























})