const apiKey = "4123869c338352428705d8a50d36fc6c";

const board = document.querySelector("#board");

const renderTemp = ({main, name}) => {
    const f = ((main.temp - 273.15) * (9/5) + 32).toFixed(2); 
    board.innerHTML = `<h4>The temperature in ${name} is currently ${f}°F</h4>`;
}

const notFound = (city) => {
    board.innerHTML = `${city} is not a valid city`;
}

const renderTitle = () => {
    document.querySelector("#title").innerText = `${location.hash.slice(1).toUpperCase()} WEATHER:` 
}
renderTitle();
window.addEventListener("hashchange", () => {
    renderTitle();
})

const render5day = (fiveDay) => {
    console.log(fiveDay);
    const html = "<h4> The temperature for every 3 hours for next 5 days will be:</h4>" +
        "<table>" +
        fiveDay.map(list => {
            const date = Date(list.dt).slice(4,24);
            const temp = ((list.main.temp - 273.15) * (9/5) + 32).toFixed(2);
            return `<tr><td>${list.dt_txt}</td><td>${temp}°F</td></tr>`
    }).join('') + "</table>";

    board.innerHTML = html;
}

const fetchCity = async (city) => {
    if(location.hash.slice(1) === "current"){
        const cityAPI = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;
        fetch(cityAPI).then( (res) => {
                if(res.status === 200){
                    res.json().then(res => renderTemp(res))
                } else {
                    notFound(city);
                }
            })
    }
    if(location.hash.slice(1) === "forecast"){
        const cityAPI = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`;
        fetch(cityAPI).then( (res) => {
                if(res.status === 200){
                    res.json().then(res => render5day(res.list))
                } else {
                    notFound(city);
                }
            })
    }
}

const submitCity = document.querySelector("#submit");
submitCity.addEventListener("click", (ev)=> {
    ev.preventDefault();
    const city = document.querySelector("#cityInput").value;   
    fetchCity(city);
})

const coordinates = document.querySelector("#coordinates");
coordinates.addEventListener("click", (ev)=>{
    ev.preventDefault();
    const lat = document.querySelector("#lat").value;
    const lon = document.querySelector("#lon").value; 
    const coord = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(coord).then( res => {
        res.json().then(res => {
            fetchCity(res.name);
        })
    })   
})

const zip = document.querySelector("#zip");
zip.addEventListener("click", (ev)=>{
    ev.preventDefault();
    const zip = document.querySelector("#zipcode").value;
    
    fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=${apiKey}`).then( (res) => {
        if(res.status === 200){
            res.json().then(res => {
                fetchCity(res.city.name);            })
        } else {
            notFound(city);
        }
    })
})
