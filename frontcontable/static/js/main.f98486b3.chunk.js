(this.webpackJsonpapibase=this.webpackJsonpapibase||[]).push([[5],{14:function(e,a,t){"use strict";a.a=function(e){return e.children}},15:function(e,a,t){"use strict";var n=t(5),r=t.n(n),c=t(10),o=t(16),u=t(24),s=t.n(u),i=t(9),l=o.a.urlApi,m=function(){var e=Object(c.a)(r.a.mark((function e(a){var t,n,c,o,u,m,d,b,p,f,E,h=arguments;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=h.length>1&&void 0!==h[1]?h[1]:{},n=h.length>2&&void 0!==h[2]&&h[2],c=h.length>3&&void 0!==h[3]?h[3]:0,e.prev=3,(o=s.a.get("auth"))&&(o=atob(o)),t.headers=!0===n?{Authorization:"Bearer ".concat(o)}:{Authorization:"Bearer ".concat(o),"Content-Type":"application/json",Accept:"application/json"},"/auth"===a&&delete t.headers.Authorization,u=l+a,e.next=11,fetch(u,t);case 11:if(401!==(m=e.sent).status){e.next=17;break}return Object(i.a)("El token enviado no es v\xe1lido"),e.abrupt("return",!1);case 17:return e.next=19,m.json();case 19:if(d=e.sent,0!==c){e.next=56;break}if(!d){e.next=52;break}if(b=d.error,d.status,p=d.body,!0!==b){e.next=33;break}if("Validation error"!==p){e.next=29;break}return Object(i.a)("Ocurri\xf3 un error de validaci\xf3n"),e.abrupt("return",!1);case 29:return Object(i.a)("Ocurri\xf3 un error al realizar la petici\xf3n"),e.abrupt("return",!1);case 31:e.next=50;break;case 33:if(!p){e.next=48;break}if(f=p.code,E=p.data,0!==f){e.next=40;break}return Object(i.c)(E),e.abrupt("return",!1);case 40:if(1!==f){e.next=44;break}return e.abrupt("return",E);case 44:return Object(i.a)(E),e.abrupt("return",!1);case 46:e.next=50;break;case 48:return Object(i.a)("El servicio no retorno informaci\xf3n"),e.abrupt("return",!1);case 50:e.next=54;break;case 52:return Object(i.a)("Ocurri\xf3 un error al realizar la acci\xf3n"),e.abrupt("return",!1);case 54:e.next=57;break;case 56:return e.abrupt("return",d);case 57:e.next=63;break;case 59:return e.prev=59,e.t0=e.catch(3),Object(i.a)("Ocurri\xf3 un error en el conector, por favor comuniquese con Soporte"),e.abrupt("return",!1);case 63:case"end":return e.stop()}}),e,null,[[3,59]])})));return function(a){return e.apply(this,arguments)}}();a.a=m},16:function(e,a,t){"use strict";a.a={defaultPath:"/base/home",basename:"/app",layout:"vertical",subLayout:"",collapseMenu:!1,layoutType:"menu-light",headerBackColor:"header-blue",rtlLayout:!1,navFixedLayout:!0,headerFixedLayout:!1,boxLayout:!1,urlApi:"http://apicontable.natalysshop.com/api/",dias_alerta_cambio_pass:10}},18:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(71),o=t(21),u=t(51),s=t.n(u),i=t(14);a.a=function(){return r.a.createElement(i.a,null,r.a.createElement(c.a,null,r.a.createElement(o.a,null,r.a.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"}},r.a.createElement("div",{className:"items-center justify-center flex flex-column flex-wrap"},r.a.createElement(s.a,{type:"bars",color:"#4681FF"}),r.a.createElement("h5",{className:"f5 f4-ns mb0 white"},"Cargando..."))))))}},20:function(e,a){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAqCAYAAABSkm6BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjOTkxM2VhMy0yMjQ5LTgyNDgtYTY1MS03Zjg0OWQ0MWY1YWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTM2MTJDRURCQ0VFMTFFOUFDQzk4QUQyQzhCQTI3QjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTM2MTJDRUNCQ0VFMTFFOUFDQzk4QUQyQzhCQTI3QjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2I3MjA1ZTktZjRkMy0wMDRkLWE4MTQtYmI2NTBjNDc1OTA2IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2Q3ZWE1MTgtOGI0OC0xMWU5LTgwZmYtZTEyZGFjZDAxZDRkIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dpkU7wAABG5JREFUeNrsW9FxozAQJR434CsBl0BKwJcKcAm4BPKXyx+UYJVgKsiYEuwSTAlHCT7Js0oUBlZaSWDfnXZGY2KkaNm3b7Ur4afr9RoFmUZe3qMT/0h4q3nL4OuWt+rjLWK9Pgz6NPzeln8f8+tybNwimHcWuQECTQCy58BkvT45b2fRh99b8c+jMo4p4/IA3HwimLIRTVwrQKnCoA+DezGwT3y349c76FcE4OaT88B1jPRJBr6r5TjByADcPJIMXLe9Pt0AiEkv3N7GcQZ2y2DTWaTgLJEgpDI0Iv1luEz5uCOALENrFULlfMKAPSmAsOOsqcc6C0bxjw2ExxRAk+NugD+FcmCWcmCLAWUjgXF/qTz9/PWQjLsMZF2fOv9L83ImBsb9T2ILnKjsf/N2HWl5MO1jApcDeKPpbzDt4wKHSazUK0EeBLgMWcAD6x4YONP1KzUEOMgMwCXEEBhY9yDA5Rb9V8HM9wVuhQB39gg2RR/B6ONAOXKCe8md7JrB/BdEN6fkjbJzIiYrR+6teTuMGEpsmP7wvIOB6dIXcYL8qnEu03lNbFQQoozQqbLZx6QwrkAMI3aumQVTbeRIAE0mSaeJ19sY5iiJS4Nw9MPL+83pJwEOW6skYHX0/TBwqnBpG2JKIuAU458cw3ImThLgXROvwI15axt9Hal3yrVrNjqVFJ6ZF0MEWHlygL1P4LB6jGn+niNJkWvYK8L4Pni+6su9AWiqfmcD5uW+gMM8lA0sto3jjoupMEgY5JtTFSRBz4gOajbqKrkmilQD+j2Djsy19l0YhIIUMdyQh9czsE547w7J1DYa8DIP4Q17li3oGI1k2TvkfmzCuoUD22oioL4K8jr6ejcx0hivQ1jnsubGSDLCNM6rMrKxTcAWmpCSIUlJo1FqqtKAGfbrNH1dwnaqWdMo6/NYomINnEkJQGWjj3BJMcx5IuCwqHGIxg+Y+61EwuXKBTgbT+6XCUMGswWvJfbvLI1vEiqnFivgckQ53WsLsmWa5CCIgyzuZNjUMjmIPXpt56B/OzUwH2/4HEuPRiVv8xDXK1U/03HJRMbvNKVKRQDIG+PmCmO55VqRE9iWTwRcc4cdIhS4OJr31brMcozJ7sIBCZWdJdtV0M9IODfecxTFNvz6lCRLgiEby4fFnKHQFOxjUsL/3Y2Ex1IT7mvHNU6WRHuEdQmETaxWK8DmLQdvo1vXVFEPUoV3XhAvfY7MDiOHBDug3A2UFxdCGFUdyuQQs4NnaYl6Dh2kHg3zAabMN+bIt606+KUOCbgc8SBhmI2Dd2In1uKB1g7AUQVLHqjAyQNUX+/VGIO36Bk3stwpMfE4LJTOlRCRMj7DtW7jsTyII8MD2YWSYscWuyCU9NnHWV3jYCTfoH1jiWOy8+kEnG0NBbgp2Wbyf1JDT2thfaI4UgNjqgmZLJm3tcwDxAtDa96Mxy4j/WsFzKNnNshcBTy4CXu3it7ZAOhnALdxSKhspIaWKFEsH3kG4Uid/GkwVf4IMAAhDlpuwmJEEAAAAABJRU5ErkJggg=="},23:function(e,a,t){"use strict";t.d(a,"a",(function(){return u}));var n=t(19),r=t(3),c=t(13),o=t(0),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=Object(o.useState)(e),t=Object(c.a)(a,2),u=t[0],s=t[1],i=function(){s(e)},l=function(e){var a=e.target;s(Object(r.a)({},u,Object(n.a)({},a.name,a.value.toUpperCase())))};return[u,l,i,s]}},29:function(e,a,t){"use strict";t.d(a,"b",(function(){return l})),t.d(a,"a",(function(){return m})),t.d(a,"d",(function(){return p})),t.d(a,"c",(function(){return f}));var n=t(5),r=t.n(n),c=t(10),o=t(15),u=t(6),s=t(24),i=t.n(s),l=(new Date((new Date).getTime()+9e5),function(e){return function(){var a=Object(c.a)(r.a.mark((function a(t){var n,c,u,s,l,m,d,p,f,h,v,g,O;return r.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(void 0!==e){a.next=11;break}if(!(n=i.a.get("auth"))){a.next=9;break}return n=atob(n),a.next=6,E();case 6:c=a.sent,s=(u=!!c&&c).userInfo,l=u.accesos,m=u.menu,t(b(n,s,l,m));case 9:a.next=22;break;case 11:return a.next=13,Object(o.a)("auth",{method:"POST",body:JSON.stringify(e)});case 13:if(!(d=a.sent)){a.next=22;break}return p=d.token,!0===e.recordarme?i.a.set("auth",btoa(p),{expires:7}):i.a.set("auth",btoa(p)),a.next=19,E();case 19:f=a.sent,v=(h=!!f&&f).userInfo,g=h.accesos,O=h.menu,t(b(p,v,g,O));case 22:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()}),m=function(){return function(){var e=Object(c.a)(r.a.mark((function e(a){var t,n,c,o,u;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E();case 2:t=e.sent,c=(n=!!t&&t).userInfo,o=n.accesos,u=n.menu,a(d(c,o,u));case 5:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}()},d=function(e,a,t){return{type:u.u,payload:{userInfo:e,accesos:a,menu:t,logged:!0}}},b=function(e,a,t,n){return{type:u.m,payload:{token:e,userInfo:a,accesos:t,menu:n,logged:!0}}},p=function(){return{type:u.c}},f=function(){return{type:u.n}},E=function(){var e=Object(c.a)(r.a.mark((function e(){var a;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(o.a)("usuario/info");case 2:if(!(a=e.sent)){e.next=7;break}return e.abrupt("return",a);case 7:return e.abrupt("return",{});case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},36:function(e,a,t){},42:function(e,a,t){"use strict";var n=t(0),r=t.n(n);a.a=function(){return r.a.createElement("div",{className:"loader-bg"},r.a.createElement("div",{className:"loader-track"},r.a.createElement("div",{className:"loader-fill"})))}},45:function(e,a,t){"use strict";t.d(a,"a",(function(){return j}));var n=t(5),r=t.n(n),c=t(10),o=t(19),u=t(3),s=t(13),i=t(0),l=t.n(i),m=t(26),d=t(21),b=t(22),p=t(11),f=(t(36),t(23)),E=t(9),h=t(15),v=t(20),g=t.n(v),O=t(29),y=t(16),A=t(18),j=function(e){var a=e.history,t=e.isModal,n=void 0!==t&&t,v=e.setAbrirModal,j=Object(b.c)(),w=Object(i.useState)(!1),N=Object(s.a)(w,2),I=N[0],k=N[1],x=Object(f.a)({password_actual:"",password_nuevo:"",password_confirmar:""}),M=Object(s.a)(x,4),T=M[0],R=M[3],C=function(e){var a=e.target,t=a.name,n=a.value;R(Object(u.a)({},T,Object(o.a)({},t,n)))},L=function(){var e=Object(c.a)(r.a.mark((function e(t){var c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),k(!0),e.next=4,Object(h.a)("usuario/actualizarpassword",{method:"PUT",body:JSON.stringify(T)});case 4:(c=e.sent)&&(Object(E.b)(c),j(Object(O.d)()),!0===n?v(!1):a.replace(y.a.defaultPath)),k(!1);case 7:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return l.a.createElement("div",{className:"row align-items-center"},l.a.createElement("div",{className:"col-md-12"},l.a.createElement("div",{className:"card-body"},!0===I?l.a.createElement(A.a,null):l.a.createElement(l.a.Fragment,null,l.a.createElement("img",{src:g.a,alt:"",className:"img-fluid mb-4"}),l.a.createElement("h4",{className:"mb-4 f-w-400"},"Actualizar Contrase\xf1a"),l.a.createElement(p.ValidationForm,{onSubmit:L,onErrorSubmit:function(e,a,t){Object(E.c)("Por favor complete la informaci\xf3n solicitada")}},l.a.createElement(m.a.Row,null,l.a.createElement(m.a.Group,{as:d.a,md:"12"},l.a.createElement(p.TextInput,{name:"password_actual",id:"password_actual",required:!0,errorMessage:"Por favor ingrese su contrase\xf1a actual",value:T.password_actual,onChange:C,placeholder:"Contrase\xf1a Actual",autoComplete:"off",type:"password"})),l.a.createElement(m.a.Group,{as:d.a,md:"12"},l.a.createElement(p.TextInput,{name:"password_nuevo",id:"password_nuevo",type:"password",placeholder:"Nueva Contrase\xf1a",required:!0,pattern:"(?=.*[A-Z]).{6,}",errorMessage:{required:"Ingrese la nueva contrase\xf1a",pattern:"La contrase\xf1a debe de tener al menos 6 caracteres y contener al menos una letra may\xfascula"},value:T.password_nuevo,onChange:C,autoComplete:"off"})),l.a.createElement(m.a.Group,{as:d.a,md:"12"},l.a.createElement(p.TextInput,{name:"password_confirmar",id:"password_confirmar",type:"password",placeholder:"Confirmar Nueva Contrase\xf1a",required:!0,validator:function(e){return e&&e===T.password_nuevo},errorMessage:{required:"Por favor confirme la nueva contrase\xf1a",validator:"La contrase\xf1a no coincide"},value:T.password_confirmar,onChange:C,autoComplete:"off"})),l.a.createElement(m.a.Group,{as:d.a,md:"6"},l.a.createElement("button",{className:"btn btn-block btn-danger mb-4",onClick:function(){!0===n?v(!1):a.replace("/auth/login")}},"Cancelar")),l.a.createElement(m.a.Group,{as:d.a,md:"6"},l.a.createElement("button",{className:"btn btn-block btn-primary mb-4",type:"submit"},"Actualizar"))))))))}},46:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(73),o=t(54),u=t.n(o),s=t(14),i=function(){return r.a.createElement(s.a,null,r.a.createElement("div",{className:"auth-wrapper maintenance"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement("div",{className:"text-center"},r.a.createElement("img",{src:u.a,alt:"",className:"img-fluid"}),r.a.createElement("h5",{className:"text-muted mb-4"},"Ups! P\xe1gina no encontrada!"),r.a.createElement(c.a,{to:"/",className:"btn btn-danger mb-4"},r.a.createElement("i",{className:"feather icon-refresh-ccw mr-2"}),"Reload"))))))};a.default=function(){return r.a.createElement(i,null)}},50:function(e,a){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAqCAYAAABSkm6BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjOTkxM2VhMy0yMjQ5LTgyNDgtYTY1MS03Zjg0OWQ0MWY1YWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUNEOEI2RThCQ0VFMTFFOTlCRTdDM0I4RTVEOUFDRDgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUNEOEI2RTdCQ0VFMTFFOTlCRTdDM0I4RTVEOUFDRDgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2I3MjA1ZTktZjRkMy0wMDRkLWE4MTQtYmI2NTBjNDc1OTA2IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2Q3ZWE1MTgtOGI0OC0xMWU5LTgwZmYtZTEyZGFjZDAxZDRkIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+sEM6vwAAA9xJREFUeNrsW4txozAQJZk0oBa4ErgSSAmkBKUEUgIuAZdgl4BLgBKgBCiBM3fC0TFopV19wl30ZjYfexVkvf1JqyTzPCdRvEk7/8Fl/kR/F76jU99lFLrL6yk0Li5uGOIWNEJWFAqdhRwmiFpfqyUdHokLR1wlvVZJhGw9btUpNzqJIGz1vOQ5iQiBbufnFNDJdl67SuNYJC4Msp2fh43OtEOiPK6Qxk0vcU2DoJRIyMX3M6C/vMeFbiPI4uK90/IlEhcGZ+ExTJBwkkLfHhbve71LtfG000r40+8KJcIXWuFpbxqi0Ig57h/FUT2u36m6HnP+D58bPe67gErckmTHu8wK4XFpj0kcF+RB5W/EQYmDkEr7lYiDEFcACTx63YGJM81fuSHBEQGIy5AhMHrdQYjjBH0Wl/lriWMAcZ1DsjHzWTy62dmOtMnfB7uhUYjn98Dc7Io3RFOwnNVIN51cGSOhAdkDz9LNZYulGZk5eq7JGo2IubVSJxwlGOURWBi5Q7sH7pC4Zqah9EgcZLgmuPgiDiJltRgGkNs6JM4GlQfiMqSXQd7HXBOn+kD9Rq8GJpYfgDid52GJSx2RhvY8k+IE2o+dNb+HKFJud/kQMhluUVztL2uDqlmeX2dQ1HBXxQmUUxhSP3XocTUQuhriWIzHcWJYZprI1LsIlSnhw3OLHGNKXGlpcKPC6DDEtQZ5n1qlc1viqDlrRC4YZgFN8wDT5J/CgjiKQWOM62KT41jyeVFli0HEbhVOhE28Kc6GepNG1ybP5ZqchsnPqqNF8skJdFylW7yrxyIFszCdJ+KgguSSqBvMW6mAuTEb4iiWvHrkFZgUlbwBqT8RF1+HEF0PEnEcmJzu2sIqhabsjfBwyOx7YXPiIWvq0Goni/kPAbgZsMRRF5Vygu66MMAkeZvFh0hfNtpPDgTtcaHCGCfmCo7wNu6JuNsXnBCBxKVJ2Kt1BXGMSWf9AoTKCVmd7pHeAeG89m3AL4iFvBE/LGQMpahQsfmmEn/3XREeK01IvVrmuHVLVANkZCJsQnu1Uqz5YgivmCggX0FnomOrstKfBoekKkBXu993thc9wgplgyoNyvxJfJYBOc+9vNMY5tyz9DyVIXeCPDODMjxjbCz/pbZEHqp+17aOcU/ueRO2bI+ZKOPTgAXRB3AcR811qBBnkFYyjMfltm0GA6kRHt0Der0HT3NxdaGx9LYecTfm4XE+vc3k7+SGljaI/IT5J8GbGHPy6Mmr570R64Blbj9QYwXLM7JZSpXGsF3TG7RMMuFFrSJXlBgLdnTLazu3GmhvlYRLVA/5JcAAimeu3W0HS+0AAAAASUVORK5CYII="},54:function(e,a,t){e.exports=t.p+"static/media/404.fe3817ae.png"},57:function(e,a,t){e.exports=t(70)},6:function(e,a,t){"use strict";t.d(a,"f",(function(){return n})),t.d(a,"g",(function(){return r})),t.d(a,"h",(function(){return c})),t.d(a,"i",(function(){return o})),t.d(a,"d",(function(){return u})),t.d(a,"e",(function(){return s})),t.d(a,"l",(function(){return i})),t.d(a,"s",(function(){return l})),t.d(a,"o",(function(){return m})),t.d(a,"j",(function(){return d})),t.d(a,"t",(function(){return b})),t.d(a,"r",(function(){return p})),t.d(a,"k",(function(){return f})),t.d(a,"b",(function(){return E})),t.d(a,"q",(function(){return h})),t.d(a,"p",(function(){return v})),t.d(a,"m",(function(){return g})),t.d(a,"a",(function(){return O})),t.d(a,"c",(function(){return y})),t.d(a,"n",(function(){return A})),t.d(a,"u",(function(){return j}));var n="COLLAPSE_MENU",r="COLLAPSE_TOGGLE",c="FULL_SCREEN",o="FULL_SCREEN_EXIT",u="CHANGE_LAYOUT",s="CHANGE_SUB_LAYOUT",i="LAYOUT_TYPE",l="RESET",m="NAV_BACK_COLOR",d="HEADER_BACK_COLOR",b="RTL_LAYOUT",p="NAV_FIXED_LAYOUT",f="HEADER_FIXED_LAYOUT",E="BOX_LAYOUT",h="NAV_CONTENT_LEAVE",v="NAV_COLLAPSE_LEAVE",g="LOGIN",O="ACTUALIZAR_PERMISOS_Y_MENU",y="CAMBIO_PASSWORD",A="LOGOUT",j="UPDATE_USER_INFO"},70:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(28),o=t.n(c),u=t(25),s=t(47),i=t(22);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var l=t(33),m=t(3),d=t(6),b=t(16),p=Object(m.a)({isOpen:[],isTrigger:[]},b.a,{isFullScreen:!1,logged:!1}),f=function(){var e,a,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,n=arguments.length>1?arguments[1]:void 0,r=[],c=[];switch(n.type){case d.f:return Object(m.a)({},t,{collapseMenu:!t.collapseMenu});case d.g:if("sub"===n.menu.type){c=t.isOpen;var o=(r=t.isTrigger).indexOf(n.menu.id);o>-1&&(c=c.filter((function(e){return e!==n.menu.id})),r=r.filter((function(e){return e!==n.menu.id}))),-1===o&&(c=[].concat(Object(l.a)(c),[n.menu.id]),r=[].concat(Object(l.a)(r),[n.menu.id]))}else{c=t.isOpen;var u=t.isTrigger.indexOf(n.menu.id);r=-1===u?[n.menu.id]:[],c=-1===u?[n.menu.id]:[]}return Object(m.a)({},t,{isOpen:c,isTrigger:r});case d.q:return Object(m.a)({},t,{isOpen:c,isTrigger:r});case d.p:if("sub"===n.menu.type){c=t.isOpen;var s=(r=t.isTrigger).indexOf(n.menu.id);return s>-1&&(c=c.filter((function(e){return e!==n.menu.id})),r=r.filter((function(e){return e!==n.menu.id}))),Object(m.a)({},t,{isOpen:c,isTrigger:r})}return Object(m.a)({},t);case d.h:return Object(m.a)({},t,{isFullScreen:!t.isFullScreen});case d.i:return Object(m.a)({},t,{isFullScreen:!1});case d.d:return Object(m.a)({},t,{layout:n.layout});case d.e:return Object(m.a)({},t,{subLayout:n.subLayout});case d.l:return Object(m.a)({},t,{layoutType:n.layoutType,headerBackColor:p.headerBackColor});case d.o:return Object(m.a)({},t,{layoutType:"menu-light"===t.layoutType?"menu-dark":t.layoutType});case d.j:return Object(m.a)({},t,{headerBackColor:n.headerBackColor});case d.t:return Object(m.a)({},t,{rtlLayout:!t.rtlLayout});case d.r:return Object(m.a)({},t,{navFixedLayout:!t.navFixedLayout});case d.k:return Object(m.a)({},t,{headerFixedLayout:!t.headerFixedLayout,headerBackColor:t.headerFixedLayout||"header-default"!==p.headerBackColor?t.headerBackColor:"header-blue"});case d.b:return Object(m.a)({},t,{boxLayout:!t.boxLayout});case d.s:return Object(m.a)({},t,{layout:p.layout,subLayout:p.subLayout,collapseMenu:p.collapseMenu,layoutType:p.layoutType,headerBackColor:p.headerBackColor,rtlLayout:p.rtlLayout,navFixedLayout:p.navFixedLayout,headerFixedLayout:p.headerFixedLayout,boxLayout:p.boxLayout});case d.m:return Object(m.a)({},t,{token:n.payload.token||"",userInfo:n.payload.userInfo||{},menu:n.payload.menu||[],accesos:n.payload.accesos||[],logged:n.payload.logged||!1,forzar_cambio_password:(null===(e=n.payload.userInfo)||void 0===e?void 0:e.forzar_cambio_password)||!1});case d.a:return Object(m.a)({},t,{menu:n.payload.menu||[],accesos:n.payload.accesos||[]});case d.c:return Object(m.a)({},t,{forzar_cambio_password:!1});case d.n:return Object(m.a)({},t,{token:"",userInfo:{},menu:[],accesos:[],logged:!1,forzar_cambio_password:!1});case d.u:return Object(m.a)({},t,{userInfo:n.payload.userInfo||{},menu:n.payload.menu||[],accesos:n.payload.accesos||[],logged:n.payload.logged||!1,forzar_cambio_password:(null===(a=n.payload.userInfo)||void 0===a?void 0:a.forzar_cambio_password)||!1});default:return t}},E=(t(36),t(74)),h=t(75),v=t(53),g=t(49),O=t.n(g),y=t(42),A=t(5),j=t.n(A),w=t(10),N=t(13),I=t(73),k=t(26),x=t(21),M=t(14),T=t(50),R=t.n(T),C=t(20),L=t.n(C),G=t(29),D=t(23),F=t(11),U=t(9),B=t(18),S=function(e){var a=e.history,t=(e.location,Object(i.c)()),c=Object(i.d)((function(e){return e})).logged,o=Object(n.useState)(!1),u=Object(N.a)(o,2),s=u[0],l=u[1],d=Object(D.a)({user_name:"BLOPEZ",password:"blopez",recordarme:!1}),p=Object(N.a)(d,4),f=p[0],E=p[3],h=function(){var e=Object(w.a)(j.a.mark((function e(a){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.preventDefault(),l(!0),t(Object(G.b)(f)),l(!1);case 4:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){!0===c&&a.replace(b.a.defaultPath)}),[c]),window.history.pushState(null,"",window.location.href),window.onpopstate=function(){window.history.pushState(null,"",window.location.href)},Object(n.useEffect)((function(){t(Object(G.b)())}),[]),r.a.createElement(M.a,null,r.a.createElement(F.ValidationForm,{onSubmit:h,onErrorSubmit:function(e,a,t){Object(U.c)("Por favor complete la informaci\xf3n solicitada")}},r.a.createElement("div",{className:"auth-wrapper align-items-stretch aut-bg-img"},r.a.createElement("div",{className:"flex-grow-1"},r.a.createElement("div",{className:"h-100 d-md-flex align-items-center auth-side-img"},r.a.createElement("div",{className:"col-sm-10 auth-content w-auto"},r.a.createElement("img",{src:R.a,alt:"",className:"img-fluid"}),r.a.createElement("h1",{className:"text-white my-4"},"Bienvenido Nombre de la empresa"),r.a.createElement("h4",{className:"text-white font-weight-normal"},"Inicie sesi\xf3n con su cuenta y explore el sistema"))),r.a.createElement("div",{className:"auth-side-form"},r.a.createElement("div",{className:" auth-content"},r.a.createElement("img",{src:L.a,alt:"",className:"img-fluid mb-4 d-block d-xl-none d-lg-none"}),r.a.createElement("h3",{className:"mb-4 f-w-400"},"Iniciar Sesi\xf3n"),!0===s?r.a.createElement(B.a,null):r.a.createElement(r.a.Fragment,null,r.a.createElement(k.a.Row,null,r.a.createElement(k.a.Group,{as:x.a,md:"12"},r.a.createElement(F.TextInput,{name:"user_name",id:"user_name",required:!0,errorMessage:"Por favor ingrese el nombre de usuario",value:f.user_name,onChange:function(e){var a=e.target.value,t=String(a).trim().toUpperCase();E(Object(m.a)({},f,{user_name:t}))},placeholder:"Nombre de Usuario",autoComplete:"off",type:"text"})),r.a.createElement(k.a.Group,{as:x.a,md:"12"},r.a.createElement(F.TextInput,{name:"password",id:"password",required:!0,value:f.password,onChange:function(e){var a=e.target.value;E(Object(m.a)({},f,{password:a}))},errorMessage:"Por favor ingrese su contrase\xf1a",placeholder:"Contrase\xf1a",autoComplete:"off",type:"password"}))),r.a.createElement("div",{className:"form-group text-left mt-2"},r.a.createElement("div",{className:"checkbox checkbox-primary d-inline"},r.a.createElement("input",{type:"checkbox",name:"checkbox-p-1",id:"checkbox-p-1",checked:f.recordarme,onChange:function(){E(Object(m.a)({},f,{recordarme:!f.recordarme}))}}),r.a.createElement("label",{htmlFor:"checkbox-p-1",className:"cr"},"Recordarme"))),r.a.createElement("button",{className:"btn btn-block btn-primary mb-0",type:"submit"},"Ingresar"),r.a.createElement("div",{className:"text-center"},r.a.createElement("p",{className:"mb-2 text-muted"},r.a.createElement(I.a,{to:"/auth/reset-password",className:"f-w-400"},"\xbfHas olvidado la contrase\xf1a?"))))))))))},Z=t(46),W=t(45),Y=function(e){return r.a.createElement(M.a,null,r.a.createElement("div",{className:"auth-wrapper"},r.a.createElement("div",{className:"blur-bg-images"}),r.a.createElement("div",{className:"auth-content"},r.a.createElement("div",{className:"card"},r.a.createElement(W.a,e)))))},J=t(15),Q=function(e){var a=e.history,t=Object(n.useState)(""),c=Object(N.a)(t,2),o=c[0],u=c[1],s=Object(n.useState)(!1),i=Object(N.a)(s,2),l=i[0],m=i[1],d=function(){var e=Object(w.a)(j.a.mark((function e(t){var n;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),m(!0),e.next=4,Object(J.a)("resetpassword",{method:"POST",body:JSON.stringify({email:o})});case 4:(n=e.sent)&&(Object(U.b)(n),u(""),a.replace("/auth/login")),m(!1);case 7:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return r.a.createElement(M.a,null,r.a.createElement("div",{className:"auth-wrapper"},r.a.createElement("div",{className:"auth-content"},r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"row align-items-center text-center"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement("div",{className:"card-body"},!0===l?r.a.createElement(B.a,null):r.a.createElement(r.a.Fragment,null,r.a.createElement("h4",{className:"mb-3 f-w-400"},"Restablecer Contrase\xf1a"),r.a.createElement("img",{src:L.a,alt:"",className:"img-fluid mb-4"}),r.a.createElement(F.ValidationForm,{onSubmit:d,onErrorSubmit:function(e,a,t){Object(U.c)("Por favor complete la informaci\xf3n solicitada")}},r.a.createElement(k.a.Row,null,r.a.createElement(k.a.Group,{as:x.a,md:"12"},r.a.createElement(F.TextInput,{name:"email",id:"email",required:!0,errorMessage:{required:"Por favor ingrese el correo electr\xf3nico registrado",type:"El correo electr\xf3nico no es v\xe1lido"},value:o,onChange:function(e){var a=e.target.value;u(a)},placeholder:"Correo electr\xf3nico registrado",autoComplete:"off",type:"email"})),r.a.createElement(k.a.Group,{as:x.a,md:"6"},r.a.createElement("button",{className:"btn btn-block btn-danger mb-4",onClick:function(){a.replace("/auth/login")}},"Cancelar")),r.a.createElement(k.a.Group,{as:x.a,md:"6"},r.a.createElement("button",{className:"btn btn-block btn-primary mb-4"},"Restablecer"))))))))))))},V=function(e){return r.a.createElement(Q,e)},z=t(19),P=function(e){var a=e.match,t=e.history,c=a.params.id,o=Object(n.useState)(!1),u=Object(N.a)(o,2),s=u[0],i=u[1],l=Object(D.a)({id:c,password:"",password_confirmar:""}),d=Object(N.a)(l,4),b=d[0],p=d[3],f=function(e){var a=e.target,t=a.name,n=a.value;p(Object(m.a)({},b,Object(z.a)({},t,n)))},E=function(){var e=Object(w.a)(j.a.mark((function e(a){var n;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),i(!0),e.next=4,Object(J.a)("resetpassword",{method:"PUT",body:JSON.stringify(b)});case 4:(n=e.sent)&&(Object(U.b)(n),t.replace("/auth/login")),i(!1);case 7:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return r.a.createElement(M.a,null,r.a.createElement("div",{className:"auth-wrapper"},r.a.createElement("div",{className:"auth-content"},r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"row align-items-center text-center"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement("div",{className:"card-body"},!0===s?r.a.createElement(B.a,null):r.a.createElement(r.a.Fragment,null,r.a.createElement("img",{src:L.a,alt:"",className:"img-fluid mb-4"}),r.a.createElement("h4",{className:"mb-3 f-w-400"},"Actualizar Contrase\xf1a"),r.a.createElement(F.ValidationForm,{onSubmit:E,onErrorSubmit:function(e,a,t){Object(U.c)("Por favor complete la informaci\xf3n solicitada")}},r.a.createElement(k.a.Row,null,r.a.createElement(k.a.Group,{as:x.a,md:"12"},r.a.createElement(F.TextInput,{name:"password",id:"password",type:"password",placeholder:"Nueva Contrase\xf1a",required:!0,pattern:"(?=.*[A-Z]).{6,}",errorMessage:{required:"Ingrese la nueva contrase\xf1a",pattern:"La contrase\xf1a debe de tener al menos 6 caracteres y contener al menos una letra may\xfascula"},value:b.password,onChange:f,autoComplete:"off"})),r.a.createElement(k.a.Group,{as:x.a,md:"12"},r.a.createElement(F.TextInput,{name:"password_confirmar",id:"password_confirmar",type:"password",placeholder:"Confirmar Nueva Contrase\xf1a",required:!0,validator:function(e){return e&&e===b.password},errorMessage:{required:"Por favor confirme la nueva contrase\xf1a",validator:"La contrase\xf1a no coincide"},value:b.password_confirmar,onChange:f,autoComplete:"off"})),r.a.createElement(k.a.Group,{as:x.a,md:"6"},r.a.createElement("button",{className:"btn btn-block btn-danger mb-4",onClick:function(){t.replace("/auth/login")}},"Cancelar")),r.a.createElement(k.a.Group,{as:x.a,md:"6"},r.a.createElement("button",{className:"btn btn-block btn-primary mb-4"},"Actualizar"))))))))))))},H=function(e){return r.a.createElement(P,e)},_=O()({loader:function(){return Promise.all([t.e(14),t.e(20)]).then(t.bind(null,585))},loading:y.a}),X=function(){return r.a.createElement(E.a,{basename:b.a.basename},r.a.createElement(h.a,null,r.a.createElement(v.a,{exact:!0,path:"/",component:S}),r.a.createElement(v.a,{exact:!0,path:"/auth/login",component:S}),r.a.createElement(v.a,{exact:!0,path:"/auth/reset-password",component:V}),r.a.createElement(v.a,{exact:!0,path:"/admin/change-password",component:Y}),r.a.createElement(v.a,{exact:!0,path:"/auth/update-password/:id",component:H}),r.a.createElement(v.a,{path:"/base",component:_}),r.a.createElement(v.a,{component:Z.default})))},q="undefined"!==typeof window&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||u.c,K=Object(u.d)(f,q(Object(u.a)(s.a))),$=r.a.createElement(i.a,{store:K},r.a.createElement(X,null));o.a.render($,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,a,t){"use strict";t.d(a,"b",(function(){return r})),t.d(a,"a",(function(){return c})),t.d(a,"c",(function(){return o}));var n=t(30),r=function(e){var a=n.a.success({title:"Informaci\xf3n!",text:e,hide:!0,icon:!0,delay:2e3,animation:"fade",mouseReset:!0,modules:{Buttons:{closer:!0,sticker:!0}}});a.on("click",(function(){a.close()}))},c=function(e){var a=n.a.error({title:"Error!",text:e,hide:!0,icon:!0,delay:2e3,animation:"fade",mouseReset:!0,modules:{Buttons:{closer:!0,sticker:!0}}});a.on("click",(function(){a.close()}))},o=function(e){var a=n.a.notice({title:"Advertencia!",text:e,hide:!0,icon:!0,delay:2e3,animation:"fade",mouseReset:!0,modules:{Buttons:{closer:!0,sticker:!0}}});a.on("click",(function(){a.close()}))}}},[[57,6,12]]]);
//# sourceMappingURL=main.f98486b3.chunk.js.map