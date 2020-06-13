const countrySearch = document.getElementById('country-search')
const cardsContainer = document.getElementsByClassName('cards-container')[0]

const globalFetch = () => {
    const globalPopulation = 7794798729
    // const numberOfCountries = 186
    fetch('https://api.covid19api.com/summary')
        .then( res => {
            return res.json()
        })
        .then(data => {
            const globalNewConfirmed = data.Global.NewConfirmed
            const globalCasesPerMillion = Math.round(globalNewConfirmed / globalPopulation *1000000)
            const globalTotal = data.Global.TotalConfirmed
            document.getElementById('globalNewConfirmed').textContent = Intl.NumberFormat().format(globalNewConfirmed)
            document.getElementById('globalCasesPerMillion').textContent = globalCasesPerMillion
            document.getElementById('globalTotal').textContent = Intl.NumberFormat().format(globalTotal)
            // TODO: Comparar con los días anteriores
        })
}

const buildCountryList = (match) => {
    fetch('https://api.covid19api.com/summary')
        .then(res => {
            return res.json()
        })
        .then(covidSummary => {
            const list = covidSummary.Countries
            for (i of list) {
                for (j of match) {
                    if (i.CountryCode === j.alpha2Code) {
                        renderCountry({
                            flag: j.flag, 
                            name: i.Country,
                            key: i.CountryCode
                        })
                    }
                }
            }
        })
}

const searchCountry = country => {
    fetch('http://restcountries.eu/rest/v2/all')
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
            console.log(match)
            const covidCountryList = buildCountryList(match)

            buildCountryList(covidCountryList)
        })
}

const renderCountry = covidCountryList => {
    const countryCard = document.createElement('div')
    countryCard.classList.add('country-select','card')
    countryCard.id = covidCountryList.key
    countryCard.setAttribute('onclick', 'loadCountryData(this.id)')
    // countryCard.onclick = loadCountryData(covidCountryList.key)
    countryCard.innerHTML = `
        <img src=${covidCountryList.flag} />
        <h3>${covidCountryList.name}</h3>
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

const loadCountryData = obj => {
    alert(obj)
}

document.addEventListener("DOMContentLoaded", globalFetch())