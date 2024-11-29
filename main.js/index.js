//import av product array
import products from "../products.mjs";

//Hämtar specifik UL tagg från HTML
const productListUl = document.querySelector('#product-list');
const productCart = document.querySelector('#cart');
const cartBtn = document.querySelector('#shopping-cart-button');
console.log(cartBtn);

///Variablar för datum////
const today = new Date();
const isFriday = today.getDay() === 5; 
const isMonday = today.getDay() === 1;
const currentHour = today.getHours();

let priceIncreased = addedWeekendPrice();

const shippingDate = today.getDate();
console.log(shippingDate);

if (today.getDay() === 4 ) { /////////////testar att det är korrekt
    console.log("idag är det torsdag");
} else {
    console.log('idag är det inte torsdag');
}

function addedWeekendPrice() {
    if ((isFriday && currentHour >= 15) || (isMonday && currentHour <= 3)) { // if-satsen förklarar att om variabel Isfriday(fredag) och klockan är mer eller lika med 15:00 ELLLER(||) variabel isMonday(måndag) och klockan är mindre än 03:00 så---> 
        console.log("Nu är det helg");
        return 1.15
    }
    return 1;
} 

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
    //console.log('clicked on button with id', productId);
    //letar rätt på produkten i arrayen som har id 
    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer
    //console.log('found product at index:', foundProductIndex);


    products[foundProductIndex].amount += 1;

    if (products[foundProductIndex].amount >= 10) {//produkten med specifik indexs mängd är likamed eller överstiger 10
        products[foundProductIndex].price * 0.9;
        console.log('Rabatten aktiverad');
    }


    //väljer ut inputen via dess Id och tar det värdet från arrayens amount.
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;

    printCartProduct();

}

function decreaseProductCount(event) {
    //console.log("click on decrease");
    const productId = (event.target.id.replace('decrease-', '')); //byter ut strängarna i när man trycker på knappen mot '' 

    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer

    // En if sats som förklarar att om värdet i inputen är större än 0 så ska värdet minskas med -1
    if (products[foundProductIndex].amount > 0) {
        products[foundProductIndex].amount -= 1;
    } else { // Om värdet i inputen inte är större än noll ska detta visas alert med antalet är 0
        alert("Antal är redan 0")
    }
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;

    printCartProduct();

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Funktion som visar alla produkter på hemsidan////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function printProductList() {


    productListUl.innerHTML = '';

    //Bygger ihop produkternas behållare där de hämtar värden från objekten i arrayen och gör en funktion av det för att printa ut/uppdatera sidan på nytt
    //Math.round för att runda upp priet vid helgpåslag
    products.forEach(product => {
        productListUl.innerHTML += `
        <li class="product-container">
            <h3>${product.name}</h3>
            <img class="product-img" src="${product.img.url}">
            <p>${product.category}</p>
            <p>${Math.round(product.price * priceIncreased)} kr/st</p> 
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


    let sum = 0; // Totalsumman startar på 0 
    let shipping = 25; //Fraktkostnad 25kr
    let mondaySaleMessage = ''; 
    let reservedProductsAmount = 0;

    productCart.innerHTML = '';
    products.forEach(product => {
        reservedProductsAmount += product.amount 
        
        if (product.amount > 0) { ///om mängden är större än 0 då ska----> 
            sum += product.amount * product.price; // totalsumman vara mängden * priset
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
                    <p>${Math.round(product.price * priceIncreased)} kr/st</p>
                <label>
                    <button class="increase" id="increase-${product.id}">▲</button>
                    <span>${product.amount}</span>
                    <button class="decrease" id="decrease-${product.id}">▼</button>
                </label>
                <p>${Math.round(product.amount * product.price * priceIncreased)} kr</p>  
            </li>
            `;

            cartBtn.classList.add('button-animate');

            // Ta bort klassen efter animationen är klar
            setTimeout(() => {
                cartBtn.classList.remove('button-animate');
            }, 1000); // Samma tid som animationens varaktighet
        } 
        });

        //if-sats för måndagsrabatten
        if (today.getDay() === 1 && today.getHours() <= 10){ // Om dagens datum är (måndag och klockan är mindre eller = 10 så ska.......////////////GLÖM INTE ÄNDRA TILL 1 = MÅNDAG /////////
            sum *= 0.9;
            mondaySaleMessage += 'Måndagsrabatt: 10% på hela beställningen'
        } 
        
    
        let shippingPrice = shipping + (sum * 0.1); ////tar 10procent av summan och adderar till fraktkostnad   

        if (reservedProductsAmount > 15) {
            shippingPrice = 0;
        } 

        ///////Summeringen av alla produkter/////////////// ta bort onward ifall jag inte ska ha något bruk för den
        if (reservedProductsAmount > 0) {
            productCart.innerHTML += `
            <li class="cart-summary">
                <div>
                    <label>Rabattkod:
                        <input>
                    </label>
                </div>
                <section>
                    <ul>
                        <li class="cart-summary-message">${mondaySaleMessage}</li>
                        <li class="cart-summary-message">Fraktpris: + ${Math.round(shippingPrice)} kr</li>
                    </ul>
                    <h3>Totalsumma: ${Math.round(sum + shippingPrice)} kr</h3>
                    <button class="onward">Gå vidare med beställning</button>  
                </section>
            </li>`
        } else {
            productCart.innerHTML = 'Din varukorg är tömd';
        }

        const increaseButtons = document.querySelectorAll('button.increase'); 
        increaseButtons.forEach(button => {
        button.addEventListener('click', increaseProductCount)
        });
    
        const decreaseButtons = document.querySelectorAll('button.decrease');
        decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseProductCount);
        });

        // Aktiverar funktionen som summan är 800kr eller mer
        if (sum + shippingPrice > 800) {
            disableInvoice();
            alert('Faktura som betalmetod är tyvärr inte längre möjlig');
        } 
}
 

/*
**funktionen låser fältet för personnummer och lämnar ett meddelande till användaren
*/
function disableInvoice() {
    personalID.disabled = true;
    invoiceOption.innerHTML +=`<p>Tyvärr kan vi inte erbjuda faktura som <br>  
    betalningsalternativ för belopp på 800 kr eller mer.</p>`;
}



///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Filter///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



const btnPrice = document.querySelector('#sort-price');
const btnName = document.querySelector('#sort-name');
const btnRating = document.querySelector('#sort-rating');
const btnCategory = document.querySelector('#sort-category');
btnPrice.addEventListener('click', sortOnPrice);
btnName.addEventListener('click', sortOnName);
btnRating.addEventListener('click', sortOnRating);
btnCategory.addEventListener('click', sortOnCategory);


function sortOnPrice() {
    // Sorterar produkterna i stigande ordning baserat på pris
    products.sort((a, b) => a.price - b.price);
    console.log("Pris är valt");

    // Uppdaterar produktlistan med den sorterade listan
    printProductList();
}

function sortOnName() { //funktion fungerar inte se vidare
    products.sort((a, b) => a.name.localeCompare (b.name));
    console.log ("Namn är vald");
    printProductList();
}

function sortOnRating() {
    products.sort((b, a) => a.rating - b.rating);
    console.log ("Betyg är vald");
    printProductList();
}

function sortOnCategory() {
    products.sort((a, b) => a.category.localeCompare (b.category));
    console.log ("Kategori är vald");
    printProductList();
}




////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////formulär/////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Faktura eller Kort/////////////////////////////////////

const paymentRadios = Array.from(document.querySelectorAll('input[name="payment-option"]'));

const inputs = [
    document.querySelector('#first-name'),
    document.querySelector('#last-name'),
    document.querySelector('#adress'),
    document.querySelector('#post-number'),
    document.querySelector('#post-county'),
    document.querySelector('#port-code'),
    document.querySelector('#phone-number'),
    document.querySelector('#email-adress'),
    document.querySelector('#card-number'),
    document.querySelector('#card-year'),
    document.querySelector('#card-month'),
    document.querySelector('#card-cvc'),
    document.querySelector('#personal-id'),
    document.querySelector('#consent-checkbox')
];

const personalID = inputs[12];
personalID.disabled = false;

//Vardera container för invoice och card
const invoiceOption = document.querySelector('#invoice-id'); 
const cardOption = document.querySelector('#card-id'); 

let selectedPaymentoption = 'card'; ///card är vald som default bland de två radiobuttons

const orderBtn = document.querySelector('#order-button'); //beställningsknappen
const cancelBtn = document.querySelector('#cancel-button'); //Avbryt beställningsknapp

orderBtn.addEventListener('click', acceptOrder);
cancelBtn.addEventListener('click', cancelOrder);

// RegEx variablar
const postNumberRegEx = new RegExp(/^\d{3}\s?\d{2}$/);
const phoneNumberRegEx = new RegExp(/^((\+46\s?7)|07)[02369]\s?\d{4}\s?\d{3}$/);
const emailAdressRegEx = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
const personalIdRegEx = new RegExp(/^(19|20)?(\d{6}([-+]|\s)\d{4}|(?!19|20)\d{10})$/); // regex för svenska personnummer
const cardNumberRegEx = new RegExp(/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/);


// Alla inputs behöver event listeners
inputs.forEach(input => {
    input.addEventListener('focusout', activateOrderBtn);
    input.addEventListener('change', activateOrderBtn);
});


/*
**funktionen togglar de båda knapparna och även hittar deras respektive värde
*/
paymentRadios.forEach(radioBtn => {
    radioBtn.addEventListener('change', switchPaymentMethod); 
});

function switchPaymentMethod(e) {
    invoiceOption.classList.toggle('hidden');
    cardOption.classList.toggle('hidden');

    selectedPaymentoption = e.target.value;
    console.log(selectedPaymentoption);
};

/*
** Funktionen returnerar jämförelsen av regEx och inputens värde
*/

function validatePersonalId () {
   return personalIdRegEx.exec(personalID.value);
}

/*
** Funktionen kollar stegvis igenom att nödvändiga inputfält är ifyllda korrekt innan den aktiverar beställningsknappen
*/
function activateOrderBtn() { 

    orderBtn.setAttribute('disabled', '');

    if (!inputs[0].value.trim()) {
        console.warn('First name is mandatory')
        return;
    }
    if (!inputs[1].value.trim()) {
        console.warn('Last name is mandatory')
        return;
    }
    if (!inputs[2].value.trim())  {
        console.warn('We need an adress for the delivery')
        return;
    }
    if (postNumberRegEx.exec(inputs[3].value) === null) {
        console.warn('Postnumber doesnt exist')
        return;
    }
    if (!inputs[4].value.trim()) {
        console.warn('Dont forget to fill in county')
        return;
    }
    if (phoneNumberRegEx.exec(inputs[6].value) === null) {
        console.warn('Phonenumber not valid')
        return;
    }
    if (emailAdressRegEx.exec(inputs[7].value) === null) {
        console.warn('Email is not valid');
        return;
    }
    if (selectedPaymentoption === 'invoice' && !validatePersonalId()) {
        console.warn('Personnummer är inkorrekt');
        return;
    }
    
    if (selectedPaymentoption === 'card') {
        if (cardNumberRegEx.exec(inputs[8].value) === null) {
            console.warn('kortnummer är inte giltligt!');
            return;
        }

        let yearInput = Number(inputs[9].value);
        const shortYear = Number(String(today.getFullYear()).substring(2));
        if (yearInput > shortYear + 5 || yearInput < shortYear){
            console.warn('Card years is not valid');
            return;
        }

        let monthInput = Number(inputs[10].value.padStart(2, '0'));
        if (monthInput > 12 || monthInput <= 0 ) {
            console.warn('month is not valid');
            return;
        }

        if (yearInput === shortYear && monthInput < today.getMonth() + 1) {
            console.warn('Your card has expired');
            return;
        }
        if (inputs[11].value.length !== 3) {
            console.warn('CVC is not correct');
            return;
        }    
    }
    if (!inputs[13].checked) {
        console.warn('You must approve the processing of your personal data.');
        return;
    }
    
    orderBtn.removeAttribute('disabled');
    tooSlow();
}

// funktion med en timer och en utlösande funktion
function tooSlow() {
    setTimeout(canceledByTimeout, 1000 * 15 * 60);
}

function acceptOrder() {
    alert(`Din order är mottagen och hanteras.
    Vi återkommer med leveransdatum inom kort.`);
}

//specif funktion för beställningsknappen som rensar allt och ger ett meddelande
function canceledByTimeout () {
    products.forEach(product => { 
    product.amount = 0;
    });
        
    inputs.forEach(input => {
    input.value = '';
    });
            
    inputs[13].checked = false;
        
    printProductList();
    printCartProduct();
    alert('Du var för långsam!')
}

//funktion för att avbryta order
function cancelOrder() {
    products.forEach(product => { 
    product.amount = 0;
    });

    inputs.forEach(input => {
    input.value = '';
    });
    
    inputs[13].checked = false;

    printProductList();
    printCartProduct();
}