//https://www.mojotech.com/blog/node-js-memory-cache/
class MemoryCache {
    constructor(fetchFunction, minutesToLive = 2) { // Cache 1 hour default
        this.millisecondsToLive = minutesToLive * 60 * 1000;
        this.fetchFunction = fetchFunction;
        this.cache = null;
        this.getData = this.getData.bind(this);
        this.resetCache = this.resetCache.bind(this);
        this.isCacheExpired = this.isCacheExpired.bind(this);
        this.fetchDate = new Date(0);
    }
    isCacheExpired() {
        return (this.fetchDate.getTime() + this.millisecondsToLive)
            < new Date().getTime(); // Last fetched + Max TTL lesser than the current time ?
    }
    getData() {
        if (this.isCacheExpired()|| !this.cache) {
            // Real world will have the cache ALWAYS
            // filled after first chance and only TTL will handle all
            console.log('Cache expired - fetching new data');
            return this.fetchFunction()
                .then((data) => {
                    this.cache = data;
                    this.fetchDate = new Date();
                    return data;
                });
        } else {
            console.log('Cache hit at ' + new Date().toISOString());
            return Promise.resolve(this.cache);
        }
    }

    resetCache() {
        this.fetchDate = new Date(0);
    }
}

export default MemoryCache