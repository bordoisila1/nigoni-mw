import config from 'config'
import request from "request";

const NEWS_API = config.get('newsApi');
const TOPNEWS_URL = NEWS_API.domain + NEWS_API.version + NEWS_API.topHeadlinesPath;
const IN = "in";

const cr = config.countryFlags.countries;

/**
 * Returns news related to a country
 */
export const topCountryNewsUrl = (country=IN) => {
    return TOPNEWS_URL
        + '?country='
        + country
        + '&'
        + NEWS_API.API_KEY_PROP
        + '='
        + NEWS_API.key
        + '&'
        + NEWS_API.PAGE_SIZE
        + '=50';
};

/**
 * Converts the data to an acceptable format for the React FE
 * @param data
 */
export const nigonifyData = (nonNigonifiedItems) => {
    //Create a Promise that nigonifies the data and then returns
    nonNigonifiedItems = JSON.parse(nonNigonifiedItems)
    let promise = new Promise((resolve, reject) => {
        if(nonNigonifiedItems && nonNigonifiedItems.articles) {
            let nigonifiedItems = [];
            nonNigonifiedItems.articles.map((data, index) => {
                let nigonifiedItem = {}

                nigonifiedItem.title = data.title;
                nigonifiedItem.label =  data.title;
                nigonifiedItem.path = data.url;
                nigonifiedItem.url =  data.url;
                nigonifiedItem.tags =  [];
                nigonifiedItem.leftImage =  data.urlToImage;
                nigonifiedItem.alt = data.title;
                nigonifiedItem.description =  data.content;
                nigonifiedItem.source = data.source
                nigonifiedItem.publishedAt = formatDateToHoursAgo(data.publishedAt);
                nigonifiedItems.push(nigonifiedItem)
            })
            console.log('Nigonified ' + nigonifiedItems.length + ' items')
            resolve(nigonifiedItems)
        } else {
            console.log("Could not nigonify")
            reject(nonNigonifiedItems)
        }
    })
    return promise
}


//Promise for the news API
export const fetchNews = (country = IN) => {
    let promise = new Promise((resolve, reject) => {
        console.log("Preparing to fetch news")
        let options = {
            url : topCountryNewsUrl(country)
        }
        console.log("Preparing to request news from API with url " + options.url)
        request.get(options, (error, res, body) => {
            if(error) {
                reject(error) // Rejects the Promise
            } else {
                console.log("Serving news  from the API")
                resolve(body) // The JSON will be served to the then entry
            }
        })
    })
    return promise
}

export const countries = () => {
    let countries = []
    cr.map((item, index) => {
        countries.push({code: item, flag: `${config.countryFlags.domain}/${item}/flat/64.png`});
    })
    return countries
}

const formatDateToHoursAgo = (date) => {
    const time = Math.floor((new Date().getTime() - new Date(date).getTime())/1000/3600)
    return  time > 1 ? time + ' hours ago' : 'Just in..'
}