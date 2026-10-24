import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import witchImg from "@/assets/witch.png";
import cauldronImg from "@/assets/cauldron.png";
import cottageImg from "@/assets/cottage.jpg";
import { WITCHES, CAULDRONS, sessionReward, canBuy, type Item } from "@/lib/game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cadı Kulübesi — Cozy İksir Pomodoro" },
      { name: "description", content: "Odaklan, pixel cadın iksir pişirsin. İksir topla, yeni cadılar ve kazanlar aç." },
      { property: "og:title", content: "Cadı Kulübesi — Cozy İksir Pomodoro" },
      { property: "og:description", content: "Pomodoro ile iksir kazan, yeni cadılar ve kazanlar aç." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Phase = "idle" | "brewing" | "done" | "spilled";
const KEY = "witch-pomodoro-v1";
type Save = { potions: number; witches: string[]; cauldrons: string[]; witch: string; cauldron: string };
const DEFAULT: Save = { potions: 0, witches: ["sage"], cauldrons: ["iron"], witch: "sage", cauldron: "iron" };

function Index() {
  const [save, setSave] = useState<Save>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [left, setLeft] = useState(25 * 60);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tab, setTab] = useState<"witch" | "cauldron">("witch");
  const startRef = useRef(0);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setSave({ ...DEFAULT, ...JSON.parse(s) }); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(save)); }, [save, loaded]);

  useEffect(() => {
    if (phase !== "brewing") return;
    const t = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(t);
          setPhase("done");
          setSave((s) => ({ ...s, potions: s.potions + sessionReward(true, minutes * 60) }));
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, minutes]);

  const start = () => { setLeft(minutes * 60); startRef.current = Date.now(); setPhase("brewing"); };
  const takeBreak = () => {
    const elapsed = minutes * 60 - left;
    setSave((s) => ({ ...s, potions: s.potions + sessionReward(false, elapsed) }));
    setPhase("spilled");
  };
  const reset = () => { setPhase("idle"); setLeft(minutes * 60); };
  const pick = (m: number) => { setMinutes(m); setLeft(m * 60); };

  const witch = WITCHES.find((w) => w.id === save.witch)!;
  const cauldron = CAULDRONS.find((c) => c.id === save.cauldron)!;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const progress = 1 - left / (minutes * 60);

  const buyOrEquip = (item: Item, kind: "witch" | "cauldron") => {
    const ownedKey = kind === "witch" ? "witches" : "cauldrons";
    setSave((s) => {
      if (s[ownedKey].includes(item.id)) return { ...s, [kind]: item.id };
      if (!canBuy(s.potions, item, s[ownedKey])) return s;
      return { ...s, potions: s.potions - item.price, [ownedKey]: [...s[ownedKey], item.id], [kind]: item.id };
    });
  };

  const items = tab === "witch" ? WITCHES : CAULDRONS;
  const owned = tab === "witch" ? save.witches : save.cauldrons;
  const equipped = tab === "witch" ? save.witch : save.cauldron;

  return (
    <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${cottageImg})` }}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="flex items-center justify-between">
          <h1 className="font-pixel text-3xl text-primary md:text-4xl">Cadı Kulübesi</h1>
          <div className="pixel-box flex items-center gap-2 px-4 py-2 font-pixel text-xl">
            <span className="text-potion">⚗</span> {save.potions % 1 === 0 ? save.potions : save.potions.toFixed(1)} iksir
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="pixel-box flex flex-col items-center p-6">
            <div className="relative flex h-64 items-end justify-center gap-0">
              <img src={witchImg} alt="Pixel cadı" width={816} height={816}
                className={`h-56 w-56 ${phase === "brewing" ? "anim-stir" : ""}`} style={{ filter: witch.filter }} />
              <div className="relative -ml-10">
                <img src={cauldronImg} alt="Kazan" width={816} height={816} className="h-40 w-40" style={{ filter: cauldron.filter }} />
                {phase === "brewing" && [0, 1, 2].map((i) => (
                  <span key={i} className="anim-bubble absolute top-6 h-3 w-3 bg-potion"
                    style={{ left: `${35 + i * 15}%`, animationDelay: `${i * 0.5}s` }} />
                ))}
              </div>
              {(phase === "done" || phase === "spilled") && (
                <div className="absolute -right-4 bottom-0 flex flex-col items-center">
                  <div className={`relative h-16 w-10 border-4 border-foreground ${phase === "spilled" ? "anim-spill" : "anim-pop"}`}>
                    <div className="absolute bottom-0 w-full bg-potion" style={{ height: phase === "done" ? "85%" : "40%" }} />
                  </div>
                  {phase === "spilled" && <div className="mt-1 h-2 w-20 bg-potion opacity-70" />}
                </div>
              )}
            </div>

            <p className="mt-2 h-7 text-center text-muted-foreground">
              {phase === "idle" && "Kazan hazır. Odaklanmaya başla..."}
              {phase === "brewing" && "Cadın iksir karıştırıyor ✦"}
              {phase === "done" && "Tebrikler! Bir şişe tam iksir kazandın!"}
              {phase === "spilled" && "Ayy! Şişe devrildi, yarısı döküldü... +0.5 iksir"}
            </p>

            <div className="my-4 font-pixel text-7xl tracking-widest">{mm}:{ss}</div>
            <div className="mb-5 h-4 w-full max-w-sm border-2 border-border bg-muted">
              <div className="h-full bg-potion transition-all" style={{ width: `${progress * 100}%` }} />
            </div>

            {phase === "idle" && (
              <div className="mb-4 flex gap-2">
                {[15, 25, 50].map((m) => (
                  <button key={m} onClick={() => pick(m)}
                    className={`pixel-btn px-3 py-1 ${minutes === m ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m} dk
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              {phase === "idle" && <button onClick={start} className="pixel-btn bg-secondary px-6 py-2 text-xl text-secondary-foreground">Pişirmeye Başla</button>}
              {phase === "brewing" && <button onClick={takeBreak} className="pixel-btn bg-accent px-6 py-2 text-xl text-accent-foreground">Molaya Çık</button>}
              {(phase === "done" || phase === "spilled") && <button onClick={reset} className="pixel-btn bg-primary px-6 py-2 text-xl text-primary-foreground">Yeni İksir</button>}
            </div>
          </div>

          <aside className="pixel-box flex flex-col p-5">
            <h2 className="mb-3 font-pixel text-2xl text-primary">İksir Dükkanı</h2>
            <div className="mb-4 flex gap-2">
              {(["witch", "cauldron"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`pixel-btn flex-1 py-1 ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {t === "witch" ? "Cadılar" : "Kazanlar"}
                </button>
              ))}
            </div>
            <ul className="flex flex-col gap-2">
              {items.map((item) => {
                const has = owned.includes(item.id);
                const on = equipped === item.id;
                return (
                  <li key={item.id} className="flex items-center gap-3 border-2 border-border bg-muted/60 p-2">
                    <img src={tab === "witch" ? witchImg : cauldronImg} alt="" loading="lazy" width={816} height={816}
                      className="h-12 w-12" style={{ filter: item.filter }} />
                    <span className="flex-1 leading-tight">{item.name}</span>
                    <button onClick={() => buyOrEquip(item, tab)} disabled={on || (!has && save.potions < item.price)}
                      className={`pixel-btn px-2 py-1 text-sm ${has ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
                      {on ? "Seçili" : has ? "Seç" : `${item.price} ⚗`}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
