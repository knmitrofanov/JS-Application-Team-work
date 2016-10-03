const templates = (()=>{
    const cache = {};

    function get(templateName) {
        return new Promise((resolve,reject) => {
            if(cache[templateName]){
                resolve(cache[templateName])
            } else {
                $.get(`templates/${templateName}.html`)
                    .done((data)=> {
                        let templateData = Handlebars.compile(data);
                        cache[templateName] = templateData;
                        resolve(templateData);
                    })
                    .fail(reject);
            }
        })
        
    }
    return {
        get
    }
})();

export { templates }