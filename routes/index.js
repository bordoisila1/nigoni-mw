import express from 'express';
import MemoryCache from '../memoryCache/memoryCache';
import { fetchNews, countries, nigonifyData } from "../utils/newsApiUtils";

const router = express.Router();
const latestNews = new MemoryCache(fetchNews);
// Stores a map of country specific news
let latestNewsCountry = new Map();

//News for India - DEFAULT
router.get('/api/v1/news', (req, res) => {
    latestNews.getData().then((items) => nigonifyData(items)).then(
        (data) => {
            res.status(200).set('Access-Control-Allow-Origin', '*').send({
                success: 'true',
                message: 'Top news from India',
                news: data,
            })
        }).catch(
        (err) => {
            res.status(500).set('Access-Control-Allow-Origin', '*').send({
                success: 'false',
                message: 'Oops ! Something went wrong',
                news: err + '',
            })
        })
});

//News for Country
router.get('/api/v1/news/:id', (req, res) => {

    let fetcher = latestNewsCountry.get(req.params.id)
    if(!fetcher || fetcher.isCacheExpired()) {
        latestNewsCountry.set(req.params.id, new MemoryCache(fetchNews.bind(null, req.params.id)))
        fetcher = latestNewsCountry.get(req.params.id)
    }
    fetcher.getData().then((items) => nigonifyData(items)).then(
        (data) => {
            res.status(200).set('Access-Control-Allow-Origin', '*').send({
                success: 'true',
                message: `News from ${req.params.id}`,
                news: data,
            })
        }).catch(
        (err) => {
            res.status(500).set('Access-Control-Allow-Origin', '*').send({
                success: 'false',
                message: 'Oops ! Something went wrong',
                news: err + '',
            })
        })
});

//Router /api/v1/news/countries -> Returns the countries one can use for news
router.get("/api/v1/countries", (req, res) => {
    res.status(200).set('Access-Control-Allow-Origin', '*').send({
        success: 'true',
        message: 'Countries',
        countries: countries(),
    })
})

export default router;