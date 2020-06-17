const es = {
    searchPlaceHolder: "Busca tu país ...",
    globalTitle: "Situación mundial:",
    globalNewCases: "Nuevos contagios (hoy):",
    globalTotalCases: "Casos Totales:",
    globalCasesPerMillion: "Contagios por millón de habitantes:",
    newCases: "Nuevos Contagios:",
    totalCases: "Casos totales:",
    population: "Población",
    casesPerMillion: "Contagios por millón de habitantes (hoy):",
    comparativeGlobalCasesPerMillion: "Contagios mundiales por millón de habitantes (hoy):",
    infoTitle: "¿Qué significan estos números?",
    infoCasesPerMillion: "Contagios por millón de habitantes (hoy)",
    infoP1: "Proporciona una idea más ajustada de la gravedad de la epidemia, sin importar la cantidad de habitantes.",
    infoP2: `Se muestra en <span class="green">VERDE</span> si hoy se han contagiado
            menos personas que la media de la semana anterior y puede indicar que la
            situación está mejorando, de lo contrario se mostrará en
            <span class="red">ROJO</span>.`,
    infoGlobalCasesPerMillion: "Contagios mundiales por millón de habitantes (hoy)",
    infoP3: `Se mostrará en <span class="green">VERDE</span> cuando el índice de
            contagios por millón de habitantes del país consultado es menor que el
            índice mundial, puede significar que este país está enfrentando la
            epidemia de un modo más eficaz que la mayoria de los países. De lo
            contrario se mostrará en <span class="red">ROJO</span>.`,
    infoClose: "Cerrar"
}

const en = {
    searchPlaceHolder: "Search your country ...",
    globalTitle: "World situation:",
    globalNewCases: "New infections (today):",
    globalTotalCases: "Total cases:",
    globalCasesPerMillion: "Infections per million inhabitants:",
    newCases: "New infections:",
    totalCases: "Total cases:",
    population: "Population:",
    casesPerMillion: "Infections per million inhabitants (today):",
    comparativeGlobalCasesPerMillion: "World infections per million inhabitants (today):",
    infoTitle: "What do these numbers mean?",
    infoCasesPerMillion: "Infections per million inhabitants (today)",
    infoP1: "It provides a better idea of the severity of the epidemic, regardless of the number of inhabitants.",
    infoP2: `It is displayed in <span class="green">GREEN</span> if fewer people have been infected today than the average of the previous week and may indicate that the situation is improving, otherwise it will be displayed in <span class="red">RED</span>.`,
    infoGlobalCasesPerMillion: "World infections per million inhabitants (today)",
    infoP3: `It will be displayed in <span class="green">GREEN</span> when the rate of infections per million inhabitants of the requested country is less than the global rate, it may mean that this country is facing the epidemic in a more effective way than most countries. Otherwise it will be displayed in <span class="red">RED</span>.`,
    infoClose: "Close"
}

console.log(navigator.language)
if (navigator.language.startsWith('es')) {
    alert('Español')
} else {
    alert('English')
}

let countries = []
let global = { newConfirmed: 0, totalConfirmed: 0, casesPerMillion: 0, population: 7794798729 }
const countrySearch = document.getElementById('country-search')
const cardsContainer = document.getElementsByClassName('cards-container')[0]

// llena los campos de la tarjeta 'global'
const renderGlobal = () => {
    global.casesPerMillion = (global.newConfirmed / global.population *1000000).toFixed(2)
    document.getElementById('globalNewConfirmed').textContent = Intl.NumberFormat().format(global.newConfirmed)
    document.getElementById('globalTotal').textContent = Intl.NumberFormat().format(global.totalConfirmed)
    document.getElementById('globalCasesPerMillion').textContent = Intl.NumberFormat().format(global.casesPerMillion)
}

// Primera function en ejecutarse, construye la lista de paises para la búsqueda
// y el objeto 'global'
const loadCountries = () => {
    fetch('https://restcountries.eu/rest/v2/all')
        .then(res => {
            return res.json()
        })
        .then(allCountries => {
            fetch('https://api.covid19api.com/summary')
                .then(res => {
                    return res.json()
                })
                .then(covidSummary => {
                    global.newConfirmed = covidSummary.Global.NewConfirmed
                    global.totalConfirmed = covidSummary.Global.TotalConfirmed
                    renderGlobal() // Ya tenemos info para cargar la tarjeta global

                    for (country of allCountries) { // recorremos todos los países
                        for (covid of covidSummary.Countries){ // recorremos los países con datos del COVID
                            if (country.alpha2Code === covid.CountryCode) {
                                const names = [covid.Country]
                                const translations = Object.values(country.translations)
                                translations.map( t => names.push(t))
                                const countryData = {
                                    names: names,
                                    flag: country.flag,
                                    countryCode: country.alpha2Code,
                                    population: country.population,
                                    slug: covid.Slug
                                }
                                countries.push(countryData)
                            }
                        }
                    }
                })
        })
}

// busca el término buscado en la lista de países
const searchCountry = country => {
    const match = countries.filter( c => {
        for (name of c.names) {
            if (name.includes(country)) return c
        }
    })
    match.map( x => renderCountry(x))
}

// carga los países durante la búsqueda
const renderCountry = covidCountry => {
    const countryCard = document.createElement('div')
    countryCard.classList.add('country-select','card')
    countryCard.setAttribute('name', covidCountry.names[0])
    countryCard.setAttribute('flag', covidCountry.flag)
    countryCard.setAttribute('population', covidCountry.population)
    countryCard.id = covidCountry.slug
    countryCard.setAttribute('onclick', `loadCountryData(
                                            this.id, 
                                            this.getAttribute("population"), 
                                            this.getAttribute("flag"), 
                                            this.getAttribute("name"))`)
    countryCard.innerHTML = `
        <img src=${covidCountry.flag} />
        <h3>${covidCountry.names[0]}</h3>
    `
    cardsContainer.appendChild(countryCard)
}

// carga la tarjeta con los datos del país seleccionado
const renderCountryData = countryData => {
    countryDataCard = document.createElement('div')
    countryDataCard.classList.add('country-data', 'card')
    countryDataCard.innerHTML = `
        <div class="top">
            <img src=${countryData.flag} />
            <div class="top-text">
            <h3>${countryData.name}</h3>
            <p>Nuevos contagios: <span>${Intl.NumberFormat().format(countryData.casesToday)}</span></p>
            <p>Casos totales: <span>${Intl.NumberFormat().format(countryData.totalCases)}</span></p>
            <p>Población: <span>${Intl.NumberFormat().format(countryData.population)}</span></p>
            </div>
        </div>
        <div class="text" >
            <p>Contagios por millón de habitantes (hoy):</p>
            <p class="more-margin-p">
                <i class="fas fa-caret-up ${countryData.showArrowUp}"></i>
                <i class="fas fa-caret-down ${countryData.showArrowDown}"></i>
                <span class=${countryData.trending}>${Intl.NumberFormat().format(countryData.newCasesPerMillion.toFixed(2))}</span>
                <i class="far fa-question-circle" onclick="toggleInfo()"></i>
            </p>
            <p>Contagios mundiales por millón de habitantes (hoy):</p>
            <p> 
                <i class="fas fa-caret-up ${countryData.showArrowUp2}"></i>
                <i class="fas fa-caret-down ${countryData.showArrowDown2}"></i>
                <span class=${countryData.comparison}>${Intl.NumberFormat().format(global.casesPerMillion)}</span>
                <i class="far fa-question-circle" onclick="toggleInfo()"></i></i>
            </p>
        </div>
    `
    cardsContainer.appendChild(countryDataCard)
}

// llamado al hacer click en el país de la lista de resultados de búsqueda
const loadCountryData = (slug, population, flag, name) => {
    countrySearch.value = ''
    cardsContainer.innerHTML = ''
    fetch(`https://api.covid19api.com/total/country/${slug}/status/confirmed`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            const totalCases = data[data.length - 1].Cases
            const casesToday = data[data.length - 1].Cases - data[data.length - 2].Cases
            let meanCasesLastWeek = 0
            for (i = 2; i <= 8; i++){ // saca la media de los casos nuevos de los últimos 7 días
                meanCasesLastWeek += data[data.length - i].Cases - data[data.length - (i+1)].Cases
            }
            meanCasesLastWeek = meanCasesLastWeek / 7
            const newCasesPerMillion = casesToday / (population/1000000)

            const trending = casesToday >= meanCasesLastWeek ? 'up' : 'down'
            const showArrowUp = trending === 'up' ? 'show' : 'hidden' 
            const showArrowDown = trending === 'up' ? 'hidden' : 'show' 

            const comparison = newCasesPerMillion > global.casesPerMillion ? 'up' : 'down'
            const showArrowUp2 = comparison === 'up' ? 'show' : 'hidden' 
            const showArrowDown2 = comparison === 'up' ? 'hidden' : 'show'

            countryData = {
                flag: flag,
                name: name,
                casesToday: casesToday,
                totalCases: totalCases,
                population: population,
                trending: trending,
                comparison: comparison,
                newCasesPerMillion: newCasesPerMillion,
                showArrowUp: showArrowUp,
                showArrowDown: showArrowDown,
                showArrowUp2: showArrowUp2,
                showArrowDown2: showArrowDown2
            }
            renderCountryData(countryData)
        })
}


// muestra u oculta la tarjeta de información
const toggleInfo = () => {
    const info =  document.getElementsByClassName('info')[0]
    info.classList.contains('hidden')
    ? info.classList.remove('hidden')
    : info.classList.add('hidden')
}

// EVENTOS:
countrySearch.addEventListener('keyup', e => {
    cardsContainer.innerHTML = ''
    const country = e.target.value.toLowerCase().trim().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()); // cada palabra pasa a empezar por mayuscula
    searchCountry(country)
    if (e.keyCode === 13) countrySearch.value = ''
})

document.getElementsByClassName('fa-search')[0].addEventListener('click', () => {
    cardsContainer.innerHTML = ''
    const country = e.target.value.toLowerCase().trim().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()); // cada palabra pasa a empezar por mayuscula
    searchCountry(country)
    countrySearch.value = ''
})

document.addEventListener("DOMContentLoaded", () => {
    loadCountries()
})
