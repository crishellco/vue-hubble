"use strict";const e=e=>{const t=((e,t,r)=>{const n=r=>String.prototype.split.call(t,r).filter(Boolean).reduce((e,t)=>null!=e?e[t]:e,e),o=n(/[,[\]]+?/)||n(/[,[\].]+?/);return void 0===o||o===e?r:o})(e.$options,["hubble"],{});return"string"==typeof t?t:t.namespace},t=(t,r)=>{if(!r)return"";const n=[r];let o=t.$hubble.enableDeepNamespacing,i=e(t);if(o){let r=t;do{const t=e(r);t&&n.push(t),r=r.$parent}while(r)}else n.push(i);return n.filter(e=>!!e).reverse().join("--")},r=(e,{arg:r,value:n,oldValue:o},{context:i})=>{if(!i.$hubble.environment.includes(process.env.NODE_ENV))return;const s=t(i,o),u=t(i,n);switch(r=r||i.$hubble.defaultSelectorType,s&&e.removeAttribute("v-hubble"),u&&e.setAttributeNode(e.ownerDocument.createAttribute("v-hubble")),r){case"class":s&&e.classList.remove(s),u&&e.classList.add(u);break;case"id":e.id=u;break;case"attr":s&&e.removeAttribute(s),u&&e.setAttributeNode(e.ownerDocument.createAttribute(u));break;default:console.warn(`${r} is not a valid selector type, using attr instead`),s&&e.removeAttribute(s),u&&e.setAttributeNode(e.ownerDocument.createAttribute(u))}};var n={bind:r,inserted:r,update:r};let o=!1;const i={defaultSelectorType:"attr",enableDeepNamespacing:!0,environment:"test"};function s(e,t={}){e.prototype.$hubble=Object.assign(i,t),e.prototype.$hubble.environment=[].concat(e.prototype.$hubble.environment),o||(e.directive("hubble",n),o=!0)}"undefined"!=typeof window&&window.Vue&&window.Vue.use(s),module.exports=s;
