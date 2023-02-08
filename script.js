/* ---------------------------------------------------------------- */
/* ---------------------- IMPORTS AND SET UP ---------------------- */
/* ---------------------------------------------------------------- */
const {Builder, By, until, Key } = require ("selenium-webdriver");


/* ----- ARRAY OF LINKS OF HOUSES TO SEND THE BOOKING REQUEST ----- */

// build your own array of the house website links.
let pagesArray = [ ]

/* ------------------ CONTACT DETAILS TO BE SENT ------------------ */

const myName = 'My Name'
const myEmail = 'my_email@email.com'
const myPhone = '000 0000 0000'

/* --------------------- VARIABLE DECLARATIONS -------------------- */

let ref; 
let nameInput; 
let emailInput;
let phoneInput;
let messageInput;
let hasBookingBtn = false;
let msg;


/* -------- GENERATE REQUEST / MSG BASED ON OPTIONS ON PAGE ------- */

async function myMessage(reference, hasBookingBtn) {

    let withBookingOption = "Hi, my name is NAME, I'd like to request the blueprints of the " + reference + " property. Thanks you."
    let withoutBookingOption = "Hi, my name is Thiago, I'd like to request a viewing and the blueprints of the " + reference + " property. Thanks in advance."

    hasBookingBtn ? msg = withBookingOption : msg = withoutBookingOption;
    return msg
}


/* ---- MAIN FUNCTION - LOOP THROUGH ARRAY OF WEBPAGES(HOUSES) ---- */


async function start(){

    let driver = await new Builder().forBrowser("firefox").build();
    

    for (let i=0; i < pagesArray.length; i++) {

        await driver.switchTo().newWindow('tab'); 
        await driver.get(pagesArray[i]);
       
        ref = await driver.findElement(By.css('.h1-seo')).getText();
        console.log(ref);

        nameInput = await driver.findElement(By.id('name'));
        emailInput = await driver.findElement(By.id('email'));
        phoneInput = await driver.findElement(By.id('phone'));
        messageInput = await driver.findElement(By.css('.ember-text-area'));
        sendButton = await driver.findElement(By.xpath('/html/body/div[2]/div[6]/div/div[1]/div/form/div[2]/div/button'));
        

        // BECAUSE THE PAGE HAS LOTS OF JAVASCRIPTM SELENIUM FUNCTION TO RECOGNIZE A FULL PAGE LOADED DOES NOT WORK WELL. 
        // PLUS, THE BOOKING VIEWING BUTTON ONLY LOADS WHEN THE PAGE IS SCROLLED DOWN.
        // SO I DECIDED TO GIVE IT MY OWN SCROLLING AND WAITING TIME (5s) FOR THE BUTTON TO LOAD BASED ON OBSERVATION THE
        // WEBSITE LOADS ON MY INTERNET SPEED.

        await driver.manage().setTimeouts({implicit: 5000})
        await driver.actions()
            .scroll(0, 0, 100, 100)
            .perform();
        
        // TRY AND FIND BOOKING BUTTON AND SETTING UP FOR WHICH MESSAGE TO SEND

        try {
            hasBookingBtn = await driver.wait(until.findElement(By.xpath('/html/body/div[2]/main/div/div[1]/div[1]/div/a')), 10000);
            hasBookingBtn = true;
            console.log('Viewing Booking Available');

        } catch (error) {
            console.log('No "Book a Viewing" available');
            hasBookingBtn = false;
        }

        /* ----------------- CLEARING INPUTS JUST IN CASE ----------------- */

        nameInput.clear();
        emailInput.clear();
        phoneInput.clear();
        messageInput.clear();

    /* ------------------------ SENDING MESSAGE ----------------------- */

        nameInput.sendKeys(myName);
        emailInput.sendKeys(myEmail);
        phoneInput.sendKeys(myPhone);
        messageInput.sendKeys(await myMessage(ref, hasBookingBtn))

        sendButton.click()
        
    }
    
    await driver.quit()
}

start()

