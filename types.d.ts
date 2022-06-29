declare module 'RCTNetworking' {
  const RCTNetworking: any
  export default RCTNetworking
}

// external libs

declare module 'ex-react-native-i18n' {
  export default class i18n {
    static t(text: string, interpolation?: any): string
    static currentLocale(): string
    static getFallbackLocale(): string
    static defaultLocale: string
    static fallbacks: boolean
    static translations: { [key: string]: NodeRequireFunction }
    static missingTranslation(): string
    static localShort(): string
    static locale: string
    static initAsync(): Promise<any>
  }
}

declare module '@expo/react-native-touchable-native-feedback-safe' {
  import { TouchableOpacity } from 'react-native'

  export default TouchableOpacity
}

declare module 'react-native-elements/src/helpers/normalizeText' {
  const normalize: (x: number) => number
  export default normalize
}

declare module 'react-native-parsed-text' {
  import ParsedText from 'react-native-parsed-text'

  export default ParsedText
}

declare module '@applications-developer/react-native-transformable-image' {
  import TransformableImage from '@applications-developer/react-native-transformable-image'

  export default TransformableImage
}

// Helpers
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type MakePropsOptional<
  OriginalProps,
  PropNames extends keyof OriginalProps
> = Omit<OriginalProps, PropNames> & Partial<Pick<OriginalProps, PropNames>>

declare function alert(text: string): void
declare const __JEST__: boolean
