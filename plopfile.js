module.exports = function(plop) {
  plop.addHelper('upperCase', text => text.toUpperCase())

  plop.setGenerator('screen', {
    description: 'Generate a screen',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is screen or feature name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'name is required'
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/screens/{{properCase name}}/{{properCase name}}.actions.ts',
        templateFile: 'templates/screens/Feature.actions.txt',
        abortOnFail: true,
      },
      {
        type: 'add',
        path:
          'src/screens/{{properCase name}}/{{properCase name}}.component.tsx',
        templateFile: 'templates/screens/Feature.component.txt',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: 'src/screens/{{properCase name}}/{{properCase name}}.reducer.ts',
        templateFile: 'templates/screens/Feature.reducer.txt',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: 'src/screens/{{properCase name}}/{{properCase name}}.sagas.ts',
        templateFile: 'templates/screens/Feature.sagas.txt',
        abortOnFail: true,
      },
      {
        type: 'add',
        path:
          'src/screens/{{properCase name}}/__tests__/{{properCase name}}.component.test.tsx',
        templateFile: 'templates/screens/__tests__/Feature.component.test.txt',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'src/config/redux/sagas.ts',
        pattern: /(\/\/ PREPEND SAGAS IMPORT HERE)/gi,
        template:
          "import {{properCase name}}Sagas from 'screens/{{properCase name}}/{{properCase name}}.sagas'\n$1",
      },
      {
        type: 'modify',
        path: 'src/config/redux/sagas.ts',
        pattern: /(\/\/ PREPEND SAGAS HERE)/gi,
        template: '...{{properCase name}}Sagas,\n    $1',
      },
      {
        type: 'modify',
        path: 'src/config/redux/reducers.ts',
        pattern: /(\/\/ PREPEND REDUCER IMPORT HERE)/gi,
        template:
          "import {{properCase name}}Reducer from 'screens/{{properCase name}}/{{properCase name}}.reducer'\n$1",
      },
      {
        type: 'modify',
        path: 'src/config/redux/reducers.ts',
        pattern: /(\/\/ PREPEND REDUCER HERE)/gi,
        template: '{{lowerCase name}}: {{properCase name}}Reducer,\n  $1',
      },
      {
        type: 'modify',
        path: 'src/navigation/Router.ts',
        pattern: /(\/\/ PREPEND SCREEN IMPORT HERE)/gi,
        template:
          "import {{properCase name}}Screen from 'screens/{{properCase name}}/{{properCase name}}.component'\n$1",
      },
      {
        type: 'modify',
        path: 'src/navigation/Router.ts',
        pattern: /(\/\/ PREPEND SCREEN HERE)/gi,
        template:
          '{{lowerCase name}}: { screen: {{properCase name}}Screen },\n  $1',
      },
    ],
  })

  plop.setGenerator('component', {
    description: 'Generate a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the component name? (ie. CustomText, ...)',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'name is required'
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path:
          'src/components/{{properCase name}}/{{properCase name}}.component.tsx',
        templateFile: 'templates/components/Component.component.txt',
        abortOnFail: true,
      },
      {
        type: 'add',
        path:
          'src/components/{{properCase name}}/{{properCase name}}.styles.ts',
        templateFile: 'templates/components/Component.styles.txt',
        abortOnFail: true,
      },
      {
        type: 'add',
        path:
          'src/components/{{properCase name}}/__tests__/{{properCase name}}.component.test.tsx',
        templateFile:
          'templates/components/__tests__/Component.component.test.txt',
        abortOnFail: true,
      },
    ],
  })

  plop.setGenerator('hoc', {
    description: 'Generate hight order component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message:
          'What is hight order component name? (ie, withInit, withSomething)',
        validate(value) {
          if (/.+/.test(value)) {
            return true
          }
          return 'name is required'
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/screens/enhancers/{{name}}.tsx',
        templateFile: 'templates/hightOrderComponent.txt',
        abortOnFail: true,
      },
    ],
  })
}
