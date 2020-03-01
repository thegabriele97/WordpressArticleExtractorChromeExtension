function readData() {
    chrome.storage.sync.get(["last_data"], function(datas) {
        if (datas.hasOwnProperty('last_data')) {
            datas.last_data.forEach(element => {
                if (element === null) {
                    return;
                }

                document.getElementById('list').innerHTML += "<li>" + element + "</li>";
            });
        }
    });
}

window.onload = () => {
    readData();
};