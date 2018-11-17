import config from '../config'
import request from "request";

const NEWS_API = config.newsApi;
const TOPNEWS_URL = NEWS_API.domain + NEWS_API.version + NEWS_API.topHeadlinesPath;
const IN = "in";

let cr = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za';
cr = cr.split(" ")

/**
 * Returns news related to a country
 */
export const topCountryNewsUrl = (country=IN) => {
    return TOPNEWS_URL
        + "?country="
        +country
        +"&"
        +NEWS_API.API_KEY_PROP
        +
        "="
        +NEWS_API.key;
}

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
                nigonifiedItem.description =  data.description;
                nigonifiedItem.source = data.source
                nigonifiedItem.publishedAt = data.publishedAt;
                nigonifiedItems.push(nigonifiedItem)
            })
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
        console.log("Preparing to request news from API")
        request.get(options, (error, res, body) => {
            if(error) {
                reject(error) // Rejects the Promise
            } else {
                console.log("Serving news from the API")
                resolve(body) // The JSON will be served to the then entry
            }
        })
    })
    return promise
}

export const countries = () => {
    let countries = []
    cr.map((item, index) => {
        countries.push({code: item, flag: `https://www.countryflags.io/${item}/flat/64.png`});
    })
    return countries
}