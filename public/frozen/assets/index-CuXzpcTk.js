(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const $a="185",Fu=0,Dc=1,Ou=2,Ar=1,mh=2,gs=3,Zn=0,ke=1,Sn=2,bn=0,zi=1,Uc=2,Nc=3,Fc=4,Bu=5,ii=100,ku=101,zu=102,Gu=103,Hu=104,Vu=200,Wu=201,Xu=202,Zu=203,Wo=204,Xo=205,$u=206,Yu=207,qu=208,Ku=209,Ju=210,Qu=211,ju=212,tf=213,ef=214,Zo=0,$o=1,Yo=2,Wi=3,qo=4,Ko=5,Jo=6,Qo=7,gh=0,nf=1,sf=2,dn=0,_h=1,xh=2,vh=3,Ya=4,Mh=5,yh=6,Sh=7,Eh=300,ui=301,Xi=302,to=303,eo=304,Wr=306,An=1e3,En=1001,jo=1002,Ce=1003,rf=1004,Ws=1005,De=1006,no=1007,ai=1008,Xe=1009,bh=1010,wh=1011,Rs=1012,qa=1013,mn=1014,tn=1015,Tn=1016,Ka=1017,Ja=1018,Cs=1020,Ah=35902,Th=35899,Rh=1021,Ch=1022,en=1023,Rn=1026,ci=1027,Qa=1028,ja=1029,fi=1030,tc=1031,ec=1033,Tr=33776,Rr=33777,Cr=33778,Pr=33779,ta=35840,ea=35841,na=35842,ia=35843,sa=36196,ra=37492,oa=37496,aa=37488,ca=37489,Ur=37490,la=37491,ha=37808,ua=37809,fa=37810,da=37811,pa=37812,ma=37813,ga=37814,_a=37815,xa=37816,va=37817,Ma=37818,ya=37819,Sa=37820,Ea=37821,ba=36492,wa=36494,Aa=36495,Ta=36283,Ra=36284,Nr=36285,Ca=36286,of=3200,Pa=0,af=1,Gn="",Oe="srgb",Fr="srgb-linear",Or="linear",jt="srgb",xi=7680,Oc=519,cf=512,lf=513,hf=514,nc=515,uf=516,ff=517,ic=518,df=519,Bc=35044,Xs=35048,kc="300 es",fn=2e3,Ps=2001;function pf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Br(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function mf(){const i=Br("canvas");return i.style.display="block",i}const zc={};function Gc(...i){const t="THREE."+i.shift();console.log(t,...i)}function Ph(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ut(...i){i=Ph(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function qt(...i){i=Ph(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Gi(...i){const t=i.join(" ");t in zc||(zc[t]=!0,Ut(...i))}function gf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const _f={[Zo]:$o,[Yo]:Jo,[qo]:Qo,[Wi]:Ko,[$o]:Zo,[Jo]:Yo,[Qo]:qo,[Ko]:Wi};class pi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Hc=1234567;const Es=Math.PI/180,Is=180/Math.PI;function ji(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[i&255]+Ie[i>>8&255]+Ie[i>>16&255]+Ie[i>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function $t(i,t,e){return Math.max(t,Math.min(e,i))}function sc(i,t){return(i%t+t)%t}function xf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function vf(i,t,e){return i!==t?(e-i)/(t-i):0}function bs(i,t,e){return(1-e)*i+e*t}function Mf(i,t,e,n){return bs(i,t,1-Math.exp(-e*n))}function yf(i,t=1){return t-Math.abs(sc(i,t*2)-t)}function Sf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ef(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function bf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function wf(i,t){return i+Math.random()*(t-i)}function Af(i){return i*(.5-Math.random())}function Tf(i){i!==void 0&&(Hc=i);let t=Hc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Rf(i){return i*Es}function Cf(i){return i*Is}function Pf(i){return(i&i-1)===0&&i!==0}function If(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Df(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),p=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*p,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*p,a*l);break;case"ZYZ":i.set(c*p,c*d,a*h,a*l);break;default:Ut("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ne(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Zs={DEG2RAD:Es,RAD2DEG:Is,generateUUID:ji,clamp:$t,euclideanModulo:sc,mapLinear:xf,inverseLerp:vf,lerp:bs,damp:Mf,pingpong:yf,smoothstep:Sf,smootherstep:Ef,randInt:bf,randFloat:wf,randFloatSpread:Af,seededRandom:Tf,degToRad:Rf,radToDeg:Cf,isPowerOfTwo:Pf,ceilPowerOfTwo:If,floorPowerOfTwo:Lf,setQuaternionFromProperEuler:Df,normalize:Ne,denormalize:Bi};class kt{static{kt.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ts{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],d=r[o+1],p=r[o+2],x=r[o+3];if(u!==x||c!==f||l!==d||h!==p){let g=c*f+l*d+h*p+u*x;g<0&&(f=-f,d=-d,p=-p,x=-x,g=-g);let m=1-a;if(g<.9995){const _=Math.acos(g),y=Math.sin(_);m=Math.sin(m*_)/y,a=Math.sin(a*_)/y,c=c*m+f*a,l=l*m+d*a,h=h*m+p*a,u=u*m+x*a}else{c=c*m+f*a,l=l*m+d*a,h=h*m+p*a,u=u*m+x*a;const _=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=_,l*=_,h*=_,u*=_}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],p=r[o+3];return t[e]=a*p+h*u+c*d-l*f,t[e+1]=c*p+h*f+l*u-a*d,t[e+2]=l*p+h*d+a*f-c*u,t[e+3]=h*p-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),d=c(s/2),p=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*p,this._y=l*d*u-f*h*p,this._z=l*h*p+f*d*u,this._w=l*h*u-f*d*p;break;case"YXZ":this._x=f*h*u+l*d*p,this._y=l*d*u-f*h*p,this._z=l*h*p-f*d*u,this._w=l*h*u+f*d*p;break;case"ZXY":this._x=f*h*u-l*d*p,this._y=l*d*u+f*h*p,this._z=l*h*p+f*d*u,this._w=l*h*u-f*d*p;break;case"ZYX":this._x=f*h*u-l*d*p,this._y=l*d*u+f*h*p,this._z=l*h*p-f*d*u,this._w=l*h*u+f*d*p;break;case"YZX":this._x=f*h*u+l*d*p,this._y=l*d*u+f*h*p,this._z=l*h*p-f*d*u,this._w=l*h*u-f*d*p;break;case"XZY":this._x=f*h*u-l*d*p,this._y=l*d*u-f*h*p,this._z=l*h*p+f*d*u,this._w=l*h*u+f*d*p;break;default:Ut("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let c=1-e;if(a<.9995){const l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,e=Math.sin(e*l)/h,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+o*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{static{B.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Vc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Vc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return io.copy(this).projectOnVector(t),this.sub(io)}reflect(t){return this.sub(io.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const io=new B,Vc=new ts;class Bt{static{Bt.prototype.isMatrix3=!0}constructor(t,e,n,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],p=n[8],x=s[0],g=s[3],m=s[6],_=s[1],y=s[4],M=s[7],w=s[2],b=s[5],T=s[8];return r[0]=o*x+a*_+c*w,r[3]=o*g+a*y+c*b,r[6]=o*m+a*M+c*T,r[1]=l*x+h*_+u*w,r[4]=l*g+h*y+u*b,r[7]=l*m+h*M+u*T,r[2]=f*x+d*_+p*w,r[5]=f*g+d*y+p*b,r[8]=f*m+d*M+p*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,p=e*u+n*f+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=u*x,t[1]=(s*l-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=f*x,t[4]=(h*e-s*c)*x,t[5]=(s*r-a*e)*x,t[6]=d*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return Gi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(so.makeScale(t,e)),this}rotate(t){return Gi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(so.makeRotation(-t)),this}translate(t,e){return Gi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(so.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const so=new Bt,Wc=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xc=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uf(){const i={enabled:!0,workingColorSpace:Fr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===jt&&(s.r=wn(s.r),s.g=wn(s.g),s.b=wn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===jt&&(s.r=Hi(s.r),s.g=Hi(s.g),s.b=Hi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gn?Or:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Gi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Gi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Fr]:{primaries:t,whitePoint:n,transfer:Or,toXYZ:Wc,fromXYZ:Xc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Oe},outputColorSpaceConfig:{drawingBufferColorSpace:Oe}},[Oe]:{primaries:t,whitePoint:n,transfer:jt,toXYZ:Wc,fromXYZ:Xc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Oe}}}),i}const Yt=Uf();function wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Hi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let vi;class Nf{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{vi===void 0&&(vi=Br("canvas")),vi.width=t.width,vi.height=t.height;const s=vi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=vi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Br("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wn(e[n]/255)*255):e[n]=wn(e[n]);return{data:e,width:t.width,height:t.height}}else return Ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ff=0;class rc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ff++}),this.uuid=ji(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ro(s[o].image)):r.push(ro(s[o]))}else r=ro(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ro(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Nf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ut("Texture: Unable to serialize Texture."),{})}let Of=0;const oo=new B;class Ue extends pi{constructor(t=Ue.DEFAULT_IMAGE,e=Ue.DEFAULT_MAPPING,n=En,s=En,r=De,o=ai,a=en,c=Xe,l=Ue.DEFAULT_ANISOTROPY,h=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=ji(),this.name="",this.source=new rc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new kt(0,0),this.repeat=new kt(1,1),this.center=new kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(oo).x}get height(){return this.source.getSize(oo).y}get depth(){return this.source.getSize(oo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Ut(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Ut(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Eh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case An:t.x=t.x-Math.floor(t.x);break;case En:t.x=t.x<0?0:1;break;case jo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case An:t.y=t.y-Math.floor(t.y);break;case En:t.y=t.y<0?0:1;break;case jo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ue.DEFAULT_IMAGE=null;Ue.DEFAULT_MAPPING=Eh;Ue.DEFAULT_ANISOTROPY=1;class he{static{he.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],p=c[9],x=c[2],g=c[6],m=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(p+g)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,M=(d+1)/2,w=(m+1)/2,b=(h+f)/4,T=(u+x)/4,v=(p+g)/4;return y>M&&y>w?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=b/n,r=T/n):M>w?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=b/s,r=v/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=T/r,s=v/r),this.set(n,s,r,e),this}let _=Math.sqrt((g-p)*(g-p)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(g-p)/_,this.y=(u-x)/_,this.z=(f-h)/_,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this.w=$t(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this.w=$t(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bf extends pi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:De,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new he(0,0,t,e),this.scissorTest=!1,this.viewport=new he(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new Ue(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:De,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new rc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends Bf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Ih extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class kf extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class se{static{se.prototype.isMatrix4=!0}constructor(t,e,n,s,r,o,a,c,l,h,u,f,d,p,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,d,p,x,g)}set(t,e,n,s,r,o,a,c,l,h,u,f,d,p,x,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Mi.setFromMatrixColumn(t,0).length(),r=1/Mi.setFromMatrixColumn(t,1).length(),o=1/Mi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,d=o*u,p=a*h,x=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+p*l,e[5]=f-x*l,e[9]=-a*c,e[2]=x-f*l,e[6]=p+d*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,p=l*h,x=l*u;e[0]=f+x*a,e[4]=p*a-d,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-p,e[6]=x+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,p=l*h,x=l*u;e[0]=f-x*a,e[4]=-o*u,e[8]=p+d*a,e[1]=d+p*a,e[5]=o*h,e[9]=x-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,d=o*u,p=a*h,x=a*u;e[0]=c*h,e[4]=p*l-d,e[8]=f*l+x,e[1]=c*u,e[5]=x*l+f,e[9]=d*l-p,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,d=o*l,p=a*c,x=a*l;e[0]=c*h,e[4]=x-f*u,e[8]=p*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+p,e[10]=f-x*u}else if(t.order==="XZY"){const f=o*c,d=o*l,p=a*c,x=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+x,e[5]=o*h,e[9]=d*u-p,e[2]=p*u-d,e[6]=a*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zf,t,Gf)}lookAt(t,e,n){const s=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Dn.crossVectors(n,Ve),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Dn.crossVectors(n,Ve)),Dn.normalize(),$s.crossVectors(Ve,Dn),s[0]=Dn.x,s[4]=$s.x,s[8]=Ve.x,s[1]=Dn.y,s[5]=$s.y,s[9]=Ve.y,s[2]=Dn.z,s[6]=$s.z,s[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],p=n[2],x=n[6],g=n[10],m=n[14],_=n[3],y=n[7],M=n[11],w=n[15],b=s[0],T=s[4],v=s[8],E=s[12],R=s[1],P=s[5],I=s[9],k=s[13],G=s[2],D=s[6],L=s[10],U=s[14],W=s[3],X=s[7],J=s[11],it=s[15];return r[0]=o*b+a*R+c*G+l*W,r[4]=o*T+a*P+c*D+l*X,r[8]=o*v+a*I+c*L+l*J,r[12]=o*E+a*k+c*U+l*it,r[1]=h*b+u*R+f*G+d*W,r[5]=h*T+u*P+f*D+d*X,r[9]=h*v+u*I+f*L+d*J,r[13]=h*E+u*k+f*U+d*it,r[2]=p*b+x*R+g*G+m*W,r[6]=p*T+x*P+g*D+m*X,r[10]=p*v+x*I+g*L+m*J,r[14]=p*E+x*k+g*U+m*it,r[3]=_*b+y*R+M*G+w*W,r[7]=_*T+y*P+M*D+w*X,r[11]=_*v+y*I+M*L+w*J,r[15]=_*E+y*k+M*U+w*it,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],p=t[3],x=t[7],g=t[11],m=t[15],_=c*d-l*f,y=a*d-l*u,M=a*f-c*u,w=o*d-l*h,b=o*f-c*h,T=o*u-a*h;return e*(x*_-g*y+m*M)-n*(p*_-g*w+m*b)+s*(p*y-x*w+m*T)-r*(p*M-x*b+g*T)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],c=t[2],l=t[6],h=t[10];return e*(o*h-a*l)-n*(r*h-a*c)+s*(r*l-o*c)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],p=t[12],x=t[13],g=t[14],m=t[15],_=e*a-n*o,y=e*c-s*o,M=e*l-r*o,w=n*c-s*a,b=n*l-r*a,T=s*l-r*c,v=h*x-u*p,E=h*g-f*p,R=h*m-d*p,P=u*g-f*x,I=u*m-d*x,k=f*m-d*g,G=_*k-y*I+M*P+w*R-b*E+T*v;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/G;return t[0]=(a*k-c*I+l*P)*D,t[1]=(s*I-n*k-r*P)*D,t[2]=(x*T-g*b+m*w)*D,t[3]=(f*b-u*T-d*w)*D,t[4]=(c*R-o*k-l*E)*D,t[5]=(e*k-s*R+r*E)*D,t[6]=(g*M-p*T-m*y)*D,t[7]=(h*T-f*M+d*y)*D,t[8]=(o*I-a*R+l*v)*D,t[9]=(n*R-e*I-r*v)*D,t[10]=(p*b-x*M+m*_)*D,t[11]=(u*M-h*b-d*_)*D,t[12]=(a*E-o*P-c*v)*D,t[13]=(e*P-n*E+s*v)*D,t[14]=(x*y-p*w-g*_)*D,t[15]=(h*w-u*y+f*_)*D,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,p=r*u,x=o*h,g=o*u,m=a*u,_=c*l,y=c*h,M=c*u,w=n.x,b=n.y,T=n.z;return s[0]=(1-(x+m))*w,s[1]=(d+M)*w,s[2]=(p-y)*w,s[3]=0,s[4]=(d-M)*b,s[5]=(1-(f+m))*b,s[6]=(g+_)*b,s[7]=0,s[8]=(p+y)*T,s[9]=(g-_)*T,s[10]=(1-(f+x))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Mi.set(s[0],s[1],s[2]).length();const a=Mi.set(s[4],s[5],s[6]).length(),c=Mi.set(s[8],s[9],s[10]).length();r<0&&(o=-o),qe.copy(this);const l=1/o,h=1/a,u=1/c;return qe.elements[0]*=l,qe.elements[1]*=l,qe.elements[2]*=l,qe.elements[4]*=h,qe.elements[5]*=h,qe.elements[6]*=h,qe.elements[8]*=u,qe.elements[9]*=u,qe.elements[10]*=u,e.setFromRotationMatrix(qe),n.x=o,n.y=a,n.z=c,this}makePerspective(t,e,n,s,r,o,a=fn,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s);let p,x;if(c)p=r/(o-r),x=o*r/(o-r);else if(a===fn)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Ps)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=fn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),d=-(n+s)/(n-s);let p,x;if(c)p=1/(o-r),x=o/(o-r);else if(a===fn)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===Ps)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Mi=new B,qe=new se,zf=new B(0,0,0),Gf=new B(1,1,1),Dn=new B,$s=new B,Ve=new B,Zc=new se,$c=new ts;class $n{constructor(t=0,e=0,n=0,s=$n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin($t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($t(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin($t(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-$t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Zc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Zc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $c.setFromEuler(this),this.setFromQuaternion($c,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}$n.DEFAULT_ORDER="XYZ";class oc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Hf=0;const Yc=new B,yi=new ts,gn=new se,Ys=new B,is=new B,Vf=new B,Wf=new ts,qc=new B(1,0,0),Kc=new B(0,1,0),Jc=new B(0,0,1),Qc={type:"added"},Xf={type:"removed"},Si={type:"childadded",child:null},ao={type:"childremoved",child:null};class be extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new B,e=new $n,n=new ts,s=new B(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new Bt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new oc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.multiply(yi),this}rotateOnWorldAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.premultiply(yi),this}rotateX(t){return this.rotateOnAxis(qc,t)}rotateY(t){return this.rotateOnAxis(Kc,t)}rotateZ(t){return this.rotateOnAxis(Jc,t)}translateOnAxis(t,e){return Yc.copy(t).applyQuaternion(this.quaternion),this.position.add(Yc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(qc,t)}translateY(t){return this.translateOnAxis(Kc,t)}translateZ(t){return this.translateOnAxis(Jc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ys.copy(t):Ys.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gn.lookAt(is,Ys,this.up):gn.lookAt(Ys,is,this.up),this.quaternion.setFromRotationMatrix(gn),s&&(gn.extractRotation(s.matrixWorld),yi.setFromRotationMatrix(gn),this.quaternion.premultiply(yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(qt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Qc),Si.child=t,this.dispatchEvent(Si),Si.child=null):qt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Xf),ao.child=t,this.dispatchEvent(ao),ao.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gn.multiply(t.parent.matrixWorld)),t.applyMatrix4(gn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Qc),Si.child=t,this.dispatchEvent(Si),Si.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,t,Vf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,Wf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}be.DEFAULT_UP=new B(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class nn extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zf={type:"move"};class co{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),m=this._getHandJoint(l,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,p=.005;l.inputState.pinching&&f>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zf)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new nn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},qs={h:0,s:0,l:0};function lo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class ut{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=sc(t,1),e=$t(e,0,1),n=$t(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=lo(o,r,t+1/3),this.g=lo(o,r,t),this.b=lo(o,r,t-1/3)}return Yt.colorSpaceToWorking(this,s),this}setStyle(t,e=Oe){function n(r){r!==void 0&&parseFloat(r)<1&&Ut("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ut("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Ut("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Oe){const n=Lh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ut("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wn(t.r),this.g=wn(t.g),this.b=wn(t.b),this}copyLinearToSRGB(t){return this.r=Hi(t.r),this.g=Hi(t.g),this.b=Hi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Oe){return Yt.workingToColorSpace(Le.copy(this),t),Math.round($t(Le.r*255,0,255))*65536+Math.round($t(Le.g*255,0,255))*256+Math.round($t(Le.b*255,0,255))}getHexString(t=Oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.workingToColorSpace(Le.copy(this),e);const n=Le.r,s=Le.g,r=Le.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.workingToColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Oe){Yt.workingToColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,s=Le.b;return t!==Oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(qs);const n=bs(Un.h,qs.h,e),s=bs(Un.s,qs.s,e),r=bs(Un.l,qs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new ut;ut.NAMES=Lh;class ac{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new ut(t),this.near=e,this.far=n}clone(){return new ac(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class $f extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $n,this.environmentIntensity=1,this.environmentRotation=new $n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Ke=new B,_n=new B,ho=new B,xn=new B,Ei=new B,bi=new B,jc=new B,uo=new B,fo=new B,po=new B,mo=new he,go=new he,_o=new he;class je{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ke.subVectors(t,e),s.cross(Ke);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ke.subVectors(s,e),_n.subVectors(n,e),ho.subVectors(t,e);const o=Ke.dot(Ke),a=Ke.dot(_n),c=Ke.dot(ho),l=_n.dot(_n),h=_n.dot(ho),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,p=(o*h-a*c)*f;return r.set(1-d-p,p,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,xn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,xn.x),c.addScaledVector(o,xn.y),c.addScaledVector(a,xn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return mo.setScalar(0),go.setScalar(0),_o.setScalar(0),mo.fromBufferAttribute(t,e),go.fromBufferAttribute(t,n),_o.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(mo,r.x),o.addScaledVector(go,r.y),o.addScaledVector(_o,r.z),o}static isFrontFacing(t,e,n,s){return Ke.subVectors(n,e),_n.subVectors(t,e),Ke.cross(_n).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ke.subVectors(this.c,this.b),_n.subVectors(this.a,this.b),Ke.cross(_n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return je.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return je.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return je.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return je.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return je.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Ei.subVectors(s,n),bi.subVectors(r,n),uo.subVectors(t,n);const c=Ei.dot(uo),l=bi.dot(uo);if(c<=0&&l<=0)return e.copy(n);fo.subVectors(t,s);const h=Ei.dot(fo),u=bi.dot(fo);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Ei,o);po.subVectors(t,r);const d=Ei.dot(po),p=bi.dot(po);if(p>=0&&d<=p)return e.copy(r);const x=d*l-c*p;if(x<=0&&l>=0&&p<=0)return a=l/(l-p),e.copy(n).addScaledVector(bi,a);const g=h*p-d*u;if(g<=0&&u-h>=0&&d-p>=0)return jc.subVectors(r,s),a=(u-h)/(u-h+(d-p)),e.copy(s).addScaledVector(jc,a);const m=1/(g+x+f);return o=x*m,a=f*m,e.copy(n).addScaledVector(Ei,o).addScaledVector(bi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class mi{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Je):Je.fromBufferAttribute(r,o),Je.applyMatrix4(t.matrixWorld),this.expandByPoint(Je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ks.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ks.copy(n.boundingBox)),Ks.applyMatrix4(t.matrixWorld),this.union(Ks)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Je),Je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ss),Js.subVectors(this.max,ss),wi.subVectors(t.a,ss),Ai.subVectors(t.b,ss),Ti.subVectors(t.c,ss),Nn.subVectors(Ai,wi),Fn.subVectors(Ti,Ai),Kn.subVectors(wi,Ti);let e=[0,-Nn.z,Nn.y,0,-Fn.z,Fn.y,0,-Kn.z,Kn.y,Nn.z,0,-Nn.x,Fn.z,0,-Fn.x,Kn.z,0,-Kn.x,-Nn.y,Nn.x,0,-Fn.y,Fn.x,0,-Kn.y,Kn.x,0];return!xo(e,wi,Ai,Ti,Js)||(e=[1,0,0,0,1,0,0,0,1],!xo(e,wi,Ai,Ti,Js))?!1:(Qs.crossVectors(Nn,Fn),e=[Qs.x,Qs.y,Qs.z],xo(e,wi,Ai,Ti,Js))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const vn=[new B,new B,new B,new B,new B,new B,new B,new B],Je=new B,Ks=new mi,wi=new B,Ai=new B,Ti=new B,Nn=new B,Fn=new B,Kn=new B,ss=new B,Js=new B,Qs=new B,Jn=new B;function xo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Jn.fromArray(i,r);const a=s.x*Math.abs(Jn.x)+s.y*Math.abs(Jn.y)+s.z*Math.abs(Jn.z),c=t.dot(Jn),l=e.dot(Jn),h=n.dot(Jn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Ee=new B,js=new kt;let Yf=0;class Re extends pi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Bc,this.updateRanges=[],this.gpuType=tn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)js.fromBufferAttribute(this,e),js.applyMatrix3(t),this.setXY(e,js.x,js.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Bi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Bi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Bi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Bi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Bi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),s=Ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),s=Ne(s,this.array),r=Ne(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bc&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Dh extends Re{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Uh extends Re{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Kt extends Re{constructor(t,e,n){super(new Float32Array(t),e,n)}}const qf=new mi,rs=new B,vo=new B;class Bs{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):qf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rs.subVectors(t,this.center);const e=rs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(rs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rs.copy(t.center).add(vo)),this.expandByPoint(rs.copy(t.center).sub(vo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Kf=0;const $e=new se,Mo=new be,Ri=new B,We=new mi,os=new mi,Te=new B;class ge extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=ji(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(pf(t)?Uh:Dh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Bt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return Mo.lookAt(t),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ri).negate(),this.translate(Ri.x,Ri.y,Ri.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Kt(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];os.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors(We.min,os.min),We.expandByPoint(Te),Te.addVectors(We.max,os.max),We.expandByPoint(Te)):(We.expandByPoint(os.min),We.expandByPoint(os.max))}We.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Te.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Te));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Te.fromBufferAttribute(a,l),c&&(Ri.fromBufferAttribute(t,l),Te.add(Ri)),s=Math.max(s,n.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){qt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Re(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],c=[];for(let v=0;v<n.count;v++)a[v]=new B,c[v]=new B;const l=new B,h=new B,u=new B,f=new kt,d=new kt,p=new kt,x=new B,g=new B;function m(v,E,R){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,R),f.fromBufferAttribute(r,v),d.fromBufferAttribute(r,E),p.fromBufferAttribute(r,R),h.sub(l),u.sub(l),d.sub(f),p.sub(f);const P=1/(d.x*p.y-p.x*d.y);isFinite(P)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(P),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(P),a[v].add(x),a[E].add(x),a[R].add(x),c[v].add(g),c[E].add(g),c[R].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let v=0,E=_.length;v<E;++v){const R=_[v],P=R.start,I=R.count;for(let k=P,G=P+I;k<G;k+=3)m(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const y=new B,M=new B,w=new B,b=new B;function T(v){w.fromBufferAttribute(s,v),b.copy(w);const E=a[v];y.copy(E),y.sub(w.multiplyScalar(w.dot(E))).normalize(),M.crossVectors(b,E);const P=M.dot(c[v])<0?-1:1;o.setXYZW(v,y.x,y.y,y.z,P)}for(let v=0,E=_.length;v<E;++v){const R=_[v],P=R.start,I=R.count;for(let k=P,G=P+I;k<G;k+=3)T(t.getX(k+0)),T(t.getX(k+1)),T(t.getX(k+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Re(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new B,r=new B,o=new B,a=new B,c=new B,l=new B,h=new B,u=new B;if(t)for(let f=0,d=t.count;f<d;f+=3){const p=t.getX(f+0),x=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,p),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),a.add(h),c.add(h),l.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,p=0;for(let x=0,g=c.length;x<g;x++){a.isInterleavedBufferAttribute?d=c[x]*a.data.stride+a.offset:d=c[x]*h;for(let m=0;m<h;m++)f[p++]=l[d++]}return new Re(f,h,u)}if(this.index===null)return Ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ge,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Jf=0;class ks extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=ji(),this.name="",this.type="Material",this.blending=zi,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wo,this.blendDst=Xo,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ut(0,0,0),this.blendAlpha=0,this.depthFunc=Wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Oc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xi,this.stencilZFail=xi,this.stencilZPass=xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Ut(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Ut(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Xo&&(n.blendDst=this.blendDst),this.blendEquation!==ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Wi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Oc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ut().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new kt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new kt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const Mn=new B,yo=new B,tr=new B,On=new B,So=new B,er=new B,Eo=new B;class Nh{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Mn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mn.copy(this.origin).addScaledVector(this.direction,e),Mn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){yo.copy(t).add(e).multiplyScalar(.5),tr.copy(e).sub(t).normalize(),On.copy(this.origin).sub(yo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(tr),a=On.dot(this.direction),c=-On.dot(tr),l=On.lengthSq(),h=Math.abs(1-o*o);let u,f,d,p;if(h>0)if(u=o*c-a,f=o*a-c,p=r*h,u>=0)if(f>=-p)if(f<=p){const x=1/h;u*=x,f*=x,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-p?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=p?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(yo).addScaledVector(tr,f),d}intersectSphere(t,e){Mn.subVectors(t.center,this.origin);const n=Mn.dot(this.direction),s=Mn.dot(Mn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Mn)!==null}intersectTriangle(t,e,n,s,r){So.subVectors(e,t),er.subVectors(n,t),Eo.crossVectors(So,er);let o=this.direction.dot(Eo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;On.subVectors(this.origin,t);const c=a*this.direction.dot(er.crossVectors(On,er));if(c<0)return null;const l=a*this.direction.dot(So.cross(On));if(l<0||c+l>o)return null;const h=-a*On.dot(Eo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class cc extends ks{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const tl=new se,Qn=new Nh,nr=new Bs,el=new B,ir=new B,sr=new B,rr=new B,bo=new B,or=new B,nl=new B,ar=new B;class fe extends be{constructor(t=new ge,e=new cc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){or.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(bo.fromBufferAttribute(u,t),o?or.addScaledVector(bo,h):or.addScaledVector(bo.sub(e),h))}e.add(or)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(r),Qn.copy(t.ray).recast(t.near),!(nr.containsPoint(Qn.origin)===!1&&(Qn.intersectSphere(nr,el)===null||Qn.origin.distanceToSquared(el)>(t.far-t.near)**2))&&(tl.copy(r).invert(),Qn.copy(t.ray).applyMatrix4(tl),!(n.boundingBox!==null&&Qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Qn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=f.length;p<x;p++){const g=f[p],m=o[g.materialIndex],_=Math.max(g.start,d.start),y=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let M=_,w=y;M<w;M+=3){const b=a.getX(M),T=a.getX(M+1),v=a.getX(M+2);s=cr(this,m,t,n,l,h,u,b,T,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let g=p,m=x;g<m;g+=3){const _=a.getX(g),y=a.getX(g+1),M=a.getX(g+2);s=cr(this,o,t,n,l,h,u,_,y,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let p=0,x=f.length;p<x;p++){const g=f[p],m=o[g.materialIndex],_=Math.max(g.start,d.start),y=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let M=_,w=y;M<w;M+=3){const b=M,T=M+1,v=M+2;s=cr(this,m,t,n,l,h,u,b,T,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let g=p,m=x;g<m;g+=3){const _=g,y=g+1,M=g+2;s=cr(this,o,t,n,l,h,u,_,y,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Qf(i,t,e,n,s,r,o,a){let c;if(t.side===ke?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Zn,a),c===null)return null;ar.copy(a),ar.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ar);return l<e.near||l>e.far?null:{distance:l,point:ar.clone(),object:i}}function cr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,ir),i.getVertexPosition(c,sr),i.getVertexPosition(l,rr);const h=Qf(i,t,e,n,ir,sr,rr,nl);if(h){const u=new B;je.getBarycoord(nl,ir,sr,rr,u),s&&(h.uv=je.getInterpolatedAttribute(s,a,c,l,u,new kt)),r&&(h.uv1=je.getInterpolatedAttribute(r,a,c,l,u,new kt)),o&&(h.normal=je.getInterpolatedAttribute(o,a,c,l,u,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new B,materialIndex:0};je.getNormal(ir,sr,rr,f.normal),h.face=f,h.barycoord=u}return h}class Fh extends Ue{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Ce,h=Ce,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ws extends Re{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ci=new se,il=new se,lr=[],sl=new mi,jf=new se,as=new fe,cs=new Bs;class _s extends fe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ws(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,jf)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new mi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ci),sl.copy(t.boundingBox).applyMatrix4(Ci),this.boundingBox.union(sl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Bs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ci),cs.copy(t.boundingSphere).applyMatrix4(Ci),this.boundingSphere.union(cs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(as.geometry=this.geometry,as.material=this.material,as.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cs.copy(this.boundingSphere),cs.applyMatrix4(n),t.ray.intersectsSphere(cs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ci),il.multiplyMatrices(n,Ci),as.matrixWorld=il,as.raycast(t,lr);for(let o=0,a=lr.length;o<a;o++){const c=lr[o];c.instanceId=r,c.object=this,e.push(c)}lr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ws(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Fh(new Float32Array(s*this.count),s,this.count,Qa,tn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;return r[c]=a,r.set(n,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const wo=new B,td=new B,ed=new Bt;class ni{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=wo.subVectors(n,e).cross(td.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(wo),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ed.getNormalMatrix(t),s=this.coplanarPoint(wo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new Bs,nd=new kt(.5,.5),hr=new B;class lc{constructor(t=new ni,e=new ni,n=new ni,s=new ni,r=new ni,o=new ni){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=fn,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],p=r[8],x=r[9],g=r[10],m=r[11],_=r[12],y=r[13],M=r[14],w=r[15];if(s[0].setComponents(l-o,d-h,m-p,w-_).normalize(),s[1].setComponents(l+o,d+h,m+p,w+_).normalize(),s[2].setComponents(l+a,d+u,m+x,w+y).normalize(),s[3].setComponents(l-a,d-u,m-x,w-y).normalize(),n)s[4].setComponents(c,f,g,M).normalize(),s[5].setComponents(l-c,d-f,m-g,w-M).normalize();else if(s[4].setComponents(l-c,d-f,m-g,w-M).normalize(),e===fn)s[5].setComponents(l+c,d+f,m+g,w+M).normalize();else if(e===Ps)s[5].setComponents(c,f,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(t){jn.center.set(0,0,0);const e=nd.distanceTo(t.center);return jn.radius=.7071067811865476+e,jn.applyMatrix4(t.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(hr.x=s.normal.x>0?t.max.x:t.min.x,hr.y=s.normal.y>0?t.max.y:t.min.y,hr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(hr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oh extends Ue{constructor(t=[],e=ui,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class hc extends Ue{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Zi extends Ue{constructor(t,e,n=mn,s,r,o,a=Ce,c=Ce,l,h=Rn,u=1){if(h!==Rn&&h!==ci)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new rc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class id extends Zi{constructor(t,e=mn,n=ui,s,r,o=Ce,a=Ce,c,l=Rn){const h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Bh extends Ue{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Be extends ge{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Kt(l,3)),this.setAttribute("normal",new Kt(h,3)),this.setAttribute("uv",new Kt(u,2));function p(x,g,m,_,y,M,w,b,T,v,E){const R=M/T,P=w/v,I=M/2,k=w/2,G=b/2,D=T+1,L=v+1;let U=0,W=0;const X=new B;for(let J=0;J<L;J++){const it=J*P-k;for(let et=0;et<D;et++){const ct=et*R-I;X[x]=ct*_,X[g]=it*y,X[m]=G,l.push(X.x,X.y,X.z),X[x]=0,X[g]=0,X[m]=b>0?1:-1,h.push(X.x,X.y,X.z),u.push(et/T),u.push(1-J/v),U+=1}}for(let J=0;J<v;J++)for(let it=0;it<T;it++){const et=f+it+D*J,ct=f+it+D*(J+1),Et=f+(it+1)+D*(J+1),ot=f+(it+1)+D*J;c.push(et,ct,ot),c.push(ct,Et,ot),W+=6}a.addGroup(d,W,E),d+=W,f+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Be(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class $i extends ge{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let p=0;const x=[],g=n/2;let m=0;_(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Kt(u,3)),this.setAttribute("normal",new Kt(f,3)),this.setAttribute("uv",new Kt(d,2));function _(){const M=new B,w=new B;let b=0;const T=(e-t)/n;for(let v=0;v<=r;v++){const E=[],R=v/r,P=R*(e-t)+t;for(let I=0;I<=s;I++){const k=I/s,G=k*c+a,D=Math.sin(G),L=Math.cos(G);w.x=P*D,w.y=-R*n+g,w.z=P*L,u.push(w.x,w.y,w.z),M.set(D,T,L).normalize(),f.push(M.x,M.y,M.z),d.push(k,1-R),E.push(p++)}x.push(E)}for(let v=0;v<s;v++)for(let E=0;E<r;E++){const R=x[E][v],P=x[E+1][v],I=x[E+1][v+1],k=x[E][v+1];(t>0||E!==0)&&(h.push(R,P,k),b+=3),(e>0||E!==r-1)&&(h.push(P,I,k),b+=3)}l.addGroup(m,b,0),m+=b}function y(M){const w=p,b=new kt,T=new B;let v=0;const E=M===!0?t:e,R=M===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,g*R,0),f.push(0,R,0),d.push(.5,.5),p++;const P=p;for(let I=0;I<=s;I++){const G=I/s*c+a,D=Math.cos(G),L=Math.sin(G);T.x=E*L,T.y=g*R,T.z=E*D,u.push(T.x,T.y,T.z),f.push(0,R,0),b.x=D*.5+.5,b.y=L*.5*R+.5,d.push(b.x,b.y),p++}for(let I=0;I<s;I++){const k=w+I,G=P+I;M===!0?h.push(G,G+1,k):h.push(G+1,G,k),v+=3}l.addGroup(m,v,M===!0?1:2),m+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class uc extends ge{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new Kt(r,3)),this.setAttribute("normal",new Kt(r.slice(),3)),this.setAttribute("uv",new Kt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const y=new B,M=new B,w=new B;for(let b=0;b<e.length;b+=3)d(e[b+0],y),d(e[b+1],M),d(e[b+2],w),c(y,M,w,_)}function c(_,y,M,w){const b=w+1,T=[];for(let v=0;v<=b;v++){T[v]=[];const E=_.clone().lerp(M,v/b),R=y.clone().lerp(M,v/b),P=b-v;for(let I=0;I<=P;I++)I===0&&v===b?T[v][I]=E:T[v][I]=E.clone().lerp(R,I/P)}for(let v=0;v<b;v++)for(let E=0;E<2*(b-v)-1;E++){const R=Math.floor(E/2);E%2===0?(f(T[v][R+1]),f(T[v+1][R]),f(T[v][R])):(f(T[v][R+1]),f(T[v+1][R+1]),f(T[v+1][R]))}}function l(_){const y=new B;for(let M=0;M<r.length;M+=3)y.x=r[M+0],y.y=r[M+1],y.z=r[M+2],y.normalize().multiplyScalar(_),r[M+0]=y.x,r[M+1]=y.y,r[M+2]=y.z}function h(){const _=new B;for(let y=0;y<r.length;y+=3){_.x=r[y+0],_.y=r[y+1],_.z=r[y+2];const M=g(_)/2/Math.PI+.5,w=m(_)/Math.PI+.5;o.push(M,1-w)}p(),u()}function u(){for(let _=0;_<o.length;_+=6){const y=o[_+0],M=o[_+2],w=o[_+4],b=Math.max(y,M,w),T=Math.min(y,M,w);b>.9&&T<.1&&(y<.2&&(o[_+0]+=1),M<.2&&(o[_+2]+=1),w<.2&&(o[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function d(_,y){const M=_*3;y.x=t[M+0],y.y=t[M+1],y.z=t[M+2]}function p(){const _=new B,y=new B,M=new B,w=new B,b=new kt,T=new kt,v=new kt;for(let E=0,R=0;E<r.length;E+=9,R+=6){_.set(r[E+0],r[E+1],r[E+2]),y.set(r[E+3],r[E+4],r[E+5]),M.set(r[E+6],r[E+7],r[E+8]),b.set(o[R+0],o[R+1]),T.set(o[R+2],o[R+3]),v.set(o[R+4],o[R+5]),w.copy(_).add(y).add(M).divideScalar(3);const P=g(w);x(b,R+0,_,P),x(T,R+2,y,P),x(v,R+4,M,P)}}function x(_,y,M,w){w<0&&_.x===1&&(o[y]=_.x-1),M.x===0&&M.z===0&&(o[y]=w/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uc(t.vertices,t.indices,t.radius,t.detail)}}function sd(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=kh(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=ld(i,t,r,e)),i.length>80*e){a=i[0],c=i[1];let h=a,u=c;for(let f=e;f<s;f+=e){const d=i[f],p=i[f+1];d<a&&(a=d),p<c&&(c=p),d>h&&(h=d),p>u&&(u=p)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return Ls(r,o,e,a,c,l,0),o}function kh(i,t,e,n,s){let r;if(s===Md(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=rl(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=rl(o/n|0,i[o],i[o+1],r);return r&&Yi(r,r.next)&&(Us(r),r=r.next),r}function di(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Yi(e,e.next)||ue(e.prev,e,e.next)===0)){if(Us(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ls(i,t,e,n,s,r,o){if(!i)return;!o&&r&&pd(i,n,s,r);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?od(i,n,s,r):rd(i)){t.push(c.i,i.i,l.i),Us(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=ad(di(i),t),Ls(i,t,e,n,s,r,2)):o===2&&cd(i,t,e,n,s,r):Ls(di(i),t,e,n,s,r,1);break}}}function rd(i){const t=i.prev,e=i,n=i.next;if(ue(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,r,o),u=Math.min(a,c,l),f=Math.max(s,r,o),d=Math.max(a,c,l);let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=f&&p.y>=u&&p.y<=d&&xs(s,a,r,c,o,l,p.x,p.y)&&ue(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function od(i,t,e,n){const s=i.prev,r=i,o=i.next;if(ue(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,f=o.y,d=Math.min(a,c,l),p=Math.min(h,u,f),x=Math.max(a,c,l),g=Math.max(h,u,f),m=Ia(d,p,t,e,n),_=Ia(x,g,t,e,n);let y=i.prevZ,M=i.nextZ;for(;y&&y.z>=m&&M&&M.z<=_;){if(y.x>=d&&y.x<=x&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&xs(a,h,c,u,l,f,y.x,y.y)&&ue(y.prev,y,y.next)>=0||(y=y.prevZ,M.x>=d&&M.x<=x&&M.y>=p&&M.y<=g&&M!==s&&M!==o&&xs(a,h,c,u,l,f,M.x,M.y)&&ue(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;y&&y.z>=m;){if(y.x>=d&&y.x<=x&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&xs(a,h,c,u,l,f,y.x,y.y)&&ue(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;M&&M.z<=_;){if(M.x>=d&&M.x<=x&&M.y>=p&&M.y<=g&&M!==s&&M!==o&&xs(a,h,c,u,l,f,M.x,M.y)&&ue(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function ad(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Yi(n,s)&&Gh(n,e,e.next,s)&&Ds(n,s)&&Ds(s,n)&&(t.push(n.i,e.i,s.i),Us(e),Us(e.next),e=i=s),e=e.next}while(e!==i);return di(e)}function cd(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&_d(o,a)){let c=Hh(o,a);o=di(o,o.next),c=di(c,c.next),Ls(o,t,e,n,s,r,0),Ls(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function ld(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=kh(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(gd(l))}s.sort(hd);for(let r=0;r<s.length;r++)e=ud(s[r],e);return e}function hd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function ud(i,t){const e=fd(i,t);if(!e)return t;const n=Hh(e,i);return di(n,n.next),di(e,e.next)}function fd(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(Yi(i,e))return e;do{if(Yi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,c=o.x,l=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&zh(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Ds(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&dd(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function dd(i,t){return ue(i.prev,i,t.prev)<0&&ue(t.next,i,i.next)<0}function pd(i,t,e,n){let s=i;do s.z===0&&(s.z=Ia(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,md(s)}function md(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function Ia(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function gd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function zh(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function xs(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&zh(i,t,e,n,s,r,o,a)}function _d(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!xd(i,t)&&(Ds(i,t)&&Ds(t,i)&&vd(i,t)&&(ue(i.prev,i,t.prev)||ue(i,t.prev,t))||Yi(i,t)&&ue(i.prev,i,i.next)>0&&ue(t.prev,t,t.next)>0)}function ue(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Yi(i,t){return i.x===t.x&&i.y===t.y}function Gh(i,t,e,n){const s=fr(ue(i,t,e)),r=fr(ue(i,t,n)),o=fr(ue(e,n,i)),a=fr(ue(e,n,t));return!!(s!==r&&o!==a||s===0&&ur(i,e,t)||r===0&&ur(i,n,t)||o===0&&ur(e,i,n)||a===0&&ur(e,t,n))}function ur(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function fr(i){return i>0?1:i<0?-1:0}function xd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Gh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ds(i,t){return ue(i.prev,i,i.next)<0?ue(i,t,i.next)>=0&&ue(i,i.prev,t)>=0:ue(i,t,i.prev)<0||ue(i,i.next,t)<0}function vd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Hh(i,t){const e=La(i.i,i.x,i.y),n=La(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function rl(i,t,e,n){const s=La(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Us(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function La(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Md(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class yd{static triangulate(t,e,n=2){return sd(t,e,n)}}class Xr{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Xr.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];ol(t),al(n,t);let o=t.length;e.forEach(ol);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,al(n,e[c]);const a=yd.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function ol(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function al(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class fc extends uc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new fc(t.radius,t.detail)}}class Zr extends ge{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],p=[],x=[],g=[];for(let m=0;m<h;m++){const _=m*f-o;for(let y=0;y<l;y++){const M=y*u-r;p.push(M,-_,0),x.push(0,0,1),g.push(y/a),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let _=0;_<a;_++){const y=_+l*m,M=_+l*(m+1),w=_+1+l*(m+1),b=_+1+l*m;d.push(y,M,b),d.push(M,w,b)}this.setIndex(d),this.setAttribute("position",new Kt(p,3)),this.setAttribute("normal",new Kt(x,3)),this.setAttribute("uv",new Kt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zr(t.width,t.height,t.widthSegments,t.heightSegments)}}class zs extends ge{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new B,f=new B,d=[],p=[],x=[],g=[];for(let m=0;m<=n;m++){const _=[],y=m/n,M=o+y*a,w=t*Math.cos(M),b=Math.sqrt(t*t-w*w);let T=0;m===0&&o===0?T=.5/e:m===n&&c===Math.PI&&(T=-.5/e);for(let v=0;v<=e;v++){const E=v/e,R=s+E*r;u.x=-b*Math.cos(R),u.y=w,u.z=b*Math.sin(R),p.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),g.push(E+T,1-y),_.push(l++)}h.push(_)}for(let m=0;m<n;m++)for(let _=0;_<e;_++){const y=h[m][_+1],M=h[m][_],w=h[m+1][_],b=h[m+1][_+1];(m!==0||o>0)&&d.push(y,M,b),(m!==n-1||c<Math.PI)&&d.push(M,w,b)}this.setIndex(d),this.setAttribute("position",new Kt(p,3)),this.setAttribute("normal",new Kt(x,3)),this.setAttribute("uv",new Kt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}function qi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(cl(s))s.isRenderTargetTexture?(Ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(cl(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function Fe(i){const t={};for(let e=0;e<i.length;e++){const n=qi(i[e]);for(const s in n)t[s]=n[s]}return t}function cl(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Sd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Vh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const Ed={clone:qi,merge:Fe};var bd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class sn extends ks{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bd,this.fragmentShader=wd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=qi(t.uniforms),this.uniformsGroups=Sd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new ut().setHex(s.value);break;case"v2":this.uniforms[n].value=new kt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new B().fromArray(s.value);break;case"v4":this.uniforms[n].value=new he().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Bt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new se().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Ad extends sn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ge extends ks{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pa,this.normalScale=new kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Td extends ks{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=of,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Rd extends ks{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Wh extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ut(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Cd extends Wh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ut(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Ao=new se,ll=new B,hl=new B;class Pd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new kt(512,512),this.mapType=Xe,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lc,this._frameExtents=new kt(1,1),this._viewportCount=1,this._viewports=[new he(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;ll.setFromMatrixPosition(t.matrixWorld),e.position.copy(ll),hl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hl),e.updateMatrixWorld(),Ao.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ao,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Ps||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ao)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const dr=new B,pr=new ts,cn=new B;class Xh extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(dr,pr,cn),cn.x===1&&cn.y===1&&cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dr,pr,cn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(dr,pr,cn),cn.x===1&&cn.y===1&&cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dr,pr,cn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bn=new B,ul=new kt,fl=new kt;class Ye extends Xh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Is*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z)}getViewSize(t,e){return this.getViewBounds(t,ul,fl),e.subVectors(fl,ul)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Es*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class dc extends Xh{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Id extends Pd{constructor(){super(new dc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ld extends Wh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new Id}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Pi=-90,Ii=1;class Dd extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ye(Pi,Ii,t,e);s.layers=this.layers,this.add(s);const r=new Ye(Pi,Ii,t,e);r.layers=this.layers,this.add(r);const o=new Ye(Pi,Ii,t,e);o.layers=this.layers,this.add(o);const a=new Ye(Pi,Ii,t,e);a.layers=this.layers,this.add(a);const c=new Ye(Pi,Ii,t,e);c.layers=this.layers,this.add(c);const l=new Ye(Pi,Ii,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ps)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Ud extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const dl=new se;class Nd{constructor(t,e,n=0,s=1/0){this.ray=new Nh(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new oc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):qt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return dl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(dl),this}intersectObject(t,e=!0,n=[]){return Da(t,this,n,e),n.sort(pl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Da(t[s],this,n,e);return n.sort(pl),n}}function pl(i,t){return i.distance-t.distance}function Da(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)Da(r[o],t,e,!0)}}class Zh{static{Zh.prototype.isMatrix2=!0}constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}}function ml(i,t,e,n){const s=Fd(n);switch(e){case Rh:return i*t;case Qa:return i*t/s.components*s.byteLength;case ja:return i*t/s.components*s.byteLength;case fi:return i*t*2/s.components*s.byteLength;case tc:return i*t*2/s.components*s.byteLength;case Ch:return i*t*3/s.components*s.byteLength;case en:return i*t*4/s.components*s.byteLength;case ec:return i*t*4/s.components*s.byteLength;case Tr:case Rr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Cr:case Pr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ea:case ia:return Math.max(i,16)*Math.max(t,8)/4;case ta:case na:return Math.max(i,8)*Math.max(t,8)/2;case sa:case ra:case aa:case ca:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case oa:case Ur:case la:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ua:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case fa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case da:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case pa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ma:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ga:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case _a:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case xa:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case va:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ya:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Sa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ea:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ba:case wa:case Aa:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ta:case Ra:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Nr:case Ca:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fd(i){switch(i){case Xe:case bh:return{byteLength:1,components:1};case Rs:case wh:case Tn:return{byteLength:2,components:1};case Ka:case Ja:return{byteLength:2,components:4};case mn:case qa:case tn:return{byteLength:4,components:1};case Ah:case Th:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$a}}));typeof window<"u"&&(window.__THREE__?Ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$a);function $h(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Od(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<u.length;d++){const p=u[f],x=u[d];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,p=u.length;d<p;d++){const x=u[d];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Bd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,zd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Xd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$d=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Jd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Qd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,jd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ep=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,np=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ip=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,sp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,ap=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,hp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,up=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,pp="gl_FragColor = linearToOutputTexel( gl_FragColor );",mp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,gp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,_p=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,xp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ep=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ap=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Pp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ip=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Up=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Np=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Fp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Op=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Bp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,kp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Gp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Xp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$p=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,em=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,im=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,sm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,om=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,am=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,um=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,pm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_m=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Mm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ym=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Sm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Em=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Am=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Tm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Im=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Nm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Om=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,km=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Xm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$m=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Km=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,jm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ng=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ig=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,rg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,og=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ag=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,lg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ug=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,dg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_g=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Wt={alphahash_fragment:Bd,alphahash_pars_fragment:kd,alphamap_fragment:zd,alphamap_pars_fragment:Gd,alphatest_fragment:Hd,alphatest_pars_fragment:Vd,aomap_fragment:Wd,aomap_pars_fragment:Xd,batching_pars_vertex:Zd,batching_vertex:$d,begin_vertex:Yd,beginnormal_vertex:qd,bsdfs:Kd,iridescence_fragment:Jd,bumpmap_pars_fragment:Qd,clipping_planes_fragment:jd,clipping_planes_pars_fragment:tp,clipping_planes_pars_vertex:ep,clipping_planes_vertex:np,color_fragment:ip,color_pars_fragment:sp,color_pars_vertex:rp,color_vertex:op,common:ap,cube_uv_reflection_fragment:cp,defaultnormal_vertex:lp,displacementmap_pars_vertex:hp,displacementmap_vertex:up,emissivemap_fragment:fp,emissivemap_pars_fragment:dp,colorspace_fragment:pp,colorspace_pars_fragment:mp,envmap_fragment:gp,envmap_common_pars_fragment:_p,envmap_pars_fragment:xp,envmap_pars_vertex:vp,envmap_physical_pars_fragment:Pp,envmap_vertex:Mp,fog_vertex:yp,fog_pars_vertex:Sp,fog_fragment:Ep,fog_pars_fragment:bp,gradientmap_pars_fragment:wp,lightmap_pars_fragment:Ap,lights_lambert_fragment:Tp,lights_lambert_pars_fragment:Rp,lights_pars_begin:Cp,lights_toon_fragment:Ip,lights_toon_pars_fragment:Lp,lights_phong_fragment:Dp,lights_phong_pars_fragment:Up,lights_physical_fragment:Np,lights_physical_pars_fragment:Fp,lights_fragment_begin:Op,lights_fragment_maps:Bp,lights_fragment_end:kp,lightprobes_pars_fragment:zp,logdepthbuf_fragment:Gp,logdepthbuf_pars_fragment:Hp,logdepthbuf_pars_vertex:Vp,logdepthbuf_vertex:Wp,map_fragment:Xp,map_pars_fragment:Zp,map_particle_fragment:$p,map_particle_pars_fragment:Yp,metalnessmap_fragment:qp,metalnessmap_pars_fragment:Kp,morphinstance_vertex:Jp,morphcolor_vertex:Qp,morphnormal_vertex:jp,morphtarget_pars_vertex:tm,morphtarget_vertex:em,normal_fragment_begin:nm,normal_fragment_maps:im,normal_pars_fragment:sm,normal_pars_vertex:rm,normal_vertex:om,normalmap_pars_fragment:am,clearcoat_normal_fragment_begin:cm,clearcoat_normal_fragment_maps:lm,clearcoat_pars_fragment:hm,iridescence_pars_fragment:um,opaque_fragment:fm,packing:dm,premultiplied_alpha_fragment:pm,project_vertex:mm,dithering_fragment:gm,dithering_pars_fragment:_m,roughnessmap_fragment:xm,roughnessmap_pars_fragment:vm,shadowmap_pars_fragment:Mm,shadowmap_pars_vertex:ym,shadowmap_vertex:Sm,shadowmask_pars_fragment:Em,skinbase_vertex:bm,skinning_pars_vertex:wm,skinning_vertex:Am,skinnormal_vertex:Tm,specularmap_fragment:Rm,specularmap_pars_fragment:Cm,tonemapping_fragment:Pm,tonemapping_pars_fragment:Im,transmission_fragment:Lm,transmission_pars_fragment:Dm,uv_pars_fragment:Um,uv_pars_vertex:Nm,uv_vertex:Fm,worldpos_vertex:Om,background_vert:Bm,background_frag:km,backgroundCube_vert:zm,backgroundCube_frag:Gm,cube_vert:Hm,cube_frag:Vm,depth_vert:Wm,depth_frag:Xm,distance_vert:Zm,distance_frag:$m,equirect_vert:Ym,equirect_frag:qm,linedashed_vert:Km,linedashed_frag:Jm,meshbasic_vert:Qm,meshbasic_frag:jm,meshlambert_vert:tg,meshlambert_frag:eg,meshmatcap_vert:ng,meshmatcap_frag:ig,meshnormal_vert:sg,meshnormal_frag:rg,meshphong_vert:og,meshphong_frag:ag,meshphysical_vert:cg,meshphysical_frag:lg,meshtoon_vert:hg,meshtoon_frag:ug,points_vert:fg,points_frag:dg,shadow_vert:pg,shadow_frag:mg,sprite_vert:gg,sprite_frag:_g},gt={common:{diffuse:{value:new ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new ut(16777215)},opacity:{value:1},center:{value:new kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},un={basic:{uniforms:Fe([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Fe([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new ut(0)},envMapIntensity:{value:1}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Fe([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new ut(0)},specular:{value:new ut(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Fe([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Fe([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new ut(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Fe([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Fe([gt.points,gt.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Fe([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Fe([gt.common,gt.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Fe([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Fe([gt.sprite,gt.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distance:{uniforms:Fe([gt.common,gt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distance_vert,fragmentShader:Wt.distance_frag},shadow:{uniforms:Fe([gt.lights,gt.fog,{color:{value:new ut(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};un.physical={uniforms:Fe([un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new ut(0)},specularColor:{value:new ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};const mr={r:0,b:0,g:0},xg=new se,Yh=new Bt;Yh.set(-1,0,0,0,1,0,0,0,1);function vg(i,t,e,n,s,r){const o=new ut(0);let a=s===!0?0:1,c,l,h=null,u=0,f=null;function d(_){let y=_.isScene===!0?_.background:null;if(y&&y.isTexture){const M=_.backgroundBlurriness>0;y=t.get(y,M)}return y}function p(_){let y=!1;const M=d(_);M===null?g(o,a):M&&M.isColor&&(g(M,1),y=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?e.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||y)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(_,y){const M=d(y);M&&(M.isCubeTexture||M.mapping===Wr)?(l===void 0&&(l=new fe(new Be(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:qi(un.backgroundCube.uniforms),vertexShader:un.backgroundCube.vertexShader,fragmentShader:un.backgroundCube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(w,b,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(xg.makeRotationFromEuler(y.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Yh),l.material.toneMapped=Yt.getTransfer(M.colorSpace)!==jt,(h!==M||u!==M.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,f=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new fe(new Zr(2,2),new sn({name:"BackgroundMaterial",uniforms:qi(un.background.uniforms),vertexShader:un.background.vertexShader,fragmentShader:un.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(M.colorSpace)!==jt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,f=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function g(_,y){_.getRGB(mr,Vh(i)),e.buffers.color.setClear(mr.r,mr.g,mr.b,y,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,y=1){o.set(_),a=y,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(_){a=_,g(o,a)},render:p,addToRenderList:x,dispose:m}}function Mg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(P,I,k,G,D){let L=!1;const U=u(P,G,k,I);r!==U&&(r=U,l(r.object)),L=d(P,G,k,D),L&&p(P,G,k,D),D!==null&&t.update(D,i.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,M(P,I,k,G),D!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function c(){return i.createVertexArray()}function l(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function u(P,I,k,G){const D=G.wireframe===!0;let L=n[I.id];L===void 0&&(L={},n[I.id]=L);const U=P.isInstancedMesh===!0?P.id:0;let W=L[U];W===void 0&&(W={},L[U]=W);let X=W[k.id];X===void 0&&(X={},W[k.id]=X);let J=X[D];return J===void 0&&(J=f(c()),X[D]=J),J}function f(P){const I=[],k=[],G=[];for(let D=0;D<e;D++)I[D]=0,k[D]=0,G[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:k,attributeDivisors:G,object:P,attributes:{},index:null}}function d(P,I,k,G){const D=r.attributes,L=I.attributes;let U=0;const W=k.getAttributes();for(const X in W)if(W[X].location>=0){const it=D[X];let et=L[X];if(et===void 0&&(X==="instanceMatrix"&&P.instanceMatrix&&(et=P.instanceMatrix),X==="instanceColor"&&P.instanceColor&&(et=P.instanceColor)),it===void 0||it.attribute!==et||et&&it.data!==et.data)return!0;U++}return r.attributesNum!==U||r.index!==G}function p(P,I,k,G){const D={},L=I.attributes;let U=0;const W=k.getAttributes();for(const X in W)if(W[X].location>=0){let it=L[X];it===void 0&&(X==="instanceMatrix"&&P.instanceMatrix&&(it=P.instanceMatrix),X==="instanceColor"&&P.instanceColor&&(it=P.instanceColor));const et={};et.attribute=it,it&&it.data&&(et.data=it.data),D[X]=et,U++}r.attributes=D,r.attributesNum=U,r.index=G}function x(){const P=r.newAttributes;for(let I=0,k=P.length;I<k;I++)P[I]=0}function g(P){m(P,0)}function m(P,I){const k=r.newAttributes,G=r.enabledAttributes,D=r.attributeDivisors;k[P]=1,G[P]===0&&(i.enableVertexAttribArray(P),G[P]=1),D[P]!==I&&(i.vertexAttribDivisor(P,I),D[P]=I)}function _(){const P=r.newAttributes,I=r.enabledAttributes;for(let k=0,G=I.length;k<G;k++)I[k]!==P[k]&&(i.disableVertexAttribArray(k),I[k]=0)}function y(P,I,k,G,D,L,U){U===!0?i.vertexAttribIPointer(P,I,k,D,L):i.vertexAttribPointer(P,I,k,G,D,L)}function M(P,I,k,G){x();const D=G.attributes,L=k.getAttributes(),U=I.defaultAttributeValues;for(const W in L){const X=L[W];if(X.location>=0){let J=D[W];if(J===void 0&&(W==="instanceMatrix"&&P.instanceMatrix&&(J=P.instanceMatrix),W==="instanceColor"&&P.instanceColor&&(J=P.instanceColor)),J!==void 0){const it=J.normalized,et=J.itemSize,ct=t.get(J);if(ct===void 0)continue;const Et=ct.buffer,ot=ct.type,Y=ct.bytesPerElement,nt=ot===i.INT||ot===i.UNSIGNED_INT||J.gpuType===qa;if(J.isInterleavedBufferAttribute){const j=J.data,at=j.stride,yt=J.offset;if(j.isInstancedInterleavedBuffer){for(let bt=0;bt<X.locationSize;bt++)m(X.location+bt,j.meshPerAttribute);P.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let bt=0;bt<X.locationSize;bt++)g(X.location+bt);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let bt=0;bt<X.locationSize;bt++)y(X.location+bt,et/X.locationSize,ot,it,at*Y,(yt+et/X.locationSize*bt)*Y,nt)}else{if(J.isInstancedBufferAttribute){for(let j=0;j<X.locationSize;j++)m(X.location+j,J.meshPerAttribute);P.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let j=0;j<X.locationSize;j++)g(X.location+j);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let j=0;j<X.locationSize;j++)y(X.location+j,et/X.locationSize,ot,it,et*Y,et/X.locationSize*j*Y,nt)}}else if(U!==void 0){const it=U[W];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(X.location,it);break;case 3:i.vertexAttrib3fv(X.location,it);break;case 4:i.vertexAttrib4fv(X.location,it);break;default:i.vertexAttrib1fv(X.location,it)}}}}_()}function w(){E();for(const P in n){const I=n[P];for(const k in I){const G=I[k];for(const D in G){const L=G[D];for(const U in L)h(L[U].object),delete L[U];delete G[D]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const I=n[P.id];for(const k in I){const G=I[k];for(const D in G){const L=G[D];for(const U in L)h(L[U].object),delete L[U];delete G[D]}}delete n[P.id]}function T(P){for(const I in n){const k=n[I];for(const G in k){const D=k[G];if(D[P.id]===void 0)continue;const L=D[P.id];for(const U in L)h(L[U].object),delete L[U];delete D[P.id]}}}function v(P){for(const I in n){const k=n[I],G=P.isInstancedMesh===!0?P.id:0,D=k[G];if(D!==void 0){for(const L in D){const U=D[L];for(const W in U)h(U[W].object),delete U[W];delete D[L]}delete k[G],Object.keys(k).length===0&&delete n[I]}}}function E(){R(),o=!0,r!==s&&(r=s,l(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:E,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfObject:v,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:g,disableUnusedAttributes:_}}function yg(i,t,e){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),e.update(l,n,1)}function o(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),e.update(l,n,h))}function a(c,l,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let f=0;for(let d=0;d<h;d++)f+=l[d];e.update(f,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Sg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==en&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const v=T===Tn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Xe&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==tn&&!v)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(Ut("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&f===!1&&Ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:_,maxVaryings:y,maxFragmentUniforms:M,maxSamples:w,samples:b}}function Eg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new ni,a=new Bt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const p=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):l();else{const _=r?0:n,y=_*4;let M=m.clippingState||null;c.value=M,M=h(p,f,y,d);for(let w=0;w!==y;++w)M[w]=e[w];m.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,p){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=c.value,p!==!0||g===null){const m=d+x*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(g===null||g.length<m)&&(g=new Float32Array(m));for(let y=0,M=d;y!==x;++y,M+=4)o.copy(u[y]).applyMatrix4(_,a),o.normal.toArray(g,M),g[M+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}const Hn=4,gl=[.125,.215,.35,.446,.526,.582],si=20,bg=256,ls=new dc,_l=new ut;let To=null,Ro=0,Co=0,Po=!1;const wg=new B;class xl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=wg}=r;To=this._renderer.getRenderTarget(),Ro=this._renderer.getActiveCubeFace(),Co=this._renderer.getActiveMipmapLevel(),Po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ml(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(To,Ro,Co),this._renderer.xr.enabled=Po,t.scissorTest=!1,Li(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ui||t.mapping===Xi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),To=this._renderer.getRenderTarget(),Ro=this._renderer.getActiveCubeFace(),Co=this._renderer.getActiveMipmapLevel(),Po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:De,minFilter:De,generateMipmaps:!1,type:Tn,format:en,colorSpace:Fr,depthBuffer:!1},s=vl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vl(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Ag(r)),this._blurMaterial=Rg(r,t,e),this._ggxMaterial=Tg(r,t,e)}return s}_compileMaterial(t){const e=new fe(new ge,t);this._renderer.compile(e,ls)}_sceneToCubeUV(t,e,n,s,r){const c=new Ye(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(_l),u.toneMapping=dn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new fe(new Be,new cc({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,g=x.material;let m=!1;const _=t.background;_?_.isColor&&(g.color.copy(_),t.background=null,m=!0):(g.color.copy(_l),m=!0);for(let y=0;y<6;y++){const M=y%3;M===0?(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[y],r.y,r.z)):M===1?(c.up.set(0,0,l[y]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[y],r.z)):(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[y]));const w=this._cubeSize;Li(s,M*w,y>2?w:0,w,w),u.setRenderTarget(s),m&&u.render(x,c),u.render(t,c)}u.toneMapping=d,u.autoClear=f,t.background=_}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ui||t.mapping===Xi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ml());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Li(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ls)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const c=o.uniforms,l=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),f=0+l*1.25,d=u*f,{_lodMax:p}=this,x=this._sizeLods[n],g=3*x*(n>p-Hn?n-p+Hn:0),m=4*(this._cubeSize-x);c.envMap.value=t.texture,c.roughness.value=d,c.mipInt.value=p-e,Li(r,g,m,3*x,2*x),s.setRenderTarget(r),s.render(a,ls),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-n,Li(t,g,m,3*x,2*x),s.setRenderTarget(t),s.render(a,ls)}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&qt("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*si-1),x=r/p,g=isFinite(r)?1+Math.floor(h*x):si;g>si&&Ut(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${si}`);const m=[];let _=0;for(let T=0;T<si;++T){const v=T/x,E=Math.exp(-v*v/2);m.push(E),T===0?_+=E:T<g&&(_+=2*E)}for(let T=0;T<m.length;T++)m[T]=m[T]/_;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:y}=this;f.dTheta.value=p,f.mipInt.value=y-n;const M=this._sizeLods[s],w=3*M*(s>y-Hn?s-y+Hn:0),b=4*(this._cubeSize-M);Li(e,w,b,3*M,2*M),c.setRenderTarget(e),c.render(u,ls)}}function Ag(i){const t=[],e=[],n=[];let s=i;const r=i-Hn+1+gl.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-Hn?c=gl[o-i+Hn-1]:o===0&&(c=0),e.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,p=6,x=3,g=2,m=1,_=new Float32Array(x*p*d),y=new Float32Array(g*p*d),M=new Float32Array(m*p*d);for(let b=0;b<d;b++){const T=b%3*2/3-1,v=b>2?0:-1,E=[T,v,0,T+2/3,v,0,T+2/3,v+1,0,T,v,0,T+2/3,v+1,0,T,v+1,0];_.set(E,x*p*b),y.set(f,g*p*b);const R=[b,b,b,b,b,b];M.set(R,m*p*b)}const w=new ge;w.setAttribute("position",new Re(_,x)),w.setAttribute("uv",new Re(y,g)),w.setAttribute("faceIndex",new Re(M,m)),n.push(new fe(w,null)),s>Hn&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function vl(i,t,e){const n=new pn(i,t,e);return n.texture.mapping=Wr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Li(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Tg(i,t,e){return new sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:bg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:$r(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Rg(i,t,e){const n=new Float32Array(si),s=new B(0,1,0);return new sn({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:$r(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Ml(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$r(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function yl(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$r(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function $r(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class qh extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Oh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Be(5,5,5),r=new sn({name:"CubemapFromEquirect",uniforms:qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ke,blending:bn});r.uniforms.tEquirect.value=e;const o=new fe(s,r),a=e.minFilter;return e.minFilter===ai&&(e.minFilter=De),new Dd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}function Cg(i){let t=new WeakMap,e=new WeakMap,n=null;function s(f,d=!1){return f==null?null:d?o(f):r(f)}function r(f){if(f&&f.isTexture){const d=f.mapping;if(d===to||d===eo)if(t.has(f)){const p=t.get(f).texture;return a(p,f.mapping)}else{const p=f.image;if(p&&p.height>0){const x=new qh(p.height);return x.fromEquirectangularTexture(i,f),t.set(f,x),f.addEventListener("dispose",l),a(x.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const d=f.mapping,p=d===to||d===eo,x=d===ui||d===Xi;if(p||x){let g=e.get(f);const m=g!==void 0?g.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return n===null&&(n=new xl(i)),g=p?n.fromEquirectangular(f,g):n.fromCubemap(f,g),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),g.texture;if(g!==void 0)return g.texture;{const _=f.image;return p&&_&&_.height>0||x&&_&&c(_)?(n===null&&(n=new xl(i)),g=p?n.fromEquirectangular(f):n.fromCubemap(f),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),f.addEventListener("dispose",h),g.texture):null}}}return f}function a(f,d){return d===to?f.mapping=ui:d===eo&&(f.mapping=Xi),f}function c(f){let d=0;const p=6;for(let x=0;x<p;x++)f[x]!==void 0&&d++;return d===p}function l(f){const d=f.target;d.removeEventListener("dispose",l);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(f){const d=f.target;d.removeEventListener("dispose",h);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function Pg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Gi("WebGLRenderer: "+n+" extension not supported."),s}}}function Ig(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const p in f.attributes)t.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const d in f)t.update(f[d],i.ARRAY_BUFFER)}function l(u){const f=[],d=u.index,p=u.attributes.position;let x=0;if(p===void 0)return;if(d!==null){const _=d.array;x=d.version;for(let y=0,M=_.length;y<M;y+=3){const w=_[y+0],b=_[y+1],T=_[y+2];f.push(w,b,b,T,T,w)}}else{const _=p.array;x=p.version;for(let y=0,M=_.length/3-1;y<M;y+=3){const w=y+0,b=y+1,T=y+2;f.push(w,b,b,T,T,w)}}const g=new(p.count>=65535?Uh:Dh)(f,1);g.version=x;const m=r.get(u);m&&t.remove(m),r.set(u,g)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Lg(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function c(u,f){i.drawElements(n,f,r,u*o),e.update(f,n,1)}function l(u,f,d){d!==0&&(i.drawElementsInstanced(n,f,r,u*o,d),e.update(f,n,d))}function h(u,f,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,d);let x=0;for(let g=0;g<d;g++)x+=f[g];e.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function Dg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:qt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Ug(i,t,e){const n=new WeakMap,s=new he;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let R=function(){v.dispose(),n.delete(a),a.removeEventListener("dispose",R)};var d=R;f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],_=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let M=0;p===!0&&(M=1),x===!0&&(M=2),g===!0&&(M=3);let w=a.attributes.position.count*M,b=1;w>t.maxTextureSize&&(b=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const T=new Float32Array(w*b*4*u),v=new Ih(T,w,b,u);v.type=tn,v.needsUpdate=!0;const E=M*4;for(let P=0;P<u;P++){const I=m[P],k=_[P],G=y[P],D=w*b*4*P;for(let L=0;L<I.count;L++){const U=L*E;p===!0&&(s.fromBufferAttribute(I,L),T[D+U+0]=s.x,T[D+U+1]=s.y,T[D+U+2]=s.z,T[D+U+3]=0),x===!0&&(s.fromBufferAttribute(k,L),T[D+U+4]=s.x,T[D+U+5]=s.y,T[D+U+6]=s.z,T[D+U+7]=0),g===!0&&(s.fromBufferAttribute(G,L),T[D+U+8]=s.x,T[D+U+9]=s.y,T[D+U+10]=s.z,T[D+U+11]=G.itemSize===4?s.w:1)}}f={count:u,texture:v,size:new kt(w,b)},n.set(a,f),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<l.length;g++)p+=l[g];const x=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Ng(i,t,e,n,s){let r=new WeakMap;function o(l){const h=s.render.frame,u=l.geometry,f=t.get(l,u);if(r.get(f)!==h&&(t.update(f),r.set(f,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return f}function a(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}const Fg={[_h]:"LINEAR_TONE_MAPPING",[xh]:"REINHARD_TONE_MAPPING",[vh]:"CINEON_TONE_MAPPING",[Ya]:"ACES_FILMIC_TONE_MAPPING",[yh]:"AGX_TONE_MAPPING",[Sh]:"NEUTRAL_TONE_MAPPING",[Mh]:"CUSTOM_TONE_MAPPING"};function Og(i,t,e,n,s,r){const o=new pn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Zi(t,e):void 0}),a=new pn(t,e,{type:Tn,depthBuffer:!1,stencilBuffer:!1}),c=new ge;c.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Kt([0,2,0,0,2,0],2));const l=new Ad({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new fe(c,l),u=new dc(-1,1,1,-1,0,1);let f=null,d=null,p=!1,x,g=null,m=[],_=!1;this.setSize=function(y,M){o.setSize(y,M),a.setSize(y,M);for(let w=0;w<m.length;w++){const b=m[w];b.setSize&&b.setSize(y,M)}},this.setEffects=function(y){m=y,_=m.length>0&&m[0].isRenderPass===!0;const M=o.width,w=o.height;for(let b=0;b<m.length;b++){const T=m[b];T.setSize&&T.setSize(M,w)}},this.begin=function(y,M){if(p||y.toneMapping===dn&&m.length===0)return!1;if(g=M,M!==null){const w=M.width,b=M.height;(o.width!==w||o.height!==b)&&this.setSize(w,b)}return _===!1&&y.setRenderTarget(o),x=y.toneMapping,y.toneMapping=dn,!0},this.hasRenderPass=function(){return _},this.end=function(y,M){y.toneMapping=x,p=!0;let w=o,b=a;for(let T=0;T<m.length;T++){const v=m[T];if(v.enabled!==!1&&(v.render(y,b,w,M),v.needsSwap!==!1)){const E=w;w=b,b=E}}if(f!==y.outputColorSpace||d!==y.toneMapping){f=y.outputColorSpace,d=y.toneMapping,l.defines={},Yt.getTransfer(f)===jt&&(l.defines.SRGB_TRANSFER="");const T=Fg[d];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=w.texture,y.setRenderTarget(g),y.render(h,u),g=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),c.dispose(),l.dispose()}}const Kh=new Ue,Ua=new Zi(1,1),Jh=new Ih,Qh=new kf,jh=new Oh,Sl=[],El=[],bl=new Float32Array(16),wl=new Float32Array(9),Al=new Float32Array(4);function es(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Sl[s];if(r===void 0&&(r=new Float32Array(s),Sl[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Yr(i,t){let e=El[t];e===void 0&&(e=new Int32Array(t),El[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Bg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function Hg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(we(e,n))return;Al.set(n),i.uniformMatrix2fv(this.addr,!1,Al),Ae(e,n)}}function Vg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(we(e,n))return;wl.set(n),i.uniformMatrix3fv(this.addr,!1,wl),Ae(e,n)}}function Wg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(we(e,n))return;bl.set(n),i.uniformMatrix4fv(this.addr,!1,bl),Ae(e,n)}}function Xg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function $g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function Yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function qg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function Jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function jg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ua.compareFunction=e.isReversedDepthBuffer()?ic:nc,r=Ua):r=Kh,e.setTexture2D(t||r,s)}function t0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Qh,s)}function e0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||jh,s)}function n0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Jh,s)}function i0(i){switch(i){case 5126:return Bg;case 35664:return kg;case 35665:return zg;case 35666:return Gg;case 35674:return Hg;case 35675:return Vg;case 35676:return Wg;case 5124:case 35670:return Xg;case 35667:case 35671:return Zg;case 35668:case 35672:return $g;case 35669:case 35673:return Yg;case 5125:return qg;case 36294:return Kg;case 36295:return Jg;case 36296:return Qg;case 35678:case 36198:case 36298:case 36306:case 35682:return jg;case 35679:case 36299:case 36307:return t0;case 35680:case 36300:case 36308:case 36293:return e0;case 36289:case 36303:case 36311:case 36292:return n0}}function s0(i,t){i.uniform1fv(this.addr,t)}function r0(i,t){const e=es(t,this.size,2);i.uniform2fv(this.addr,e)}function o0(i,t){const e=es(t,this.size,3);i.uniform3fv(this.addr,e)}function a0(i,t){const e=es(t,this.size,4);i.uniform4fv(this.addr,e)}function c0(i,t){const e=es(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function l0(i,t){const e=es(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function h0(i,t){const e=es(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function u0(i,t){i.uniform1iv(this.addr,t)}function f0(i,t){i.uniform2iv(this.addr,t)}function d0(i,t){i.uniform3iv(this.addr,t)}function p0(i,t){i.uniform4iv(this.addr,t)}function m0(i,t){i.uniform1uiv(this.addr,t)}function g0(i,t){i.uniform2uiv(this.addr,t)}function _0(i,t){i.uniform3uiv(this.addr,t)}function x0(i,t){i.uniform4uiv(this.addr,t)}function v0(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ua:o=Kh;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function M0(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Qh,r[o])}function y0(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||jh,r[o])}function S0(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Jh,r[o])}function E0(i){switch(i){case 5126:return s0;case 35664:return r0;case 35665:return o0;case 35666:return a0;case 35674:return c0;case 35675:return l0;case 35676:return h0;case 5124:case 35670:return u0;case 35667:case 35671:return f0;case 35668:case 35672:return d0;case 35669:case 35673:return p0;case 5125:return m0;case 36294:return g0;case 36295:return _0;case 36296:return x0;case 35678:case 36198:case 36298:case 36306:case 35682:return v0;case 35679:case 36299:case 36307:return M0;case 35680:case 36300:case 36308:case 36293:return y0;case 36289:case 36303:case 36311:case 36292:return S0}}class b0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=i0(e.type)}}class w0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=E0(e.type)}}class A0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Io=/(\w+)(\])?(\[|\.)?/g;function Tl(i,t){i.seq.push(t),i.map[t.id]=t}function T0(i,t,e){const n=i.name,s=n.length;for(Io.lastIndex=0;;){const r=Io.exec(n),o=Io.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Tl(e,l===void 0?new b0(a,i,t):new w0(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new A0(a),Tl(e,u)),e=u}}}class Ir{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),c=t.getUniformLocation(e,a.name);T0(a,c,this)}const s=[],r=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Rl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const R0=37297;let C0=0;function P0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Cl=new Bt;function I0(i){Yt._getMatrix(Cl,Yt.workingColorSpace,i);const t=`mat3( ${Cl.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(i)){case Or:return[t,"LinearTransferOETF"];case jt:return[t,"sRGBTransferOETF"];default:return Ut("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Pl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+P0(i.getShaderSource(t),a)}else return r}function L0(i,t){const e=I0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const D0={[_h]:"Linear",[xh]:"Reinhard",[vh]:"Cineon",[Ya]:"ACESFilmic",[yh]:"AgX",[Sh]:"Neutral",[Mh]:"Custom"};function U0(i,t){const e=D0[t];return e===void 0?(Ut("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const gr=new B;function N0(){Yt.getLuminanceCoefficients(gr);const i=gr.x.toFixed(4),t=gr.y.toFixed(4),e=gr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function F0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function O0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function B0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function vs(i){return i!==""}function Il(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ll(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const k0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Na(i){return i.replace(k0,G0)}const z0=new Map;function G0(i,t){let e=Wt[t];if(e===void 0){const n=z0.get(t);if(n!==void 0)e=Wt[n],Ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Na(e)}const H0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Dl(i){return i.replace(H0,V0)}function V0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ul(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const W0={[Ar]:"SHADOWMAP_TYPE_PCF",[gs]:"SHADOWMAP_TYPE_VSM"};function X0(i){return W0[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Z0={[ui]:"ENVMAP_TYPE_CUBE",[Xi]:"ENVMAP_TYPE_CUBE",[Wr]:"ENVMAP_TYPE_CUBE_UV"};function $0(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Z0[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Y0={[Xi]:"ENVMAP_MODE_REFRACTION"};function q0(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Y0[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const K0={[gh]:"ENVMAP_BLENDING_MULTIPLY",[nf]:"ENVMAP_BLENDING_MIX",[sf]:"ENVMAP_BLENDING_ADD"};function J0(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":K0[i.combine]||"ENVMAP_BLENDING_NONE"}function Q0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function j0(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=X0(e),l=$0(e),h=q0(e),u=J0(e),f=Q0(e),d=F0(e),p=O0(r),x=s.createProgram();let g,m,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(vs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(vs).join(`
`),m.length>0&&(m+=`
`)):(g=[Ul(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),m=[Ul(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==dn?"#define TONE_MAPPING":"",e.toneMapping!==dn?Wt.tonemapping_pars_fragment:"",e.toneMapping!==dn?U0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,L0("linearToOutputTexel",e.outputColorSpace),N0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vs).join(`
`)),o=Na(o),o=Il(o,e),o=Ll(o,e),a=Na(a),a=Il(a,e),a=Ll(a,e),o=Dl(o),a=Dl(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===kc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===kc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=_+g+o,M=_+m+a,w=Rl(s,s.VERTEX_SHADER,y),b=Rl(s,s.FRAGMENT_SHADER,M);s.attachShader(x,w),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function T(P){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(x)||"",k=s.getShaderInfoLog(w)||"",G=s.getShaderInfoLog(b)||"",D=I.trim(),L=k.trim(),U=G.trim();let W=!0,X=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,b);else{const J=Pl(s,w,"vertex"),it=Pl(s,b,"fragment");qt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+D+`
`+J+`
`+it)}else D!==""?Ut("WebGLProgram: Program Info Log:",D):(L===""||U==="")&&(X=!1);X&&(P.diagnostics={runnable:W,programLog:D,vertexShader:{log:L,prefix:g},fragmentShader:{log:U,prefix:m}})}s.deleteShader(w),s.deleteShader(b),v=new Ir(s,x),E=B0(s,x)}let v;this.getUniforms=function(){return v===void 0&&T(this),v};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(x,R0)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=C0++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=b,this}let t_=0;class e_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new n_(t),e.set(t,n)),n}}class n_{constructor(t){this.id=t_++,this.code=t,this.usedTimes=0}}function i_(i){return i===fi||i===Ur||i===Nr}function s_(i,t,e,n,s,r){const o=new oc,a=new e_,c=new Set,l=[],h=new Map,u=n.logarithmicDepthBuffer;let f=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return c.add(v),v===0?"uv":`uv${v}`}function x(v,E,R,P,I,k){const G=P.fog,D=I.geometry,L=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,U=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,W=t.get(v.envMap||L,U),X=W&&W.mapping===Wr?W.image.height:null,J=d[v.type];v.precision!==null&&(f=n.getMaxPrecision(v.precision),f!==v.precision&&Ut("WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const it=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,et=it!==void 0?it.length:0;let ct=0;D.morphAttributes.position!==void 0&&(ct=1),D.morphAttributes.normal!==void 0&&(ct=2),D.morphAttributes.color!==void 0&&(ct=3);let Et,ot,Y,nt;if(J){const wt=un[J];Et=wt.vertexShader,ot=wt.fragmentShader}else{Et=v.vertexShader,ot=v.fragmentShader;const wt=a.getVertexShaderStage(v),pe=a.getFragmentShaderStage(v);a.update(v,wt,pe),Y=wt.id,nt=pe.id}const j=i.getRenderTarget(),at=i.state.buffers.depth.getReversed(),yt=I.isInstancedMesh===!0,bt=I.isBatchedMesh===!0,Vt=!!v.map,Ft=!!v.matcap,Zt=!!W,Ot=!!v.aoMap,Dt=!!v.lightMap,te=!!v.bumpMap&&v.wireframe===!1,ae=!!v.normalMap,ye=!!v.displacementMap,Se=!!v.emissiveMap,ce=!!v.metalnessMap,le=!!v.roughnessMap,F=v.anisotropy>0,de=v.clearcoat>0,Qt=v.dispersion>0,C=v.iridescence>0,S=v.sheen>0,z=v.transmission>0,Z=F&&!!v.anisotropyMap,q=de&&!!v.clearcoatMap,rt=de&&!!v.clearcoatNormalMap,ht=de&&!!v.clearcoatRoughnessMap,K=C&&!!v.iridescenceMap,tt=C&&!!v.iridescenceThicknessMap,ft=S&&!!v.sheenColorMap,Rt=S&&!!v.sheenRoughnessMap,mt=!!v.specularMap,dt=!!v.specularColorMap,It=!!v.specularIntensityMap,Lt=z&&!!v.transmissionMap,zt=z&&!!v.thicknessMap,N=!!v.gradientMap,lt=!!v.alphaMap,Q=v.alphaTest>0,pt=!!v.alphaHash,vt=!!v.extensions;let st=dn;v.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(st=i.toneMapping);const Tt={shaderID:J,shaderType:v.type,shaderName:v.name,vertexShader:Et,fragmentShader:ot,defines:v.defines,customVertexShaderID:Y,customFragmentShaderID:nt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:bt,batchingColor:bt&&I._colorsTexture!==null,instancing:yt,instancingColor:yt&&I.instanceColor!==null,instancingMorph:yt&&I.morphTexture!==null,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Yt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Vt,matcap:Ft,envMap:Zt,envMapMode:Zt&&W.mapping,envMapCubeUVHeight:X,aoMap:Ot,lightMap:Dt,bumpMap:te,normalMap:ae,displacementMap:ye,emissiveMap:Se,normalMapObjectSpace:ae&&v.normalMapType===af,normalMapTangentSpace:ae&&v.normalMapType===Pa,packedNormalMap:ae&&v.normalMapType===Pa&&i_(v.normalMap.format),metalnessMap:ce,roughnessMap:le,anisotropy:F,anisotropyMap:Z,clearcoat:de,clearcoatMap:q,clearcoatNormalMap:rt,clearcoatRoughnessMap:ht,dispersion:Qt,iridescence:C,iridescenceMap:K,iridescenceThicknessMap:tt,sheen:S,sheenColorMap:ft,sheenRoughnessMap:Rt,specularMap:mt,specularColorMap:dt,specularIntensityMap:It,transmission:z,transmissionMap:Lt,thicknessMap:zt,gradientMap:N,opaque:v.transparent===!1&&v.blending===zi&&v.alphaToCoverage===!1,alphaMap:lt,alphaTest:Q,alphaHash:pt,combine:v.combine,mapUv:Vt&&p(v.map.channel),aoMapUv:Ot&&p(v.aoMap.channel),lightMapUv:Dt&&p(v.lightMap.channel),bumpMapUv:te&&p(v.bumpMap.channel),normalMapUv:ae&&p(v.normalMap.channel),displacementMapUv:ye&&p(v.displacementMap.channel),emissiveMapUv:Se&&p(v.emissiveMap.channel),metalnessMapUv:ce&&p(v.metalnessMap.channel),roughnessMapUv:le&&p(v.roughnessMap.channel),anisotropyMapUv:Z&&p(v.anisotropyMap.channel),clearcoatMapUv:q&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:rt&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&p(v.sheenRoughnessMap.channel),specularMapUv:mt&&p(v.specularMap.channel),specularColorMapUv:dt&&p(v.specularColorMap.channel),specularIntensityMapUv:It&&p(v.specularIntensityMap.channel),transmissionMapUv:Lt&&p(v.transmissionMap.channel),thicknessMapUv:zt&&p(v.thicknessMap.channel),alphaMapUv:lt&&p(v.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(ae||F),vertexNormals:!!D.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(Vt||lt),fog:!!G,useFog:v.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||D.attributes.normal===void 0&&ae===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:at,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:ct,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:st,decodeVideoTexture:Vt&&v.map.isVideoTexture===!0&&Yt.getTransfer(v.map.colorSpace)===jt,decodeVideoTextureEmissive:Se&&v.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(v.emissiveMap.colorSpace)===jt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Sn,flipSided:v.side===ke,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:vt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&v.extensions.multiDraw===!0||bt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Tt.vertexUv1s=c.has(1),Tt.vertexUv2s=c.has(2),Tt.vertexUv3s=c.has(3),c.clear(),Tt}function g(v){const E=[];if(v.shaderID?E.push(v.shaderID):(E.push(v.customVertexShaderID),E.push(v.customFragmentShaderID)),v.defines!==void 0)for(const R in v.defines)E.push(R),E.push(v.defines[R]);return v.isRawShaderMaterial===!1&&(m(E,v),_(E,v),E.push(i.outputColorSpace)),E.push(v.customProgramCacheKey),E.join()}function m(v,E){v.push(E.precision),v.push(E.outputColorSpace),v.push(E.envMapMode),v.push(E.envMapCubeUVHeight),v.push(E.mapUv),v.push(E.alphaMapUv),v.push(E.lightMapUv),v.push(E.aoMapUv),v.push(E.bumpMapUv),v.push(E.normalMapUv),v.push(E.displacementMapUv),v.push(E.emissiveMapUv),v.push(E.metalnessMapUv),v.push(E.roughnessMapUv),v.push(E.anisotropyMapUv),v.push(E.clearcoatMapUv),v.push(E.clearcoatNormalMapUv),v.push(E.clearcoatRoughnessMapUv),v.push(E.iridescenceMapUv),v.push(E.iridescenceThicknessMapUv),v.push(E.sheenColorMapUv),v.push(E.sheenRoughnessMapUv),v.push(E.specularMapUv),v.push(E.specularColorMapUv),v.push(E.specularIntensityMapUv),v.push(E.transmissionMapUv),v.push(E.thicknessMapUv),v.push(E.combine),v.push(E.fogExp2),v.push(E.sizeAttenuation),v.push(E.morphTargetsCount),v.push(E.morphAttributeCount),v.push(E.numDirLights),v.push(E.numPointLights),v.push(E.numSpotLights),v.push(E.numSpotLightMaps),v.push(E.numHemiLights),v.push(E.numRectAreaLights),v.push(E.numDirLightShadows),v.push(E.numPointLightShadows),v.push(E.numSpotLightShadows),v.push(E.numSpotLightShadowsWithMaps),v.push(E.numLightProbes),v.push(E.shadowMapType),v.push(E.toneMapping),v.push(E.numClippingPlanes),v.push(E.numClipIntersection),v.push(E.depthPacking)}function _(v,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function y(v){const E=d[v.type];let R;if(E){const P=un[E];R=Ed.clone(P.uniforms)}else R=v.uniforms;return R}function M(v,E){let R=h.get(E);return R!==void 0?++R.usedTimes:(R=new j0(i,E,v,s),l.push(R),h.set(E,R)),R}function w(v){if(--v.usedTimes===0){const E=l.indexOf(v);l[E]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function b(v){a.remove(v)}function T(){a.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:y,acquireProgram:M,releaseProgram:w,releaseShaderCache:b,programs:l,dispose:T}}function r_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function o_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Nl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Fl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,p,x,g,m){let _=i[t];return _===void 0?(_={id:f.id,object:f,geometry:d,material:p,materialVariant:o(f),groupOrder:x,renderOrder:f.renderOrder,z:g,group:m},i[t]=_):(_.id=f.id,_.object=f,_.geometry=d,_.material=p,_.materialVariant=o(f),_.groupOrder=x,_.renderOrder=f.renderOrder,_.z=g,_.group=m),t++,_}function c(f,d,p,x,g,m){const _=a(f,d,p,x,g,m);p.transmission>0?n.push(_):p.transparent===!0?s.push(_):e.push(_)}function l(f,d,p,x,g,m){const _=a(f,d,p,x,g,m);p.transmission>0?n.unshift(_):p.transparent===!0?s.unshift(_):e.unshift(_)}function h(f,d,p){e.length>1&&e.sort(f||o_),n.length>1&&n.sort(d||Nl),s.length>1&&s.sort(d||Nl),p&&(e.reverse(),n.reverse(),s.reverse())}function u(){for(let f=t,d=i.length;f<d;f++){const p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:u,sort:h}}function a_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Fl,i.set(n,[o])):s>=r.length?(o=new Fl,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function c_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new ut};break;case"SpotLight":e={position:new B,direction:new B,color:new ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new ut,groundColor:new ut};break;case"RectAreaLight":e={color:new ut,position:new B,halfWidth:new B,halfHeight:new B};break}return i[t.id]=e,e}}}function l_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let h_=0;function u_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function f_(i){const t=new c_,e=l_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new B);const s=new B,r=new se,o=new se;function a(l){let h=0,u=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let d=0,p=0,x=0,g=0,m=0,_=0,y=0,M=0,w=0,b=0,T=0;l.sort(u_);for(let E=0,R=l.length;E<R;E++){const P=l[E],I=P.color,k=P.intensity,G=P.distance;let D=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===fi?D=P.shadow.map.texture:D=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=I.r*k,u+=I.g*k,f+=I.b*k;else if(P.isLightProbe){for(let L=0;L<9;L++)n.probe[L].addScaledVector(P.sh.coefficients[L],k);T++}else if(P.isDirectionalLight){const L=t.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const U=P.shadow,W=e.get(P);W.shadowIntensity=U.intensity,W.shadowBias=U.bias,W.shadowNormalBias=U.normalBias,W.shadowRadius=U.radius,W.shadowMapSize=U.mapSize,n.directionalShadow[d]=W,n.directionalShadowMap[d]=D,n.directionalShadowMatrix[d]=P.shadow.matrix,_++}n.directional[d]=L,d++}else if(P.isSpotLight){const L=t.get(P);L.position.setFromMatrixPosition(P.matrixWorld),L.color.copy(I).multiplyScalar(k),L.distance=G,L.coneCos=Math.cos(P.angle),L.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),L.decay=P.decay,n.spot[x]=L;const U=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,U.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[x]=U.matrix,P.castShadow){const W=e.get(P);W.shadowIntensity=U.intensity,W.shadowBias=U.bias,W.shadowNormalBias=U.normalBias,W.shadowRadius=U.radius,W.shadowMapSize=U.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=D,M++}x++}else if(P.isRectAreaLight){const L=t.get(P);L.color.copy(I).multiplyScalar(k),L.halfWidth.set(P.width*.5,0,0),L.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=L,g++}else if(P.isPointLight){const L=t.get(P);if(L.color.copy(P.color).multiplyScalar(P.intensity),L.distance=P.distance,L.decay=P.decay,P.castShadow){const U=P.shadow,W=e.get(P);W.shadowIntensity=U.intensity,W.shadowBias=U.bias,W.shadowNormalBias=U.normalBias,W.shadowRadius=U.radius,W.shadowMapSize=U.mapSize,W.shadowCameraNear=U.camera.near,W.shadowCameraFar=U.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=D,n.pointShadowMatrix[p]=P.shadow.matrix,y++}n.point[p]=L,p++}else if(P.isHemisphereLight){const L=t.get(P);L.skyColor.copy(P.color).multiplyScalar(k),L.groundColor.copy(P.groundColor).multiplyScalar(k),n.hemi[m]=L,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const v=n.hash;(v.directionalLength!==d||v.pointLength!==p||v.spotLength!==x||v.rectAreaLength!==g||v.hemiLength!==m||v.numDirectionalShadows!==_||v.numPointShadows!==y||v.numSpotShadows!==M||v.numSpotMaps!==w||v.numLightProbes!==T)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=M+w-b,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=T,v.directionalLength=d,v.pointLength=p,v.spotLength=x,v.rectAreaLength=g,v.hemiLength=m,v.numDirectionalShadows=_,v.numPointShadows=y,v.numSpotShadows=M,v.numSpotMaps=w,v.numLightProbes=T,n.version=h_++)}function c(l,h){let u=0,f=0,d=0,p=0,x=0;const g=h.matrixWorldInverse;for(let m=0,_=l.length;m<_;m++){const y=l[m];if(y.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),u++}else if(y.isSpotLight){const M=n.spot[d];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),d++}else if(y.isRectAreaLight){const M=n.rectArea[p];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(y.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(g),x++}}}return{setup:a,setupView:c,state:n}}function Ol(i){const t=new f_(i),e=[],n=[],s=[];function r(f){u.camera=f,e.length=0,n.length=0,s.length=0}function o(f){e.push(f)}function a(f){n.push(f)}function c(f){s.push(f)}function l(){t.setup(e)}function h(f){t.setupView(e,f)}const u={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function d_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Ol(i),t.set(s,[a])):r>=o.length?(a=new Ol(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const p_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,m_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,g_=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],__=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Bl=new se,hs=new B,Lo=new B;function x_(i,t,e){let n=new lc;const s=new kt,r=new kt,o=new he,a=new Td,c=new Rd,l={},h=e.maxTextureSize,u={[Zn]:ke,[ke]:Zn,[Sn]:Sn},f=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new kt},radius:{value:4}},vertexShader:p_,fragmentShader:m_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const p=new ge;p.setAttribute("position",new Re(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new fe(p,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ar;let m=this.type;this.render=function(b,T,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===mh&&(Ut("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ar);const E=i.getRenderTarget(),R=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),I=i.state;I.setBlending(bn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const k=m!==this.type;k&&T.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(D=>D.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,D=b.length;G<D;G++){const L=b[G],U=L.shadow;if(U===void 0){Ut("WebGLShadowMap:",L,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);const W=U.getFrameExtents();s.multiply(W),r.copy(U.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/W.x),s.x=r.x*W.x,U.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/W.y),s.y=r.y*W.y,U.mapSize.y=r.y));const X=i.state.buffers.depth.getReversed();if(U.camera._reversedDepth=X,U.map===null||k===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===gs){if(L.isPointLight){Ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new pn(s.x,s.y,{format:fi,type:Tn,minFilter:De,magFilter:De,generateMipmaps:!1}),U.map.texture.name=L.name+".shadowMap",U.map.depthTexture=new Zi(s.x,s.y,tn),U.map.depthTexture.name=L.name+".shadowMapDepth",U.map.depthTexture.format=Rn,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Ce,U.map.depthTexture.magFilter=Ce}else L.isPointLight?(U.map=new qh(s.x),U.map.depthTexture=new id(s.x,mn)):(U.map=new pn(s.x,s.y),U.map.depthTexture=new Zi(s.x,s.y,mn)),U.map.depthTexture.name=L.name+".shadowMap",U.map.depthTexture.format=Rn,this.type===Ar?(U.map.depthTexture.compareFunction=X?ic:nc,U.map.depthTexture.minFilter=De,U.map.depthTexture.magFilter=De):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Ce,U.map.depthTexture.magFilter=Ce);U.camera.updateProjectionMatrix()}const J=U.map.isWebGLCubeRenderTarget?6:1;for(let it=0;it<J;it++){if(U.map.isWebGLCubeRenderTarget)i.setRenderTarget(U.map,it),i.clear();else{it===0&&(i.setRenderTarget(U.map),i.clear());const et=U.getViewport(it);o.set(r.x*et.x,r.y*et.y,r.x*et.z,r.y*et.w),I.viewport(o)}if(L.isPointLight){const et=U.camera,ct=U.matrix,Et=L.distance||et.far;Et!==et.far&&(et.far=Et,et.updateProjectionMatrix()),hs.setFromMatrixPosition(L.matrixWorld),et.position.copy(hs),Lo.copy(et.position),Lo.add(g_[it]),et.up.copy(__[it]),et.lookAt(Lo),et.updateMatrixWorld(),ct.makeTranslation(-hs.x,-hs.y,-hs.z),Bl.multiplyMatrices(et.projectionMatrix,et.matrixWorldInverse),U._frustum.setFromProjectionMatrix(Bl,et.coordinateSystem,et.reversedDepth)}else U.updateMatrices(L);n=U.getFrustum(),M(T,v,U.camera,L,this.type)}U.isPointLightShadow!==!0&&this.type===gs&&_(U,v),U.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(E,R,P)};function _(b,T){const v=t.update(x);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new pn(s.x,s.y,{format:fi,type:Tn})),f.uniforms.shadow_pass.value=b.map.depthTexture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(T,null,v,f,x,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(T,null,v,d,x,null)}function y(b,T,v,E){let R=null;const P=v.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)R=P;else if(R=v.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const I=R.uuid,k=T.uuid;let G=l[I];G===void 0&&(G={},l[I]=G);let D=G[k];D===void 0&&(D=R.clone(),G[k]=D,T.addEventListener("dispose",w)),R=D}if(R.visible=T.visible,R.wireframe=T.wireframe,E===gs?R.side=T.shadowSide!==null?T.shadowSide:T.side:R.side=T.shadowSide!==null?T.shadowSide:u[T.side],R.alphaMap=T.alphaMap,R.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,R.map=T.map,R.clipShadows=T.clipShadows,R.clippingPlanes=T.clippingPlanes,R.clipIntersection=T.clipIntersection,R.displacementMap=T.displacementMap,R.displacementScale=T.displacementScale,R.displacementBias=T.displacementBias,R.wireframeLinewidth=T.wireframeLinewidth,R.linewidth=T.linewidth,v.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const I=i.properties.get(R);I.light=v}return R}function M(b,T,v,E,R){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&R===gs)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,b.matrixWorld);const k=t.update(b),G=b.material;if(Array.isArray(G)){const D=k.groups;for(let L=0,U=D.length;L<U;L++){const W=D[L],X=G[W.materialIndex];if(X&&X.visible){const J=y(b,X,E,R);b.onBeforeShadow(i,b,T,v,k,J,W),i.renderBufferDirect(v,null,k,J,b,W),b.onAfterShadow(i,b,T,v,k,J,W)}}}else if(G.visible){const D=y(b,G,E,R);b.onBeforeShadow(i,b,T,v,k,D,null),i.renderBufferDirect(v,null,k,D,b,null),b.onAfterShadow(i,b,T,v,k,D,null)}}const I=b.children;for(let k=0,G=I.length;k<G;k++)M(I[k],T,v,E,R)}function w(b){b.target.removeEventListener("dispose",w);for(const v in l){const E=l[v],R=b.target.uuid;R in E&&(E[R].dispose(),delete E[R])}}}function v_(i,t){function e(){let N=!1;const lt=new he;let Q=null;const pt=new he(0,0,0,0);return{setMask:function(vt){Q!==vt&&!N&&(i.colorMask(vt,vt,vt,vt),Q=vt)},setLocked:function(vt){N=vt},setClear:function(vt,st,Tt,wt,pe){pe===!0&&(vt*=wt,st*=wt,Tt*=wt),lt.set(vt,st,Tt,wt),pt.equals(lt)===!1&&(i.clearColor(vt,st,Tt,wt),pt.copy(lt))},reset:function(){N=!1,Q=null,pt.set(-1,0,0,0)}}}function n(){let N=!1,lt=!1,Q=null,pt=null,vt=null;return{setReversed:function(st){if(lt!==st){const Tt=t.get("EXT_clip_control");st?Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.ZERO_TO_ONE_EXT):Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.NEGATIVE_ONE_TO_ONE_EXT),lt=st;const wt=vt;vt=null,this.setClear(wt)}},getReversed:function(){return lt},setTest:function(st){st?j(i.DEPTH_TEST):at(i.DEPTH_TEST)},setMask:function(st){Q!==st&&!N&&(i.depthMask(st),Q=st)},setFunc:function(st){if(lt&&(st=_f[st]),pt!==st){switch(st){case Zo:i.depthFunc(i.NEVER);break;case $o:i.depthFunc(i.ALWAYS);break;case Yo:i.depthFunc(i.LESS);break;case Wi:i.depthFunc(i.LEQUAL);break;case qo:i.depthFunc(i.EQUAL);break;case Ko:i.depthFunc(i.GEQUAL);break;case Jo:i.depthFunc(i.GREATER);break;case Qo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}pt=st}},setLocked:function(st){N=st},setClear:function(st){vt!==st&&(vt=st,lt&&(st=1-st),i.clearDepth(st))},reset:function(){N=!1,Q=null,pt=null,vt=null,lt=!1}}}function s(){let N=!1,lt=null,Q=null,pt=null,vt=null,st=null,Tt=null,wt=null,pe=null;return{setTest:function(re){N||(re?j(i.STENCIL_TEST):at(i.STENCIL_TEST))},setMask:function(re){lt!==re&&!N&&(i.stencilMask(re),lt=re)},setFunc:function(re,rn,on){(Q!==re||pt!==rn||vt!==on)&&(i.stencilFunc(re,rn,on),Q=re,pt=rn,vt=on)},setOp:function(re,rn,on){(st!==re||Tt!==rn||wt!==on)&&(i.stencilOp(re,rn,on),st=re,Tt=rn,wt=on)},setLocked:function(re){N=re},setClear:function(re){pe!==re&&(i.clearStencil(re),pe=re)},reset:function(){N=!1,lt=null,Q=null,pt=null,vt=null,st=null,Tt=null,wt=null,pe=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f={},d=new WeakMap,p=[],x=null,g=!1,m=null,_=null,y=null,M=null,w=null,b=null,T=null,v=new ut(0,0,0),E=0,R=!1,P=null,I=null,k=null,G=null,D=null;const L=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,W=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(X)[1]),U=W>=1):X.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),U=W>=2);let J=null,it={};const et=i.getParameter(i.SCISSOR_BOX),ct=i.getParameter(i.VIEWPORT),Et=new he().fromArray(et),ot=new he().fromArray(ct);function Y(N,lt,Q,pt){const vt=new Uint8Array(4),st=i.createTexture();i.bindTexture(N,st),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Tt=0;Tt<Q;Tt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(lt,0,i.RGBA,1,1,pt,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(lt+Tt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return st}const nt={};nt[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),nt[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),nt[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),nt[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(i.DEPTH_TEST),o.setFunc(Wi),te(!1),ae(Dc),j(i.CULL_FACE),Ot(bn);function j(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function at(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function yt(N,lt){return f[N]!==lt?(i.bindFramebuffer(N,lt),f[N]=lt,N===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=lt),N===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=lt),!0):!1}function bt(N,lt){let Q=p,pt=!1;if(N){Q=d.get(lt),Q===void 0&&(Q=[],d.set(lt,Q));const vt=N.textures;if(Q.length!==vt.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let st=0,Tt=vt.length;st<Tt;st++)Q[st]=i.COLOR_ATTACHMENT0+st;Q.length=vt.length,pt=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,pt=!0);pt&&i.drawBuffers(Q)}function Vt(N){return x!==N?(i.useProgram(N),x=N,!0):!1}const Ft={[ii]:i.FUNC_ADD,[ku]:i.FUNC_SUBTRACT,[zu]:i.FUNC_REVERSE_SUBTRACT};Ft[Gu]=i.MIN,Ft[Hu]=i.MAX;const Zt={[Vu]:i.ZERO,[Wu]:i.ONE,[Xu]:i.SRC_COLOR,[Wo]:i.SRC_ALPHA,[Ju]:i.SRC_ALPHA_SATURATE,[qu]:i.DST_COLOR,[$u]:i.DST_ALPHA,[Zu]:i.ONE_MINUS_SRC_COLOR,[Xo]:i.ONE_MINUS_SRC_ALPHA,[Ku]:i.ONE_MINUS_DST_COLOR,[Yu]:i.ONE_MINUS_DST_ALPHA,[Qu]:i.CONSTANT_COLOR,[ju]:i.ONE_MINUS_CONSTANT_COLOR,[tf]:i.CONSTANT_ALPHA,[ef]:i.ONE_MINUS_CONSTANT_ALPHA};function Ot(N,lt,Q,pt,vt,st,Tt,wt,pe,re){if(N===bn){g===!0&&(at(i.BLEND),g=!1);return}if(g===!1&&(j(i.BLEND),g=!0),N!==Bu){if(N!==m||re!==R){if((_!==ii||w!==ii)&&(i.blendEquation(i.FUNC_ADD),_=ii,w=ii),re)switch(N){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uc:i.blendFunc(i.ONE,i.ONE);break;case Nc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Fc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qt("WebGLState: Invalid blending: ",N);break}else switch(N){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Nc:qt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fc:qt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qt("WebGLState: Invalid blending: ",N);break}y=null,M=null,b=null,T=null,v.set(0,0,0),E=0,m=N,R=re}return}vt=vt||lt,st=st||Q,Tt=Tt||pt,(lt!==_||vt!==w)&&(i.blendEquationSeparate(Ft[lt],Ft[vt]),_=lt,w=vt),(Q!==y||pt!==M||st!==b||Tt!==T)&&(i.blendFuncSeparate(Zt[Q],Zt[pt],Zt[st],Zt[Tt]),y=Q,M=pt,b=st,T=Tt),(wt.equals(v)===!1||pe!==E)&&(i.blendColor(wt.r,wt.g,wt.b,pe),v.copy(wt),E=pe),m=N,R=!1}function Dt(N,lt){N.side===Sn?at(i.CULL_FACE):j(i.CULL_FACE);let Q=N.side===ke;lt&&(Q=!Q),te(Q),N.blending===zi&&N.transparent===!1?Ot(bn):Ot(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const pt=N.stencilWrite;a.setTest(pt),pt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Se(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):at(i.SAMPLE_ALPHA_TO_COVERAGE)}function te(N){P!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),P=N)}function ae(N){N!==Fu?(j(i.CULL_FACE),N!==I&&(N===Dc?i.cullFace(i.BACK):N===Ou?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):at(i.CULL_FACE),I=N}function ye(N){N!==k&&(U&&i.lineWidth(N),k=N)}function Se(N,lt,Q){N?(j(i.POLYGON_OFFSET_FILL),(G!==lt||D!==Q)&&(G=lt,D=Q,o.getReversed()&&(lt=-lt),i.polygonOffset(lt,Q))):at(i.POLYGON_OFFSET_FILL)}function ce(N){N?j(i.SCISSOR_TEST):at(i.SCISSOR_TEST)}function le(N){N===void 0&&(N=i.TEXTURE0+L-1),J!==N&&(i.activeTexture(N),J=N)}function F(N,lt,Q){Q===void 0&&(J===null?Q=i.TEXTURE0+L-1:Q=J);let pt=it[Q];pt===void 0&&(pt={type:void 0,texture:void 0},it[Q]=pt),(pt.type!==N||pt.texture!==lt)&&(J!==Q&&(i.activeTexture(Q),J=Q),i.bindTexture(N,lt||nt[N]),pt.type=N,pt.texture=lt)}function de(){const N=it[J];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Qt(){try{i.compressedTexImage2D(...arguments)}catch(N){qt("WebGLState:",N)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(N){qt("WebGLState:",N)}}function S(){try{i.texSubImage2D(...arguments)}catch(N){qt("WebGLState:",N)}}function z(){try{i.texSubImage3D(...arguments)}catch(N){qt("WebGLState:",N)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(N){qt("WebGLState:",N)}}function q(){try{i.compressedTexSubImage3D(...arguments)}catch(N){qt("WebGLState:",N)}}function rt(){try{i.texStorage2D(...arguments)}catch(N){qt("WebGLState:",N)}}function ht(){try{i.texStorage3D(...arguments)}catch(N){qt("WebGLState:",N)}}function K(){try{i.texImage2D(...arguments)}catch(N){qt("WebGLState:",N)}}function tt(){try{i.texImage3D(...arguments)}catch(N){qt("WebGLState:",N)}}function ft(N){return u[N]!==void 0?u[N]:i.getParameter(N)}function Rt(N,lt){u[N]!==lt&&(i.pixelStorei(N,lt),u[N]=lt)}function mt(N){Et.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Et.copy(N))}function dt(N){ot.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),ot.copy(N))}function It(N,lt){let Q=l.get(lt);Q===void 0&&(Q=new WeakMap,l.set(lt,Q));let pt=Q.get(N);pt===void 0&&(pt=i.getUniformBlockIndex(lt,N.name),Q.set(N,pt))}function Lt(N,lt){const pt=l.get(lt).get(N);c.get(lt)!==pt&&(i.uniformBlockBinding(lt,pt,N.__bindingPointIndex),c.set(lt,pt))}function zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},J=null,it={},f={},d=new WeakMap,p=[],x=null,g=!1,m=null,_=null,y=null,M=null,w=null,b=null,T=null,v=new ut(0,0,0),E=0,R=!1,P=null,I=null,k=null,G=null,D=null,Et.set(0,0,i.canvas.width,i.canvas.height),ot.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:j,disable:at,bindFramebuffer:yt,drawBuffers:bt,useProgram:Vt,setBlending:Ot,setMaterial:Dt,setFlipSided:te,setCullFace:ae,setLineWidth:ye,setPolygonOffset:Se,setScissorTest:ce,activeTexture:le,bindTexture:F,unbindTexture:de,compressedTexImage2D:Qt,compressedTexImage3D:C,texImage2D:K,texImage3D:tt,pixelStorei:Rt,getParameter:ft,updateUBOMapping:It,uniformBlockBinding:Lt,texStorage2D:rt,texStorage3D:ht,texSubImage2D:S,texSubImage3D:z,compressedTexSubImage2D:Z,compressedTexSubImage3D:q,scissor:mt,viewport:dt,reset:zt}}function M_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new kt,h=new WeakMap,u=new Set;let f;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,S){return p?new OffscreenCanvas(C,S):Br("canvas")}function g(C,S,z){let Z=1;const q=Qt(C);if((q.width>z||q.height>z)&&(Z=z/Math.max(q.width,q.height)),Z<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const rt=Math.floor(Z*q.width),ht=Math.floor(Z*q.height);f===void 0&&(f=x(rt,ht));const K=S?x(rt,ht):f;return K.width=rt,K.height=ht,K.getContext("2d").drawImage(C,0,0,rt,ht),Ut("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+rt+"x"+ht+")."),K}else return"data"in C&&Ut("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),C;return C}function m(C){return C.generateMipmaps}function _(C){i.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(C,S,z,Z,q,rt=!1){if(C!==null){if(i[C]!==void 0)return i[C];Ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ht;Z&&(ht=t.get("EXT_texture_norm16"),ht||Ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=S;if(S===i.RED&&(z===i.FLOAT&&(K=i.R32F),z===i.HALF_FLOAT&&(K=i.R16F),z===i.UNSIGNED_BYTE&&(K=i.R8),z===i.UNSIGNED_SHORT&&ht&&(K=ht.R16_EXT),z===i.SHORT&&ht&&(K=ht.R16_SNORM_EXT)),S===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.R8UI),z===i.UNSIGNED_SHORT&&(K=i.R16UI),z===i.UNSIGNED_INT&&(K=i.R32UI),z===i.BYTE&&(K=i.R8I),z===i.SHORT&&(K=i.R16I),z===i.INT&&(K=i.R32I)),S===i.RG&&(z===i.FLOAT&&(K=i.RG32F),z===i.HALF_FLOAT&&(K=i.RG16F),z===i.UNSIGNED_BYTE&&(K=i.RG8),z===i.UNSIGNED_SHORT&&ht&&(K=ht.RG16_EXT),z===i.SHORT&&ht&&(K=ht.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RG8UI),z===i.UNSIGNED_SHORT&&(K=i.RG16UI),z===i.UNSIGNED_INT&&(K=i.RG32UI),z===i.BYTE&&(K=i.RG8I),z===i.SHORT&&(K=i.RG16I),z===i.INT&&(K=i.RG32I)),S===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RGB8UI),z===i.UNSIGNED_SHORT&&(K=i.RGB16UI),z===i.UNSIGNED_INT&&(K=i.RGB32UI),z===i.BYTE&&(K=i.RGB8I),z===i.SHORT&&(K=i.RGB16I),z===i.INT&&(K=i.RGB32I)),S===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),z===i.UNSIGNED_INT&&(K=i.RGBA32UI),z===i.BYTE&&(K=i.RGBA8I),z===i.SHORT&&(K=i.RGBA16I),z===i.INT&&(K=i.RGBA32I)),S===i.RGB&&(z===i.UNSIGNED_SHORT&&ht&&(K=ht.RGB16_EXT),z===i.SHORT&&ht&&(K=ht.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),S===i.RGBA){const tt=rt?Or:Yt.getTransfer(q);z===i.FLOAT&&(K=i.RGBA32F),z===i.HALF_FLOAT&&(K=i.RGBA16F),z===i.UNSIGNED_BYTE&&(K=tt===jt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&ht&&(K=ht.RGBA16_EXT),z===i.SHORT&&ht&&(K=ht.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function w(C,S){let z;return C?S===null||S===mn||S===Cs?z=i.DEPTH24_STENCIL8:S===tn?z=i.DEPTH32F_STENCIL8:S===Rs&&(z=i.DEPTH24_STENCIL8,Ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===mn||S===Cs?z=i.DEPTH_COMPONENT24:S===tn?z=i.DEPTH_COMPONENT32F:S===Rs&&(z=i.DEPTH_COMPONENT16),z}function b(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ce&&C.minFilter!==De?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function T(C){const S=C.target;S.removeEventListener("dispose",T),E(S),S.isVideoTexture&&h.delete(S),S.isHTMLTexture&&u.delete(S)}function v(C){const S=C.target;S.removeEventListener("dispose",v),P(S)}function E(C){const S=n.get(C);if(S.__webglInit===void 0)return;const z=C.source,Z=d.get(z);if(Z){const q=Z[S.__cacheKey];q.usedTimes--,q.usedTimes===0&&R(C),Object.keys(Z).length===0&&d.delete(z)}n.remove(C)}function R(C){const S=n.get(C);i.deleteTexture(S.__webglTexture);const z=C.source,Z=d.get(z);delete Z[S.__cacheKey],o.memory.textures--}function P(C){const S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let q=0;q<S.__webglFramebuffer[Z].length;q++)i.deleteFramebuffer(S.__webglFramebuffer[Z][q]);else i.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)i.deleteFramebuffer(S.__webglFramebuffer[Z]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=C.textures;for(let Z=0,q=z.length;Z<q;Z++){const rt=n.get(z[Z]);rt.__webglTexture&&(i.deleteTexture(rt.__webglTexture),o.memory.textures--),n.remove(z[Z])}n.remove(C)}let I=0;function k(){I=0}function G(){return I}function D(C){I=C}function L(){const C=I;return C>=s.maxTextures&&Ut("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),I+=1,C}function U(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function W(C,S){const z=n.get(C);if(C.isVideoTexture&&F(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&z.__version!==C.version){const Z=C.image;if(Z===null)Ut("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Ut("WebGLRenderer: Texture marked for update but image is incomplete");else{at(z,C,S);return}}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+S)}function X(C,S){const z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){at(z,C,S);return}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+S)}function J(C,S){const z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){at(z,C,S);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+S)}function it(C,S){const z=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&z.__version!==C.version){yt(z,C,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+S)}const et={[An]:i.REPEAT,[En]:i.CLAMP_TO_EDGE,[jo]:i.MIRRORED_REPEAT},ct={[Ce]:i.NEAREST,[rf]:i.NEAREST_MIPMAP_NEAREST,[Ws]:i.NEAREST_MIPMAP_LINEAR,[De]:i.LINEAR,[no]:i.LINEAR_MIPMAP_NEAREST,[ai]:i.LINEAR_MIPMAP_LINEAR},Et={[cf]:i.NEVER,[df]:i.ALWAYS,[lf]:i.LESS,[nc]:i.LEQUAL,[hf]:i.EQUAL,[ic]:i.GEQUAL,[uf]:i.GREATER,[ff]:i.NOTEQUAL};function ot(C,S){if(S.type===tn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===De||S.magFilter===no||S.magFilter===Ws||S.magFilter===ai||S.minFilter===De||S.minFilter===no||S.minFilter===Ws||S.minFilter===ai)&&Ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,et[S.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,et[S.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,et[S.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,ct[S.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,ct[S.minFilter]),S.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Et[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ce||S.minFilter!==Ws&&S.minFilter!==ai||S.type===tn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Y(C,S){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",T));const Z=S.source;let q=d.get(Z);q===void 0&&(q={},d.set(Z,q));const rt=U(S);if(rt!==C.__cacheKey){q[rt]===void 0&&(q[rt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),q[rt].usedTimes++;const ht=q[C.__cacheKey];ht!==void 0&&(q[C.__cacheKey].usedTimes--,ht.usedTimes===0&&R(S)),C.__cacheKey=rt,C.__webglTexture=q[rt].texture}return z}function nt(C,S,z){return Math.floor(Math.floor(C/z)/S)}function j(C,S,z,Z){const rt=C.updateRanges;if(rt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,z,Z,S.data);else{rt.sort((Rt,mt)=>Rt.start-mt.start);let ht=0;for(let Rt=1;Rt<rt.length;Rt++){const mt=rt[ht],dt=rt[Rt],It=mt.start+mt.count,Lt=nt(dt.start,S.width,4),zt=nt(mt.start,S.width,4);dt.start<=It+1&&Lt===zt&&nt(dt.start+dt.count-1,S.width,4)===Lt?mt.count=Math.max(mt.count,dt.start+dt.count-mt.start):(++ht,rt[ht]=dt)}rt.length=ht+1;const K=e.getParameter(i.UNPACK_ROW_LENGTH),tt=e.getParameter(i.UNPACK_SKIP_PIXELS),ft=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let Rt=0,mt=rt.length;Rt<mt;Rt++){const dt=rt[Rt],It=Math.floor(dt.start/4),Lt=Math.ceil(dt.count/4),zt=It%S.width,N=Math.floor(It/S.width),lt=Lt,Q=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,zt),e.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,zt,N,lt,Q,z,Z,S.data)}C.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,K),e.pixelStorei(i.UNPACK_SKIP_PIXELS,tt),e.pixelStorei(i.UNPACK_SKIP_ROWS,ft)}}function at(C,S,z){let Z=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=i.TEXTURE_3D);const q=Y(C,S),rt=S.source;e.bindTexture(Z,C.__webglTexture,i.TEXTURE0+z);const ht=n.get(rt);if(rt.version!==ht.__version||q===!0){if(e.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const Q=Yt.getPrimaries(Yt.workingColorSpace),pt=S.colorSpace===Gn?null:Yt.getPrimaries(S.colorSpace),vt=S.colorSpace===Gn||Q===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt)}e.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let tt=g(S.image,!1,s.maxTextureSize);tt=de(S,tt);const ft=r.convert(S.format,S.colorSpace),Rt=r.convert(S.type);let mt=M(S.internalFormat,ft,Rt,S.normalized,S.colorSpace,S.isVideoTexture);ot(Z,S);let dt;const It=S.mipmaps,Lt=S.isVideoTexture!==!0,zt=ht.__version===void 0||q===!0,N=rt.dataReady,lt=b(S,tt);if(S.isDepthTexture)mt=w(S.format===ci,S.type),zt&&(Lt?e.texStorage2D(i.TEXTURE_2D,1,mt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,mt,tt.width,tt.height,0,ft,Rt,null));else if(S.isDataTexture)if(It.length>0){Lt&&zt&&e.texStorage2D(i.TEXTURE_2D,lt,mt,It[0].width,It[0].height);for(let Q=0,pt=It.length;Q<pt;Q++)dt=It[Q],Lt?N&&e.texSubImage2D(i.TEXTURE_2D,Q,0,0,dt.width,dt.height,ft,Rt,dt.data):e.texImage2D(i.TEXTURE_2D,Q,mt,dt.width,dt.height,0,ft,Rt,dt.data);S.generateMipmaps=!1}else Lt?(zt&&e.texStorage2D(i.TEXTURE_2D,lt,mt,tt.width,tt.height),N&&j(S,tt,ft,Rt)):e.texImage2D(i.TEXTURE_2D,0,mt,tt.width,tt.height,0,ft,Rt,tt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Lt&&zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,lt,mt,It[0].width,It[0].height,tt.depth);for(let Q=0,pt=It.length;Q<pt;Q++)if(dt=It[Q],S.format!==en)if(ft!==null)if(Lt){if(N)if(S.layerUpdates.size>0){const vt=ml(dt.width,dt.height,S.format,S.type);for(const st of S.layerUpdates){const Tt=dt.data.subarray(st*vt/dt.data.BYTES_PER_ELEMENT,(st+1)*vt/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,st,dt.width,dt.height,1,ft,Tt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,dt.width,dt.height,tt.depth,ft,dt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,mt,dt.width,dt.height,tt.depth,0,dt.data,0,0);else Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Lt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,dt.width,dt.height,tt.depth,ft,Rt,dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Q,mt,dt.width,dt.height,tt.depth,0,ft,Rt,dt.data)}else{Lt&&zt&&e.texStorage2D(i.TEXTURE_2D,lt,mt,It[0].width,It[0].height);for(let Q=0,pt=It.length;Q<pt;Q++)dt=It[Q],S.format!==en?ft!==null?Lt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,dt.width,dt.height,ft,dt.data):e.compressedTexImage2D(i.TEXTURE_2D,Q,mt,dt.width,dt.height,0,dt.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Lt?N&&e.texSubImage2D(i.TEXTURE_2D,Q,0,0,dt.width,dt.height,ft,Rt,dt.data):e.texImage2D(i.TEXTURE_2D,Q,mt,dt.width,dt.height,0,ft,Rt,dt.data)}else if(S.isDataArrayTexture)if(Lt){if(zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,lt,mt,tt.width,tt.height,tt.depth),N)if(S.layerUpdates.size>0){const Q=ml(tt.width,tt.height,S.format,S.type);for(const pt of S.layerUpdates){const vt=tt.data.subarray(pt*Q/tt.data.BYTES_PER_ELEMENT,(pt+1)*Q/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,pt,tt.width,tt.height,1,ft,Rt,vt)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ft,Rt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,mt,tt.width,tt.height,tt.depth,0,ft,Rt,tt.data);else if(S.isData3DTexture)Lt?(zt&&e.texStorage3D(i.TEXTURE_3D,lt,mt,tt.width,tt.height,tt.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ft,Rt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,mt,tt.width,tt.height,tt.depth,0,ft,Rt,tt.data);else if(S.isFramebufferTexture){if(zt)if(Lt)e.texStorage2D(i.TEXTURE_2D,lt,mt,tt.width,tt.height);else{let Q=tt.width,pt=tt.height;for(let vt=0;vt<lt;vt++)e.texImage2D(i.TEXTURE_2D,vt,mt,Q,pt,0,ft,Rt,null),Q>>=1,pt>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){const Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),tt.parentNode!==Q){Q.appendChild(tt),u.add(S),Q.onpaint=pt=>{const vt=pt.changedElements;for(const st of u)vt.includes(st.image)&&(st.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,tt);else{const vt=i.RGBA,st=i.RGBA,Tt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,vt,st,Tt,tt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(It.length>0){if(Lt&&zt){const Q=Qt(It[0]);e.texStorage2D(i.TEXTURE_2D,lt,mt,Q.width,Q.height)}for(let Q=0,pt=It.length;Q<pt;Q++)dt=It[Q],Lt?N&&e.texSubImage2D(i.TEXTURE_2D,Q,0,0,ft,Rt,dt):e.texImage2D(i.TEXTURE_2D,Q,mt,ft,Rt,dt);S.generateMipmaps=!1}else if(Lt){if(zt){const Q=Qt(tt);e.texStorage2D(i.TEXTURE_2D,lt,mt,Q.width,Q.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft,Rt,tt)}else e.texImage2D(i.TEXTURE_2D,0,mt,ft,Rt,tt);m(S)&&_(Z),ht.__version=rt.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function yt(C,S,z){if(S.image.length!==6)return;const Z=Y(C,S),q=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+z);const rt=n.get(q);if(q.version!==rt.__version||Z===!0){e.activeTexture(i.TEXTURE0+z);const ht=Yt.getPrimaries(Yt.workingColorSpace),K=S.colorSpace===Gn?null:Yt.getPrimaries(S.colorSpace),tt=S.colorSpace===Gn||ht===K?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);const ft=S.isCompressedTexture||S.image[0].isCompressedTexture,Rt=S.image[0]&&S.image[0].isDataTexture,mt=[];for(let st=0;st<6;st++)!ft&&!Rt?mt[st]=g(S.image[st],!0,s.maxCubemapSize):mt[st]=Rt?S.image[st].image:S.image[st],mt[st]=de(S,mt[st]);const dt=mt[0],It=r.convert(S.format,S.colorSpace),Lt=r.convert(S.type),zt=M(S.internalFormat,It,Lt,S.normalized,S.colorSpace),N=S.isVideoTexture!==!0,lt=rt.__version===void 0||Z===!0,Q=q.dataReady;let pt=b(S,dt);ot(i.TEXTURE_CUBE_MAP,S);let vt;if(ft){N&&lt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,zt,dt.width,dt.height);for(let st=0;st<6;st++){vt=mt[st].mipmaps;for(let Tt=0;Tt<vt.length;Tt++){const wt=vt[Tt];S.format!==en?It!==null?N?Q&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt,0,0,wt.width,wt.height,It,wt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt,zt,wt.width,wt.height,0,wt.data):Ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?Q&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt,0,0,wt.width,wt.height,It,Lt,wt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt,zt,wt.width,wt.height,0,It,Lt,wt.data)}}}else{if(vt=S.mipmaps,N&&lt){vt.length>0&&pt++;const st=Qt(mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,zt,st.width,st.height)}for(let st=0;st<6;st++)if(Rt){N?Q&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,mt[st].width,mt[st].height,It,Lt,mt[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,zt,mt[st].width,mt[st].height,0,It,Lt,mt[st].data);for(let Tt=0;Tt<vt.length;Tt++){const pe=vt[Tt].image[st].image;N?Q&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt+1,0,0,pe.width,pe.height,It,Lt,pe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt+1,zt,pe.width,pe.height,0,It,Lt,pe.data)}}else{N?Q&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,It,Lt,mt[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,zt,It,Lt,mt[st]);for(let Tt=0;Tt<vt.length;Tt++){const wt=vt[Tt];N?Q&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt+1,0,0,It,Lt,wt.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Tt+1,zt,It,Lt,wt.image[st])}}}m(S)&&_(i.TEXTURE_CUBE_MAP),rt.__version=q.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function bt(C,S,z,Z,q,rt){const ht=r.convert(z.format,z.colorSpace),K=r.convert(z.type),tt=M(z.internalFormat,ht,K,z.normalized,z.colorSpace),ft=n.get(S),Rt=n.get(z);if(Rt.__renderTarget=S,!ft.__hasExternalTextures){const mt=Math.max(1,S.width>>rt),dt=Math.max(1,S.height>>rt);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?e.texImage3D(q,rt,tt,mt,dt,S.depth,0,ht,K,null):e.texImage2D(q,rt,tt,mt,dt,0,ht,K,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),le(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,q,Rt.__webglTexture,0,ce(S)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,q,Rt.__webglTexture,rt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(C,S,z){if(i.bindRenderbuffer(i.RENDERBUFFER,C),S.depthBuffer){const Z=S.depthTexture,q=Z&&Z.isDepthTexture?Z.type:null,rt=w(S.stencilBuffer,q),ht=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;le(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce(S),rt,S.width,S.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce(S),rt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,rt,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,C)}else{const Z=S.textures;for(let q=0;q<Z.length;q++){const rt=Z[q],ht=r.convert(rt.format,rt.colorSpace),K=r.convert(rt.type),tt=M(rt.internalFormat,ht,K,rt.normalized,rt.colorSpace);le(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce(S),tt,S.width,S.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce(S),tt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,tt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ft(C,S,z){const Z=S.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=n.get(S.depthTexture);if(q.__renderTarget=S,(!q.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Z){if(q.__webglInit===void 0&&(q.__webglInit=!0,S.depthTexture.addEventListener("dispose",T)),q.__webglTexture===void 0){q.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),ot(i.TEXTURE_CUBE_MAP,S.depthTexture);const ft=r.convert(S.depthTexture.format),Rt=r.convert(S.depthTexture.type);let mt;S.depthTexture.format===Rn?mt=i.DEPTH_COMPONENT24:S.depthTexture.format===ci&&(mt=i.DEPTH24_STENCIL8);for(let dt=0;dt<6;dt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,mt,S.width,S.height,0,ft,Rt,null)}}else W(S.depthTexture,0);const rt=q.__webglTexture,ht=ce(S),K=Z?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,tt=S.depthTexture.format===ci?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===Rn)le(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,K,rt,0,ht):i.framebufferTexture2D(i.FRAMEBUFFER,tt,K,rt,0);else if(S.depthTexture.format===ci)le(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,K,rt,0,ht):i.framebufferTexture2D(i.FRAMEBUFFER,tt,K,rt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Zt(C){const S=n.get(C),z=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const Z=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){const q=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",q)};Z.addEventListener("dispose",q),S.__depthDisposeCallback=q}S.__boundDepthTexture=Z}if(C.depthTexture&&!S.__autoAllocateDepthBuffer)if(z)for(let Z=0;Z<6;Z++)Ft(S.__webglFramebuffer[Z],C,Z);else{const Z=C.texture.mipmaps;Z&&Z.length>0?Ft(S.__webglFramebuffer[0],C,0):Ft(S.__webglFramebuffer,C,0)}else if(z){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=i.createRenderbuffer(),Vt(S.__webglDepthbuffer[Z],C,!1);else{const q=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=S.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,rt)}}else{const Z=C.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Vt(S.__webglDepthbuffer,C,!1);else{const q=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,rt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(C,S,z){const Z=n.get(C);S!==void 0&&bt(Z.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Zt(C)}function Dt(C){const S=C.texture,z=n.get(C),Z=n.get(S);C.addEventListener("dispose",v);const q=C.textures,rt=C.isWebGLCubeRenderTarget===!0,ht=q.length>1;if(ht||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=S.version,o.memory.textures++),rt){z.__webglFramebuffer=[];for(let K=0;K<6;K++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[K]=[];for(let tt=0;tt<S.mipmaps.length;tt++)z.__webglFramebuffer[K][tt]=i.createFramebuffer()}else z.__webglFramebuffer[K]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let K=0;K<S.mipmaps.length;K++)z.__webglFramebuffer[K]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(ht)for(let K=0,tt=q.length;K<tt;K++){const ft=n.get(q[K]);ft.__webglTexture===void 0&&(ft.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&le(C)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let K=0;K<q.length;K++){const tt=q[K];z.__webglColorRenderbuffer[K]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[K]);const ft=r.convert(tt.format,tt.colorSpace),Rt=r.convert(tt.type),mt=M(tt.internalFormat,ft,Rt,tt.normalized,tt.colorSpace,C.isXRRenderTarget===!0),dt=ce(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,mt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,z.__webglColorRenderbuffer[K])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Vt(z.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),ot(i.TEXTURE_CUBE_MAP,S);for(let K=0;K<6;K++)if(S.mipmaps&&S.mipmaps.length>0)for(let tt=0;tt<S.mipmaps.length;tt++)bt(z.__webglFramebuffer[K][tt],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,tt);else bt(z.__webglFramebuffer[K],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);m(S)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let K=0,tt=q.length;K<tt;K++){const ft=q[K],Rt=n.get(ft);let mt=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(mt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(mt,Rt.__webglTexture),ot(mt,ft),bt(z.__webglFramebuffer,C,ft,i.COLOR_ATTACHMENT0+K,mt,0),m(ft)&&_(mt)}e.unbindTexture()}else{let K=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(K,Z.__webglTexture),ot(K,S),S.mipmaps&&S.mipmaps.length>0)for(let tt=0;tt<S.mipmaps.length;tt++)bt(z.__webglFramebuffer[tt],C,S,i.COLOR_ATTACHMENT0,K,tt);else bt(z.__webglFramebuffer,C,S,i.COLOR_ATTACHMENT0,K,0);m(S)&&_(K),e.unbindTexture()}C.depthBuffer&&Zt(C)}function te(C){const S=C.textures;for(let z=0,Z=S.length;z<Z;z++){const q=S[z];if(m(q)){const rt=y(C),ht=n.get(q).__webglTexture;e.bindTexture(rt,ht),_(rt),e.unbindTexture()}}}const ae=[],ye=[];function Se(C){if(C.samples>0){if(le(C)===!1){const S=C.textures,z=C.width,Z=C.height;let q=i.COLOR_BUFFER_BIT;const rt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=n.get(C),K=S.length>1;if(K)for(let ft=0;ft<S.length;ft++)e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);const tt=C.texture.mipmaps;tt&&tt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let ft=0;ft<S.length;ft++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),K){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ht.__webglColorRenderbuffer[ft]);const Rt=n.get(S[ft]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,z,Z,0,0,z,Z,q,i.NEAREST),c===!0&&(ae.length=0,ye.length=0,ae.push(i.COLOR_ATTACHMENT0+ft),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ae.push(rt),ye.push(rt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ye)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ae))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),K)for(let ft=0;ft<S.length;ft++){e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,ht.__webglColorRenderbuffer[ft]);const Rt=n.get(S[ft]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,Rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const S=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function ce(C){return Math.min(s.maxSamples,C.samples)}function le(C){const S=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function F(C){const S=o.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function de(C,S){const z=C.colorSpace,Z=C.format,q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==Fr&&z!==Gn&&(Yt.getTransfer(z)===jt?(Z!==en||q!==Xe)&&Ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qt("WebGLTextures: Unsupported texture color space:",z)),S}function Qt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=k,this.getTextureUnits=G,this.setTextureUnits=D,this.setTexture2D=W,this.setTexture2DArray=X,this.setTexture3D=J,this.setTextureCube=it,this.rebindTextures=Ot,this.setupRenderTarget=Dt,this.updateRenderTargetMipmap=te,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=le,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function y_(i,t){function e(n,s=Gn){let r;const o=Yt.getTransfer(s);if(n===Xe)return i.UNSIGNED_BYTE;if(n===Ka)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ja)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ah)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Th)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===bh)return i.BYTE;if(n===wh)return i.SHORT;if(n===Rs)return i.UNSIGNED_SHORT;if(n===qa)return i.INT;if(n===mn)return i.UNSIGNED_INT;if(n===tn)return i.FLOAT;if(n===Tn)return i.HALF_FLOAT;if(n===Rh)return i.ALPHA;if(n===Ch)return i.RGB;if(n===en)return i.RGBA;if(n===Rn)return i.DEPTH_COMPONENT;if(n===ci)return i.DEPTH_STENCIL;if(n===Qa)return i.RED;if(n===ja)return i.RED_INTEGER;if(n===fi)return i.RG;if(n===tc)return i.RG_INTEGER;if(n===ec)return i.RGBA_INTEGER;if(n===Tr||n===Rr||n===Cr||n===Pr)if(o===jt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Tr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Tr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Pr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ta||n===ea||n===na||n===ia)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ta)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ea)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===na)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ia)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===sa||n===ra||n===oa||n===aa||n===ca||n===Ur||n===la)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===sa||n===ra)return o===jt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===oa)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===aa)return r.COMPRESSED_R11_EAC;if(n===ca)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ur)return r.COMPRESSED_RG11_EAC;if(n===la)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===ha||n===ua||n===fa||n===da||n===pa||n===ma||n===ga||n===_a||n===xa||n===va||n===Ma||n===ya||n===Sa||n===Ea)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ha)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ua)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fa)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===da)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===pa)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ma)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ga)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===_a)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xa)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===va)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ma)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ya)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Sa)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ea)return o===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ba||n===wa||n===Aa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ba)return o===jt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===wa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Aa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ta||n===Ra||n===Nr||n===Ca)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ta)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ra)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Nr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ca)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const S_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,E_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class b_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Bh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new sn({vertexShader:S_,fragmentShader:E_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fe(new Zr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class w_ extends pi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,p=null;const x=typeof XRWebGLBinding<"u",g=new b_,m={},_=e.getContextAttributes();let y=null,M=null;const w=[],b=[],T=new kt;let v=null;const E=new Ye;E.viewport=new he;const R=new Ye;R.viewport=new he;const P=[E,R],I=new Ud;let k=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let nt=w[Y];return nt===void 0&&(nt=new co,w[Y]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Y){let nt=w[Y];return nt===void 0&&(nt=new co,w[Y]=nt),nt.getGripSpace()},this.getHand=function(Y){let nt=w[Y];return nt===void 0&&(nt=new co,w[Y]=nt),nt.getHandSpace()};function D(Y){const nt=b.indexOf(Y.inputSource);if(nt===-1)return;const j=w[nt];j!==void 0&&(j.update(Y.inputSource,Y.frame,l||o),j.dispatchEvent({type:Y.type,data:Y.inputSource}))}function L(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",L),s.removeEventListener("inputsourceschange",U);for(let Y=0;Y<w.length;Y++){const nt=b[Y];nt!==null&&(b[Y]=null,w[Y].disconnect(nt))}k=null,G=null,g.reset();for(const Y in m)delete m[Y];t.setRenderTarget(y),d=null,f=null,u=null,s=null,M=null,ot.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&Ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&Ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(y=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",L),s.addEventListener("inputsourceschange",U),_.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(T),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let j=null,at=null,yt=null;_.depth&&(yt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=_.stencil?ci:Rn,at=_.stencil?Cs:mn);const bt={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(bt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),M=new pn(f.textureWidth,f.textureHeight,{format:en,type:Xe,depthTexture:new Zi(f.textureWidth,f.textureHeight,at,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const j={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,j),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new pn(d.framebufferWidth,d.framebufferHeight,{format:en,type:Xe,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ot.setContext(s),ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function U(Y){for(let nt=0;nt<Y.removed.length;nt++){const j=Y.removed[nt],at=b.indexOf(j);at>=0&&(b[at]=null,w[at].disconnect(j))}for(let nt=0;nt<Y.added.length;nt++){const j=Y.added[nt];let at=b.indexOf(j);if(at===-1){for(let bt=0;bt<w.length;bt++)if(bt>=b.length){b.push(j),at=bt;break}else if(b[bt]===null){b[bt]=j,at=bt;break}if(at===-1)break}const yt=w[at];yt&&yt.connect(j)}}const W=new B,X=new B;function J(Y,nt,j){W.setFromMatrixPosition(nt.matrixWorld),X.setFromMatrixPosition(j.matrixWorld);const at=W.distanceTo(X),yt=nt.projectionMatrix.elements,bt=j.projectionMatrix.elements,Vt=yt[14]/(yt[10]-1),Ft=yt[14]/(yt[10]+1),Zt=(yt[9]+1)/yt[5],Ot=(yt[9]-1)/yt[5],Dt=(yt[8]-1)/yt[0],te=(bt[8]+1)/bt[0],ae=Vt*Dt,ye=Vt*te,Se=at/(-Dt+te),ce=Se*-Dt;if(nt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ce),Y.translateZ(Se),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),yt[10]===-1)Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const le=Vt+Se,F=Ft+Se,de=ae-ce,Qt=ye+(at-ce),C=Zt*Ft/F*le,S=Ot*Ft/F*le;Y.projectionMatrix.makePerspective(de,Qt,C,S,le,F),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function it(Y,nt){nt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(nt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let nt=Y.near,j=Y.far;g.texture!==null&&(g.depthNear>0&&(nt=g.depthNear),g.depthFar>0&&(j=g.depthFar)),I.near=R.near=E.near=nt,I.far=R.far=E.far=j,(k!==I.near||G!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),k=I.near,G=I.far),I.layers.mask=Y.layers.mask|6,E.layers.mask=I.layers.mask&-5,R.layers.mask=I.layers.mask&-3;const at=Y.parent,yt=I.cameras;it(I,at);for(let bt=0;bt<yt.length;bt++)it(yt[bt],at);yt.length===2?J(I,E,R):I.projectionMatrix.copy(E.projectionMatrix),et(Y,I,at)};function et(Y,nt,j){j===null?Y.matrix.copy(nt.matrixWorld):(Y.matrix.copy(j.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(nt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Is*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(Y){c=Y,f!==null&&(f.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function(Y){return m[Y]};let ct=null;function Et(Y,nt){if(h=nt.getViewerPose(l||o),p=nt,h!==null){const j=h.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let at=!1;j.length!==I.cameras.length&&(I.cameras.length=0,at=!0);for(let Ft=0;Ft<j.length;Ft++){const Zt=j[Ft];let Ot=null;if(d!==null)Ot=d.getViewport(Zt);else{const te=u.getViewSubImage(f,Zt);Ot=te.viewport,Ft===0&&(t.setRenderTargetTextures(M,te.colorTexture,te.depthStencilTexture),t.setRenderTarget(M))}let Dt=P[Ft];Dt===void 0&&(Dt=new Ye,Dt.layers.enable(Ft),Dt.viewport=new he,P[Ft]=Dt),Dt.matrix.fromArray(Zt.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(Zt.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),Ft===0&&(I.matrix.copy(Dt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),at===!0&&I.cameras.push(Dt)}const yt=s.enabledFeatures;if(yt&&yt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const Ft=u.getDepthInformation(j[0]);Ft&&Ft.isValid&&Ft.texture&&g.init(Ft,s.renderState)}if(yt&&yt.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let Ft=0;Ft<j.length;Ft++){const Zt=j[Ft].camera;if(Zt){let Ot=m[Zt];Ot||(Ot=new Bh,m[Zt]=Ot);const Dt=u.getCameraImage(Zt);Ot.sourceTexture=Dt}}}}for(let j=0;j<w.length;j++){const at=b[j],yt=w[j];at!==null&&yt!==void 0&&yt.update(at,nt,l||o)}ct&&ct(Y,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),p=null}const ot=new $h;ot.setAnimationLoop(Et),this.setAnimationLoop=function(Y){ct=Y},this.dispose=function(){}}}const A_=new se,tu=new Bt;tu.set(-1,0,0,0,1,0,0,0,1);function T_(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Vh(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,_,y,M){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&d(g,m,M)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?c(g,m,_,y):m.isSpriteMaterial?l(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===ke&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===ke&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const _=t.get(m),y=_.envMap,M=_.envMapRotation;y&&(g.envMap.value=y,g.envMapRotation.value.setFromMatrix4(A_.makeRotationFromEuler(M)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(tu),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,_,y){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*_,g.scale.value=y*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function l(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,_){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===ke&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){const _=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function R_(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,w){const b=w.program;n.uniformBlockBinding(M,b)}function l(M,w){let b=s[M.id];b===void 0&&(g(M),b=h(M),s[M.id]=b,M.addEventListener("dispose",_));const T=w.program;n.updateUBOMapping(M,T);const v=t.render.frame;r[M.id]!==v&&(f(M),r[M.id]=v)}function h(M){const w=u();M.__bindingPointIndex=w;const b=i.createBuffer(),T=M.__size,v=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,T,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,b),b}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return qt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const w=s[M.id],b=M.uniforms,T=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let v=0,E=b.length;v<E;v++){const R=b[v];if(Array.isArray(R))for(let P=0,I=R.length;P<I;P++)d(R[P],v,P,T);else d(R,v,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(M,w,b,T){if(x(M,w,b,T)===!0){const v=M.__offset,E=M.value;if(Array.isArray(E)){let R=0;for(let P=0;P<E.length;P++){const I=E[P],k=m(I);p(I,M.__data,R),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(R+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,M.__data)}}function p(M,w,b){typeof M=="number"||typeof M=="boolean"?w[0]=M:M.isMatrix3?(w[0]=M.elements[0],w[1]=M.elements[1],w[2]=M.elements[2],w[3]=0,w[4]=M.elements[3],w[5]=M.elements[4],w[6]=M.elements[5],w[7]=0,w[8]=M.elements[6],w[9]=M.elements[7],w[10]=M.elements[8],w[11]=0):ArrayBuffer.isView(M)?w.set(new M.constructor(M.buffer,M.byteOffset,w.length)):M.toArray(w,b)}function x(M,w,b,T){const v=M.value,E=w+"_"+b;if(T[E]===void 0)return typeof v=="number"||typeof v=="boolean"?T[E]=v:ArrayBuffer.isView(v)?T[E]=v.slice():T[E]=v.clone(),!0;{const R=T[E];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return T[E]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(R.equals(v)===!1)return R.copy(v),!0}}return!1}function g(M){const w=M.uniforms;let b=0;const T=16;for(let E=0,R=w.length;E<R;E++){const P=Array.isArray(w[E])?w[E]:[w[E]];for(let I=0,k=P.length;I<k;I++){const G=P[I],D=Array.isArray(G.value)?G.value:[G.value];for(let L=0,U=D.length;L<U;L++){const W=D[L],X=m(W),J=b%T,it=J%X.boundary,et=J+it;b+=it,et!==0&&T-et<X.storage&&(b+=T-et),G.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=b,b+=X.storage}}}const v=b%T;return v>0&&(b+=T-v),M.__size=b,M.__cache={},this}function m(M){const w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?Ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(w.boundary=16,w.storage=M.byteLength):Ut("WebGLRenderer: Unsupported uniform value type.",M),w}function _(M){const w=M.target;w.removeEventListener("dispose",_);const b=o.indexOf(w.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function y(){for(const M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:y}}const C_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ln=null;function P_(){return ln===null&&(ln=new Fh(C_,16,16,fi,Tn),ln.name="DFG_LUT",ln.minFilter=De,ln.magFilter=De,ln.wrapS=En,ln.wrapT=En,ln.generateMipmaps=!1,ln.needsUpdate=!0),ln}class I_{constructor(t={}){const{canvas:e=mf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=Xe}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const x=d,g=new Set([ec,tc,ja]),m=new Set([Xe,mn,Rs,Cs,Ka,Ja]),_=new Uint32Array(4),y=new Int32Array(4),M=new B;let w=null,b=null;const T=[],v=[];let E=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=dn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let P=!1,I=null,k=null,G=null,D=null;this._outputColorSpace=Oe;let L=0,U=0,W=null,X=-1,J=null;const it=new he,et=new he;let ct=null;const Et=new ut(0);let ot=0,Y=e.width,nt=e.height,j=1,at=null,yt=null;const bt=new he(0,0,Y,nt),Vt=new he(0,0,Y,nt);let Ft=!1;const Zt=new lc;let Ot=!1,Dt=!1;const te=new se,ae=new B,ye=new he,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ce=!1;function le(){return W===null?j:1}let F=n;function de(A,O){return e.getContext(A,O)}try{const A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$a}`),e.addEventListener("webglcontextlost",pe,!1),e.addEventListener("webglcontextrestored",re,!1),e.addEventListener("webglcontextcreationerror",rn,!1),F===null){const O="webgl2";if(F=de(O,A),F===null)throw de(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(A){throw qt("WebGLRenderer: "+A.message),A}let Qt,C,S,z,Z,q,rt,ht,K,tt,ft,Rt,mt,dt,It,Lt,zt,N,lt,Q,pt,vt,st;function Tt(){Qt=new Pg(F),Qt.init(),pt=new y_(F,Qt),C=new Sg(F,Qt,t,pt),S=new v_(F,Qt),C.reversedDepthBuffer&&f&&S.buffers.depth.setReversed(!0),k=F.createFramebuffer(),G=F.createFramebuffer(),D=F.createFramebuffer(),z=new Dg(F),Z=new r_,q=new M_(F,Qt,S,Z,C,pt,z),rt=new Cg(R),ht=new Od(F),vt=new Mg(F,ht),K=new Ig(F,ht,z,vt),tt=new Ng(F,K,ht,vt,z),N=new Ug(F,C,q),It=new Eg(Z),ft=new s_(R,rt,Qt,C,vt,It),Rt=new T_(R,Z),mt=new a_,dt=new d_(Qt),zt=new vg(R,rt,S,tt,p,c),Lt=new x_(R,tt,C),st=new R_(F,z,C,S),lt=new yg(F,Qt,z),Q=new Lg(F,Qt,z),z.programs=ft.programs,R.capabilities=C,R.extensions=Qt,R.properties=Z,R.renderLists=mt,R.shadowMap=Lt,R.state=S,R.info=z}Tt(),x!==Xe&&(E=new Og(x,e.width,e.height,a,s,r));const wt=new w_(R,F);this.xr=wt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const A=Qt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Qt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(A){A!==void 0&&(j=A,this.setSize(Y,nt,!1))},this.getSize=function(A){return A.set(Y,nt)},this.setSize=function(A,O,$=!0){if(wt.isPresenting){Ut("WebGLRenderer: Can't change size while VR device is presenting.");return}Y=A,nt=O,e.width=Math.floor(A*j),e.height=Math.floor(O*j),$===!0&&(e.style.width=A+"px",e.style.height=O+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,A,O)},this.getDrawingBufferSize=function(A){return A.set(Y*j,nt*j).floor()},this.setDrawingBufferSize=function(A,O,$){Y=A,nt=O,j=$,e.width=Math.floor(A*$),e.height=Math.floor(O*$),this.setViewport(0,0,A,O)},this.setEffects=function(A){if(x===Xe){qt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let O=0;O<A.length;O++)if(A[O].isOutputPass===!0){Ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(it)},this.getViewport=function(A){return A.copy(bt)},this.setViewport=function(A,O,$,H){A.isVector4?bt.set(A.x,A.y,A.z,A.w):bt.set(A,O,$,H),S.viewport(it.copy(bt).multiplyScalar(j).round())},this.getScissor=function(A){return A.copy(Vt)},this.setScissor=function(A,O,$,H){A.isVector4?Vt.set(A.x,A.y,A.z,A.w):Vt.set(A,O,$,H),S.scissor(et.copy(Vt).multiplyScalar(j).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(A){S.setScissorTest(Ft=A)},this.setOpaqueSort=function(A){at=A},this.setTransparentSort=function(A){yt=A},this.getClearColor=function(A){return A.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(A=!0,O=!0,$=!0){let H=0;if(A){let V=!1;if(W!==null){const xt=W.texture.format;V=g.has(xt)}if(V){const xt=W.texture.type,St=m.has(xt),_t=zt.getClearColor(),At=zt.getClearAlpha(),Ct=_t.r,Gt=_t.g,Xt=_t.b;St?(_[0]=Ct,_[1]=Gt,_[2]=Xt,_[3]=At,F.clearBufferuiv(F.COLOR,0,_)):(y[0]=Ct,y[1]=Gt,y[2]=Xt,y[3]=At,F.clearBufferiv(F.COLOR,0,y))}else H|=F.COLOR_BUFFER_BIT}O&&(H|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(H|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&F.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),I=A},this.dispose=function(){e.removeEventListener("webglcontextlost",pe,!1),e.removeEventListener("webglcontextrestored",re,!1),e.removeEventListener("webglcontextcreationerror",rn,!1),zt.dispose(),mt.dispose(),dt.dispose(),Z.dispose(),rt.dispose(),tt.dispose(),vt.dispose(),st.dispose(),ft.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",wc),wt.removeEventListener("sessionend",Ac),qn.stop()};function pe(A){A.preventDefault(),Gc("WebGLRenderer: Context Lost."),P=!0}function re(){Gc("WebGLRenderer: Context Restored."),P=!1;const A=z.autoReset,O=Lt.enabled,$=Lt.autoUpdate,H=Lt.needsUpdate,V=Lt.type;Tt(),z.autoReset=A,Lt.enabled=O,Lt.autoUpdate=$,Lt.needsUpdate=H,Lt.type=V}function rn(A){qt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function on(A){const O=A.target;O.removeEventListener("dispose",on),Cu(O)}function Cu(A){Pu(A),Z.remove(A)}function Pu(A){const O=Z.get(A).programs;O!==void 0&&(O.forEach(function($){ft.releaseProgram($)}),A.isShaderMaterial&&ft.releaseShaderCache(A))}this.renderBufferDirect=function(A,O,$,H,V,xt){O===null&&(O=Se);const St=V.isMesh&&V.matrixWorld.determinantAffine()<0,_t=Du(A,O,$,H,V);S.setMaterial(H,St);let At=$.index,Ct=1;if(H.wireframe===!0){if(At=K.getWireframeAttribute($),At===void 0)return;Ct=2}const Gt=$.drawRange,Xt=$.attributes.position;let Pt=Gt.start*Ct,ee=(Gt.start+Gt.count)*Ct;xt!==null&&(Pt=Math.max(Pt,xt.start*Ct),ee=Math.min(ee,(xt.start+xt.count)*Ct)),At!==null?(Pt=Math.max(Pt,0),ee=Math.min(ee,At.count)):Xt!=null&&(Pt=Math.max(Pt,0),ee=Math.min(ee,Xt.count));const _e=ee-Pt;if(_e<0||_e===1/0)return;vt.setup(V,H,_t,$,At);let me,ne=lt;if(At!==null&&(me=ht.get(At),ne=Q,ne.setIndex(me)),V.isMesh)H.wireframe===!0?(S.setLineWidth(H.wireframeLinewidth*le()),ne.setMode(F.LINES)):ne.setMode(F.TRIANGLES);else if(V.isLine){let Pe=H.linewidth;Pe===void 0&&(Pe=1),S.setLineWidth(Pe*le()),V.isLineSegments?ne.setMode(F.LINES):V.isLineLoop?ne.setMode(F.LINE_LOOP):ne.setMode(F.LINE_STRIP)}else V.isPoints?ne.setMode(F.POINTS):V.isSprite&&ne.setMode(F.TRIANGLES);if(V.isBatchedMesh)if(Qt.get("WEBGL_multi_draw"))ne.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Pe=V._multiDrawStarts,Mt=V._multiDrawCounts,He=V._multiDrawCount,Jt=At?ht.get(At).bytesPerElement:1,Ze=Z.get(H).currentProgram.getUniforms();for(let an=0;an<He;an++)Ze.setValue(F,"_gl_DrawID",an),ne.render(Pe[an]/Jt,Mt[an])}else if(V.isInstancedMesh)ne.renderInstances(Pt,_e,V.count);else if($.isInstancedBufferGeometry){const Pe=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Mt=Math.min($.instanceCount,Pe);ne.renderInstances(Pt,_e,Mt)}else ne.render(Pt,_e)};function bc(A,O,$){A.transparent===!0&&A.side===Sn&&A.forceSinglePass===!1?(A.side=ke,A.needsUpdate=!0,Vs(A,O,$),A.side=Zn,A.needsUpdate=!0,Vs(A,O,$),A.side=Sn):Vs(A,O,$)}this.compile=function(A,O,$=null){$===null&&($=A),b=dt.get($),b.init(O),v.push(b),$.traverseVisible(function(V){V.isLight&&V.layers.test(O.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),A!==$&&A.traverseVisible(function(V){V.isLight&&V.layers.test(O.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),b.setupLights();const H=new Set;return A.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const xt=V.material;if(xt)if(Array.isArray(xt))for(let St=0;St<xt.length;St++){const _t=xt[St];bc(_t,$,V),H.add(_t)}else bc(xt,$,V),H.add(xt)}),b=v.pop(),H},this.compileAsync=function(A,O,$=null){const H=this.compile(A,O,$);return new Promise(V=>{function xt(){if(H.forEach(function(St){Z.get(St).currentProgram.isReady()&&H.delete(St)}),H.size===0){V(A);return}setTimeout(xt,10)}Qt.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let Qr=null;function Iu(A){Qr&&Qr(A)}function wc(){qn.stop()}function Ac(){qn.start()}const qn=new $h;qn.setAnimationLoop(Iu),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(A){Qr=A,wt.setAnimationLoop(A),A===null?qn.stop():qn.start()},wt.addEventListener("sessionstart",wc),wt.addEventListener("sessionend",Ac),this.render=function(A,O){if(O!==void 0&&O.isCamera!==!0){qt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;I!==null&&I.renderStart(A,O);const $=wt.enabled===!0&&wt.isPresenting===!0,H=E!==null&&(W===null||$)&&E.begin(R,W);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(O),O=wt.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,O,W),b=dt.get(A,v.length),b.init(O),b.state.textureUnits=q.getTextureUnits(),v.push(b),te.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Zt.setFromProjectionMatrix(te,fn,O.reversedDepth),Dt=this.localClippingEnabled,Ot=It.init(this.clippingPlanes,Dt),w=mt.get(A,T.length),w.init(),T.push(w),wt.enabled===!0&&wt.isPresenting===!0){const St=R.xr.getDepthSensingMesh();St!==null&&jr(St,O,-1/0,R.sortObjects)}jr(A,O,0,R.sortObjects),w.finish(),R.sortObjects===!0&&w.sort(at,yt,O.reversedDepth),ce=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,ce&&zt.addToRenderList(w,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ot===!0&&It.beginShadows();const V=b.state.shadowsArray;if(Lt.render(V,A,O),Ot===!0&&It.endShadows(),(H&&E.hasRenderPass())===!1){const St=w.opaque,_t=w.transmissive;if(b.setupLights(),O.isArrayCamera){const At=O.cameras;if(_t.length>0)for(let Ct=0,Gt=At.length;Ct<Gt;Ct++){const Xt=At[Ct];Rc(St,_t,A,Xt)}ce&&zt.render(A);for(let Ct=0,Gt=At.length;Ct<Gt;Ct++){const Xt=At[Ct];Tc(w,A,Xt,Xt.viewport)}}else _t.length>0&&Rc(St,_t,A,O),ce&&zt.render(A),Tc(w,A,O)}W!==null&&U===0&&(q.updateMultisampleRenderTarget(W),q.updateRenderTargetMipmap(W)),H&&E.end(R),A.isScene===!0&&A.onAfterRender(R,A,O),vt.resetDefaultState(),X=-1,J=null,v.pop(),v.length>0?(b=v[v.length-1],q.setTextureUnits(b.state.textureUnits),Ot===!0&&It.setGlobalState(R.clippingPlanes,b.state.camera)):b=null,T.pop(),T.length>0?w=T[T.length-1]:w=null,I!==null&&I.renderEnd()};function jr(A,O,$,H){if(A.visible===!1)return;if(A.layers.test(O.layers)){if(A.isGroup)$=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(O);else if(A.isLightProbeGrid)b.pushLightProbeGrid(A);else if(A.isLight)b.pushLight(A),A.castShadow&&b.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Zt.intersectsSprite(A)){H&&ye.setFromMatrixPosition(A.matrixWorld).applyMatrix4(te);const St=tt.update(A),_t=A.material;_t.visible&&w.push(A,St,_t,$,ye.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Zt.intersectsObject(A))){const St=tt.update(A),_t=A.material;if(H&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ye.copy(A.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),ye.copy(St.boundingSphere.center)),ye.applyMatrix4(A.matrixWorld).applyMatrix4(te)),Array.isArray(_t)){const At=St.groups;for(let Ct=0,Gt=At.length;Ct<Gt;Ct++){const Xt=At[Ct],Pt=_t[Xt.materialIndex];Pt&&Pt.visible&&w.push(A,St,Pt,$,ye.z,Xt)}}else _t.visible&&w.push(A,St,_t,$,ye.z,null)}}const xt=A.children;for(let St=0,_t=xt.length;St<_t;St++)jr(xt[St],O,$,H)}function Tc(A,O,$,H){const{opaque:V,transmissive:xt,transparent:St}=A;b.setupLightsView($),Ot===!0&&It.setGlobalState(R.clippingPlanes,$),H&&S.viewport(it.copy(H)),V.length>0&&Hs(V,O,$),xt.length>0&&Hs(xt,O,$),St.length>0&&Hs(St,O,$),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function Rc(A,O,$,H){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){const Pt=Qt.has("EXT_color_buffer_half_float")||Qt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new pn(1,1,{generateMipmaps:!0,type:Pt?Tn:Xe,minFilter:ai,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace})}const xt=b.state.transmissionRenderTarget[H.id],St=H.viewport||it;xt.setSize(St.z*R.transmissionResolutionScale,St.w*R.transmissionResolutionScale);const _t=R.getRenderTarget(),At=R.getActiveCubeFace(),Ct=R.getActiveMipmapLevel();R.setRenderTarget(xt),R.getClearColor(Et),ot=R.getClearAlpha(),ot<1&&R.setClearColor(16777215,.5),R.clear(),ce&&zt.render($);const Gt=R.toneMapping;R.toneMapping=dn;const Xt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),Ot===!0&&It.setGlobalState(R.clippingPlanes,H),Hs(A,$,H),q.updateMultisampleRenderTarget(xt),q.updateRenderTargetMipmap(xt),Qt.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let ee=0,_e=O.length;ee<_e;ee++){const me=O[ee],{object:ne,geometry:Pe,material:Mt,group:He}=me;if(Mt.side===Sn&&ne.layers.test(H.layers)){const Jt=Mt.side;Mt.side=ke,Mt.needsUpdate=!0,Cc(ne,$,H,Pe,Mt,He),Mt.side=Jt,Mt.needsUpdate=!0,Pt=!0}}Pt===!0&&(q.updateMultisampleRenderTarget(xt),q.updateRenderTargetMipmap(xt))}R.setRenderTarget(_t,At,Ct),R.setClearColor(Et,ot),Xt!==void 0&&(H.viewport=Xt),R.toneMapping=Gt}function Hs(A,O,$){const H=O.isScene===!0?O.overrideMaterial:null;for(let V=0,xt=A.length;V<xt;V++){const St=A[V],{object:_t,geometry:At,group:Ct}=St;let Gt=St.material;Gt.allowOverride===!0&&H!==null&&(Gt=H),_t.layers.test($.layers)&&Cc(_t,O,$,At,Gt,Ct)}}function Cc(A,O,$,H,V,xt){A.onBeforeRender(R,O,$,H,V,xt),A.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),V.onBeforeRender(R,O,$,H,A,xt),V.transparent===!0&&V.side===Sn&&V.forceSinglePass===!1?(V.side=ke,V.needsUpdate=!0,R.renderBufferDirect($,O,H,V,A,xt),V.side=Zn,V.needsUpdate=!0,R.renderBufferDirect($,O,H,V,A,xt),V.side=Sn):R.renderBufferDirect($,O,H,V,A,xt),A.onAfterRender(R,O,$,H,V,xt)}function Vs(A,O,$){O.isScene!==!0&&(O=Se);const H=Z.get(A),V=b.state.lights,xt=b.state.shadowsArray,St=V.state.version,_t=ft.getParameters(A,V.state,xt,O,$,b.state.lightProbeGridArray),At=ft.getProgramCacheKey(_t);let Ct=H.programs;H.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?O.environment:null,H.fog=O.fog;const Gt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;H.envMap=rt.get(A.envMap||H.environment,Gt),H.envMapRotation=H.environment!==null&&A.envMap===null?O.environmentRotation:A.envMapRotation,Ct===void 0&&(A.addEventListener("dispose",on),Ct=new Map,H.programs=Ct);let Xt=Ct.get(At);if(Xt!==void 0){if(H.currentProgram===Xt&&H.lightsStateVersion===St)return Ic(A,_t),Xt}else _t.uniforms=ft.getUniforms(A),I!==null&&A.isNodeMaterial&&I.build(A,$,_t),A.onBeforeCompile(_t,R),Xt=ft.acquireProgram(_t,At),Ct.set(At,Xt),H.uniforms=_t.uniforms;const Pt=H.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Pt.clippingPlanes=It.uniform),Ic(A,_t),H.needsLights=Nu(A),H.lightsStateVersion=St,H.needsLights&&(Pt.ambientLightColor.value=V.state.ambient,Pt.lightProbe.value=V.state.probe,Pt.directionalLights.value=V.state.directional,Pt.directionalLightShadows.value=V.state.directionalShadow,Pt.spotLights.value=V.state.spot,Pt.spotLightShadows.value=V.state.spotShadow,Pt.rectAreaLights.value=V.state.rectArea,Pt.ltc_1.value=V.state.rectAreaLTC1,Pt.ltc_2.value=V.state.rectAreaLTC2,Pt.pointLights.value=V.state.point,Pt.pointLightShadows.value=V.state.pointShadow,Pt.hemisphereLights.value=V.state.hemi,Pt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Pt.spotLightMatrix.value=V.state.spotLightMatrix,Pt.spotLightMap.value=V.state.spotLightMap,Pt.pointShadowMatrix.value=V.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=Xt,H.uniformsList=null,Xt}function Pc(A){if(A.uniformsList===null){const O=A.currentProgram.getUniforms();A.uniformsList=Ir.seqWithValue(O.seq,A.uniforms)}return A.uniformsList}function Ic(A,O){const $=Z.get(A);$.outputColorSpace=O.outputColorSpace,$.batching=O.batching,$.batchingColor=O.batchingColor,$.instancing=O.instancing,$.instancingColor=O.instancingColor,$.instancingMorph=O.instancingMorph,$.skinning=O.skinning,$.morphTargets=O.morphTargets,$.morphNormals=O.morphNormals,$.morphColors=O.morphColors,$.morphTargetsCount=O.morphTargetsCount,$.numClippingPlanes=O.numClippingPlanes,$.numIntersection=O.numClipIntersection,$.vertexAlphas=O.vertexAlphas,$.vertexTangents=O.vertexTangents,$.toneMapping=O.toneMapping}function Lu(A,O){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;M.setFromMatrixPosition(O.matrixWorld);for(let $=0,H=A.length;$<H;$++){const V=A[$];if(V.texture!==null&&V.boundingBox.containsPoint(M))return V}return null}function Du(A,O,$,H,V){O.isScene!==!0&&(O=Se),q.resetTextureUnits();const xt=O.fog,St=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?O.environment:null,_t=W===null?R.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Yt.workingColorSpace,At=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ct=rt.get(H.envMap||St,At),Gt=H.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Xt=!!$.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pt=!!$.morphAttributes.position,ee=!!$.morphAttributes.normal,_e=!!$.morphAttributes.color;let me=dn;H.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(me=R.toneMapping);const ne=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Pe=ne!==void 0?ne.length:0,Mt=Z.get(H),He=b.state.lights;if(Ot===!0&&(Dt===!0||A!==J)){const oe=A===J&&H.id===X;It.setState(H,A,oe)}let Jt=!1;H.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==He.state.version||Mt.outputColorSpace!==_t||V.isBatchedMesh&&Mt.batching===!1||!V.isBatchedMesh&&Mt.batching===!0||V.isBatchedMesh&&Mt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Mt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Mt.instancing===!1||!V.isInstancedMesh&&Mt.instancing===!0||V.isSkinnedMesh&&Mt.skinning===!1||!V.isSkinnedMesh&&Mt.skinning===!0||V.isInstancedMesh&&Mt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Mt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Mt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Mt.instancingMorph===!1&&V.morphTexture!==null||Mt.envMap!==Ct||H.fog===!0&&Mt.fog!==xt||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==It.numPlanes||Mt.numIntersection!==It.numIntersection)||Mt.vertexAlphas!==Gt||Mt.vertexTangents!==Xt||Mt.morphTargets!==Pt||Mt.morphNormals!==ee||Mt.morphColors!==_e||Mt.toneMapping!==me||Mt.morphTargetsCount!==Pe||!!Mt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Jt=!0):(Jt=!0,Mt.__version=H.version);let Ze=Mt.currentProgram;Jt===!0&&(Ze=Vs(H,O,V),I&&H.isNodeMaterial&&I.onUpdateProgram(H,Ze,Mt));let an=!1,Pn=!1,gi=!1;const ie=Ze.getUniforms(),xe=Mt.uniforms;if(S.useProgram(Ze.program)&&(an=!0,Pn=!0,gi=!0),H.id!==X&&(X=H.id,Pn=!0),Mt.needsLights){const oe=Lu(b.state.lightProbeGridArray,V);Mt.lightProbeGrid!==oe&&(Mt.lightProbeGrid=oe,Pn=!0)}if(an||J!==A){S.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ie.setValue(F,"projectionMatrix",A.projectionMatrix),ie.setValue(F,"viewMatrix",A.matrixWorldInverse);const Ln=ie.map.cameraPosition;Ln!==void 0&&Ln.setValue(F,ae.setFromMatrixPosition(A.matrixWorld)),C.logarithmicDepthBuffer&&ie.setValue(F,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ie.setValue(F,"isOrthographic",A.isOrthographicCamera===!0),J!==A&&(J=A,Pn=!0,gi=!0)}if(Mt.needsLights&&(He.state.directionalShadowMap.length>0&&ie.setValue(F,"directionalShadowMap",He.state.directionalShadowMap,q),He.state.spotShadowMap.length>0&&ie.setValue(F,"spotShadowMap",He.state.spotShadowMap,q),He.state.pointShadowMap.length>0&&ie.setValue(F,"pointShadowMap",He.state.pointShadowMap,q)),V.isSkinnedMesh){ie.setOptional(F,V,"bindMatrix"),ie.setOptional(F,V,"bindMatrixInverse");const oe=V.skeleton;oe&&(oe.boneTexture===null&&oe.computeBoneTexture(),ie.setValue(F,"boneTexture",oe.boneTexture,q))}V.isBatchedMesh&&(ie.setOptional(F,V,"batchingTexture"),ie.setValue(F,"batchingTexture",V._matricesTexture,q),ie.setOptional(F,V,"batchingIdTexture"),ie.setValue(F,"batchingIdTexture",V._indirectTexture,q),ie.setOptional(F,V,"batchingColorTexture"),V._colorsTexture!==null&&ie.setValue(F,"batchingColorTexture",V._colorsTexture,q));const In=$.morphAttributes;if((In.position!==void 0||In.normal!==void 0||In.color!==void 0)&&N.update(V,$,Ze),(Pn||Mt.receiveShadow!==V.receiveShadow)&&(Mt.receiveShadow=V.receiveShadow,ie.setValue(F,"receiveShadow",V.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&O.environment!==null&&(xe.envMapIntensity.value=O.environmentIntensity),xe.dfgLUT!==void 0&&(xe.dfgLUT.value=P_()),Pn){if(ie.setValue(F,"toneMappingExposure",R.toneMappingExposure),Mt.needsLights&&Uu(xe,gi),xt&&H.fog===!0&&Rt.refreshFogUniforms(xe,xt),Rt.refreshMaterialUniforms(xe,H,j,nt,b.state.transmissionRenderTarget[A.id]),Mt.needsLights&&Mt.lightProbeGrid){const oe=Mt.lightProbeGrid;xe.probesSH.value=oe.texture,xe.probesMin.value.copy(oe.boundingBox.min),xe.probesMax.value.copy(oe.boundingBox.max),xe.probesResolution.value.copy(oe.resolution)}Ir.upload(F,Pc(Mt),xe,q)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ir.upload(F,Pc(Mt),xe,q),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ie.setValue(F,"center",V.center),ie.setValue(F,"modelViewMatrix",V.modelViewMatrix),ie.setValue(F,"normalMatrix",V.normalMatrix),ie.setValue(F,"modelMatrix",V.matrixWorld),H.uniformsGroups!==void 0){const oe=H.uniformsGroups;for(let Ln=0,_i=oe.length;Ln<_i;Ln++){const Lc=oe[Ln];st.update(Lc,Ze),st.bind(Lc,Ze)}}return Ze}function Uu(A,O){A.ambientLightColor.needsUpdate=O,A.lightProbe.needsUpdate=O,A.directionalLights.needsUpdate=O,A.directionalLightShadows.needsUpdate=O,A.pointLights.needsUpdate=O,A.pointLightShadows.needsUpdate=O,A.spotLights.needsUpdate=O,A.spotLightShadows.needsUpdate=O,A.rectAreaLights.needsUpdate=O,A.hemisphereLights.needsUpdate=O}function Nu(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(A,O,$){const H=Z.get(A);H.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Z.get(A.texture).__webglTexture=O,Z.get(A.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:$,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,O){const $=Z.get(A);$.__webglFramebuffer=O,$.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(A,O=0,$=0){W=A,L=O,U=$;let H=null,V=!1,xt=!1;if(A){const _t=Z.get(A);if(_t.__useDefaultFramebuffer!==void 0){S.bindFramebuffer(F.FRAMEBUFFER,_t.__webglFramebuffer),it.copy(A.viewport),et.copy(A.scissor),ct=A.scissorTest,S.viewport(it),S.scissor(et),S.setScissorTest(ct),X=-1;return}else if(_t.__webglFramebuffer===void 0)q.setupRenderTarget(A);else if(_t.__hasExternalTextures)q.rebindTextures(A,Z.get(A.texture).__webglTexture,Z.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Gt=A.depthTexture;if(_t.__boundDepthTexture!==Gt){if(Gt!==null&&Z.has(Gt)&&(A.width!==Gt.image.width||A.height!==Gt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(A)}}const At=A.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(xt=!0);const Ct=Z.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ct[O])?H=Ct[O][$]:H=Ct[O],V=!0):A.samples>0&&q.useMultisampledRTT(A)===!1?H=Z.get(A).__webglMultisampledFramebuffer:Array.isArray(Ct)?H=Ct[$]:H=Ct,it.copy(A.viewport),et.copy(A.scissor),ct=A.scissorTest}else it.copy(bt).multiplyScalar(j).floor(),et.copy(Vt).multiplyScalar(j).floor(),ct=Ft;if($!==0&&(H=k),S.bindFramebuffer(F.FRAMEBUFFER,H)&&S.drawBuffers(A,H),S.viewport(it),S.scissor(et),S.setScissorTest(ct),V){const _t=Z.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+O,_t.__webglTexture,$)}else if(xt){const _t=O;for(let At=0;At<A.textures.length;At++){const Ct=Z.get(A.textures[At]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+At,Ct.__webglTexture,$,_t)}}else if(A!==null&&$!==0){const _t=Z.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,_t.__webglTexture,$)}X=-1},this.readRenderTargetPixels=function(A,O,$,H,V,xt,St,_t=0){if(!(A&&A.isWebGLRenderTarget)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=Z.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At){S.bindFramebuffer(F.FRAMEBUFFER,At);try{const Ct=A.textures[_t],Gt=Ct.format,Xt=Ct.type;if(A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+_t),!C.textureFormatReadable(Gt)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!C.textureTypeReadable(Xt)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=A.width-H&&$>=0&&$<=A.height-V&&F.readPixels(O,$,H,V,pt.convert(Gt),pt.convert(Xt),xt)}finally{const Ct=W!==null?Z.get(W).__webglFramebuffer:null;S.bindFramebuffer(F.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(A,O,$,H,V,xt,St,_t=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=Z.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At)if(O>=0&&O<=A.width-H&&$>=0&&$<=A.height-V){S.bindFramebuffer(F.FRAMEBUFFER,At);const Ct=A.textures[_t],Gt=Ct.format,Xt=Ct.type;if(A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+_t),!C.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!C.textureTypeReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Pt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Pt),F.bufferData(F.PIXEL_PACK_BUFFER,xt.byteLength,F.STREAM_READ),F.readPixels(O,$,H,V,pt.convert(Gt),pt.convert(Xt),0);const ee=W!==null?Z.get(W).__webglFramebuffer:null;S.bindFramebuffer(F.FRAMEBUFFER,ee);const _e=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await gf(F,_e,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Pt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,xt),F.deleteBuffer(Pt),F.deleteSync(_e),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,O=null,$=0){const H=Math.pow(2,-$),V=Math.floor(A.image.width*H),xt=Math.floor(A.image.height*H),St=O!==null?O.x:0,_t=O!==null?O.y:0;q.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,$,0,0,St,_t,V,xt),S.unbindTexture()},this.copyTextureToTexture=function(A,O,$=null,H=null,V=0,xt=0){let St,_t,At,Ct,Gt,Xt,Pt,ee,_e;const me=A.isCompressedTexture?A.mipmaps[xt]:A.image;if($!==null)St=$.max.x-$.min.x,_t=$.max.y-$.min.y,At=$.isBox3?$.max.z-$.min.z:1,Ct=$.min.x,Gt=$.min.y,Xt=$.isBox3?$.min.z:0;else{const xe=Math.pow(2,-V);St=Math.floor(me.width*xe),_t=Math.floor(me.height*xe),A.isDataArrayTexture?At=me.depth:A.isData3DTexture?At=Math.floor(me.depth*xe):At=1,Ct=0,Gt=0,Xt=0}H!==null?(Pt=H.x,ee=H.y,_e=H.z):(Pt=0,ee=0,_e=0);const ne=pt.convert(O.format),Pe=pt.convert(O.type);let Mt;O.isData3DTexture?(q.setTexture3D(O,0),Mt=F.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(q.setTexture2DArray(O,0),Mt=F.TEXTURE_2D_ARRAY):(q.setTexture2D(O,0),Mt=F.TEXTURE_2D),S.activeTexture(F.TEXTURE0),S.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,O.flipY),S.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),S.pixelStorei(F.UNPACK_ALIGNMENT,O.unpackAlignment);const He=S.getParameter(F.UNPACK_ROW_LENGTH),Jt=S.getParameter(F.UNPACK_IMAGE_HEIGHT),Ze=S.getParameter(F.UNPACK_SKIP_PIXELS),an=S.getParameter(F.UNPACK_SKIP_ROWS),Pn=S.getParameter(F.UNPACK_SKIP_IMAGES);S.pixelStorei(F.UNPACK_ROW_LENGTH,me.width),S.pixelStorei(F.UNPACK_IMAGE_HEIGHT,me.height),S.pixelStorei(F.UNPACK_SKIP_PIXELS,Ct),S.pixelStorei(F.UNPACK_SKIP_ROWS,Gt),S.pixelStorei(F.UNPACK_SKIP_IMAGES,Xt);const gi=A.isDataArrayTexture||A.isData3DTexture,ie=O.isDataArrayTexture||O.isData3DTexture;if(A.isDepthTexture){const xe=Z.get(A),In=Z.get(O),oe=Z.get(xe.__renderTarget),Ln=Z.get(In.__renderTarget);S.bindFramebuffer(F.READ_FRAMEBUFFER,oe.__webglFramebuffer),S.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ln.__webglFramebuffer);for(let _i=0;_i<At;_i++)gi&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Z.get(A).__webglTexture,V,Xt+_i),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Z.get(O).__webglTexture,xt,_e+_i)),F.blitFramebuffer(Ct,Gt,St,_t,Pt,ee,St,_t,F.DEPTH_BUFFER_BIT,F.NEAREST);S.bindFramebuffer(F.READ_FRAMEBUFFER,null),S.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(V!==0||A.isRenderTargetTexture||Z.has(A)){const xe=Z.get(A),In=Z.get(O);S.bindFramebuffer(F.READ_FRAMEBUFFER,G),S.bindFramebuffer(F.DRAW_FRAMEBUFFER,D);for(let oe=0;oe<At;oe++)gi?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,xe.__webglTexture,V,Xt+oe):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,xe.__webglTexture,V),ie?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,In.__webglTexture,xt,_e+oe):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,In.__webglTexture,xt),V!==0?F.blitFramebuffer(Ct,Gt,St,_t,Pt,ee,St,_t,F.COLOR_BUFFER_BIT,F.NEAREST):ie?F.copyTexSubImage3D(Mt,xt,Pt,ee,_e+oe,Ct,Gt,St,_t):F.copyTexSubImage2D(Mt,xt,Pt,ee,Ct,Gt,St,_t);S.bindFramebuffer(F.READ_FRAMEBUFFER,null),S.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else ie?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(Mt,xt,Pt,ee,_e,St,_t,At,ne,Pe,me.data):O.isCompressedArrayTexture?F.compressedTexSubImage3D(Mt,xt,Pt,ee,_e,St,_t,At,ne,me.data):F.texSubImage3D(Mt,xt,Pt,ee,_e,St,_t,At,ne,Pe,me):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,xt,Pt,ee,St,_t,ne,Pe,me.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,xt,Pt,ee,me.width,me.height,ne,me.data):F.texSubImage2D(F.TEXTURE_2D,xt,Pt,ee,St,_t,ne,Pe,me);S.pixelStorei(F.UNPACK_ROW_LENGTH,He),S.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Jt),S.pixelStorei(F.UNPACK_SKIP_PIXELS,Ze),S.pixelStorei(F.UNPACK_SKIP_ROWS,an),S.pixelStorei(F.UNPACK_SKIP_IMAGES,Pn),xt===0&&O.generateMipmaps&&F.generateMipmap(Mt),S.unbindTexture()},this.initRenderTarget=function(A){Z.get(A).__webglFramebuffer===void 0&&q.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?q.setTextureCube(A,0):A.isData3DTexture?q.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?q.setTexture2DArray(A,0):q.setTexture2D(A,0),S.unbindTexture()},this.resetState=function(){L=0,U=0,W=null,S.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}}const us=86400;class L_{elapsed;timeScale;paused=!1;latitude=50;dayOfYear=172;constructor(t=7,e=120){this.elapsed=t*3600,this.timeScale=e}advance(t){if(this.paused)return 0;const e=Math.min(t,.25)*this.timeScale;return this.elapsed+=e,e}get totalSeconds(){return this.elapsed}get secondsOfDay(){return(this.elapsed%us+us)%us}get hour(){return this.secondsOfDay/3600}get day(){return Math.floor(this.elapsed/us)}get weekday(){return this.day%7}get isWeekend(){return this.weekday>=5}setHour(t){this.elapsed=this.day*us+t*3600}formatTime(){const t=Math.floor(this.hour),e=Math.floor((this.hour-t)*60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}formatDay(){return`${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][this.weekday]} · day ${this.day+1}`}sunDirection(){const t=this.latitude*Math.PI/180,e=.409*Math.sin(2*Math.PI*(this.dayOfYear-81)/365),n=(this.hour-12)/12*Math.PI,s=Math.sin(t)*Math.sin(e)+Math.cos(t)*Math.cos(e)*Math.cos(n),r=Math.asin(Math.max(-1,Math.min(1,s))),o=(Math.sin(e)-Math.sin(t)*s)/(Math.cos(t)*Math.cos(r)||1e-6);let a=Math.acos(Math.max(-1,Math.min(1,o)));return n>0&&(a=2*Math.PI-a),{x:Math.cos(r)*Math.sin(a),y:Math.sin(r),z:-Math.cos(r)*Math.cos(a),altitude:r}}}const kr=110574,pc=111320;class qr{originLat;originLon;mPerDegLon;constructor(t,e){this.originLat=t,this.originLon=e,this.mPerDegLon=pc*Math.cos(t*Math.PI/180)}static fromBBox(t){return new qr((t.south+t.north)/2,(t.west+t.east)/2)}project(t,e){const n=(e-this.originLon)*this.mPerDegLon,s=-(t-this.originLat)*kr;return[n,s]}unproject(t,e){return{lat:this.originLat-e/kr,lon:this.originLon+t/this.mPerDegLon}}}function D_(i,t){const e=t/kr,n=t/(pc*Math.cos(i.lat*Math.PI/180));return{south:i.lat-e,west:i.lon-n,north:i.lat+e,east:i.lon+n}}function eu(i){const t=(i.south+i.north)/2*(Math.PI/180);return{width:(i.east-i.west)*pc*Math.cos(t),height:(i.north-i.south)*kr}}function Ki(i){let t=0;for(let e=0,n=i.length-1;e<i.length;n=e++)t+=(i[n][0]-i[e][0])*(i[n][1]+i[e][1]);return t/2}function nu(i){let t=0,e=0,n=0;for(let s=0,r=i.length-1;s<i.length;r=s++){const o=i[r][0]*i[s][1]-i[s][0]*i[r][1];n+=o,t+=(i[r][0]+i[s][0])*o,e+=(i[r][1]+i[s][1])*o}if(n/=2,Math.abs(n)<1e-6){let s=0,r=0;for(const o of i)s+=o[0],r+=o[1];return[s/i.length,r/i.length]}return[t/(6*n),e/(6*n)]}const Do=["https://overpass-api.de/api/interpreter","https://overpass.kumi.systems/api/interpreter","https://overpass.private.coffee/api/interpreter"],U_="https://nominatim.openstreetmap.org/search",kl=6e3;function N_(i){const t=`${i.south.toFixed(6)},${i.west.toFixed(6)},${i.north.toFixed(6)},${i.east.toFixed(6)}`;return`[out:json][timeout:90];
(
  way["building"](${t});
  relation["building"]["type"="multipolygon"](${t});
  way["highway"](${t});
  way["railway"](${t});
  node["highway"="crossing"](${t});
  way["natural"~"^(water|wood|scrub|grassland|sand|beach)$"](${t});
  way["waterway"="riverbank"](${t});
  way["waterway"~"^(river|stream|canal|ditch|drain)$"](${t});
  relation["natural"="water"]["type"="multipolygon"](${t});
  way["landuse"~"^(grass|forest|meadow|village_green|cemetery|recreation_ground|reservoir|basin)$"](${t});
  way["leisure"~"^(park|garden|pitch|playground|sports_centre)$"](${t});
  way["amenity"~"^(parking|grave_yard)$"](${t});
  node["amenity"](${t});
  node["shop"](${t});
  node["leisure"](${t});
  node["office"](${t});
  node["tourism"~"^(museum|gallery|hotel)$"](${t});
  node["railway"="station"](${t});
);
out body geom qt;`}const F_="lifeboon-osm",Ji="areas",O_=10080*60*1e3;function iu(){return new Promise(i=>{if(typeof indexedDB>"u")return i(null);const t=indexedDB.open(F_,1);t.onupgradeneeded=()=>{const e=t.result;e.objectStoreNames.contains(Ji)||e.createObjectStore(Ji)},t.onsuccess=()=>i(t.result),t.onerror=()=>i(null)})}async function B_(i){const t=await iu();return t?new Promise(e=>{const s=t.transaction(Ji,"readonly").objectStore(Ji).get(i);s.onsuccess=()=>{const r=s.result;r&&Date.now()-r.at<O_?e(r.data):e(null)},s.onerror=()=>e(null)}):null}async function k_(i,t){const e=await iu();e&&await new Promise(n=>{const s=e.transaction(Ji,"readwrite");s.objectStore(Ji).put({at:Date.now(),data:t},i),s.oncomplete=()=>n(),s.onerror=()=>n()})}const z_=3;function G_(i){const t=[i.south,i.west,i.north,i.east].map(e=>e.toFixed(5)).join(",");return`v${z_}:${t}`}class li extends Error{constructor(t,e){super(t),this.cause=e,this.name="OverpassError"}cause}async function H_(i,t={}){const e=eu(i);if(Math.max(e.width,e.height)>kl)throw new li(`Area is ${Math.round(Math.max(e.width,e.height))} m across; the limit is ${kl} m.`);const n=G_(i),s=await B_(n);if(s)return t.onProgress?.("Loaded from local cache"),s;const r=N_(i);let o;for(let a=0;a<Do.length;a++){const c=Do[a];try{t.onProgress?.(a===0?"Querying OpenStreetMap…":`Mirror ${a+1} of ${Do.length}…`);const l=await fetch(c,{method:"POST",body:new URLSearchParams({data:r}),signal:t.signal});if(!l.ok)throw new li(`${c} returned HTTP ${l.status}`);const h=await l.json();if(!h||!Array.isArray(h.elements))throw new li("Malformed response from Overpass");return await k_(n,h),h}catch(l){if(l?.name==="AbortError")throw l;o=l}}throw new li("Could not reach any OpenStreetMap mirror. Check your connection, or switch to the offline city.",o)}async function V_(i,t){const e=`${U_}?${new URLSearchParams({q:i,format:"jsonv2",limit:"5",addressdetails:"0"})}`,n=await fetch(e,{signal:t,headers:{Accept:"application/json"}});if(!n.ok)throw new li(`Place search failed (HTTP ${n.status})`);return(await n.json()).map(r=>({name:r.display_name,lat:parseFloat(r.lat),lon:parseFloat(r.lon)}))}class Yn{state;constructor(t){this.state=t>>>0||1}next(){this.state=this.state+1831565813>>>0;let t=this.state;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+this.next()*(e-t)}int(t,e){return Math.floor(this.range(t,e))}pick(t){return t[Math.floor(this.next()*t.length)]}chance(t){return this.next()<t}gaussian(t,e){const n=this.next()+this.next()+this.next()+this.next()-2;return t+Math.max(-3,Math.min(3,n*1.4142))*e}}function mc(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function _r(i,t){let e=Math.imul(i,374761393)+Math.imul(t,668265263);return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function Uo(i,t,e){const n=i/e,s=t/e,r=Math.floor(n),o=Math.floor(s);let a=n-r,c=s-o;a=a*a*(3-2*a),c=c*c*(3-2*c);const l=_r(r,o),h=_r(r+1,o),u=_r(r,o+1),f=_r(r+1,o+1),d=l+(h-l)*a,p=u+(f-u)*a;return d+(p-d)*c}function Vn(i,t,e=1400){return(Uo(i,t,e)*.55+Uo(i+811,t-517,e*.37)*.3+Uo(i-233,t+907,e*.136)*.15)*2-1}function zl(i,t){if(!i.length)return 0;if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0]){const[n,s]=i[e-1],[r,o]=i[e],a=r===n?1:(t-n)/(r-n);return s+(o-s)*a}return i[i.length-1][1]}const W_=1.2,X_=8;class Gs{minHeight=0;maxHeight=0;hasRelief=!1;resolution=1/0;heightAt(){return 0}slopeAt(){return 0}gradeStreets(){return!1}gradePads(){return!1}}class Cn{constructor(t,e,n,s,r,o){this.data=t,this.cols=e,this.rows=n,this.originX=s,this.originZ=r,this.resolution=o,this.recomputeBounds()}data;cols;rows;originX;originZ;resolution;low=0;high=0;mean=0;get minHeight(){return this.low}get maxHeight(){return this.high}get hasRelief(){return this.high-this.low>=3}heightAt(t,e){const n=(t-this.originX)/this.resolution,s=(e-this.originZ)/this.resolution,r=Math.floor(n),o=Math.floor(s),a=n-r,c=s-o,l=this.sample(r,o),h=this.sample(r+1,o),u=this.sample(r,o+1),f=this.sample(r+1,o+1),d=l+(h-l)*a,p=u+(f-u)*a,x=d+(p-d)*c,g=Math.max(0,-n,n-(this.cols-1)),m=Math.max(0,-s,s-(this.rows-1));if(g===0&&m===0)return x;const _=Math.hypot(g,m)*this.resolution,y=1-Math.exp(-_/260);return x+(this.mean-x)*y+Vn(t,e)*this.surroundingsAmplitude*y}get surroundingsAmplitude(){return Math.min(70,Math.max(9,(this.high-this.low)*.55))}sample(t,e){const n=t<0?0:t>=this.cols?this.cols-1:t,s=e<0?0:e>=this.rows?this.rows-1:e;return this.data[s*this.cols+n]}slopeAt(t,e){const n=this.resolution,s=(this.heightAt(t+n,e)-this.heightAt(t-n,e))/(2*n),r=(this.heightAt(t,e+n)-this.heightAt(t,e-n))/(2*n);return Math.hypot(s,r)}carveTo(t,e){if(t.length<3)return!1;let n=1/0,s=-1/0,r=1/0,o=-1/0;for(const[_,y]of t)_<n&&(n=_),_>s&&(s=_),y<r&&(r=y),y>o&&(o=y);const a=Math.max(0,Math.floor((n-this.originX)/this.resolution)-1),c=Math.min(this.cols-1,Math.ceil((s-this.originX)/this.resolution)+1),l=Math.max(0,Math.floor((r-this.originZ)/this.resolution)-1),h=Math.min(this.rows-1,Math.ceil((o-this.originZ)/this.resolution)+1),u=c-a+1,f=h-l+1;if(u<1||f<1)return!1;const d=new Uint8Array(u*f);for(let _=0;_<f;_++){const y=this.originZ+(_+l)*this.resolution;for(let M=0;M<u;M++){const w=this.originX+(M+a)*this.resolution;Gl(w,y,t)&&(d[_*u+M]=1)}}const p=new Uint8Array(u*f);for(let _=0;_<f;_++)for(let y=0;y<u;y++)if(d[_*u+y])for(let M=-1;M<=1;M++)for(let w=-1;w<=1;w++){const b=_+M,T=y+w;b<0||T<0||b>=f||T>=u||(p[b*u+T]=1)}const x=new Float32Array(u*f);for(let _=0;_<x.length;_++)x[_]=p[_]?1/0:0;Y_(x,u,f);const g=Math.max(1,X_/this.resolution);let m=!1;for(let _=0;_<f;_++)for(let y=0;y<u;y++){const M=x[_*u+y];if(M<=0)continue;const w=Math.max(.12,Math.min(1,M/g));let b=e-W_*w;d[_*u+y]&&(b=Math.min(b,e-.2));const T=(_+l)*this.cols+(y+a);this.data[T]>b&&(this.data[T]=b,m=!0)}return m}carveAlong(t,e,n,s){let r=!1;const o=e+this.resolution;for(let a=0;a<t.length-1;a++){const[c,l]=t[a],[h,u]=t[a+1],f=(h-c)**2+(u-l)**2;if(f<1e-6)continue;const d=Math.max(0,Math.floor((Math.min(c,h)-o-this.originX)/this.resolution)),p=Math.min(this.cols-1,Math.ceil((Math.max(c,h)+o-this.originX)/this.resolution)),x=Math.max(0,Math.floor((Math.min(l,u)-o-this.originZ)/this.resolution)),g=Math.min(this.rows-1,Math.ceil((Math.max(l,u)+o-this.originZ)/this.resolution));for(let m=x;m<=g;m++){const _=this.originZ+m*this.resolution;for(let y=d;y<=p;y++){const M=this.originX+y*this.resolution;let w=((M-c)*(h-c)+(_-l)*(u-l))/f;w=w<0?0:w>1?1:w;const b=c+(h-c)*w,T=l+(u-l)*w;if((M-b)**2+(_-T)**2>e*e)continue;const v=Math.hypot(M-b,_-T)/e,E=n[a]+(n[a+1]-n[a])*w-s*(1-v*v),R=m*this.cols+y;this.data[R]>E&&(this.data[R]=E,r=!0)}}}return r}refinedTo(t){return this.resampled(t,{minX:this.originX,minZ:this.originZ,maxX:this.originX+(this.cols-1)*this.resolution,maxZ:this.originZ+(this.rows-1)*this.resolution})}resampled(t,e){const n=Math.min(this.originX,e.minX),s=Math.min(this.originZ,e.minZ),r=Math.max(this.originX+(this.cols-1)*this.resolution,e.maxX)-n,o=Math.max(this.originZ+(this.rows-1)*this.resolution,e.maxZ)-s,a=Math.min(t,this.resolution);if(a>=this.resolution*.99&&n>=this.originX-1e-6&&s>=this.originZ-1e-6&&r<=(this.cols-1)*this.resolution+1e-6&&o<=(this.rows-1)*this.resolution+1e-6)return this;const c=Math.max(2,Math.round(r/a)+1),l=Math.max(2,Math.round(o/a)+1),h=new Float32Array(c*l);for(let u=0;u<l;u++){const f=s+u*a;for(let d=0;d<c;d++)h[u*c+d]=this.heightAt(n+d*a,f)}return new Cn(h,c,l,n,s,a)}gradeStreets(t,e=this.shoulderReach()){if(!t.length)return!1;const n=this.cols*this.rows,s=new Float32Array(n),r=new Float32Array(n),o=new Int32Array(n).fill(-1),a=new Float32Array(n),c=new Float32Array(n).fill(1/0);for(let h=0;h<t.length;h++){const u=t[h],{points:f,halfWidth:d,blend:p,levels:x,depth:g,shape:m}=u;if(f.length<2||x.length!==f.length)continue;const _=d+Math.max(p,e),y=zl(m,d);let M=0;for(const[,w]of m)w<M&&(M=w);for(let w=0;w<f.length-1;w++){const[b,T]=f[w],[v,E]=f[w+1],R=(v-b)**2+(E-T)**2;if(R<1e-9)continue;const P=Math.max(0,Math.floor((Math.min(b,v)-_-this.originX)/this.resolution)),I=Math.min(this.cols-1,Math.ceil((Math.max(b,v)+_-this.originX)/this.resolution)),k=Math.max(0,Math.floor((Math.min(T,E)-_-this.originZ)/this.resolution)),G=Math.min(this.rows-1,Math.ceil((Math.max(T,E)+_-this.originZ)/this.resolution));for(let D=k;D<=G;D++){const L=this.originZ+D*this.resolution;for(let U=P;U<=I;U++){const W=this.originX+U*this.resolution;let X=((W-b)*(v-b)+(L-T)*(E-T))/R;X=X<0?0:X>1?1:X;const J=b+(v-b)*X,it=T+(E-T)*X,et=Math.hypot(W-J,L-it);if(et>_)continue;const ct=D*this.cols+U,Et=x[w]+(x[w+1]-x[w])*X;if(et<=d+p){let ot=1;if(et>d){const nt=(et-d)/p;ot=1-nt*nt*(3-2*nt)}(ot>s[ct]||ot===s[ct]&&o[ct]===h&&et<a[ct])&&(s[ct]=ot,o[ct]=h,a[ct]=et,r[ct]=Et+(et<=d?M:zl(m,et))-g)}if(et<=d+e){const ot=Et+y-g;ot<c[ct]&&(c[ct]=ot)}}}}}let l=!1;for(let h=0;h<n;h++){const u=s[h],f=c[h];if(u<=0&&f===1/0)continue;let d=u>0?this.data[h]*(1-u)+r[h]*u:this.data[h];u<.999&&f<d&&(d=f),d!==this.data[h]&&(this.data[h]=d,l=!0)}return l&&this.recomputeBounds(),l}shoulderReach(){return Math.max(4,this.resolution*1.6)}gradePads(t){if(!t.length)return!1;let e=!1;for(const n of t){if(n.ring.length<3)continue;const s=n.blend;let r=1/0,o=-1/0,a=1/0,c=-1/0;for(const[d,p]of n.ring)d<r&&(r=d),d>o&&(o=d),p<a&&(a=p),p>c&&(c=p);const l=Math.max(0,Math.floor((r-s-this.originX)/this.resolution)),h=Math.min(this.cols-1,Math.ceil((o+s-this.originX)/this.resolution)),u=Math.max(0,Math.floor((a-s-this.originZ)/this.resolution)),f=Math.min(this.rows-1,Math.ceil((c+s-this.originZ)/this.resolution));for(let d=u;d<=f;d++){const p=this.originZ+d*this.resolution;for(let x=l;x<=h;x++){const g=this.originX+x*this.resolution,m=d*this.cols+x,_=n.heightAt(g,p)-n.depth;if(Gl(g,p,n.ring)){this.data[m]!==_&&(this.data[m]=_,e=!0);continue}const y=q_(g,p,n.ring);if(y>s||y>n.blend)continue;const M=y/n.blend,w=1-M*M*(3-2*M),b=this.data[m]*(1-w)+_*w;b!==this.data[m]&&(this.data[m]=b,e=!0)}}}return e&&this.recomputeBounds(),e}snapshot(t=e=>e){const e=new Array(this.data.length);for(let n=0;n<this.data.length;n++)e[n]=t(this.data[n]);return{cols:this.cols,rows:this.rows,originX:this.originX,originZ:this.originZ,resolution:this.resolution,data:e}}static fromSnapshot(t){return new Cn(Float32Array.from(t.data),t.cols,t.rows,t.originX,t.originZ,t.resolution)}recomputeBounds(){let t=1/0,e=-1/0,n=0;for(let s=0;s<this.data.length;s++)this.data[s]<t&&(t=this.data[s]),this.data[s]>e&&(e=this.data[s]),n+=this.data[s];this.low=isFinite(t)?t:0,this.high=isFinite(e)?e:0,this.mean=this.data.length?n/this.data.length:0}minUnder(t){let e=1/0;for(const[n,s]of t){const r=this.heightAt(n,s);r<e&&(e=r)}return isFinite(e)?e:0}}function Z_(i,t){let e=1/0,n=-1/0;for(const[s,r]of i){const o=t.heightAt(s,r);o<e&&(e=o),o>n&&(n=o)}return isFinite(e)?{low:e,high:n}:{low:0,high:0}}function Gl(i,t,e){let n=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const o=e[s][0],a=e[s][1],c=e[r][0],l=e[r][1];a>t!=l>t&&i<(c-o)*(t-a)/(l-a)+o&&(n=!n)}return n}function $_(i,t=3){if(i.length<3)return i.slice();let e=i.slice();for(let n=0;n<t;n++){const s=e.slice();for(let r=1;r<e.length-1;r++)s[r]=e[r-1]*.25+e[r]*.5+e[r+1]*.25;e=s}return e}function Y_(i,t,e){const s=Math.SQRT2;for(let r=0;r<e;r++)for(let o=0;o<t;o++){const a=r*t+o;if(i[a]===0)continue;let c=i[a];o>0&&(c=Math.min(c,i[a-1]+1)),r>0&&(c=Math.min(c,i[a-t]+1)),r>0&&o>0&&(c=Math.min(c,i[a-t-1]+s)),r>0&&o<t-1&&(c=Math.min(c,i[a-t+1]+s)),i[a]=c}for(let r=e-1;r>=0;r--)for(let o=t-1;o>=0;o--){const a=r*t+o;if(i[a]===0)continue;let c=i[a];o<t-1&&(c=Math.min(c,i[a+1]+1)),r<e-1&&(c=Math.min(c,i[a+t]+1)),r<e-1&&o<t-1&&(c=Math.min(c,i[a+t+1]+s)),r<e-1&&o>0&&(c=Math.min(c,i[a+t-1]+s)),i[a]=c}}function q_(i,t,e){let n=1/0;for(let s=0,r=e.length-1;s<e.length;r=s++){const[o,a]=e[r],[c,l]=e[s],h=c-o,u=l-a,f=h*h+u*u;let d=f<1e-9?0:((i-o)*h+(t-a)*u)/f;d=d<0?0:d>1?1:d;const p=Math.hypot(i-(o+h*d),t-(a+u*d));p<n&&(n=p)}return n}const As={motorway:0,trunk:0,primary:0,secondary:0,tertiary:0,residential:0,service:0,pedestrian:0,footway:0,cycleway:0,steps:0,track:0},Ns={name:"RU",kerbReveal:.15,kerbWidth:.15,crossfall:.02,verge:{...As,trunk:3,primary:3,secondary:2.5,tertiary:2,residential:1.5},pavement:{...As,trunk:3,primary:3,secondary:2.25,tertiary:2.25,residential:1.5},batter:2.5,path:{...As,pedestrian:6,footway:2,cycleway:2.4,steps:2,track:3.2}},gc={...Ns,name:"default",kerbReveal:.12,verge:{...As,trunk:1.5,primary:1,secondary:.6},pavement:{...As,trunk:3,primary:3,secondary:2.5,tertiary:2.2,residential:1.8},batter:2};function K_(i,t){return i>41&&i<78&&(t>19&&t<180||t<-168)?Ns:gc}function J_(i){return i.drivable}function su(i,t){const e=i.width/2;if(!J_(i)){const h=t.path[i.cls]||i.width;return[{offset:0,dy:0,surface:"carriageway"},{offset:h/2,dy:0,surface:"carriageway"},{offset:h/2+.6,dy:-.08,surface:"batter"}]}const n=t.crossfall*e;if(i.bridge){const h=-n+t.kerbReveal,u=e+t.kerbWidth+1.2;return[{offset:0,dy:0,surface:"carriageway"},{offset:e,dy:-n,surface:"carriageway"},{offset:e,dy:h,surface:"kerb"},{offset:e+t.kerbWidth,dy:h,surface:"kerb"},{offset:u,dy:h,surface:"pavement"},{offset:u,dy:h+.95,surface:"parapet"},{offset:u+.28,dy:h+.95,surface:"parapet"},{offset:u+.28,dy:h-.95,surface:"fascia"}]}const s=[{offset:0,dy:0,surface:"carriageway"},{offset:e,dy:-n,surface:"carriageway"}],r=-n+t.kerbReveal;s.push({offset:e,dy:r,surface:"kerb"}),s.push({offset:e+t.kerbWidth,dy:r,surface:"kerb"});let o=e+t.kerbWidth;const a=t.verge[i.cls],l=i.sidewalk==="no"||i.sidewalk==="separate"?0:t.pavement[i.cls];return a>0&&(o+=a,s.push({offset:o,dy:r-.04,surface:"verge"})),l>0&&(o+=l,s.push({offset:o,dy:r,surface:"pavement"})),s.push({offset:o+t.batter,dy:Number.NaN,surface:"batter"}),s}function Qi(i,t){const e=Math.abs(t);let n=i[0];for(let s=1;s<i.length;s++){const r=i[s];if(Number.isNaN(r.dy))break;if(e<=r.offset){const o=r.offset-n.offset,a=o<=1e-6?1:(e-n.offset)/o;return n.dy+(r.dy-n.dy)*a}n=r}return n.dy}function Hl(i){return i[i.length-1].offset}function Kr(i){for(let t=i.length-1;t>=0;t--)if(i[t].surface!=="batter")return i[t].offset;return i[0].offset}const No=3.2;function Xn(i){if(!i)return;const t=i.trim(),e=/^([\d.]+)\s*'/.exec(t);if(e)return parseFloat(e[1])*.3048;const n=parseFloat(t.replace(",","."));if(!(!isFinite(n)||n<=0||n>900))return n}function Q_(i){const t=i.building??"yes",e=i.amenity;return i.shop||t==="retail"||t==="supermarket"||t==="kiosk"||t==="mall"?"retail":t==="office"||t==="commercial"||i.office?"office":t==="industrial"||t==="warehouse"||t==="factory"||i.industrial?"industrial":t==="school"||t==="university"||t==="college"||t==="kindergarten"||e==="school"||e==="university"||e==="college"?"education":t==="church"||t==="cathedral"||t==="chapel"||t==="mosque"||t==="synagogue"||t==="temple"||i.religion?"religious":t==="hospital"||t==="civic"||t==="public"||t==="government"||t==="train_station"||t==="museum"||e==="hospital"||e==="townhall"||e==="library"?"civic":t==="house"||t==="residential"||t==="apartments"||t==="detached"||t==="terrace"||t==="semidetached_house"||t==="bungalow"||t==="dormitory"||t==="hotel"?"residential":t==="garage"||t==="garages"||t==="shed"||t==="hut"||t==="roof"||t==="carport"||t==="greenhouse"||t==="service"?"other":"residential"}function j_(i,t){switch(i){case"residential":return t<120?2:t<400?3:5;case"office":return t<500?4:8;case"commercial":case"retail":return 2;case"industrial":return 1;case"education":return 3;case"civic":return 3;case"religious":return 2;default:return 1}}function tx(i,t,e){const n=Xn(i.height)??Xn(i["building:height"]),s=parseFloat(i["building:levels"]??i.levels??""),r=isFinite(s)&&s>0&&s<200?s:n?Math.max(1,Math.round(n/No)):j_(t,e),o=n??r*No+(t==="industrial"?2:1.2),a=Xn(i.min_height),c=parseFloat(i["building:min_level"]??""),l=a??(isFinite(c)&&c>0?c*No:0);return{height:Math.max(2,o),minHeight:Math.min(l,o-1),levels:r}}function ru(i,t,e){const n=t*e;switch(i){case"residential":return Math.max(1,Math.round(n/55));case"office":return Math.max(1,Math.round(n/22));case"retail":case"commercial":return Math.max(1,Math.round(n/60));case"education":return Math.max(2,Math.round(n/90));case"civic":return Math.max(1,Math.round(n/70));case"industrial":return Math.max(1,Math.round(n/150));case"religious":return Math.max(1,Math.round(n/200));default:return 0}}const ex={motorway:"motorway",motorway_link:"motorway",trunk:"trunk",trunk_link:"trunk",primary:"primary",primary_link:"primary",secondary:"secondary",secondary_link:"secondary",tertiary:"tertiary",tertiary_link:"tertiary",unclassified:"residential",residential:"residential",living_street:"residential",service:"service",pedestrian:"pedestrian",footway:"footway",path:"footway",cycleway:"cycleway",steps:"steps",track:"track"};function nx(i){const t=i.highway;if(t)return ex[t]}const ix={motorway:14,trunk:12,primary:11,secondary:9.5,tertiary:8,residential:6.5,service:4.2,pedestrian:6,footway:2,cycleway:2.4,steps:2,track:3.2};function sx(i,t){const e=parseFloat(i.lanes??""),n=isFinite(e)&&e>0&&e<12?e:void 0,s=Xn(i.width);if(s)return{width:Math.max(1.5,s),lanes:n??Math.max(1,Math.round(s/3.2))};if(n)return{width:Math.max(2,n*3.2),lanes:n};const r=ix[t];return{width:r,lanes:Math.max(1,Math.round(r/3.2))}}const rx=new Set(["residential","service","pedestrian","footway","cycleway","steps","track","tertiary","secondary","primary"]),ox=new Set(["motorway","trunk","primary","secondary","tertiary","residential","service"]);function ax(i,t){return t.foot==="no"||t.access==="private"||t.access==="no"?!1:t.foot==="yes"||t.foot==="designated"?!0:rx.has(i)}function cx(i,t){return t.motor_vehicle==="no"||t.access==="no"?!1:ox.has(i)}function lx(i){const t=i.sidewalk??i["sidewalk:both"],e=i["sidewalk:left"],n=i["sidewalk:right"];if(t)switch(t){case"both":case"yes":return"both";case"left":return"left";case"right":return"right";case"no":case"none":return"no";case"separate":return"separate"}const s=e&&e!=="no"&&e!=="separate",r=n&&n!=="no"&&n!=="separate";if(s&&r)return"both";if(s)return"left";if(r)return"right";if(e==="separate"||n==="separate")return"separate";if(e==="no"&&n==="no")return"no"}function hx(i){return i.footway==="sidewalk"||i.path==="sidewalk"}function ux(i){return i.footway==="crossing"||i.path==="crossing"||i.cycleway==="crossing"||i.highway==="crossing"}const fx={river:"river",stream:"stream",canal:"canal",ditch:"ditch",drain:"drain"},dx={river:9,stream:2.5,canal:7,ditch:1.4,drain:1.2};function px(i){const t=i.waterway;if(t)return fx[t]}function mx(i,t){const e=Xn(i.width)??Xn(i["water:width"]);return e&&e>.3&&e<400?e:dx[t]}const gx={rail:"rail",light_rail:"light_rail",tram:"tram",subway:"subway",narrow_gauge:"rail",preserved:"disused",disused:"disused",abandoned:"disused"};function _x(i){const t=i.railway;if(t&&!(t==="platform"||t==="station"||t==="level_crossing"||t==="crossing"||t==="signal"||t==="switch"||t==="buffer_stop"||t==="razed"))return gx[t]}function xx(i){const t=parseFloat(i.tracks??"");return isFinite(t)&&t>=1&&t<12?Math.round(t):1}function ou(i){const t=i.amenity,e=i.shop,n=i.leisure,s=i.tourism,r=i.office,o=i.healthcare;if(t==="cafe"||t==="restaurant"||t==="fast_food"||t==="bar"||t==="pub"||t==="food_court"||t==="ice_cream"||t==="biergarten")return"food";if(e==="supermarket"||e==="convenience"||e==="greengrocer"||e==="bakery"||e==="butcher"||e==="grocery"||t==="marketplace")return"groceries";if(e)return"shopping";if(t==="school"||t==="kindergarten"||t==="university"||t==="college"||t==="language_school")return"school";if(t==="hospital"||t==="clinic"||t==="doctors"||t==="pharmacy"||t==="dentist"||o)return"healthcare";if(t==="library"||t==="theatre"||t==="cinema"||t==="arts_centre"||t==="community_centre"||s==="museum"||s==="gallery")return"culture";if(n==="fitness_centre"||n==="sports_centre"||n==="swimming_pool"||n==="pitch"||n==="stadium")return"sport";if(n==="park"||n==="garden"||n==="playground"||n==="dog_park")return"park";if(t==="place_of_worship")return"worship";if(t==="bus_station"||i.railway==="station"||i.public_transport==="station"||t==="ferry_terminal")return"transit";if(r||t==="bank"||t==="post_office"||t==="townhall"||t==="courthouse")return"work";if(n)return"leisure"}const Vl={food:"Cafe / restaurant",groceries:"Food shop",shopping:"Shop",work:"Workplace",school:"School",healthcare:"Healthcare",leisure:"Leisure",culture:"Culture",sport:"Sport",park:"Park",transit:"Transit stop",worship:"Place of worship"};function vx(i){if(i.natural==="water"||i.waterway==="riverbank"||i.landuse==="reservoir"||i.landuse==="basin"||i.water)return{kind:"water",priority:5};if(i.leisure==="park"||i.leisure==="garden"||i.landuse==="village_green"||i.landuse==="recreation_ground")return{kind:"park",priority:2};if(i.natural==="wood"||i.landuse==="forest")return{kind:"forest",priority:2};if(i.landuse==="grass"||i.landuse==="meadow"||i.natural==="grassland"||i.natural==="scrub")return{kind:"grass",priority:1};if(i.natural==="sand"||i.natural==="beach")return{kind:"sand",priority:3};if(i.leisure==="pitch"||i.leisure==="playground")return{kind:"pitch",priority:4};if(i.landuse==="cemetery"||i.amenity==="grave_yard")return{kind:"cemetery",priority:2};if(i.amenity==="parking")return{kind:"parking",priority:3}}const Mx="© OpenStreetMap contributors (ODbL)";function au(i){if(i.length<3)return i;const t=i[0],e=i[i.length-1];return Math.abs(t[0]-e[0])<1e-6&&Math.abs(t[1]-e[1])<1e-6?i.slice(0,-1):i}function yx(i){if(i.length<4)return!1;const t=i[0],e=i[i.length-1];return Math.abs(t.lat-e.lat)<1e-9&&Math.abs(t.lon-e.lon)<1e-9}function Ms(i,t){const e=new Array(i.length);for(let n=0;n<i.length;n++)e[n]=t.project(i[n].lat,i[n].lon);return e}function zr(i,t){return Ki(i)>0===t?i:i.slice().reverse()}function Wl(i){const e=i.filter(r=>r.length>=2).map(r=>r.slice()),n=[],s=(r,o)=>Math.hypot(r[0]-o[0],r[1]-o[1])<.5;for(;e.length;){let r=e.pop(),o=!0;for(;o&&!s(r[0],r[r.length-1]);){o=!1;for(let c=0;c<e.length;c++){const l=e[c],h=r[r.length-1];if(s(h,l[0]))r=r.concat(l.slice(1));else if(s(h,l[l.length-1]))r=r.concat(l.slice(0,-1).reverse());else if(s(r[0],l[l.length-1]))r=l.slice(0,-1).concat(r);else if(s(r[0],l[0]))r=l.slice(1).reverse().concat(r);else continue;e.splice(c,1),o=!0;break}}const a=au(r);a.length>=3&&n.push(a)}return n}function cu(i,t){let e=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const r=t[n][0],o=t[n][1],a=t[s][0],c=t[s][1];o>i[1]!=c>i[1]&&i[0]<(a-r)*(i[1]-o)/(c-o)+r&&(e=!e)}return e}function lu(i,t,e,n,s){const r=zr(e,!0),o=Math.abs(Ki(r));if(o<8||r.length<3)return;const a=Q_(s),{height:c,minHeight:l,levels:h}=tx(s,a,o);Xn(s.height)??Xn(s["building:height"])?i.buildingsWithHeight++:(s["building:levels"]||s.levels)&&i.buildingsWithLevels++;const u={id:t,ring:r,holes:n.map(f=>zr(f,!1)),height:c,minHeight:l,levels:h,kind:a,centroid:nu(r),area:o,capacity:ru(a,o,h),variation:mc(t)%1e3/1e3};return i.buildings.push(u),u}function hu(i,t,e,n,s){const r=vx(s);if(!r)return;const o=zr(e,!0);o.length<3||Math.abs(Ki(o))<20||i.areas.push({id:t,ring:o,holes:n.map(a=>zr(a,!1)),kind:r.kind,priority:r.priority})}function Sx(i,t,e){const n=i.tags??{},s=i.geometry;if(!s||s.length<2)return;const r=n.waterway==="riverbank"?void 0:px(n);if(r){e.waterways.push({id:`w${i.id}`,points:Ms(s,t),kind:r,width:mx(n,r),tunnel:!!n.tunnel&&n.tunnel!=="no"});return}const o=_x(n);if(o){e.railways.push({id:`w${i.id}`,points:Ms(s,t),kind:o,tracks:xx(n),layer:parseInt(n.layer??"0",10)||0,bridge:!!n.bridge&&n.bridge!=="no",tunnel:!!n.tunnel&&n.tunnel!=="no"});return}const a=nx(n);if(a){const{width:l,lanes:h}=sx(n,a),u=Ms(s,t);e.roads.push({id:`w${i.id}`,points:u,cls:a,width:l,lanes:h,oneway:n.oneway==="yes"||n.oneway==="1"||n.junction==="roundabout",layer:parseInt(n.layer??"0",10)||0,bridge:!!n.bridge&&n.bridge!=="no",tunnel:!!n.tunnel&&n.tunnel!=="no",name:n.name,walkable:ax(a,n),drivable:cx(a,n),sidewalk:lx(n),isSidewalkLine:hx(n),isCrossing:ux(n)});return}if(!yx(s))return;const c=au(Ms(s,t));if(!(c.length<3)){if(n.building){const l=lu(e,`w${i.id}`,c,[],n),h=l?ou(n):void 0;l&&h&&e.poiSeeds.push({id:`w${i.id}p`,position:l.centroid,kind:h});return}hu(e,`w${i.id}`,c,[],n)}}function Ex(i,t,e){const n=i.tags??{},s=i.members;if(!s?.length)return;const r=[],o=[];for(const l of s){if(l.type!=="way"||!l.geometry||l.geometry.length<2)continue;const h=Ms(l.geometry,t);l.role==="inner"?o.push(h):r.push(h)}const a=Wl(r),c=Wl(o);if(a.length)for(let l=0;l<a.length;l++){const h=a[l],u=c.filter(d=>cu(d[0],h)),f=`r${i.id}${l>0?`_${l}`:""}`;n.building?lu(e,f,h,u,n):hu(e,f,h,u,n)}}function bx(i,t,e){if(i.lat===void 0||i.lon===void 0)return;const n=i.tags??{};if(n.highway==="crossing"){e.crossingNodes++;return}const s=ou(n);s&&e.poiSeeds.push({id:`n${i.id}`,position:t.project(i.lat,i.lon),kind:s})}function wx(i,t){const e=[],s=new Map,r=(o,a)=>`${Math.floor(o/60)}:${Math.floor(a/60)}`;for(const o of t){const a=r(o.centroid[0],o.centroid[1]);let c=s.get(a);c||s.set(a,c=[]),c.push(o)}for(const o of i){const[a,c]=o.position;let l,h,u=25;const f=Math.floor(a/60),d=Math.floor(c/60);t:for(let x=-1;x<=1;x++)for(let g=-1;g<=1;g++)for(const m of s.get(`${f+x}:${d+g}`)??[]){if(cu(o.position,m.ring)){l=m;break t}const _=Math.hypot(m.centroid[0]-a,m.centroid[1]-c);_<u&&(u=_,h=m)}const p=l??h;e.push({id:o.id,position:o.position,kind:o.kind,buildingId:p?.id,nodeIndex:-1})}return e}function Ax(i,t,e,n=new Gs){const s=qr.fromBBox(t),r={buildings:[],roads:[],railways:[],waterways:[],areas:[],poiSeeds:[],buildingsWithHeight:0,buildingsWithLevels:0,crossingNodes:0};for(const u of i.elements)switch(u.type){case"way":Sx(u,s,r);break;case"relation":Ex(u,s,r);break;case"node":bx(u,s,r);break}r.areas.sort((u,f)=>u.priority-f.priority||Math.abs(Ki(f.ring))-Math.abs(Ki(u.ring)));const o=wx(r.poiSeeds,r.buildings),a=eu(t),c=Math.max(a.width,a.height)/2,l=Tx(r,o.length),h=r.roads.reduce((u,f)=>u+Fa(f.points),0);return{buildings:r.buildings,roads:r.roads,railways:r.railways,waterways:r.waterways,areas:r.areas,pois:o,audit:l,terrain:n,radius:c,norm:K_((t.south+t.north)/2,(t.west+t.east)/2),seed:mc(`${t.south.toFixed(4)},${t.west.toFixed(4)}`),stats:{buildings:r.buildings.length,roads:r.roads.length,roadLengthKm:h/1e3,areas:r.areas.length,pois:o.length,source:"osm",placeName:e,attribution:Mx}}}function Fa(i){let t=0;for(let e=1;e<i.length;e++)t+=Math.hypot(i[e][0]-i[e-1][0],i[e][1]-i[e-1][1]);return t}function Tx(i,t){let e=0,n=0,s=0,r=0,o=0,a=0,c=0;for(const u of i.roads){const f=Fa(u.points)/1e3;u.isCrossing&&c++,u.drivable?(e+=f,u.cls!=="service"&&u.cls!=="motorway"&&u.cls!=="trunk"&&(s++,u.sidewalk&&(r++,u.sidewalk==="no"?a++:u.sidewalk!=="separate"&&o++))):(u.cls==="footway"||u.cls==="pedestrian"||u.cls==="steps")&&(n+=f)}let l=0,h=0;for(const u of i.railways){const f=Fa(u.points)/1e3;u.kind==="tram"?h+=f:l+=f}return{buildingsTotal:i.buildings.length,buildingsWithHeight:i.buildingsWithHeight,buildingsWithLevels:i.buildingsWithLevels,buildingsGuessed:i.buildings.length-i.buildingsWithHeight-i.buildingsWithLevels,roadKmDrivable:e,roadKmFootway:n,streetsTotal:s,streetsWithSidewalkTag:r,sidewalkYes:o,sidewalkNo:a,crossings:i.crossingNodes+c,railwayKm:l,tramKm:h,poisTotal:t}}const Rx="https://s3.amazonaws.com/elevation-tiles-prod/terrarium",Me=256,ri=20;function xr(i,t,e){const n=2**e,s=i*Math.PI/180;return{z:e,x:Math.floor((t+180)/360*n),y:Math.floor((1-Math.log(Math.tan(s)+1/Math.cos(s))/Math.PI)/2*n)}}function Cx(i,t,e){const n=2**e*Me,s=i*Math.PI/180;return{x:(t+180)/360*n,y:(1-Math.log(Math.tan(s)+1/Math.cos(s))/Math.PI)/2*n}}function Px(i){const t=156543.03392*Math.cos(i*Math.PI/180),e=Math.log2(t/ri);return Math.max(9,Math.min(13,Math.round(e)))}const Xl=new Map;function Ix(i){const t=document.createElement("canvas");t.width=Me,t.height=Me;const e=t.getContext("2d",{willReadFrequently:!0});if(!e)throw new Error("Could not read elevation tile: no 2D context");e.drawImage(i,0,0,Me,Me);const n=e.getImageData(0,0,Me,Me).data,s=new Float32Array(Me*Me);for(let r=0;r<s.length;r++){const o=r*4;s[r]=n[o]*256+n[o+1]+n[o+2]/256-32768}return s}async function Lx(i,t){const e=`${i.z}/${i.x}/${i.y}`,n=Xl.get(e);if(n)return n;const s=await new Promise((r,o)=>{const a=new Image;a.crossOrigin="anonymous",a.onload=()=>{try{r(Ix(a))}catch(c){o(c)}},a.onerror=()=>o(new Error(`Elevation tile ${e} failed to load`)),t?.addEventListener("abort",()=>o(new Error("aborted")),{once:!0}),a.src=`${Rx}/${e}.png`});return Xl.set(e,s),s}async function Dx(i,t={}){const e=qr.fromBBox(i),n=Px(e.originLat),[s,r]=e.project(i.north,i.west),[o,a]=e.project(i.south,i.east),c=Math.min(s,o),l=Math.min(r,a),h=Math.abs(o-s),u=Math.abs(a-r),f=Math.max(2,Math.ceil(h/ri)+1),d=Math.max(2,Math.ceil(u/ri)+1),p=[xr(i.north,i.west,n),xr(i.north,i.east,n),xr(i.south,i.west,n),xr(i.south,i.east,n)],x=Math.min(...p.map(E=>E.x)),g=Math.max(...p.map(E=>E.x)),m=Math.min(...p.map(E=>E.y)),_=Math.max(...p.map(E=>E.y)),y=[];for(let E=x;E<=g;E++)for(let R=m;R<=_;R++)y.push({z:n,x:E,y:R});t.onProgress?.(`Reading elevation (${y.length} tile${y.length===1?"":"s"})…`);const M=new Map,w=await Promise.all(y.map(async E=>({id:E,data:await Lx(E,t.signal)})));for(const{id:E,data:R}of w)M.set(`${E.z}/${E.x}/${E.y}`,R);const b=new Float32Array(f*d);for(let E=0;E<d;E++){const R=l+E*ri;for(let P=0;P<f;P++){const I=c+P*ri,{lat:k,lon:G}=e.unproject(I,R),D=Cx(k,G,n),L=Math.floor(D.x/Me),U=Math.floor(D.y/Me),W=M.get(`${n}/${L}/${U}`);if(!W)continue;const X=D.x-L*Me,J=D.y-U*Me,it=Math.min(Me-1,Math.max(0,Math.floor(X))),et=Math.min(Me-1,Math.max(0,Math.floor(J))),ct=Math.min(Me-1,it+1),Et=Math.min(Me-1,et+1),ot=X-it,Y=J-et,nt=W[et*Me+it],j=W[et*Me+ct],at=W[Et*Me+it],yt=W[Et*Me+ct],bt=nt+(j-nt)*ot,Vt=at+(yt-at)*ot;b[E*f+P]=bt+(Vt-bt)*Y}}const T=Math.floor(d/2)*f+Math.floor(f/2),v=b[T];for(let E=0;E<b.length;E++)b[E]-=v;return new Cn(b,f,d,c,l,ri)}function Ux(i,t){const e=ri,n=Math.ceil(i*2/e)+1,s=n,r=new Float32Array(n*s),o=t%1e3/1e3;for(let c=0;c<s;c++)for(let l=0;l<n;l++){const h=-i+l*e,u=-i+c*e,f=Math.sin(h*.0018+o*6.3)*14+Math.cos(u*.0022+o*3.1)*12+Math.sin((h+u)*9e-4+o)*9+Math.sin(h*.006+u*.004)*2.5;r[c*n+l]=f}const a=r[Math.floor(s/2)*n+Math.floor(n/2)];for(let c=0;c<r.length;c++)r[c]-=a;return new Cn(r,n,s,-i,-i,e)}function Nx(i,t,e=[]){const n=new Map,s=new Map;if(!(i instanceof Cn))return{areaLevels:n,flowLevels:s};for(const r of t){if(r.kind!=="water"||r.ring.length<3)continue;let o=1/0;for(const[a,c]of r.ring){const l=i.heightAt(a,c);l<o&&(o=l)}isFinite(o)&&(i.carveTo(r.ring,o),n.set(r.id,o))}for(const r of e){if(r.tunnel||r.points.length<2)continue;const o=r.points.map(([h,u])=>i.heightAt(h,u)),a=o[0]>=o[o.length-1],c=o.slice();if(a)for(let h=1;h<c.length;h++)c[h]=Math.min(c[h],c[h-1]);else for(let h=c.length-2;h>=0;h--)c[h]=Math.min(c[h],c[h+1]);const l=Math.max(.6,Math.min(2.5,r.width*.25));i.carveAlong(r.points,r.width/2+1,c,l),s.set(r.id,c)}return(n.size||s.size)&&i.recomputeBounds(),{areaLevels:n,flowLevels:s}}const Oa=i=>i.x1-i.x0,Ba=i=>i.z1-i.z0;function Zl(i){return[[i.x0,i.z0],[i.x0,i.z1],[i.x1,i.z1],[i.x1,i.z0]]}function Fo(i,t){return{x0:i.x0+t,z0:i.z0+t,x1:i.x1-t,z1:i.z1-t}}function ys(i,t,e,n){const s=Oa(i),r=Ba(i);if(s<e*2&&r<e*2){n.push(i);return}if(s>=r){const o=i.x0+s*t.range(.35,.65);ys({...i,x1:o},t,e,n),ys({...i,x0:o},t,e,n)}else{const o=i.z0+r*t.range(.35,.65);ys({...i,z1:o},t,e,n),ys({...i,z0:o},t,e,n)}}function $l(i,t){const e=[];let n=-i;for(;n<i;)e.push(n),n+=t.range(65,135);return e.push(i),e}function Oo(i,t,e){return Math.sin(i*.0035+t)*e+Math.sin(i*.011+t*2)*e*.35}function Fx(i="lifeboon",t=900){const e=mc(i),n=new Yn(e),s=[],r=[],o=[],a=[],c=n.range(0,6.28),l=E=>Oo(E*2.2,c,90)+n.range(-.01,.01)*0+t*.28,h=n.range(28,46),u=[],f=[];for(let E=-t-50;E<=t+50;E+=40){const R=l(E);u.push([R-h,E]),f.push([R+h,E])}o.push({id:"river",ring:u.concat(f.slice().reverse()),holes:[],kind:"water",priority:5});const d=(E,R)=>Math.abs(E-l(R))<h+6,p=$l(t,n),x=$l(t,n),g=n.range(0,6.28),m=n.range(0,6.28),_=(E,R)=>E===Math.floor(R/2)?"primary":E%4===0?"secondary":E%2===0?"tertiary":"residential",y={primary:14,secondary:10,tertiary:8,residential:6.5},M=[x[Math.floor(x.length*.25)],x[Math.floor(x.length*.6)]];p.forEach((E,R)=>{const P=_(R,p.length),I=[];for(let k=-t;k<=t;k+=25)I.push([E+Oo(k,g+R,14),k]);s.push({id:`av${R}`,points:I,cls:P,width:y[P],lanes:Math.max(1,Math.round(y[P]/3.4)),oneway:!1,layer:0,bridge:!1,tunnel:!1,name:`${R+1}${R%10===0?"st":R%10===1?"nd":"th"} Avenue`,walkable:!0,drivable:!0,isSidewalkLine:!1,isCrossing:!1})}),x.forEach((E,R)=>{const P=_(R,x.length),I=M.includes(E),k=[];let G=[];for(let D=-t;D<=t;D+=25){const L=E+Oo(D,m+R,14);if(!I&&d(D,L)){G.length>1&&k.push(G),G=[];continue}G.push([D,L])}G.length>1&&k.push(G),k.forEach((D,L)=>{s.push({id:`st${R}_${L}`,points:D,cls:P,width:y[P],lanes:Math.max(1,Math.round(y[P]/3.4)),oneway:!1,layer:I?1:0,bridge:I,tunnel:!1,name:`Street ${R+1}`,walkable:!0,drivable:!0,isSidewalkLine:!1,isCrossing:!1})})});const w={retail:["shopping","groceries","food"],commercial:["food","shopping"],office:["work"],education:["school"],civic:["culture","healthcare"],religious:["worship"]};let b=0,T=0;for(let E=0;E<p.length-1;E++)for(let R=0;R<x.length-1;R++){const P={x0:p[E],z0:x[R],x1:p[E+1],z1:x[R+1]},I=(P.x0+P.x1)/2,k=(P.z0+P.z1)/2;if(d(I,k)||d(P.x0,k)||d(P.x1,k))continue;const G=Math.hypot(I,k)/t,D=Fo(P,9);if(Oa(D)<18||Ba(D)<18)continue;const L=.06+G*.1;if(n.chance(L)){const W=Fo(P,7);o.push({id:`park${E}_${R}`,ring:Zl(W),holes:[],kind:n.chance(.7)?"park":"forest",priority:2}),a.push({id:`poi${T++}`,position:[I,k],kind:"park",nodeIndex:-1});continue}const U=[];ys(D,n,G<.35?22:15,U);for(const W of U){if(n.chance(.12))continue;const X=Fo(W,n.range(.6,2.4)),J=Oa(X),it=Ba(X);if(J<6||it<6)continue;const et=J*it;let ct;const Et=n.next();G<.28?ct=Et<.45?"office":Et<.75?"retail":"residential":G<.55?ct=Et<.2?"retail":Et<.3?"office":Et<.36?"civic":"residential":ct=Et<.08?"retail":Et<.12?"education":"residential";const ot=Math.max(0,1-G*1.6);let Y=Math.round(n.gaussian(2+ot*9,1.6+ot*3));ct==="office"&&n.chance(.12)&&(Y+=n.int(6,22)),Y=Math.max(1,Math.min(48,Y));const nt=Zl(X),j=Y*3.2+1.2,at={id:`b${b++}`,ring:nt,holes:[],height:j,minHeight:0,levels:Y,kind:ct,centroid:nu(nt),area:Math.abs(Ki(nt)),capacity:ru(ct,et,Y),variation:n.next()};r.push(at);const yt=w[ct];yt&&n.chance(.55)&&a.push({id:`poi${T++}`,position:at.centroid,kind:n.pick(yt),buildingId:at.id,nodeIndex:-1})}}let v=0;for(const E of s)for(let R=1;R<E.points.length;R++)v+=Math.hypot(E.points[R][0]-E.points[R-1][0],E.points[R][1]-E.points[R-1][1]);return{buildings:r,roads:Ox(s),railways:[],waterways:[],areas:o,pois:a,audit:null,terrain:Ux(t,e),norm:Ns,radius:t,seed:e,stats:{buildings:r.length,roads:s.length,roadLengthKm:v/1e3,areas:o.length,pois:a.length,source:"synthetic",placeName:"Offline city (generated, not a real place)",attribution:"Procedurally generated — no map data used"}}}function Ox(i){const t=s=>s.bridge||s.tunnel||s.layer!==0,e=i.map(()=>[]);for(let s=0;s<i.length;s++)if(!t(i[s]))for(let r=s+1;r<i.length;r++){if(t(i[r]))continue;const o=i[s].points,a=i[r].points;for(let c=0;c<o.length-1;c++)for(let l=0;l<a.length-1;l++){const h=Bx(o[c],o[c+1],a[l],a[l+1]);h&&(e[s].push({at:c+h.ta,p:h.p}),e[r].push({at:l+h.tb,p:h.p}))}}const n=[];return i.forEach((s,r)=>{const o=e[r].filter(f=>f.at>.02&&f.at<s.points.length-1.02).sort((f,d)=>f.at-d.at);if(!o.length){n.push(s);return}const a=[],c=[];let l=0;for(let f=0;f<s.points.length;f++)for(a.push(s.points[f]);l<o.length&&o[l].at<f+1;)c.push(a.length),a.push(o[l].p),l++;let h=0,u=0;for(const f of[...c,a.length-1]){if(f<=h)continue;const d=a.slice(h,f+1);d.length>=2&&n.push({...s,id:`${s.id}#${u++}`,points:d}),h=f}}),n}function Bx(i,t,e,n){const s=t[0]-i[0],r=t[1]-i[1],o=n[0]-e[0],a=n[1]-e[1],c=s*a-r*o;if(Math.abs(c)<1e-9)return null;const l=((e[0]-i[0])*a-(e[1]-i[1])*o)/c,h=((e[0]-i[0])*r-(e[1]-i[1])*s)/c;return l<=0||l>=1||h<=0||h>=1?null:{ta:l,tb:h,p:[i[0]+s*l,i[1]+r*l]}}const fs=.6,Di=25;class _c{positions;nodeCount;offsets;neighbours;costs;buckets;gScore;fScore;cameFrom;visitStamp;closed;stamp=0;heap;heapSize=0;constructor(t,e,n,s){this.positions=t,this.offsets=e,this.neighbours=n,this.costs=s,this.nodeCount=e.length-1,this.gScore=new Float32Array(this.nodeCount),this.fScore=new Float32Array(this.nodeCount),this.cameFrom=new Int32Array(this.nodeCount),this.visitStamp=new Int32Array(this.nodeCount),this.closed=new Uint8Array(this.nodeCount),this.heap=new Int32Array(this.nodeCount+1),this.buckets=new Map;for(let r=0;r<this.nodeCount;r++){const o=this.cellKey(t[r*2],t[r*2+1]);let a=this.buckets.get(o);a||this.buckets.set(o,a=[]),a.push(r)}}cellKey(t,e){const n=Math.floor(t/Di)+32768,s=Math.floor(e/Di)+32768;return n*65536+s}static build(t){const e=t.filter(_=>_.walkable&&_.points.length>=2),n=[],s=[],r=new Map,o=(_,y)=>(Math.floor(_/fs)+32768)*65536+(Math.floor(y/fs)+32768),a=_=>{const y=Math.floor(_[0]/fs),M=Math.floor(_[1]/fs);for(let v=-1;v<=1;v++)for(let E=-1;E<=1;E++){const R=r.get((y+v+32768)*65536+(M+E+32768));if(R){for(const P of R)if(Math.hypot(n[P]-_[0],s[P]-_[1])<=fs)return P}}const w=n.length;n.push(_[0]),s.push(_[1]);const b=o(_[0],_[1]);let T=r.get(b);return T||r.set(b,T=[]),T.push(w),w},c=[],l=[],h=[];for(const _ of e){const y=_.cls==="steps"?2.4:_.cls==="footway"||_.cls==="pedestrian"?.85:_.cls==="primary"||_.cls==="secondary"?1.25:1;let M=a(_.points[0]);for(let w=1;w<_.points.length;w++){const b=a(_.points[w]);if(b===M)continue;const T=n[b]-n[M],v=s[b]-s[M],E=Math.hypot(T,v);E>0&&(c.push(M),l.push(b),h.push(E*y)),M=b}}const u=n.length,f=new Int32Array(u);for(let _=0;_<c.length;_++)f[c[_]]++,f[l[_]]++;const d=new Int32Array(u+1);for(let _=0;_<u;_++)d[_+1]=d[_]+f[_];const p=d.slice(0,u),x=new Int32Array(d[u]),g=new Float32Array(d[u]);for(let _=0;_<c.length;_++){const y=c[_],M=l[_];x[p[y]]=M,g[p[y]++]=h[_],x[p[M]]=y,g[p[M]++]=h[_]}const m=new Float32Array(u*2);for(let _=0;_<u;_++)m[_*2]=n[_],m[_*2+1]=s[_];return new _c(m,d,x,g)}nodePosition(t){return[this.positions[t*2],this.positions[t*2+1]]}findNearest(t,e,n=220){const s=Math.floor(t/Di),r=Math.floor(e/Di),o=Math.ceil(n/Di);let a=-1,c=1/0;for(let l=0;l<=o;l++){for(let h=-l;h<=l;h++)for(let u=-l;u<=l;u++){if(l>0&&Math.max(Math.abs(h),Math.abs(u))!==l)continue;const f=this.buckets.get((s+h+32768)*65536+(r+u+32768));if(f)for(const d of f){const p=Math.hypot(this.positions[d*2]-t,this.positions[d*2+1]-e);p<c&&(c=p,a=d)}}if(a>=0&&c<=l*Di)break}return a}heuristic(t,e){return Math.hypot(this.positions[t*2]-this.positions[e*2],this.positions[t*2+1]-this.positions[e*2+1])}heapPush(t){let e=++this.heapSize;for(this.heap[e]=t;e>1;){const n=e>>1;if(this.fScore[this.heap[n]]<=this.fScore[this.heap[e]])break;const s=this.heap[n];this.heap[n]=this.heap[e],this.heap[e]=s,e=n}}heapPop(){const t=this.heap[1];this.heap[1]=this.heap[this.heapSize--];let e=1;for(;;){const n=e<<1,s=n+1;let r=e;if(n<=this.heapSize&&this.fScore[this.heap[n]]<this.fScore[this.heap[r]]&&(r=n),s<=this.heapSize&&this.fScore[this.heap[s]]<this.fScore[this.heap[r]]&&(r=s),r===e)break;const o=this.heap[r];this.heap[r]=this.heap[e],this.heap[e]=o,e=r}return t}findPath(t,e,n=12e3){if(t<0||e<0||t>=this.nodeCount||e>=this.nodeCount)return null;if(t===e)return[t];const s=++this.stamp;this.heapSize=0,this.visitStamp[t]=s,this.gScore[t]=0,this.fScore[t]=this.heuristic(t,e),this.cameFrom[t]=-1,this.closed[t]=0,this.heapPush(t);let r=0;for(;this.heapSize>0;){const o=this.heapPop();if(o===e)return this.reconstruct(o);if(this.closed[o]===1&&this.visitStamp[o]===s)continue;if(this.closed[o]=1,++r>n)return null;const a=this.offsets[o+1];for(let c=this.offsets[o];c<a;c++){const l=this.neighbours[c],h=this.gScore[o]+this.costs[c],u=this.visitStamp[l]===s;u&&this.closed[l]===1||(!u||h<this.gScore[l])&&(this.visitStamp[l]=s,this.closed[l]=0,this.gScore[l]=h,this.fScore[l]=h+this.heuristic(l,e),this.cameFrom[l]=o,this.heapPush(l))}}return null}reconstruct(t){const e=[];let n=t;for(;n!==-1&&(e.push(n),n=this.cameFrom[n],!(e.length>2e4)););return e.reverse()}}const kx=new Set(["sleeping","at-home","working","eating","shopping","leisure"]),zx=["Ari","Bel","Cor","Dai","Eri","Fen","Gwyn","Hal","Ing","Jor","Kai","Lio","Mar","Nes","Ori","Pav","Quen","Ros","Sel","Tam","Ulf","Ven","Wyn","Yar","Zel"],Gx=["a","ek","en","ia","is","or","ra","sen","ta","us","ay","in","el"];function Hx(i){return i.pick(zx)+i.pick(Gx)}const Vx=["park","leisure","culture","sport","food"],Wx=["food","groceries"],Xx=["work","shopping","groceries","food","school","healthcare","culture"];class Zx{agents=[];visible=[];world;graph;rng;poisByKind=new Map;pathQueue=[];pathfindsThisSecond=0;constructor(t,e,n){this.world=t,this.graph=e,this.rng=new Yn(n^2654435769),t.pois.forEach((s,r)=>{s.nodeIndex=e.findNearest(s.position[0],s.position[1]);let o=this.poisByKind.get(s.kind);o||this.poisByKind.set(s.kind,o=[]),o.push(r)})}get count(){return this.agents.length}spawn(t){const e=[],n=[];let s=0;if(this.world.buildings.forEach((a,c)=>{a.kind!=="residential"||a.capacity<1||(e.push(c),s+=a.capacity,n.push(s))}),!e.length)return;const r=[];for(const a of Xx){const c=this.poisByKind.get(a);c&&r.push(...c)}const o=Math.min(t,Math.round(s));for(let a=0;a<o;a++){const c=this.rng.next()*s;let l=0,h=n.length-1;for(;l<h;){const d=l+h>>1;n[d]<c?l=d+1:h=d}const u=e[l],f=this.makeAgent(a,u,r);f&&this.agents.push(f)}}makeAgent(t,e,n){const s=this.world.buildings[e],r=this.graph.findNearest(s.centroid[0],s.centroid[1]);if(r<0)return null;const o=this.rng,a=Math.round(o.gaussian(38,18)),l=a>=16&&a<=67&&o.chance(.78)&&n.length?o.pick(n):-1,h=l>=0?this.world.pois[l].nodeIndex:-1,[u,f]=this.graph.nodePosition(r),d=o.range(7,10);return{id:t,name:Hx(o),age:Math.max(1,Math.min(95,a)),home:e,job:h>=0?l:-1,homeNode:r,jobNode:h,x:u,z:f,heading:o.range(0,Math.PI*2),walkSpeed:Math.max(.7,o.gaussian(1.38,.16)*(a>70?.8:1)),activity:"at-home",busyUntil:0,path:null,pathIndex:0,segmentProgress:0,destinationPoi:-1,pendingGoal:-1,strollUntil:0,energy:o.range(.5,1),hunger:o.range(0,.5),social:o.range(.3,1),fun:o.range(.3,1),phase:o.range(0,Math.PI*2),colorIndex:o.int(0,12),workStart:d,workEnd:d+o.range(7,9.5),wakeHour:o.gaussian(6.9,.9),sleepHour:o.gaussian(23,1.1)}}choosePoi(t,e,n=10){let s=-1,r=1/0;for(let o=0;o<n;o++){const a=e[this.rng.int(0,e.length)],c=this.poisByKind.get(a);if(!c?.length)continue;const l=c[this.rng.int(0,c.length)],h=this.world.pois[l];if(h.nodeIndex<0)continue;const f=Math.hypot(h.position[0]-t.x,h.position[1]-t.z)*this.rng.range(.8,1.3);f<r&&(r=f,s=l)}return s}travelTo(t,e,n,s){if(e<0){t.activity="at-home",t.busyUntil=this.lastSimTime+this.activityDuration("at-home");return}t.destinationPoi=n,t.activity=s,t.path=null,t.pathIndex=0,t.segmentProgress=0,t.pendingGoal=e,this.pathQueue.push(t.id)}decide(t,e){const n=e.hour,s=e.totalSeconds,r=!e.isWeekend,o=n>=t.sleepHour||n<t.wakeHour,a=t.activity==="at-home"||t.activity==="sleeping";if(t.activity==="strolling"&&s<t.strollUntil&&!o){const c=this.rng.range(0,Math.PI*2),l=this.rng.range(40,150),h=this.graph.findNearest(t.x+Math.cos(c)*l,t.z+Math.sin(c)*l,200);if(h>=0){this.travelTo(t,h,t.destinationPoi,"strolling"),t.nextActivity="strolling";return}}if(o&&t.energy<.85){if(a){t.activity="sleeping",t.busyUntil=s+3600;return}this.goHome(t);return}if(t.hunger>.72){const c=this.choosePoi(t,Wx);if(c>=0){this.travelTo(t,this.world.pois[c].nodeIndex,c,"commuting"),t.nextActivity="eating";return}if(!a){this.goHome(t);return}t.activity="eating",t.busyUntil=s+1800;return}if(r&&t.job>=0&&n>=t.workStart&&n<t.workEnd&&t.energy>.2){if(t.activity==="working"){t.busyUntil=s+1800;return}this.travelTo(t,t.jobNode,t.job,"commuting"),t.nextActivity="working";return}if(t.energy<.22){if(a){t.activity="at-home",t.busyUntil=s+2400;return}this.goHome(t);return}if(t.fun<.55||t.social<.5||this.rng.chance(.35)){const c=this.choosePoi(t,Vx);if(c>=0){const l=this.world.pois[c].kind;this.travelTo(t,this.world.pois[c].nodeIndex,c,"commuting"),t.nextActivity=l==="park"?"strolling":"leisure";return}}a?(t.activity="at-home",t.busyUntil=s+this.rng.range(900,3600)):this.goHome(t)}goHome(t){this.travelTo(t,t.homeNode,-1,"heading-home"),t.nextActivity="at-home"}activityDuration(t){switch(t){case"working":return this.rng.range(2400,4200);case"eating":return this.rng.range(1200,2700);case"shopping":return this.rng.range(900,2400);case"leisure":return this.rng.range(2400,6e3);case"strolling":return this.rng.range(15,90);case"at-home":return this.rng.range(1800,5400);case"sleeping":return this.rng.range(3600,7200);default:return 1800}}servicePathQueue(t){let e=0;for(;this.pathQueue.length&&e<t;){const n=this.pathQueue.shift(),s=this.agents[n];if(e++,!s||s.pendingGoal<0)continue;const r=this.graph.findNearest(s.x,s.z),o=this.graph.findPath(r,s.pendingGoal);if(s.pendingGoal=-1,!o||o.length<2){s.path=null,s.activity=s.nextActivity??"at-home",s.busyUntil=this.lastSimTime+this.activityDuration(s.activity);continue}s.path=o,s.pathIndex=0,s.segmentProgress=0;const[a,c]=this.graph.nodePosition(o[0]);s.x=a,s.z=c,this.pathfindsThisSecond++}}lastSimTime=0;update(t,e){this.lastSimTime=e.totalSeconds,this.pathfindsThisSecond=0,this.servicePathQueue(48);const n=e.totalSeconds,s=t/86400;this.visible.length=0;for(const r of this.agents){const o=r.activity==="sleeping";r.energy=kn(r.energy+(o?s*2.6:-s*1.15)),r.hunger=kn(r.hunger+s*(o?.5:1.5)),r.social=kn(r.social-s*.8),r.fun=kn(r.fun-s*.9),r.activity==="eating"&&(r.hunger=kn(r.hunger-t/1200)),(r.activity==="leisure"||r.activity==="strolling")&&(r.fun=kn(r.fun+t/3e3),r.social=kn(r.social+t/4e3)),r.activity==="working"&&(r.social=kn(r.social+t/9e3)),r.path?this.advanceAlongPath(r,t,n):r.pendingGoal<0&&n>=r.busyUntil&&this.decide(r,e),kx.has(r.activity)||this.visible.push(r)}}advanceAlongPath(t,e,n){const s=t.path;let r=t.walkSpeed*e;for(r=Math.min(r,400);r>0&&t.pathIndex<s.length-1;){const[o,a]=this.graph.nodePosition(s[t.pathIndex]),[c,l]=this.graph.nodePosition(s[t.pathIndex+1]),h=Math.hypot(c-o,l-a),u=h-t.segmentProgress;if(r<u){t.segmentProgress+=r;const f=t.segmentProgress/h;t.x=o+(c-o)*f,t.z=a+(l-a)*f,t.heading=Math.atan2(c-o,l-a),r=0}else r-=u,t.pathIndex++,t.segmentProgress=0,t.x=c,t.z=l}t.pathIndex>=s.length-1&&(t.path=null,t.activity=t.nextActivity??"at-home",t.nextActivity=void 0,t.activity==="strolling"&&n>=t.strollUntil&&(t.strollUntil=n+this.rng.range(1200,4200)),t.busyUntil=n+this.activityDuration(t.activity))}describe(t){switch(t.activity){case"sleeping":return"Asleep at home";case"at-home":return"At home";case"commuting":return t.destinationPoi>=0?"On the way somewhere":"Walking";case"heading-home":return"Walking home";case"working":return"At work";case"eating":return"Having a meal";case"shopping":return"Shopping";case"leisure":return"Out enjoying themselves";case"strolling":return"Strolling outdoors"}}homeBuilding(t){return this.world.buildings[t.home]}jobPoi(t){return t.job>=0?this.world.pois[t.job]:null}}function kn(i){return i<0?0:i>1?1:i}const $x=5,Vi=.12,uu=.12,Yx=4;function xc(i,t,e,n=.6){const s=i.map(([a,c])=>t.heightAt(a,c)),r=$_(s,3),o=new Array(s.length);for(let a=0;a<s.length;a++){const c=Math.max(-n,Math.min(n,r[a]-s[a]));o[a]=s[a]+c+e}return o}function vc(i,t,e,n){const s=i.length,r=t.heightAt(i[0][0],i[0][1]),o=t.heightAt(i[s-1][0],i[s-1][1]),a=new Array(s).fill(0);for(let p=1;p<s;p++)a[p]=a[p-1]+Math.hypot(i[p][0]-i[p-1][0],i[p][1]-i[p-1][1]);const c=a[s-1]||1,l=3.5;let h=0;for(let p=0;p<s;p++){const x=a[p]/c,g=r+(o-r)*x,_=t.heightAt(i[p][0],i[p][1])+l-g;if(_<=0)continue;const y=Math.sin(x*Math.PI);y<.08||(h=Math.max(h,_/y))}const u=Math.max(0,Math.min(h,12)),f=Math.max(0,n-1)*$x,d=new Array(s);for(let p=0;p<s;p++){const x=a[p]/c,g=r+(o-r)*x;d[p]=g+Math.sin(x*Math.PI)*u+e+f}return d}function qx(i,t){return i.bridge?vc(i.points,t,Vi,i.layer):xc(i.points,t,Vi)}function Mc(i){return i.tunnel||i.layer<0}const zn=40;class Kx{cells=new Map;segments=[];roads;terrain;shared;norm;field;sections=new Map;profiles=new Map;constructor(t,e,n=null,s=gc,r=null){this.roads=t,this.terrain=e,this.shared=n,this.norm=s,this.field=r,t.forEach((o,a)=>{for(let c=0;c<o.points.length-1;c++){const l=o.points[c],h=o.points[c+1];if(l[0]===h[0]&&l[1]===h[1])continue;const u=this.segments.length;this.segments.push({road:a,at:c,drivable:o.drivable,ax:l[0],az:l[1],bx:h[0],bz:h[1]});const f=Math.floor(Math.min(l[0],h[0])/zn),d=Math.floor(Math.max(l[0],h[0])/zn),p=Math.floor(Math.min(l[1],h[1])/zn),x=Math.floor(Math.max(l[1],h[1])/zn);for(let g=f;g<=d;g++)for(let m=p;m<=x;m++){const _=Yl(g,m);let y=this.cells.get(_);y||this.cells.set(_,y=[]),y.push(u)}}})}get roadCount(){return this.roads.reduce((t,e)=>t+(e.drivable?1:0),0)}nearest(t,e,n=120,s=!0){const r=Math.floor(t/zn),o=Math.floor(e/zn),a=Math.ceil(n/zn);let c=-1,l=1/0,h=0;for(let y=0;y<=a;y++){for(let M=-y;M<=y;M++)for(let w=-y;w<=y;w++){if(y>0&&Math.max(Math.abs(M),Math.abs(w))!==y)continue;const b=this.cells.get(Yl(r+M,o+w));if(b)for(const T of b){const v=this.segments[T];if(s&&!v.drivable)continue;const E=v.bx-v.ax,R=v.bz-v.az,P=E*E+R*R,I=Math.max(0,Math.min(1,((t-v.ax)*E+(e-v.az)*R)/P)),k=v.ax+E*I,G=v.az+R*I,D=Math.hypot(t-k,e-G);D<l&&(l=D,c=T,h=I)}}if(c>=0&&l<=y*zn)break}if(c<0||l>n)return null;const u=this.segments[c],f=u.bx-u.ax,d=u.bz-u.az,p=Math.hypot(f,d)||1,x=this.sectionFor(u.road),g=Hl(x),m=this.field?.sample(t,e),_=m?m.y:this.sweptHeightAt(u,h,l,t,e);return{road:this.roads[u.road],distance:l,point:[u.ax+f*h,u.az+d*h],direction:[f/p,d/p],surfaceY:_,streetHalfWidth:g}}sweptHeightAt(t,e,n,s,r){const o=this.profileFor(t.road),a=o[t.at]+(o[t.at+1]-o[t.at])*e,c=this.sectionFor(t.road),l=Kr(c),h=Hl(c);if(n<=l)return a+Qi(c,n);const u=a+Qi(c,l),f=this.terrain.heightAt(s,r),d=h>l?Math.min(1,(n-l)/(h-l)):1;return u+(f-u)*d}sectionFor(t){let e=this.sections.get(t);return e||(e=su(this.roads[t],this.norm),this.sections.set(t,e)),e}profileFor(t){let e=this.profiles.get(t);if(!e){const n=this.roads[t];e=this.shared?.get(n)??qx(n,this.terrain),this.profiles.set(t,e)}return e}}function Yl(i,t){return(i+32768)*65536+(t+32768)}const fu=2*Math.PI/60,Jx=1.225,Lr=9.81,Qx={engine:1,clutch:1,tyres:1,brakes:1,dampers:1},jx={dry:1,wet:.7,snow:.35,ice:.18};function du(i,t,e){return i.tyreFriction*jx[e]*(.55+.45*t.tyres)}function pu(i,t){if(t>i.redlineRpm){const l=(t-i.redlineRpm)/200;return l>=1?0:pu(i,i.redlineRpm)*(1-l)}const e=Math.max(i.idleRpm,Math.min(i.redlineRpm,t)),s=i.peakPowerW/(i.peakPowerRpm*fu)/i.peakTorqueNm,r=(i.peakPowerRpm-i.peakTorqueRpm)/i.peakTorqueRpm,o=r===0?0:(1-s)/(r*r),a=(e-i.peakTorqueRpm)/i.peakTorqueRpm,c=1-o*a*a;return i.peakTorqueNm*Math.max(.05,Math.min(1,c))}function ka(i,t,e){const n=i.gearRatios[e]*i.finalDrive;return t/i.wheelRadiusM*n/fu}function tv(i,t){const e=i.gearRatios[t]*i.finalDrive;return i.massKg*(1.04+.0025*e*e)}function ev(i,t,e){const n=i.engine.peakPowerRpm*.95,s=Math.max(i.engine.idleRpm*1.6,i.engine.peakTorqueRpm*.55);let r=e;return r<i.gearRatios.length-1&&ka(i,t,r)>n&&r++,r>0&&ka(i,t,r)<s&&r--,r}function nv(i,t,e,n){const{dt:s,grade:r,surface:o}=n;e.gear=ev(i,e.speed,e.gear),e.rpm=Math.max(i.engine.idleRpm,ka(i,e.speed,e.gear));const a=i.gearRatios[e.gear]*i.finalDrive,c=pu(i.engine,e.rpm)*t.engine*n.throttle,l=i.engine.peakTorqueNm*(.6+.6*t.clutch),f=Math.min(c,l)*a*i.drivetrainEfficiency/i.wheelRadiusM,d=du(i,t,o),p=i.massKg*Lr*i.drivenAxleLoadShare,x=d*p,g=Math.min(f,x),m=f>x*1.001,_=.5*Jx*i.dragCoefficient*i.frontalAreaM2*e.speed*e.speed,y=i.rollingResistance*i.massKg*Lr*Math.cos(Math.atan(r)),M=i.massKg*Lr*Math.sin(Math.atan(r)),w=n.brake*i.brakeDecelMs2*i.massKg*(.5+.5*t.brakes),b=_+(e.speed>.05?y:0)+M+w,T=(g-b)/tv(i,e.gear);return e.speed=Math.max(0,e.speed+T*s),{tractiveForce:g,resistance:b,acceleration:T,wheelspin:m}}const iv=.58,sv=2.6,rv=3.4,ov=3.2,av=.72,vr=1.2;class cv{constructor(t,e,n,s,r=Qx){this.terrain=e,this.roads=n,this.buildings=s,this.spec=t,this.condition={...r},this.reverseSpec={...t,gearRatios:[t.reverseRatio]}}terrain;roads;buildings;spec;condition;surface="dry";x=0;z=0;y=0;heading=0;steerAngle=0;state={speed:0,gear:0,rpm:0};direction=1;pitch=0;roll=0;wheelSpin=0;lastAccel=0;lastLateral=0;lastHit=null;understeering=!1;spinning=!1;grade=0;reverseSpec;placeAt(t,e,n){this.x=t,this.z=e,this.heading=n,this.state.speed=0,this.state.gear=0,this.state.rpm=this.spec.engine.idleRpm,this.direction=1,this.steerAngle=0,this.lastHit=this.roads?.nearest(t,e,60)??null,this.y=this.restingHeight(t,e)}get speedKmh(){return this.state.speed*3.6*this.direction}update(t,e){const n=.016666666666666666;let s=Math.min(t,.25);for(;s>1e-4;){const r=Math.min(n,s);this.advance(r,e),s-=r}}advance(t,e){if(t<=0)return;const n=Math.sin(this.heading),s=Math.cos(this.heading),r=this.roads?.nearest(this.x,this.z,90)??null;this.lastHit=r;const o=r!==null&&r.distance<=r.road.width/2+vr,c=du(this.spec,this.condition,this.surface)*(o?1:av)*Lr;this.state.speed<.6&&(this.direction=e.reverse?-1:1);const l=this.restingHeight(this.x+n*3,this.z+s*3),h=this.restingHeight(this.x-n*3,this.z-s*3);this.grade=(l-h)/6;const u=this.direction===-1?this.reverseSpec:this.spec,f=o?u:{...u,rollingResistance:u.rollingResistance*ov},d=Math.max(e.brake,e.handbrake?1:0),p=nv(f,this.condition,this.state,{throttle:e.throttle,brake:d,grade:this.grade*this.direction,surface:this.surface,dt:t});this.spinning=p.wheelspin,this.lastAccel=p.acceleration;const x=-ds(e.steer,-1,1)*iv,g=Math.abs(x)<Math.abs(this.steerAngle)?rv:sv;this.steerAngle+=ds(x-this.steerAngle,-g*t,g*t);const m=e.handbrake?0:this.steerAngle,_=this.state.speed,y=Math.min(c,Math.max(p.tractiveForce/u.massKg,d*u.brakeDecelMs2*(.5+.5*this.condition.brakes))),M=Math.sqrt(Math.max(.2,c*c-y*y));let w=m;const b=_*_*Math.abs(Math.tan(m))/this.spec.wheelbaseM;if(this.understeering=!1,b>M&&_>1){const et=Math.atan(M*this.spec.wheelbaseM/(_*_));w=Math.sign(m)*Math.min(Math.abs(m),et),this.understeering=b>M*1.02}const T=_*this.direction,v=T/this.spec.wheelbaseM*Math.tan(w);this.heading+=v*t,this.lastLateral=T*v;const E=T*t,R=this.x+n*E,P=this.z+s*E;this.blocked(R,P)?(this.state.speed=0,this.lastAccel=0):(this.x=R,this.z=P),this.wheelSpin+=T/this.spec.wheelRadiusM*t,this.y=this.restingHeight(this.x,this.z);const I=Math.cos(this.heading),k=-Math.sin(this.heading),G=this.spec.widthM/2,D=this.restingHeight(this.x+I*G,this.z+k*G),L=this.restingHeight(this.x-I*G,this.z-k*G),U=-Math.atan(this.grade),W=Math.atan((D-L)/this.spec.widthM),X=ds(-this.lastAccel*.01,-.05,.05),J=ds(this.lastLateral*.012,-.06,.06),it=Math.min(1,t*8);this.pitch+=(U+X-this.pitch)*it,this.roll+=(W+J-this.roll)*it}telemetry(){const t=this.lastHit!==null&&this.lastHit.distance<=this.lastHit.road.width/2+vr;return{speedKmh:Math.abs(this.state.speed)*3.6,gear:this.state.gear,gearLabel:this.direction===-1?"R":String(this.state.gear+1),rpm:this.state.rpm,revFraction:ds(this.state.rpm/this.spec.engine.redlineRpm,0,1.08),wheelspin:this.spinning,understeer:this.understeering,gradePercent:this.grade*100,onRoad:t,streetName:t?this.lastHit?.road.name??null:null,surface:this.surface}}restingHeight(t,e){const n=this.roads?.nearest(t,e,40);if(n&&n.distance<=n.streetHalfWidth+vr)return n.surfaceY;const s=this.roads?.nearest(t,e,25,!1);return s&&s.distance<=s.streetHalfWidth+vr?s.surfaceY:this.terrain.heightAt(t,e)}blocked(t,e){return!this.buildings||!this.overlapsBuilding(t,e)?!1:!this.overlapsBuilding(this.x,this.z)}overlapsBuilding(t,e){if(!this.buildings)return!1;const n=Math.sin(this.heading),s=Math.cos(this.heading),r=Math.cos(this.heading),o=-Math.sin(this.heading),a=this.spec.lengthM/2,c=this.spec.widthM/2;for(const[l,h]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const u=t+n*a*l+r*c*h,f=e+s*a*l+o*c*h;if(this.buildings.at(u,f))return!0}return!1}}function ds(i,t,e){return i<t?t:i>e?e:i}const Mr={name:"City microcar, 0.65 L twin",massKg:710,engine:{peakPowerW:21500,peakPowerRpm:5600,peakTorqueNm:44.1,peakTorqueRpm:3400,idleRpm:850,redlineRpm:6e3},gearRatios:[3.7,2.06,1.27,.9],reverseRatio:3.5,finalDrive:4.54,drivetrainEfficiency:.9,wheelRadiusM:.25,wheelbaseM:2.18,lengthM:3.2,widthM:1.42,heightM:1.4,dragCoefficient:.44,frontalAreaM2:1.69,rollingResistance:.014,drivenAxleLoadShare:.62,tyreFriction:.85,brakeDecelMs2:7.5},ql=.6,lv=.45,hv=2.6,uv=3.25,yr=2.2;class yc{nodes=[];edges=[];streets=[];turns=[];driveOnRight;constructor(t){this.driveOnRight=t}static build(t,e={}){const n=e.driveOnRight??!0,s=new yc(n),r=fv(t,s);return dv(t,s,r),pv(s,t),vv(s,n,e.parking??!0),Mv(s,n),s}directionAt(t,e){const n=this.edges[t],s=n.points,[r,o]=n.from===e?[s[0],s[1]]:[s[s.length-1],s[s.length-2]],a=o[0]-r[0],c=o[1]-r[1],l=Math.hypot(a,c)||1;return[a/l,c/l]}}const Gr=(i,t)=>`${Math.round(i/ql)},${Math.round(t/ql)}`;function fv(i,t){const e=new Map,n=new Set;i.forEach((r,o)=>{if(r.points.length<2)return;const a=r.bridge||r.tunnel||r.layer!==0;r.points.forEach((c,l)=>{const h=l===0||l===r.points.length-1;if(a&&!h)return;const u=Gr(c[0],c[1]);let f=e.get(u);f||e.set(u,f=new Set),f.add(o),h&&n.add(u)})});const s=new Map;for(const[r,o]of e)o.size<2&&!n.has(r)||(s.set(r,t.nodes.length),t.nodes.push({x:0,z:0,edges:[]}));for(const r of i)for(const o of r.points){const a=s.get(Gr(o[0],o[1]));a!==void 0&&(t.nodes[a].x=o[0],t.nodes[a].z=o[1])}return s}function dv(i,t,e){i.forEach((n,s)=>{if(n.points.length<2)return;let r=0;for(let o=1;o<n.points.length;o++){const a=e.get(Gr(n.points[o][0],n.points[o][1]));if(a===void 0)continue;const c=e.get(Gr(n.points[r][0],n.points[r][1]));if(c===void 0||c===a){r=o;continue}const l=n.points.slice(r,o+1);let h=0;for(let f=0;f<l.length-1;f++)h+=Math.hypot(l[f+1][0]-l[f][0],l[f+1][1]-l[f][1]);if(h<.2){r=o;continue}const u=t.edges.length;t.edges.push({from:c,to:a,points:l,length:h,street:-1,road:s,cls:n.cls,width:n.width,oneway:n.oneway,bridge:n.bridge,tunnel:n.tunnel,layer:n.layer,drivable:n.drivable,lanes:[]}),t.nodes[c].edges.push(u),t.nodes[a].edges.push(u),r=o}})}function pv(i,t){const e=new Map,n=[];i.edges.forEach((r,o)=>{const a=t[r.road].name?.trim();if(!a){n.push(o);return}const c=`${a}\0${r.cls}\0${r.bridge}\0${r.tunnel}`,l=e.get(c)??[];l.push(o),e.set(c,l)});const s=(r,o)=>{const a=Bo(r.map(u=>[i.edges[u].width,i.edges[u].length])),c=Bo(r.map(u=>[i.edges[u].cls,i.edges[u].length])),l=Bo(r.map(u=>[i.edges[u].oneway,i.edges[u].length])),h=i.streets.length;i.streets.push({name:o,cls:c,width:a,oneway:l,lanes:mv(c,a,l),edges:r});for(const u of r)i.edges[u].street=h,i.edges[u].width=a,i.edges[u].cls=c,i.edges[u].oneway=l};for(const[r,o]of e)s(o,r.split("\0")[0]);for(const r of n)s([r])}function Bo(i){const t=new Map;for(const[s,r]of i)t.set(s,(t.get(s)??0)+r);let e=i[0][0],n=-1;for(const[s,r]of t)r>n&&(n=r,e=s);return e}function mv(i,t,e){if(!gv.has(i))return 0;const n=Math.round(t/uv);return Math.max(e?1:2,Math.min(8,n))}const gv=new Set(["motorway","trunk","primary","secondary","tertiary","residential","service"]),_v={primary:1,secondary:1,tertiary:2,residential:2},xv=4;function vv(i,t,e){for(const n of i.edges){const s=i.streets[n.street];if(!s||s.lanes===0)continue;const r=e&&!n.bridge&&!n.tunnel?_v[s.cls]??0:0,o=n.width-xv,a=Math.max(0,Math.min(r,Math.floor(o/yr))),c=n.width-a*yr,l=s.lanes,h=c/l,u=s.oneway?0:Math.floor(l/2),f=[];for(let x=0;x<l;x++){const g=t?x>=u:x<l-u;f.push({kind:"driving",forward:g,width:h,fromKerb:0})}let d=0,p=0;for(let x=0;x<l;x++){const g=t?f[l-1-x]:f[x];g.forward&&(g.fromKerb=d++)}for(let x=0;x<l;x++){const g=t?f[x]:f[l-1-x];g.forward||(g.fromKerb=p++)}a>=1&&f.push({kind:"parking",forward:!0,width:yr,fromKerb:-1}),a>=2&&f.unshift({kind:"parking",forward:!1,width:yr,fromKerb:-1}),n.lanes=f}}function Mv(i,t){i.nodes.forEach((e,n)=>{const s=e.edges.filter(r=>i.edges[r].drivable);if(s.length!==0)for(const r of s){const o=i.edges[r],a=o.lanes.map((l,h)=>({lane:l,index:h})).filter(({lane:l})=>l.kind==="driving"&&o.to===n===l.forward);if(!a.length)continue;const c=i.directionAt(r,n);for(const l of s){const h=i.edges[l],u=h.lanes.map((x,g)=>({lane:x,index:g})).filter(({lane:x})=>x.kind==="driving"&&h.from===n===x.forward);if(!u.length)continue;const f=i.directionAt(l,n),d=yv([-c[0],-c[1]],f),p=Sv(d,t);if(!(l===r&&!(p==="uturn"&&s.length===1)))for(const{lane:x,index:g}of a){if(!Ev(p,x.fromKerb,a.length))continue;const m=u.reduce((_,y)=>Math.abs(y.lane.fromKerb-x.fromKerb)<Math.abs(_.lane.fromKerb-x.fromKerb)?y:_);i.turns.push({node:n,fromEdge:r,fromLane:g,toEdge:l,toLane:m.index,angle:d,kind:p})}}}})}function yv(i,t){return Math.atan2(i[0]*t[1]-i[1]*t[0],i[0]*t[0]+i[1]*t[1])}function Sv(i,t){const e=Math.abs(i);return e>hv?"uturn":e<lv?"straight":(t?i>0:i<0)?"left":"right"}function Ev(i,t,e){return e<=1?!0:i==="right"?t===0:i==="left"||i==="uturn"?t===e-1:!0}const ti=24;class bv{cells=new Map;count;constructor(t){let e=0;for(const n of t)if(!(n.drivable||n.points.length<2||n.isCrossing)&&!(n.cls!=="footway"&&n.cls!=="pedestrian"&&n.cls!=="steps")){e++;for(let s=0;s<n.points.length-1;s++){const r=[n.points[s],n.points[s+1]],o=Math.floor(Math.min(r[0][0],r[1][0])/ti),a=Math.floor(Math.max(r[0][0],r[1][0])/ti),c=Math.floor(Math.min(r[0][1],r[1][1])/ti),l=Math.floor(Math.max(r[0][1],r[1][1])/ti);for(let h=o;h<=a;h++)for(let u=c;u<=l;u++){const f=Kl(h,u);let d=this.cells.get(f);d||this.cells.set(f,d=[]),d.push(r)}}}this.count=e}covers(t,e,n){if(!this.cells.size)return!1;const s=Math.floor(t/ti),r=Math.floor(e/ti),o=Math.ceil(n/ti);for(let a=s-o;a<=s+o;a++)for(let c=r-o;c<=r+o;c++)for(const[l,h]of this.cells.get(Kl(a,c))??[]){const u=h[0]-l[0],f=h[1]-l[1],d=u*u+f*f;if(d<1e-9)continue;let p=((t-l[0])*u+(e-l[1])*f)/d;if(p=p<0?0:p>1?1:p,Math.hypot(t-(l[0]+u*p),e-(l[1]+f*p))<=n)return!0}return!1}}function Kl(i,t){return(i+4096)*8192+(t+4096)}var Nt=(i=>(i[i.None=0]="None",i[i.Carriageway=1]="Carriageway",i[i.Parking=2]="Parking",i[i.KerbFace=3]="KerbFace",i[i.KerbTop=4]="KerbTop",i[i.Verge=5]="Verge",i[i.Pavement=6]="Pavement",i[i.Junction=7]="Junction",i[i.Crossing=8]="Crossing",i[i.Batter=9]="Batter",i[i.Parapet=10]="Parapet",i[i.Fascia=11]="Fascia",i))(Nt||{});const wv=12;var Sc=(i=>(i[i.Nothing=0]="Nothing",i[i.Drive=1]="Drive",i[i.Walk=2]="Walk",i[i.Park=4]="Park",i[i.Paved=8]="Paved",i))(Sc||{});const Av=(()=>{const i=new Array(wv).fill(0);return i[1]=9,i[2]=13,i[3]=8,i[4]=10,i[5]=2,i[6]=10,i[7]=9,i[8]=11,i[9]=0,i[10]=0,i[11]=0,i})();function mu(i){return Av[i]??0}function gu(i,t){const e=i*t,n=Math.max(0,(i-1)*(t-1));return{rows:i,cols:t,x:new Float64Array(e),y:new Float64Array(e),z:new Float64Array(e),cell:new Uint8Array(n),lane:new Int8Array(n).fill(-1)}}function _u(i){const{x:t,z:e}=i.lattice;let n=1/0,s=1/0,r=-1/0,o=-1/0;for(let a=0;a<t.length;a++)t[a]<n&&(n=t[a]),t[a]>r&&(r=t[a]),e[a]<s&&(s=e[a]),e[a]>o&&(o=e[a]);i.minX=n,i.minZ=s,i.maxX=r,i.maxZ=o}function xu(i){const t=new Array(i.length);t[0]=0;for(let e=1;e<i.length;e++)t[e]=t[e-1]+Math.hypot(i[e][0]-i[e-1][0],i[e][1]-i[e-1][1]);return t}function Tv(i,t,e){const n=t[t.length-1],s=Math.max(0,Math.min(n,e));let r=1;for(;r<t.length-1&&t[r]<s;)r++;const o=t[r]-t[r-1],a=o<=1e-9?0:(s-t[r-1])/o;return[i[r-1][0]+(i[r][0]-i[r-1][0])*a,i[r-1][1]+(i[r][1]-i[r-1][1])*a]}function Rv(i,t,e){const n=t[t.length-1],s=Math.max(0,Math.min(n,e));let r=1;for(;r<t.length-1&&t[r]<s;)r++;const o=i[r][0]-i[r-1][0],a=i[r][1]-i[r-1][1],c=Math.hypot(o,a)||1;return[o/c,a/c]}function za(i,t,e){const n=t[t.length-1],s=Math.max(0,Math.min(n,e));let r=1;for(;r<t.length-1&&t[r]<s;)r++;const o=t[r]-t[r-1],a=o<=1e-9?0:(s-t[r-1])/o;return i[r-1]+(i[r]-i[r-1])*a}function Cv(i,t,e,n){const s=Math.max(0,t),r=Math.min(i[i.length-1],e);if(r-s<1e-6)return[];const o=new Set([s,r]);for(const l of i)l>s+1e-6&&l<r-1e-6&&o.add(l);const a=[...o].sort((l,h)=>l-h),c=[];for(let l=0;l<a.length-1;l++){const h=a[l+1]-a[l],u=Math.max(1,Math.round(h/n));for(let f=0;f<u;f++)c.push(a[l]+h*f/u)}return c.push(a[a.length-1]),c}const Pv=8;function Iv(i){const{edge:t,road:e,section:n,crown:s,terrain:r}=i,o=xu(t.points),a=o[o.length-1],c=Math.min(i.startPort.stop,a*.49),l=Math.max(a-i.endPort.stop,a*.51),h=Cv(o,c,l,Pv);if(h.length<2)return null;const{columns:u,roles:f,lanes:d,marks:p}=Lv(n,t,e),x={points:[],levels:[]},g=u.length,m=h.length,_=gu(m,g),y=Kr(n);for(let v=0;v<m;v++){const E=h[v],R=Tv(t.points,o,E),P=Rv(t.points,o,E),I=P[1],k=-P[0],G=za(s,o,E),D=G+Qi(n,y);x.points.push(R),x.levels.push(G);for(let L=0;L<g;L++){const U=u[L],W=R[0]+I*U.offset,X=R[1]+k*U.offset,J=v*g+L;_.x[J]=W,_.z[J]=X,_.y[J]=Number.isNaN(U.dy)?Math.min(r.heightAt(W,X),D):G+U.dy}}const M=Math.max(0,i.startPort.sideStop),w=Math.max(0,i.endPort.sideStop),b=y+3;for(let v=0;v<m-1;v++){const E=(h[v]+h[v+1])/2,R=E<M||a-E<w,P=v*g,I=(v+1)*g,k=i.mapped&&!t.bridge?[i.mapped.covers((_.x[P]+_.x[I])/2,(_.z[P]+_.z[I])/2,b),i.mapped.covers((_.x[P+g-1]+_.x[I+g-1])/2,(_.z[P+g-1]+_.z[I+g-1])/2,b)]:[!1,!1];for(let G=0;G<g-1;G++){const D=v*(g-1)+G;let L=f[G];R&&L!==Nt.Carriageway&&L!==Nt.Parking?L=Nt.None:L===Nt.Pavement&&k[G<(g-1)/2?0:1]&&(L=Nt.Verge),_.cell[D]=L,_.lane[D]=d[G]}}const T={id:`street:${i.edgeIndex}`,kind:e.drivable?"street":"path",lattice:_,ports:[i.startPort,i.endPort],edge:i.edgeIndex,node:-1,road:t.road,cls:t.cls,elevated:t.bridge,spine:x,marks:p,minX:0,minZ:0,maxX:0,maxZ:0};return _u(T),T}function Lv(i,t,e){const n=i[1].offset,s=i.slice(2),r=[],o=[],a=[];for(let h=s.length-1;h>=0;h--)r.push({offset:-s[h].offset,dy:s[h].dy}),h>0&&(o.push(ko(s[h],s[h-1].offset)),a.push(-1));s.length>0&&(o.push(ko(s[0],n)),a.push(-1));const c=Dv(t.lanes,n);for(let h=0;h<c.length-1;h++){const u=c[h];r.push({offset:u,dy:Qi(i,u)});const f=(c[h]+c[h+1])/2,d=Uv(t.lanes,n,f);e.drivable?d>=0&&t.lanes[d].kind==="parking"?(o.push(Nt.Parking),a.push(d)):(o.push(Nt.Carriageway),a.push(d)):(o.push(Nt.Pavement),a.push(-1))}r.push({offset:n,dy:Qi(i,n)});for(let h=0;h<s.length;h++)r.push({offset:s[h].offset,dy:s[h].dy}),o.push(ko(s[h],h===0?n:s[h-1].offset)),a.push(-1);const l=[];for(let h=1;h<o.length;h++){const u=a[h-1],f=a[h];if(u<0||f<0||u===f)continue;const d=t.lanes[u],p=t.lanes[f];!d||!p||d.kind!=="driving"||p.kind!=="driving"||l.push({col:h,kind:d.forward===p.forward?"divider":"centre"})}return{columns:r,roles:o,lanes:a,marks:l}}function Dv(i,t){const e=i.reduce((s,r)=>s+r.width,0),n=[];if(i.length>0&&Math.abs(e-t*2)<.5){let s=-t;n.push(s);for(const r of i)s+=r.width,n.push(Math.min(t,s))}else n.push(-t,t);return n.some(s=>Math.abs(s)<1e-6)||n.push(0),[...new Set(n)].sort((s,r)=>s-r)}function Uv(i,t,e){const n=i.reduce((r,o)=>r+o.width,0);if(!i.length||Math.abs(n-t*2)>=.5)return-1;let s=-t;for(let r=0;r<i.length;r++)if(s+=i[r].width,e<=s)return r;return i.length-1}function ko(i,t){const e=Math.abs(i.offset-t);return{carriageway:Nt.Carriageway,kerb:e<.02?Nt.KerbFace:Nt.KerbTop,verge:Nt.Verge,pavement:Nt.Pavement,batter:Nt.Batter,parapet:Nt.Parapet,fascia:Nt.Fascia}[i.surface]}const Nv=15,Fv=3,Ov=.34,Hr=.45,Jl=3,Bv=2.2,kv=2.5,zv=8;function Gv(i){const t=i.reduce((e,n)=>Math.max(e,n.half),0);return Math.max(kv,Math.min(zv,t*.9))}function Hv(i){return[i[1],-i[0]]}function Vv(i){const t=Gv(i);return i.map((e,n)=>{let s=e.half,r=e.built;for(let c=0;c<i.length;c++){if(c===n)continue;const l=i[c],h=Ga(e.dir,l.dir);if(h>Math.PI-Hr||h<Hr)continue;const u=Math.abs(e.dir[0]*l.dir[1]-e.dir[1]*l.dir[0]),f=Math.abs(e.dir[0]*l.dir[0]+e.dir[1]*l.dir[1]),d=1/Math.max(Ov,u);s=Math.max(s,l.half*d),r=Math.max(r,(l.half+e.built*f)*d)}const o=Math.min(Nv,e.half*2*Fv),a=Math.min(s,o)+t;return{stop:a,sideStop:Math.max(a,Math.min(r,o*2)+t)}})}function Wv(i,t,e,n){const s=Zv(e);if(s.length<3)return null;const r=[];for(let d=0;d<s.length;d++){const p=s[d],x=Hv(p.dir),g=[t[0]+p.dir[0]*p.stop,t[1]+p.dir[1]*p.stop],m=p.y+p.edgeDy;r.push({p:[g[0]+x[0]*p.half,g[1]+x[1]*p.half],y:m,arm:d,side:1}),r.push({p:[g[0],g[1]],y:p.y,arm:d,side:0}),r.push({p:[g[0]-x[0]*p.half,g[1]-x[1]*p.half],y:m,arm:d,side:-1})}r.sort((d,p)=>Math.atan2(d.p[0]-t[0],d.p[1]-t[1])-Math.atan2(p.p[0]-t[0],p.p[1]-t[1]));const o=[],a=[],c=(d,p)=>{const x=o[o.length-1];if(x&&Math.hypot(x[0]-d[0],x[1]-d[1])<.05){a[a.length-1]=(a[a.length-1]+p)/2;return}o.push(d),a.push(p)};for(let d=0;d<r.length;d++){const p=r[d],x=r[(d+1)%r.length];if(c(p.p,p.y),x.arm===p.arm)continue;const g=Xv(p.p,s[p.arm].dir,x.p,s[x.arm].dir,t);if(g)for(let m=1;m<=Jl;m++){const _=m/(Jl+1),y=1-_;c([y*y*p.p[0]+2*y*_*g[0]+_*_*x.p[0],y*y*p.p[1]+2*y*_*g[1]+_*_*x.p[1]],p.y+(x.y-p.y)*_)}}if(o.length<3)return null;const l=o.length+1,h=gu(2,l),u=s.reduce((d,p)=>d+p.y,0)/s.length;for(let d=0;d<l;d++){h.x[d]=t[0],h.z[d]=t[1],h.y[d]=u;const p=d%o.length;h.x[l+d]=o[p][0],h.z[l+d]=o[p][1],h.y[l+d]=a[p]}h.cell.fill(Nt.Junction);const f={id:`junction:${i}`,kind:"junction",lattice:h,ports:e,edge:-1,node:i,road:-1,cls:n,elevated:!1,spine:null,marks:[],minX:0,minZ:0,maxX:0,maxZ:0};return _u(f),f}function Xv(i,t,e,n,s){const r=t[0]*n[1]-t[1]*n[0];if(Math.abs(r)<1e-4)return null;const o=((e[0]-i[0])*n[1]-(e[1]-i[1])*n[0])/r,a=[i[0]+t[0]*o,i[1]+t[1]*o],c=Math.hypot(a[0]-s[0],a[1]-s[1]),l=Math.max(Math.hypot(i[0]-s[0],i[1]-s[1]),Math.hypot(e[0]-s[0],e[1]-s[1]))*Bv;if(c<=l)return a;const h=l/(c||1);return[s[0]+(a[0]-s[0])*h,s[1]+(a[1]-s[1])*h]}function Zv(i){const t=[...i].sort((n,s)=>Math.atan2(n.dir[0],n.dir[1])-Math.atan2(s.dir[0],s.dir[1])),e=[];for(const n of t){const s=e[e.length-1];if(s&&Ga(s.dir,n.dir)<Hr){n.half>s.half&&(s.dir=n.dir,s.half=n.half),s.stop=Math.max(s.stop,n.stop),s.y=(s.y+n.y)/2;continue}e.push({dir:n.dir,half:n.half,stop:n.stop,y:n.y,edgeDy:n.edgeDy})}if(e.length>2&&Ga(e[0].dir,e[e.length-1].dir)<Hr){const n=e.pop();n.half>e[0].half&&(e[0].dir=n.dir,e[0].half=n.half),e[0].stop=Math.max(e[0].stop,n.stop)}return e}function Ga(i,t){const e=Math.max(-1,Math.min(1,i[0]*t[0]+i[1]*t[1]));return Math.acos(e)}function $v(i,t,e,n){const s=new bv(t),r=i.nodes.map(u=>e.heightAt(u.x,u.z)+Vi),o=i.edges.map(u=>!Mc(u)),a=i.edges.map(u=>su({...t[u.road],width:u.width,cls:u.cls,bridge:u.bridge},n)),c=i.edges.map((u,f)=>{if(!o[f])return u.points.map(()=>0);const d=u.bridge?vc(u.points,e,Vi,u.layer):xc(u.points,e,Vi);return u.bridge||(d[0]=r[u.from],d[d.length-1]=r[u.to]),d}),l=Yv(i,o,a,c,r),h=[];return i.edges.forEach((u,f)=>{if(!o[f])return;const p=(l.get(u.from)??[]).find(_=>_.edge===f&&_.end==="from"),g=(l.get(u.to)??[]).find(_=>_.edge===f&&_.end==="to");if(!p||!g)return;const m=Iv({edge:u,edgeIndex:f,road:t[u.road],section:a[f],crown:c[f],startPort:p,endPort:g,terrain:e,mapped:s.count?s:null});m&&h.push(m)}),i.nodes.forEach((u,f)=>{const d=l.get(f);if(!d||d.length<3)return;const p=u.edges.filter(g=>o[g]).reduce((g,m)=>a[m][1].offset>a[g][1].offset?m:g,u.edges.find(g=>o[g])??u.edges[0]),x=Wv(f,[u.x,u.z],d,i.edges[p].cls);x&&h.push(x)}),{parts:h,portsByNode:l,nodeY:r,sections:a,crowns:c}}function Yv(i,t,e,n,s){const r=new Map;i.nodes.forEach((c,l)=>{const h=c.edges.filter(u=>t[u]).map(u=>{const f=i.edges[u];return{edge:u,end:f.from===l?"from":"to",dir:i.directionAt(u,l),half:e[u][1].offset,built:Kr(e[u]),stop:0,sideStop:0}});if(h.length){if(h.length>=3){const u=Vv(h);h.forEach((f,d)=>{f.stop=u[d].stop,f.sideStop=u[d].sideStop})}r.set(l,h)}});const o=new Map;for(const c of r.values())for(const l of c){const h=o.get(l.edge)??[];h.push(l),o.set(l.edge,h)}for(const[c,l]of o){const h=i.edges[c].length,u=l.reduce((p,x)=>p+x.stop,0),f=h*.8;if(u<=f||u<=0)continue;const d=f/u;for(const p of l)p.stop*=d,p.sideStop*=d}const a=new Map;for(const[c,l]of r){const h=i.nodes[c];a.set(c,l.map(u=>{const f=i.edges[u.edge],d=xu(f.points),p=d[d.length-1],x=u.end==="from"?u.stop:p-u.stop,g=u.end==="from"?Math.min(p,x+5):Math.max(0,x-5),m=za(n[u.edge],d,x),_=za(n[u.edge],d,g)-m,y=[h.x+u.dir[0]*u.stop,h.z+u.dir[1]*u.stop];return{node:c,at:y,dir:u.dir,half:u.half,y:u.stop>0?m:s[c],edgeDy:Qi(e[u.edge],u.half),stop:u.stop,sideStop:u.sideStop,slope:_/(Math.abs(g-x)||1),edge:u.edge,end:u.end}}))}return a}function qv(i,t){const e=[];for(const n of i.parts){if(n.kind==="junction"||n.elevated||!n.spine||n.spine.points.length<2)continue;const s=i.sections[n.edge];e.push({points:n.spine.points.map(r=>[r[0],r[1]]),levels:n.spine.levels,halfWidth:Kr(s),blend:Math.max(1.5,t.batter),depth:uu,shape:jv(s)})}return e.sort((n,s)=>s.halfWidth-n.halfWidth),e}function Kv(i,t=1.5){const e=[];for(const n of i.parts){if(n.kind!=="junction")continue;const{cols:s,x:r,z:o}=n.lattice,a=[r[0],o[0]],c=[];for(let l=0;l<s-1;l++){const h=s+l,u=r[h]-a[0],f=o[h]-a[1],d=Math.hypot(u,f)||1;c.push([r[h]+u/d*t,o[h]+f/d*t])}c.length<3||e.push({ring:c,heightAt:(l,h)=>Jv(n,l,h),depth:uu,blend:3})}return e}function Jv(i,t,e){const{cols:n,x:s,y:r,z:o}=i.lattice,a=s[0],c=o[0],l=Math.atan2(t-a,e-c),h=n-1;let u=0,f=1/0;for(let m=0;m<h;m++){const _=n+m;let y=Math.abs(Qv(Math.atan2(s[_]-a,o[_]-c)-l));y>Math.PI&&(y=2*Math.PI-y),y<f&&(f=y,u=m)}const d=n+u,p=Math.hypot(s[d]-a,o[d]-c)||1,x=Math.hypot(t-a,e-c),g=Math.min(1.4,x/p);return r[0]+(r[d]-r[0])*g}function Qv(i){for(;i>Math.PI;)i-=2*Math.PI;for(;i<-Math.PI;)i+=2*Math.PI;return i}function jv(i){return i.filter(t=>!Number.isNaN(t.dy)).map(t=>[t.offset,t.dy])}const Ui=8;class tM{parts;cellPart;cellAt;starts;items;cols;rows;originX;originZ;constructor(t){this.parts=t;let e=1/0,n=1/0,s=-1/0,r=-1/0,o=0;for(const f of t)f.lattice.cell.length&&(e=Math.min(e,f.minX),n=Math.min(n,f.minZ),s=Math.max(s,f.maxX),r=Math.max(r,f.maxZ),o+=f.lattice.cell.length);Number.isFinite(e)||(e=n=0,s=r=1),this.originX=e-Ui,this.originZ=n-Ui,this.cols=Math.max(1,Math.ceil((s-e)/Ui)+3),this.rows=Math.max(1,Math.ceil((r-n)/Ui)+3),this.cellPart=new Int32Array(o),this.cellAt=new Int32Array(o);const a=new Int32Array(o*4);let c=0;t.forEach((f,d)=>{const{rows:p,cols:x,x:g,z:m,cell:_}=f.lattice;for(let y=0;y<p-1;y++)for(let M=0;M<x-1;M++){const w=y*(x-1)+M;if(_[w]===Nt.None)continue;const b=y*x+M,T=b+1,v=b+x,E=v+1,R=Math.min(g[b],g[T],g[v],g[E]),P=Math.max(g[b],g[T],g[v],g[E]),I=Math.min(m[b],m[T],m[v],m[E]),k=Math.max(m[b],m[T],m[v],m[E]);this.cellPart[c]=d,this.cellAt[c]=w,a[c*4]=this.gx(R),a[c*4+1]=this.gz(I),a[c*4+2]=this.gx(P),a[c*4+3]=this.gz(k),c++}});const l=this.cols*this.rows,h=new Int32Array(l+1);for(let f=0;f<c;f++)for(let d=a[f*4+1];d<=a[f*4+3];d++)for(let p=a[f*4];p<=a[f*4+2];p++)h[d*this.cols+p+1]++;for(let f=0;f<l;f++)h[f+1]+=h[f];this.starts=h,this.items=new Int32Array(h[l]);const u=h.slice(0,l);for(let f=0;f<c;f++)for(let d=a[f*4+1];d<=a[f*4+3];d++)for(let p=a[f*4];p<=a[f*4+2];p++)this.items[u[d*this.cols+p]++]=f;this.cellPart=this.cellPart.slice(0,c),this.cellAt=this.cellAt.slice(0,c)}get cellCount(){return this.cellPart.length}sampleAll(t,e,n=[]){n.length=0;const s=this.gx(t),r=this.gz(e);if(s<0||r<0||s>=this.cols||r>=this.rows)return n;const o=r*this.cols+s;for(let a=this.starts[o];a<this.starts[o+1];a++){const c=this.items[a],l=this.parts[this.cellPart[c]],h=eM(l,this.cellAt[c],t,e);if(h===null)continue;const u=l.lattice.cell[this.cellAt[c]];n.push({part:l,role:u,lane:l.lattice.lane[this.cellAt[c]],y:h,can:mu(u)})}return n.sort((a,c)=>c.y-a.y),n}sample(t,e){const n=this.sampleAll(t,e,zo);return n.length?n[0]:null}sampleNear(t,e,n){const s=this.sampleAll(t,e,zo);let r=null,o=1/0;for(const a of s){const c=Math.abs(a.y-n);c<o&&(o=c,r=a)}return r}paved(t,e){const n=this.sampleAll(t,e,zo);for(const s of n)if(s.can&Sc.Paved)return!0;return!1}gx(t){return Math.floor((t-this.originX)/Ui)}gz(t){return Math.floor((t-this.originZ)/Ui)}}const zo=[];function eM(i,t,e,n){const{cols:s,x:r,y:o,z:a}=i.lattice,c=s-1,l=t/c|0,h=t-l*c,u=l*s+h,f=u+1,d=u+s+1,p=u+s;return Ql(r,o,a,u,f,d,e,n)??Ql(r,o,a,u,d,p,e,n)}function Ql(i,t,e,n,s,r,o,a){const c=i[n],l=e[n],h=i[s]-c,u=e[s]-l,f=i[r]-c,d=e[r]-l,p=h*d-f*u;if(Math.abs(p)<1e-9)return null;const x=o-c,g=a-l,m=(x*d-g*f)/p,_=(g*h-x*u)/p,y=1e-6;return m<-y||_<-y||m+_>1+y?null:t[n]+(t[s]-t[n])*m+(t[r]-t[n])*_}const Go=[461592,1910592,4152454,5935048].map(i=>new ut(i)),jl=[856608,5326954,14196844,12375274].map(i=>new ut(i)),th=[2240582,9067078,16757867,16774370].map(i=>new ut(i)),nM=`
  varying vec3 vWorldDirection;
  void main() {
    vWorldDirection = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position.z = gl_Position.w; // always on the far plane
  }
`,iM=`
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;
  varying vec3 vWorldDirection;

  void main() {
    vec3 dir = normalize(vWorldDirection);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 sky = mix(uBottom, uTop, pow(h, 0.62));

    // Glow around the sun, strongest when it is near the horizon.
    float sun = max(dot(dir, normalize(uSunDirection)), 0.0);
    sky += uSunColor * pow(sun, 24.0) * 0.9;
    sky += uSunColor * pow(sun, 3.0) * 0.14;

    gl_FragColor = vec4(sky, 1.0);
    #include <colorspace_fragment>
  }
`;class sM{scene=new $f;renderer;sun;ambient;skyMesh;skyMaterial;fog;nightFactor=0;constructor(t){this.renderer=new I_({canvas:t,antialias:!0,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=mh,this.renderer.toneMapping=Ya,this.renderer.toneMappingExposure=1.05,this.fog=new ac(12375274,600,4e3),this.scene.fog=this.fog,this.skyMaterial=new sn({uniforms:{uTop:{value:new ut(5935048)},uBottom:{value:new ut(12375274)},uSunColor:{value:new ut(16774370)},uSunDirection:{value:new B(.3,.8,.5)}},vertexShader:nM,fragmentShader:iM,side:ke,depthWrite:!1,depthTest:!1,fog:!1}),this.skyMesh=new fe(new zs(1,32,16),this.skyMaterial),this.skyMesh.frustumCulled=!1,this.skyMesh.renderOrder=-1e3,this.scene.add(this.skyMesh),this.sun=new Ld(16777215,2.6),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.045,this.scene.add(this.sun),this.scene.add(this.sun.target),this.ambient=new Cd(12375274,7038296,1.1),this.scene.add(this.ambient)}setSize(t,e){this.renderer.setSize(t,e,!1)}update(t,e,n){const s=Zs.clamp((t.altitude+.12)/.72,0,1),r=Go.length-1,o=s*r,a=Math.min(r-1,Math.floor(o)),c=o-a,l=Go[a].clone().lerp(Go[a+1],c),h=jl[a].clone().lerp(jl[a+1],c),u=th[a].clone().lerp(th[a+1],c);this.skyMaterial.uniforms.uTop.value.copy(l),this.skyMaterial.uniforms.uBottom.value.copy(h),this.skyMaterial.uniforms.uSunColor.value.copy(u),this.skyMaterial.uniforms.uSunDirection.value.set(t.x,t.y,t.z),this.nightFactor=1-Zs.clamp((t.altitude+.09)/.28,0,1);const f=Zs.clamp(t.altitude/.35,0,1);t.altitude>-.08?(this.sun.color.copy(u),this.sun.intensity=.15+f*2.6,this.sun.position.set(t.x,Math.max(.05,t.y),t.z)):(this.sun.color.setHex(10466520),this.sun.intensity=.18,this.sun.position.set(-t.x,Math.max(.25,-t.y),-t.z)),this.sun.position.multiplyScalar(Math.max(400,n*2)).add(e),this.sun.target.position.copy(e),this.sun.target.updateMatrixWorld();const d=Zs.clamp(n*1.1,90,900),p=this.sun.shadow.camera;p.left=-d,p.right=d,p.top=d,p.bottom=-d,p.near=1,p.far=Math.max(2e3,n*5),p.updateProjectionMatrix(),this.sun.castShadow=n<2200,this.ambient.color.copy(l).lerp(new ut(16777215),.25),this.ambient.groundColor.setHex(this.nightFactor>.5?1711915:7038296),this.ambient.intensity=.5+(1-this.nightFactor)*.85,this.fog.color.copy(h),this.fog.near=Math.max(120,n*1.2),this.fog.far=Math.max(1600,n*9),this.renderer.toneMappingExposure=1.05-this.nightFactor*.18}syncSky(t){this.skyMesh.position.copy(t.position),this.skyMesh.scale.setScalar(Math.max(50,t.far*.4))}dispose(){this.skyMaterial.dispose(),this.skyMesh.geometry.dispose(),this.renderer.dispose()}}const eh=1.8,nh=9e3,Ni=1.68;class rM{camera;mode="orbit";target=new B(0,0,0);distance=900;targetDistance=900;yaw=Math.PI*.25;pitch=.95;walkPos=new B(0,Ni,0);walkYaw=0;walkPitch=0;keys=new Set;followPoint=new B;followDistance=14;drivePoint=new B;driveHeading=0;driveSpeed=0;driveDistance=8.5;driveYawOffset=0;drivePitchOffset=0;driveEye=new B;driveEyeValid=!1;dragging=null;lastX=0;lastY=0;domElement;disposed=!1;groundClearance=2.4;terrain=new Gs;setTerrain(t){this.terrain=t}constructor(t,e){this.domElement=t,this.camera=new Ye(55,e,.5,2e4),this.updateProjection(),this.attach()}attach(){const t=this.domElement;t.addEventListener("contextmenu",e=>e.preventDefault()),t.addEventListener("pointerdown",this.onPointerDown),window.addEventListener("pointermove",this.onPointerMove),window.addEventListener("pointerup",this.onPointerUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}dispose(){this.disposed=!0;const t=this.domElement;t.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("pointerup",this.onPointerUp),t.removeEventListener("wheel",this.onWheel),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp)}onPointerDown=t=>{t.button!==1&&(this.dragging=t.button===2||t.shiftKey?"pan":"rotate",this.lastX=t.clientX,this.lastY=t.clientY,t.target?.setPointerCapture?.(t.pointerId))};onPointerMove=t=>{if(!this.dragging||this.disposed)return;const e=t.clientX-this.lastX,n=t.clientY-this.lastY;if(this.lastX=t.clientX,this.lastY=t.clientY,this.mode==="walk"){this.walkYaw-=e*.0035,this.walkPitch=hn(this.walkPitch-n*.0035,-1.4,1.4);return}if(this.mode==="drive"){this.driveYawOffset=hn(this.driveYawOffset-e*.006,-2.6,2.6),this.drivePitchOffset=hn(this.drivePitchOffset-n*.004,-.5,.9);return}if(this.dragging==="rotate")this.yaw-=e*.005,this.pitch=hn(this.pitch-n*.005,.06,1.52);else{const s=this.distance*.0016,r=new B(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),o=new B(Math.cos(this.yaw),0,-Math.sin(this.yaw));this.target.addScaledVector(o,-e*s),this.target.addScaledVector(r,n*s)}};onPointerUp=()=>{this.dragging=null};onWheel=t=>{if(t.preventDefault(),this.mode==="walk")return;const e=Math.exp(Math.sign(t.deltaY)*Math.min(1,Math.abs(t.deltaY)/320)*.55);this.mode==="drive"?this.driveDistance=hn(this.driveDistance*e,3,120):this.mode==="follow"?this.followDistance=hn(this.followDistance*e,3,400):this.targetDistance=hn(this.targetDistance*e,eh,nh)};onKeyDown=t=>{const e=t.target;e&&(e.tagName==="INPUT"||e.tagName==="TEXTAREA")||this.keys.add(t.code)};onKeyUp=t=>{this.keys.delete(t.code)};setMode(t){if(t!==this.mode){if(t==="drive"?(this.driveEyeValid=!1,this.driveYawOffset=0,this.drivePitchOffset=0):this.mode==="drive"&&(this.target.copy(this.drivePoint),this.yaw=this.driveHeading+Math.PI,this.targetDistance=Math.max(40,this.driveDistance*4),this.distance=this.targetDistance),t==="walk"){const e=this.terrain.heightAt(this.target.x,this.target.z);this.walkPos.set(this.target.x,e+Ni,this.target.z),this.walkYaw=this.yaw,this.walkPitch=-.05}else this.mode==="walk"&&(this.target.set(this.walkPos.x,this.terrain.heightAt(this.walkPos.x,this.walkPos.z),this.walkPos.z),this.yaw=this.walkYaw,this.targetDistance=Math.max(this.targetDistance,60));this.mode=t}}setFollowPoint(t,e){this.followPoint.set(t,this.terrain.heightAt(t,e),e)}goTo(t,e,n){const s=this.terrain.heightAt(t,e);this.target.set(t,s,e),this.walkPos.set(t,s+Ni,e),n!==void 0&&(this.targetDistance=hn(n,eh,nh),this.distance=this.targetDistance)}get altitude(){const t=this.terrain.heightAt(this.camera.position.x,this.camera.position.z);return Math.max(0,this.camera.position.y-t)}get currentDistance(){return this.mode==="follow"?this.followDistance:this.mode==="drive"?this.driveDistance:this.distance}update(t){this.mode==="walk"?this.updateWalk(t):this.mode==="drive"?this.updateDrive(t):this.updateOrbit(t),this.updateProjection()}setDrivePose(t,e,n,s,r){this.drivePoint.set(t,e,n),this.driveHeading=s,this.driveSpeed=r}updateDrive(t){if(!this.dragging){const l=1-Math.pow(.06,t);this.driveYawOffset-=this.driveYawOffset*l,this.drivePitchOffset-=this.drivePitchOffset*l}const e=Math.min(1,Math.abs(this.driveSpeed)/30),n=this.driveDistance*(1+e*.28),s=Math.max(1.7,this.driveDistance*.42)*(1-e*.18),r=this.driveHeading+this.driveYawOffset,o=new B(this.drivePoint.x-Math.sin(r)*n,this.drivePoint.y+s+this.drivePitchOffset*n*.6,this.drivePoint.z-Math.cos(r)*n);if(!this.driveEyeValid)this.driveEye.copy(o),this.driveEyeValid=!0;else{const l=1-Math.pow(9e-4,t);this.driveEye.lerp(o,l);const h=this.driveEye.distanceTo(o);h>n*.8&&this.driveEye.lerp(o,1-n*.8/h)}const a=this.terrain.heightAt(this.driveEye.x,this.driveEye.z);this.driveEye.y=Math.max(this.driveEye.y,a+1.2),this.camera.position.copy(this.driveEye);const c=Math.min(14,2+Math.abs(this.driveSpeed)*.5);this.camera.lookAt(this.drivePoint.x+Math.sin(this.driveHeading)*c,this.drivePoint.y+1.1,this.drivePoint.z+Math.cos(this.driveHeading)*c),this.target.set(this.drivePoint.x,this.drivePoint.y,this.drivePoint.z)}updateOrbit(t){const e=1-Math.pow(.0015,t);this.distance+=(this.targetDistance-this.distance)*e;const n=this.mode==="follow"?this.followPoint:this.target,s=this.mode==="follow"?this.followDistance:this.distance;if(n.y=this.terrain.heightAt(n.x,n.z),this.mode==="orbit"){const c=this.distance*.6*t,l=new B(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),h=new B(Math.cos(this.yaw),0,-Math.sin(this.yaw));(this.keys.has("KeyW")||this.keys.has("ArrowUp"))&&this.target.addScaledVector(l,c),(this.keys.has("KeyS")||this.keys.has("ArrowDown"))&&this.target.addScaledVector(l,-c),(this.keys.has("KeyA")||this.keys.has("ArrowLeft"))&&this.target.addScaledVector(h,-c),(this.keys.has("KeyD")||this.keys.has("ArrowRight"))&&this.target.addScaledVector(h,c)}const r=Math.asin(Math.min(1,this.groundClearance/Math.max(s,this.groundClearance))),o=Math.max(this.pitch,r),a=Math.cos(o);this.camera.position.set(n.x+s*a*Math.sin(this.yaw),n.y+s*Math.sin(o),n.z+s*a*Math.cos(this.yaw)),this.camera.lookAt(n.x,n.y+(this.mode==="follow"?1.1:0),n.z)}updateWalk(t){const n=(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?9:2.4)*t,s=new B(-Math.sin(this.walkYaw),0,-Math.cos(this.walkYaw)),r=new B(Math.cos(this.walkYaw),0,-Math.sin(this.walkYaw));(this.keys.has("KeyW")||this.keys.has("ArrowUp"))&&this.walkPos.addScaledVector(s,n),(this.keys.has("KeyS")||this.keys.has("ArrowDown"))&&this.walkPos.addScaledVector(s,-n),(this.keys.has("KeyA")||this.keys.has("ArrowLeft"))&&this.walkPos.addScaledVector(r,-n),(this.keys.has("KeyD")||this.keys.has("ArrowRight"))&&this.walkPos.addScaledVector(r,n),this.keys.has("KeyQ")&&(this.walkPos.y-=n),this.keys.has("KeyE")&&(this.walkPos.y+=n);const o=this.terrain.heightAt(this.walkPos.x,this.walkPos.z);this.walkPos.y=Math.max(o+Ni,this.walkPos.y),this.walkPos.y>o+Ni+.01&&(this.walkPos.y+=(o+Ni-this.walkPos.y)*Math.min(1,t*6)),this.camera.position.copy(this.walkPos);const a=new B(Math.sin(this.walkYaw)*-Math.cos(this.walkPitch),Math.sin(this.walkPitch),-Math.cos(this.walkYaw)*Math.cos(this.walkPitch));this.camera.lookAt(this.walkPos.clone().add(a)),this.target.set(this.walkPos.x,this.terrain.heightAt(this.walkPos.x,this.walkPos.z),this.walkPos.z)}updateProjection(){const t=Math.max(1,this.camera.position.y),e=hn(t*.05,.6,20),n=hn(Math.max(t*40,this.currentDistance*12),1500,5e4);(this.camera.near!==e||this.camera.far!==n)&&(this.camera.near=e,this.camera.far=n,this.camera.updateProjectionMatrix())}setAspect(t){this.camera.aspect=t,this.camera.updateProjectionMatrix()}}function hn(i,t,e){return i<t?t:i>e?e:i}const hi=8,ps=hi*3.2,Sr={left:.26,top:.3,width:.48,height:.42};function vu(i,t,e){return{x:i*e+e*Sr.left,y:t*e+e*Sr.top,w:e*Sr.width,h:e*Sr.height}}function ns(i){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d");return{c:t,ctx:e}}function oM(){const{c:t,ctx:e}=ns(512),n=512/hi;e.fillStyle="#ffffff",e.fillRect(0,0,512,512);for(let r=0;r<512;r+=4)e.fillStyle=`rgba(0,0,0,${.012+Math.random()*.012})`,e.fillRect(r,0,2,512);for(let r=0;r<hi;r++){e.fillStyle="rgba(0,0,0,0.10)",e.fillRect(0,r*n,512,Math.max(2,n*.05));for(let o=0;o<hi;o++){const{x:a,y:c,w:l,h}=vu(o,r,n),u=e.createLinearGradient(0,c,0,c+h);u.addColorStop(0,"rgba(0,0,0,0.34)"),u.addColorStop(.45,"rgba(0,0,0,0.27)"),u.addColorStop(1,"rgba(0,0,0,0.36)"),e.fillStyle=u,e.fillRect(a,c,l,h),e.fillStyle="rgba(255,255,255,0.22)",e.fillRect(a,c,l,Math.max(1,h*.1)),e.strokeStyle="rgba(0,0,0,0.16)",e.lineWidth=Math.max(1,n*.025),e.strokeRect(a,c,l,h),e.fillStyle="rgba(255,255,255,0.13)",e.fillRect(a-n*.02,c+h,l+n*.04,Math.max(1,n*.035))}}const s=new hc(t);return s.wrapS=An,s.wrapT=An,s.colorSpace=Oe,s.anisotropy=8,s}function aM(i=12345){const{c:e,ctx:n}=ns(512),s=512/hi,r=new Yn(i);n.fillStyle="#000000",n.fillRect(0,0,512,512);for(let a=0;a<hi;a++)for(let c=0;c<hi;c++){if(!r.chance(.42))continue;const{x:l,y:h,w:u,h:f}=vu(c,a,s),d=r.chance(.75),p=d?255:210,x=d?r.int(200,235):228,g=d?r.int(140,185):255;n.fillStyle=`rgb(${p},${x},${g})`,n.fillRect(l,h,u,f)}const o=new hc(e);return o.wrapS=An,o.wrapT=An,o.colorSpace=Oe,o}function cM(i,t,e){const n=new Yn(e),s=Math.ceil(i/t)+2,r=new Float32Array(s*s);for(let a=0;a<r.length;a++)r[a]=n.next();const o=new Float32Array(i*i);for(let a=0;a<i;a++){const c=a/t,l=Math.floor(c);let h=c-l;h=h*h*(3-2*h);for(let u=0;u<i;u++){const f=u/t,d=Math.floor(f);let p=f-d;p=p*p*(3-2*p);const x=r[l*s+d],g=r[l*s+d+1],m=r[(l+1)*s+d],_=r[(l+1)*s+d+1],y=x+(g-x)*p,M=m+(_-m)*p;o[a*i+u]=y+(M-y)*h}}return o}function Fs(i,t,e,n){const s=new Float32Array(i*i);let r=0;t.forEach((o,a)=>{const c=cM(i,o,n+a*7919),l=e[a];r+=l;for(let h=0;h<s.length;h++)s[h]+=c[h]*l});for(let o=0;o<s.length;o++)s[o]/=r;return s}function Jr(i,t=8){const e=new hc(i);return e.wrapS=An,e.wrapT=An,e.colorSpace=Oe,e.anisotropy=t,e}function lM(){const{c:t,ctx:e}=ns(512),n=new Yn(31),s=Fs(512,[2,5,13],[.5,.3,.2],11),r=Fs(512,[70,170],[.45,.55],23),o=e.createImageData(512,512);for(let a=0;a<512*512;a++){const c=.84+s[a]*.2+(r[a]-.5)*.04,l=Math.round(Math.min(1,c)*255);o.data[a*4]=l,o.data[a*4+1]=l,o.data[a*4+2]=Math.round(Math.min(1,c*.995)*255),o.data[a*4+3]=255}e.putImageData(o,0,0),e.lineCap="round";for(let a=0;a<5;a++){e.strokeStyle=`rgba(0,0,0,${.1+n.next()*.12})`,e.lineWidth=1+n.next()*1.6;let c=n.range(0,512),l=n.range(0,512),h=n.range(0,Math.PI*2);e.beginPath(),e.moveTo(c,l);for(let u=0;u<26;u++)h+=n.range(-.7,.7),c=(c+Math.cos(h)*18+512)%512,l=(l+Math.sin(h)*18+512)%512,e.lineTo(c,l);e.stroke()}return Jr(t)}function hM(){const{c:t,ctx:e}=ns(512),n=new Yn(77),s=4,r=512/s,o=Fs(512,[3,11],[.6,.4],43),a=e.createImageData(512,512);for(let c=0;c<512*512;c++){const l=.88+o[c]*.18,h=Math.round(Math.min(1,l)*255);a.data[c*4]=h,a.data[c*4+1]=h,a.data[c*4+2]=h,a.data[c*4+3]=255}e.putImageData(a,0,0);for(let c=0;c<s;c++)for(let l=0;l<s;l++){const h=n.chance(.5);e.fillStyle=`rgba(${h?255:0},${h?255:0},${h?255:0},${n.range(.02,.07)})`,e.fillRect(l*r,c*r,r,r)}e.strokeStyle="rgba(0,0,0,0.24)",e.lineWidth=Math.max(1.5,r*.028);for(let c=0;c<=s;c++){const l=c*r;e.beginPath(),e.moveTo(l,0),e.lineTo(l,512),e.stroke(),e.beginPath(),e.moveTo(0,l),e.lineTo(512,l),e.stroke()}e.strokeStyle="rgba(255,255,255,0.10)",e.lineWidth=Math.max(1,r*.018);for(let c=0;c<=s;c++){const l=c*r+r*.022;e.beginPath(),e.moveTo(l,0),e.lineTo(l,512),e.stroke(),e.beginPath(),e.moveTo(0,l),e.lineTo(512,l),e.stroke()}return Jr(t)}function Mu(){const{c:t,ctx:e}=ns(512),n=Fs(512,[4,9,22],[.4,.35,.25],5),s=e.createImageData(512,512);for(let r=0;r<512*512;r++){const o=.84+n[r]*.22,a=Math.min(1,o);s.data[r*4]=Math.round(a*250),s.data[r*4+1]=Math.round(Math.min(1,o*1.03)*255),s.data[r*4+2]=Math.round(a*236),s.data[r*4+3]=255}return e.putImageData(s,0,0),Jr(t)}function uM(){const{c:t,ctx:e}=ns(512),n=new Yn(131),s=8,r=512/s,o=Fs(512,[3,9,30],[.4,.35,.25],97),a=e.createImageData(512,512);for(let c=0;c<512*512;c++){const l=.84+o[c]*.22,h=Math.round(Math.min(1,l)*255);a.data[c*4]=h,a.data[c*4+1]=Math.round(Math.min(1,l*.99)*255),a.data[c*4+2]=Math.round(Math.min(1,l*.97)*255),a.data[c*4+3]=255}e.putImageData(a,0,0);for(let c=0;c<s;c++){const l=c*r,h=e.createLinearGradient(0,l,0,l+r*.4);h.addColorStop(0,"rgba(0,0,0,0.30)"),h.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=h,e.fillRect(0,l,512,r*.4),e.fillStyle="rgba(255,255,255,0.11)",e.fillRect(0,l+r-Math.max(1,r*.09),512,Math.max(1,r*.09));const u=9,f=n.range(0,r);for(let d=0;d<u;d++){const p=(d*512/u+f)%512;e.fillStyle="rgba(0,0,0,0.13)",e.fillRect(p,l+r*.12,Math.max(1,512*.0035),r*.82)}}return Jr(t)}const Wn=1.6,fM=.9,dM={residential:[[14208704,12562073],[13220008,11048580],[14012616,11840930]],commercial:[[13225170,11054520],[13816012,11578534]],office:[[12174541,9675699],[12896719,10134702]],retail:[[14274500,12298388],[13617604,11446175]],industrial:[[12105908,9868943],[12631214,10328201]],civic:[[14605010,12630444],[13684683,11513254]],education:[[14077890,11971480],[13488848,11120813]],religious:[[14209734,12235167]],other:[[12894392,10722963]]},pM={residential:[9071192,8217431,7298903,6249303],commercial:[6974834,6185318],office:[6054504,5528160],retail:[7762026,6643546],industrial:[9079430,7631983],civic:[7236194,6117972],education:[8088156,6970706],religious:[7037527,5787977],other:[8419954]};function ih(i,t,e,n,s,r,o,a,c,l,h){const u=s-t,f=o-n,d=a-t,p=l-n;f*d-u*p<0?i.push(t,e,n,a,c,l,s,r,o):i.push(t,e,n,s,r,o,a,c,l)}function mM(i,t,e,n){const s=new ut(i),r=new ut(t);return n.copy(s).lerp(r,e)}function gM(i){if(i.length<3)return null;let t=null;for(let e=0;e<i.length;e++){const n=i[e],s=i[(e+1)%i.length],r=s[0]-n[0],o=s[1]-n[1],a=Math.hypot(r,o);if(a<.2)continue;const c=r/a,l=o/a;let h=1/0,u=-1/0,f=1/0,d=-1/0;for(const[M,w]of i){const b=M*c+w*l,T=-M*l+w*c;b<h&&(h=b),b>u&&(u=b),T<f&&(f=T),T>d&&(d=T)}const p=u-h,x=d-f,g=p*x;if(t&&g>=t.area)continue;const m=(h+u)/2,_=(f+d)/2,y=p>=x;t={cx:m*c-_*l,cz:m*l+_*c,ux:y?c:-l,uz:y?l:c,halfLong:(y?p:x)/2,halfShort:(y?x:p)/2,area:g}}return t}function yu(i){let t=0;for(let e=0,n=i.length-1;e<i.length;n=e++)t+=(i[n][0]+i[e][0])*(i[n][1]-i[e][1]);return t/2}function Ho(i,t,e,n,s,r,o,a,c,l){const h=Math.sign(yu(n))===Math.sign(l)?n:n.slice().reverse();let u=0;for(let f=0;f<h.length;f++){const d=h[f],p=h[(f+1)%h.length],x=Math.hypot(p[0]-d[0],p[1]-d[1]),g=u/Wn,m=(u+x)/Wn;u+=x;const _=r/Wn,y=s/Wn;i.push(d[0],r,d[1],p[0],s,p[1],p[0],r,p[1],d[0],r,d[1],d[0],s,d[1],p[0],s,p[1]),e.push(g,_,m,y,m,_,g,_,g,y,m,y);for(let M=0;M<6;M++)t.push(o,a,c)}}const _M=new Set(["residential","other","education","religious","retail","civic"]);function xM(i,t){return!t||!_M.has(i.kind)||i.area>1400||i.height>22||t.halfShort<2?!1:i.area/t.area>.74}function vM(i,t){const e=[],n=[],s=[],r=[],o=[],a=[],c=new ut,l=new ut;for(const y of i){const M=dM[y.kind],w=M[Math.floor(y.variation*M.length)%M.length];mM(w[0],w[1],y.variation*7.3%1,c);const b=c.r,T=c.g,v=c.b,E=pM[y.kind];l.set(E[Math.floor(y.variation*13)%E.length]);const R=l.r,P=l.g,I=l.b,k=Z_(y.ring,t),G=k.high,D=G+y.minHeight,L=G+y.height,U=k.low-.4,W=[y.ring,...y.holes];for(const it of W){let et=0;for(let ct=0;ct<it.length;ct++){const Et=it[ct],ot=it[(ct+1)%it.length],Y=ot[0]-Et[0],nt=ot[1]-Et[1],j=Math.hypot(Y,nt);if(j<.05)continue;const at=et/ps,yt=(et+j)/ps,bt=(D-G)/ps,Vt=(L-G)/ps;et+=j;const Ft=y.minHeight>0?D:U,Zt=Math.min(D+fM,L-.5),Ot=(Zt-G)/ps;e.push(Et[0],Ft,Et[1],ot[0],Zt,ot[1],ot[0],Ft,ot[1],Et[0],Ft,Et[1],Et[0],Zt,Et[1],ot[0],Zt,ot[1]),n.push(at,bt,yt,Ot,yt,bt,at,bt,at,Ot,yt,Ot);for(let Dt=0;Dt<6;Dt++)s.push(b*.72,T*.71,v*.7);e.push(Et[0],Zt,Et[1],ot[0],L,ot[1],ot[0],Zt,ot[1],Et[0],Zt,Et[1],Et[0],L,Et[1],ot[0],L,ot[1]),n.push(at,Ot,yt,Vt,yt,Ot,at,Ot,at,Vt,yt,Vt);for(let Dt=0;Dt<6;Dt++)s.push(b,T,v)}}const X=gM(y.ring),J=yu(y.ring);if(xM(y,X)&&X){const et=X.halfLong+.38,ct=X.halfShort+.38,Et=Math.min(ct*.577,4.2),ot=L,Y=L+Et,nt=(Dt,te)=>[X.cx+X.ux*Dt-X.uz*te,X.cz+X.uz*Dt+X.ux*te],j=nt(-et,-ct),at=nt(et,-ct),yt=nt(et,ct),bt=nt(-et,ct),Vt=nt(-et+ct,0),Ft=nt(et-ct,0),Zt=Dt=>{const te=Dt[0]-X.cx,ae=Dt[1]-X.cz;return[(te*X.ux+ae*X.uz)/Wn,(-te*X.uz+ae*X.ux)/Wn]},Ot=(Dt,te,ae,ye,Se,ce,le)=>{const F=r.length;ih(r,Dt[0],te,Dt[1],ae[0],ye,ae[1],Se[0],ce,Se[1]);for(let de=0;de<3;de++){const[Qt,C]=Zt([r[F+de*3],r[F+de*3+2]]);a.push(Qt,C)}for(let de=0;de<3;de++)o.push(R*le,P*le,I*le)};Ot(j,ot,at,ot,Ft,Y,1),Ot(j,ot,Ft,Y,Vt,Y,1),Ot(yt,ot,bt,ot,Vt,Y,.9),Ot(yt,ot,Vt,Y,Ft,Y,.9),Ot(bt,ot,j,ot,Vt,Y,.95),Ot(at,ot,yt,ot,Ft,Y,.95),Ho(r,o,a,[j,at,yt,bt],ot,ot-.22,R*.68,P*.68,I*.68,J)}else{const it=y.ring.map(([nt,j])=>new kt(nt,j)),et=y.holes.map(nt=>nt.map(([j,at])=>new kt(j,at)));let ct;try{ct=Xr.triangulateShape(it,et)}catch{continue}const Et=it.concat(...et),ot=y.height>6?.55:.3,Y=L+ot*.35;for(const nt of ct){const j=Et[nt[0]],at=Et[nt[1]],yt=Et[nt[2]];if(!j||!at||!yt)continue;const bt=r.length;ih(r,j.x,Y,j.y,at.x,Y,at.y,yt.x,Y,yt.y);for(let Vt=0;Vt<3;Vt++)a.push(r[bt+Vt*3]/Wn,r[bt+Vt*3+2]/Wn);for(let Vt=0;Vt<3;Vt++)o.push(R*.86,P*.86,I*.86)}Ho(r,o,a,y.ring,L+ot,L-.05,b*.92,T*.92,v*.92,J),Ho(r,o,a,y.ring,L+ot,L+ot-.06,b*1.06,T*1.06,v*1.06,J)}}const h=oM(),u=aM(),f=new ge;f.setAttribute("position",new Kt(e,3)),f.setAttribute("uv",new Kt(n,2)),f.setAttribute("color",new Kt(s,3)),f.computeVertexNormals(),f.computeBoundingSphere();const d=new Ge({map:h,emissiveMap:u,emissive:new ut(16777215),emissiveIntensity:0,vertexColors:!0,roughness:.82,metalness:.02}),p=uM(),x=new ge;x.setAttribute("position",new Kt(r,3)),x.setAttribute("uv",new Kt(a,2)),x.setAttribute("color",new Kt(o,3)),x.computeVertexNormals(),x.computeBoundingSphere();const g=new Ge({map:p,vertexColors:!0,roughness:.95,metalness:0}),m=new fe(f,d);m.castShadow=!0,m.receiveShadow=!0,m.name="buildings:walls";const _=new fe(x,g);return _.castShadow=!0,_.receiveShadow=!0,_.name="buildings:roofs",{walls:m,roofs:_,setWindowLight(y){d.emissiveIntensity=y},dispose(){f.dispose(),x.dispose(),d.dispose(),g.dispose(),p.dispose(),h.dispose(),u.dispose()}}}class MM{constructor(t){this.buildings=t,t.forEach((e,n)=>{let s=1/0,r=-1/0,o=1/0,a=-1/0;for(const[c,l]of e.ring)c<s&&(s=c),c>r&&(r=c),l<o&&(o=l),l>a&&(a=l);for(let c=Math.floor(s/this.size);c<=Math.floor(r/this.size);c++)for(let l=Math.floor(o/this.size);l<=Math.floor(a/this.size);l++){const h=(c+32768)*65536+(l+32768);let u=this.cells.get(h);u||this.cells.set(h,u=[]),u.push(n)}})}buildings;cells=new Map;size=60;at(t,e){const n=(Math.floor(t/this.size)+32768)*65536+(Math.floor(e/this.size)+32768);for(const s of this.cells.get(n)??[]){const r=this.buildings[s];if(yM([t,e],r.ring))return r}return null}}function yM(i,t){let e=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const r=t[n][0],o=t[n][1],a=t[s][0],c=t[s][1];o>i[1]!=c>i[1]&&i[0]<(a-r)*(i[1]-o)/(c-o)+r&&(e=!e)}return e}function Ts(i,t){const e=i.length,n=new Array(e),s=new Array(e),r=new Array(Math.max(0,e-1));for(let o=0;o<e-1;o++){const a=i[o+1][0]-i[o][0],c=i[o+1][1]-i[o][1],l=Math.hypot(a,c)||1;r[o]=[a/l,c/l]}for(let o=0;o<e;o++){const a=r[Math.max(0,o-1)]??[1,0],c=r[Math.min(r.length-1,o)]??a,l=[a[1],-a[0]],h=[c[1],-c[0]];let u=l[0]+h[0],f=l[1]+h[1];const d=Math.hypot(u,f);d<1e-4?(u=l[0],f=l[1]):(u/=d,f/=d);const p=u*l[0]+f*l[1],g=Math.min(1+1.6/Math.max(Math.abs(t),.2),1/Math.max(.35,p)),m=u*t*g,_=f*t*g;s[o]=[i[o][0]+m,i[o][1]+_],n[o]=[i[o][0]-m,i[o][1]-_]}return{left:n,right:s}}function Ha(i,t,e,n,s,r,o,a){let c=0;for(let l=0;l<i.length-1;l++){const h=i[l],u=t[l],f=i[l+1],d=t[l+1],p=e[l],x=e[l+1],g=Math.hypot(f[0]-h[0],f[1]-h[1]),m=c/a,_=(c+g)/a;c+=g,s.push(h[0],p,h[1],d[0],x,d[1],u[0],p,u[1],h[0],p,h[1],f[0],x,f[1],d[0],x,d[1]),r.push(0,m,1,_,1,m,0,m,0,_,1,_);for(let y=0;y<6;y++)o.push(n.r,n.g,n.b)}}const Dr=Vi,sh=Dr+.03;function SM(i,t){return i.map(e=>e+t)}function EM(i,t){const e=[],n=[],s=[],r=new ut(7037529),o=new ut(10129798),a=new ut(5195324),c=1.52,l=4.2;for(const d of i){if(d.points.length<2||Mc(d)||d.kind==="subway")continue;const p=Math.max(1,Math.min(6,d.tracks)),x=d.bridge?vc(d.points,t,Dr,d.layer):xc(d.points,t,Dr,4),g=d.kind==="tram";if(!g){const y=p*l/2+.8,M=Ts(d.points,y),w=d.kind==="disused"?a:r;Ha(M.left,M.right,x,w,e,n,s,4)}const m=SM(x,(g?sh+.01:sh)-Dr),_=g?c+1.2:l;for(let y=0;y<p;y++){const M=(y-(p-1)/2)*_;for(const w of[-1,1]){const b=M+w*c/2,T=Ts(d.points,b-.09),v=Ts(d.points,b+.09);Ha(T.right,v.right,m,o,e,n,s,4)}}}const h=new nn;h.name="railways";const u=[],f=new Ge({vertexColors:!0,roughness:.9,metalness:.25,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});if(e.length){const d=new ge;d.setAttribute("position",new Kt(e,3)),d.setAttribute("uv",new Kt(n,2)),d.setAttribute("color",new Kt(s,3)),d.computeVertexNormals(),d.computeBoundingSphere();const p=new fe(d,f);p.receiveShadow=!0,p.name="railways:track",h.add(p),u.push(d)}return{group:h,dispose(){for(const d of u)d.dispose();f.dispose()}}}const rh=13,oh=.25,bM=.22;function wM(i,t,e){if(i.kind==="junction")return;const{rows:n,cols:s,x:r,z:o,cell:a}=i.lattice,c=t[n-1];let l=i.edge*2654435761>>>0;const h=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296);let u=rh*h(),f=0;for(;u<c;){for(;f<n-2&&t[f+1]<=u;)f++;if(h()>bM){const d=AM(a,f,s,h()<.5);if(d>=0){const p=f*s+d,x=p+s+1;e.push({x:(r[p]+r[x])/2,z:(o[p]+o[x])/2,scale:.85+h()*.5})}}u+=rh*(1-oh+h()*oh*2)}}function AM(i,t,e,n){const s=t*(e-1);for(let r=0;r<e-1;r++){const o=n?r:e-2-r;if(i[s+o]===Nt.Verge)return o}return-1}const Ec=new ut(8225624),TM=new ut(9341798),RM=new ut(8877659),CM=new ut(8156523),PM=new ut(7635023),IM=new ut(5596733),LM=new ut(7962959),DM=new ut(12892053),UM=new ut(7176011),NM=new ut(7766095),FM=new ut(7828589),OM=new ut(3956600),Ss=new ut(10328463),BM=new ut(9538948),kM=new ut(7302246);function Su(i,t){return{dryness:(Vn(i,t,260)*.6+Vn(i-1720,t+640,74)*.4)*.5+.5,mottle:Vn(i+4231,t-991,26)*.7+Vn(i-88,t+305,8)*.3}}function Eu(i,t,e,n=0,s=.42){const{dryness:r,mottle:o}=Su(t,e);i.lerp(TM,r*s);const a=1+o*.17-n*.34;return i.multiplyScalar(Math.max(.25,a)),i}function bu(i,t,e,n=0){const{mottle:s}=Su(t,e),r=1+s*.045-n*.3;return i.multiplyScalar(Math.max(.3,r)),i}const ah={motorway:4868686,trunk:4868686,primary:5000272,secondary:5131857,tertiary:5197650,residential:5329236,service:5526609,pedestrian:9341568,footway:9341568,cycleway:7038560,steps:9341568,track:7301212},zM=(()=>{const i=new Array(12).fill("asphalt");return i[Nt.KerbFace]="paving",i[Nt.KerbTop]="paving",i[Nt.Pavement]="paving",i[Nt.Parapet]="paving",i[Nt.Fascia]="paving",i[Nt.Verge]="soil",i[Nt.Batter]="soil",i})(),GM=(()=>{const i=new Array(12).fill(3.2);return i[Nt.KerbFace]=.8,i[Nt.KerbTop]=.8,i[Nt.Pavement]=1.1,i[Nt.Verge]=2.4,i[Nt.Batter]=2.4,i[Nt.Parapet]=1.4,i[Nt.Fascia]=2.2,i})(),HM=(()=>{const i=new Array(12).fill(!1);return i[Nt.Verge]=!0,i[Nt.Batter]=!0,i})(),Fi=new ut;function Er(i,t){return i.clone().multiplyScalar(t)}function VM(i,t){switch(i){case Nt.Carriageway:case Nt.Junction:case Nt.Crossing:return new ut(ah[t]);case Nt.Parking:return Er(new ut(ah[t]),1.06);case Nt.KerbFace:return Er(kM,.9);case Nt.KerbTop:return BM;case Nt.Pavement:return Ss;case Nt.Verge:return LM;case Nt.Batter:return Ec;case Nt.Parapet:return Er(Ss,.94);case Nt.Fascia:return Er(Ss,.66);default:return Ss}}function WM(i,t=null,e=null){const n={asphalt:{pos:[],uv:[],col:[]},paving:{pos:[],uv:[],col:[]},soil:{pos:[],uv:[],col:[]}},s=[],r={pos:[],uv:[],col:[]};for(const x of i){const{rows:g,cols:m,x:_,y,z:M,cell:w}=x.lattice,b=new Float64Array(g);for(let T=1;T<g;T++){const v=T*m,E=(T-1)*m;b[T]=b[T-1]+Math.hypot(_[v]-_[E],M[v]-M[E])}for(let T=0;T<g-1;T++){let v=0;for(let E=0;E<m-1;E++){const R=T*(m-1)+E,P=w[R],I=T*m+E,k=I+1,G=I+m+1,D=I+m,L=Math.hypot(_[k]-_[I],M[k]-M[I]),U=Math.abs(y[k]-y[I]),W=Math.hypot(L,U);if(P===Nt.None){v+=W;continue}const X=n[zM[P]],J=GM[P],it=HM[P],et=VM(P,x.cls),ct=[[b[T]/J,v/J],[b[T]/J,(v+W)/J],[b[T+1]/J,(v+W)/J],[b[T+1]/J,v/J]],Et=[I,k,G,D],ot=j=>{const at=Et[j];X.pos.push(_[at],y[at],M[at]),X.uv.push(ct[j][0],ct[j][1]),Fi.copy(et);const yt=t?.at(_[at],M[at])??0;it?Eu(Fi,_[at],M[at],yt):bu(Fi,_[at],M[at],yt),X.col.push(Fi.r,Fi.g,Fi.b)};e&&mu(P)&Sc.Paved&&e.stampQuad([_[I],M[I]],[_[k],M[k]],[_[G],M[G]],[_[D],M[D]]);const nt=(_[k]-_[I])*(M[G]-M[I])-(_[G]-_[I])*(M[k]-M[I])<0?[0,1,2,0,2,3]:[0,2,1,0,3,2];for(const j of nt)ot(j);v+=W}}$M(x,b,r),wM(x,b,s)}const o=lM(),a=hM(),c=Mu(),l=new nn;l.name="roads";const h={asphalt:new Ge({map:o,vertexColors:!0,roughness:.96,metalness:0}),paving:new Ge({map:a,vertexColors:!0,roughness:.9,metalness:0}),soil:new Ge({map:c,vertexColors:!0,roughness:1,metalness:0})},u=new cc({vertexColors:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),f=[];let d=0;const p={asphalt:"roads:surface",paving:"roads:paving",soil:"roads:verge"};for(const x of["asphalt","paving","soil"]){const g=n[x];if(!g.pos.length)continue;const m=new ge;m.setAttribute("position",new Kt(g.pos,3)),m.setAttribute("uv",new Kt(g.uv,2)),m.setAttribute("color",new Kt(g.col,3)),m.computeVertexNormals(),m.computeBoundingSphere();const _=new fe(m,h[x]);_.receiveShadow=!0,_.castShadow=x==="paving",_.name=p[x],l.add(_),f.push(m),d+=g.pos.length/9}if(r.pos.length){const x=new ge;x.setAttribute("position",new Kt(r.pos,3)),x.setAttribute("uv",new Kt(r.uv,2)),x.setAttribute("color",new Kt(r.col,3)),x.computeBoundingSphere();const g=new fe(x,u);g.name="roads:markings",l.add(g),f.push(x),d+=r.pos.length/9}return{group:l,treeSpots:s,triangles:d,dispose(){for(const x of f)x.dispose();for(const x of Object.values(h))x.dispose();u.dispose(),o.dispose(),a.dispose(),c.dispose()}}}const ch=.06,XM=new ut(14209732),ZM=new ut(13222838);function $M(i,t,e){if(!i.marks.length)return;const{rows:n,cols:s,x:r,y:o,z:a}=i.lattice;for(const c of i.marks){const l=c.kind==="centre"?XM:ZM;for(let h=0;h<n-1;h++){const u=h*s+c.col,f=u+s,d=t[h+1]-t[h];if(d<.2)continue;const p=Math.min(1,3/d),x=r[u],g=a[u],m=x+(r[f]-x)*p,_=g+(a[f]-g)*p,y=o[u],M=y+(o[f]-y)*p,w=m-x,b=_-g,T=Math.hypot(w,b)||1,v=b/T*ch,E=-w/T*ch,R=[[x-v,y,g-E],[x+v,y,g+E],[m+v,M,_+E],[m-v,M,_-E]],I=(R[1][0]-R[0][0])*(R[2][2]-R[0][2])-(R[2][0]-R[0][0])*(R[1][2]-R[0][2])<0?[0,1,2,0,2,3]:[0,2,1,0,3,2];for(const k of I)e.pos.push(R[k][0],R[k][1],R[k][2]),e.uv.push(0,0),e.col.push(l.r,l.g,l.b)}}}const Va={water:OM,park:PM,forest:IM,grass:Ec,sand:DM,pitch:UM,cemetery:NM,parking:FM,pavement:Ss},YM=new Set(["park","forest","grass","pitch","cemetery"]),qM=3;function wu(i,t){if(i.length<3)return null;const e=i.map(([s,r])=>new kt(s,r)),n=t.map(s=>s.map(([r,o])=>new kt(r,o)));try{const s=Xr.triangulateShape(e,n);return{flat:e.concat(...n),faces:s}}catch{return null}}function Wa(i,t){let e=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const r=t[n][0],o=t[n][1],a=t[s][0],c=t[s][1];o>i[1]!=c>i[1]&&i[0]<(a-r)*(i[1]-o)/(c-o)+r&&(e=!e)}return e}function KM(i){const t=i.map(e=>{let n=1/0,s=-1/0,r=1/0,o=-1/0;for(const[a,c]of e.ring)a<n&&(n=a),a>s&&(s=a),c<r&&(r=c),c>o&&(o=c);return{minX:n,maxX:s,minZ:r,maxZ:o,span:(s-n)*(o-r)}});return i.map((e,n)=>{const s=t[n],r=(e.ring[0][0]+(s.minX+s.maxX)/2)/2,o=(e.ring[0][1]+(s.minZ+s.maxZ)/2)/2;let a=0;for(let c=0;c<i.length&&a<qM;c++){if(c===n)continue;const l=t[c];l.span<=s.span||r<l.minX||r>l.maxX||o<l.minZ||o>l.maxZ||Wa([r,o],i[c].ring)&&a++}return a})}class JM{rgb;cover;soft;cols;rows;originX;originZ;cell;result={cover:0,soft:1};constructor(t,e){this.cell=Math.max(1.5,e/400);const n=e*2.2;this.cols=Math.max(8,Math.ceil(n/this.cell)+1),this.rows=this.cols,this.originX=-n/2,this.originZ=-n/2;const s=this.cols*this.rows;this.rgb=new Float32Array(s*3),this.cover=new Float32Array(s),this.soft=new Float32Array(s);const r=KM(t),o=t.map((a,c)=>c).sort((a,c)=>r[a]-r[c]);for(const a of o){const c=t[a];if(c.kind==="water")continue;const l=wu(c.ring,c.holes);if(!l)continue;const h=Va[c.kind],u=YM.has(c.kind)?1:0;for(const f of l.faces){const d=l.flat[f[0]],p=l.flat[f[1]],x=l.flat[f[2]];!d||!p||!x||this.paint([d.x,d.y],[p.x,p.y],[x.x,x.y],h,u)}}}sample(t,e,n){const s=(t-this.originX)/this.cell,r=(e-this.originZ)/this.cell;if(s<0||r<0||s>=this.cols-1||r>=this.rows-1)return this.result.cover=0,this.result.soft=1,0;const o=Math.floor(s),a=Math.floor(r),c=s-o,l=r-a,h=a*this.cols+o,u=h+1,f=h+this.cols,d=f+1,p=(1-c)*(1-l),x=c*(1-l),g=(1-c)*l,m=c*l,_=this.cover[h]*p+this.cover[u]*x+this.cover[f]*g+this.cover[d]*m;if(this.result.cover=_,_<=.001)return this.result.soft=1,0;const y=1/_;return n.setRGB((this.rgb[h*3]*this.cover[h]*p+this.rgb[u*3]*this.cover[u]*x+this.rgb[f*3]*this.cover[f]*g+this.rgb[d*3]*this.cover[d]*m)*y,(this.rgb[h*3+1]*this.cover[h]*p+this.rgb[u*3+1]*this.cover[u]*x+this.rgb[f*3+1]*this.cover[f]*g+this.rgb[d*3+1]*this.cover[d]*m)*y,(this.rgb[h*3+2]*this.cover[h]*p+this.rgb[u*3+2]*this.cover[u]*x+this.rgb[f*3+2]*this.cover[f]*g+this.rgb[d*3+2]*this.cover[d]*m)*y),this.result.soft=(this.soft[h]*this.cover[h]*p+this.soft[u]*this.cover[u]*x+this.soft[f]*this.cover[f]*g+this.soft[d]*this.cover[d]*m)*y,_}paint(t,e,n,s,r){const o=Math.min(t[0],e[0],n[0]),a=Math.max(t[0],e[0],n[0]),c=Math.min(t[1],e[1],n[1]),l=Math.max(t[1],e[1],n[1]),h=Math.max(0,Math.floor((o-this.originX)/this.cell)),u=Math.min(this.cols-1,Math.ceil((a-this.originX)/this.cell)),f=Math.max(0,Math.floor((c-this.originZ)/this.cell)),d=Math.min(this.rows-1,Math.ceil((l-this.originZ)/this.cell));if(u<h||d<f)return;const p=(e[0]-t[0])*(n[1]-t[1])-(n[0]-t[0])*(e[1]-t[1]);if(Math.abs(p)<1e-9)return;const x=p>0?1:-1;for(let g=f;g<=d;g++){const m=this.originZ+g*this.cell;for(let _=h;_<=u;_++){const y=this.originX+_*this.cell;if(((e[0]-t[0])*(m-t[1])-(y-t[0])*(e[1]-t[1]))*x<0||((n[0]-e[0])*(m-e[1])-(y-e[0])*(n[1]-e[1]))*x<0||((t[0]-n[0])*(m-n[1])-(y-n[0])*(t[1]-n[1]))*x<0)continue;const M=g*this.cols+_;this.rgb[M*3]=s.r,this.rgb[M*3+1]=s.g,this.rgb[M*3+2]=s.b,this.cover[M]=1,this.soft[M]=r}}}}const QM=160,jM=512,ty=5,ki=.72;function Au(i,t){const e=Math.max(QM,Math.min(jM,Math.round(2*i/(ki*Math.max(2,t)))));return{cells:e,spacing:2*i/(ki*e)}}function ey(i,t){const e=Math.abs(i),n=i<0?-1:1;if(e<=ki)return n*(e/ki)*t;const s=(e-ki)/(1-ki);return n*t*(1+s*(ty-1)*(.3+.7*s))}function ny(i){return Math.max(4,i*1.6)}function iy(i,t,e,n,s=new Map,r=[],o=new Map,a=null,c=null){const l=new nn;l.name="ground";const h=Mu();h.repeat.set(10,10);const u=[],f=[],{cells:d}=Au(t,n.resolution),p=d+1,x=new Float32Array(p*p*3),g=new Float32Array(p*p*3),m=new Float32Array(p*p*2),_=new ut,y=new ut,M=new JM(i,t),w=new Float64Array(p);for(let L=0;L<p;L++)w[L]=ey(L/d*2-1,t);for(let L=0;L<p;L++){const U=w[L];for(let W=0;W<p;W++){const X=w[W],J=L*p+W,it=n.heightAt(X,U);x[J*3]=X,x[J*3+1]=it,x[J*3+2]=U;const et=n.slopeAt(X,U);_.copy(Ec),et>.08&&_.lerp(RM,Math.min(1,(et-.08)/.22)),et>.32&&_.lerp(CM,Math.min(1,(et-.32)/.4));const ct=M.sample(X,U,y);ct>.001&&_.lerp(y,Math.min(1,ct));const Et=a?.at(X,U)??0;M.result.soft>.5||ct<=.001?Eu(_,X,U,Et):bu(_,X,U,Et),sy(_,X,U,t),g[J*3]=_.r,g[J*3+1]=_.g,g[J*3+2]=_.b,m[J*2]=X/40,m[J*2+1]=U/40}}const b=[];let T=0;for(let L=0;L<d;L++)for(let U=0;U<d;U++){const W=L*p+U,X=W+1,J=W+p,it=J+1;if(c&&Math.max(w[U+1]-w[U],w[L+1]-w[L])<=c.maxCutSpan&&c.isDeep(w[U],w[L])&&c.isDeep(w[U+1],w[L])&&c.isDeep(w[U],w[L+1])&&c.isDeep(w[U+1],w[L+1])){T++;continue}b.push(W,J,X,X,J,it)}const v=new ge;v.setAttribute("position",new Re(x,3)),v.setAttribute("color",new Re(g,3)),v.setAttribute("uv",new Re(m,2)),v.setIndex(b),v.computeVertexNormals(),v.computeBoundingSphere();const E=new Ge({map:h,vertexColors:!0,roughness:1,metalness:0}),R=new fe(v,E);R.receiveShadow=!0,R.name="ground:base",l.add(R),u.push(v),f.push(E);const P=[],I=[];let k=e>>>0;const G=()=>(k=k*1664525+1013904223>>>0,k/4294967296);for(const L of i){if(L.kind==="water"){const U=wu(L.ring,L.holes);if(!U)continue;const W=s.get(L.id)??ay(L.ring,n);for(const X of U.faces){const J=U.flat[X[0]],it=U.flat[X[1]],et=U.flat[X[2]];if(!J||!it||!et)continue;const ct=(it.y-J.y)*(et.x-J.x)-(it.x-J.x)*(et.y-J.y),Et=ct<0?et:it,ot=ct<0?it:et;P.push(J.x,W,J.y,Et.x,W,Et.y,ot.x,W,ot.y)}continue}(L.kind==="forest"||L.kind==="park")&&cy(L,L.kind==="forest"?.006:.0016,G,I)}const D=Va.water.clone();for(const L of r){if(L.tunnel||L.points.length<2)continue;const U=o.get(L.id)??L.points.map(([J,it])=>n.heightAt(J,it)),{left:W,right:X}=Ts(L.points,L.width/2);Ha(W,X,U,D,P,[],[],8)}if(P.length){const L=new ge;L.setAttribute("position",new Kt(P,3)),L.computeVertexNormals(),L.computeBoundingSphere();const U=new Ge({color:Va.water.clone(),roughness:.15,metalness:.35,transparent:!0,opacity:.92}),W=new fe(L,U);W.receiveShadow=!0,W.name="ground:water",l.add(W),u.push(L),f.push(U)}return{group:l,treeSpots:I,cutQuads:T,dispose(){for(const L of u)L.dispose();for(const L of f)L.dispose();h.dispose()}}}function sy(i,t,e,n){const s=Math.hypot(t,e),r=Math.min(1,Math.max(0,(s-n*.9)/(n*.8)));if(r<=0)return;const o=Vn(t*.72+5100,e*1.35-2400,320)*3.4,a=Math.max(-1,Math.min(1,Math.round(o)/2)),c=Vn(t-9100,e+3300,130);i.lerp(ry,Math.max(0,a)*.7*r),i.lerp(oy,Math.max(0,-a)*.62*r);const l=Math.abs(o-Math.round(o)),h=Math.max(0,1-l/.07);i.multiplyScalar((1+c*.1*r)*(1-h*.3*r))}const ry=new ut(10130020),oy=new ut(7109194);function ay(i,t){let e=1/0;for(const[n,s]of i){const r=t.heightAt(n,s);r<e&&(e=r)}return isFinite(e)?e:0}function cy(i,t,e,n){let s=1/0,r=-1/0,o=1/0,a=-1/0;for(const[h,u]of i.ring)h<s&&(s=h),h>r&&(r=h),u<o&&(o=u),u>a&&(a=u);const c=(r-s)*(a-o);if(!isFinite(c)||c<=0)return;const l=Math.min(1400,Math.round(c*t));for(let h=0;h<l;h++){const u=s+e()*(r-s),f=o+e()*(a-o);if(!Wa([u,f],i.ring))continue;let d=!1;for(const p of i.holes)if(Wa([u,f],p)){d=!0;break}d||n.push({x:u,z:f,scale:.7+e()*.8})}}const Xa=1,oi=i=>Math.round(i*100)/100,Vo=i=>Math.round(i*1e3)/1e3,ei=i=>i.map(([t,e])=>[oi(t),oi(e)]);function ly(i,t,e){return{lifeboon:Xa,taken:new Date().toISOString(),place:e,radius:i.radius,seed:i.seed,norm:i.norm.name,stats:i.stats,audit:i.audit,buildings:i.buildings.map(n=>({...n,ring:ei(n.ring),holes:n.holes.map(ei),centroid:[oi(n.centroid[0]),oi(n.centroid[1])],height:Vo(n.height),minHeight:Vo(n.minHeight),area:oi(n.area)})),roads:i.roads.map(n=>({...n,points:ei(n.points)})),railways:i.railways.map(n=>({...n,points:ei(n.points)})),waterways:i.waterways.map(n=>({...n,points:ei(n.points)})),areas:i.areas.map(n=>({...n,ring:ei(n.ring),holes:n.holes.map(ei)})),pois:i.pois.map(n=>({...n,position:[oi(n.position[0]),oi(n.position[1])]})),terrain:t instanceof Cn?t.snapshot(Vo):null}}function hy(i){if(i.lifeboon!==Xa)throw new Error(`This file is a version ${i.lifeboon} capture and this build reads version ${Xa}. Re-export it from the running site.`);const t=i.norm===Ns.name?Ns:gc,e=i.terrain?Cn.fromSnapshot(i.terrain):new Gs;return{buildings:i.buildings,roads:i.roads,railways:i.railways,waterways:i.waterways,areas:i.areas,pois:i.pois,audit:i.audit,terrain:e,radius:i.radius,norm:t,stats:i.stats,seed:i.seed}}function uy(i){const t=i.place.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"")||"place",e=i.taken.slice(0,10);return`lifeboon-${t}-${Math.round(i.radius*2)}m-${e}.json.gz`}async function fy(i){const t=JSON.stringify(i),e=uy(i),n=globalThis.CompressionStream;if(!n)return{blob:new Blob([t],{type:"application/json"}),name:e.replace(/\.gz$/,"")};const s=new Blob([t]).stream().pipeThrough(new n("gzip"));return{blob:await new Response(s).blob(),name:e}}async function dy(i){const t=new Uint8Array(await i.slice(0,2).arrayBuffer());if(!(t[0]===31&&t[1]===139))return JSON.parse(await i.text());const n=globalThis.DecompressionStream;if(!n)throw new Error("This browser cannot read a gzipped capture.");const s=i.stream().pipeThrough(new n("gzip"));return JSON.parse(await new Response(s).text())}class py{paved;deep=null;cols;rows;originX;originZ;cell;inset=0;constructor(t){this.cell=Math.max(1,t/500);const e=t*2.2;this.cols=Math.max(8,Math.ceil(e/this.cell)+1),this.rows=this.cols,this.originX=-e/2,this.originZ=-e/2,this.paved=new Uint8Array(this.cols*this.rows)}stampQuad(t,e,n,s){this.triangle(t,e,n),this.triangle(t,n,s)}stampCorridor(t,e,n){if(t.length<2||e<=0)return;const{left:s,right:r}=Ts(t,e);for(let o=0;o<t.length-1;o++)n?.[o]||(this.triangle(s[o],r[o],r[o+1]),this.triangle(s[o],r[o+1],s[o+1]))}finish(t){this.inset=t/2+this.cell;const e=Math.max(1,Math.ceil(this.inset/this.cell));this.deep=my(this.paved,this.cols,this.rows,e)}isDeep(t,e){if(!this.deep)return!1;const n=Math.round((t-this.originX)/this.cell),s=Math.round((e-this.originZ)/this.cell);return n<0||s<0||n>=this.cols||s>=this.rows?!1:this.deep[s*this.cols+n]===1}get maxCutSpan(){return Math.max(0,(this.inset-this.cell)*2)}triangle(t,e,n){const s=Math.min(t[0],e[0],n[0]),r=Math.max(t[0],e[0],n[0]),o=Math.min(t[1],e[1],n[1]),a=Math.max(t[1],e[1],n[1]),c=Math.max(0,Math.floor((s-this.originX)/this.cell)),l=Math.min(this.cols-1,Math.ceil((r-this.originX)/this.cell)),h=Math.max(0,Math.floor((o-this.originZ)/this.cell)),u=Math.min(this.rows-1,Math.ceil((a-this.originZ)/this.cell));if(l<c||u<h)return;const f=(e[0]-t[0])*(n[1]-t[1])-(n[0]-t[0])*(e[1]-t[1]);if(Math.abs(f)<1e-9)return;const d=f>0?1:-1;for(let p=h;p<=u;p++){const x=this.originZ+p*this.cell;for(let g=c;g<=l;g++){const m=this.originX+g*this.cell;((e[0]-t[0])*(x-t[1])-(m-t[0])*(e[1]-t[1]))*d<0||((n[0]-e[0])*(x-e[1])-(m-e[0])*(n[1]-e[1]))*d<0||((t[0]-n[0])*(x-n[1])-(m-n[0])*(t[1]-n[1]))*d<0||(this.paved[p*this.cols+g]=1)}}}}function my(i,t,e,n){const s=new Uint8Array(t*e);for(let o=0;o<e;o++){const a=o*t;for(let c=0;c<t;c++){let l=1;const h=c-n,u=c+n;if(h<0||u>=t)l=0;else for(let f=h;f<=u;f++)if(i[a+f]===0){l=0;break}s[a+c]=l}}const r=new Uint8Array(t*e);for(let o=0;o<t;o++)for(let a=0;a<e;a++){let c=1;const l=a-n,h=a+n;if(l<0||h>=e)c=0;else for(let u=l;u<=h;u++)if(s[u*t+o]===0){c=0;break}r[a*t+o]=c}return r}const gy=[4677690,5204541,4085302,5795651,3888448,6253634];function _y(){const i=[[0,.25,0,1,1],[.52,-.32,.18,.72,0],[-.44,-.18,-.4,.64,0]],t=[];let e=625341585;const n=()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296);for(const[c,l,h,u,f]of i){const d=new fc(u,f).toNonIndexed(),x=d.getAttribute("position").array;for(let g=0;g<x.length;g+=3){const m=.82+n()*.4;x[g]=x[g]*m+c,x[g+1]=x[g+1]*m*1.12+l,x[g+2]=x[g+2]*m+h}t.push(x.slice()),d.dispose()}const s=t.reduce((c,l)=>c+l.length,0),r=new Float32Array(s);let o=0;for(const c of t)r.set(c,o),o+=c.length;const a=new ge;return a.setAttribute("position",new Re(r,3)),a.computeVertexNormals(),a}function xy(i,t,e,n,s=900,r=null,o=2e4){const a=new nn;a.name="props";const c=new Yn(e^1542469173),l=[],h=i.concat(My(s,r,c)),u=h.length>o?yy(h,o,c):h,f=new be,d=new ut;if(u.length){const g=new $i(.11,.22,2.8,6);g.translate(0,1.4,0);const m=new Ge({color:5522490,roughness:1}),_=new _s(g,m,u.length),y=_y();y.scale(1.9,1.9,1.9),y.translate(0,4.1,0);const M=new Ge({roughness:.98,flatShading:!0}),w=new _s(y,M,u.length);u.forEach((b,T)=>{f.position.set(b.x,n.heightAt(b.x,b.z),b.z),f.rotation.set(0,c.range(0,Math.PI*2),0),f.scale.setScalar(b.scale),f.updateMatrix(),_.setMatrixAt(T,f.matrix),w.setMatrixAt(T,f.matrix),d.set(c.pick(gy)),d.offsetHSL(c.range(-.02,.02),c.range(-.06,.04),c.range(-.07,.07)),w.setColorAt(T,d)}),_.castShadow=!0,w.castShadow=!0,w.receiveShadow=!0,_.name="props:trunks",w.name="props:canopies",a.add(_,w),l.push(g,m,y,M,_,w)}const p=vy(t,c);let x=null;if(p.length){const g=new $i(.06,.09,4.6,5);g.translate(0,2.3,0);const m=new Ge({color:3816770,roughness:.7,metalness:.4}),_=new _s(g,m,p.length),y=new zs(.19,8,6);y.translate(0,4.6,0),x=new Ge({color:2895411,emissive:new ut(16767392),emissiveIntensity:0,roughness:.5});const M=new _s(y,x,p.length);p.forEach((w,b)=>{f.position.set(w[0],n.heightAt(w[0],w[1]),w[1]),f.rotation.set(0,0,0),f.scale.setScalar(1),f.updateMatrix(),_.setMatrixAt(b,f.matrix),M.setMatrixAt(b,f.matrix)}),_.castShadow=!0,_.name="props:lamp-poles",M.name="props:lamp-heads",a.add(_,M),l.push(g,m,_,y,x,M)}return{group:a,setNight(g){x&&(x.emissiveIntensity=g*3.2)},dispose(){for(const g of l)g.dispose()}}}function vy(i,t){const n=[];for(const s of i){if(!s.drivable||s.cls==="service"||s.cls==="motorway"||s.layer!==0)continue;const r=s.width/2+1.1;let o=t.range(0,32);for(let a=0;a<s.points.length-1;a++){const[c,l]=s.points[a],[h,u]=s.points[a+1],f=h-c,d=u-l,p=Math.hypot(f,d);if(p<.01)continue;const x=d/p,g=-f/p;let m=o;for(;m<p;){const _=m/p;n.push([c+f*_+x*r,l+d*_+g*r]),m+=32}o=m-p}if(n.length>2e4)break}return n}function My(i,t,e){const n=[];if(!t)return n;const s=9;for(let r=-i;r<=i;r+=s)for(let o=-i;o<=i;o+=s){const a=o+e.range(-s*.45,s*.45),c=r+e.range(-s*.45,s*.45);if(a*a+c*c>i*i||t.isBlocked(a,c))continue;const l=Vn(a+3300,c-1200,95)*.5+.5;e.next()>l*.62||n.push({x:a,z:c,scale:.7+e.next()*.85})}return n}function yy(i,t,e){const n=t/i.length,s=[];for(const r of i)if(e.next()<n&&s.push(r),s.length>=t)break;return s}const ve=3,Sy=3;class Ey{grid;blocked;cols;rows;originX;originZ;constructor(t,e,n=[]){const s=e*2.2;this.cols=Math.max(8,Math.ceil(s/ve)+1),this.rows=this.cols,this.originX=-s/2,this.originZ=-s/2,this.grid=new Float32Array(this.cols*this.rows),this.blocked=new Uint8Array(this.cols*this.rows);for(const r of t)this.stamp(r.ring,r.holes);for(const r of n)this.blockCorridor(r);for(let r=0;r<Sy;r++)this.blur();for(const r of t)this.reinforce(r.ring,r.holes);this.blur()}at(t,e){const n=(t-this.originX)/ve,s=(e-this.originZ)/ve;if(n<0||s<0||n>=this.cols-1||s>=this.rows-1)return 0;const r=Math.floor(n),o=Math.floor(s),a=n-r,c=s-o,l=o*this.cols+r,h=this.grid[l]+(this.grid[l+1]-this.grid[l])*a,u=l+this.cols,f=this.grid[u]+(this.grid[u+1]-this.grid[u])*a;return h+(f-h)*c}isBlocked(t,e){const n=Math.round((t-this.originX)/ve),s=Math.round((e-this.originZ)/ve);return n<0||s<0||n>=this.cols||s>=this.rows?!1:this.blocked[s*this.cols+n]===1}stamp(t,e){this.paint(t,e,1),this.blockRing(t)}blockRing(t){let e=1/0,n=-1/0,s=1/0,r=-1/0;for(const[u,f]of t)u<e&&(e=u),u>n&&(n=u),f<s&&(s=f),f>r&&(r=f);const o=1,a=Math.max(0,Math.floor((e-o-this.originX)/ve)),c=Math.min(this.cols-1,Math.ceil((n+o-this.originX)/ve)),l=Math.max(0,Math.floor((s-o-this.originZ)/ve)),h=Math.min(this.rows-1,Math.ceil((r+o-this.originZ)/ve));for(let u=l;u<=h;u++)for(let f=a;f<=c;f++)this.blocked[u*this.cols+f]=1}blockCorridor(t){const e=t.halfWidth+t.blend,n=t.points;for(let s=0;s<n.length-1;s++){const[r,o]=n[s],[a,c]=n[s+1],l=Math.max(0,Math.floor((Math.min(r,a)-e-this.originX)/ve)),h=Math.min(this.cols-1,Math.ceil((Math.max(r,a)+e-this.originX)/ve)),u=Math.max(0,Math.floor((Math.min(o,c)-e-this.originZ)/ve)),f=Math.min(this.rows-1,Math.ceil((Math.max(o,c)+e-this.originZ)/ve)),d=(a-r)**2+(c-o)**2;if(!(d<1e-9))for(let p=u;p<=f;p++){const x=this.originZ+p*ve;for(let g=l;g<=h;g++){const m=this.originX+g*ve;let _=((m-r)*(a-r)+(x-o)*(c-o))/d;_=_<0?0:_>1?1:_;const y=r+(a-r)*_,M=o+(c-o)*_;Math.hypot(m-y,x-M)<=e&&(this.blocked[p*this.cols+g]=1)}}}}reinforce(t,e){this.paint(t,e,.85,!0)}paint(t,e,n,s=!1){if(t.length<3)return;let r=1/0,o=-1/0,a=1/0,c=-1/0;for(const[d,p]of t)d<r&&(r=d),d>o&&(o=d),p<a&&(a=p),p>c&&(c=p);const l=Math.max(0,Math.floor((r-this.originX)/ve)),h=Math.min(this.cols-1,Math.ceil((o-this.originX)/ve)),u=Math.max(0,Math.floor((a-this.originZ)/ve)),f=Math.min(this.rows-1,Math.ceil((c-this.originZ)/ve));for(let d=u;d<=f;d++){const p=this.originZ+d*ve;for(let x=l;x<=h;x++){const g=this.originX+x*ve;if(!lh(g,p,t))continue;let m=!1;for(const y of e)if(lh(g,p,y)){m=!0;break}if(m)continue;const _=d*this.cols+x;this.grid[_]=s?Math.max(this.grid[_],n):n}}}blur(){const{cols:t,rows:e,grid:n}=this,s=new Float32Array(n.length);for(let r=0;r<e;r++)for(let o=0;o<t;o++){const a=r*t+o,c=o>0?n[a-1]:n[a],l=o<t-1?n[a+1]:n[a];s[a]=(c+n[a]*2+l)*.25}for(let r=0;r<e;r++)for(let o=0;o<t;o++){const a=r*t+o,c=r>0?s[a-t]:s[a],l=r<e-1?s[a+t]:s[a];n[a]=(c+s[a]*2+l)*.25}}}function lh(i,t,e){let n=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const o=e[s][0],a=e[s][1],c=e[r][0],l=e[r][1];a>t!=l>t&&i<(c-o)*(t-a)/(l-a)+o&&(n=!n)}return n}function by(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new ge;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let p=0;p<d.count;++p)u.push(d.getX(p)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=hh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let x=0;x<o[h].length;++x)d.push(o[h][x][f]);const p=hh(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(p)}}}return c}function hh(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Re(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,d=h.count;f<d;f++)for(let p=0;p<e;p++){const x=h.getComponent(f,p);a.setComponent(f+u,p,x)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const br=0,wy=1,Ay=2,Ty=3,Ry=4,Vr=.88,Za=1.42,uh=[3621210,7032634,9060154,3104074,4868690,8022597,5851499,3033699,9075299,4545084,7159634,4013380],fh=[15783357,14727061,13212274,11105871,8739900,6111018];function Oi(i,t){const e=i.getAttribute("position").count,n=new Float32Array(e).fill(t);return i.setAttribute("aPart",new Re(n,1)),i.deleteAttribute("uv"),i}function Cy(){const i=[],t=new Be(.36,.56,.22);t.translate(0,1.14,0),i.push(Oi(t,br));const e=new Be(.12,.07,.12);e.translate(0,1.45,0),i.push(Oi(e,br));const n=new zs(.115,10,8);n.scale(1,1.15,.95),n.translate(0,1.58,0),i.push(Oi(n,br));const s=new Be(.32,.2,.2);s.translate(0,.94,0),i.push(Oi(s,br));for(const[o,a]of[[-1,wy],[1,Ay]]){const c=new Be(.14,Vr,.16);c.translate(o*.09,Vr/2,0),i.push(Oi(c,a))}for(const[o,a]of[[-1,Ty],[1,Ry]]){const c=new Be(.1,.56,.12);c.translate(o*.235,Za-.28,0),i.push(Oi(c,a))}const r=by(i,!1);for(const o of i)o.dispose();if(!r)throw new Error("Failed to build the person geometry");return r}class Py{mesh;material;geometry;phase;gait;maxInstances;dummy=new be;color=new ut;instanceAgents=[];cullDistance=4e3;terrain=new Gs;setTerrain(t){this.terrain=t}constructor(t={}){this.maxInstances=t.maxInstances??5e3,this.geometry=Cy();const e=new Float32Array(this.maxInstances),n=new Float32Array(this.maxInstances);this.phase=new ws(e,1),this.gait=new ws(n,1),this.phase.setUsage(Xs),this.gait.setUsage(Xs),this.geometry.setAttribute("aPhase",this.phase),this.geometry.setAttribute("aGait",this.gait),this.material=new Ge({roughness:.85,metalness:0,vertexColors:!1}),this.material.onBeforeCompile=r=>{r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
           attribute float aPart;
           attribute float aPhase;
           attribute float aGait;

           // Rotate a point about the X axis around a pivot height.
           vec3 swingAround(vec3 p, float pivotY, float angle) {
             float c = cos(angle);
             float s = sin(angle);
             p.y -= pivotY;
             float ny = p.y * c - p.z * s;
             float nz = p.y * s + p.z * c;
             p.y = ny + pivotY;
             p.z = nz;
             return p;
           }

           float limbAngle(float part, float phase, float gait) {
             if (part < 0.5) return 0.0;
             // Legs and the opposite arm swing together.
             float dir = (part == 1.0 || part == 4.0) ? 1.0 : -1.0;
             float amp = (part < 2.5) ? 0.62 : 0.40;
             return sin(phase) * amp * gait * dir;
           }`).replace("#include <beginnormal_vertex>",`vec3 objectNormal = vec3( normal );
           {
             float a = limbAngle(aPart, aPhase, aGait);
             if (a != 0.0) {
               float pivot = (aPart < 2.5) ? ${Vr.toFixed(2)} : ${Za.toFixed(2)};
               objectNormal = swingAround(objectNormal + vec3(0.0, pivot, 0.0), pivot, a) - vec3(0.0, pivot, 0.0);
             }
           }`).replace("#include <begin_vertex>",`vec3 transformed = vec3( position );
           {
             float a = limbAngle(aPart, aPhase, aGait);
             if (a != 0.0) {
               float pivot = (aPart < 2.5) ? ${Vr.toFixed(2)} : ${Za.toFixed(2)};
               transformed = swingAround(transformed, pivot, a);
             }
             // Slight bob in time with the stride.
             transformed.y += abs(sin(aPhase)) * 0.035 * aGait;
           }`)},this.material.customProgramCacheKey=()=>"lifeboon-walker-v1",this.mesh=new _s(this.geometry,this.material,this.maxInstances),this.mesh.instanceMatrix.setUsage(Xs),this.mesh.count=0,this.mesh.castShadow=!0,this.mesh.receiveShadow=!1,this.mesh.frustumCulled=!1,this.mesh.name="people";const s=new Float32Array(this.maxInstances*3);this.mesh.instanceColor=new ws(s,3),this.mesh.instanceColor.setUsage(Xs)}update(t,e,n){const s=this.mesh.instanceMatrix.array,r=this.mesh.instanceColor.array,o=this.phase.array,a=this.gait.array;t.length>this.maxInstances?this.cullDistance*=.94:this.cullDistance<4e3&&(this.cullDistance*=1.03);const c=this.cullDistance*this.cullDistance;let l=0;this.instanceAgents.length=0;for(const h of t){if(l>=this.maxInstances)break;const u=h.x-e.x,f=h.z-e.z;if(u*u+f*f>c)continue;const d=h.path!==null;this.dummy.position.set(h.x,this.terrain.heightAt(h.x,h.z),h.z),this.dummy.rotation.set(0,h.heading,0),this.dummy.scale.setScalar(h.age<14?.72+h.age*.02:1),this.dummy.updateMatrix(),this.dummy.matrix.toArray(s,l*16),this.color.set(uh[h.colorIndex%uh.length]),this.color.lerp(new ut(fh[h.id%fh.length]),.18),r[l*3]=this.color.r,r[l*3+1]=this.color.g,r[l*3+2]=this.color.b,o[l]=h.phase+n*5.6,a[l]=d?1:.08,this.instanceAgents.push(h),l++}this.mesh.count=l,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor.needsUpdate=!0,this.phase.needsUpdate=!0,this.gait.needsUpdate=!0}agentAtInstance(t){return this.instanceAgents[t]??null}dispose(){this.geometry.dispose(),this.material.dispose(),this.mesh.dispose()}}const ms=.16,dh=[12107974,6127516,10251098,7307107,12891025,9080726];class Iy{group=new nn;wheels=[];frontWheels=[];headMat;tailMat;materials=[];geometries=[];constructor(t,e=0){this.group.name="car",this.group.rotation.order="YXZ";const n=t.lengthM,s=t.widthM,r=t.heightM,o=s/2,a=r*.6,c=this.material({color:dh[e%dh.length],roughness:.42,metalness:.12}),l=this.material({color:2830648,roughness:.22,metalness:.3}),h=this.material({color:1907999,roughness:.95}),u=this.material({color:10133670,roughness:.4,metalness:.6}),f=this.material({color:3487804,roughness:.7});this.headMat=this.material({color:16773848,roughness:.25,emissive:16771520,emissiveIntensity:0}),this.tailMat=this.material({color:9183264,roughness:.4,emissive:16722462,emissiveIntensity:0});const d=this.hexahedron([[o*.8,ms,n*.48],[-o*.8,ms,n*.48],[-o*.8,ms,-n*.48],[o*.8,ms,-n*.48]],[[o,a,n*.5],[-o,a,n*.5],[-o,a,-n*.5],[o,a,-n*.5]]);this.add(d,c);const p=this.hexahedron([[o*.93,a,n*.16],[-o*.93,a,n*.16],[-o*.93,a,-n*.44],[o*.93,a,-n*.44]],[[o*.8,r,-n*.05],[-o*.8,r,-n*.05],[-o*.8,r,-n*.41],[o*.8,r,-n*.41]]);this.add(p,l);const x=new Be(s*.78,.05,n*.34);x.translate(0,r,-n*.23),this.add(x,c);for(const w of[1,-1]){const b=new Be(s*.86,r*.16,.14);b.translate(0,ms+r*.14,w*n*.5),this.add(b,f)}const g=a*.78;for(const w of[1,-1]){const b=new Be(s*.26,r*.12,.07);b.translate(w*o*.62,g,n*.5),this.add(b,this.headMat);const T=new Be(s*.22,r*.11,.06);T.translate(w*o*.66,g,-n*.5),this.add(T,this.tailMat)}const m=t.wheelRadiusM,_=Math.max(.13,s*.11),y=o*.99-_*.5,M=t.wheelbaseM/2;for(const w of[!0,!1])for(const b of[1,-1]){const T=new nn;T.rotation.order="YXZ";const v=new $i(m,m,_,16);v.rotateZ(Math.PI/2);const E=new fe(v,h);E.castShadow=!0,this.geometries.push(v),T.add(E);const R=new $i(m*.58,m*.58,_*1.04,12);R.rotateZ(Math.PI/2);const P=new fe(R,u);this.geometries.push(R),T.add(P);const I=new Be(_*1.06,m*1.05,m*.16),k=new fe(I,f);this.geometries.push(I),T.add(k),T.position.set(b*y,m,w?M:-M),this.group.add(T),this.wheels.push(T),w&&this.frontWheels.push(T)}}sync(t,e,n){this.group.position.set(t.x,t.y,t.z),this.group.rotation.set(t.pitch,t.heading,t.roll);for(const s of this.wheels)s.rotation.x=t.wheelSpin;for(const s of this.frontWheels)s.rotation.y=t.steerAngle;this.headMat.emissiveIntensity=n*1.6,this.tailMat.emissiveIntensity=e?2.2:n*.9}dispose(){for(const t of this.geometries)t.dispose();for(const t of this.materials)t.dispose();this.group.clear(),this.group.removeFromParent()}material(t){const e=new Ge(t);return this.materials.push(e),e}add(t,e){const n=new fe(t,e);n.castShadow=!0,this.geometries.push(t),this.group.add(n)}hexahedron(t,e){const n=[...t,...e],s=[[4,6,5],[4,7,6],[0,1,2],[0,2,3],[0,5,1],[0,4,5],[2,6,7],[2,7,3],[0,3,7],[0,7,4],[1,5,6],[1,6,2]],r=new Float32Array(s.length*9);let o=0;for(const c of s)for(const l of c)r[o++]=n[l][0],r[o++]=n[l][1],r[o++]=n[l][2];const a=new ge;return a.setAttribute("position",new Re(r,3)),a.computeVertexNormals(),a}}const Ht=i=>{const t=document.getElementById(i);if(!t)throw new Error(`Missing element #${i}`);return t},Tu={residential:"Homes",commercial:"Commercial",office:"Offices",retail:"Retail",industrial:"Industrial",civic:"Civic building",education:"Education",religious:"Place of worship",other:"Outbuilding"},Ly={Energy:"#6fb2ff",Food:"#ffb454",Social:"#9d8cff",Fun:"#5fd39a"};class Dy{constructor(t){this.cb=t,this.aboutBuild.textContent="0e90620 · 2026-08-21 16:18 UTC",this.buildTag.textContent="0e90620 · 2026-08-21 16:18 UTC",this.bindSpeeds(),this.bindModes(),this.bindSearch(),this.bindInspector(),this.bindAbout()}cb;loader=Ht("loader");loaderFill=Ht("loader-fill");loaderStatus=Ht("loader-status");loaderError=Ht("loader-error");placeName=Ht("place-name");sourceBadge=Ht("source-badge");attribText=Ht("attrib-text");aboutAttrib=Ht("about-attrib");aboutAudit=Ht("about-audit");aboutBuild=Ht("about-build");buildTag=Ht("build-tag");clockTime=Ht("clock-time");clockDay=Ht("clock-day");statAltitude=Ht("stat-altitude");statOutdoors=Ht("stat-outdoors");statPopulation=Ht("stat-population");statBuildings=Ht("stat-buildings");statRoads=Ht("stat-roads");statFps=Ht("stat-fps");drivePanel=Ht("drive-panel");driveKmh=Ht("drive-kmh");driveGear=Ht("drive-gear");driveRev=Ht("drive-rev");driveWhere=Ht("drive-where");driveFlags=Ht("drive-flags");driveBtn=Ht("drive-btn");inspector=Ht("inspector");inspectorBody=Ht("inspector-body");followBtn=Ht("follow-btn");searchForm=Ht("search-form");searchInput=Ht("search-input");searchBtn=Ht("search-btn");radiusSelect=Ht("radius-select");captureStatus=Ht("capture-status");searchResults=Ht("search-results");lastStatsUpdate=0;setLoading(t,e){this.loaderStatus.textContent=t,this.loaderFill.style.width=`${Math.round(e*100)}%`}setLoadError(t){this.loaderError.textContent=t,this.loaderError.hidden=!1}hideLoader(){this.loader.classList.add("is-hidden"),window.setTimeout(()=>{this.loader.hidden=!0},600)}showLoader(){this.loader.hidden=!1,this.loaderError.hidden=!0,this.loader.offsetHeight,this.loader.classList.remove("is-hidden")}setWorld(t){this.placeName.textContent=t.stats.placeName;const e=t.stats.source==="synthetic";this.sourceBadge.textContent=e?"synthetic":"OpenStreetMap",this.sourceBadge.classList.toggle("is-synthetic",e),this.attribText.textContent=t.stats.attribution,this.aboutAttrib.textContent=e?"This view is a generated city, not a real place. Load somewhere by name to switch to real map data.":`Currently showing ${t.stats.placeName}, built from ${t.stats.buildings.toLocaleString()} OpenStreetMap building footprints and ${t.stats.roadLengthKm.toFixed(1)} km of mapped streets.`,this.statBuildings.textContent=t.stats.buildings.toLocaleString(),this.statRoads.textContent=`${t.stats.roadLengthKm.toFixed(1)} km`,this.renderAudit(t.audit)}renderAudit(t){if(!t){this.aboutAudit.innerHTML='<p class="fineprint">Nothing to audit — this is the generated offline city, not real map data.</p>';return}const e=(s,r)=>r>0?`${Math.round(s/r*100)}%`:"—",n=t.streetsTotal-t.streetsWithSidewalkTag;this.aboutAudit.innerHTML=`
      <div class="audit">
        <h4>Buildings</h4>
        ${ze("Total",t.buildingsTotal.toLocaleString())}
        ${ze("Surveyed height",`${t.buildingsWithHeight.toLocaleString()} · ${e(t.buildingsWithHeight,t.buildingsTotal)}`)}
        ${ze("Storey count only",`${t.buildingsWithLevels.toLocaleString()} · ${e(t.buildingsWithLevels,t.buildingsTotal)}`)}
        ${ze("Height guessed by us",`${t.buildingsGuessed.toLocaleString()} · ${e(t.buildingsGuessed,t.buildingsTotal)}`,t.buildingsGuessed>t.buildingsTotal/2)}

        <h4>Walking</h4>
        ${ze("Streets for cars",`${t.roadKmDrivable.toFixed(1)} km`)}
        ${ze("Pavements &amp; paths as their own lines",`${t.roadKmFootway.toFixed(1)} km`,t.roadKmFootway<.2)}
        ${ze("Streets that say whether they have a pavement",`${t.streetsWithSidewalkTag} of ${t.streetsTotal}`)}
        ${ze("…of those, pavement present",String(t.sidewalkYes))}
        ${ze("…of those, explicitly none",String(t.sidewalkNo))}
        ${ze("Streets nobody has surveyed",`${n} of ${t.streetsTotal}`,n>t.streetsTotal/2)}
        ${ze("Marked crossings",String(t.crossings),t.crossings===0)}

        <h4>Other</h4>
        ${ze("Railway",`${t.railwayKm.toFixed(1)} km`)}
        ${ze("Tram track",`${t.tramKm.toFixed(1)} km`)}
        ${ze("Places (shops, schools, cafes…)",t.poisTotal.toLocaleString())}
      </div>
      <p class="fineprint">
        A missing pavement tag means <em>nobody has mapped it</em>, not that the
        street has no pavement. Highlighted rows are where this area is thin
        enough that the simulation is filling gaps rather than reading facts.
      </p>
    `}setPopulationCount(t){this.statPopulation.textContent=t.toLocaleString()}updateClock(t,e){this.clockTime.textContent=t,this.clockDay.textContent=e}updateStats(t,e,n,s){t-this.lastStatsUpdate<250||(this.lastStatsUpdate=t,this.statAltitude.textContent=e>=1e3?`${(e/1e3).toFixed(2)} km`:`${Math.round(e)} m`,this.statOutdoors.textContent=n.toLocaleString(),this.statFps.textContent=String(Math.round(s)))}setDriveAvailable(t){this.driveBtn.disabled=!t,this.driveBtn.title=t?"Put a car on the street below and drive it":"No street nearby to start from — move the view over a road first"}setCaptureStatus(t){this.captureStatus.textContent=t}updateDrive(t,e){if(!e){this.drivePanel.hidden=!0;return}if(this.drivePanel.hidden=!1,t-this.lastDriveUpdate<70)return;this.lastDriveUpdate=t,this.driveKmh.textContent=String(Math.round(e.speedKmh)),this.driveGear.textContent=e.gearLabel,this.driveRev.style.width=`${Math.min(100,e.revFraction*92)}%`;const n=e.streetName?e.streetName:e.onRoad?"Unnamed street":"Off the road",s=Math.abs(e.gradePercent)>=1.5?` · ${e.gradePercent>0?"↑":"↓"} ${Math.abs(e.gradePercent).toFixed(0)}%`:"";this.driveWhere.textContent=n+s;const r=[];e.wheelspin&&r.push("wheelspin"),e.understeer&&r.push("no grip"),e.onRoad||r.push("rough going"),this.driveFlags.textContent=r.join(" · ")}lastDriveUpdate=0;showAgent(t,e,n){const s=e.homeBuilding(t),r=e.jobPoi(t),o=ph(s);this.inspectorBody.innerHTML=`
      <h3 class="insp-title">${Os(t.name)}</h3>
      <p class="insp-sub">${Os(e.describe(t))}</p>
      ${yn("Age",`${t.age}`)}
      ${yn("Lives in",o)}
      ${yn("Works at",r?Vl[r.kind]:"Not employed")}
      ${yn("Walking pace",`${t.walkSpeed.toFixed(2)} m/s`)}
      <div class="needs">
        ${wr("Energy",t.energy)}
        ${wr("Food",1-t.hunger)}
        ${wr("Social",t.social)}
        ${wr("Fun",t.fun)}
      </div>
      <p class="insp-note">
        An invented inhabitant. Their home is a real mapped building; who actually
        lives there is not known to this simulation and is not modelled.
      </p>
    `,this.inspector.hidden=!1,this.followBtn.disabled=!1}showBuilding(t,e){const n=e.filter(r=>r.buildingId===t.id),s=[...new Set(n.map(r=>Vl[r.kind]))];this.inspectorBody.innerHTML=`
      <h3 class="insp-title">${Tu[t.kind]}</h3>
      <p class="insp-sub">${ph(t)}</p>
      ${yn("Height",`${t.height.toFixed(1)} m`)}
      ${yn("Storeys",String(t.levels))}
      ${yn("Footprint",`${Math.round(t.area).toLocaleString()} m²`)}
      ${yn("Capacity",t.capacity?`~${t.capacity} people`:"—")}
      ${s.length?yn("Ground floor",s.join(", ")):""}
      <p class="insp-note">
        Shape, height and use come from the map. Categories only — any shop or
        business name in the source data is discarded on import, and the inside of
        the building is neither drawn nor simulated.
      </p>
    `,this.inspector.hidden=!1,this.followBtn.disabled=!0}hideInspector(){this.inspector.hidden=!0,this.followBtn.disabled=!0}setSearchBusy(t){this.searchBtn.disabled=t,this.searchBtn.textContent=t?"…":"Load"}showSearchResults(t){if(!t.length){this.searchResults.innerHTML='<div class="search-result" style="color:var(--muted)">Nothing found. Try adding a city or country.</div>',this.searchResults.hidden=!1;return}this.searchResults.innerHTML="";for(const e of t){const n=document.createElement("button");n.className="search-result",n.type="button",n.textContent=e.name,n.addEventListener("click",()=>{this.searchResults.hidden=!0,this.searchInput.value=e.name.split(",")[0],this.cb.onPickResult(e.lat,e.lon,e.name,this.radius)}),this.searchResults.appendChild(n)}this.searchResults.hidden=!1}hideSearchResults(){this.searchResults.hidden=!0}get radius(){return parseInt(this.radiusSelect.value,10)}setMode(t){for(const e of document.querySelectorAll("[data-mode]"))e.classList.toggle("is-active",e.dataset.mode===t)}setSpeed(t){for(const e of document.querySelectorAll("[data-speed]"))e.classList.toggle("is-active",Number(e.dataset.speed)===t)}bindSpeeds(){for(const t of document.querySelectorAll("[data-speed]"))t.addEventListener("click",()=>{for(const e of document.querySelectorAll("[data-speed]"))e.classList.remove("is-active");t.classList.add("is-active"),this.cb.onSpeedChange(Number(t.dataset.speed))})}bindModes(){for(const t of document.querySelectorAll("[data-mode]"))t.addEventListener("click",()=>{const e=t.dataset.mode;e==="follow"?this.cb.onFollow():e==="drive"?this.cb.onDrive():this.cb.onModeChange(e)})}bindSearch(){this.searchForm.addEventListener("submit",t=>{t.preventDefault();const e=this.searchInput.value.trim();e&&this.cb.onSearch(e,this.radius)}),document.addEventListener("click",t=>{!this.searchResults.contains(t.target)&&t.target!==this.searchInput&&(this.searchResults.hidden=!0)})}bindInspector(){Ht("inspector-close").addEventListener("click",()=>{this.hideInspector(),this.cb.onDeselect()})}bindAbout(){Ht("export-place").addEventListener("click",()=>this.cb.onExportPlace());const t=Ht("import-file");Ht("import-place").addEventListener("click",()=>t.click()),t.addEventListener("change",()=>{const n=t.files?.[0];t.value="",n&&this.cb.onImportPlace(n)});const e=Ht("about-modal");e.hidden=!0,Ht("about-btn").addEventListener("click",()=>{e.hidden=!1}),Ht("about-close").addEventListener("click",()=>{e.hidden=!0}),e.addEventListener("click",n=>{n.target===e&&(e.hidden=!0)}),window.addEventListener("keydown",n=>{n.key==="Escape"&&(e.hidden=!0)})}}function ze(i,t,e=!1){return`<div class="audit-row${e?" is-weak":""}"><span>${i}</span><span>${Os(t)}</span></div>`}function yn(i,t){return`<div class="insp-row"><span>${Os(i)}</span><span>${Os(t)}</span></div>`}function wr(i,t){const e=Math.round(Math.max(0,Math.min(1,t))*100),n=Ly[i]??"#6fb2ff";return`
    <div class="need">
      <span>${i}</span>
      <div class="need-bar"><div class="need-fill" style="width:${e}%;background:${n}"></div></div>
    </div>`}function ph(i){const t=i.levels===1?"single storey":`${i.levels} storeys`;return`${Tu[i.kind]}, ${t}`}function Os(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Uy={lat:52.3702,lon:4.8952},Ny="Amsterdam, Centrum",Fy=500,Qe=()=>new Promise(i=>requestAnimationFrame(()=>i()));class Oy{canvas=document.getElementById("viewport");rig=new sM(this.canvas);cameras=new rM(this.canvas,window.innerWidth/window.innerHeight);clock=new L_(7.5,10);people=new Py({maxInstances:5e3});hud;raycaster=new Nd;pointer=new kt;world=null;graph=null;population=null;buildingIndex=null;roadIndex=null;buildingMeshes=null;roadMeshes=null;railMeshes=null;groundMeshes=null;network=null;placed=null;partField=null;props=null;worldGroup=new nn;car=null;carModel=null;driveKeys=new Set;reverseIntent=!1;stoppedFor=0;selected=null;loading=!1;lastFrameTime=performance.now();fps=60;realElapsed=0;pointerDownAt={x:0,y:0,time:0};pristineTerrain=null;constructor(){this.rig.scene.add(this.worldGroup),this.rig.scene.add(this.people.mesh),this.hud=new Dy({onSpeedChange:t=>{this.clock.paused=t===0,t>0&&(this.clock.timeScale=t)},onModeChange:t=>{this.leaveCar(),this.cameras.setMode(t),this.hud.setMode(t)},onFollow:()=>{this.selected&&(this.leaveCar(),this.cameras.setMode("follow"),this.hud.setMode("follow"))},onDrive:()=>this.enterCar(),onDeselect:()=>{this.selected=null,this.cameras.mode==="follow"&&(this.cameras.setMode("orbit"),this.hud.setMode("orbit"))},onSearch:t=>{this.search(t)},onPickResult:(t,e,n,s)=>{this.loadPlace({lat:t,lon:e},n,s)},onExportPlace:()=>{this.exportPlace()},onImportPlace:t=>{this.importPlace(t)}}),window.addEventListener("resize",this.onResize),this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointerup",this.onPointerUp),window.addEventListener("keydown",this.onDriveKeyDown),window.addEventListener("keyup",this.onDriveKeyUp),this.onResize()}async boot(){this.hud.setLoading("Looking for map data…",.05);try{await this.loadPlace(Uy,Ny,Fy)}catch(t){const e=t instanceof li?t.message:"Could not reach OpenStreetMap from this browser.";this.hud.setLoadError(`${e} Showing the offline city instead — search for a place to try again.`),this.hud.setLoading("Generating an offline city…",.35),await Qe(),await this.installWorld(Fx("lifeboon",900))}this.start()}async search(t){this.hud.setSearchBusy(!0);try{const e=await V_(t);this.hud.showSearchResults(e)}catch{this.hud.showSearchResults([])}finally{this.hud.setSearchBusy(!1)}}async loadPlace(t,e,n){if(!this.loading){this.loading=!0,this.hud.hideSearchResults(),this.hud.showLoader(),this.hud.setLoading("Querying OpenStreetMap…",.1);try{const s=D_(t,n),[r,o]=await Promise.all([H_(s,{onProgress:c=>this.hud.setLoading(c,.25)}),Dx(s).catch(()=>new Gs)]);this.hud.setLoading("Reading footprints and streets…",.5),await Qe();const a=Ax(r,s,e,o);if(!a.buildings.length&&!a.roads.length)throw new li("That area has no mapped buildings or streets yet.");this.clock.latitude=t.lat,await this.installWorld(a)}finally{this.loading=!1}}}async installWorld(t){this.teardownWorld(),this.world=t,this.pristineTerrain=t.terrain,t.terrain instanceof Cn&&(t.terrain=t.terrain.resampled(Yx,By(t))),this.hud.setWorld(t),this.cameras.setTerrain(t.terrain),this.people.setTerrain(t.terrain),this.selected=null,this.hud.hideInspector(),this.hud.setLoading("Cutting the terrain…",.6),await Qe();const e=Nx(t.terrain,t.areas,t.waterways),n=yc.build(t.roads),s=$v(n,t.roads,t.terrain,t.norm);this.network=n,this.placed=s,this.partField=new tM(s.parts);const r=qv(s,t.norm),o=Au(t.radius,t.terrain.resolution);t.terrain.gradeStreets(r,ny(o.spacing)),t.terrain.gradePads(Kv(s));const a=new Ey(t.buildings,t.radius,r);this.hud.setLoading("Paving the streets…",.65),await Qe();const c=new py(t.radius);this.roadMeshes=WM(s.parts,a,c),c.finish(o.spacing),this.worldGroup.add(this.roadMeshes.group),this.hud.setLoading("Laying out the ground…",.72),await Qe(),this.groundMeshes=iy(t.areas,t.radius,t.seed,t.terrain,e.areaLevels,t.waterways,e.flowLevels,a,c),this.worldGroup.add(this.groundMeshes.group),this.railMeshes=EM(t.railways,t.terrain),this.worldGroup.add(this.railMeshes.group),this.hud.setLoading(`Raising ${t.stats.buildings.toLocaleString()} buildings…`,.8),await Qe(),this.buildingMeshes=vM(t.buildings,t.terrain),this.worldGroup.add(this.buildingMeshes.walls,this.buildingMeshes.roofs),this.buildingIndex=new MM(t.buildings),this.hud.setLoading("Planting trees, hanging lamps…",.87),await Qe(),this.props=xy(this.groundMeshes.treeSpots.concat(this.roadMeshes.treeSpots),t.roads,t.seed,t.terrain,t.radius,a),this.worldGroup.add(this.props.group),this.hud.setLoading("Mapping walkable routes…",.92),await Qe(),this.graph=_c.build(t.roads),this.roadIndex=new Kx(t.roads.filter(l=>!Mc(l)),t.terrain,null,t.norm,this.partField),this.hud.setDriveAvailable(this.roadIndex.roadCount>0),this.hud.setLoading("Moving people in…",.97),await Qe(),this.population=new Zx(t,this.graph,t.seed),this.population.spawn(Math.min(4e3,Math.max(400,Math.round(t.buildings.length*1.1)))),this.hud.setPopulationCount(this.population.count),this.cameras.goTo(0,0,Math.min(1200,t.radius*1.4)),this.hud.setLoading("Ready",1),await Qe(),this.hud.hideLoader()}async exportPlace(){if(!this.world){this.hud.setCaptureStatus("Nothing is loaded yet.");return}this.hud.setCaptureStatus("Packing…");try{const t=ly(this.world,this.pristineTerrain??this.world.terrain,this.world.stats.placeName),{blob:e,name:n}=await fy(t),s=URL.createObjectURL(e),r=document.createElement("a");r.href=s,r.download=n,r.click(),URL.revokeObjectURL(s);const o=(e.size/1048576).toFixed(2);this.hud.setCaptureStatus(`Saved ${n} — ${o} MB. Attach it to a message.`)}catch(t){this.hud.setCaptureStatus(`Could not save: ${t instanceof Error?t.message:String(t)}`)}}async importPlace(t){this.hud.setCaptureStatus(`Reading ${t.name}…`);try{const e=await dy(t);this.hud.setCaptureStatus(`Loaded ${e.place}, captured ${e.taken.slice(0,16).replace("T"," ")} UTC.`),this.hud.showLoader(),this.hud.setLoading(`Opening ${e.place}…`,.3),await Qe(),await this.installWorld(hy(e))}catch(e){this.hud.setCaptureStatus(`Could not read it: ${e instanceof Error?e.message:String(e)}`),this.hud.hideLoader()}}teardownWorld(){this.leaveCar(),this.carModel?.dispose(),this.carModel=null,this.car=null,this.worldGroup.clear(),this.buildingMeshes?.dispose(),this.roadMeshes?.dispose(),this.railMeshes?.dispose(),this.groundMeshes?.dispose(),this.props?.dispose(),this.buildingMeshes=null,this.roadMeshes=null,this.railMeshes=null,this.groundMeshes=null,this.props=null,this.graph=null,this.population=null,this.buildingIndex=null,this.roadIndex=null}start(){this.lastFrameTime=performance.now(),this.rig.renderer.setAnimationLoop(this.frame)}frame=()=>{const t=performance.now(),e=Math.min(.1,(t-this.lastFrameTime)/1e3);this.lastFrameTime=t,this.realElapsed+=e,this.fps+=(1/Math.max(e,1e-4)-this.fps)*.08;const n=this.clock.advance(e);this.population&&n>0&&this.population.update(n,this.clock);let s=!1;if(this.driving&&this.car){const a=this.driveControls(e);s=a.brake>0||a.handbrake,this.car.update(e,a),this.cameras.setDrivePose(this.car.x,this.car.y,this.car.z,this.car.heading,this.car.state.speed)}this.selected&&this.cameras.mode==="follow"&&this.cameras.setFollowPoint(this.selected.x,this.selected.z),this.cameras.update(e);const r=this.cameras.camera,o=new B(this.cameras.target.x,0,this.cameras.target.z);this.rig.update(this.clock.sunDirection(),o,this.cameras.currentDistance),this.rig.syncSky(r),this.buildingMeshes?.setWindowLight(this.rig.nightFactor*.8),this.props?.setNight(this.rig.nightFactor),this.car&&this.carModel&&this.carModel.sync(this.car,s,this.rig.nightFactor),this.population&&this.people.update(this.population.visible,r.position,this.realElapsed),this.hud.updateClock(this.clock.formatTime(),this.clock.formatDay()),this.hud.updateDrive(t,this.driving&&this.car?this.car.telemetry():null),this.hud.updateStats(t,this.cameras.altitude,this.population?.visible.length??0,this.fps),this.selected&&this.population&&this.world&&t-this.lastInspectorUpdate>500&&(this.lastInspectorUpdate=t,this.hud.showAgent(this.selected,this.population,this.world)),this.rig.renderer.render(this.rig.scene,r)};lastInspectorUpdate=0;enterCar(){if(!this.roadIndex||!this.world)return;const t=this.cameras.target;if(this.car&&Math.hypot(this.car.x-t.x,this.car.z-t.z)>400&&(this.car=null),!this.car){const e=this.findParkingSpot(t.x,t.z);if(!e)return;this.car=new cv(Mr,this.world.terrain,this.roadIndex,this.buildingIndex),this.car.placeAt(e.x,e.z,e.heading),this.carModel?.dispose(),this.carModel=new Iy(Mr,this.world.seed%6),this.worldGroup.add(this.carModel.group)}this.clock.paused=!1,this.clock.timeScale=1,this.hud.setSpeed(1),this.selected=null,this.hud.hideInspector(),this.driveKeys.clear(),this.reverseIntent=!1,this.cameras.setMode("drive"),this.hud.setMode("drive")}leaveCar(){this.cameras.mode==="drive"&&(this.cameras.setMode("orbit"),this.hud.setMode("orbit"),this.driveKeys.clear())}findParkingSpot(t,e){if(!this.roadIndex)return null;let n=null;for(let s=0;s<14;s++){const r=s*30,o=s===0?1:8;for(let a=0;a<o;a++){const c=a/o*Math.PI*2,l=this.roadIndex.nearest(t+Math.cos(c)*r,e+Math.sin(c)*r,150);if(!l)continue;const[h,u]=l.direction,f=Math.atan2(h,u),d=Math.min(l.road.width/4,2.2);for(const p of[1,-1]){const x=l.point[0]-u*d*p,g=l.point[1]+h*d*p;if(n||(n={x,z:g,heading:f}),this.carFitsAt(x,g,f))return{x,z:g,heading:f}}}}return n}carFitsAt(t,e,n){if(!this.buildingIndex)return!0;const s=Math.sin(n),r=Math.cos(n),o=Math.cos(n),a=-Math.sin(n),c=Mr.lengthM/2+.6,l=Mr.widthM/2+.4;for(const[h,u]of[[1,1],[1,-1],[-1,1],[-1,-1],[0,0]])if(this.buildingIndex.at(t+s*c*h+o*l*u,e+r*c*h+a*l*u))return!1;return!0}get driving(){return this.cameras.mode==="drive"&&this.car!==null}onDriveKeyDown=t=>{const e=t.target;if(!(e&&(e.tagName==="INPUT"||e.tagName==="TEXTAREA"))&&this.driving){if(t.code==="Escape"){this.leaveCar();return}t.code==="KeyR"&&(this.reverseIntent=!this.reverseIntent),t.code==="Space"&&t.preventDefault(),this.driveKeys.add(t.code)}};onDriveKeyUp=t=>{this.driveKeys.delete(t.code)};driveControls(t){const e=(...a)=>a.some(c=>this.driveKeys.has(c)),n=e("KeyW","ArrowUp"),s=e("KeyS","ArrowDown"),r=(this.car?.state.speed??0)<.6;this.stoppedFor=r?this.stoppedFor+t:0,this.stoppedFor>.35&&(s&&!n&&(this.reverseIntent=!0),n&&!s&&(this.reverseIntent=!1));const o=this.reverseIntent;return{throttle:(o?s:n)?1:0,brake:(o?n:s)?1:0,steer:(e("KeyD","ArrowRight")?1:0)-(e("KeyA","ArrowLeft")?1:0),reverse:o,handbrake:e("Space")}}onPointerDown=t=>{this.pointerDownAt={x:t.clientX,y:t.clientY,time:performance.now()}};onPointerUp=t=>{const e=Math.hypot(t.clientX-this.pointerDownAt.x,t.clientY-this.pointerDownAt.y),n=performance.now()-this.pointerDownAt.time;e>5||n>700||this.cameras.mode!=="drive"&&this.pick(t.clientX,t.clientY)};pick(t,e){if(!this.world||!this.population)return;const n=this.canvas.getBoundingClientRect();this.pointer.x=(t-n.left)/n.width*2-1,this.pointer.y=-((e-n.top)/n.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.cameras.camera);const s=this.raycaster.intersectObject(this.people.mesh,!1);if(s.length&&s[0].instanceId!==void 0){const l=this.people.agentAtInstance(s[0].instanceId);if(l){this.selected=l,this.lastInspectorUpdate=0,this.hud.showAgent(l,this.population,this.world);return}}const r=[];this.buildingMeshes&&r.push(this.buildingMeshes.walls,this.buildingMeshes.roofs),this.groundMeshes&&r.push(this.groundMeshes.group);const o=this.raycaster.intersectObjects(r,!0);if(!o.length){this.selected=null,this.hud.hideInspector();return}const a=o[0].point.clone().addScaledVector(this.raycaster.ray.direction,.35),c=this.buildingIndex?.at(a.x,a.z)??null;c?(this.selected=null,this.hud.showBuilding(c,this.world.pois)):(this.selected=null,this.hud.hideInspector())}onResize=()=>{const t=window.innerWidth,e=window.innerHeight;this.rig.setSize(t,e),this.cameras.setAspect(t/e)}}const Ru=new Oy;Ru.boot();window.lifeboon=Ru;function By(i){const t=i.radius*1.5;let e=-i.radius,n=i.radius,s=-i.radius,r=i.radius;for(const a of i.roads)for(const[c,l]of a.points)Math.abs(c)>t||Math.abs(l)>t||(c<e&&(e=c),c>n&&(n=c),l<s&&(s=l),l>r&&(r=l));const o=12;return{minX:e-o,minZ:s-o,maxX:n+o,maxZ:r+o}}
