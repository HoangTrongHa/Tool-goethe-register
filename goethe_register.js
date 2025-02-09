const { chromium } = require('playwright');
const users = [
    {
        email: 'goethe3@mailinator.com',
        password: 'Hapro321',
        firstName: 'Vu',
        lastName: 'Phuong Anh',
        day: '22',
        month: '3',
        year: '1993',
        postalCode: '10000',
        location: 'Hà Nội',
        street: 'Hồ Tùng Mậu',
        houseNo: '3',
        phone: '0838584663',
        placeOfBirth: 'Nam Định'
    },
    {
        email: 'goethe4@mailinator.com',
        password: 'Hapro321',
        firstName: 'Vu',
        lastName: 'Phuong Anh',
        day: '22',
        month: '3',
        year: '1993',
        postalCode: '10000',
        location: 'Hà Nội',
        street: 'Hồ Tùng Mậu',
        houseNo: '3',
        phone: '0838584663',
        placeOfBirth: 'Nam Định'
    },
    // Add more user objects here
];

async function launchBrowser() {
    return await chromium.launch({ 
        headless: false,
        channel: 'chrome',
    });
}

async function navigateToPage(page, url) {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    console.log('✅ Page is fully loaded!');
}

async function acceptCookies(page) {
    const acceptButton = page.locator('[data-testid="uc-accept-all-button"]');
    if (await acceptButton.count() > 0) {
        console.log('Button found! Clicking now...', acceptButton);
        await acceptButton.click();
    } else {
        console.log('Button not found.');
    }
}

async function findApplicationElement(page) {
    return await page.locator('.masterContainer .inhaltsContainer .row div .examfinder-c .row .application');
}

async function clickBtnGruen(applicationElement) {
    const btnGruenElements = await applicationElement.locator('.btnGruen').all();
    if (btnGruenElements.length > 0) {
        console.log(`🟢 Found ${btnGruenElements.length} btnGruen buttons.`);
        await btnGruenElements[0].scrollIntoViewIfNeeded();
        await btnGruenElements[0].waitFor({ state: 'visible' });
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('⏳ Clicking btnGruen button and waiting for page to load...');
        await Promise.all([
            btnGruenElements[0].click(),
            applicationElement.page().waitForNavigation('networkidle')
        ]);
        console.log('✅ Page fully loaded! Now finding the "Continue" button.');
    }
}

async function findAndClickContinueButton(page, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const continueButton = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__top div.cs-checkout__top-right div.cs-checkout__buttons-wrapper button.cs-button.cs-button--arrow_next');
        const continueButtonCount = await continueButton.count();
        
        if (continueButtonCount > 0) {
            console.log(`🟢 Found ${continueButtonCount} continue buttons.`);
            await continueButton.scrollIntoViewIfNeeded();
            await continueButton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('⏳ Clicking continue button and waiting for page to load...');
            await Promise.all([
                continueButton.click(),
                page.waitForNavigation({ waitUntil: 'networkidle' })
            ]);
            console.log('✅ Page fully loaded! Now proceeding to the next step.');
            return; // Exit the function if successful
        } else {
            console.log(`Attempt ${attempt} failed: Continue button not found.`);
            if (attempt < retries) {
                console.log('Retrying...');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
            } else {
                console.log('All attempts failed: Continue button not found.');
            }
        }
    }
}

async function findAndClickBookForMyself(page, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const bookForMyselfButton = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__content div.cs-checkout__content div.cs-layer button.cs-button:has-text("Book for myself")');
        const bookForMyselfButtonCount = await bookForMyselfButton.count();
        
        if (bookForMyselfButtonCount > 0) {
            console.log(`🟢 Found ${bookForMyselfButtonCount} book for myself buttons.`);
            await bookForMyselfButton.scrollIntoViewIfNeeded();
            await bookForMyselfButton.waitFor({ state: 'visible' });
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('⏳ Clicking book for myself button and waiting for page to load...');
            await Promise.all([
                bookForMyselfButton.click(),
                page.waitForNavigation({ waitUntil: 'networkidle' })
            ]);
            console.log('✅ Page fully loaded! Now proceeding to the next step.');
            return; // Exit the function if successful
        } else {
            console.log(`Attempt ${attempt} failed: Book for myself button not found.`);
            if (attempt < retries) {
                console.log('Retrying...');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
            } else {
                console.log('All attempts failed: Book for myself button not found.');
            }
        }
    }
}

async function login(page, username, password, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const loginFormContainer = await page.locator('div#login-form');
        if (await loginFormContainer.count() > 0) {
            console.log("Login form container found.");
            const usernameInput = await loginFormContainer.locator('input#username');
            if (await usernameInput.count() > 0) {
                await usernameInput.fill(username);
                console.log("Username entered.");
            } else {
                console.log("Username input not found.");
            }
            const passwordInput = await loginFormContainer.locator('input#password');
            if (await passwordInput.count() > 0) {
                await passwordInput.fill(password);
                console.log("Password entered.");
            } else {
                console.log("Password input not found.");
            }
            const submitButton = await loginFormContainer.locator('input[type="submit"][name="submit"]');
            if (await submitButton.count() > 0) {
                console.log(`🟢 Found ${await submitButton.count()} submit buttons.`);
                await submitButton.scrollIntoViewIfNeeded();
                await submitButton.waitFor({ state: 'visible' });
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('⏳ Clicking submit button and waiting for page to load...');
                await Promise.all([
                    submitButton.click(),
                    page.waitForNavigation({ waitUntil: 'networkidle' })
                ]);
                console.log("✅ Login button clicked and page fully loaded.");
                return; // Exit the function if successful
            } else {
                console.log("Login button not found.");
            }
        } else {
            console.log("Login form container not found.");
        }
        if (attempt < retries) {
            console.log(`Attempt ${attempt} failed. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
        } else {
            console.log('All attempts failed: Login form not found or login button not found.');
        }
    }
}

async function fillBookingForm(page, firstName, lastName, day, month, year) {
    const formContainer = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__content form.cs-form');
    if (await formContainer.count() > 0) {
        console.log("Form container found.");
        // Fill in First Name
        await fillInputField(formContainer, 'accountPanel:basicData:body:firstName:inputContainer:input', firstName);
        
        // Fill in Last Name
        await fillInputField(formContainer, 'accountPanel:basicData:body:lastName:inputContainer:input', lastName);

        // Fill in Date of Birth - Day
        await selectDropdownOption(formContainer, "Day", day, day);

        // Fill in Date of Birth - Month
        await selectDropdownOption(formContainer, "Month", month, convertMonthToText(month));
        
        // Fill in Date of Birth - Year
        await selectDropdownOption(formContainer, "Year", year - 1925, year);

        // Fill in Email (if needed)

        // Submit the form (if required)
        const continueButton = await page.locator('div.cs-checkout__inner div.cs-checkout__top button.cs-button.cs-button--arrow_next:has-text("continue")');        
        if (await continueButton.count() > 0) {
            await Promise.all([
                continueButton.click(),
                await page.waitForLoadState('domcontentloaded')
            ]);
            console.log("Form submitted.");
        } else {
            console.log("Submit button not found.");
        }
    } else {
        console.log("Form container not found.");
    }
}

async function fillPersonalForm(page, postalCode, location, stress, houseNo, phone, placeOfBBirth) {
    const formContainer = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__content form.cs-form');
    if (await formContainer.count() > 0) {
        console.log("Form container found.", formContainer);
        
       // Fill in Postal Code
       await fillInputField(formContainer, 'accountPanel:furtherData:body:postalCode:inputContainer:input', postalCode);

       // Fill in Location
       await fillInputField(formContainer, 'accountPanel:furtherData:body:city:inputContainer:input', location);
       
       // Fill in Location
       await fillInputField(formContainer, 'accountPanel:furtherData:body:street:inputContainer:input', stress);
       
       // Fill in Location
       await fillInputField(formContainer, 'accountPanel:furtherData:body:street:inputContainer:input', stress);
       
       // Fill in Location
       await fillInputField(formContainer, 'accountPanel:furtherData:body:houseNo:inputContainer:input', houseNo);
       
       // Fill in Location
       await fillInputField(formContainer, 'accountPanel:furtherData:body:mobilePhone:input2Container:input2', phone);
       await selectDropdownOption(formContainer, "Why are you taking the exam?", '1', convertMotivationText('1'));

       // Fill in Location
       await fillInputField(formContainer, 'accountPanel:furtherData:body:birthplace:inputContainer:input', placeOfBBirth);
        
       const checkboxInput = await formContainer.locator('input[name="accountPanel:moreInfo:newsletter:checkboxContainer:input"]');
        if (await checkboxInput.count() > 0) {
            // checkboxInput.click();
            const checkboxLabel = await checkboxInput.locator('..');
            if (await checkboxLabel.count() > 0) {
                await checkboxLabel.click();
                console.log("Checkbox label clicked.");
            } else {
                console.log("Checkbox label not found.");
            }
        } else {
            console.log("Checkbox input not found.");
        }
        // Submit the form (if required)
        const continueButton = await page.locator('div.cs-checkout__inner div.cs-checkout__top button.cs-button.cs-button--arrow_next:has-text("continue")');        
        if (await continueButton.count() > 0) {
            await Promise.all([
                continueButton.click(),
                page.waitForNavigation({ waitUntil: 'networkidle' })
            ]);
            console.log("Form submitted.");
        } else {
            console.log("Submit button not found.");
        }
    } else {
        console.log("Form container not found.");
    }
}

async function fillInputField(formContainer, fieldName, value) {
    const inputField = await formContainer.locator(`input[name="${fieldName}"]`);
    await inputField.waitFor({ state: 'visible' });
    if (await inputField.count() > 0) {
        await inputField.fill(value);
        console.log(`${fieldName} entered.`);
    } else {
        console.log(`${fieldName} input not found.`);
    }
}
// Hàm chuyển đổi số tháng sang chữ
function convertMonthToText(month) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "";
}

function convertMotivationText(value) {
    const mapping = {
        "0": "Why are you taking the exam?",
        "1": "Subsequent immigration of spouse",
        "2": "not specified"
    };
    
    if (mapping.hasOwnProperty(value)) {
        return mapping[value]; // Trả về giá trị đã map
    } else {
        console.error(`❌ Không tìm thấy mapping cho giá trị: ${value}`);
        return ""; // Tránh trả về undefined gây lỗi
    }
}

async function selectDropdownOption(formContainer, title, index, text) {
    const button = await formContainer.locator(`button.cs-html-select__trigger[title="${title}"]`);
    if (await button.count() > 0) {
        await button.click();
        console.log(`${title} dropdown opened.`);
        
        let option;
        switch (title) {
            case "Year":
                option = await formContainer.locator(`ul.cs-html-select__menu-list li.cs-html-select__menu-item:has-text("${text}")`);
                break;
            case "Why are you taking the exam?":
                option = await formContainer.locator(`ul.cs-html-select__menu-list li.cs-html-select__menu-item[data-original-index="${index}"]:has-text("${text}")`);
                console.log("option", option);
                break;
            default:
                option = await formContainer.locator(`ul.cs-html-select__menu-list li.cs-html-select__menu-item[data-original-index="${index}"]:has-text("${text}")`);
                break;
        }
        
        const optionCount = await option.count();
        if (optionCount > 0) {
            console.log(`🟢 Found ${optionCount} ${title} options.`);
            await option.click();
            console.log(`${title} selected.`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Add delay after click
        } else {
            console.log(`${title} option not found.`);
        }
    } else {
        console.log(`${title} dropdown button not found.`);
    }
}

async function promotionalCode(page) {
    // Submit the form (if required)
    const continueButton = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__top-right button.cs-button.cs-button--arrow_next:has-text("continue")');
    await continueButton.waitFor({ state: 'visible' });
    // console.log(1);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (await continueButton.count() > 0) {
        await Promise.all([
            continueButton.click(),
            page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);
        console.log("Form submitted.");
    } else {
        console.log("Submit button not found.");
    }
 }

async function orderSubjectToCharge(page) {
    // Submit the form (if required)
    const continueButton = await page.locator('main.cs-checkout div.cs-checkout__bottom button.cs-button.cs-button--arrow_next:has-text("Order, subject to charge")');
    await continueButton.waitFor({ state: 'visible' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (await continueButton.count() > 0) {
        await Promise.all([
            continueButton.click(),
            page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);
        console.log("Form submitted.");
    } else {
        console.log("Submit button not found.");
    }
 }

(async () => {
    await Promise.all(users.map(async (user) => { 
        const browser = await launchBrowser();
        const page = await browser.newPage();
        await navigateToPage(page, 'https://www.goethe.de/ins/vn/en/sta/hcm/prf/gzsd1.cfm');
        await acceptCookies(page);
        const applicationElement = await findApplicationElement(page);
        if (await applicationElement.count() > 0) {
            await clickBtnGruen(applicationElement);
            await findAndClickContinueButton(page);
            await findAndClickBookForMyself(page);
            await login(page, user.email, user.password);
            await fillBookingForm(page, user.firstName, user.lastName, user.day, user.month, user.year);
            await fillPersonalForm(page, user.postalCode, user.location, user.street, user.houseNo, user.phone, user.placeOfBirth);
            await promotionalCode(page);
            await promotionalCode(page);
            await orderSubjectToCharge(page);
        } else {
            console.log('Element with class "application" not found');
        }
    }));
})();
