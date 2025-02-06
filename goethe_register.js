const { chromium } = require('playwright');

async function launchBrowser() {
    return await chromium.launch({ headless: false });
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

async function findAndClickContinueButton(page) {
    const continueButton = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__top div.cs-checkout__top-right div.cs-checkout__buttons-wrapper button.cs-button.cs-button--arrow_next');
    if (await continueButton.count() > 0) {
        console.log(`🟢 Found ${await continueButton.count()} continue buttons.`);
        await continueButton.scrollIntoViewIfNeeded();
        await continueButton.waitFor({ state: 'visible' });
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('⏳ Clicking continue button and waiting for page to load...');
        await Promise.all([
            continueButton.click(),
            page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);
        console.log('✅ Page fully loaded! Now proceeding to the next step.');
    }
}

async function findAndClickBookForMyself(page) {
    const bookForMyselfButton = await page.locator('button.cs-button.cs-layer__button.cs-layer__button--high#id13');
    if (await bookForMyselfButton.count() > 0) {
        console.log(`🟢 Found ${await bookForMyselfButton.count()} book for myself buttons.`);
        await bookForMyselfButton.scrollIntoViewIfNeeded();
        await bookForMyselfButton.waitFor({ state: 'visible' });
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('⏳ Clicking book for myself button and waiting for page to load...');
        await Promise.all([
            bookForMyselfButton.click(),
            page.waitForNavigation({ waitUntil: 'networkidle' })
        ]);
        console.log('✅ Page fully loaded! Now proceeding to the next step.');
    }
}

async function login(page, username, password) {
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
        } else {
            console.log("Login button not found.");
        }
    } else {
        console.log("Login form container not found.");
    }
}

async function fillBookingForm(page, firstName, lastName, day, month, year, email) {
    const formContainer = await page.locator('main.cs-checkout div.cs-checkout__inner div.cs-checkout__content form.cs-form');
    if (await formContainer.count() > 0) {
        console.log("Form container found.");
        
        // Fill in First Name
        const firstNameInput = await formContainer.locator('input[name="accountPanel:basicData:body:firstName:inputContainer:input"]');
        if (await firstNameInput.count() > 0) {
            await firstNameInput.fill(firstName);
            console.log("First name entered.");
        } else {
            console.log("First name input not found.");
        }
        
        // Fill in Last Name
        const lastNameInput = await formContainer.locator('input[name="accountPanel:basicData:body:lastName:inputContainer:input"]');
        if (await lastNameInput.count() > 0) {
            await lastNameInput.fill(lastName);
            console.log("Last name entered.");
        } else {
            console.log("Last name input not found.");
        }

        // Fill in Date of Birth - Day
        const dayButton = await formContainer.locator('button.cs-html-select__trigger[title="Day"]');
        if (await dayButton.count() > 0) {
            await dayButton.click();
            console.log("Day dropdown opened.");
        } else {
            console.log("Day dropdown button not found.");
        }
        
        // Tìm ngày trong dropdown
        const dayOption = await formContainer.locator(`li.cs-html-select__menu-item[data-original-index="${day}"]:has-text("${day}")`);
        if (await dayOption.count() > 0) {
            // Kiểm tra và click vào phần tử
            await dayOption.click();
            // console.log("Day selected.", dayOption.count());
        } else {
            console.log("Day option not found.");
        }
        
        // Fill in Date of Birth - Month
        const monthButton = await formContainer.locator('button.cs-html-select__trigger[title="Month"]');
        if (await monthButton.count() > 0) {
            await monthButton.click();
            console.log("Month dropdown opened.");
            
            // Tìm tháng trong dropdown
            const monthOption = await formContainer.locator(`ul.cs-html-select__menu-list li.cs-html-select__menu-item[data-original-index="${month}"]:has-text("${month}")`);
            const monthOptionCount = await monthOption.count();
            if (monthOptionCount > 0) {
                console.log(`🟢 Found ${monthOptionCount} month options.`);
                // Kiểm tra và click vào phần tử
                await monthOption.click();
                console.log("Month selected.", monthOption);
            } else {
                console.log("Month option not found.");
            }
        } else {
            console.log("Month dropdown button not found.");
        }

        // Fill in Date of Birth - Year
        const yearButton = await formContainer.locator('button.cs-html-select__trigger[title="Year"]');
        if (await yearButton.count() > 0) {
            await yearButton.click();
            console.log("Year dropdown opened.");
            
            // Tìm năm trong dropdown
            const yearOption = await formContainer.locator(`ul.cs-html-select__menu-list li.cs-html-select__menu-item[data-original-index="${year}"]:has-text("${year}")`);
            const yearOptionCount = await yearOption.count();
            if (yearOptionCount > 0) {
                console.log(`🟢 Found ${yearOptionCount} year options.`);
                // Kiểm tra và click vào phần tử
                await yearOption.click();
                console.log("Year selected.", yearOption);
            } else {
                console.log("Year option not found.");
            }
        } else {
            console.log("Year dropdown button not found.");
        }

        // // Fill in Email (if needed)
        // const emailInput = await formContainer.locator('input[name="accountPanel:basicData:body:email:inputContainer:input"]');
        // if (await emailInput.count() > 0) {
        //     await emailInput.fill(email);
        //     console.log("Email entered.");
        // } else {
        //     console.log("Email input not found.");
        // }

        // // Submit the form (if required)
        // const submitButton = await formContainer.locator('button.cs-button[type="button"]');
        // if (await submitButton.count() > 0) {
        //     await submitButton.scrollIntoViewIfNeeded();
        //     await submitButton.waitFor({ state: 'visible' });
        //     await submitButton.click();
        //     console.log("Form submitted.");
        // } else {
        //     console.log("Submit button not found.");
        // }
    } else {
        console.log("Form container not found.");
    }
}


(async () => {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await navigateToPage(page, 'https://www.goethe.de/ins/th/en/spr/prf/gzb1.cfm');
    await acceptCookies(page);
    const applicationElement = await findApplicationElement(page);
    if (await applicationElement.count() > 0) {
        await clickBtnGruen(applicationElement);
        await findAndClickContinueButton(page);
        await findAndClickBookForMyself(page);
        await login(page, 'anhphuongvu.de@gmail.com', 'Zia@1234');
        await fillBookingForm(page, 'Vu', 'Phuong Anh', '22', '3', '1993');
    } else {
        console.log('Element with class "application" not found');
    }
    // await browser.close();
})();