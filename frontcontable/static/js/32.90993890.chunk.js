(this.webpackJsonpapibase=this.webpackJsonpapibase||[]).push([[32],{570:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(5),o=a.n(r),s=a(10),l=a(13),i=a(71),u=a(21),m=a(367),d=a(386),f=a(246),b=a(22),p=a(95),E=a.n(p),v=a(96),h=a.n(v),O=a(14),j=a(15),I=a(9),g=a(584),x=a(26),y=a(11),N=a(29),w=a(23),k=a(18),A=function(e){var t=e.dataInicial,a=e.abrirModal,r=e.setAbrirModal,i=e.GetAccesos,m=Object(b.c)(),d=Object(n.useState)(!1),f=Object(l.a)(d,2),p=f[0],E=f[1],v=Object(w.a)(t),h=Object(l.a)(v,2),O=h[0],A=h[1],C=function(){var e=Object(s.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(j.a)("acceso",{method:"POST",body:JSON.stringify(O)});case 2:e.sent&&(Object(I.b)("Acceso registrado exitosamente"),i(),r(!1));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),S=function(){var e=Object(s.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(j.a)("acceso",{method:"PUT",body:JSON.stringify(O)});case 2:(t=e.sent)&&(Object(I.b)(t),m(Object(N.a)()),i()),r(!1);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),T=function(){var e=Object(s.a)(o.a.mark((function e(a){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a.preventDefault(),E(!0),!(t.accesoId>0)){e.next=7;break}return e.next=5,S();case 5:e.next=9;break;case 7:return e.next=9,C();case 9:E(!1);case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return c.a.createElement(g.a,{show:a,onHide:function(){return r(!1)}},!0===p?c.a.createElement(k.a,null):c.a.createElement(c.a.Fragment,null,c.a.createElement(g.a.Header,{closeButton:!0},c.a.createElement(g.a.Title,{as:"h5"},t.accesoId>0?"Actualizar Acceso":"Nuevo Acceso")),c.a.createElement(g.a.Body,null,c.a.createElement(y.ValidationForm,{onSubmit:T,onErrorSubmit:function(e,t,a){Object(I.c)("Por favor complete toda la informaci\xf3n solicitada por el formulario")}},c.a.createElement(x.a.Row,null,c.a.createElement(x.a.Group,{as:u.a,md:"12"},c.a.createElement(x.a.Label,{htmlFor:"descripcion"},"Descripci\xf3n"),c.a.createElement(y.TextInput,{name:"descripcion",id:"descripcion",required:!0,value:O.descripcion,onChange:A,errorMessage:"Campo obligatorio",placeholder:"Descripci\xf3n",autoComplete:"off",style:{textTransform:"capitalize"},type:"text"})),t.accesoId>0&&c.a.createElement(x.a.Group,{as:u.a,md:"12"},c.a.createElement(x.a.Label,{htmlFor:"estadoId"},"Estado"),c.a.createElement(y.SelectGroup,{name:"estadoId",id:"estadoId",value:O.estadoId,required:!0,errorMessage:"Campo obligatorio",onChange:A},c.a.createElement("option",{value:""},"Seleccione un estado"),c.a.createElement("option",{value:"1"},"Activo"),c.a.createElement("option",{value:"2"},"Inactivo"))),c.a.createElement("div",{className:"col-sm-3"}),c.a.createElement("div",{className:"col-sm-3"},c.a.createElement("button",{type:"button",onClick:function(){r(!1)},className:"btn btn-warning"}," Cancelar")),c.a.createElement("div",{className:"col-sm-3"},c.a.createElement("button",{type:"submit",className:"btn btn-success"}," ",t.accesoId>0?"Actualizar":"Registrar")))))))},C=a(84),S=function(){var e=Object(b.d)((function(e){return e})),t=Object(b.c)(),a=Object(n.useState)(!0),r=Object(l.a)(a,2),p=r[0],v=r[1],g=Object(n.useState)([]),x=Object(l.a)(g,2),y=x[0],w=x[1],S=Object(n.useState)(!1),T=Object(l.a)(S,2),M=T[0],z=T[1],B=Object(n.useState)([]),D=Object(l.a)(B,2),F=D[0],G=D[1],q={accesoId:"",descripcion:"",estadoId:1},H=Object(n.useState)(q),J=Object(l.a)(H,2),L=J[0],P=J[1],R=function(){var e=Object(s.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!y.find((function(e){return 3===e.accesoId}))){e.next=7;break}return v(!0),e.next=4,Object(j.a)("acceso?estadoId=1;2");case 4:(t=e.sent)&&G(t),v(!1);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){!function(){if(null===e||void 0===e?void 0:e.accesos){var t=e.accesos.filter((function(e){return 1===e.menuId}));w(t)}v(!1)}()}),[]),Object(n.useEffect)((function(){R()}),[y]),c.a.createElement(O.a,null,c.a.createElement(i.a,{className:"btn-page"},c.a.createElement(u.a,{sm:12},c.a.createElement(m.a,null,c.a.createElement(m.a.Header,null,c.a.createElement(m.a.Title,{as:"h5"},"Listado de accesos")),c.a.createElement(m.a.Body,null,!0===p?c.a.createElement(k.a,null):c.a.createElement(c.a.Fragment,null,c.a.createElement(i.a,{className:"align-items-center m-l-0"},c.a.createElement(u.a,null),c.a.createElement(u.a,{className:"text-right"},y.find((function(e){return 1===e.accesoId}))&&c.a.createElement(d.a,{variant:"success",className:"btn-sm btn-round has-ripple",onClick:function(){z(!0),P(q)}},c.a.createElement("i",{className:"feather icon-plus"})," Agregar Acceso"))),y.find((function(e){return 3===e.accesoId}))?c.a.createElement(f.a,{striped:!0,hover:!0,responsive:!0,bordered:!0,id:"mytable"},c.a.createElement("thead",null,c.a.createElement("tr",null,c.a.createElement("th",null,"C\xf3digo"),c.a.createElement("th",null,"Descripci\xf3n"),c.a.createElement("th",null,"Estado"),y.find((function(e){return 2===e.accesoId||4===e.accesoId}))&&c.a.createElement("th",null))),c.a.createElement("tbody",null,F.map((function(e){var a=e.accesoId,n=e.descripcion,r=e.Estado.descripcion;return c.a.createElement("tr",{key:a},c.a.createElement("td",null,a),c.a.createElement("td",null,n),c.a.createElement("td",null,r),y.find((function(e){return 2===e.accesoId||4===e.accesoId}))&&c.a.createElement("td",{style:{textAlign:"center"}},y.find((function(e){return 2===e.accesoId}))&&c.a.createElement("button",{className:"btn-icon btn btn-info btn-sm",onClick:function(){!function(e){var t=F.find((function(t){return t.accesoId===e})),a=t.accesoId,n=t.descripcion,c=t.estadoId;P({accesoId:a,descripcion:n,estadoId:c}),z(!0)}(a)}},c.a.createElement("i",{className:"feather icon-edit"})),y.find((function(e){return 4===e.accesoId}))&&c.a.createElement("button",{className:"btn-icon btn btn-danger btn-sm",onClick:function(){var e;e=a,h()(E.a).fire({title:"Alerta?",text:"Esta seguro que desea eliminar el elemento",type:"warning",showCloseButton:!0,showCancelButton:!0}).then(function(){var a=Object(s.a)(o.a.mark((function a(n){var c,r;return o.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(!n.value){a.next=8;break}return a.next=4,Object(j.a)("acceso/".concat(e),{method:"DELETE"});case 4:(c=a.sent)&&(Object(I.b)(c),t(Object(N.a)()),r=F.filter((function(t){return t.accesoId!==e})),G(r)),a.next=9;break;case 8:Object(I.c)("No se elimin\xf3 ning\xfan elemento");case 9:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}())}},c.a.createElement("i",{className:"feather icon-trash-2"}))))})))):c.a.createElement(C.a,null)),!0===M&&c.a.createElement(A,{abrirModal:M,setAbrirModal:z,GetAccesos:R,dataInicial:L}))))))};t.default=function(){return c.a.createElement(S,null)}},84:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var n=a(0),c=a.n(n),r=a(71),o=a(21),s=a(583),l=a(14),i=function(){return c.a.createElement(l.a,null,c.a.createElement(r.a,null,c.a.createElement(o.a,null,c.a.createElement(s.a,{variant:"danger"},c.a.createElement(s.a.Heading,{as:"h4"},"Informaci\xf3n!"),c.a.createElement("p",null,"No esta autorizado para poder visualizar los elementos"),c.a.createElement("hr",null),c.a.createElement("p",{className:"mb-0"},"Comuniquese con el administrador para la asignaci\xf3n de permisos")))))}}}]);
//# sourceMappingURL=32.90993890.chunk.js.map