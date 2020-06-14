const code = {
    'sync_wordsbook': 1,
    'delete_word': 2
}

let store = localStorage
let wordsBook = {}
let connection


// function
function loadBook() {
    const str = store.getItem('wordsBook')
    if (str == null || str == '') {
        store.setItem('wordsBook', '{}')
    } else {
        wordsBook = JSON.parse(str)
    }
}

function addToWordsBook(key) {
    // todo: 加入类似于查重机制, 记录某个单词被添加了多少次
    wordsBook[key] = {
        'date': Date.parse(new Date()).toString()
    }
    updateLocalStorage()
    updateMainPage()
}

function updateMainPage() {
    connection.postMessage({ code: code['sync_wordsbook'], data: wordsBook })
}

function updateLocalStorage() {
    store.setItem('wordsBook', JSON.stringify(wordsBook))
}

//  listener
chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.create({ url: chrome.runtime.getURL("main.html") })
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    // todo: 考虑去掉左右空格
    addToWordsBook(info.selectionText)
})

// chrome.runtime.onInstalled.addListener(function () {
chrome.contextMenus.create({
    'title': '添加到生词库',
    'contexts': ['selection']
})
// })

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    console.log(req)
})


chrome.runtime.onConnect.addListener(function (port) {
    connection = port
    // 连接成功后同步生词本
    port.postMessage({ code: code['sync_wordsbook'], data: wordsBook })

    port.onMessage.addListener(function (msg) {
        switch (msg.code) {
            case code['delete_word']:
                wordsBook = msg.data
                updateLocalStorage()
                break
        }
    })
})

// 
loadBook()