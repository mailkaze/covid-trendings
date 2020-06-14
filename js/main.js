const countrySearch = document.getElementById('country-search')
const cardsContainer = document.getElementsByClassName('cards-container')[0]
let globalCasesPerMillion = 0

const globalFetch = () => {
    const globalPopulation = 7794798729
    fetch('https://api.covid19api.com/summary')
        .then( res => {
            return res.json()
        })
        .then(data => {
            const globalNewConfirmed = data.Global.NewConfirmed
            globalCasesPerMillion = (globalNewConfirmed / globalPopulation *1000000).toFixed(2)
            const globalTotal = data.Global.TotalConfirmed
            document.getElementById('globalNewConfirmed').textContent = Intl.NumberFormat().format(globalNewConfirmed)
            document.getElementById('globalTotal').textContent = Intl.NumberFormat().format(globalTotal)
            document.getElementById('globalCasesPerMillion').textContent = Intl.NumberFormat().format(globalCasesPerMillion)
        })
}

const buildCountryData = (match) => {
    fetch('https://api.covid19api.com/countries')
        .then(res => {
            return res.json()
        })
        .then(covidCountries => {
            for (i of covidCountries) {
                for (j of match) {
                    // TODO: ver por qué veo paises que no tienen datos del covid
                    if (i.ISO2 === j.alpha2Code) {
                        renderCountry({
                            flag: j.flag, 
                            name: i.Country,
                            population: j.population,
                            key: i.ISO2,
                            slug: i.Slug
                        })
                    }
                }
            }
        })
}

const searchCountry = country => {
    fetch('https://restcountries.eu/rest/v2/all')
        .then(res => {
            return res.json()
        })
        .then(allCountries => {
            let match = []

            for (c of allCountries) { // recorremos todos los objetos de la lista de paises
                if (c.name.includes(country)) {
                    match.push(c)
                } else {
                    const translations = Object.values(c.translations)
                   for (t of translations) {
                        if (t && t.includes(country)) {
                            match.push(c)
                            break
                        }
                    } 
                }
            }

            buildCountryData(match)
        })
}

const renderCountry = covidCountry => {
    const countryCard = document.createElement('div')
    countryCard.classList.add('country-select','card')
    countryCard.setAttribute('name', covidCountry.name)
    countryCard.setAttribute('flag', covidCountry.flag)
    countryCard.setAttribute('population', covidCountry.population)
    countryCard.id = covidCountry.slug
    countryCard.setAttribute('onclick', 'loadCountryData(this.id, this.getAttribute("population"), this.getAttribute("flag"), this.getAttribute("name"))')
    countryCard.innerHTML = `
        <img src=${covidCountry.flag} />
        <h3>${covidCountry.name}</h3>
    `
    cardsContainer.appendChild(countryCard)
}

countrySearch.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        const country = e.target.value.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()).trim(); // cada palabra pasa a empezar por mayuscula
        countrySearch.value = ''
        cardsContainer.innerHTML = ""
        searchCountry(country)
    }
})

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
                <span class=${countryData.comparison}>${Intl.NumberFormat().format(globalCasesPerMillion)}</span>
                <i class="far fa-question-circle" onclick="toggleInfo()"></i></i>
            </p>
        </div>
    `
    cardsContainer.appendChild(countryDataCard)
}

const loadCountryData = (slug, population, flag, name) => {
    cardsContainer.innerHTML = ''
    fetch(`https://api.covid19api.com/total/country/${slug}/status/confirmed`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            const totalCases = data[data.length - 1].Cases
            const casesToday = data[data.length - 1].Cases - data[data.length - 2].Cases
            let meanCasesLastWeek = 0
            for (i = 2; i <= 8; i++){
                meanCasesLastWeek += data[data.length - i].Cases - data[data.length - (i+1)].Cases
            }
            meanCasesLastWeek = meanCasesLastWeek / 7
            const newCasesPerMillion = casesToday / (population/1000000)

            const trending = casesToday >= meanCasesLastWeek ? 'up' : 'down'
            const showArrowUp = trending === 'up' ? 'show' : 'hidden' 
            const showArrowDown = trending === 'up' ? 'hidden' : 'show' 

            const comparison = newCasesPerMillion > globalCasesPerMillion ? 'up' : 'down'
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

const toggleInfo = () => {
    const info =  document.getElementsByClassName('info')[0]
    info.classList.contains('hidden')
    ? info.classList.remove('hidden')
    : info.classList.add('hidden')
}

document.addEventListener("DOMContentLoaded", globalFetch())