const request = require('request');
const mainUrl = "https://userbannerserver2.herokuapp.com";

class ServerAPI
{
    constructor() {}

    UploadImage(url, id)
    {
        request.post({
            url: `${mainUrl}/image`,
            form: {
                ID: id,
                Image: url
            }
        })
    }

    GetCSS()
    {
        let css;

        request.get({
            url: `${mainUrl}/image`
        }, (e, r, b) => {
            console.log(b);
            css = b
        })

        console.log(css);
        
        return css;
    }
}

module.exports = ServerAPI;