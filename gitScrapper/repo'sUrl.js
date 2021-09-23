const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");


request("https://github.com/topics",callback);

let gitTopics = [];
function callback(err,res,html){
    if(err){
       console.log(err);
    }
    else{
        const $ = cheerio.load(html);
        let topicAnchorTag = $(".no-underline.d-flex.flex-column.flex-justify-center");
        // console.log(topicAnchorTag.length);
      
        for(let i= 0;i<topicAnchorTag.length;i++){
            let topicUrl = "https://github.com" + $(topicAnchorTag[i]).attr("href");
            gitTopics.push(
                {
                    topicUrl : topicUrl,
                    repo : []
                }
            )
            request(topicUrl,fetchRepoUrl.bind(this,i))
        }
    }
}

let count = 0;
function fetchRepoUrl(index,err,res,html){
    count++;
    const $ = cheerio.load(html);
    // console.log(html);
    let repoAnchorTags = $(".wb-break-word.text-bold");
    // console.log(repoAnchorTags.length);
    for(let i =0;i<repoAnchorTags.length;i++){
        gitTopics[index].repo.push(
            {
                repoUrl : "https://github.com" + $(repoAnchorTags[i]).attr("href")
            }
        )
    }
    if(count==3){
        fs.writeFileSync("temp3.json",JSON.stringify(gitTopics));
    }
}