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

let topicCount = 0;
let totalCount = 0;
function fetchRepoUrl(index,err,res,html){
    topicCount++;
    const $ = cheerio.load(html);
    // console.log(html);
    let repoAnchorTags = $(".wb-break-word.text-bold");
    // console.log(repoAnchorTags.length);
    
    for(let i =0;i<repoAnchorTags.length;i++){
        let repoUrl = "https://github.com" + $(repoAnchorTags[i]).attr("href")
        gitTopics[index].repo.push(
            {
                repoUrl : repoUrl,
                issues : []
            }
        )
        request(repoUrl + "/issues",fetchIssues.bind(this,index,i));
    }
   
}

let repoCount = 0;
function fetchIssues(index,ind,err,res,html){
    if(err){
        console.log(err);
    }
    repoCount++;
    const $ = cheerio.load(html);
    let issueAnchorTags = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")
    // console.log(issue.length);

    for(let i =0;i<issueAnchorTags.length;i++){
        gitTopics[index].repo[ind].issues.push({
            name  : $(issueAnchorTags[i]).text(),
            url : "https://github.com" + $(issueAnchorTags[i]).attr("href")
        })
    }

    if(topicCount==3){
        fs.writeFileSync("temp.json", JSON.stringify(gitTopics));
    }

}