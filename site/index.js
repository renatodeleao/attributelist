console.log("hello world");

import {AttributeList, $attributeList, dangerouslyExtendElementPrototype} from '../lib/index.js';
window.$al = $attributeList;


function toggleClass(){
  console.log('toggled');
}
// Select the node that will be observed for mutations
var targetNode = document.querySelector('.js-observe');

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type == 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
            toggleClass();
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);



