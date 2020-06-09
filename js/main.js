const globalFetch = () => {
    let globalNewConfirmed = 0
    const globalPopulation = 7794798729
    let globalCasesPerMillion = 0
    let globalMeanThreeLastDays = 0
    const numberOfCountries = 186
    // let globalMeanPerMillsion = 0
    
    fetch('https://api.covid19api.com/summary')
        .then( res => {
            return res.json()
        })
        .then(data => {
            globalNewConfirmed = data.Global.NewConfirmed
            globalCasesPerMillion = Math.round(globalNewConfirmed / globalPopulation *1000000)
            globalMeanPerMillion = globalCasesPerMillion / numberOfCountries
            document.getElementById('globalNewConfirmed').textContent = globalNewConfirmed
            document.getElementById('globalCasesPerMillion').textContent = globalCasesPerMillion
            // document.getElementById('globalMeanPerMillion').textContent = globalMeanPerMillion
        })
    
}

document.addEventListener("DOMContentLoaded", globalFetch())