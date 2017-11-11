### SKYUX 2 library JTags
**Requirements SKYUX 2**

![Build](https://travis-ci.org/JaminQuimby/jtags.svg?branch=master) [![codecov](https://codecov.io/gh/JaminQuimby/jtags/branch/master/graph/badge.svg)](https://codecov.io/gh/JaminQuimby/jtags)
## Getting Started

Install the library into your SKYUX 2 SPA:
```sh 
npm install skyux-lib-j-tags -save
```
Import the library module into your app-extras.module.ts file
```js 
 import { JTagInputModule } from 'skyux-lib-j-tags';
```
Add a j-tag-input onto a component template. 
```html 
 <j-tag-input [(ngModel)]="model.tags" [modelAsStrings]="true"></j-tag-input>
```
