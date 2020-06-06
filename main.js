let wordsBook
let list = document.querySelector('#list')

function removeOldList() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

// todo: 想想看怎么实现页面实时获取新添加的单词, session buddy就能实现类似操作
function renderWordsList() {
    let fragment = document.createDocumentFragment()
    for (let word in wordsBook) {
        let li = document.createElement('li')
        li.innerHTML = word
        fragment.appendChild(li)
    }
    list.appendChild(fragment)
}

let port = chrome.runtime.connect({ name: 'sync' })
port.onMessage.addListener(function (msg) {
    wordsBook = msg
    // todo: 感觉这样写太蠢了, 有空写个virtual dom来管理渲染
    removeOldList()
    renderWordsList()
})