window.commentOnPost=function(a){const e=a.dataset.content;console.log("commentOnPost called with content:",e);const o=document.getElementById("comments-section");o?(console.log("Found comments section, scrolling..."),o.scrollIntoView({behavior:"smooth"})):(console.log("Comments section not found, scrolling to bottom..."),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})),setTimeout(()=>{console.log("Trying to find textarea...");const t=document.querySelector(".el-textarea__inner")||document.querySelector("#twikoo textarea")||document.querySelector("textarea");t&&e?(console.log("Found textarea:",t),t.value=`> ${e}

`,t.focus(),t.dispatchEvent(new Event("input",{bubbles:!0})),console.log("Content filled into textarea")):(console.log("Textarea not found, trying again..."),setTimeout(()=>{const s=document.querySelector(".el-textarea__inner")||document.querySelector("textarea");s&&e?(console.log("Found textarea on retry:",s),s.value=`> ${e}

`,s.focus(),s.dispatchEvent(new Event("input",{bubbles:!0})),console.log("Content filled into textarea on retry")):console.log("Textarea still not found")},500))},800)};async function f(){const a=document.getElementById("essays-container");if(!(!a||a.dataset.needsFetch!=="true"))try{console.log("Client-side fetching Ech0 posts...");const e=await fetch("https://say.allen2030.com/rss");if(!e.ok)throw new Error(`Failed to fetch: ${e.status}`);const o=await e.text();console.log("Client-side RSS response length:",o.length);const t=b(o);console.log("Client-side parsed entries:",t.length),t.length>0&&y(t)}catch(e){console.error("Client-side fetch error:",e)}}function b(a){const e=/<entry>([\s\S]*?)<\/entry>/g,o=[];let t=null;for(;t=e.exec(a),t!==null;){const s=t[1],l=s.match(/<updated>([\s\S]*?)<\/updated>/),m=l?l[1]:"",n=s.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);let g=(n?n[1]:"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");const u=[],h=/<img[^>]+src="([^"]+)"/g;let c=null;for(;c=h.exec(g),c!==null;)u.push(c[1]);const v=g.replace(/<[^>]*>/g,"").trim(),d=[],p=/<category[^>]*term="([^"]+)"/g;let i=null;for(;i=p.exec(s),i!==null;)d.push(i[1]);const x=new Date(m).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});o.push({content:v||"[图片]",time:x,images:u,tags:d})}return o}function y(a){const e=document.getElementById("essays-container");if(!e)return;const o=document.querySelector(".essay-item img"),t=document.querySelector(".essay-item .font-medium"),s=o?o.src:"/favicon/favicon-light-128.png",l=t?t.textContent:"Allen",m=a.map((n,w)=>{const h=[...(n.content.match(/#[^\s#]+/g)||[]).map(r=>r.replace("#","")),...n.tags||[]],c=[...new Set(h)].slice(0,3),v=c.length>0,d=n.content.replace(/#[^\s#]+/g,"").trim(),p=n.images&&n.images.length>0?`
                <div class="essay-images mb-3">
                    <div class="grid gap-2 ${n.images.length===1?"grid-cols-1":"grid-cols-2"}">
                        ${n.images.slice(0,4).map((r,x)=>`
                            <div class="rounded-lg overflow-hidden bg-[var(--btn-card-bg-hover)] aspect-video">
                                <img 
                                    src="${r}" 
                                    alt="瞬间图片 ${x+1}"
                                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    loading="lazy"
                                />
                            </div>
                        `).join("")}
                    </div>
                </div>
            `:"",i=v?c.map(r=>`<span class="px-2 py-1 bg-[var(--btn-card-bg-hover)] rounded-md text-xs text-75">${r}</span>`).join(""):'<span class="px-2 py-1 bg-[var(--btn-card-bg-hover)] rounded-md text-xs text-50">无标签</span>';return`
                <div class="essay-item break-inside-avoid bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--line-divider)] transition-all hover:shadow-md" style="animation-delay: ${w*.1}s">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden bg-[var(--btn-card-bg-hover)] flex-shrink-0">
                            <img 
                                src="${s}" 
                                alt="${l}"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1">
                                <span class="font-medium text-90 text-sm truncate">${l}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                            </div>
                            <div class="text-xs text-50">${n.time}</div>
                        </div>
                    </div>
                    
                    <div class="essay-content text-90 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                        ${d}
                    </div>
                    
                    ${p}
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1 flex-wrap">
                            ${i}
                        </div>
                        
                        <button 
                            class="flex items-center gap-1 text-xs text-75 hover:text-primary transition-colors p-1 rounded hover:bg-[var(--btn-card-bg-hover)]"
                            data-content="${n.content.replace(/"/g,"&quot;")}"
                            onclick="window.commentOnPost(this)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `}).join("");e.innerHTML=m}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{f()}):f();setTimeout(f,100);
