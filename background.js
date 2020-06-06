let store = localStorage
let wordsBook = {}
let connection

function loadBook() {
    const str = store.getItem('wordsBook')
    if (str == null || str == '') {
        store.setItem('wordsBook', '{}')
    } else {
        wordsBook = JSON.parse(str)
    }
}

function updateWordsBook(key) {
    // todo: 加入类似于查重机制, 记录某个单词被添加了多少次
    wordsBook[key] = {
        'date': Date.parse(new Date()).toString()
    }
    updateLocalStorage()
    syncWordsBook()
}

function updateLocalStorage() {
    store.setItem('wordsBook', JSON.stringify(wordsBook))
}

function syncWordsBook(){
    connection.postMessage(wordsBook)
}

chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.create({ url: chrome.runtime.getURL("main.html") })
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    // todo: 考虑去掉左右空格
    updateWordsBook(info.selectionText)
})

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        'title': '添加到生词库',
        'contexts': ['selection']
    })
})

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    console.log(req)
})


chrome.runtime.onConnect.addListener(function (port) {
    connection = port
    // 连接成功后同步生词本
    port.postMessage(wordsBook)

    port.onMessage.addListener(function (msg) {
        console.log(msg)
    })
})

loadBook()