function readData() {
    var url = new URL(location.href);
    var content = url.searchParams.get("content");
    let content_decompressed = LZString.decompressFromEncodedURIComponent(content);
    let datas = JSON.parse(content_decompressed);

    let dict = {};
    datas.forEach(article_compressed => {
        let article = JSON.parse(LZString.decompressFromEncodedURIComponent(article_compressed));
        
        if (article == null) {
            continue;
        }
        
        if (dict[article.author] === undefined) {
            dict[article.author] = [];
        }

        dict[article.author].push(article);
    });

    Object.keys(dict).forEach(author_key => {
        document.getElementById('list').innerHTML += "<li>" + author_key + "<ul id='inner-" + author_key + "'></ul></li>";
    
        dict[author_key] = dict[author_key].reverse();
        dict[author_key].forEach(element => {
            let date = element.date.replace('/' + new Date().getFullYear(), '');
            let type = (element.to_check) ? "<b><i>### CHANGE HERE ###</b></i>" : "Originale";
            document.getElementById('inner-' + author_key).innerHTML += "<li>" + date + " - " + type + " - " + element.title + "</li>";
        });
    });
}

window.onload = () => {
    readData();
};