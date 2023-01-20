import {hooked, useState} from 'https://unpkg.com/uhooks?module'

const transform = esx => {
    const tag = esx.getSlotValue(esx.root.slots[0])
    if (typeof tag === 'function') {
        let node, prevRoot
        hooked(() => {
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
        })()
        return node
    } else {
        const node = document.createElement(tag)
        node.update = (nodeEsx) => {
            const {root: {children, slots}} = nodeEsx
            node.onclick = slots[1] && nodeEsx.getSlotValue(slots[1])
            node.textContent = nodeEsx.getSlotValue(children[0])
        }
        return node
    }
}

document.body.appendChild(
    transform(<Counter/>)
)

function Counter() {
    const [count, update] = useState(0)
    return count < 10 ?
        <button onClick={() => update(count + 1)}>{count}</button> :
        <div>You reached 10 🥳</div>
}