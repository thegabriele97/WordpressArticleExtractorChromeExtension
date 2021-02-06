createContextMenus();

function createContextMenus() {
    chrome.contextMenus.create({
        title: "Extract Articles", 
        contexts: [ "page" ],
        documentUrlPatterns: [ "*://*/wp-admin/edit.php*" ],
        onclick: (e) => {
            console.log(e);
            
            var xhr = new XMLHttpRequest();
            xhr.open("get", e.pageUrl, true);
            xhr.responseType = 'document';
            xhr.onload = function () {
                if (this.status == 200) {
                    let data_length = this.response.getElementsByClassName('iedit').length;
                    let datas = new Array(data_length);

                    for (let i = 0; i < data_length; i++) {
                        let article_elem = this.response.getElementsByClassName('iedit')[i];
                        article_elem.focus();

                        let author = article_elem.getElementsByClassName('author')[0].getElementsByTagName('a')[0].text;
                        //let link = article_elem.getElementsByClassName('title')[0].getElementsByTagName('strong')[0].getElementsByTagName('a')[0].href
                        console.log(article_elem.getElementsByClassName('date')[0].innerHTML.split('<br>'));
                        let date = article_elem.getElementsByClassName('date')[0].innerHTML.split('<br>')[1].split(' ')[0];
                        let link = article_elem.getElementsByClassName('title')[0].getElementsByClassName('row-actions')[0].getElementsByTagName('span')[3].getElementsByTagName('a')[0].href;
                        let title = article_elem.getElementsByClassName('title')[0].getElementsByTagName('strong')[0].getElementsByTagName('a')[0].innerText;
                        let status = article_elem.getElementsByClassName('date')[0].innerHTML.split('<br>')[0];

                        if (link.endsWith('&preview=true')) { //SKIP: it's a draft article
                            continue;
                        }

                        //let type = (author === "Redazione") ? "<b><i>### CHANGE HERE ###</b></i>" : "Originale";
                        let toCheck = author === "Redazione";
                        datas[i] = LZString.compressToEncodedURIComponent(JSON.stringify({
                            "to_check": toCheck,
                            "author": author,
                            "date": date,
                            "title": title,
                            "url": link,
                            "status": status
                        }));
                        
                        //let str = date + " - " + author + " - " + type + " - " + link;
                        //datas[data_length - i - 1] = str;
                    }

                    chrome.tabs.create({ "url": "response.html?content=" + LZString.compressToEncodedURIComponent(JSON.stringify(datas)) }, (tab) => {});
                }
            }
            xhr.send();
        }
    });
}
