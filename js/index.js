//import av product array
import products from "./products.mjs";

// Hämtar specifik UL tagg från HTML
const header = document.querySelector('#header');
const productListUl = document.querySelector('#product-list');
const productCart = document.querySelector('#cart');
const cartBtn = document.querySelector('#shopping-cart-button');
const cartCounter = document.querySelector('#shopping-cart-counter');

// Variablar för datum
const today = new Date();
const shippingDate = new Date(today); 
const showCaseDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
// Global variabel för pris
let globalFinalSum = 0;

// Global variabel för valda produkter
let reservedProductsAmount = 0;

// Variabel för prishöjning för helg
let priceIncreased = addedWeekendPrice();

// Variabel för att aktivera/avaktivera faktura
let invoiceDisable = false;

// Variabel för prissäkning - mängdrabatt
let amountDiscount = false

// Filter knappar
const btnPrice = document.querySelector('#sort-price');
const btnName = document.querySelector('#sort-name');
const btnRating = document.querySelector('#sort-rating');
const btnCategory = document.querySelector('#sort-category');


// RegEx variablar
const postNumberRegEx = new RegExp(/^\d{3}\s?\d{2}$/);
const phoneNumberRegEx = new RegExp(/^((\+46\s?7)|07)[02369]\s?\d{4}\s?\d{3}$/);
const emailAdressRegEx = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
const personalIdRegEx = new RegExp(/^(19|20)?(\d{6}([-+]|\s)\d{4}|(?!19|20)\d{10})$/); // regex för svenska personnummer
const cardNumberRegEx = new RegExp(/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/);


// Variablar för alla inputsfält gällande kontaktuppgifter
const lastPage = document.querySelector('.contact-details')
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const adressInput = document.querySelector('#adress');
const postNumberInput = document.querySelector('#post-number');
const postCountyInput = document.querySelector('#post-county');
const phoneNumberInput = document.querySelector('#phone-number');
const emailAdressInput = document.querySelector('#email-adress');
const cardNumberInput = document.querySelector('#card-number');
const cardYearInput = document.querySelector('#card-year');
const cardMonthInput = document.querySelector('#card-month');
const cardCvcInput = document.querySelector('#card-cvc');
const consentCheckbox = document.querySelector('#consent-checkbox');
const newsletterCheckbox = document.querySelector('#newsletter-checkbox');
const personalID = document.querySelector('#personal-id');

// Ovanstående variablar lagda i en array
const inputs = [
    firstNameInput,
    lastNameInput,
    adressInput,
    postNumberInput,
    postCountyInput,
    phoneNumberInput,
    emailAdressInput,
    cardNumberInput,
    cardYearInput,
    cardMonthInput,
    cardCvcInput,
    consentCheckbox,
    personalID
];

// Variablar för alla felmeddelande gällande kontaktuppgifter 
const errorMsgFirstName = document.querySelector('#error-message-first-name');
const errorMsgLastName = document.querySelector('#error-message-last-name');
const errorMsgAdress = document.querySelector('#error-message-adress');
const errorMsgPostNumber = document.querySelector('#error-message-post-number');
const errorMsgPostCounty = document.querySelector('#error-message-post-county');
const errorMsgPhoneNumber = document.querySelector('#error-message-phone-number');
const errorMsgEmailAdress = document.querySelector('#error-message-email-adress');
const errorMsgPersonalID = document.querySelector('#error-message-personal-id')

/////////////////////////////////Faktura eller Kort/////////////////////////////////////
const paymentRadios = Array.from(document.querySelectorAll('input[name="payment-option"]'));

// Vardera container för invoice och card
const invoiceOption = document.querySelector('#invoice-id'); 
const cardOption = document.querySelector('#card-id'); 

//card är vald som default bland de två radiobuttons
let selectedPaymentoption = 'card'; 

// Variabel för meddelande om faktura
const errorMessage = document.createElement('p');
errorMessage.id = 'error-invoice';
errorMessage.innerHTML = 'Tyvärr kan vi inte erbjuda faktura som <br> betalningsalternativ för belopp på 800 kr eller mer.';

// Knappar längst ner på sidan för att beställa ordern och avbryta beställning
const orderBtn = document.querySelector('#order-button'); //beställningsknappen
const cancelBtn = document.querySelector('#cancel-button'); //Avbryt beställningsknapp


function addedWeekendPrice() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    if (day === 5 && hour >= 15) { //Kontrollerar om det är fredag och mer än kl 15
        return 1.15;
    }

    if (day === 6) { //Kontrollerar om det är lördag
        return 1.15;
    }
    if (day === 0) { // Kontrollerar om det är söndag
        return 1.15;
    }
    if (day === 1 && hour < 3) { // Kollar om det är måndag
        return 1.15;
    }

    // om det inte uppfyller ovanstående påståenden så returneras gånger 1 för priset på produkten
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
    //letar rätt på produkten i arrayen som har id 
    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer
    
    products[foundProductIndex].amount += 1;

    if (products[foundProductIndex].amount >= 10) {//produkten med specifik indexs mängd är likamed eller överstiger 10
        products[foundProductIndex].discountedPrice = products[foundProductIndex].price * 0.9; // Spara rabatterat pris
        amountDiscount = true;
        console.log('Rabatten aktiverad');
        console.log(amountDiscount);
    } else {
        products[foundProductIndex].discountedPrice = products[foundProductIndex].price; // Återställ pris om mängden är mindre än 10
    }

    cartBtn.style.position = 'fixed';
    cartCounter.style.position = 'absolute'

    //väljer ut inputen via dess Id och tar det värdet från arrayens amount.
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;
    printCartProduct();
    printProductList();

}

function decreaseProductCount(event) {
    const productId = (event.target.id.replace('decrease-', '')); //byter ut strängarna i när man trycker på knappen mot '' 

    const foundProductIndex = products.findIndex(product => product.id == productId); //Eftersom den letar product.id är ett nummer och productId är en sträng så tillämpas = =, för att använda === måste strängen göras om till ett nummer

    // En if sats som förklarar att om värdet i inputen är större än 0 så ska värdet minskas med -1
    if (products[foundProductIndex].amount > 0) {
        products[foundProductIndex].amount -= 1;
    } else { // Om värdet i inputen inte är större än noll ska detta visas alert med antalet är 0
        alert("Antal är redan 0")
    }

    if (products[foundProductIndex].amount < 10) {
        products[foundProductIndex].discountedPrice = products[foundProductIndex].price;
        console.log('rabatten är avaktiverad')
        amountDiscount = false;
    }
    document.querySelector(`#input-${productId}`).value = products[foundProductIndex].amount;

    printCartProduct();
    printProductList();

}
function updateProductAmountFromInput(e) {
    const productId = Number(e.target.id.replace('input-', ''));
    console.log(e.target.value)

    const foundProductIndex = products.findIndex(product => product.id == productId);

    if (e.key === "Enter") { // Kontrollera om användaren tryckt Enter
        const newAmount = Number(e.target.value); // Hämta det nya värdet från input-fältet

        if (isNaN(newAmount) || newAmount < 0) {
            alert("Vänligen ange ett giltigt antal."); // Hantera ogiltiga värden
            e.target.value = products[foundProductIndex].amount; // Återställ till tidigare värde
            return;
        } else { 
            cartBtn.style.position = 'fixed';
            cartCounter.style.position = 'absolute'
        }

        // Uppdatera produktens mängd
        products[foundProductIndex].amount = newAmount;

        // Kontrollera om rabatt ska aktiveras eller avaktiveras
        if (newAmount >= 10) {
            products[foundProductIndex].discountedPrice = products[foundProductIndex].price * 0.9;
            console.log('Rabatten aktiverad');
            amountDiscount = true;
        } else {
            products[foundProductIndex].discountedPrice = products[foundProductIndex].price;
            console.log('Rabatten avaktiverad');
            amountDiscount = false;
        }

        // Uppdatera gränssnittet
        printCartProduct();
        printProductList();
    }

}  

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Funktion som visar alla produkter på hemsidan////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function printProductList() {


    productListUl.innerHTML = '';

    //Bygger ihop produkternas behållare där de hämtar värden från objekten i arrayen och gör en funktion av det för att printa ut/uppdatera sidan på nytt
    //Math.round för att runda upp priet vid helgpåslag
    products.forEach(product => {
        const displayedPrice = product.discountedPrice || product.price; // Använd rabatterat pris om det finns
        productListUl.innerHTML += `
        <li class="product-container">
            <h3>${product.name}</h3>
            <img class="product-img" src="${product.img.url}" alt="${product.img.alt}" loading="lazy">
            <p>${product.category}</p>
            <p>${Math.round(displayedPrice * priceIncreased)} kr/st</p> 
            <p aria-description="Betyg ${product.rating} utav 5 möjliga" >betyg:${getRatingHtml(product.rating)}</p>
            <label>
                <button class="decrease" id="decrease-${product.id}" aria-label="Ta bort en vara av ${product.name}">-</button>
                <input class="amount" type="number" min="0" value="${product.amount}"id="input-${product.id}" aria-label="Skriv eller justera värdet för ${product.name}">
                <button class="increase" id="increase-${product.id}" aria-label="Lägg till en vara av ${product.name}">+</button>
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
    
    const productAmountInputs = document.querySelectorAll('input.amount');
    productAmountInputs.forEach(input => {

        input.addEventListener('change', updateProductAmountFromInput);
        input.addEventListener('keypress', updateProductAmountFromInput);
    });
};


//printar/uppdaterar listan med alla produkter på nytt
printProductList ();

//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Varukorgssammanställning////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


function printCartProduct() {

    const today = new Date();
    let sum = 0; // Totalsumman startar på 0 
    let shipping = 25; //Fraktkostnad 25kr
    let mondaySaleMessage = ''; 
    let discountMessage = ''; 
    reservedProductsAmount = 0;

    productCart.innerHTML = `
            <li class="added-product-header">
                <p>Produkt</p>
                <p>Styckpris</p>
                <p>Antal valda</p>
                <p>Delsumman</p>
            </li>`;

    products.forEach(product => {
        reservedProductsAmount += product.amount 
        
        if (product.amount > 0) { ///om mängden är större än 0 då ska----> 
            const displayedPrice = product.discountedPrice || product.price;
            sum += product.amount * displayedPrice; // totalsumman vara mängden * priset
            productCart.innerHTML += `
            <li class="added-product"
                <figure>
                    <img class="added-product-img" src="${product.img.url}" alt="${product.img.alt}" loading="lazy" >
                </figure>
                <div>
                    <p>${product.name}</p>
                </div>
                <p>${Math.round(displayedPrice * priceIncreased)} kr/st</p>
                <label>
                    <button class="increase" id="increase-${product.id}">▲</button>
                    <span>${product.amount}</span>
                    <button class="decrease" id="decrease-${product.id}">▼</button>
                </label>
                <p>${Math.round(product.amount * displayedPrice * priceIncreased)} kr</p>  
            </li>
            `;

            cartBtn.classList.add('button-animate');
            cartCounter.innerHTML = `${reservedProductsAmount}`;
            cartCounter.classList.remove('hidden');

            // Ta bort klassen efter animationen är klar
            setTimeout(() => {
                cartBtn.classList.remove('button-animate');
            }, 1000); // Samma tid som animationens varaktighet
        } 
        });

        //if-sats för måndagsrabatten
        if (today.getDay() === 1 && today.getHours() <= 10){ // Om dagens datum är (måndag och klockan är mindre eller = 10 så ska.......////////////GLÖM INTE ÄNDRA TILL 1 = MÅNDAG /////////
            sum *= 0.9;
            mondaySaleMessage += '🎉 Måndagsrabatt: 10% på hela beställningen'
        } 
        
        if (amountDiscount === true) {
            discountMessage += '🎉 Mängdrabatt: 10% rabatt vid köp av 10 samma produkter.'
        }
    
        let shippingPrice = shipping + (sum * 0.1); ////tar 10procent av summan och adderar till fraktkostnad   
        
        if (reservedProductsAmount > 15) {
            shippingPrice = 0;
        } 

        let finalSum = Math.round(sum + shippingPrice)

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
                        <li class="cart-summary-message">${discountMessage}</li>
                        <li class="cart-summary-message">${mondaySaleMessage}</li>
                        <li class="cart-summary-message"> 🛻 Fraktpris: + ${Math.round(shippingPrice)} kr</li>
                    </ul>
                    <h3>Totalsumma: ${finalSum} kr</h3>
                    <button class="onward" href="#contact-details-id" aria-label="Gå vidare till kontaktuppgifter">Gå vidare</button>  
                </section>
            </li>`
        } else {
            productCart.innerHTML = 'Din varukorg är tömd';
            cartBtn.style.position = 'static';
            cartCounter.classList.add('hidden');
            lastPage.classList.add('hidden'); //håller sista delen av sidan hidden.
        }

        const increaseButtons = document.querySelectorAll('button.increase'); 
        increaseButtons.forEach(button => {
        button.addEventListener('click', increaseProductCount)
        });
    
        const decreaseButtons = document.querySelectorAll('button.decrease');
        decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseProductCount);
        });
        console.log(finalSum);
        // Aktiverar funktionen som summan är 800kr eller mer
        if (finalSum > 800) {
            disableInvoice();
            alert('Faktura som betalmetod är tyvärr inte längre möjlig.');
        } else {
            enableInvoice();
        }
        
        if (sum + shippingPrice > 25) {
        const onward = document.querySelector('.onward');
        onward.addEventListener('click', showLastPage);
        }

        globalFinalSum = finalSum;

        return `${finalSum}`
}


function showLastPage() {
    lastPage.classList.remove('hidden'); 
    lastPage.scrollIntoView({
        behavior: 'smooth' // Lägger till mjuk scrollning
      });  
    header.style.position = 'static';
    cartBtn.style.position = 'static';
    cartCounter.style.position = 'static'
    firstNameInput.focus();
    
}


/*
**funktionen låser fältet för personnummer och lämnar ett meddelande till användaren
*/
function disableInvoice() {
    if (invoiceDisable === false) {    
    personalID.disabled = true;
    invoiceOption.appendChild(errorMessage);
    invoiceOption.style.border = "2px solid red"
    invoiceDisable = true;      
    }    
}

/*
**funktionen låser upp fältet för personnummer åt användaren
*/
function enableInvoice() {
    personalID.removeAttribute('disabled');
    invoiceDisable = false;    
    invoiceOption.style.border = "0px";
    if (errorMessage) {
        errorMessage.remove();
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Filter///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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

function sortOnName() { 
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

orderBtn.addEventListener('click', acceptOrder);
cancelBtn.addEventListener('click', cancelOrder);

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

// för t12t så behöver man kunna fylla i eller ur checkboxar med enter
newsletterCheckbox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    newsletterCheckbox.checked = !newsletterCheckbox.checked;
    }
  });

consentCheckbox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    consentCheckbox.checked = !consentCheckbox.checked;
    }
  });


/*
** Funktionen för att visa upp eller gömma alternativ för faktura och kort
*/
function switchPaymentMethod(e) {
    invoiceOption.classList.toggle('hidden');
    cardOption.classList.toggle('hidden');

    selectedPaymentoption = e.target.value;
    console.log(selectedPaymentoption);
};
/*
** Funktionen returnerar jämförelsen av regEx och inputens värde
*/

function validatePersonalId() {
   return personalIdRegEx.exec(personalID.value);
}

/*
** Funktionen kollar stegvis igenom att nödvändiga inputfält är ifyllda korrekt innan den aktiverar beställningsknappen
*/
function activateOrderBtn() { 

    orderBtn.setAttribute('disabled', '');

    if (!firstNameInput.value.trim()) {
        console.warn('First name is mandatory')
        errorMsgFirstName.classList.remove('hidden');
        firstNameInput.style.borderColor = 'red';
        return;
    } else {errorMsgFirstName.classList.add('hidden');  
        firstNameInput.style.borderColor = 'black'; 
    }
    if (!lastNameInput.value.trim()) {
        console.warn('Last name is mandatory')
        errorMsgLastName.classList.remove('hidden');
        lastNameInput.style.borderColor = 'red';
        return;
    } else {errorMsgLastName.classList.add('hidden');
        lastNameInput.style.borderColor = 'black';    
    }
    if (!adressInput.value.trim())  {
        console.warn('We need an adress for the delivery')
        errorMsgAdress.classList.remove('hidden');
        adressInput.style.borderColor = 'red';
        return;
    } else {errorMsgAdress.classList.add('hidden');
        adressInput.style.borderColor = 'black';    
    }
    if (postNumberRegEx.exec(postNumberInput.value) === null) {
        console.warn('Postnumber doesnt exist')
        errorMsgPostNumber.classList.remove('hidden');
        postNumberInput.style.borderColor = 'red';  
        return;
    } else {errorMsgPostNumber.classList.add('hidden');
        postNumberInput.style.borderColor = 'black';    
    }
    if (!postCountyInput.value.trim()) {
        console.warn('Dont forget to fill in county')
        errorMsgPostCounty.classList.remove('hidden');
        postCountyInput.style.borderColor = 'red';  
        return;
    } else {errorMsgPostCounty.classList.add('hidden');
        postCountyInput.style.borderColor = 'black';      
    }
    if (phoneNumberRegEx.exec(phoneNumberInput.value) === null) {
        console.warn('Phonenumber not valid')
        errorMsgPhoneNumber.classList.remove('hidden');
        phoneNumberInput.style.borderColor = 'red';  
        return;
    } else {errorMsgPhoneNumber.classList.add('hidden');
        phoneNumberInput.style.borderColor = 'black';    
    }
    if (emailAdressRegEx.exec(emailAdressInput.value) === null) {
        console.warn('Email is not valid');
        errorMsgEmailAdress.classList.remove('hidden');
        emailAdressInput.style.borderColor = 'red';
        return;
    } else {errorMsgEmailAdress.classList.add('hidden'); 
        emailAdressInput.style.borderColor = 'black';   
    }
    if (selectedPaymentoption === 'invoice' && !validatePersonalId()) {
        console.warn('Personnummer är inkorrekt');
        errorMsgPersonalID.classList.remove('hidden');
        personalID.style.borderColor = 'red'; 
        return;
    } else {errorMsgPersonalID.classList.add('hidden');
        personalID.style.borderColor = 'black'; 
    }
    if (selectedPaymentoption === 'card') {
        if (cardNumberRegEx.exec(cardNumberInput) === null) {
            console.warn('kortnummer är inte giltligt!');
            return;
        }

        let yearInput = Number(cardYearInput.value);
        const shortYear = Number(String(today.getFullYear()).substring(2));

        if (yearInput > shortYear + 5 || yearInput < shortYear){
            console.warn('Card years is not valid');
            return;
        }

        let monthInput = Number(cardMonthInput.value.padStart(2, '0'));
        if (monthInput > 12 || monthInput <= 0 ) {
            console.warn('month is not valid');
            return;
        }

        if (yearInput === shortYear && monthInput < today.getMonth() + 1) {
            console.warn('Your card has expired');
            return;
        }
        if (cardCvcInput.value.length !== 3) {
            console.warn('CVC is not correct');
            return;
        }    
    }
    if (!consentCheckbox.checked) {
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

function shipping() { //Denna funktion räknar ut leveransdatum, genom att ta dagens veckodag, och addera ifall det är måndag eller tisdag för att utesluta leverans på helgen

    const today = new Date();

    if (today.getDay === 1) {
    shippingDate.setDate(today.getDate() + 7)
    }
    else if (today.getDay === 2) {
    shippingDate.setDate(today.getDate() + 6)
    } else {
        shippingDate.setDate(today.getDate() + 5)
    }
} 

shipping();

function acceptOrder() {
    alert(`Din order är mottagen och hanteras.
    
    Kvitto: 
    - Beställning gjordes: ${today.toLocaleDateString('sv-SE', showCaseDate)}.
    - Din beställning innehåller sammanlagt ${reservedProductsAmount} produkter.
    - Totalbeloppet på din beställning landade på ${globalFinalSum} kr. 
    - Förväntad leveranstid är ${shippingDate.toLocaleDateString('sv-SE', showCaseDate)}.
    
    Ha en underbar dag!

    Med vänliga hälsningar 
    Henkas Plektrumfabrik`)
}

//specif funktion för beställningsknappen som rensar allt och ger ett meddelande
function canceledByTimeout () {
    products.forEach(product => { 
    product.amount = 0;
    });
        
    inputs.forEach(input => {
    input.value = '';
    });
            
    consentCheckbox.checked = false;
        
    printProductList();
    printCartProduct();
    alert('Du var för långsam! din order avbryts.')
}

//funktion för att avbryta order
function cancelOrder() {
    products.forEach(product => { 
    product.amount = 0;
    });

    inputs.forEach(input => {
    input.value = '';
    });
    
    consentCheckbox.checked = false;

    alert('Du valde att avbryta din order.');

    printProductList();
    printCartProduct();
}

