//  input value
const cityinput=document.querySelector('.input_city');
const serch_btn=document.querySelector('.srch_btn');
const apikey='b6ad130263d38f463c4d22c57477778d' // apikey from openweatherapp
const weatherinfo=document.querySelector('.weather-info')
const notfound=document.querySelector('.error_container')
const searchcity=document.querySelector('.search_city_container')

const cntry_txt=document.querySelector('.country_txt')
const temp_txt =document.querySelector('.temp_txt')
const condition_txt=document.querySelector('.update_txt')
const Humidity_value=document.querySelector('.Humidity_value')
const wind_value=document.querySelector('.wind_value')
const weather_img=document.querySelector('.weather_img')
const current_date=document.querySelector('.date')
const ForecastItemsContainer=document.querySelector('.forecast_container')




serch_btn.addEventListener('click',()=>{// onclick input
    if(cityinput.value.trim() !=''){
    // console.log(cityinput.value)
    updateWeatherinfo(cityinput.value)
    cityinput.value=''
    cityinput.blur()   // clears input field after the text is input
}
})
cityinput.addEventListener('keydown' , (event)=>{ //input on enterkey
    if(event.key == 'Enter'&&
        cityinput.value.trim()!=''
    ) {
        updateWeatherinfo(cityinput.value)
        // console.log(cityinput.value)
        cityinput.value=''
        cityinput.blur()
    }}
)

 async function getFetchData(endPoint,city){
    const apiURL=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`
    const response= await fetch(apiURL)
    return response.json()
}

function getWeatherIcon(id){
    if (id<=232) return 'thunderstorm.svg'
    if (id<=321) return 'drizzle.svg'
    if (id<=531) return 'rain.svg'
    if (id<=622) return 'snow.svg'
    if (id<=781) return 'atmosphere.svg'
    if (id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}
 async function updateWeatherinfo(city){
    const weatherdata=await getFetchData('weather',city)
    if(weatherdata.cod!=200){
        showDisplaySection(notfound)
        return
    }
    console.log(weatherdata)
    const {
        name:country,
        main:{ temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherdata

    cntry_txt.textContent=country
    temp_txt.textContent= Math.round(temp) + ' °C'
    condition_txt.textContent=main
    Humidity_value.textContent=humidity+'%'
    wind_value.textContent=speed +' m/s'

    current_date.textContent=getCurrentDate()
    console.log(getCurrentDate())

    weather_img.src=`assets/weather/${getWeatherIcon(id)}`
    await updateForecastInfo(city)
    showDisplaySection(weatherinfo)
}

async function updateForecastInfo(city) {
    const forecastsData=await getFetchData('forecast',city)
   const timeTaken='12:00:00'
   const todayDate =new Date().toISOString().split('T')[0]

    ForecastItemsContainer.innerHTML=''
   forecastsData.list.forEach(forecastWeather => {
    if(forecastWeather.dt_txt.includes(timeTaken)&&
    !forecastWeather.dt_txt.includes(todayDate)){
        updateForecastItems(forecastWeather)
    }
    // console.log(forecastWeather)
   })
//    console.log(todayDate)
    // console.log(forecastsData)
}
function updateForecastItems(weatherdata){
    console.log(weatherdata)
    const{
        dt_txt:date,
        weather:[{id}],
        main:{ temp }
    }=weatherdata
    const dateTaken=new Date(date)
    const dateoption={
        day:'2-digit',
        month :'short'
    }
    const dateResult=dateTaken.toLocaleDateString('en-US',dateoption)

    const forecastItems = `
         <div class="forecast_item">
            <h5 class="regular_txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)} "  class="forecast_item_img">
            <h5> ${Math.round(temp)} °C</h5>
        </div>`
        ForecastItemsContainer.insertAdjacentHTML('beforeend',forecastItems)
}

function showDisplaySection(section){
    [weatherinfo,searchcity,notfound]
         .forEach(section => section.style.display='none')
     section.style.display='flex'
}