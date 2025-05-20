let modalQt = 1// Variável que vai armazenar a quantidade de pizzas
let cart = [];// Array do carrinho
let modalKey = 0;//Variável responsável por armazenar o data-key da pizza clicada

//Função para não precisar usar "querySelector" sempre
const dq = (element) => document.querySelector(element)
const dqAll = (elements) => document.querySelectorAll(elements)

// Listagem das pizzas

pizzaJson.map((item, index) => {
    //Variável responsável por clonar a classe pizza-item do html
    let pizzaItem = dq('.pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index)//adiciona o atrivuto data-key com o valor do indíce de casa item do elemeento
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;// mostra na tela o name de pizzaJson
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;//mostra na tela a descrição de PizzaJson
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price[2].toFixed(2)}`// mostra an tela o preço de pizzaJson
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;// Mostra na tela a imagem de PizzaJson


    //Adicionado evento de clique na tag a em pizza-item
    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault()//Previne a ação nativa de <a> que é ir para o endereço de ir para o href

        //Variável que vai armazenar o data-key da pizza clicada
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key

        //mostrar image, nome, descrição, preço, peso e quantidade
        dq('.pizzaBig img').src = pizzaJson[key].img
        dq('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        dq('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        //Garante que o preço vai mudar quando o tamanho da pizza for mudado
        dqAll('.pizzaInfo--size').forEach(item => {

            let sizeKey = item.getAttribute('data-key')
            let selectedPrice = pizzaJson[modalKey].price[sizeKey]

            dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${(selectedPrice * modalQt).toFixed(2)}`

        })
        //remove a classe selected onde selected está selecionado
        dq('.pizzaInfo--size.selected').classList.remove('selected')
        dqAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            // garante que todas as vezes que o modal abrir, o selected sempre está na pizza grande
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            // mostra na tela os pesos
            size.querySelector('span').innerHTML = `${pizzaJson[key].sizes[sizeIndex]}`
        });
        //mostra a quantidade no modal
        dq('.pizzaInfo--qt').innerHTML = modalQt

        //faz com que o modal apareça
        dq('.pizzaWindowArea').style.opacity = 0
        dq('.pizzaWindowArea').style.display = 'flex'
        //Define com quanto tempo esse modal vai aparecer, 300ms
        setTimeout(
            () => {
                dq('.pizzaWindowArea').style.opacity = 1
            }, 300
        )
    })
    //pizzaitem será "filha" da classe pizza-area
    dq('.pizza-area').append(pizzaItem)
});

//Eventos Modal
//Função responsável por fazer modificações no modal e fechar o modal
function closeModal() {
    //Fecha o modal com um intervalo, 300ms
    dq('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        dq('.pizzaWindowArea').style.display = 'none'
    }, 300)
}
//adiciona um evento de clique que roda a propria função nas classes selecionadas
dqAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item =>
    item.addEventListener('click', closeModal)
)
//Evento de clique responsável por controlar o modalQt 
dq('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    //mostrar a quantidade 
    dq('.pizzaInfo--qt').innerHTML = modalQt
    let sizeKey = dq('.pizzaInfo--size.selected').getAttribute('data-key')
    let selectedPrice = pizzaJson[modalKey].price[sizeKey]
    //Mostrar o preço com base no tamanho e quantidade
    dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${(selectedPrice * modalQt).toFixed(2)}`

});

//Evento de clique responsável por controlar o modalQt 
dq('.pizzaInfo--qtmenos').addEventListener('click', () => {
    //Garante que modalQt não será menor que 1
    if (modalQt > 1) {
        modalQt--;
        dq('.pizzaInfo--qt').innerHTML = modalQt
        let sizeKey = dq('.pizzaInfo--size.selected').getAttribute('data-key')

        let selectedPrice = pizzaJson[modalKey].price[sizeKey]
        //Mostra na tela o preço com base no tamanho e quantidade
        dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${(selectedPrice * modalQt).toFixed(2)}`

    }
});
//Percorre todas as classe pizzaInfo-size
dqAll('.pizzaInfo--size').forEach(item => {
    item.addEventListener('click', () => {
        //remove e depois adiciona a classe selected, para garatir que somente uma estara pintada
        dq('.pizzaInfo--size.selected').classList.remove('selected')
        item.classList.add('selected')

        let sizeKey = item.getAttribute('data-key')
        let selectedPrice = pizzaJson[modalKey].price[sizeKey]
        //Atualiza o preço com base no tamanho e quantidade
        dq('.pizzaInfo--actualPrice').innerHTML = `R$: ${(selectedPrice * modalQt).toFixed(2)}`
    })
});
//Evento de clique responsável por adicionar todas as informações no carrinho
dq('.pizzaInfo--addButton').addEventListener('click', () => {
    //Sabor da pizza
    let flavor = pizzaJson[modalKey].name
    //Tamanho da pizza
    let size = parseInt(dq('.pizzaInfo--size.selected').getAttribute('data-key'))
    //Identificador
    let identifier = flavor + '__' + size;
    //verificação para saber se já existe uma pizza com o mesmo identificador
    let verifyid = cart.findIndex(item => item.identifier == identifier)

    //Se ja sexistir so aumenta a quantidade
    if (verifyid > -1) {
        cart[verifyid].amount += modalQt
    } else {
        //Se não, adiciona informações ao array
        cart.push({
            identifier,
            id: flavor,
            size,
            amount: modalQt
        })
    }
    //Atualiza e fecha modal
    updateCart();
    closeModal();

});
//Mostra carrinho no clique, caso tenha algo no carrinho
dq('header').addEventListener('click', () => {
    if (cart.length > 0) {
        dq('aside').style.left = '0'
    }
})
//fecha carrinho no meu mobile
dq('.menu-closer').addEventListener('click', () => {
    dq('aside').style.left = '100vw'
})

//Função que atualiza carrinho
function updateCart() {
    //Mostra a quantidade de itens no mobile
    dq('.menu-openner span').innerHTML = cart.length

    //Se tiver algo no carrinho ele aparece
    if (cart.length > 0) {
        dq('.cart').innerHTML = '';
        dq('aside').classList.add('show')
        let subtotal = 0;
        let discount = 0;
        let total = 0;

        //Loop no carrinho para verificar todas as informações e mostrar em tela
        for (let i in cart) {
            //Retorna um elemento em PizzaJson que tenha o mesmo name que o id de cart
            let pizza = pizzaJson.find(item => item.name == cart[i].id);

            //armazena o valor atual do Carrinho
            let pizzaPrice = pizza.price[cart[i].size];

            //acrescenta no subtotal o preço e a quantidade
            subtotal += pizzaPrice * cart[i].amount;

            //variavel que clona a classe cart--item
            let cartItem = dq('.models .cart--item').cloneNode(true);


            let sizeName;//Armazena o tamanho da pizza pra mostrar em tela
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

            //Noma da pizza e tamanho
            let pizzaName = `${cart[i].id} - (${sizeName})`

            //Mostra na tela a imagem, o nome com tamanhoe e a quantidade respectivamente
            cartItem.querySelector('img').src = pizzaJson.find((item) => item.name == cart[i].id).img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].amount;

            //Eventos de clique que atualiza as quantidades
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].amount++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                //Garante que não seja menor que 1
                if (cart[i].amount > 1) {
                    cart[i].amount--;
                    updateCart();
                } else {
                    cart.splice(i, 1);
                    updateCart();
                }
            });
            //cartItem é "filho" da classe cart
            dq('.cart').append(cartItem)
        }

        //calcula o desconto
        discount = subtotal * 0.1;
        //calcula o total
        total = subtotal - discount;
        //mostra na tela o subtotal, desconto e o total
        dq('.subtotal span:last-child').innerHTML = `R$: ${subtotal.toFixed(2)}`;
        dq('.desconto span:last-child').innerHTML = `R$: ${discount.toFixed(2)}`;
        dq('.total span:last-child').innerHTML = `R$: ${total.toFixed(2)}`
    } else {
        //Remove classe show e fecha menumobile caso não tenha nada no carrinho
        dq('aside').classList.remove('show');
        dq('aside').style.left = '100vw'
    }
}
