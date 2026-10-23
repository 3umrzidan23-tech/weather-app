function getWeather(city) {
  var myRequest = new XMLHttpRequest();

  myRequest.open(
    "GET",
    `https://api.weatherapi.com/v1/forecast.json?key=YOUR_WEATHERAPI_KEY&q=${city}&days=3`
  );

  myRequest.send();

  myRequest.addEventListener("readystatechange", function () {
    if (myRequest.readyState == 4 && myRequest.status == 200) {
      var response = JSON.parse(myRequest.response);
      displayWeather(response);
    }
  });
}

function displayWeather(data) {
  var box = "";

  var days = data.forecast.forecastday;

  for (var i = 0; i < days.length; i++) {
    var day = days[i];

    var date = day.date;
    var dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    var temp = day.day.avgtemp_c + "°C";
    var max = day.day.maxtemp_c + "°C";
    var min = day.day.mintemp_c + "°C";

    var condition = day.day.condition.text;
    var icon = day.day.condition.icon; // صورة جاهزة من الـ API

    box += `
    <div class="col-12 col-md-4">
            <div class="card h-100">
          <div class="card-body">

            <div class="d-flex justify-content-between fw-semibold pb-4">
              <span>${dayName}</span>
              <span>${date}</span>
            </div>

            <h3 class="fw-bold">${data.location.name}</h3>
            <br>

            <div class="text-center">
              <img src="https:${icon}" class="img-fluid" width="80" />
              <h1 class="fw-bold py-3">${temp}</h1>
              <p class="text-primary">${condition}</p>

              <p>Max: ${max}</p>
              <p>Min: ${min}</p>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  document.querySelector(".weather-row").innerHTML = box;
}

document.getElementById("button-addon2").addEventListener("click", function () {
  let city = document.getElementById("exampleDataList").value;
  getWeather(city);
});

getWeather("Cairo");