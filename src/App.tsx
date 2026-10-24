import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlareHover from './components/react-bits/GlareHover';
import TiltedCard from './components/react-bits/TiltedCard';
import { albums, artwork, asset, members, parseRoute, profileAlbums, project, portraits, type Album, type Photo } from './data';
gsap.registerPlugin(ScrollTrigger);
const Arrow = ({ back = false }: { back?: boolean }) => <span aria-hidden="true">{back ? '↖' : '↗'}</span>;
function Mark() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 2h12v11H2zM18 2h12v11H18zM2 17h7v13H2zM13 17h7v13h-7zM24 17h6v13h-6z" fill="currentColor" /></svg>; }
function useLocationHash() {
  const [hash,setHash] = useState(window.location.hash);
  useEffect(() => { const fn=()=>setHash(window.location.hash); window.addEventListener('hashchange',fn); return ()=>window.removeEventListener('hashchange',fn); },[]);
  return hash;
}
function useReveal(key: string) {
  const scope = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx=gsap.context(() => {
        gsap.from('.entrance', {y:28,duration:.85,stagger:.08,ease:'power3.out',clearProps:'all'});
        gsap.from('.team-tile-motion', {y:42,rotationX:7,opacity:.25,duration:1.1,stagger:.08,ease:'power3.out',clearProps:'all'});
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el,i)=>gsap.from(el,{y:i%2?32:22,opacity:.65,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'all'}));
      }, scope);
      return ()=>ctx.revert();
    });
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.to('.exhibit-stage',{y:-35,scale:.94,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
        gsap.to('.ceiling-light',{x:60,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      },scope);
      return ()=>ctx.revert();
    });
    return ()=>media.revert();
  },[key]);
  return scope;
}
function Header({person=false}:{person?:boolean}) {
  const [open,setOpen]=useState(false);
  return <header className="site-header"><a className="wordmark" href="#/" onClick={()=>setOpen(false)} aria-label="九宫格，返回首页"><Mark/><span>南京九宫格<span className="wordmark-tail">文化传媒有限公司</span></span></a><button className="menu-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={()=>setOpen(!open)}>{open?'收起':'菜单'} <span aria-hidden="true">{open?'−':'+'}</span></button><nav id="primary-nav" className={open?'open':''} aria-label="主导航">{(person ? [['#/', '返回展厅'],['#/people/kong-ling','孔玲主页'],['#work','公司作品']] : [['#team','团队'],['#work','作品'],['#services','业务']]).map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}<a href="#contact" className="header-contact" onClick={()=>setOpen(false)}>联系 <Arrow/></a></nav></header>;
}
function TeamWall() {
  return <div className="team-wall" aria-label="五人团队，上排两人下排三人">{members.map((m,i)=><div key={m.id} className={'team-tile-motion tile-slot tile-slot-'+i}><a className={'team-tile '+(m.available?'available':'pending')} href={'#/people/'+m.id} aria-label={m.available?'孔玲，上排右侧，查看个人主页':m.location+'，成员资料待完善，查看预留主页'} style={{'--tile-index':i} as CSSProperties}><GlareHover width="100%" height="100%" borderRadius="0px" glareColor="#e4dac7" glareOpacity={.16} mode="follow" rimGlint={false} className="tile-glare"><div className="tile-crop"><img src={artwork} alt="" draggable={false} style={{width:100/m.w+'%',height:100/m.h+'%',left:-m.x/m.w*100+'%',top:-m.y/m.h*100+'%'}}/></div><div className="tile-label"><span><strong>{m.available?'孔玲':'待完善'}</strong><small>{m.available?'摄影 · 绘画 · 机车':m.location}</small></span><Arrow/></div></GlareHover></a></div>)}</div>;
}
function Home({openProject}:{openProject:()=>void}) {
  return <><section className="hero" id="team" aria-labelledby="home-title"><div className="ceiling-light" aria-hidden="true"/><div className="gallery-architecture" aria-hidden="true"><div className="wall-left"/><div className="wall-right"/><div className="gallery-floor"/></div><div className="exhibit-stage"><div className="wing wing-left entrance" aria-hidden="true"><img src={asset(project.images[0].src)} alt=""/><span>空间</span></div><div className="center-exhibit"><TeamWall/><div className="exhibit-plinth" aria-hidden="true"/></div><div className="wing wing-right entrance" aria-hidden="true"><img src={asset(albums.find(a=>a.id==='qixia')!.images.at(-1)!.src)} alt=""/><span>影像</span></div></div><div className="hero-copy"><div><h1 id="home-title" className="entrance">九宫格</h1><p className="hero-services entrance"><span>平面设计</span><span aria-hidden="true">/</span><span>住宅空间</span><span aria-hidden="true">/</span><span>博物馆与展馆设计</span></p></div><div className="hero-actions entrance"><p>五个人，五种视角。<br/>把创意放进画面与空间。</p><a className="text-action" href="#work">浏览作品 <Arrow/></a></div></div><div className="hero-foot"><p>聚焦展板，认识我们 <span aria-hidden="true">↗</span></p><a href="#work" aria-label="向下浏览作品">向下探索 <span aria-hidden="true">↓</span></a></div></section>
  <section className="work-section content-section" id="work" aria-labelledby="work-title"><div className="section-heading reveal"><h2 id="work-title">让想法，有形。</h2><p>从一张平面，到一个空间。<br/>在项目里，看见设计的落点。</p></div><div className="project-layout"><button onClick={openProject} className="project-picture reveal" aria-label="查看陳宅项目详情"><img src={asset(project.images[0].src)} alt="陳宅住宅空间：客厅与玻璃隔断" width="375" height="200" loading="lazy"/><span className="picture-action">走进项目 <Arrow/></span></button><div className="project-description reveal"><h3>陳宅</h3><p className="category">住宅空间</p><p>客厅、餐厅与书房，<br/>在通透的边界中彼此连接。</p><p className="project-credit">项目名称：陳宅 _ 分子設計<br/>公司参与项目</p><button className="text-action" onClick={openProject}>查看项目 <Arrow/></button></div><img className="project-detail-picture reveal" src={asset(project.images[7].src)} alt="陳宅室内：通透隔断与书桌" width="375" height="200" loading="lazy"/></div></section>
  <section className="services-section content-section" id="services" aria-labelledby="services-title"><div className="section-heading reveal"><h2 id="services-title">在画面之外，<br/>也在空间之中。</h2><p>南京九宫格文化传媒有限公司<br/>五人团队，连接不同尺度的设计。</p></div><div className="service-lines">{[['平面设计','图形、文字与视觉表达'],['住宅空间','居住场景与空间体验'],['博物馆与展馆','展览叙事与空间表达']].map(([title,desc])=><div className="service-line reveal" key={title}><h3>{title}</h3><p>{desc}</p><span aria-hidden="true">↗</span></div>)}</div></section>
  <section className="person-teaser content-section" aria-labelledby="person-title"><a className="teaser-picture reveal" href="#/people/kong-ling"><img src={asset('media/portraits/01.jpg')} alt="孔玲举起相机拍摄" width="959" height="640" loading="lazy"/></a><div className="teaser-copy reveal"><h2 id="person-title">画面背后的人。</h2><p>孔玲，南京人。<br/>喜欢画画、摄影和机车。</p><p>跟随镜头，看看设计之外的日常。</p><a className="text-action" href="#/people/kong-ling">走进孔玲的主页 <Arrow/></a></div></section>
  <Contact/></>;
}
function Contact(){return <section className="contact-section content-section" id="contact" aria-labelledby="contact-title"><div className="reveal"><h2 id="contact-title">下一个想法，<br/>从这里开始。</h2><p>南京九宫格文化传媒有限公司 · 南京</p></div><div className="contact-note reveal"><p>联系方式整理中</p><p>微信与邮箱将在资料完善后补充。</p><a className="text-action" href="#team">回到展厅 <span aria-hidden="true">↑</span></a></div></section>;}
function Person({id,onAlbum,onProject}:{id:string;onAlbum:(a:Album)=>void;onProject:()=>void}){
  const [filter,setFilter]=useState('all');
  const member=members.find(m=>m.id===id);
  if(!member || !member.available) return <section className="pending-page content-section"><a className="text-action" href="#team"><Arrow back/> 返回五人展厅</a><div className="pending-layout"><div className="pending-art"><img src={artwork} alt="五人团队油画" style={{width:member?100/member.w+'%':'100%',height:member?100/member.h+'%':'100%',left:member?-member.x/member.w*100+'%':'0',top:member?-member.y/member.h*100+'%':'0'}}/></div><div><h1>{member?'还没介绍，<br/>先打个照面。':'这位成员尚未加入。'}</h1><p>{member?.location || '成员入口不存在'}</p><p>成员姓名、介绍与作品正在整理中。<br/>这个位置已经留好，期待稍后与你见面。</p><a className="text-action" href="#/people/kong-ling">先认识孔玲 <Arrow/></a></div></div></section>;
  const filtered=profileAlbums.filter(a=>a.category!=='portrait' && (filter==='all'||a.category===filter));
  return <><section className="profile-hero content-section"><div className="profile-intro"><a className="text-action entrance" href="#team"><Arrow back/> 返回五人展厅</a><h1 className="entrance">孔玲</h1><p className="profile-statement entrance">用画笔，也用镜头。</p><p className="entrance">南京人。喜欢画画、摄影与机车。<br/>这里收集个人照片、旅行影像和参与的项目。</p><a className="text-action entrance" href="#/people/kong-ling/albums/portraits">个人照片 <Arrow/></a></div><div className="profile-portrait entrance"><TiltedCard imageSrc={asset('media/portraits/05.webp')} altText="孔玲的侧脸肖像" containerWidth="100%" containerHeight="100%" imageWidth="100%" imageHeight="100%" radius={0} rotateAmplitude={4} scaleOnHover={1.02} gyroscope={false} floating={false} intro={false} showTooltip={false} glare={.12} shadow={0} flipOnClick={false}/></div></section>
  <section className="profile-works content-section"><div className="section-heading reveal"><h2>参与的项目</h2><p>从个人视角，回到设计现场。</p></div><button className="profile-project reveal" onClick={onProject}><img src={asset(project.images[3].src)} alt="陳宅住宅空间" width="375" height="200" loading="lazy"/><span><strong>陳宅</strong><small>住宅空间 · 公司参与项目</small></span><Arrow/></button></section>
  <section className="album-section content-section"><div className="section-heading reveal"><h2>镜头与日常</h2><p>摄影、观展，还有机车。<br/>喜欢的事物，也构成观察世界的方式。</p></div><div className="filter-bar" aria-label="相册分类">{[['all','全部'],['photography','摄影'],['visit','观展'],['inspiration','兴趣收藏']].map(([value,label])=><button key={value} className={filter===value?'active':''} onClick={()=>setFilter(value)} aria-pressed={filter===value}>{label}</button>)}</div><div className="album-grid">{filtered.map((a,i)=><button className={'album-cover album-'+i} key={a.id} onClick={()=>onAlbum(a)}><div className="album-image"><img src={asset(a.images[0].src)} alt={a.title} loading="lazy"/><span className="album-open" aria-hidden="true">↗</span></div><div className="album-caption"><h3>{a.title}</h3><p>{a.description}</p><span>{a.images.length} 张</span></div></button>)}</div></section>
  <section className="portrait-strip content-section"><div className="section-heading reveal"><h2>关于这个人</h2><a className="text-action" href="#/people/kong-ling/albums/portraits">查看全部肖像 <Arrow/></a></div><div className="portraits-row">{[portraits.images[6],portraits.images[0],portraits.images[3]].map((p,i)=><button key={p.src} onClick={()=>onAlbum(portraits)} className="reveal" aria-label={'打开个人照片，第'+(i+1)+'张预览'}><img src={asset(p.src)} alt={['街头肖像','举起相机','人物特写'][i]} loading="lazy"/></button>)}</div></section><Contact/></>;
}
function GalleryDialog({title,description,photos,onClose,isProject=false}:{title:string;description:string;photos:Photo[];onClose:()=>void;isProject?:boolean}){
  const dialogRef=useRef<HTMLDialogElement>(null);
  const [index,setIndex]=useState(0);
  const [showGrid,setShowGrid]=useState(true);
  const touch=useRef<{x:number;y:number}|null>(null);
  const photoRef=useRef<HTMLDivElement>(null);
  const move=(offset:number)=>setIndex(i=>(i+offset+photos.length)%photos.length);
  useEffect(()=>{const d=dialogRef.current!;const focused=document.activeElement as HTMLElement|null;d.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{d.close();document.body.style.overflow=overflow;if(focused?.isConnected)focused.focus();};},[]);
  useEffect(()=>{if(showGrid)return;photoRef.current?.focus();const key=(e:KeyboardEvent)=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setIndex(i=>(i+(e.key==='ArrowRight'?1:-1)+photos.length)%photos.length);}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);},[showGrid,photos.length]);
  return <dialog ref={dialogRef} className="gallery-dialog" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dialog-shell"><header className="dialog-header"><div><h2>{title}</h2><p>{isProject?'住宅空间 · 公司参与项目':description}</p></div><div className="dialog-actions"><button onClick={()=>setShowGrid(!showGrid)}>{showGrid?'单张浏览':'缩略图'}</button><button className="close-button" onClick={onClose} aria-label="关闭图库">关闭 <span aria-hidden="true">×</span></button></div></header>{isProject && <p className="dialog-project-note">项目名称：陳宅 _ 分子設計。具体参与内容待补充。</p>}{showGrid?<div className="dialog-grid">{photos.map((p,i)=><button key={p.src} onClick={()=>{setIndex(i);setShowGrid(false);}} aria-label={'放大第'+(i+1)+'张图片'}><img src={asset(p.src)} alt={p.alt} loading="lazy"/></button>)}</div>:<div className="single-view"><div className="single-photo" ref={photoRef} tabIndex={0} role="group" aria-label="图片浏览区，左右方向键切换" onTouchStart={e=>{touch.current={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x;const dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);touch.current=null;}}><img src={asset(photos[index].src)} alt={photos[index].alt}/></div><div className="gallery-controls"><button onClick={()=>move(-1)} aria-label="上一张">←</button><p aria-live="polite">{index+1} / {photos.length}</p><button onClick={()=>move(1)} aria-label="下一张">→</button></div></div>}</div></dialog>;
}
export default function App(){
  const hash=useLocationHash();
  const route=parseRoute(hash);
  const routeKey=route.page==='person'?'person-'+route.person:'home';
  const scope=useReveal(routeKey);
  const previousKey=useRef(routeKey);
  const modalBack=useRef<string|null>(null);
  const [cookie,setCookie]=useState(false);
  useEffect(()=>{
    document.title=route.page==='person'?(route.person==='kong-ling'?'孔玲 · 个人作品与影像':'团队成员 · 九宫格'):'九宫格 · 五个人的创意展厅';
    if(previousKey.current!==routeKey){window.scrollTo({top:0,behavior:'instant'});previousKey.current=routeKey;}
    if(route.page==='home'&&route.section){requestAnimationFrame(()=>document.getElementById(route.section!)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));}
    if(hash==='#/' || hash==='')window.scrollTo({top:0,behavior:'instant'});
  },[hash,routeKey,route.page,route.page==='home'?route.section:undefined]);
  const openHash=(next:string)=>{modalBack.current=window.location.hash||'#/';window.location.hash=next;};
  const close=()=>{const target=modalBack.current||(route.page==='person'?'#/people/'+route.person:'#work');modalBack.current=null;window.history.replaceState(null,'',target);window.dispatchEvent(new HashChangeEvent('hashchange'));};
  const activeAlbum=route.page==='person'&&route.person==='kong-ling'?profileAlbums.find(a=>a.id===route.album):undefined;
  const activeProject=route.project==='chen-residence' && (route.page==='home'||route.person==='kong-ling');
  return <div ref={scope} className="app"><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();const main=document.getElementById("main-content");main?.focus();main?.scrollIntoView();}}>跳到主要内容</a><Header person={route.page==='person'}/><main id="main-content" tabIndex={-1}>{route.page==='home'?<Home openProject={()=>openHash('#/projects/chen-residence')}/>:<Person key={route.person} id={route.person!} onAlbum={a=>openHash('#/people/kong-ling/albums/'+a.id)} onProject={()=>openHash('#/people/kong-ling/projects/chen-residence')}/>}</main><footer className="site-footer"><a href="#/" className="footer-wordmark"><Mark/>九宫格</a><p>南京九宫格文化传媒有限公司</p><span>设计 · 空间 · 影像</span><button className="credits-toggle" onClick={()=>setCookie(!cookie)} aria-expanded={cookie}>素材说明</button>{cookie&&<p className="credits-note">团队群像为AI生成的艺术形象。项目与照片由用户提供，照片保留原有署名；机车图片为兴趣收藏。交互组件使用React Bits，动画使用GSAP。</p>}</footer>{activeAlbum&&<GalleryDialog key={activeAlbum.id} title={activeAlbum.title} description={activeAlbum.description} photos={activeAlbum.images} onClose={close}/ >}{activeProject&&<GalleryDialog title="陳宅" description="住宅空间" photos={project.images} onClose={close} isProject/>}</div>;
}
