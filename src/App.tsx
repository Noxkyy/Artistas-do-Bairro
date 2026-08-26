import { useEffect, useState } from "react";
import { Navbar, scrollToId } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Categories } from "./components/Categories";
import { ArtistsSection } from "./components/ArtistsSection";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { JoinArtists } from "./components/JoinArtists";
import { Footer } from "./components/Footer";
import { ArtistModal } from "./components/ArtistModal";
import { FloatingControls } from "./components/FloatingControls";
import { AuthModal } from "./components/AuthModal";
import { AccountPanel } from "./components/AccountPanel";
import { LegalModal } from "./components/LegalModal";
import { useTheme } from "./hooks/useTheme";
import { getSession } from "./lib/auth";
import type { Artist, CategoryId } from "./data/artists";
const FAV_KEY="artistas-do-bairro-favorites"; type LegalKind="terms"|"privacy"|"cookies";
export default function App(){
 const {theme,toggle}=useTheme(); const [query,setQuery]=useState(""); const [city,setCity]=useState("Todas as cidades"); const [category,setCategory]=useState<CategoryId>("todos"); const [authOpen,setAuthOpen]=useState(false); const [authMode,setAuthMode]=useState<"user"|"artist">("user"); const [accountOpen,setAccountOpen]=useState(false); const [logged,setLogged]=useState(!!getSession()); const [legal,setLegal]=useState<LegalKind|null>(null); const [selected,setSelected]=useState<Artist|null>(null);
 const [favorites,setFavorites]=useState<string[]>(()=>{try{return JSON.parse(window.localStorage.getItem(FAV_KEY)||"[]")}catch{return[]}});
 useEffect(()=>{try{window.localStorage.setItem(FAV_KEY,JSON.stringify(favorites))}catch{}},[favorites]);
 const toggleFavorite=(id:string)=>setFavorites(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]); const runSearch=()=>scrollToId("#artistas");
 return <div className="relative min-h-screen bg-bg text-ink"><ScrollProgress/><Navbar onLogin={()=>{setAuthMode("user");setAuthOpen(true)}} onArtistLogin={()=>{setAuthMode("artist");setAuthOpen(true)}} onAccount={()=>setAccountOpen(true)} loggedIn={logged}/><main><Hero query={query} setQuery={setQuery} city={city} setCity={setCity} onSearch={runSearch}/><Stats/><Categories active={category} onSelect={setCategory}/><ArtistsSection query={query} setQuery={setQuery} city={city} setCity={setCity} category={category} setCategory={setCategory} favorites={favorites} toggleFavorite={toggleFavorite} onOpen={setSelected}/><Process/><Testimonials/><JoinArtists/></main><Footer onLegal={setLegal}/><FloatingControls theme={theme} onToggle={toggle}/><ArtistModal artist={selected} favorite={selected?favorites.includes(selected.id):false} onToggleFavorite={toggleFavorite} onClose={()=>setSelected(null)}/><AuthModal open={authOpen} mode={authMode} onClose={()=>setAuthOpen(false)} onSuccess={()=>{setLogged(true);setAuthOpen(false);setAccountOpen(true)}}/><AccountPanel open={accountOpen} onClose={()=>setAccountOpen(false)} onLoggedOut={()=>setLogged(false)}/>{legal&&<LegalModal kind={legal} onClose={()=>setLegal(null)}/>}</div>;
}
function ScrollProgress(){const[pct,setPct]=useState(0);useEffect(()=>{let raf=0;const onScroll=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-window.innerHeight;setPct(h>0?(window.scrollY/h)*100:0)})};onScroll();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);cancelAnimationFrame(raf)}},[]);return <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"><div className="h-full bg-accent" style={{width:`${pct}%`}}/></div>}
