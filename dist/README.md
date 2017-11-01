# skyux-template-library

### Template for SKY UX component libraries

## Getting Started
- Add modules to **/src/app/public/src/modules**. (There is a sample module already created for you.) It is good practice to prefix every module, component, and provider you create. In this case, `Library` serves as the prefix. You can use a different prefix, as long as it is consistent (for example, `StacheModule`).
- Each module you create will need to be exported by the "Library" module, located here: **/src/app/public/src/library.module.ts**. You should see the `LibrarySampleModule` listed in the exports.
- In the **/src/app/public/src/modules/shared** folder, you will find a `LibraryConfigService`. This is a provider that will allow your modules to access the contents of **skyuxconfig.json**. You can add your module's configuration to the `appSettings.myLibrary` section of the config.

For a live example of a SKY UX component library, check out the [`StacheModule` source code](https://github.com/blackbaud/stache2).

## Install dependencies and view the example

```
npm install
npm start
```

## Bundle your library:

```
npm run build
```

## Test your library:

```
npm test
```

## Deploying to npmjs.org (or an internal NPM stream):

- Update the `name` property in **package.json** to the name of your registered module.
- Publish the contents of the bundled **dist** folder.
