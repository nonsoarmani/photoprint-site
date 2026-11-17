(function(){
const $=s=>document.querySelector(s),D=window.CALC;
const money=n=>"$"+(Math.round(n/50)*50).toLocaleString("en-US");
let type="home",tier="standard",wc=true;
const mk=(id,obj,cur,set)=>{const el=$(id);el.innerHTML="";Object.entries(obj).forEach(([k,v])=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v.name;b.setAttribute("aria-pressed",k===cur());b.onclick=()=>{set(k);run()};el.appendChild(b)})};
function run(){
 mk("#ct",D.types,()=>type,k=>type=k);mk("#cr",D.tiers,()=>tier,k=>tier=k);
 $("#cw").setAttribute("aria-pressed",wc);
 const t=D.tiers[tier];let lo=0,hi=0,rows="",lines=[];
 D.types[type].items.forEach(([n,a,b])=>{
  if(!wc&&/Working capital/.test(n))return;
  const l=a+t.a*(b-a),h=a+t.b*(b-a);lo+=l;hi+=h;
  rows+="<tr><th>"+n+"</th><td>"+money(l)+" to "+money(h)+"</td></tr>";lines.push(n+": "+money(l)+" to "+money(h));
 });
 $("#cb").innerHTML=rows;
 $("#ctot").textContent=money(lo)+" to "+money(hi);
 window.CALC_SUMMARY={calc_business:D.types[type].name,calc_tier:t.name,calc_total:money(lo)+" to "+money(hi),calc_breakdown:lines.join("; ")};
}
$("#cw").onclick=()=>{wc=!wc;run()};
$("#cgo").onclick=()=>{const q=$("#qt");if(q)q.value="equip";$("#quote").scrollIntoView({behavior:"smooth",block:"start"})};
window.PPCTX=()=>window.CALC_SUMMARY||{};
run();
})();
