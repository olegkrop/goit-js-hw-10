import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './partials/fetchCountries';
import countryInfoMarkup from './partials/country-info-markup.hbs';
import countryItemMarkup from './partials/country-item-markup.hbs';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    const countryName = event.target.value.trim();

    if (!countryName) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        // throw new Error('Error fetching data');
    };

    fetchCountries(countryName)
        .then(renderMarkup)
        .catch(onError);
}

function onError() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notify.failure('Oops, there is no country with that name');
}

function renderMarkup(countries) {

    if (countries.length <= 1) {
        const markup = countries.map((country) => {
            const languages = Object.values(country.languages).join(', ');
            country.languages = languages;
            return countryInfoMarkup(country);
        })
            .join('');
        countryList.innerHTML = '';
        countryInfo.innerHTML = markup;
    } else
        if (countries.length <= 10) {
            const markup = countries.map((country) => {
                return countryItemMarkup(country)
            })
                .join('');
            countryList.innerHTML = markup;
            countryInfo.innerHTML = '';
        } else {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
            Notify.success('Too many matches found. Please enter a more specific name.')
        }
}