import { typeCheck } from './typeChecker.js'

function buildNode(nodeDesc) {
    let Node = null
    if (typeCheck(nodeDesc) != 'Object') {
        throw new TypeError('argument should be a object')
    }
    if (! 'type' in nodeDesc) {
        throw new Error('node description object must have a \'type\' property')
    }
    if (typeCheck(nodeDesc.type) == 'String') {
        Node = document.createElement(nodeDesc.type)
    } else {
        throw new TypeError('property type should be a string')
    }
    for (let key in nodeDesc) {
        if (key == 'type') {
            continue
        }
        switch (key) {
            case 'id':
                if (typeCheck(nodeDesc.id) != 'String') {
                    throw new TypeError('property id should be a string')
                }
                Node.id = nodeDesc.id
                break
            case 'text':
                if (typeCheck(nodeDesc.text) != 'String') {
                    throw new TypeError('property text should be a string')
                }
                Node.innerHTML = nodeDesc.text
                break
            case 'attr':
                if (typeCheck(nodeDesc.attr) != 'Object') {
                    throw new TypeError('property attr should be an object')
                }
                for (let attrName in nodeDesc.attr) {
                    Node.setAttribute(attrName, nodeDesc.attr[attrName])
                }
                break
            case 'classes':
                if (typeCheck(nodeDesc.classes) != 'Array') {
                    throw new TypeError('property classes should be an array')
                }
                Node.classList.add(...nodeDesc.classes)
                break
            case 'children':
                if (typeCheck(nodeDesc.children) != 'Array') {
                    throw new TypeError('property children should be an array')
                }
                for (let index in nodeDesc.children) {
                    Node.appendChild(buildNode(nodeDesc.children[index]))
                }
                break
            case 'click':
                if (typeCheck(nodeDesc.click) != 'Function') {
                    throw new TypeError('property click should be an function')
                }
                Node.addEventListener('click', nodeDesc.click)
                break
        }
    }
    return Node
}

export function createElement(elemDesc) {
    return buildNode(elemDesc)
}

export function createElements() {
    // 似乎没有需要一下生成多个的场景...
}