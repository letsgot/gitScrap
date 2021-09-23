const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

request("https://github.com/bhavesh-pepcoding/pp14/blob/master/cheerio/github/issuesScrapper.js",callback);

function callback(err,res,html){
    if(err){
        console.log(err);
    }
    else{
        const $ = cheerio.load(html);

        let String = "";
        
        let codelines = $("table tr");

        console.log(codelines.length);

        for(let i=0;i<codelines.length;i++){
            let code = $($("table tr")[i]).text();
            fs.appendFileSync("code.js",code);
        }

        
    }
}