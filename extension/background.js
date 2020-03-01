createContextMenus();

function createContextMenus() {
    chrome.contextMenus.create({
        title: "Extract Articles", 
        contexts: [ "page" ],
        documentUrlPatterns: [ "*://*/wp-admin/edit.php?*" ],
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
                        let date = article_elem.getElementsByClassName('date')[0].getElementsByTagName('span')[0].title.split(' ')[0];
                        let link = article_elem.getElementsByClassName('title')[0].getElementsByClassName('row-actions')[0].getElementsByTagName('span')[3].getElementsByTagName('a')[0].href;
                        
                        if (link.endsWith('&preview=true')) { //SKIP: it's a draft article
                            continue;
                        }

                        let type = (author === "Redazione") ? "<b><i>### CHANGE HERE ###</b></i>" : "Originale";
                        let str = date + " - " + author + " - " + type + " - " + link;

                        datas[data_length - i - 1] = str;
                    }

                    chrome.storage.sync.set({ "last_data": datas }, () => {
                        chrome.tabs.create({ "url": "response.html" }, (tab) => {});
                    });
                }
            }
            xhr.send();
        }
    });
}
