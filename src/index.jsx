import {hooked, useState} from 'https://unpkg.com/uhooks?module'

const transform = esx => {
    const tag = esx.getSlotValue(esx.root.slots[0])
    if (typeof tag === 'function') {
        let node, prevRoot
        hooked(() => {
            console.time('update')
            const newNodeEsx = tag()
            if (newNodeEsx.root !== prevRoot) {
                prevRoot = newNodeEsx.root
                const replace = transform(newNodeEsx)
                if (!node)
                    node = replace
                else if (node !== replace) {
                    node.replaceWith(replace)
                    node = replace
                }
            }
            node.update(newNodeEsx)
            console.timeEnd('update')
        })()
        return node
    } else {
        const node = document.createElement(tag)
        node.update = (nodeEsx) => {
            const {root: {children, slots}} = nodeEsx
            node.textContent = nodeEsx.getSlotValue(children[0])
            if (slots.length > 1)
                node.onclick = nodeEsx.getSlotValue(slots[1])
        }
        return node
    }
}

const same = () => transform(<Counter />)

console.time('render')
document.body.append(
    transform(<Counter />),
    same(),
    same(),
    same(),
    transform(<Counter />)
)
console.timeEnd('render')

if (location.search === '?auto') {
    requestAnimationFrame(function click() {
        const button = document.querySelector('button')
        if (button) {
            button.click()
            requestAnimationFrame(click)
        }
    })
}

function Counter() {
    const [count, update] = useState(0)
    return count < 10 ?
        <button onClick={() => update(count + 1)}>{count}</button> :
        <div>You reached 10 🥳</div>
}
