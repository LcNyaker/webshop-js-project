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
const productListUl = document.querySelector('#product-list');

const productCart = document.querySelector('#cart');

// funktionen ansvarar för att visa betyg på produkterna, börjar med att skapa en tom strän 
function getRatingHtml(rating) {
    let html = '';
    for (let i = 0; i < rating; i++){ 
        html += `<span>🎵</span>`
    }
    return html;
}

function increaseProductCount(event) {
    const productId = (event.target.id.replace('increase-', '')); //byter ut strängarna 
    console.log('clicked on button with id', productId);

    //letar rätt på produkten i arrayen som har id 
    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer
    console.log('found product at index:', foundProductIndex);

    products[foundProductIndex].amount += 1;

    console.log(products[foundProductIndex]);

    //väljer ut inputen via dess Id och tar det värdet från arrayens amount.
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;

    printCartProduct();

}

function decreaseProductCount(event) {
    console.log("click on decrease");
    const productId = (event.target.id.replace('decrease-', '')); //byter ut strängarna i när man trycker på knappen mot '' 

    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer

    // En if sats som förklarar att om värdetr i inputen är större än 0 så ska värdet minskas med -1
    if (products[foundProductIndex].amount > 0) {
        products[foundProductIndex].amount -= 1;
    } else { // Om värdet i inputen inte är större än noll ska detta visas alert med antalet är 0
        alert("Antal är redan 0")
    }
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;

    printCartProduct();

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
    const increaseButtons = document.querySelectorAll('button.increase'); 
    increaseButtons.forEach(button => {
    button.addEventListener('click', increaseProductCount)
    });

            // Lägger till eventlyssnare för "decrease"-knappar
    const decreaseButtons = document.querySelectorAll('button.decrease');
    decreaseButtons.forEach(button => {
    button.addEventListener('click', decreaseProductCount);
    });
    
    
};
//printar/uppdaterar listan med alla produkter på nytt
printProductList ();



//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Varukorgssammanställning////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


function printCartProduct() {
    productCart.innerHTML = '';
    products.forEach(product => {
        if (product.amount> 0) {
            productCart.innerHTML += `
            <li class="added-product-header">
            <p>Produkt</p>
            <p>Styckpris</p>
            <p>Antal valda</p>
            <p>Delsumman</p>
            </li>
            <li class="added-product"
                <figure>
                    <img class="added-product-img" src="${product.img.url}">
                </figure>
                <div>
                    <p>${product.name}</p>
                </div>
                    <p>${product.price} kr/st</p>
                <label>
                    <button class="increase" id="increase-${product.id}">▲</button>
                    <span>${product.amount}</span>
                    <button class="decrease" id="decrease-${product.id}">▼</button>
                </label>
                <p>${product.amount * product.price} kr</p>
            </li>
            `;
            }
        });


        const increaseButtons = document.querySelectorAll('button.increase'); 
        increaseButtons.forEach(button => {
        button.addEventListener('click', increaseProductCount)
        });
    
                // Lägger till eventlyssnare för "decrease"-knappar
        const decreaseButtons = document.querySelectorAll('button.decrease');
        console.log(decreaseButtons);
        decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseProductCount);
        });
}











///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Filter///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



const btnPrice = document.querySelector('#sort-price');

const btnName = document.querySelector('#sort-name');

const btnRating = document.querySelector('#sort-rating');

const btnCategory = document.querySelector('#sort-category');

btnPrice.addEventListener('click', sortOnPrice);

function sortOnPrice() {
    console.log ("Pris är vald");
}

btnName.addEventListener('click', sortOnName);

function sortOnName() {
    console.log ("Namn är vald");
}

btnRating.addEventListener('click', sortOnRating);
function sortOnRating() {
    console.log ("Betyg är vald");
}

btnCategory.addEventListener('click', sortOnCategory);
function sortOnCategory() {
    console.log ("Kategori är vald");
}
