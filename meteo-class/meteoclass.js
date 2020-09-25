window.onload = function () {

    let btnVille = document.getElementById('recupVille');
    let listVille = document.getElementById('listVille');
    let bot = document.getElementById('bot');

    btnVille.addEventListener('click', recup_ville);

    async function recup_ville() {
        // to do: faire fonction request pour pas repeter fetch
        let villes = await City.fetchAPI(`http://meteo.webboy.fr`);


        villes.forEach((element, index) => {
            let option = document.createElement('option');
            option.value = villes[index].id;
            option.textContent = villes[index].name;
            listVille.appendChild(option);

        })

        listVille.addEventListener('change', () => {
            loadCityData()
        });


        loadCityData();
        btnVille.style.color = 'green'; //Signification (UI/UX) que les villes sont chargées
        btnVille.disabled = true;
    }
    async function loadCityData() {
        console.log("chargement d'une ville");
        let id = listVille.value;
        city = new City(id);
        console.log(city)
    }

    class City {

        #id = 0
        #name = ''
        #icon = ''
        #temperature = 0
        #vent = 0
        #directionVent = 0
        #gps = ''
        #date = ''

        nameDiv = document.getElementById('nameCity');
        meteoDiv = document.getElementById('meteoCity');
        botDiv = document.getElementById('bot');

        static ApiId = 'b4fec0d1304ed1e460bcd62df18dcf21';
        static Meteo_Icon = 'http://openweathermap.org/img/w/';
        static flecheImg = 'img/next.png';

        constructor(id = 0) {
            if (id > 0) {
                this.id = id //Javascript m'appel automatiquement mon setter => this.id(id);                
                this.load();
            } else {
                console.error('Erreur de chargement')
            }
        }

        //Getters et setters
        get id() {
            return this.#id;
        }
        set id(_id) {
            this.#id = parseInt(_id)
        }

        get name() {
            return this.#name;
        }
        set name(_name) {
            this.#name = _name
        }

        get icon() {
            return this.#icon;
        }
        set icon(_icon) {
            this.#icon = `${City.Meteo_Icon}${_icon}.png`;
        }

        get temperature() {
            return this.#temperature;
        }
        set temperature(_temp) {
            this.#temperature = _temp;
        }

        get vent(){
            return this.#vent;
        }
        set vent (_vent) {
            this.#vent = _vent;
        }

        get directionVent(){
            return this.#directionVent;
        }
        set directionVent(_directionVent){
            this.#directionVent = _directionVent;
        }

        get gps(){
            return this.#gps;
        }
        set gps(_gps){
            this.#gps = _gps;
        }

        get date(){
            return this.#date;
        }
        set date(_date){
            this.#date = _date;
        }

        load = async () => {
            let json = await City.fetchAPI(`https://api.openweathermap.org/data/2.5/weather?id=${this.id}&units=metric&APPID=${City.ApiId}`);
            this.name = json.name
            this.icon = json.weather[0].icon //04d (temps nuageux)    
            this.temperature = Math.round(json.main.temp)
            this.vent = Math.round(json.wind.speed*3.6)
            this.directionVent = (json.wind.deg - 270)
            this.gps = `GPS: ${json.coord.lat}°N, ${json.coord.lon}°O.`
            this.date = new Date(json.dt*1000);
            const option ={weekday: 'long', day: 'numeric', month:'long', year: 'numeric', hour: 'numeric', minute: 'numeric'};
            this.date = this.date.toLocaleDateString('fr-FR',option);
            this.display();
        }

        display = () => {
            //Présentation pour le tempaltoing dans les framework
            let template1 =`<h1>${this.name}</h1><img src="${this.icon}"/>`
            this.nameDiv.innerHTML = template1
            this.nameDiv.style.borderBottom = "solid 1px black";

            let template2 = `<div>
            <h4 id="t">Température :</h4>
            <p style="font-size: 50px">${this.temperature}°C</p>
            </div>
            <div>
            <h4 id="v">Vent : </h4>
            <p style="font-size: 50px">${this.vent}Km/h</p>
            </div>
            <div>
            <h4 id="d">Direction du vent : </h4>
            <h6>Nord</h6>
            <p><img style="width: 80px; transform: rotate(${this.directionVent}deg)" src ="${City.flecheImg}"/></p>
            <h6>Sud</h6>
            </div>`
            this.meteoDiv.innerHTML = template2;
            this.meteoDiv.style.display = "flex";

            let template3 = `<span>${this.gps}</span> <span> Dernier relevé : ${this.date}</span>`
            this.botDiv.innerHTML = template3;
        }

        static fetchAPI = async function (url) {
            let response = await fetch(url);
            let json = await response.json();
            return json;
        }

    }
}