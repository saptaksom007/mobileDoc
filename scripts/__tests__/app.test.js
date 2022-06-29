import appDev from '../../app.json'
import appBuild from '../environments/app.sample.json'

it('Expo sdkVersion should be the same between local dev and build', () => {
  expect(appDev.expo.sdkVersion).toBe(appBuild.expo.sdkVersion)
})

it('googleServicesFile should be defiled', () => {
  expect(appDev.expo.android.googleServicesFile).toBeDefined()
})
