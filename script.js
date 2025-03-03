const dq = (element) => document.querySelector(element)
const dqAll = (elements) => document.querySelector(elements)

pizzaJson.map((item, index) => {
    let pizzaItem = dq('.pizza-item').cloneNode(true);

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;


    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault()

        dq('.pizzaWindowArea').style.opacity = 0
        dq('.pizzaWindowArea').style.display = 'flex'
        setTimeout(
            () => {
                dq('.pizzaWindowArea').style.opacity = 1
            }, 300
        )



    })

    dq('.pizza-area').append(pizzaItem)
});