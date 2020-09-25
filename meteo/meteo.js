window.onload = function () {

    let recupVille = document.getElementById('recupVille');
    let listVille = document.getElementById('listVille');
    let meteoCity = document.getElementById('meteoCity')
    let nameCity = document.getElementById('nameCity');
    let temp = document.getElementById('temp');
    let vent = document.getElementById('vent');
    let vitVent = document.getElementById('vitesse');
    let coord = document.getElementById('coordonnés');
    let releve = document.getElementById('date');

    recupVille.addEventListener('click', recup_ville);

    listVille.addEventListener('change', afficheVille);
   
        async function recup_ville() {
        // to do: faire fonction request pour pas repeter fetch
        let response = await fetch('http://meteo.webboy.fr/');
        let villes = await response.json();
        let citys = document.querySelectorAll('#listVille option')
        citys.forEach(element => {
            citys.remove();
        })
           
        villes.forEach((element,index) =>{
            let option = document.createElement('option');
            option.value = villes[index].id;
            option.textContent = villes[index].name;
            listVille.appendChild(option);
            
        })
    }
    async function afficheVille() {
        //style
        meteoCity.style.display = "flex";
        nameCity.style.borderBottom = "solid 1px black";

        let id = listVille.value
        // to do: faire fonction request pour pas repeter fetch
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=b4fec0d1304ed1e460bcd62df18dcf21`)
        let infoVilles = await response.json();
        console.log(infoVilles);
        let temperature = Math.round(infoVilles.main.temp - 273);
        let windSpeed = Math.round(infoVilles.wind.speed*3.6);
        let windDirection = infoVilles.wind.deg - 270;
        //nom
        nameCity.textContent = infoVilles.name;
        //icone
        let iconId = infoVilles.weather[0].icon
        let icon = document.createElement('img');
        icon.src = `http://openweathermap.org/img/wn/${iconId}@2x.png`
        nameCity.appendChild(icon);
        //température
        temp.textContent =`${temperature}°C`;
        //vent
        vent.textContent = `${windSpeed} km/h`;
        //orientation vent

        vitVent.textContent = ``;
        arrowImg = document.createElement('img');
        arrowImg.src = 'img/next.png';
        arrowImg.style.width = "80px";
        arrowImg.style.transform = `rotate(${windDirection}deg)`;
        vitVent.appendChild(arrowImg);
        //coordonnées gps
        coord.textContent = `GPS: ${infoVilles.coord.lat}°N, ${infoVilles.coord.lon}°O.`;
        //relevé
        let date = new Date(infoVilles.dt*1000);
        const option ={weekday: 'long', day: 'numeric', month:'long', year: 'numeric', hour: 'numeric', minute: 'numeric'};
        date = date.toLocaleDateString('fr-FR',option);
        releve.textContent = `Dernier relevé : ${date}`;
    }
}