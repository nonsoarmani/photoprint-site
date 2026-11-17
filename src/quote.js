(function(){
const $=s=>document.querySelector(s),f=$("#qf");if(!f)return;
const S=window.SITE||{},P=window.PRESET||{};
if(P.intent)$("#qt").value=P.intent;
document.querySelectorAll(".next").forEach(b=>b.onclick=()=>{$("#qt").value=b.dataset.i;$("#quote").scrollIntoView({behavior:"smooth",block:"start"})});
const L={print:"Print project",lab:"Wholesale lab",equip:"Equipment"};
f.onsubmit=async e=>{
 e.preventDefault();
 if($("#qh").value)return;
 const st=$("#qs"),btn=f.querySelector("button[type=submit]"),ctx=window.PPCTX?window.PPCTX():{};
 const d=Object.assign({access_key:S.formKey,subject:"photoprint.io lead: "+L[$("#qt").value],from_name:"photoprint.io",email:$("#qe").value,lead_type:L[$("#qt").value],budget:$("#qb").value,timeline:$("#qm").value,company:$("#qc").value,country:$("#qy").value,details:$("#qd").value,source_page:location.pathname,consent:"Agreed to share request with partners"},ctx);
 if(!d.access_key||d.access_key.indexOf("PASTE")===0){st.textContent="Form not connected yet. Add your form key in site.config.js.";return}
 btn.disabled=true;st.textContent="Sending…";
 try{
  const r=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)});
  const j=await r.json();
  if(!j.success)throw 0;
  st.textContent="Thanks. We’ve received your request and will reply by email.";f.reset();
 }catch(x){st.textContent="Something went wrong. Please try again, or email "+S.email+".";}
 btn.disabled=false;
};
})();
