//At first need to understand the project requirement
//then start designing
const storage = {
    city : '',
    country : '',
    saveItem(){
        localStorage.setItem('weatherapp-city',this.city)
        localStorage.setItem('weatherapp-country',this.country)
    },
    getItem(){
        this.city = localStorage.getItem('weatherapp-city')
        this.country = localStorage.getItem('weatherapp-country')
    }
}


const weatherData = {
    city : '',
    country : '',
    API_KEY : 'e4f75c298cad67b8255573a97b51c4e8',
    async getWeather() {
        try{
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
              )
              const data = await res.json()
              
              return {
                   data
              }
        }
        catch(err){
            console.log(err.message)
        }

    }
}

const UI = {
    loadSelector(){
        const cityElm = document.querySelector("#city");
        const cityInfoElm = document.querySelector("#w-city");
        const iconElm = document.querySelector("#w-icon");
        const feelElm = document.querySelector("#w-feel");
        const temparatureElm = document.querySelector("#w-temp");
        const pressureElm = document.querySelector("#w-pressure");
        const humidityElm = document.querySelector("#w-humidity");
        const btn = document.querySelector("#button");
        const countryElm = document.querySelector("#country");
        const formElm = document.querySelector("#form");
        const messageElm = document.querySelector("#messageWrapper");

        return {
            cityElm,
            cityInfoElm,
            iconElm,
            feelElm,
            temparatureElm,
            pressureElm,
            humidityElm,
            btn,
            countryElm,
            formElm,
            messageElm
        }
    },
    showMessage(msg){
        const {messageElm} = this.loadSelector()
        const elm = `<div class = 'alert alert-danger' id = 'message'>${msg}</div>`
        messageElm.insertAdjacentHTML('afterbegin',elm)
        this.hidemessage()
    },
    hidemessage(){
        const message = document.querySelector("#message")
        setTimeout(() => {
            if(message){
                message.remove()
            }
        },2000);
    },
    validateInput(city , country){
        if (country === '' || city === ''){
        this.showMessage('Please provide valid country and city name')
        return false
        }
        else{
            return true
        }
    },
    getInputValue(){
        const { cityElm , countryElm } = this.loadSelector()
        const city = cityElm.value
        const country = countryElm.value
        const isValid = this.validateInput( city , country)

        if(isValid){
           weatherData.city = city
           weatherData.country = country
        }
        //set data to local storage
        storage.city = city
        storage.country = country

        storage.saveItem()
    },
    getIcon(iconCode){
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
    },
    printWeather(weatherData){
        const {main , weather , name} = weatherData.data
        // console.log(main,weather,name)
        // print data to UI
        const { cityInfoElm,
                 iconElm,
                 feelElm,
                 pressureElm,
                 humidityElm,
                 temparatureElm
             } = this.loadSelector()
        cityInfoElm.textContent = name
        feelElm.textContent = weather[0].description
        pressureElm.textContent = `Pressure : ${main.pressure}KPa`
        humidityElm.textContent = `Humidity : ${main.humidity}`
        temparatureElm.textContent = `Temparature : ${main.temp} C`
        iconElm.setAttribute('src', this.getIcon(weather[0].icon))
    },
    resetInputValues(){
        const { cityElm , countryElm } = this.loadSelector()
        cityElm.value = '' 
        countryElm.value = ''
    },
    init(){
        const {formElm} = this.loadSelector()
        formElm.addEventListener('submit' , async (e) =>{
            e.preventDefault()
            //get the values from input
            this.getInputValue()
            //reset input values
            this.resetInputValues()

            //get the  data
            const data = await weatherData.getWeather()
            if(data.data.cod === '404'){
                UI.showMessage(data.data.message)
            }else{
                // const { main , weather , name} = data
                UI.printWeather(data)
            }

            window.addEventListener('DOMContentLoaded', async ()=>{
                storage.getItem()
                
                const city = storage.city
                const country = storage.country

                //data surce update
                weatherData.city = city ? city : 'Cumilla'
                weatherData.country = country ? country : 'BD'

                //print to the UI
                const data = await weatherData.getWeather()
                if(data.data.cod === '404'){
                UI.showMessage(data.data.message)
                }else{
            
                UI.printWeather(data)
            }
            })
        })
    }
}

UI.init()

