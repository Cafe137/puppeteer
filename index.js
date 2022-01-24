const puppeteer = require('puppeteer')
const { Logger, System } = require('cafe-utility')

const logger = Logger.create('cafe-puppeteer')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} selector XPath selector
 */
async function waitForElementXPath(page, selector) {
    for (let i = 0; i < 10; i++) {
        logger.trace(selector)
        const [element] = await page.$x(selector)
        if (element) {
            return element
        }
        await System.sleepMillis(500)
    }
    return null
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} selector CSS selector
 */
async function waitForElementCss(page, selector) {
    for (let i = 0; i < 10; i++) {
        logger.trace(selector)
        const element = await page.$(selector)
        if (element) {
            return element
        }
        await System.sleepMillis(500)
    }
    return null
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 */
async function waitForEnabledStateXPath(page, elementType, text) {
    for (let i = 0; i < 10; i++) {
        const element = await waitForElementXPath(page, `//${elementType}[contains(., '${text}')][not(@disabled)]`)
        if (element) {
            return element
        }
        await System.sleepMillis(500)
    }
    return null
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 */
async function clickElementWithText(page, elementType, text) {
    const element = await waitForElementXPath(page, `//${elementType}[contains(., '${text}')]`)
    if (!element) {
        throw Error(`clickElementWithText: Could not find <${elementType}> containing "${text}"`)
    }
    if (element) {
        await element.click()
    }
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} cssClass CSS class with the dot, e.g. '.MuiSelect-select'
 */
async function clickElementWithClass(page, elementType, cssClass) {
    const element = await waitForElementCss(page, `${elementType}${cssClass}`)
    if (!element) {
        throw Error(`clickElementWithClass: Could not find <${elementType}> with class ${cssClass}`)
    }
    if (element) {
        await element.click()
    }
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 */
async function assertElementWithTextExists(page, elementType, text) {
    const element = await waitForElementXPath(page, `//${elementType}[contains(., '${text}')]`)
    if (!element) {
        throw Error(`assertElementWithTextExists: Could not find <${elementType}> containing "${text}"`)
    }
    return true
}

module.exports = {
    Assert: {
        elementWithTextExists: assertElementWithTextExists
    },
    Click: {
        elementWithText: clickElementWithText,
        elementWithClass: clickElementWithClass
    },
    Wait: {
        forElementCss: waitForElementCss,
        forElementXPath: waitForElementXPath,
        forEnabledStateXPath: waitForEnabledStateXPath
    }
}
