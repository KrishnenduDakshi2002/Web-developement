//https://openweathermap.org/img/wn/03d@2x.png
// Search functionality

let inp = document.getElementById("search-bar-input");
let input_user = "";
inp.addEventListener("keyup", (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    getInput();
  }
});


//for page load
function getLocationData(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchPosition);
  } else {
    window.confirm("Sorry we can't get your location");
    window.confirm("You can search in the search box for your location.");
  }
}

function fetchPosition(position) {
  getAPIData(position.coords.latitude, position.coords.longitude);
}

// for user input
function getInput() {
  input_user = document.getElementById("search-bar-input").value.toLowerCase();
  console.log(input_user);
  const API_key = "596c62651cff7c00c629053e24aab093";

  // fetching lat and lon using input_user
  let first_url = `https://api.openweathermap.org/data/2.5/weather?q=${input_user}&appid=${API_key}`;

  fetch(first_url)
    .then((res) => res.json())
    .then((maindata) => {
      const latitude = maindata.coord.lat;
      const longitude = maindata.coord.lon;
      getAPIData(latitude, longitude);
    })
    .catch(() => {
      alert(
        "[ERROR]You are trying a location which is not in our database or there might some issues with data fetching"
      );
    });
}


// function for fetching data
function getAPIData(latitude, longitude) {
  //fetching all data using this latitude and longitude
  const API_key = "596c62651cff7c00c629053e24aab093";
  let all_data_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_key}`;
  fetch(all_data_url)
    .then((res) => res.json())
    .then((data) => {
      // function returning icon url
      function iconUrl(icon_code) {
        return `https://openweathermap.org/img/wn/${icon_code}@2x.png`;
      }

      //function returning date and time | input = seconds
      function getDate(seconds) {
        return new Date(seconds * 1000); // feeding Date miliseconds
      }

      //function for converting 24 hour format to 12 hour format
      function timeConvert(dateString) {
        let min_sec = dateString.substring(2, 8);
        let hour = Number(dateString.substring(0, 2));
        if (hour > 12) {
          let h = hour % 12;
          return h.toString() + min_sec + " " + "pm"; //PM
        } else if (hour == 12) {
          return dateString + " " + "pm"; //PM
        } else {
          return dateString + " " + "am"; //AM
        }
      }

      //function for dayDate
      function dayDate(seconds) {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        let dateEle = getDate(seconds);

        return (
          `${days[dateEle.getDay()]}` +
          " " +
          `${dateEle.getDate()}` +
          " " +
          `${months[dateEle.getMonth()]}` +
          " " +
          `${dateEle.getFullYear()}`
        );
      }

      //function to make string's first letter to capital
      function toCap(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      //Current temperature and weather description and icon
      document.getElementsByClassName("current-temp-value")[0].innerHTML =
        `${(data.current.temp - 273).toPrecision(2)}` + "℃";
      document.getElementById("current-loc").innerHTML = `${toCap(input_user)}`;
      document.getElementsByClassName("description")[0].innerHTML = `${toCap(
        data.current.weather[0].description
      )}`;
      document.getElementsByClassName(
        "icon"
      )[0].style.backgroundImage = `url(${iconUrl(
        data.current.weather[0].icon
      )})`;
      //current sun rise and sun set
      document.querySelector(".sun-rise-value").innerHTML = `${timeConvert(
        getDate(`${data.current.sunrise}`).toLocaleTimeString()
      )}`;
      document.querySelector(".sun-set-value").innerHTML = `${timeConvert(
        getDate(`${data.current.sunset}`).toLocaleTimeString()
      )}`;
      console.log(
        timeConvert(getDate(`${data.current.sunset}`).toLocaleTimeString())
      );
      // current - other data section
      document.querySelector(".feel-temp").innerHTML = `${(
        data.current.feels_like - 273
      ).toPrecision(2)}℃`;
      document.querySelector(
        ".humidity"
      ).innerHTML = `${data.current.humidity}`;
      document.querySelector(".UVI").innerHTML = `${data.current.uvi}`;
      document.querySelector(".wind-speed").innerHTML = `${(
        data.current.wind_speed * 3.6
      ).toPrecision(2)} km/h`;
      document.getElementById(
        "current-wind-direction"
      ).style.transform = `rotate(-${data.current.wind_deg}deg)`;

      //end of current temperature section

      //Hour slider section
      let h_slider_time = document.querySelectorAll(".h-time");
      let h_temp = document.querySelectorAll(".h-temp");
      let h_description = document.querySelectorAll(".h-description");
      let h_icon = document.querySelectorAll(".h-icon");
      let h_feel_like = document.querySelectorAll(".h-feel-like");
      let h_humidity = document.querySelectorAll(".h-humidity");
      let h_uvi = document.querySelectorAll(".h-UVI");
      let h_wind_speed = document.querySelectorAll(".h-speed");
      let h_wind_direction = document.querySelectorAll(".h-windDirection");

      //hour slider time
      for (let i = 0; i < h_slider_time.length; i++) {
        h_slider_time[i].innerHTML = `${timeConvert(
          getDate(`${data.hourly[i].dt}`).toLocaleTimeString().substring(0, 5)
        )}`;
      }

      //hour slide temperature
      for (let i = 0; i < h_temp.length; i++) {
        h_temp[i].innerHTML = `${(data.hourly[i].temp - 273).toPrecision(2)}℃`;
      }

      //hour description
      for (let i = 0; i < h_description.length; i++) {
        h_description[i].innerHTML = `${toCap(
          data.hourly[i].weather[0].description
        )}`;
      }

      //hour weather descriptive icons

      for (let i = 0; i < h_icon.length; i++) {
        h_icon[i].style.backgroundImage = `url(${iconUrl(
          data.hourly[i].weather[0].icon
        )})`;
      }

      //hour feel like
      for (let i = 0; i < h_feel_like.length; i++) {
        h_feel_like[i].innerHTML = `${(
          data.hourly[i].feels_like - 273
        ).toPrecision(2)}℃`;
      }

      //hour humidity
      for (let i = 0; i < h_humidity.length; i++) {
        h_humidity[i].innerHTML = `${data.hourly[i].humidity}`;
      }
      //hour uV index
      for (let i = 0; i < h_uvi.length; i++) {
        h_uvi[i].innerHTML = `${data.hourly[i].uvi}`;
      }

      //hour wind speed
      for (let i = 0; i < h_wind_speed.length; i++) {
        h_wind_speed[i].innerHTML = `${(
          data.hourly[i].wind_speed * 3.6
        ).toPrecision(2)}km/h`;
      }

      //hour wind direction
      for (let i = 0; i < h_wind_direction.length; i++) {
        h_wind_direction[
          i
        ].style.transform = `rotate(-${data.hourly[i].wind_deg}deg)`;
      }
      //end of hour slider

      //start of day slider
      let d_date = document.querySelectorAll(".d-Date");
      let d_day_temp = document.querySelectorAll(".d-day-temp-value");
      let d_night_temp = document.querySelectorAll(".d-night-temp-value");
      let d_icon = document.querySelectorAll(".d-weather-des-icon");
      let d_description = document.querySelectorAll(".d-weather-des-data");
      let d_min_max_temp = document.querySelectorAll(".d-temp-value");

      for (let i = 0; i < d_date.length; i++) {
        d_date[i].innerHTML = `${dayDate(`${data.daily[i].dt}`)}`;
      }

      for (let i = 0; i < d_day_temp.length; i++) {
        d_day_temp[i].innerHTML = `${(data.daily[i].temp.day - 273).toPrecision(
          2
        )}℃`;
      }

      for (let i = 0; i < d_night_temp.length; i++) {
        d_night_temp[i].innerHTML = `${(
          data.daily[i].temp.night - 273
        ).toPrecision(2)}℃`;
      }

      for (let i = 0; i < d_icon.length; i++) {
        d_icon[i].style.backgroundImage = `url(${iconUrl(
          data.daily[i].weather[0].icon
        )})`;
      }

      for (let i = 0; i < d_description.length; i++) {
        d_description[i].innerHTML = `${toCap(
          data.daily[i].weather[0].description
        )}`;
      }

      for (let i = 0; i < d_min_max_temp.length; i++) {
        d_min_max_temp[i].innerHTML =
          `${(data.daily[i].temp.min - 273).toPrecision(2)}℃` +
          "/" +
          `${(data.daily[i].temp.max - 273).toPrecision(2)}℃`;
      }
    })
    .catch(() => {
      alert("[ERROR] Facing issues while fetching data!");
    });
}
