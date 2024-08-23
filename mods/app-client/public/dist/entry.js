var g=class extends Error{options;constructor(e,r){let{error:o,cause:n,...i}=r??{};super(e,{cause:n??o}),this.name="Breaker",this.options=r??{};let s=JSON.stringify(i);this.stack+=`
    with parameters ${s}.`,o&&(this.stack+=`
    cause error:
${o instanceof Error?o.stack:o}.`)}};function br(t,e){throw new g(t,e)}function Ne(t,e,r){if(typeof t!="object"||t===null)throw new g(e,r)}function T(t,e,r){(typeof t!="string"||t==="")&&br(e,r)}var A=class{constructor(e=null){this.parent=e}instances=new Map;inject(e,r){this.instances.set(e,r)}get(e){let r=this.instances.get(e);if(r)return r;if(this.parent)return this.parent.get(e)}resolve(e){let r=this.get(e);if(r)return r;try{let o=e(this);return this.instances.set(e,o),o}catch(o){throw new g("error-when-resolving-provider",{provider:e.name,error:o})}}};function J(){throw new g("global-context-must-be-injected")}function Tt(){let t=new A,e={descriptor:"/",identifier:{type:"global"},resolver:t};return t.inject(J,e),e}function ie(){return{apiUrl:"http://192.168.1.105:3008",wsURL:"ws://192.168.1.105:3008"}}function Ct(){return"TM Resource Tracker v2"}function K(t,e=""){let r=document.createElement(t);return r.className=e,r}function wt(t){return e=>K(t,e)}function ae(t){return(e,r)=>{let o=K(t,e);return o.textContent=r.toString(),o}}function Be(t){return(e,r)=>{let o=K(t,e);return o.append(...r),o}}function Q(t){return(e,r)=>{let o=K(t);if(Object.assign(o,e),r)for(let[n,i]of Object.entries(r))o.setAttribute(n,i.toString());return o}}function Gt(t){return(e,r)=>{let o=K(t);return Object.assign(o,e),o.append(...r),o}}function se(t){return document.createComment(t)}var Pt=Be("button"),v=ae("button"),u=wt("div"),p=ae("div"),a=Be("div"),Wr=Q("div"),Fr=Gt("div"),le=Gt("form"),qr=Be("fieldset"),_t=Q("input"),Lt=Q("label"),Jr=ae("legend"),L=Q("img"),Rt=wt("span"),Mt=Q("span"),P=ae("span");var Oe=[{key:"black",name:"Black"},{key:"blue",name:"Blue"},{key:"green",name:"Green"},{key:"red",name:"Red"},{key:"yellow",name:"Yellow"}],xr=new Map(Oe.map(t=>[t.key,t]));function Y(t,e){T(t,"color-must-be-required-string");let r=xr.get(t);Ne(r,e)}function D(){throw new g("player-must-be-injected")}var y=class{handlers=new Set;on(e){this.handlers.add({handle:e})}emit(e){for(let r of this.handlers)r.handle(e)}};var H=class{handlers=new Set;on(e){this.handlers.add(e),e(this)}emit(){for(let e of this.handlers)e(this)}},pe=class{constructor(e){this.items=e}updates=new y;update(){this.updates.emit(this.items)}},I=class{constructor(e){this.value=e}handlers=new Set;on(e){this.handlers.add(e),e(this.value)}update(e){this.value=e,this.emit()}emit(){for(let e of this.handlers)e(this.value)}};var ce=class t{constructor(e,r,o){this.$root=e;this.collection=r;this.factory=o;r.updates.on(()=>{this.update()}),this.update()}nodes=new WeakMap;update(){let e=this.collection.items.map(r=>{let o=this.nodes.get(r);if(o===void 0){let n=this.factory.create(r);return this.nodes.set(r,n),n}return o});this.$root.replaceChildren(...e)}static create(e,r){let o=u("");return new t(o,e,r)}};function m(t,e){t.addEventListener("click",function(o){o.preventDefault(),o.stopPropagation(),e.call(this,o)})}function Et(t,e){return t.split(`
`).map(r=>`${e}${r}`).join(`
`)}function w(){let t,e;return{promise:new Promise((o,n)=>{t=o,e=n}),resolve:t,reject:e}}function je(t){return new Promise(e=>setTimeout(e,t))}function me(t){let{titleText:e,confirmText:r="Confirm",cancelText:o="Cancel"}=t,n=p("box _button",o),i=p("box _button",r),s=le({className:"modal"},[a("modal_container",[p("modal_title",e),a("modal_buttons",[n,i])])]),{promise:l,resolve:c}=w();return m(n,()=>{c({type:"cancel"})}),m(i,()=>{c({type:"confirm",value:null})}),{promise:l,$root:s}}function ue(){return new y}function kt(){return me({titleText:"Do you want to quit the game?",confirmText:"Quit"})}var Ve=class{$root=se("modal-manager-anchor");$overlay=u("app_content-overlay");style=getComputedStyle(this.$overlay);async mount(e){let{$root:r,$overlay:o}=this;r.after(o),await je(1),o.classList.add("_enabled"),o.appendChild(e.$root),await e.promise,o.classList.remove("_enabled"),await je(200),o.replaceChildren(),o.remove()}};function b(){return new Ve}var $t=t=>document.createElementNS("http://www.w3.org/2000/svg",t);function z(t,e){let r=$t("svg");r.setAttribute("class",t);let o=$t("use");return o.setAttribute("href",`/images/symbols.svg#icon-${e}`),r.appendChild(o),r}function Sr(t){let{key:e,name:r}=t,o=a("selector_panel-item",[Rt(`player-cube _${e}`),P("text",r)]);return o.dataset.key=e,o}var R=class extends H{constructor(r){super();this.options=r}index=0;setIndex(r){r>=0&&r<this.options.length&&(this.index=r,this.emit())}setValue(r){let o=this.options.findIndex(n=>n.key===r);o!==-1&&(this.index=o,this.emit())}getValue(){return this.options[this.index]}dec(){this.index>0&&(this.index-=1,this.emit())}inc(){this.index<this.options.length-1&&(this.index+=1,this.emit())}};function N(t){let e=z("selector_icon","arrow-left"),r=z("selector_icon","arrow-right"),o=a("selector_panel",[a("selector_panel-container",t.options.map(Sr))]),n=a("selector",[e,o,r]);return t.on(({index:i})=>{o.style.setProperty("--index",`${i}`),e.classList.toggle("_disabled",i===0),r.classList.toggle("_disabled",i===t.options.length-1)}),m(e,()=>t.dec()),m(r,()=>t.inc()),n}function de(){let t=new R(Oe),e=N(t);return{$root:a("edit-box _selector",[Mt({className:"edit-box_label",textContent:"Color"}),e]),store:t}}function M({label:t,name:e,placeholder:r}){let o=_t({autocomplete:"off",className:"edit-box_input",id:e,name:e,type:"text",placeholder:r??""});return{$root:a("edit-box _input",[Lt({className:"edit-box_label",textContent:t},{for:e}),o]),$input:o}}function ge(t){let{name:e,color:r}=t??{},o=M({label:"Name",name:"name",placeholder:"Your name"});o.$input.value=e??"";let n=de();r&&n.store.setValue(r);let i=p("box _button","Cancel"),s=p("box _button","Create"),l=le({className:"modal"},[a("modal_container",[p("modal_title","Type your name and choose a color:"),o.$root,n.$root,a("modal_buttons",[i,s])])]),{promise:c,resolve:d}=w();return m(i,()=>{d({type:"cancel"})}),m(s,()=>{let f=o.$input.value,x=n.store.getValue().key;Y(x,"color-must-be-valid-key"),T(f,"name-must-be-required-string"),d({type:"confirm",value:{color:x,name:f}})}),{promise:c,$root:l}}var{Deno:At}=globalThis,Tr=typeof At?.noColor=="boolean"?At.noColor:!1,Cr=!Tr;function B(t,e){return{open:`\x1B[${t.join(";")}m`,close:`\x1B[${e}m`,regexp:new RegExp(`\\x1b\\[${e}m`,"g")}}function O(t,e){return Cr?`${e.open}${t.replace(e.regexp,e.open)}${e.close}`:t}function X(t){return O(t,B([1],22))}function j(t){return O(t,B([2],22))}function ye(t){return O(t,B([91],39))}function Ue(t){return O(t,B([93],39))}function We(t){return O(t,B([94],39))}function fe(t){return O(t,B([96],39))}var Vo=new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))"].join("|"),"g");var Dt={1:"SILLY",2:"DEBUG",3:"INFO",4:"NOTICE",5:"WARN",6:"ERROR",7:"FATAL"},Ht={1:console.debug,2:console.debug,3:console.info,4:console.info,5:console.warn,6:console.error,7:console.error},It={1:j,2:j,3:fe,4:fe,5:Ue,6:ye,7:ye};function V(){throw new g("logger-must-be-injected")}function Z(t){switch(t){case WebSocket.CONNECTING:return"CONNECTING";case WebSocket.OPEN:return"OPEN";case WebSocket.CLOSING:return"CLOSING";case WebSocket.CLOSED:return"CLOSED";default:return"UNKNOWN"}}var ve=class{constructor(e,r){this.logger=e;this.ws=r;let o=w();this.ready=o.promise,r.addEventListener("open",n=>{let i=Z(r.readyState);this.logger.silly("open-web-socket-channel",{readyState:i}),o.resolve();try{this.opens.emit(n)}catch(s){this.logger.error("error-inside-web-socket-channel-open-listener",{error:s,readyState:i})}}),r.addEventListener("close",n=>{let i=Z(r.readyState),{code:s,reason:l}=n;this.logger.silly("close-web-socket-channel",{code:s,readyState:i,reason:l});try{this.closes.emit(n)}catch(c){this.logger.error("error-inside-web-socket-channel-close-listener",{code:s,error:c,readyState:i,reason:l})}}),r.addEventListener("message",n=>{let i=Z(r.readyState),s=typeof n.data=="string"?n.data:"binary";this.logger.silly("incoming-message-web-socket-channel",{data:s,readyState:i});try{this.messages.emit(n)}catch(l){this.logger.error("error-inside-web-socket-channel-message-listener",{data:s,error:l,readyState:i})}}),r.addEventListener("error",n=>{let i=Z(r.readyState);this.logger.silly("error-web-socket-channel",{readyState:i});try{this.errors.emit(n)}catch(s){this.logger.error("error-inside-web-socket-channel-error-listener",{error:s,readyState:i})}})}ready;opens=new y;closes=new y;messages=new y;errors=new y;send(e){let r=Z(this.ws.readyState);this.logger.silly("outgoing-message-web-socket-channel",{data:e,readyState:r}),this.ws.send(e)}close(){this.ws.close()}};function he(){throw new Error("web-socket-must-be-injected")}function be(t){return new ve(t.resolve(V),t.resolve(he))}var Fe=class{constructor(e,r){this.logger=e;this.webSocketChannel=r}send(e,r){let{kind:o}=e;r=r??{};let n={kind:o,body:r};this.logger.debug("dispatcher-send",{envelope:n});let i=JSON.stringify(n);this.webSocketChannel.send(i)}};function xe(t){return new Fe(t.resolve(V),t.resolve(be))}var Nt={kind:"client-updating-my-player"};var qe=class{constructor(e){this.dispatcher=e}updatePlayer(e){this.dispatcher.send(Nt,e)}};function Bt(t){return new qe(t.resolve(xe))}function Ot(t){let e=t.resolve(Ct);return{$root:a("top",[p("top_label",e)])}}function Se(t,e){let r=u("scroll_detector _top"),o=u("scroll_detector _bottom");t.classList.add("scroll"),t.replaceChildren(a("scroll_container",[r,e,o]));let n=u("app_shadow _top"),i=u("app_shadow _bottom"),s=[t,n,i],l=new WeakMap([[r,n],[o,i]]),c=x=>{for(let h of x){let S=h.target;l.get(S).classList.toggle("_enabled",!h.isIntersecting)}},d={root:t,threshold:[1]},f=new IntersectionObserver(c,d);return f.observe(r),f.observe(o),s}var C=class{constructor(e){this.description=e;this.$root=se(e)}$root;attach(e){this.$root!==e&&(this.$root.replaceWith(e),this.$root=e)}};function Te(){let t=new C("body");return document.body.appendChild(t.$root),t}var Je=class{constructor(e,r,o){this.modalManager=e;this.top=r;this.appPlace=o;let n=u("app_main"),i=a("app_content",[this.contentPlace.$root]),s=Se(n,i);this.$root=a("app",[r.$root,...s,n,e.$root])}topPlace=new C("top");modalManagerPlace=new C("modal-manager");contentPlace=new C("modal-manager");$root;render(e){this.modalManagerPlace.attach(this.modalManager.$root),this.contentPlace.attach(e),this.appPlace.attach(this.$root)}};function U(t){return new Je(t.resolve(b),t.resolve(Ot),t.resolve(Te))}var Ke=class{constructor(e){this.app=e}$root=p("loading","Loading...");render(){this.app.render(this.$root)}};function Ce(t){return new Ke(t.resolve(U))}var jt={kind:"start-game"};function Vt(){return me({titleText:"Do you want to start the game?",confirmText:"Start"})}function Ut(t){let e=t.resolve(xe),r=t.resolve(b),o=t.resolve(Ce);return{modal:async()=>{let i=Vt();r.mount(i),await i.promise,e.send(jt,null),o.render()}}}var Qe=class{create(e){let{name:r,color:o}=e;return a("history _background",[a("history_header",[u(`player-cube _${o}`),p("history_name",r)])])}};function ze(){return new pe([])}var Ye=class{constructor(e,r,o,n,i,s,l,c){this.player=r;this.modalManager=n;this.quitGameChannel=i;this.playerDataUpdater=s;this.gameStarter=l;this.app=c;let d=M({label:"GameID",name:"gameId",placeholder:"GameID"});d.$input.readOnly=!0,d.$input.value=e.identifier.gameId;let f=v("box _action","Change name or color..."),x=v("box _action","Quit game"),h=v("box _action","Start game"),S=u("waiting_players");new ce(S,o,new Qe),this.$root=a("waiting",[a("space",[a("space_container",[p("space_caption","Waiting for players..."),d.$root]),a("space_container",[p("space_caption","You can also..."),f,x,...r.isAdmin?[h]:[]]),a("space_container",[p("space_caption","Joining players:"),S])])]),m(x,()=>{this.whenQuidGameClicked()}),m(f,()=>{this.whenChanged()}),m(h,()=>{this.gameStarter.modal()})}$root;render(){this.app.render(this.$root)}async whenQuidGameClicked(){let e=kt();this.modalManager.mount(e);let r=await e.promise;r.type!=="cancel"&&this.quitGameChannel.emit(r.value)}async whenChanged(){let e=ge(this.player);this.modalManager.mount(e);let r=await e.promise;r.type!=="cancel"&&this.playerDataUpdater.updatePlayer(r.value)}};function Wt(t){return new Ye(t.resolve(E),t.resolve(D),t.resolve(ze),t.resolve(b),t.resolve(ue),t.resolve(Bt),t.resolve(Ut),t.resolve(U))}var Xe=class{constructor(e){this.players=e}async handle(e){this.players.items.splice(0,this.players.items.length,...e.players),this.players.update()}};function Ft(t){return new Xe(t.resolve(ze))}var qt={kind:"waiting-game-stage"},Jt={kind:"waiting-players"};var Kt={kind:"server-updated-my-player"},Ze=class{constructor(e){this.player=e}async handle(e){let{color:r,name:o}=e;this.player.color=r,this.player.name=o}};function Qt(t){return new Ze(t.resolve(D))}var ee=[{historyEntryId:"1",player:{playerId:1,name:"Player 1",color:"red",isAdmin:!0},type:"single",resource:{count:-22,target:"amount",type:"gold"},time:new Date},{historyEntryId:"2",player:{playerId:2,name:"Player 2",color:"blue",isAdmin:!1},type:"summary",resources:[{count:24,target:"amount",type:"gold"},{count:2,target:"amount",type:"steel"},{count:2,target:"amount",type:"points"}],time:new Date},{historyEntryId:"4",type:"generation",count:14,time:new Date},{historyEntryId:"3",player:{playerId:3,name:"Bardzo d\u0142ugie imi\u0119 gracza, \u017C\u0119 jooo i troch\u0119",color:"green",isAdmin:!1},type:"single",resource:{count:-11,target:"production",type:"titan"},time:new Date}];function wr(t){return t>=0?`+${t}`:t.toString()}function et(t){let{count:e,target:r,type:o}=t;return a(`resource _${r}`,[P("resource_label",wr(e)),L({className:"resource_icon",width:"32",height:"32",alt:`${o} icon`,src:`/images/supplies/${o}.svg`})])}function tt(t){return t.toISOString().substring(11,19)}var Ci=new y;function Gr(t){let{player:e,resource:r,time:o}=t;return a("history _background",[a("history_header",[u(`player-cube _${e.color}`),p("history_name",e.name),et(r),p("history_time",tt(o))])])}function Pr(t){let{player:e,resources:r,time:o}=t;return a("history _background",[a("history_header",[u(`player-cube _${e.color}`),p("history_name",e.name),p("history_time",tt(o))]),a("history_body",r.map(et))])}function _r(t){let{count:e}=t;return a("history",[p("history_generation",e.toString())])}function Lr(t){switch(t.type){case"single":return Gr(t);case"summary":return Pr(t);case"generation":return _r(t)}}function Pe(){return new y}var we=class{canAppend(){return!0}},Ge=class{constructor(e){this.playerId=e}canAppend(e){return e.type==="generation"||e.player.playerId===this.playerId}},te=class{constructor(e,r){this.histories=e;this.strategy=r;e.on(o=>{if(r.canAppend(o)){let n=Lr(o);this.$root.appendChild(n)}})}$root=u("histories")};function Rr(t,e,r){return Math.min(Math.max(t,e),r)}function W(t,e){let r=a("panel _transition",e.map(l=>a("panel_item",[l]))),o=0,n=0,i=0,s=t.options.length-1;return t.on(({index:l})=>{i=l,r.classList.add("_transition"),document.documentElement.style.setProperty("--animate-parallax-current",i.toString())}),r.addEventListener("pointerdown",l=>{o=l.clientX,n=0,r.classList.remove("_transition")}),r.addEventListener("pointerup",l=>{Math.abs(n)>50&&(i+=n>0?1:-1,i=Rr(i,0,s)),t.setIndex(i)}),r.addEventListener("pointermove",l=>{n=o-l.clientX;let c=i+n/500;document.documentElement.style.setProperty("--animate-parallax-current",c.toString())}),r}function G(){throw new g("playing-game-must-be-injected")}var Yt={kind:"playing-game"};var Mr=[{key:"supplies",icon:"box",name:"Supplies"},{key:"projects",icon:"projects",name:"Projects"},{key:"histories",icon:"clock",name:"History"},{key:"settings",icon:"gear",name:"Settings"}];function ot(){return new I("supplies")}var rt=class{constructor(e){this.signal=e;this.$root=a("toolbar",Mr.map(r=>this.createToolbarButton(r)))}$root;createToolbarButton(e){let{key:r,icon:o,name:n}=e,i=Pt("toolbar_item",[z("toolbar_icon",o),P("toolbar_label",n)]);return i.addEventListener("click",()=>{this.signal.update(r)}),this.signal.on(s=>{i.classList.toggle("_active",e.key===s)}),i}show(){this.$root.classList.remove("_hidden")}hide(){this.$root.classList.add("_hidden")}};function zt(t){return new rt(t.resolve(ot))}var nt=class{constructor(e,r,o){this.appPlace=e;this.modalManager=r;this.toolbar=o;let n=u("app_main"),i=a("app_content",[this.contentPlace.$root]),s=Se(n,i);this.$root=a("app _with-toolbar",[this.topPlace.$root,...s,this.modalManagerPlace.$root,o.$root])}topPlace=new C("top");modalManagerPlace=new C("modal-manager");contentPlace=new C("modal-manager");$root;render(e,r){this.topPlace.attach(e),this.modalManagerPlace.attach(this.modalManager.$root),this.contentPlace.attach(r),this.appPlace.attach(this.$root)}};function F(t){return new nt(t.resolve(Te),t.resolve(b),t.resolve(zt))}function at(t){let e=t.resolve(G),r=[];r.push({key:"all",name:"All players"});for(let{color:o,name:n}of e.players)r.push({key:o,name:n});return new R(r)}var it=class{constructor(e){this.historyPlayerStore=e;this.$root=a("top _with-controller",[p("top_label","History"),a("top_controller",[N(e)])])}$root};function Xt(t){return new it(t.resolve(at))}var st=class{constructor(e,r,o,n,i){this.app=e;this.top=r;this.playingGame=o;this.historyChannel=n;this.historyPlayerStore=i;this.items=[];let s=new te(n,new we);this.items.push(s);for(let c of o.players){let d=new te(n,new Ge(c.playerId));this.items.push(d)}let l=this.items.map(({$root:c})=>c);this.$root=W(i,l)}items;$root;render(){this.app.render(this.top.$root,this.$root)}};function Zt(t){return new st(t.resolve(F),t.resolve(Xt),t.resolve(G),t.resolve(Pe),t.resolve(at))}function re(t){let e=t.resolve(G),r=[];for(let{color:o,name:n}of e.players)r.push({key:o,name:n});return new R(r)}var lt=class{constructor(e){this.playerIndex=e;this.$label=p("top_label","TM Resource Tracker v2"),this.$root=a("top _with-controller",[this.$label,a("top_controller",[N(e)])])}$root;$label;setLabel(e){this.$label.textContent=e}};function _e(t){return new lt(t.resolve(re))}var er=[{name:"buildings"},{name:"energy"},{name:"harvest"},{name:"animals"},{name:"microbes"},{name:"science"},{name:"space"},{name:"saturn"},{name:"venus"},{name:"earth"},{name:"city"},{name:"event"}];function Er({name:t}){return a("project",[L({className:"project_icon",width:"40",height:"40",src:`/images/projects/${t}.png`}),v("box _button _project","-"),p("box _counter","0"),v("box _button _project","+")])}var Le=class{$root;constructor(){this.$root=a("panel_item",[a("projects",er.map(Er))])}};var pt=class{constructor(e,r,o,n,i){this.modalManager=e;this.app=r;this.playingGame=o;this.top=n;this.playerIndex=i;this.items=o.players.map(()=>new Le);let s=this.items.map(({$root:l})=>l);this.$root=W(i,s)}items;$root;render(){this.top.setLabel("Projects"),this.app.render(this.top.$root,this.$root)}};function tr(t){return new pt(t.resolve(b),t.resolve(F),t.resolve(G),t.resolve(_e),t.resolve(re))}function k({type:t,minAmount:e,minProd:r,processor:o}){return{type:t,targets:{production:{min:r??0,processor:o??kr},amount:{min:e??0}}}}function kr(t,e){t[e].amount+=t[e].production}function $r(t){t.gold.amount+=t.points.amount}function Ar(t){t.heat.amount+=t.energy.amount,t.energy.amount=t.energy.production}var _=[k({type:"points",minAmount:1,processor:$r}),k({type:"gold",minProd:-5}),k({type:"steel"}),k({type:"titan"}),k({type:"plant"}),k({type:"energy",processor:Ar}),k({type:"heat"})],rr={points:_[0],gold:_[1],steel:_[2],titan:_[3],plant:_[4],energy:_[5],heat:_[6]};function $(t=0,e=0){return{amount:t,production:e}}function or(t){return{points:$(t),gold:$(),steel:$(),titan:$(),plant:$(),energy:$(),heat:$()}}function nr(t){let e=v("box _button _project",t.toString());return e.dataset.digit=t.toString(),e}var ct=class extends H{digits="0";positive=!0;append(e){this.digits.length>=3||(this.digits=this.digits==="0"?e:`${this.digits}${e}`,this.emit())}clear(){this.digits="0",this.positive=!0,this.emit()}reverse(){this.positive=!this.positive,this.emit()}getValue(){return parseInt(this.digits)*(this.positive?1:-1)}};function ir(t){let{target:e,type:r,count:o}=t,n=rr[r].targets[e].min,i=p("box _counter _wide","0"),s=v("box _button","Cancel"),l=v("box _button","Confirm"),c=v("box _button _project","-"),d=v("box _button _project","C"),f=a("calculator",[...[1,2,3,4,5,6,7,8,9].map(nr),c,nr(0),d]),x=a("modal",[a("modal_container",[p("modal_title",`Change your ${e}:`),a("modal_target",[a(`modal_target-supply _${e}`,[p("box _counter",o.toString())]),L({className:"modal_target-icon",width:"64",height:"64",alt:"supply-icon",src:`/images/supplies/${r}.svg`})]),a("modal_count",[P("modal_count-label _left","by"),i,P("modal_count-label _right","units")]),f,a("modal_buttons",[s,l])])]),h=new ct;h.on(ne=>{let{digits:St,positive:q}=ne;i.textContent=`${q?"":"-"}${St}`,c.textContent=q?"-":"+";let hr=o+ne.getValue()<n;l.toggleAttribute("disabled",hr)}),m(f,ne=>{let q=ne.target.dataset.digit;q!==void 0&&h.append(q)}),m(c,()=>h.reverse()),m(d,()=>h.clear());let{promise:S,resolve:Ie}=w();return m(s,()=>{Ie({type:"cancel"})}),m(l,()=>{Ie({type:"confirm",value:h.getValue(),resource:t})}),{promise:S,$root:x,store:h}}var Re=class{constructor(e){this.modalManager=e;this.signal=new I(or(20)),this.$root=a("supplies",[u("supplies_production"),p("supplies_round","0"),...this.generateSupplies()])}$root;signal;async whenSupplyClicked({type:e,target:r}){let o=this.signal.value[e][r],n=ir({type:e,target:r,count:o});this.modalManager.mount(n);let i=await n.promise;i.type!=="cancel"&&(this.signal.value[e][r]=i.value,this.signal.emit())}*generateSupplies(){for(let{type:e}of _)yield this.createSupply("production",e),yield a(`supply _icon _${e}`,[L({className:"supply_icon",width:"64",height:"64",alt:"supply-icon",src:`/images/supplies/${e}.svg`})]),yield this.createSupply("amount",e)}createSupply(e,r){let o=p("box _counter","0"),n=a(`supply _${e} _${r}`,[o]);return this.signal.on(i=>{let s=i[r][e];o.textContent=s.toString()}),m(o,()=>this.whenSupplyClicked({type:r,target:e})),n}};var mt=class{constructor(e,r,o,n){this.modalManager=e;this.top=r;this.app=o;this.playerIndex=n;this.items=[1,2,3].map(()=>new Re(e));let i=this.items.map(({$root:s})=>s);this.$root=W(n,i)}items;$root;render(){this.top.setLabel("Supplies"),this.app.render(this.top.$root,this.$root)}};function ar(t){return new mt(t.resolve(b),t.resolve(_e),t.resolve(F),t.resolve(re))}var ut=class{constructor(e,r){this.clientGameContext=e;this.historyChannel=r}async handle(e){let{resolver:r}=this.clientGameContext;r.inject(G,e);let o=r.resolve(ot),n=r.resolve(ar),i=r.resolve(tr),s=r.resolve(Zt);o.on(l=>{switch(l){case"supplies":return n.render();case"projects":return i.render();case"histories":return s.render()}}),this.historyChannel.emit(ee[0]),this.historyChannel.emit(ee[1]),this.historyChannel.emit(ee[2]),this.historyChannel.emit(ee[3]),n.render()}};function sr(t){return new ut(t.resolve(E),t.resolve(Pe))}var dt=class{constructor(e){this.context=e}async handle(){this.context.resolver.resolve(Wt).render()}};function lr(t){return new dt(t.resolve(E))}function pr(t,e){let r=e.handlers;r.set(qt.kind,t.resolve(lr)),r.set(Jt.kind,t.resolve(Ft)),r.set(Kt.kind,t.resolve(Qt)),r.set(Yt.kind,t.resolve(sr))}function Me(){return new y}var gt=class{constructor(e){this.gaBus=e}handle(e){let{data:r}=e;T(r,"invalid-ga-envelope");let o=JSON.parse(r),{kind:n}=o;T(n,"invalid-ga-envelope-kind");try{this.gaBus.emit(o)}catch(i){throw new g("error-inside-ga-decoder",{envelope:o,error:i,kind:n})}}};function cr(t){return new gt(t.resolve(Me))}var yt=class{handlers=new Map;handle(e){let{kind:r,body:o}=e,n=this.handlers.get(r);if(n)try{n.handle(o)}catch(i){throw new g("error-inside-game-action-processor",{kind:r,envelope:e,error:i})}}};function mr(){return new yt}var Ee=class{constructor(e,r,o){this.channel=e;this.logBus=r;this.params=o}log(e,r,o={}){this.logBus.dispatch({channel:this.channel,date:new Date,severity:e,message:r,data:{...this.params,...o}})}silly(e,r){this.log(1,e,r)}debug(e,r){this.log(2,e,r)}info(e,r){this.log(3,e,r)}notice(e,r){this.log(4,e,r)}warn(e,r){this.log(5,e,r)}error(e,r){this.log(6,e,r)}fatal(e,r){this.log(7,e,r)}};var oe=class{constructor(e){this.minSeverity=e}filter(e){return!(e.severity<this.minSeverity)}};var ke=class{constructor(e,r){this.filter=e;this.formatter=r}async subscribe(e){if(this.filter.filter(e)===!1)return;let r=this.formatter.format(e);console.log(r)}};var $e=class{constructor(e){this.filter=e}async subscribe(e){if(this.filter.filter(e)===!1)return;let{channel:r,data:o,severity:n,message:i}=e;Ht[n].call(console,`[${r}] ${i}`,o)}};var Ae=class{format(e){let{channel:r,data:o,date:n,severity:i,message:s}=e,l=Dt[i],c=It[i](l),d=n.toISOString(),f=this.formatData(o);return`${`${d} [${X(c)}] [${X(r)}] ${We(X(s))}`}${j(f)}`}formatData(e){if(Object.keys(e).length===0)return`
`;let{error:r,...o}=e,n=" ";if(Object.keys(o).length>0){let i=JSON.stringify(o);n+=i}return r instanceof Error&&(n+=`
${Et(r.stack??"","  ")}
`),n}};var ft=class{subscribers=new Set;async dispatch(e){for(let r of this.subscribers)r.subscribe(e)}};function ur(){let t=new ft;if(typeof Deno=="object"){let e=new ke(new oe(1),new Ae);t.subscribers.add(e)}else{let e=new $e(new oe(1));t.subscribers.add(e)}return t}var vt=class{constructor(e){this.logBus=e}createLogger(e,r={}){return new Ee(e,this.logBus,r)}};function dr(t){return new vt(t.resolve(ur))}function E(){throw new g("client-game-context-must-be-injected")}var ht=class{constructor(e,r,o){this.config=e;this.globalContext=r;this.loggerFactory=o}context=null;createClientGameContext(e){let{gameId:r,player:o,token:n}=e,{playerId:i}=o,s=new A(this.globalContext.resolver),l={descriptor:`/client-game/${r}/player/${i}`,identifier:{gameId:r,playerId:i},resolver:s},c=new URL(this.config.wsURL);c.pathname=`/games/socket/${n}`,c.searchParams.set("time",Date.now().toString());let d=new WebSocket(c.toString()),f=this.loggerFactory.createLogger("CLIENT",{gameId:r,playerId:i});s.inject(E,l),s.inject(V,f),s.inject(he,d),s.inject(D,o);let x=s.resolve(be);{let S=s.resolve(cr);x.messages.handlers.add(S)}let h=s.resolve(Me);{let S=s.resolve(mr);pr(s,S),h.handlers.add(S)}return this.context=l,l}deleteClientGameContext(){if(this.context===null)return;let{resolver:e}=this.context,r=e.resolve(he);r.readyState===WebSocket.OPEN&&r.close(),this.context=null}};function gr(t){return new ht(t.resolve(ie),t.resolve(J),t.resolve(dr))}function De(){return new y}function He(){return new y}function yr(){let t=M({label:"Game ID",name:"gameId",placeholder:"Ask your friend"}),e=M({label:"Name",name:"player-name",placeholder:"Your name"}),r=de(),o=p("box _button","Cancel"),n=p("box _button","Join"),i=a("modal",[a("modal_container",[p("modal_title","Type game ID and your details:"),t.$root,e.$root,r.$root,a("modal_buttons",[o,n])])]),{promise:s,resolve:l}=w();return m(o,()=>{l({type:"cancel"})}),m(n,()=>{let c=t.$input.value,d=e.$input.value,f=r.store.getValue().key;Y(f,"color-must-be-valid-key"),T(d,"name-must-be-required-string"),T(c,"game-id-must-be-required-string"),l({type:"confirm",value:{color:f,gameId:c,name:d}})}),{promise:s,$root:i}}var bt=class{constructor(e,r,o,n){this.app=e;this.modalManager=r;this.createGameChannel=o;this.joinGameChannel=n;let i=v("box _action","New Game"),s=v("box _action","Join the Game"),l=v("box _action","About");this.$root=a("homepage",[i,s,l]),m(i,()=>this.whenCreateGameClicked()),m(s,()=>this.whenJoinGameClicked())}$root;render(){this.app.render(this.$root)}async whenCreateGameClicked(){let e=ge();this.modalManager.mount(e);let r=await e.promise;r.type!=="cancel"&&this.createGameChannel.emit(r.value)}async whenJoinGameClicked(){let e=yr();this.modalManager.mount(e);let r=await e.promise;r.type!=="cancel"&&this.joinGameChannel.emit(r.value)}};function fr(t){return new bt(t.resolve(U),t.resolve(b),t.resolve(De),t.resolve(He))}var xt=class{constructor(e,r,o,n,i,s){this.config=e;this.clientGameContextManager=r;this.globalContext=n;o.on(l=>this.createGame(l)),i.on(l=>this.joinGame(l)),s.on(()=>this.quitGame())}async createGame(e){let{apiUrl:r}=this.config,i=await(await fetch(`${r}/games/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();localStorage.setItem("token",i.token),this.clientGameContextManager.createClientGameContext(i)}async joinGame(e){let{apiUrl:r}=this.config,i=await(await fetch(`${r}/games/join`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();localStorage.setItem("token",i.token),this.clientGameContextManager.createClientGameContext(i)}async quitGame(){this.clientGameContextManager.deleteClientGameContext();let e=localStorage.getItem("token");if(e===null){this.renderHomepage();return}let{apiUrl:r}=this.config;await fetch(`${r}/games/quit`,{method:"POST",headers:{Authorization:`Bearer ${e}`}}),localStorage.removeItem("token"),this.renderHomepage()}async bootstrap(){let{apiUrl:e}=this.config,r=localStorage.getItem("token");if(r===null){this.renderHomepage();return}let n=await(await fetch(`${e}/games/read`,{method:"GET",headers:{Authorization:`Bearer ${r}`}})).json();if(n.error){localStorage.removeItem("token"),this.renderHomepage();return}let i=n;this.clientGameContextManager.createClientGameContext(i)}renderHomepage(){this.globalContext.resolver.resolve(fr).render()}};function vr(t){return new xt(t.resolve(ie),t.resolve(gr),t.resolve(De),t.resolve(J),t.resolve(He),t.resolve(ue))}async function Hr(){let{resolver:t}=Tt();t.resolve(Ce).render(),await t.resolve(vr).bootstrap()}Hr();
