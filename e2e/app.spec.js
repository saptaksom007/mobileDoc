/* eslint-disable */
const { reloadApp } = require('detox-expo-helpers')
const locale = 'en'
const TIMEOUT = 120000

const elementToBeVisibleAsync = async el => {
  return await waitFor(element(by.id(el)))
    .toBeVisible()
    .withTimeout(TIMEOUT)
}

const getYes = () => (locale === 'de' ? 'Ja' : 'Yes')

describe('e2e', () => {
  beforeAll(async () => {
    await reloadApp({
      permissions: {
        notifications: 'YES',
        photos: 'YES',
        camera: 'YES',
        medialibrary: 'YES',
      },
    })
  })

  it('should_show_dashboard', async () => {
    await elementToBeVisibleAsync('dashboard')
    await elementToBeVisibleAsync('dashboard-nav-conversation')
    await elementToBeVisibleAsync('dashboard-nav-survey')
    await elementToBeVisibleAsync('dashboard-nav-appointment')
    await elementToBeVisibleAsync('dashboard-nav-dossier')
    await elementToBeVisibleAsync('dashboard-nav-availability')
  })

  it('should_type_a_message_in_chat_view', async () => {
    await elementToBeVisibleAsync('MessageMyDoctor')
    await element(by.id('MessageMyDoctor')).tap()
    await elementToBeVisibleAsync('composer')
    await element(by.id('composer')).tap()
    await element(by.id('composer')).typeText(
      'Insert text from e2e\nand return',
    )
    await elementToBeVisibleAsync('chat-send-button')
    await element(by.id('chat-send-button')).tap()
    await expect(element(by.id('add-a-photo'))).toBeVisible()
  })

  it('should_tap_on_notification_icon', async () => {
    await element(by.id('header-badge-notifications'))
      .atIndex(0)
      .tap()
    await elementToBeVisibleAsync('notifications-list')
    await expect(element(by.id('notifications-list'))).toBeVisible()
  })

  it('should_tap_on_book_appointment', async () => {
    await element(by.id('header-logo'))
      .atIndex(0)
      .tap()
    await elementToBeVisibleAsync('book-appointment')
    await element(by.id('book-appointment')).tap()

    await elementToBeVisibleAsync('input-request-appointment')
    await element(by.id('input-request-appointment')).tap()
    await element(by.id('input-request-appointment')).typeText(
      'Lorem Ipsum ist ein einfacher Demo-Text fur die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard\n',
    )
    await elementToBeVisibleAsync('request-appointment')
    await element(by.id('request-appointment')).tap()
  })

  it('should_tap_on_profile', async () => {
    await waitFor(element(by.id('header-avatar')).atIndex(0))
      .toBeVisible()
      .withTimeout(TIMEOUT)
    await element(by.id('header-avatar'))
      .atIndex(0)
      .tap()
    await elementToBeVisibleAsync('logout-button')
    await element(by.id('logout-button')).tap()
    const y = getYes()
    await waitFor(element(by.text(y)).atIndex(0))
      .toBeVisible()
      .withTimeout(TIMEOUT)
    await element(by.text(y)).tap()
  })
})
