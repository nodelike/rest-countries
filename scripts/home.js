async function getCountriesData(){
    try {
        let countries = await fetch('https://restcountries.com/v3.1/all', 
        {
            method: "GET"
        }).then(response => response.json());

        return countries;       
    } catch (error) {
        alert(`Error fetching countries data: ${error.message}`)
    }
    
}

function render(countries){
    try {
        let countryContainer = document.querySelector(".country-container > .container");
        countryContainer.innerHTML = "";
    
        countries.forEach((country) => {
            let countryDiv = document.createElement('div');
            countryDiv.classList.toggle("country")
            countryDiv.addEventListener('click', () => {
                window.location.href = `country.html?country=${country.cca3}`
            })
    
            let image = document.createElement('img');
            image.setAttribute('src', country.flags.png)
            image.setAttribute('alt', country.flags.alt)
    
            let countryName = document.createElement('h3');
            countryName.innerText = country.name.common;
    
            // let stats = document.createElement('div');
            // stats.classList.toggle('stats');
    
            let population = document.createElement('p');
            let populationLabel = document.createElement('span');
            populationLabel.innerText = 'Population: '
            let populationValue = document.createElement('span');
            populationValue.innerText = country.population.toLocaleString('en-US');
            population.appendChild(populationLabel);
            population.appendChild(populationValue);
    
            let region = document.createElement('p');
            let regionLabel = document.createElement('span');
            regionLabel.innerText = 'Region: '
            let regionValue = document.createElement('span');
            regionValue.innerText = country.region;
            region.appendChild(regionLabel);
            region.appendChild(regionValue);
    
            let capital = document.createElement('p');
            let capitalLabel = document.createElement('span');
            capitalLabel.innerText = 'Capital: '
            let capitalValue = document.createElement('span');
            capitalValue.innerText = country.capital ? country.capital[0] : 'N/A';
            capital.appendChild(capitalLabel);
            capital.appendChild(capitalValue);
    
            countryDiv.appendChild(image);
            countryDiv.appendChild(countryName);
            countryDiv.appendChild(population);
            countryDiv.appendChild(region);
            countryDiv.appendChild(capital);
    
    
            countryContainer.appendChild(countryDiv)
        })    
    } catch (error) {
       alert(error.message);
    }
    
}

function populateFilterDropdown(countries){
    try {
        let dropdown = document.querySelector('.filter');

        let regions = countries.reduce((acc, country) => {
            if(country.region){
                acc.push(country.region);
            }
    
            return acc;
        }, [])
    
        regions = [...new Set(regions)];
    
        regions.forEach((region) => {
            let option = document.createElement('option');
    
            option.setAttribute('value', region);
            option.innerText = region;
    
            dropdown.appendChild(option);
        })
    } catch (error) {
        alert(error.message);
    }
}

function searchCountry(countries, value){
    try {
        let region = document.querySelector('.filter').value;

        let filteredData = countries.filter((country) => {
            if(region == ""){
                return true
            } else {
                return country.region == region;
            }
        }).filter((country) => {
            return country.name.common.toLowerCase().includes(value.toLowerCase())
        });
        render(filteredData);    
    } catch (error) {
        alert(error.message);
    }
}

function filterCountries(countries, region){
    try {
        let filteredData = countries.filter(country => country.region == region);
        render(filteredData);
    } catch (error) {
        alert(error.message);
    }
}

function handleTheme(){
    try {
        const preferredTheme = sessionStorage.getItem('theme');

        if (preferredTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    
        let themeToggle = document.getElementById('toggle-theme');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
    
            const isDarkMode = document.body.classList.contains('dark-mode');
            sessionStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }) 
    } catch (error) {
        alert(error.message);
    }
}

function showLoaderOverlay() {
    const loaderOverlay = document.getElementById('loader-overlay');
    if (loaderOverlay) {
      loaderOverlay.style.display = 'flex';
    }
}

function hideLoaderOverlay() {
    const loaderOverlay = document.getElementById('loader-overlay');
    if (loaderOverlay) {
      loaderOverlay.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoaderOverlay()
        let countries = await getCountriesData();
        render(countries);
        populateFilterDropdown(countries);
    
        const search = document.querySelector(".search-container > input")
        search.addEventListener('input', () => {
            searchCountry(countries, search.value);
        })
    
        let filterDropdown = document.querySelector('.filter');
        filterDropdown.addEventListener('change', () => {
            filterCountries(countries, filterDropdown.value);
        })
    
        handleTheme();
        hideLoaderOverlay();  
    } catch (error) {
        alert(error.message);
        hideLoaderOverlay();
    }
})