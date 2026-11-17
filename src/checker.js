
const $=s=>document.querySelector(s);
const S={pw:0,ph:0,w:0,h:0,u:"in",d:36,thumb:null,name:""};
const DIST=[[12,"Up close","1 ft"],[36,"Wall art","3 ft"],[96,"Across a room","8 ft"],[180,"Lobby or storefront","15 ft"]];
const PRE=[[8,10],[16,20],[24,36],[36,48],[48,96]];
const CAMS=[["Phone 12 MP",4032,3024],["Phone 48 MP",8064,6048],["DSLR 24 MP",6000,4000],["Mirrorless 45 MP",8192,5464]];
const TIERS=[[300,"Fine art"],[200,"Sharp"],[150,"Standard"],[100,"Large format"]];
const CM=2.54;
const toU=i=>S.u==="in"?i:i*CM, fromU=v=>S.u==="in"?v:v/CM;
const nf=n=>Math.round(n).toLocaleString("en-US");
const dec=n=>S.u==="in"?(Math.round(n*10)/10).toString():Math.round(n).toString();
const need=d=>Math.min(300,Math.max(30,Math.round(5000/d)));
const portrait=()=>S.ph>S.pw;

DIST.forEach((d,i)=>{const b=document.createElement("button");b.className="chip";b.dataset.d=d[0];b.textContent=d[1]+" · "+d[2];b.onclick=()=>{S.d=d[0];paint()};$("#dst").appendChild(b)});
PRE.forEach((p,i)=>{const b=document.createElement("button");b.className="chip";b.onclick=()=>{S.w=portrait()?p[0]:p[1];S.h=portrait()?p[1]:p[0];fill();paint()};b.dataset.i=i;$("#pre").appendChild(b)});
CAMS.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=c[0];b.onclick=()=>{$("#mw").value=c[1];$("#mh").value=c[2];manual()};$("#cams").appendChild(b)});

function fill(){$("#w").value=dec(toU(S.w));$("#h").value=dec(toU(S.h))}
function unit(u){S.u=u;$("#uin").setAttribute("aria-pressed",u==="in");$("#ucm").setAttribute("aria-pressed",u==="cm");fill();paint()}
$("#uin").onclick=()=>unit("in");$("#ucm").onclick=()=>unit("cm");
$("#w").oninput=e=>{const v=parseFloat(e.target.value);if(v>0){S.w=fromU(v);paint()}};
$("#h").oninput=e=>{const v=parseFloat(e.target.value);if(v>0){S.h=fromU(v);paint()}};

function begin(){
 if(!S.w){const P=window.PRESET||{},a=P.w||36,b=P.h||24,L=Math.max(a,b),T=Math.min(a,b);S.w=portrait()?T:L;S.h=portrait()?L:T}
 $("#res").style.display="block";fill();paint();
}
function manual(){
 const w=parseInt($("#mw").value),h=parseInt($("#mh").value);
 if(w>0&&h>0){S.pw=w;S.ph=h;S.thumb=null;S.name="";S.w=0;begin()}
}
$("#mw").oninput=manual;$("#mh").oninput=manual;

function load(f){
 const er=$("#err");er.textContent="";
 if(!f)return;
 if(!f.type.startsWith("image/")){er.textContent="That file isn’t an image. Choose a JPG, PNG, WebP or HEIC photo.";return}
 const r=new FileReader();
 r.onerror=()=>{er.textContent="We couldn’t read that file. Try another photo."};
 r.onload=()=>{
  const im=new Image();
  im.onerror=()=>{er.textContent="Your browser can’t open this format. Export it as JPG or PNG and try again."};
  im.onload=()=>{
   S.pw=im.naturalWidth;S.ph=im.naturalHeight;S.name=f.name;S.w=0;
   const k=Math.min(1,900/Math.max(S.pw,S.ph)),c=document.createElement("canvas");
   c.width=Math.round(S.pw*k);c.height=Math.round(S.ph*k);
   c.getContext("2d").drawImage(im,0,0,c.width,c.height);
   S.thumb=c.toDataURL("image/jpeg",.82);
   $("#mw").value=S.pw;$("#mh").value=S.ph;
   begin();$("#set").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
  };
  im.src=r.result;
 };
 r.readAsDataURL(f);
}
$("#file").onchange=e=>load(e.target.files[0]);
const dp=$("#drop");
["dragenter","dragover"].forEach(t=>dp.addEventListener(t,e=>{e.preventDefault();dp.classList.add("over")}));
["dragleave","drop"].forEach(t=>dp.addEventListener(t,e=>{e.preventDefault();dp.classList.remove("over")}));
dp.addEventListener("drop",e=>load(e.dataTransfer.files[0]));

function paint(){
 const ppi=Math.min(S.pw/S.w,S.ph/S.h),n=need(S.d),r=ppi/n;
 let cls="",t="",p="";
 if(r>=1){cls="";t="Sharp at this distance";p=ppi>=300?"This is print-lab perfect. No visible pixels, even up close.":"Detail will hold up well from where it will be seen."}
 else if(r>=.75){cls="ok";t="Looks clean";p="Very slightly soft if someone stands closer than planned. Fine for most uses."}
 else if(r>=.5){cls="soft";t="Soft up close";p="Fine from farther back, but visible softness when viewed closely. Consider upscaling or a smaller size."}
 else{cls="bad";t="Too low for this size";p="Pixels will show. Print smaller, view from farther away, or start from a higher-resolution file."}
 if(r<.75){p+=" For a sharp result at this size, aim for about "+nf(Math.ceil(S.w*n))+" × "+nf(Math.ceil(S.h*n))+" px."}
 $("#vd").className="card verdict "+cls;
 $("#ppi").textContent=nf(ppi);$("#vt").textContent=t;$("#vp").textContent=p;
 $("#mf").style.width=Math.min(100,ppi/4)+"%";
 $("#mk").style.left="calc("+Math.min(100,n/4)+"% - 1px)";
 $("#nl").textContent="Needed here: "+n;
 document.querySelectorAll("#dst .chip").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.d===S.d));
 document.querySelectorAll("#pre .chip").forEach(b=>{
  const a=PRE[b.dataset.i],x=portrait()?a[0]:a[1],y=portrait()?a[1]:a[0],u=S.u==="in"?"in":"cm";
  const lx=S.u==="in"?x:Math.round(x*CM),ly=S.u==="in"?y:Math.round(y*CM);
  b.textContent=lx+" × "+ly+" "+u;b.setAttribute("aria-pressed",Math.abs(S.w-x)<.01&&Math.abs(S.h-y)<.01);
 });
 const mp=(S.pw*S.ph/1e6).toFixed(1);
 let h="";
 TIERS.forEach(([q,l])=>{const a=S.pw/q,b=S.ph/q;h+="<tr><th>"+l+"<small>"+q+" pixels per inch</small></th><td>"+dec(toU(a))+" × "+dec(toU(b))+" "+S.u+"</td></tr>"});
 h+="<tr><th>Your file<small>"+(S.name?esc(S.name):"Entered manually")+"</small></th><td>"+nf(S.pw)+" × "+nf(S.ph)+" px<small>"+mp+" MP</small></td></tr>";
 $("#tb").innerHTML=h;
 scene();
 $("#qd").placeholder="Location, quantity, deadline, budget";
}
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

function scene(){
 const W=S.w,H=S.h,FW=20,FH=70,gap=14,m=16;
 const b=Math.max(0,Math.min(40,96-H));
 const tw=m+FW+gap+W+m,th=Math.max(H+b,FH)+m+8;
 const fy=th-8,px=m+FW+gap,py=fy-b-H,fx=m;
 const img=S.thumb?'<image href="'+S.thumb+'" x="'+px+'" y="'+py+'" width="'+W+'" height="'+H+'" preserveAspectRatio="xMidYMid slice"/>':'<rect x="'+px+'" y="'+py+'" width="'+W+'" height="'+H+'" fill="var(--line)"/>';
 $("#sv").innerHTML='<svg class="scale" viewBox="0 0 '+tw+' '+th+'" role="img" aria-label="Your print shown next to a person for scale">'
 +'<rect x="'+(px-1.2)+'" y="'+(py-1.2)+'" width="'+(W+2.4)+'" height="'+(H+2.4)+'" fill="var(--surf)" stroke="var(--line)" stroke-width=".6"/>'+img
 +'<rect x="0" y="'+fy+'" width="'+tw+'" height="8" fill="var(--line)"/>'
 +'<g fill="var(--ink)"><circle cx="'+(fx+FW/2)+'" cy="'+(fy-FH+5.5)+'" r="5.5"/><rect x="'+fx+'" y="'+(fy-FH+13)+'" width="'+FW+'" height="'+(FH-13)+'" rx="8"/></g></svg>';
 $("#sc").textContent="Shown beside a person 5′10″ (178 cm) tall. The print is "+dec(toU(W))+" × "+dec(toU(H))+" "+S.u+".";
}

window.PPCTX=()=>S.pw?{print_size:dec(toU(S.w))+" × "+dec(toU(S.h))+" "+S.u,file_pixels:nf(S.pw)+" × "+nf(S.ph)+" px",pixels_per_inch:$("#ppi").textContent,viewing_distance:(DIST.find(d=>d[0]===S.d)||[0,""])[1]}:{};
if(window.PRESET){const P=window.PRESET;if(P.d)S.d=P.d;if(P.pw){$("#mw").value=P.pw;$("#mh").value=P.ph;$("#up details").open=true;manual()}}
