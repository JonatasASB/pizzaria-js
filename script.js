let modalQt = 1
let cart = [];
let modalKey = 0;
let value = 0

const dq = (element) => document.querySelector(element)
const dqAll = (elements) => document.querySelectorAll(elements)

// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = dq('.pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;



    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault()

        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key

        dq('.pizzaBig img').src = pizzaJson[key].img
        dq('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        dq('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${pizzaJson[key].price.toFixed(2)}`
        dq('.pizzaInfo--size.selected').classList.remove('selected')
        dqAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = `${pizzaJson[key].sizes[sizeIndex]}`
        });
        dq('.pizzaInfo--qt').innerHTML = modalQt

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

//Eventos Modal
function closeModal() {
    dq('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        dq('.pizzaWindowArea').style.display = 'none'
    }, 300)
}
dqAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item =>
    item.addEventListener('click', closeModal)
)

dq('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    dq('.pizzaInfo--qt').innerHTML = modalQt
    dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${(pizzaJson[modalKey].price * modalQt).toFixed(2)}`
});

dq('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        dq('.pizzaInfo--qt').innerHTML = modalQt
        dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${(pizzaJson[modalKey].price * modalQt).toFixed(2)}`
    }
});

dqAll('.pizzaInfo--size').forEach(item => {
    item.addEventListener('click', () => {
        dq('.pizzaInfo--size.selected').classList.remove('selected')
        item.classList.add('selected')
    })
});

dq('.pizzaInfo--addButton').addEventListener('click', () => {
    let flavor = pizzaJson[modalKey].name

    let size = parseInt(dq('.pizzaInfo--size.selected').getAttribute('data-key'))

    let identifier = flavor + '__' + size;

    let verifyid = cart.findIndex(item => item.identifier == identifier)

    if (verifyid > -1) {
        cart[verifyid].amount += modalQt
    } else {
        cart.push({
            identifier,
            id: flavor,
            size,
            amount: modalQt
        })
    }
    updateCart();
    closeModal();

});

function updateCart() {
    if (cart.length > 0) {
        dq('.cart').innerHTML = '';
        dq('aside').classList.add('show')
        for (let i in cart) {

            let cartItem = dq('.models .cart--item').cloneNode(true);

            let sizeName;
            switch (cart[i].size) {
                case 0:
                    sizeName = 'P'
                    break;
                case 1:
                    sizeName = 'M'
                    break;
                case 2:
                    sizeName = 'G'
                    break;
            }

            let pizzaName = `${cart[i].id} - (${sizeName})`

            cartItem.querySelector('img').src = pizzaJson.find((item) => item.name == cart[i].id).img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].amount;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].amount++
                updateCart()
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                if (cart[i].amount > 1) {
                    cart[i].amount--
                    updateCart()
                }
            })

            dq('.cart').append(cartItem)
        }
    } else {
        dq('aside').classList.remove('show')
    }
}