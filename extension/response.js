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
        /*if (dict[article.author] === undefined) {
            dict[article.author] = [];
        }

        dict[article.author].push(article);*/

        if (article.status != "Pubblicato") {
            return;
        }

        document.getElementById('list').innerHTML += "<tr><th>" + article.date + " </th><th> " + article.title + " </th><th> " + 
                                                     "<a href='" +  article.url + "'>" + article.url + "</a>" + "</th></tr>";

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

window.onload = () => {
    readData();
};