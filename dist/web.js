(()=>{"use strict";var e,t={d:(e,r)=>{for(var s in r)t.o(r,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:r[s]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},r={};t.r(r),t.d(r,{Any:()=>l,Content:()=>p,Form:()=>s,Max:()=>u,Min:()=>i,OneMore:()=>c,Optional:()=>o,Quantitier:()=>e,Repeat:()=>n,ZeroMore:()=>a,ZeroOne:()=>o});class s extends Array{constructor(...e){Array.isArray(e[0])&&1===e.length&&(e=e[0]),super(),super.push(...e)}parse(e){if("string"!=typeof e)throw new TypeError("Content is not string");const t=new p;for(let r of this){if("string"==typeof r)r=new RegExp(`^${r}`);else{if(!(r instanceof RegExp))throw new TypeError("Wrong form expression included");{const e=String(r).match(/^\/(.*)\/(\w*)$/);r=new RegExp(`^${e[1]}`)}}const s=e.match(r)[0];t.push(s),e=e.slice(s.length)}return t}static new(e,...t){const r=[];for(let s=0;s<e.raw.length;s++)r.push(e.raw[s]),s in t&&r.push(t[s]);return new this(r)}}!function(e){e[e.GREEDY=0]="GREEDY",e[e.LAZY=1]="LAZY"}(e||(e={}));class n{constructor(e,t,r,s){this.content=e,this.min=t||0,this.max=r||t,this.quantitier=s}}class o extends n{constructor(e,t){super(e,0,1,t)}}class c extends n{constructor(e,t){super(e,1,1/0,t)}}class a extends n{constructor(e,t){super(e,0,1/0,t)}}class i extends n{constructor(e,t,r){super(e,t,1/0,r)}}class u extends n{constructor(e,t,r){super(e,0,t,r)}}class l extends Set{constructor(...e){try{super(1===e.length&&e[0][Symbol.iterator]?e[0]:e)}catch(t){if(t instanceof TypeError&&"Constructor Set requires 'new'"===t.message)return Reflect.construct(Set,[1===e.length&&e[0][Symbol.iterator]?e[0]:e],new.target)}}}class p extends Array{constructor(...e){super(),Array.isArray(e[0])&&1===e.length&&e[0],super.push(...e)}toString(){return this.join("")}static form(...e){var t;return(t=class extends(this){}).format=e[0].raw?s.new(...e):new s(...e),t}}window.parsorama=r})();
//# sourceMappingURL=web.js.map