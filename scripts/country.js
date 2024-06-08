async function getCountriesData(){
    try {
        let countries = await fetch('https://restcountries.com/v3.1/all', 
            {
                method: "GET"
            }).then(response => response.json());
    
        return countries;
    } catch (error) {
        alert(`Failed to fetch data: ${error.message}`);
    }
}

function renderBorderCountries(borderCountries){
    try {
        let borderContainer = document.querySelector('.border-container');

        borderCountries.forEach((country) => {
            let button = document.createElement('button')
            button.innerText = country.name.common;

            button.addEventListener('click', () => {
                window.location.href = `country.html?country=${country.cca3}`
            })
            borderContainer.appendChild(button);
        })
    } catch (error) {
        alert(error.message);
    }
}

function handleTheme(){
    try {
        const preferredTheme = sessionStorage.getItem('theme');
        console.log(preferredTheme);
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
        showLoaderOverlay();
        const urlParams = new URLSearchParams(window.location.search);
        const countryCode = urlParams.get('country'); 
        let countries = await getCountriesData();
    
        let flagElement = document.getElementById('flag');
        let countryName = document.getElementById('country-name');
        let nativeName = document.getElementById('native-name');
        let populationElement = document.getElementById('population');
        let regionElement = document.getElementById('region');
        let subRegionElement = document.getElementById('sub-region');
        let captialElement = document.getElementById('capital');
        let domainElement = document.getElementById('domain');
        let currenncyElement = document.getElementById('currency');
        let languageElement = document.getElementById('languages');
    
        let country = countries.filter((country) => {
            return country.cca3 == countryCode;
        })[0];
    
        let nativeNames = Object.values(country.name.nativeName).reduce((acc, name) => {
            acc.push(name.common);
            return acc;
        }, []);
        nativeNames = [...new Set(nativeNames)];
    
        let currencies = Object.values(country.currencies).reduce((acc, currency) => {
            acc.push(currency.name);
            return acc;
        }, []);
    
        let languages = Object.values(country.languages ? country.languages : {});
    
        let borderCountries = countries.filter((item) => {
                let borders = country.borders ? country.borders : []
                return borders.includes(item.cca3)
            })
    
        flagElement.setAttribute('src', country.flags ? country.flags.png : '');
        flagElement.setAttribute('alt', country.flags.alt ? country.flags.alt : '');
        countryName.innerText = country.name.common ? country.name.common : 'N/A';
        nativeName.innerText = nativeNames.length != 0 ? nativeNames.join(', ') : 'N/A';
        populationElement.innerText = country.population ? country.population.toLocaleString('en-US') : 'N/A';
        regionElement.innerText = country.region ? country.region : 'N/A';
        subRegionElement.innerText = country.subregion ? country.subregion : 'N/A';
        captialElement.innerText = country.capital && country.capital.length != 0 ? country.capital.join(', ') : 'N/A';
        domainElement.innerText = country.tld && country.tld.length != 0 ? country.tld.join(', ') : 'N/A';
        currenncyElement.innerText = currencies.length != 0 ? currencies.join(', ') : 'N/A';
        languageElement.innerText = languages.length != 0 ? languages.join(', ') : 'N/A';
    
        renderBorderCountries(borderCountries);
        handleTheme();
        hideLoaderOverlay();
    } catch (error) {
        alert(error.message);
        hideLoaderOverlay();
    }
})