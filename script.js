const timel = document.getElementById('time');
const datel = document.getElementById('date');
const currentWeatherIteml = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryE1 = document.getElementById('country');
const weatherForecastl = document.getElementById('weather-forecast');
const currentTempl = document.getElementById('current-temp');
const des = document.getElementById('des');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour%12:hour;
    const minutes = time.getMinutes();
    const ampm = hour>=12 ? 'PM' : 'AM';

    timel.innerHTML = hoursIn12HrFormat + `:` + (minutes<10 ? '0'+minutes:minutes) + ` `  + `<span id="am-pm">${ampm}</span>`;

    datel.innerHTML = days[day]+`, `+ date + ` ` + months[month];

}, 1000);
getWeatherData();
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{ 
      
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, temp, wind_speed, weather} = data.current;

    timezone.innerHTML = data.timezone;
    countryE1.innerHTML = data.lat + 'N ' + data.lon + 'E';
    des.innerHTML = ``
    currentWeatherIteml.innerHTML = 
    `<div class="des" id="des">
    <img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
    
        ${weather[0].description}
    </div>
    <div class="current-items">
        <div class="weather-items">
            <div>Temp</div>
            <div>${temp}&#176C</div>
        </div>
        <div class="weather-items">
            <div>Humidty</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-items">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-items">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-items">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}  </div>
        </div>
        <div class="weather-items">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        </div>
    </div>`;


    let otherDayforecast = '';
    data.daily.forEach((day, idx) => {
        if(idx==0)
        {
            currentTempl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Min - ${day.temp.min}&#176; C</div>
                <div class="temp">Max - ${day.temp.max}&#176; C</div>
            </div>
            `
        }
        else if(idx!=8)
        {
            otherDayforecast +=`
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Min - ${day.temp.min}&#176; C</div>
                <div class="temp">Max - ${day.temp.max}&#176; C</div>
            </div>
            
            `
        }
    });

    weatherForecastl.innerHTML = otherDayforecast;

}