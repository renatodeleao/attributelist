AttributeList.js

Manipulate HTML attributes with a classList like API.


### Why
Write about how cumberstone is to manually 
`Element.getAttribute('attrname')`, modify it as string, keep a copy to check if the value that your adding already exists, taking care of spaces and other characters and finally `Element.setAttribute('attrnam', 'modifiedCopy')` takes more effort than it should.

Also I'm a fan of `<body data-js-scope="menu-is-open">` kind of stuff and prefer to leave classes to styling.


### Setup
1. Clone
1. `npm install`
1. `npm start`


### Usage

As a wrapper (loadash, jqueryLike)

```HTML
<div class="my-element" data-caliban-lives="oops hipster-- monster" />
```

```javascript
import {$attributeList} from 'attributelist';
// make it globally available under your favourite alias.
window.$al = $attributeList;

/*
 * @function $al(el)
 * @param {HTMLElement|String} el 
 * @returns an object with each attribute than can be accessed as .dataset
*/
$al('.myElement')
// returns {calibanLives: attributeListInstance}

/*
 * Add
 */
$al('.myElement').calibanLives.add('shakespeare')
// <div class="my-element" data-caliban-lives="oops hipster-- monster shakepsear" />

/*
 * Remove
 */
$al('.myElement').calibanLives.remove('oops')
// <div class="my-element" data-caliban-lives="hipster-- monster shakespear" />

/*
 * Toggle
 */
$al('.myElement').calibanLives.toggle('monster')
// <div class="my-element" data-caliban-lives="hipster-- shakespear" />
```

### Dangerous, use at your own risk
You can also extend native `Element` prototype, if you're felling #savage


```HTML
<div class="my-element" data-caliban-lives="attributelist is not" />
```

```javascript
import {$dangerouslyExtendElementPrototypeWithAttributeList} from 'attributelist';

// you know is dangerous with name like this
dangerouslyExtendElementPrototypeWithAttributeList();

var x = document.querySelector('.my-element');

x.attributeList.calibanLives.add("awesome")
x.attributeList.calibanLives.remove("not")
x.attributeList.calibanLives.toggle("😎")
// <div class="my-element" data-caliban-lives="attribute is awesome 😎" />

```


### Play With
A demo is running on port `8080`, open your console and an `$al()` wrapper function is available globally to test

### Thanks to open-source

[Parcel.js](https://parceljs.org/) — Unless you've been living under a rock, you probably have heard about the coolest thing that happen to javaScript bundling.

[Lea Verou](http://lea.verou.me/2015/04/idea-extending-native-dom-prototypes-without-collisions/) For defying conventions and give me insparation to give a first try on the dangerous path of extending native prototypes. I still don't understand this programming nerdery as i'm not the smartest type of human beeing, but maybe someone in the wild will help me one day.
