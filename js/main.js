import { code } from './utils/msgCode.js'
import { createElement } from './utils/ElemNode.js'

let wordsBook
let list = document.querySelector('#list')

function removeOldList() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function renderWordsList() {
    let fragment = document.createDocumentFragment()
    for (let word in wordsBook) {
        let li = createElement({
            type: 'li',
            id: word,
            classes: ['li-word-item'],
            children: [
                {
                    type: 'div',
                    text: word,
                    classes: ['text-word']
                },
                {
                    type: 'button',
                    text: '点击删除',
                    attr: {
                        index: word
                    },
                    classes: ['btn-delete'],
                    click: function (event) {
                        self = this
                        delete wordsBook[self.getAttribute('index')]
                        port.postMessage({ code: code['delete_word'], data: wordsBook })
                        removeOldList()
                        renderWordsList()
                    }
                }
            ],
        })
        fragment.appendChild(li)
    }
    list.appendChild(fragment)
}

let port = chrome.runtime.connect({ name: 'sync' })
port.onMessage.addListener(function (msg) {
    switch (msg.code) {
        case code['sync_wordsbook']:
            // todo: 感觉这样写太蠢了, 有空写个virtual dom来管理渲染
            wordsBook = msg.data
            removeOldList()
            renderWordsList()
            break
    }
})