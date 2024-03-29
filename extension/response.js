let articles = [];

function readData() {
    var url = new URL(location.href);
    var content = url.searchParams.get("content");
    let content_decompressed = LZString.decompressFromEncodedURIComponent(content);
    let datas = JSON.parse(content_decompressed);

    let dict = {};
    datas.forEach(article_compressed => {

        if (article_compressed == null) {
            return;
        }

        let article = JSON.parse(LZString.decompressFromEncodedURIComponent(article_compressed));
        articles.push(article);
        /*if (dict[article.author] === undefined) {
            dict[article.author] = [];
        }

        dict[article.author].push(article);*/

        if (article.status != "Pubblicato") {
            return;
        }

        document.getElementById('list').innerHTML += "<tr><th>" + article.date + " </th><th> " + article.title + " </th><th> " + 
                                                     "<a href='" +  article.url + "'>" + article.url + "</a>" + "</th><th>" + 
                                                     "<button name='cpybtn'>Copy!</button></th></tr>";

    });

    var months_count = new Map();
    articles.forEach(article => {

        let splitted = article.date.split('/'); 
        let month = splitted[1] + "/" + splitted[2];
        months_count.set(month, months_count.has(month) ? months_count.get(month) + 1 : 1);

    });
    
    months_count.forEach((k, v) => {
        document.getElementById('list-counts').innerHTML += "<tr><th> Month " + v + ":</th><th> " + k + "</th></tr>";
    });


    /*Object.keys(dict).forEach(author_key => {
        document.getElementById('list').innerHTML += "<li>" + author_key + " (Count: " + dict[author_key].length + ") <ul id='inner-" + author_key + "'></ul></li>";
    
        dict[author_key] = dict[author_key].reverse();
        dict[author_key].forEach(element => {
            let date = element.date.replace('/' + new Date().getFullYear(), '');
            let type = (element.to_check) ? "<b><i>### CHANGE HERE ###</b></i>" : "Originale";
            document.getElementById('inner-' + author_key).innerHTML += "<li>" + date + " - " + type + " - " + element.title + "</li>";
        });
    });*/
}

function get_csv() {
    let rows = articles.map(article => [article.date, "\"" + article.title + "\"", article.url]);
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    
    let encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    if (link.download !== undefined) {
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "extraction.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

window.onload = () => {

    readData();
    document.getElementById('btn_csv').onclick = get_csv;

    document.getElementById('msg').onkeyup = (e) => {
        for (let i = 0; i < document.getElementById('list').children.length; i++) {
            let aitem = document.getElementById('list').children[i].children[0].children[2];

            aitem.innerHTML = "<a href='" + aitem.children[0].href + "'>" + document.getElementById('msg').value + aitem.children[0] + "</a>"
        }
    };

    for (let i = 0; i < document.getElementsByName('cpybtn').length; i++) {
        document.getElementsByName('cpybtn')[i].onclick = (e) => {
            let text = document.getElementById('list').children[i].children[0].children[3].children[0].parentElement.parentElement.children[2].children[0].innerText;
            navigator.clipboard.write([new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) })]);
        }
    }

};
