//variabel med en array av objekt bestående av produkter
const products = [
    {
        id: 0,
        name: 'Plucky McStrumface',
        amount: 0, 
        price: 16, 
        rating: 3, 
        category: 'plast',
        img: {
            url: 'assets/product-images/Product-PluckyMcStrumface.png',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 1,
        name: 'Pickachu',
        amount: 0, 
        price: 35, 
        rating: 5, 
        category: 'trä',
        img: {
            url: 'assets/product-images/Product-Pickachu.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 2,
        name: 'Plectrickery',
        amount: 0, 
        price: 38, 
        rating: 2, 
        category: 'metall',
        img: {
            url: 'assets/product-images/Product-Plectrickery.png',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 3,
        name: 'Shred Zeppelin',
        amount: 0, 
        price: 42, 
        rating: 3, 
        category: 'metall',
        img: {
            url: 'assets/product-images/Product-ShredZeppelin.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 4,
        name: 'Sir Strums-a-Lot',
        amount: 0, 
        price: 26, 
        rating: 2, 
        category: 'trä',
        img: {
            url: 'assets/product-images/Product-SirStrumsALot.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 5,
        name: 'Pickle Ricktum',
        amount: 0, 
        price: 35, 
        rating: 5, 
        category: 'trä',
        img: {
            url: 'assets/product-images/Product-PickleRicktum.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 6,
        name: 'Strumb & Dumb',
        amount: 0, 
        price: 18, 
        rating: 4, 
        category: 'plast',
        img: {
            url: 'assets/product-images/Product-StrumbAndDumb.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 7,
        name: 'Pickasso',
        amount: 0, 
        price: 26, 
        rating: 2, 
        category: 'trä',
        img: {
            url: 'assets/product-images/Product-Pickasso.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 8,
        name: 'Pluck Norris',
        amount: 0, 
        price: 20, 
        rating: 5, 
        category: 'plast',
        img: {
            url: 'assets/product-images/Product-PluckNorris.jpg',
            widht: 1024,
            height: 1024, 
        },
    },
    {
        id: 9,
        name: 'Strumdog Millionaire',
        amount: 0, 
        price: 34, 
        rating: 1, 
        category: 'metall',
        img: {
            url: 'assets/product-images/Product-StrumdogMillionaire.jpg',
            widht: 1024,
            height: 1024, 
        },
    }
];

//Hämtar specifik UL tagg från HTML
const productListUl = document.querySelector('#product-list')


// funktionen ansvarar för att visa betyg på produkterna, börjar med att skapa en tom strän 
function getRatingHtml(rating) {
    let html = '';
    for (let i = 0; i < rating; i++){
        html += `<span>🎵</span>`
    }
    return html;
}

function printProductList() {
    productListUl.innerHTML = '';
    //Bygger ihop produkternas behållare där de hämtar värden från objekten i arrayen och gör en funktion av det för att printa ut/uppdatera sidan på nytt
    products.forEach(product => {
        productListUl.innerHTML += `
        <li class="product-container">
            <h3>${product.name}</h3>
            <img class="product-img" src="${product.img.url}">
            <p>${product.price} kr/st</p>
            <p>betyg:${getRatingHtml(product.rating)}</p>
            <label>
                <button class="decrease" id="decrease-${product.id}">-</button>
                <input type="number" min="0" value="${product.amount}"id="input-${product.id}">
                <button class="increase" id="increase-${product.id}">+</button>
            </label>
        </li>
        `;
    });
    //skapar variablar för alla minus och plus knappar 
    //Alla knappar behöver ett clickevent och en funktion för att något ska ske
    const increaseButtons = document.querySelectorAll('.increase'); 
    increaseButtons.forEach(button => {
    addEventListener('click', increaseProductCount)
    });

            // Lägger till eventlyssnare för "decrease"-knappar
    const decreaseButtons = document.querySelectorAll('.decrease');
    decreaseButtons.forEach(button => {
    button.addEventListener('click', decreaseProductCount);
    });

};

printProductList ();



function increaseProductCount(event) {
    const productId = (event.target.id.replace('increase-', '')); //byter ut strängarna 
    console.log('clicked on button with id', productId);

    //letar rätt på produkten i arrayen som har id 
    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer
    console.log('found product at index:', foundProductIndex);

    if (foundProductIndex === -1) {
        console.error('Produkten existerar inte');
        return;
    }

    products[foundProductIndex].amount += 1;

    console.log(products[foundProductIndex]);

    //väljer ut inputen via dess Id och tar det värdet från arrayens amount.
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;
}

function decreaseProductCount(event) {
    const productId = (event.target.id.replace('decrease-', '')); //byter ut strängarna i när man trycker på knappen mot '' 
    console.log('clicked on button with id', productId);

    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer
    console.log('found product at index:', foundProductIndex);

    if (products[foundProductIndex].amount > 0) {
        products[foundProductIndex].amount -= 1;
    } else {
        console.log('mängden är redan 0');
    }

    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;
}

