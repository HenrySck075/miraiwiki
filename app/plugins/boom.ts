export default defineNuxtPlugin(() => {
    const reqwest = $fetch.create({
        parseResponse: (tt)=>{
            console.log('hallo')
            console.log(tt);
            return tt;
        }
    });
    return {
        provide: {
            mwApiFetch: reqwest
        }
    }
})