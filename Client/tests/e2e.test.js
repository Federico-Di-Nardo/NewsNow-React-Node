import puppeteer from "puppeteer";

jest.setTimeout(120000)
const serverWaitTime = 2500;

let browser, page;
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 30
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
});

test('Page with navbar loads correctly', async () => {
  const navbarItem = (await page.$('.navbarItem')) ? true : false;
  expect(navbarItem).toBe(true);
});

const loginSelector = "nav div:nth-child(3) h3"
const usernameSelector = "form:not(.hidden) input[type=text]"
const passwordSelector = "form:not(.hidden) input[type=password]"
const buttonSelector = ".actions button"
const loginErrorSelector = ".modal-error"
test('Incorrect log in with user "federico"', async () => {

  await page.click(loginSelector);
  await page.click(usernameSelector);
  await page.keyboard.type("federico");
  await page.click(passwordSelector);
  await page.keyboard.type("incorretpassword");
  await page.click(buttonSelector);
  await page.waitForTimeout(serverWaitTime)
  const error = await page.$eval(loginErrorSelector, el => el.textContent)
  expect(error).toBe('Invalid user/password');
});

test('Log in with user "federico"', async () => {
  await page.click(passwordSelector);
  const passwordValue = await page.$eval(passwordSelector, el => el.value);
  for (let i = 0; i < passwordValue.length; i++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type("federico");
  await page.click(buttonSelector);
  await page.waitForTimeout(serverWaitTime)
  const loggedUser = await page.$eval(loginSelector, el => el.textContent);
  expect(loggedUser).toBe('federico');
});

const firstArticleSelector = ".infinite-scroll-component ul li:first-child img"
const firstArticleTitleSelector = ".infinite-scroll-component ul li:first-child h5"
const detailArticleTitleSelector = "section>div>div>h2"
test('Open article and check its title', async () => {
  const title = await page.$eval(firstArticleTitleSelector, el => el.textContent);
  await page.click(firstArticleSelector);
  await page.waitForTimeout(serverWaitTime)
  const detailTitle = await page.$eval(detailArticleTitleSelector, el => el.textContent);
  expect(detailTitle).toBe(title);
})

const topHeadlinesButtonSelector = "nav div:nth-child(2) a:first-child" 
const savedNewsSelector = "nav div:nth-child(2) a:nth-child(2)" 
const saveFirstArticleSelector = ".infinite-scroll-component ul li:first-child i"
test('Save article and open it', async() => {
  await page.click(topHeadlinesButtonSelector);
  await page.waitForTimeout(serverWaitTime);
  const savedTitle = await page.$eval(firstArticleTitleSelector, el => el.textContent);
  await page.click(saveFirstArticleSelector);
  await page.waitForTimeout(serverWaitTime);
  await page.click(savedNewsSelector);
  await page.waitForTimeout(serverWaitTime);
  const savedSavedTitle = await page.$eval(firstArticleTitleSelector, el => el.textContent);
  expect(savedSavedTitle).toBe(savedTitle);
})

test('Unsave article', async() => {
  const savedTitle = await page.$eval(firstArticleTitleSelector, el => el.textContent);
  await page.click(saveFirstArticleSelector);
  await page.waitForTimeout(serverWaitTime);
  await page.click(savedNewsSelector);
  await page.waitForTimeout(serverWaitTime);
  const firstSavedTitle = await page.$eval(firstArticleTitleSelector, el => el.textContent);
  expect(firstSavedTitle).not.toBe(savedTitle)
})

const logoutSelector = "nav div:nth-child(3) p"
const errorSelector = "section>div>div>p"
test('Log out and check if user can see saved news', async () =>{
  await page.click(loginSelector)
  await page.waitForTimeout(500);
  await page.click(logoutSelector)
  await page.waitForTimeout(serverWaitTime);
  const error = await page.$eval(errorSelector, el => el.textContent);
  expect(error).toBe("You must be logged in to perform this action")
})

afterAll(async () => {
  await browser.close();
});