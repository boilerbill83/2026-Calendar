const PTO_LIMIT=112;
const months=[{year:2026,month:8,name:"September"},{year:2026,month:9,name:"October"},{year:2026,month:10,name:"November"},{year:2026,month:11,name:"December"}];

const schoolDates=new Set([
"2026-10-19","2026-10-20","2026-10-21","2026-10-22","2026-10-23",
"2026-11-25","2026-11-26","2026-11-27",
"2026-12-21","2026-12-22","2026-12-23","2026-12-24","2026-12-25"
]);;

const companyHolidays=new Set(["2026-09-07","2026-11-26","2026-11-27","2026-12-25"]);

const robertsonOff=new Set([
"2026-10-06",
"2026-10-12","2026-10-13","2026-10-14","2026-10-15","2026-10-16",
"2026-12-28","2026-12-29","2026-12-30","2026-12-31"
]);

// Mandatory work training. PTO cannot be taken on these dates.
const trainingDates=new Set([
"2026-10-12","2026-10-13","2026-10-14","2026-10-15"
]);

// PI Planning. PTO cannot be taken on these dates.
const piPlanningDates=new Set([
"2026-12-07","2026-12-08","2026-12-09","2026-12-10"
]);

// Working from home instead of the office.
const wfhDates=new Set([
"2026-09-14","2026-09-15","2026-09-16","2026-09-17"
]);

// Colts regular-season games, Sep-Dec 2026.
const coltsGames={
"2026-09-13":{opp:"BAL",time:"1p",home:true},
"2026-09-20":{opp:"KC",time:"8:20p",home:false},
"2026-09-27":{opp:"HOU",time:"1p",home:true},
"2026-10-04":{opp:"WAS",time:"9:30a",home:false},
"2026-10-11":{opp:"PIT",time:"1p",home:false},
"2026-10-18":{opp:"TEN",time:"1p",home:true},
"2026-10-25":{opp:"MIN",time:"1p",home:false},
"2026-11-01":{opp:"JAX",time:"1p",home:false},
"2026-11-08":{opp:"DAL",time:"1p",home:true},
"2026-11-15":{opp:"MIA",time:"1p",home:true},
"2026-11-19":{opp:"HOU",time:"8:15p",home:false},
"2026-11-29":{opp:"NYG",time:"1p",home:true},
"2026-12-13":{opp:"PHI",time:"1p",home:false},
"2026-12-20":{opp:"TEN",time:"1p",home:false},
"2026-12-27":{opp:"CIN",time:"TBD",home:true}
};

// Starting proposed plan. December is intentionally tentative.
const defaultPTO=new Set([
"2026-10-19","2026-10-20","2026-10-21","2026-10-22","2026-10-23",
"2026-11-09","2026-11-10","2026-11-11",
"2026-11-23","2026-11-24",
"2026-12-28","2026-12-29","2026-12-30","2026-12-31"
]);;

const tentativeDates=new Set([
]);;

let pto=new Set(defaultPTO);
let vegasReserved=false;

function dateKey(y,m,d){return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function isOfficeDay(y,m,d){
  const dt=new Date(Date.UTC(y,m,d));
  const dow=dt.getUTCDay();
  return dow>=1 && dow<=3 && dateKey(y,m,d)<="2026-12-16";
}
function labelFor(key){
  if(trainingDates.has(key)) return "TRAINING";
  if(piPlanningDates.has(key)) return "PI PLANNING";
  if(pto.has(key)) return tentativeDates.has(key) ? "TENTATIVE PTO" : "PTO";
  if(wfhDates.has(key)) return "WFH";
  if(companyHolidays.has(key)) return "";
  if(isOfficeDay(...key.split("-").map(Number).map((v,i)=>i===1?v-1:v))) return "OFFICE";
  return "";
}
function badgesFor(key){
  let out="";
  if(schoolDates.has(key)) out+=`<span class="badge school" title="Girls out of school">S</span>`;
  if(robertsonOff.has(key)) out+=`<span class="badge robertson" title="Robertson Off">R</span>`;
  if(companyHolidays.has(key)) out+=`<span class="badge holiday" title="Company holiday">H</span>`;
  return out?`<span class="badges">${out}</span>`:"";
}
function gameTagFor(key){
  const g=coltsGames[key];
  if(!g) return "";
  const where=g.home?"vs":"@";
  return `<span class="game" title="${g.home?"Home":"Away"} game ${where} ${g.opp}, ${g.time}">${where} ${g.opp} ${g.time}</span>`;
}
function render(){
  const root=document.getElementById("calendar");
  root.innerHTML="";
  months.forEach(({year,month,name})=>{
    const box=document.createElement("section");
    box.className="month";
    box.innerHTML=`<h2>${name} ${year}</h2><div class="dow">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div>${x}</div>`).join("")}</div><div class="days"></div>`;
    const days=box.querySelector(".days");
    const first=new Date(Date.UTC(year,month,1)).getUTCDay();
    const count=new Date(Date.UTC(year,month+1,0)).getUTCDate();
    for(let i=0;i<first;i++){const b=document.createElement("div");b.className="day blank";days.appendChild(b);}
    for(let d=1;d<=count;d++){
      const key=dateKey(year,month,d), dt=new Date(Date.UTC(year,month,d)), dow=dt.getUTCDay();
      const el=document.createElement("button");
      el.type="button"; el.className="day";
      if(dow===0||dow===6)el.classList.add("weekend");
      if(isOfficeDay(year,month,d)&&!wfhDates.has(key)&&!companyHolidays.has(key))el.classList.add("office");
      if(wfhDates.has(key))el.classList.add("wfh");
      if(trainingDates.has(key))el.classList.add("training");
      if(piPlanningDates.has(key))el.classList.add("pi-planning");
      if(pto.has(key))el.classList.add("pto");
      if(tentativeDates.has(key)&&pto.has(key))el.classList.add("tentative");
      const tag=labelFor(key);
      el.innerHTML=`<span class="num">${d}</span>${badgesFor(key)}${tag?`<span class="tag">${tag}</span>`:""}${gameTagFor(key)}`;
      if(!companyHolidays.has(key)&&!trainingDates.has(key)&&!piPlanningDates.has(key))el.addEventListener("click",()=>togglePTO(key));
      days.appendChild(el);
    }
    root.appendChild(box);
  });
  updateStats();
}
function togglePTO(key){
  if(companyHolidays.has(key)||trainingDates.has(key)||piPlanningDates.has(key))return;
  if(pto.has(key))pto.delete(key);
  else{
    if(pto.size*8>=PTO_LIMIT){alert("All 112 PTO hours are already allocated.");return;}
    pto.add(key);
  }
  render();
}
function countOfficeDays(){
  let count=0;
  months.forEach(({year,month})=>{
    const days=new Date(Date.UTC(year,month+1,0)).getUTCDate();
    for(let d=1;d<=days;d++){
      const key=dateKey(year,month,d);
      if((isOfficeDay(year,month,d)||trainingDates.has(key)||piPlanningDates.has(key))&&!pto.has(key)&&!companyHolidays.has(key)&&!wfhDates.has(key))count++;
    }
  });
  return count;
}
function updateStats(){
  const used=pto.size*8;
  document.getElementById("balance").textContent=PTO_LIMIT-used;
  document.getElementById("used").textContent=used;
  document.getElementById("remaining").textContent=PTO_LIMIT-used;
  document.getElementById("days").textContent=pto.size;
  document.getElementById("officeDays").textContent=countOfficeDays();
}
document.getElementById("resetBtn").addEventListener("click",()=>{pto=new Set(defaultPTO);render();});
document.getElementById("vegasBtn").addEventListener("click",()=>{
  vegasReserved=!vegasReserved;
  document.getElementById("vegasBtn").textContent=vegasReserved?"Vegas day reserved ✓":"Reserve Vegas day";
});
render();
