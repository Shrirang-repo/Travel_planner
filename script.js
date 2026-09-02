const DEMO_REELS=[
  {id:1,title:"Best wazwan you'll ever have",place:"Ahdoos Restaurant, Srinagar",city:"Kashmir",cat:"food",lat:34.0837,lng:74.7973,url:"https://instagram.com/reel/demo1"},
  {id:2,title:"Floating houseboat stay on Dal Lake",place:"Dal Lake Houseboat, Srinagar",city:"Kashmir",cat:"stay",lat:34.1073,lng:74.8395,url:"https://instagram.com/reel/demo2"},
  {id:3,title:"Must visit — Gulmarg meadows at sunrise",place:"Gulmarg, Kashmir",city:"Kashmir",cat:"sightseeing",lat:34.0494,lng:74.3805,url:"https://instagram.com/reel/demo3"},
  {id:4,title:"Palolem beach shack — fresh catch daily",place:"Palolem Beach, Goa",city:"Goa",cat:"food",lat:15.0100,lng:74.0230,url:"https://instagram.com/reel/demo4"},
  {id:5,title:"Sunset view from Dudhsagar trail",place:"Dudhsagar Falls, Goa",city:"Goa",cat:"sightseeing",lat:15.3144,lng:74.3147,url:"https://instagram.com/reel/demo5"},
  {id:6,title:"Best chai and maggi before Rohtang",place:"Old Manali Café",city:"Manali",cat:"food",lat:32.2432,lng:77.1892,url:"https://instagram.com/reel/demo6"},
  {id:7,title:"Snow trek to Solang Valley",place:"Solang Valley, Manali",city:"Manali",cat:"sightseeing",lat:32.3192,lng:77.1554,url:"https://instagram.com/reel/demo7"}
];

function loadReels(){
  const saved=localStorage.getItem("trm_reels");
  if(saved){
    try{return JSON.parse(saved);}catch(e){return [...DEMO_REELS];}
  }
  return [...DEMO_REELS];
}

function saveReels(){
  localStorage.setItem("trm_reels",JSON.stringify(reels));
}

let reels=loadReels();
let nextId=Math.max(100,...reels.map(r=>r.id+1));
let activeFilter="all";
let selectedId=null;
let markers={};

const map=L.map("map").setView([22.5,80],4.5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);

function catColor(cat){
  if(cat==="food")return{pin:"#BA7517",bg:"#FAEEDA",text:"#633806"};
  if(cat==="stay")return{pin:"#185FA5",bg:"#E6F1FB",text:"#0C447C"};
  return{pin:"#3B6D11",bg:"#EAF3DE",text:"#27500A"};
}

function catLabel(cat){
  if(cat==="food")return"Food";
  if(cat==="stay")return"Stay";
  return"Sightseeing";
}

function makeIcon(cat){
  const c=catColor(cat);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="${c.pin}"/><circle cx="14" cy="14" r="6" fill="white"/></svg>`;
  return L.divIcon({html:svg,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]});
}

function addMarker(reel){
  const m=L.marker([reel.lat,reel.lng],{icon:makeIcon(reel.cat)}).addTo(map);
  const c=catColor(reel.cat);
  m.bindPopup(`<div style="min-width:180px;font-family:sans-serif"><div style="font-size:13px;font-weight:500;margin-bottom:4px">${reel.place}</div><div style="font-size:11px;color:#666;margin-bottom:6px">${reel.title}</div><span style="font-size:10px;padding:2px 8px;border-radius:20px;background:${c.bg};color:${c.text};font-weight:500">${catLabel(reel.cat)}</span><br/><a href="${reel.url}" target="_blank" style="font-size:11px;color:#378ADD;display:inline-block;margin-top:6px">Watch reel ↗</a></div>`);
  m.on("click",()=>selectReel(reel.id));
  markers[reel.id]=m;
}

function renderList(){
  const list=document.getElementById("reel-list");
  const empty=document.getElementById("empty-state");
  const search=document.getElementById("search-input").value.trim().toLowerCase();
  const visible=reels.filter(r=>{
    const matchCat=activeFilter==="all"||r.cat===activeFilter;
    const matchSearch=!search||r.city.toLowerCase().includes(search)||r.place.toLowerCase().includes(search)||r.title.toLowerCase().includes(search);
    return matchCat&&matchSearch;
  });
  list.innerHTML="";
  if(visible.length===0){empty.style.display="block";}else{empty.style.display="none";}
  visible.forEach(r=>{
    const c=catColor(r.cat);
    const div=document.createElement("div");
    div.className="reel-card"+(selectedId===r.id?" selected":"");
    div.dataset.id=r.id;
    div.innerHTML=`<div class="reel-title">${r.title}</div><div class="reel-place"><i class="ti ti-map-pin" style="font-size:11px;margin-right:3px"></i>${r.place}</div><span class="cat-badge" style="background:${c.bg};color:${c.text}">${catLabel(r.cat)}</span>`;
    div.addEventListener("click",()=>selectReel(r.id));
    list.appendChild(div);
  });
  Object.keys(markers).forEach(id=>{
    const show=visible.find(r=>r.id==id);
    if(show){map.addLayer(markers[id]);}else{map.removeLayer(markers[id]);}
  });
  if(search&&visible.length>0){
    const lats=visible.map(r=>r.lat);
    const lngs=visible.map(r=>r.lng);
    const pad=1.5;
    map.fitBounds([[Math.min(...lats)-pad,Math.min(...lngs)-pad],[Math.max(...lats)+pad,Math.max(...lngs)+pad]]);
  }
}

function selectReel(id){
  selectedId=id;
  const r=reels.find(x=>x.id===id);
  if(r){map.setView([r.lat,r.lng],12);markers[id]&&markers[id].openPopup();}
  renderList();
}

reels.forEach(r=>addMarker(r));
renderList();

document.querySelectorAll(".fbtn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".fbtn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter=btn.dataset.cat;
    renderList();
  });
});

document.getElementById("search-input").addEventListener("input",renderList);

const CITY_COORDS={
  kashmir:{lat:34.0837,lng:74.7973},goa:{lat:15.2993,lng:74.1240},
  manali:{lat:32.2432,lng:77.1892},mumbai:{lat:19.0760,lng:72.8777},
  delhi:{lat:28.6139,lng:77.2090},bangalore:{lat:12.9716,lng:77.5946},
  bengaluru:{lat:12.9716,lng:77.5946},jaipur:{lat:26.9124,lng:75.7873},
  kerala:{lat:10.8505,lng:76.2711},ladakh:{lat:34.1526,lng:77.5771}
};

function geocodePlace(placeName){
  const key=placeName.toLowerCase().trim();
  for(const k in CITY_COORDS){if(key.includes(k))return CITY_COORDS[k];}
  return null;
}

function setStatus(msg,color){
  const el=document.getElementById("status-msg");
  el.textContent=msg;
  el.style.color=color||"var(--text-secondary)";
}

function showManualForm(prefill){
  const mf=document.getElementById("manual-form");
  mf.style.display="flex";
  if(prefill){
    if(prefill.title)document.getElementById("m-title").value=prefill.title;
    if(prefill.place)document.getElementById("m-place").value=prefill.place;
    if(prefill.city)document.getElementById("m-city").value=prefill.city;
  }
}

async function getOrPromptApiKey(){
  let apiKey=localStorage.getItem("trm_api_key");
  if(!apiKey){
    apiKey=prompt("Enter your Anthropic API key (stored only in this browser's localStorage):");
    if(apiKey)localStorage.setItem("trm_api_key",apiKey.trim());
  }
  return apiKey;
}

document.getElementById("add-btn").addEventListener("click",async()=>{
  const url=document.getElementById("url-input").value.trim();
  if(!url){setStatus("Paste a reel URL first","var(--text-danger)");return;}
  const btn=document.getElementById("add-btn");
  btn.disabled=true;
  setStatus("Analyzing reel...");
  const apiKey=await getOrPromptApiKey();
  if(!apiKey){
    setStatus("No API key found — enter details manually","var(--text-secondary)");
    showManualForm({title:url.split("/").pop()||"My reel"});
    btn.disabled=false;
    return;
  }
  try{
    const resp=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:400,
        system:"You are a travel reel location extractor. Given a URL or title, infer the likely travel location. Return ONLY valid JSON, no markdown, no explanation. Keys: title (string, describe what reel is about in <8 words), place (specific place name), city (city or region), country (country), cat (one of: food, stay, sightseeing), lat (number), lng (number), desc (one line what to expect).",
        messages:[{role:"user",content:`Extract location from this reel URL: ${url}`}]
      })
    });
    const data=await resp.json();
    const raw=data.content?.find(b=>b.type==="text")?.text||"";
    const clean=raw.replace(/```json|```/g,"").trim();
    const parsed=JSON.parse(clean);
    const coords=geocodePlace(parsed.city)||geocodePlace(parsed.place)||{lat:parsed.lat,lng:parsed.lng};
    const newReel={id:nextId++,title:parsed.title||"Travel reel",place:parsed.place||parsed.city,city:parsed.city,cat:parsed.cat||"sightseeing",lat:coords.lat,lng:coords.lng,url};
    reels.push(newReel);
    addMarker(newReel);
    selectReel(newReel.id);
    renderList();
    saveReels();
    document.getElementById("url-input").value="";
    setStatus("Pinned: "+newReel.place,"#3B6D11");
  }catch(e){
    setStatus("Could not extract automatically — fill in manually","var(--text-secondary)");
    showManualForm({});
  }
  btn.disabled=false;
});

document.getElementById("manual-submit").addEventListener("click",()=>{
  const title=document.getElementById("m-title").value.trim();
  const place=document.getElementById("m-place").value.trim();
  const city=document.getElementById("m-city").value.trim();
  const cat=document.getElementById("m-cat").value;
  const url=document.getElementById("url-input").value.trim();
  if(!place||!city){setStatus("Enter place and city","var(--text-danger)");return;}
  const coords=geocodePlace(city)||geocodePlace(place)||{lat:20.5937,lng:78.9629};
  const newReel={id:nextId++,title:title||place,place,city,cat,lat:coords.lat+(Math.random()-0.5)*0.08,lng:coords.lng+(Math.random()-0.5)*0.08,url:url||"#"};
  reels.push(newReel);
  addMarker(newReel);
  selectReel(newReel.id);
  renderList();
  saveReels();
  document.getElementById("manual-form").style.display="none";
  document.getElementById("m-title").value="";
  document.getElementById("m-place").value="";
  document.getElementById("m-city").value="";
  document.getElementById("url-input").value="";
  setStatus("Pinned: "+newReel.place,"#3B6D11");
});
