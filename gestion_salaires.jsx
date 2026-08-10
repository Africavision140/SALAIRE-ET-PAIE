import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutGrid, Users, FileText, CreditCard, Wallet, Calendar,
  ClipboardList, Settings, Plus, Printer, Trash2, Pencil, X,
  Search, Upload, Building2, Check, AlertCircle
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PAIE REGISTRE — Africa Vision Multiservices                        */
/*  Gestion des salaires : employés, bulletins, avances, congés,       */
/*  cartes de travail et contrats.                                     */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "paie-registre:v1";

const DEVISES = [
  { code: "GNF", label: "Franc guinéen (GNF)" },
  { code: "XOF", label: "Franc CFA (XOF)" },
  { code: "USD", label: "Dollar américain (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "CNY", label: "Yuan chinois (CNY)" },
];

const DONNEES_INITIALES = {
  entreprise: {
    nom: "Africa Vision Multiservices",
    activite: "Cargo · Billetterie · Transit · Vente de véhicules",
    adresse: "Madina, centre commercial Diallo Sadakadji, 2e étage n° 034 — Commune de Matam, Conakry, Guinée",
    agence2: "Agence Sonfonia T7 — Conakry · Guangzhou Vision Multise Import and Export Ltd, 1221 Meibo Sports City, n° 202 Huanshi West Road, Yuexiu, Guangzhou (Chine)",
    telephone: "+224 625 81 36 46 / +224 612 39 83 18 · Chine : +86 132 4978 5587 / +86 198 7428 2632",
    email: "",
    rccm: "",
    nif: "",
    numCNSS: "",
    logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjEwIDYgODIgNjIiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iQWZyaWNhIFZpc2lvbiBNdWx0aXNlcnZpY2VzIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ib3IiIHgxPSIwIiB5MT0iMCIgeDI9IjAuMzUiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjRTZCRTU4Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41NSIgc3RvcC1jb2xvcj0iI0M5OUEzNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBODdDMjIiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8cGF0aCBkPSJNIDI5LjM2LDQ3LjM1IEEgMjUuNSwyNS41IDAgMCAxIDc2LjMwLDI3LjQzIiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjI5NUMiCiAgICAgICAgc3Ryb2tlLXdpZHRoPSIzLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0gNzguNDAsNDAuMDIgQSAyNS41LDI1LjUgMCAwIDEgNDYuNDAsNjIuNDMiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNvcikiCiAgICAgICAgc3Ryb2tlLXdpZHRoPSIzLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgoKICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MywxNikgcm90YXRlKC0yOCkgc2NhbGUoMC4xMjUpIj4KICAgIDxwYXRoIGQ9Ik0gMCwtNSBMIDM0LC01IEwgNDQsMCBMIDM0LDUgTCAwLDUKICAgICAgICAgICAgIEwgLTE0LDI2IEwgLTIyLDI2IEwgLTE2LDUgTCAtMzIsNSBMIC0zOCwxMyBMIC00NCwxMyBMIC00MCwwCiAgICAgICAgICAgICBMIC00NCwtMTMgTCAtMzgsLTEzIEwgLTMyLC01IEwgLTE2LC01IEwgLTIyLC0yNiBMIC0xNCwtMjYgWiIKICAgICAgICAgIGZpbGw9IiMxNjI5NUMiLz4KICA8L2c+CgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ3LjMsMjAuMSkgc2NhbGUoMC4yODUsMC4zMzApIj4KICAgIDxwYXRoIGQ9Ik0gMTguMjAsMS42MSBMIDIuMjUsMTcuNzEgTCAwLjIyLDMxLjc5IEwgNi41MiwzOS40NCBMIDEyLjEzLDQzLjA2IEwgMzAuNTYsNDIuMDUgTCAzOC42NSw0Ni4wOCBMIDM5LjEwLDUyLjExIEwgNDUuMzksNjQuNzkgTCA0Mi45Miw3My42NCBMIDUyLjM2LDk4LjE5IEwgNTQuMzgsOTkuODAgTCA2My44Miw5OC45OSBMIDcyLjEzLDkyLjE1IEwgNzYuNjMsODQuMzEgTCA3Ny4zMCw3OC44NyBMIDg0LjI3LDczLjQ0IEwgODMuNjAsNTguMzUgTCA5Ni4xOCw0Ni42OCBMIDk5LjU1LDM4LjQzIEwgOTAuMzQsMzcuNjMgTCA4Mi43MCwyOS45OCBMIDc1LjI4LDE3LjcxIEwgNzMuNDgsOS4wNSBMIDU3Ljc1LDYuNDQgTCA1MS4wMSw4LjI1IEwgNDIuOTIsNC42MyBMIDM5LjEwLDAuMDAgWiIgZmlsbD0idXJsKCNvcikiLz4KICA8L2c+CgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzE2Mjk1QyIKICAgICAgICBkPSJNIDI3LjMsMjEuMyBMIDE2LjQsNTkuOCBMIDQ1LjQsNTkuOCBMIDM0LjUsMjEuMyBaCiAgICAgICAgICAgTSAzMC45LDMwLjUgTCAyNC44LDQ2LjggTCAzNy4wLDQ2LjggWgogICAgICAgICAgIE0gMjQuMCw1MS44IEwgMjEuNyw1OS44IEwgNDAuMSw1OS44IEwgMzcuOCw1MS44IFoiLz4KCiAgPHBhdGggZD0iTSAzNC4yLDM4LjIgTCA0MS41LDM4LjIgTCA0NS4xNSw1NS4wIEwgNDguOCwzOC4yIEwgNTYuMSwzOC4yIEwgNDUuMTUsNjQuNCBaIgogICAgICAgIGZpbGw9InVybCgjb3IpIi8+Cjwvc3ZnPg==",
    signataire: "Bah Souleymane DT",
    fonction: "Directeur Général Adjoint",
  },
  parametres: {
    devise: "GNF",
    tauxCnssSalarie: 5,
    tauxCnssPatronal: 18,
    plafondCnss: 2500000,
    joursMois: 30,
    tranchesRts: [
      { plafond: 1000000, taux: 0 },
      { plafond: 3000000, taux: 5 },
      { plafond: 5000000, taux: 8 },
      { plafond: 10000000, taux: 10 },
      { plafond: null, taux: 15 },
    ],
  },
  employes: [],
  bulletins: [],
  avances: [],
  conges: [],
  contrats: [],
};

/* ----------------------------- utilitaires ----------------------------- */

const MOIS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
  "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const n = (v) => {
  const x = parseFloat(String(v ?? "").replace(/\s/g, "").replace(",", "."));
  return isNaN(x) ? 0 : x;
};

const fmt = (v, devise = "GNF") =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n(v))) + " " + devise;

const dateFr = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const libelleMois = (ym) => {
  if (!ym) return "—";
  const [a, m] = ym.split("-");
  return `${MOIS_FR[parseInt(m, 10) - 1]} ${a}`;
};

const moisCourant = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const joursEntre = (d1, d2) => {
  if (!d1 || !d2) return 0;
  const a = new Date(d1), b = new Date(d2);
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86400000) + 1);
};

/* montant en lettres (français) */
const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

function centaineEnLettres(x) {
  if (x < 20) return UNITES[x];
  if (x < 100) {
    const d = Math.floor(x / 10), u = x % 10;
    if (d === 7 || d === 9) {
      const base = DIZAINES[d];
      const reste = UNITES[10 + u];
      return base + (u === 1 && d === 7 ? " et " : "-") + reste;
    }
    let s = DIZAINES[d];
    if (u === 0) return d === 8 ? s + "s" : s;
    if (u === 1 && d !== 8) return s + " et un";
    return s + "-" + UNITES[u];
  }
  const c = Math.floor(x / 100), r = x % 100;
  let s = c === 1 ? "cent" : UNITES[c] + " cent";
  if (r === 0) return c > 1 ? s + "s" : s;
  return s + " " + centaineEnLettres(r);
}

function montantEnLettres(v, devise = "GNF") {
  let x = Math.round(Math.abs(n(v)));
  if (x === 0) return "zéro " + devise;
  const paliers = [
    { val: 1000000000, sing: "milliard", plur: "milliards" },
    { val: 1000000, sing: "million", plur: "millions" },
    { val: 1000, sing: "mille", plur: "mille" },
  ];
  const parts = [];
  for (const p of paliers) {
    const q = Math.floor(x / p.val);
    if (q > 0) {
      if (p.val === 1000 && q === 1) parts.push("mille");
      else parts.push(centaineEnLettres(q) + " " + (q > 1 ? p.plur : p.sing));
      x %= p.val;
    }
  }
  if (x > 0) parts.push(centaineEnLettres(x));
  const txt = parts.join(" ");
  return txt.charAt(0).toUpperCase() + txt.slice(1) + " " + devise;
}

/* --------------------------- calcul de la paie -------------------------- */

function calculerRts(baseImposable, tranches) {
  let reste = baseImposable, precedent = 0, total = 0;
  for (const t of tranches) {
    const plafond = t.plafond == null ? Infinity : n(t.plafond);
    const portion = Math.max(0, Math.min(baseImposable, plafond) - precedent);
    total += portion * (n(t.taux) / 100);
    precedent = plafond;
    if (baseImposable <= plafond) break;
  }
  return Math.round(total);
}

function calculerPaie(emp, params, opts = {}) {
  const joursMois = n(params.joursMois) || 30;
  const jours = opts.jours == null ? joursMois : n(opts.jours);
  const ratio = Math.min(1, jours / joursMois);

  const base = Math.round(n(emp.salaireBase) * ratio);
  const transport = Math.round(n(emp.primeTransport) * ratio);
  const logement = Math.round(n(emp.primeLogement) * ratio);
  const autrePrime = Math.round(n(emp.primeAutre) * ratio);
  const heuresSup = Math.round(n(opts.heuresSup));
  const brut = base + transport + logement + autrePrime + heuresSup;

  const assiette = Math.min(brut, n(params.plafondCnss) || brut);
  const cnss = Math.round(assiette * (n(params.tauxCnssSalarie) / 100));
  const cnssPatronal = Math.round(assiette * (n(params.tauxCnssPatronal) / 100));

  const imposable = Math.max(0, brut - cnss);
  const rts = calculerRts(imposable, params.tranchesRts);

  const avance = Math.round(n(opts.avance));
  const autresRetenues = Math.round(n(opts.autresRetenues));
  const totalRetenues = cnss + rts + avance + autresRetenues;
  const net = brut - totalRetenues;

  return { jours, base, transport, logement, autrePrime, heuresSup, brut,
    cnss, cnssPatronal, imposable, rts, avance, autresRetenues, totalRetenues, net,
    coutEmployeur: brut + cnssPatronal };
}

/* ------------------------------ composants UI ---------------------------- */

function Champ({ label, children, large }) {
  return (
    <label className={"block " + (large ? "sm:col-span-2" : "")}>
      <span className="block text-xs font-medium tracking-wide uppercase text-slate-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-200";

function Modale({ titre, sousTitre, onFermer, children, taille = "max-w-3xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900 bg-opacity-50 p-4">
      <div className={"w-full " + taille + " my-8 rounded-2xl bg-white shadow-2xl"}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{titre}</h3>
            {sousTitre && <p className="text-sm text-slate-500">{sousTitre}</p>}
          </div>
          <button onClick={onFermer} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Vide({ titre, texte, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="text-base font-semibold text-slate-800">{titre}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{texte}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Carte({ valeur, libelle, accent }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className={"mb-4 h-1 w-8 rounded-full " + accent} />
      <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900">{valeur}</p>
      <p className="mt-1 text-sm text-slate-500">{libelle}</p>
    </div>
  );
}

function Badge({ statut }) {
  const map = {
    Actif: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Suspendu: "bg-amber-50 text-amber-700 border-amber-200",
    Sorti: "bg-slate-100 text-slate-600 border-slate-200",
    "En cours": "bg-amber-50 text-amber-700 border-amber-200",
    Soldée: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={"inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium " + (map[statut] || map.Sorti)}>
      {statut}
    </span>
  );
}

/* ------------------------------ document imprimable ---------------------- */

function EnTeteDoc({ ent, titre, reference }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6 border-b-2 border-slate-800 pb-4">
      <div className="flex items-start gap-3">
        {ent.logo
          ? <img src={ent.logo} alt="" className="h-16 w-16 rounded object-contain" />
          : <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-900 text-xs font-bold text-white">AVM</div>}
        <div>
          <p className="text-base font-bold uppercase tracking-wide text-slate-900">{ent.nom}</p>
          <p className="text-xs text-slate-600">{ent.activite}</p>
          <p className="text-xs text-slate-600">{ent.adresse}</p>
          {ent.agence2 && <p className="text-xs text-slate-600">{ent.agence2}</p>}
          <p className="text-xs text-slate-600">{ent.telephone} · {ent.email}</p>
          {(ent.rccm || ent.nif) && (
            <p className="text-xs text-slate-500">RCCM {ent.rccm || "—"} · NIF {ent.nif || "—"}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-900">{titre}</p>
        {reference && <p className="mt-1 font-mono text-xs text-slate-500">{reference}</p>}
      </div>
    </div>
  );
}

function Signature({ ent, ville = "Conakry", date }) {
  return (
    <div className="mt-10 flex justify-between text-xs text-slate-700">
      <div>
        <p className="font-semibold">Signature de l'employé</p>
        <p className="mt-1 text-slate-500">Précédée de « Lu et approuvé »</p>
        <div className="mt-12 w-48 border-t border-slate-400" />
      </div>
      <div className="text-right">
        <p>Fait à {ville}, le {dateFr(date || new Date().toISOString().slice(0, 10))}</p>
        <p className="mt-1 font-semibold">{ent.signataire}</p>
        <p className="text-slate-500">{ent.fonction}</p>
        <div className="mt-10 w-48 border-t border-slate-400" />
      </div>
    </div>
  );
}

function Apercu({ titre, onFermer, children }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 bg-opacity-60 p-4 no-print">
      <div className="mx-auto my-6 w-full max-w-4xl">
        <div className="mb-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow">
          <p className="text-sm font-semibold text-slate-800">{titre}</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
              <Printer size={16} /> Imprimer
            </button>
            <button onClick={onFermer} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              Fermer
            </button>
          </div>
        </div>
        <div id="zone-impression" className="rounded-xl bg-white p-10 shadow-lg">{children}</div>
      </div>
    </div>
  );
}

/* --------------------------------- APP ---------------------------------- */

export default function App() {
  const [data, setData] = useState(DONNEES_INITIALES);
  const [pret, setPret] = useState(false);
  const [onglet, setOnglet] = useState("tableau");
  const [apercu, setApercu] = useState(null);
  const [flash, setFlash] = useState("");

  /* chargement */
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r && r.value) setData({ ...DONNEES_INITIALES, ...JSON.parse(r.value) });
      } catch (e) {
        /* première ouverture : rien d'enregistré */
      }
      setPret(true);
    })();
  }, []);

  /* sauvegarde */
  useEffect(() => {
    if (!pret) return;
    (async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* mode hors stockage */ }
    })();
  }, [data, pret]);

  const maj = (patch) => setData((d) => ({ ...d, ...patch }));
  const notifier = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };

  const { entreprise: ent, parametres: par, employes, bulletins, avances, conges, contrats } = data;
  const dev = par.devise;

  const actifs = employes.filter((e) => e.statut === "Actif");
  const masse = actifs.reduce(
    (s, e) => s + n(e.salaireBase) + n(e.primeTransport) + n(e.primeLogement) + n(e.primeAutre), 0);
  const avancesEnCours = avances
    .filter((a) => n(a.montant) - n(a.rembourse) > 0)
    .reduce((s, a) => s + (n(a.montant) - n(a.rembourse)), 0);
  const bulletinsMois = bulletins.filter((b) => b.mois === moisCourant());

  const menu = [
    { id: "tableau", label: "Tableau de bord", icone: LayoutGrid },
    { id: "employes", label: "Employés", icone: Users },
    { id: "bulletins", label: "Bulletins de paie", icone: FileText },
    { id: "cartes", label: "Cartes de travail", icone: CreditCard },
    { id: "avances", label: "Avances sur salaire", icone: Wallet },
    { id: "conges", label: "Attestations de congé", icone: Calendar },
    { id: "contrats", label: "Contrats de travail", icone: ClipboardList },
    { id: "parametres", label: "Paramètres", icone: Settings },
  ];

  const ctx = { data, maj, setData, ent, par, dev, employes, notifier, setApercu };

  if (!pret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Ouverture du registre…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 lg:flex-row">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #zone-impression, #zone-impression * { visibility: visible !important; }
          #zone-impression { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; box-shadow: none !important; }
          .no-print { background: transparent !important; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
      `}</style>

      {/* ------------------------- barre latérale ------------------------- */}
      <aside className="flex w-full flex-col bg-slate-900 lg:min-h-screen lg:w-72">
        <div className="flex items-start gap-3 px-5 py-6">
          <LogoEntreprise ent={ent} onChange={(logo) => maj({ entreprise: { ...ent, logo } })} />
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-300">Paie Registre</p>
            <p className="truncate text-sm text-slate-300">{ent.nom}</p>
            <p className="text-xs text-slate-500">Cliquez sur l'icône pour ajouter le logo</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
          {menu.map((m) => {
            const Ico = m.icone;
            const actif = onglet === m.id;
            return (
              <button key={m.id} onClick={() => setOnglet(m.id)}
                className={"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                  (actif ? "bg-emerald-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white")}>
                <Ico size={18} className={actif ? "text-amber-300" : "text-slate-400"} />
                {m.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4">
          <label className="flex items-center gap-2 text-xs text-slate-400">
            Devise
            <select value={par.devise} onChange={(e) => maj({ parametres: { ...par, devise: e.target.value } })}
              className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 outline-none">
              {DEVISES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
            </select>
          </label>
        </div>
      </aside>

      {/* ------------------------------ contenu ------------------------------ */}
      <main className="flex-1 px-5 py-7 lg:px-10">
        {flash && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
            <Check size={16} /> {flash}
          </div>
        )}

        {onglet === "tableau" && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Vue d'ensemble</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Tableau de bord</h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Carte valeur={fmt(masse, dev)} libelle="Masse salariale mensuelle" accent="bg-emerald-600" />
              <Carte valeur={String(actifs.length)} libelle="Employés actifs" accent="bg-slate-800" />
              <Carte valeur={fmt(avancesEnCours, dev)} libelle="Avances en cours" accent="bg-amber-500" />
              <Carte valeur={String(bulletinsMois.length)} libelle="Bulletins générés ce mois" accent="bg-slate-400" />
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-800">Derniers bulletins générés</h2>
              </div>
              {bulletins.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-500">
                  Aucun bulletin pour le moment. Ajoutez d'abord vos employés, puis générez la paie du mois.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {[...bulletins].reverse().slice(0, 8).map((b) => {
                    const e = employes.find((x) => x.id === b.employeId);
                    return (
                      <li key={b.id} className="grid grid-cols-3 items-center gap-3 px-5 py-3 text-sm">
                        <span className="font-medium text-slate-800">{e ? `${e.prenom} ${e.nom}` : "Employé supprimé"}</span>
                        <span className="text-center text-slate-500">{libelleMois(b.mois)}</span>
                        <span className="text-right font-mono text-emerald-700">{fmt(b.net, dev)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-800">Coût employeur estimé</h2>
                <p className="mt-2 font-mono text-xl text-slate-900">
                  {fmt(masse + masse * (n(par.tauxCnssPatronal) / 100), dev)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Masse salariale + {par.tauxCnssPatronal}% de charges patronales CNSS.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-800">Répartition par agence</h2>
                {actifs.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">Aucun employé actif.</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm">
                    {Object.entries(actifs.reduce((acc, e) => {
                      const k = e.agence || "Non affecté";
                      acc[k] = (acc[k] || 0) + 1; return acc;
                    }, {})).map(([k, v]) => (
                      <li key={k} className="flex justify-between text-slate-600">
                        <span>{k}</span><span className="font-mono">{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {onglet === "employes" && <Employes ctx={ctx} />}
        {onglet === "bulletins" && <Bulletins ctx={ctx} />}
        {onglet === "cartes" && <Cartes ctx={ctx} />}
        {onglet === "avances" && <Avances ctx={ctx} />}
        {onglet === "conges" && <Conges ctx={ctx} />}
        {onglet === "contrats" && <Contrats ctx={ctx} />}
        {onglet === "parametres" && <Parametres ctx={ctx} />}
      </main>

      {apercu && (
        <Apercu titre={apercu.titre} onFermer={() => setApercu(null)}>{apercu.contenu}</Apercu>
      )}
    </div>
  );
}

/* ------------------------------ logo ------------------------------ */

function LogoEntreprise({ ent, onChange }) {
  const ref = useRef(null);
  const lire = (f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(f);
  };
  return (
    <>
      <button onClick={() => ref.current && ref.current.click()}
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700"
        title="Ajouter ou changer le logo">
        {ent.logo ? <img src={ent.logo} alt="Logo" className="h-full w-full object-contain" /> : <Building2 size={20} />}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={(e) => lire(e.target.files && e.target.files[0])} />
    </>
  );
}

/* --------------------------- photo de l'employé --------------------------- */

/* La photo est réduite avant enregistrement pour ne pas alourdir le registre. */
function compresserImage(file, maxCote = 500) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => reject(new Error("lecture impossible"));
    lecteur.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image invalide"));
      img.onload = () => {
        let { width: w, height: h } = img;
        const ratio = Math.min(1, maxCote / Math.max(w, h));
        w = Math.round(w * ratio); h = Math.round(h * ratio);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.75));
      };
      img.src = lecteur.result;
    };
    lecteur.readAsDataURL(file);
  });
}

function PhotoEmploye({ photo, onChange, onErreur }) {
  const ref = useRef(null);
  const choisir = async (f) => {
    if (!f) return;
    try { onChange(await compresserImage(f)); }
    catch (err) { onErreur && onErreur("Photo illisible : choisissez une image JPG ou PNG."); }
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
      <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-white">
        {photo
          ? <img src={photo} alt="Photo de l'employé" className="h-full w-full object-cover" />
          : <Users size={24} className="text-slate-300" />}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">Photo d'identité</p>
        <p className="mt-0.5 text-xs text-slate-500">Format portrait. Elle apparaît sur la carte de travail.</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => ref.current && ref.current.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
            <Upload size={14} /> {photo ? "Changer la photo" : "Ajouter une photo"}
          </button>
          {photo && (
            <button onClick={() => onChange("")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-600">
              Retirer
            </button>
          )}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" capture="user" className="hidden"
        onChange={(e) => choisir(e.target.files && e.target.files[0])} />
    </div>
  );
}

/* ------------------------------ EMPLOYÉS ------------------------------ */

const EMPLOYE_VIDE = {
  photo: "",
  matricule: "", prenom: "", nom: "", sexe: "M", dateNaissance: "", lieuNaissance: "",
  telephone: "", adresse: "", poste: "", agence: "Madina", typeContrat: "CDI",
  dateEmbauche: "", dateFin: "", salaireBase: "", primeTransport: "", primeLogement: "",
  primeAutre: "", numCNSS: "", banque: "", numCompte: "", statut: "Actif",
};

function Employes({ ctx }) {
  const { data, maj, employes, dev, notifier } = ctx;
  const [form, setForm] = useState(null);
  const [q, setQ] = useState("");

  const liste = employes.filter((e) =>
    `${e.prenom} ${e.nom} ${e.poste} ${e.matricule}`.toLowerCase().includes(q.toLowerCase()));

  const ouvrirNouveau = () => {
    const num = String(employes.length + 1).padStart(3, "0");
    setForm({ ...EMPLOYE_VIDE, id: null, matricule: `AVM-${num}` });
  };

  const enregistrer = () => {
    if (!form.nom.trim() || !form.prenom.trim()) return notifier("Le nom et le prénom sont obligatoires.");
    if (form.id) {
      maj({ employes: employes.map((e) => (e.id === form.id ? form : e)) });
      notifier("Employé mis à jour.");
    } else {
      maj({ employes: [...employes, { ...form, id: uid() }] });
      notifier("Employé ajouté.");
    }
    setForm(null);
  };

  const supprimer = (id) => {
    maj({
      employes: employes.filter((e) => e.id !== id),
      bulletins: data.bulletins.filter((b) => b.employeId !== id),
      avances: data.avances.filter((a) => a.employeId !== id),
    });
    notifier("Employé supprimé.");
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <section>
      <EnTetePage titre="Employés" sousTitre={`${employes.length} fiche(s) au registre`}
        action={<BoutonPrincipal onClick={ouvrirNouveau} icone={Plus}>Ajouter un employé</BoutonPrincipal>} />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un nom, un poste, un matricule"
          className="w-full text-sm outline-none" />
      </div>

      {liste.length === 0 ? (
        <Vide titre="Le registre est vide" texte="Ajoutez vos employés pour générer ensuite les bulletins, contrats et attestations."
          action={<BoutonPrincipal onClick={ouvrirNouveau} icone={Plus}>Ajouter un employé</BoutonPrincipal>} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Matricule</th>
                <th className="px-4 py-3">Nom et prénom</th>
                <th className="px-4 py-3">Poste</th>
                <th className="px-4 py-3">Agence</th>
                <th className="px-4 py-3">Embauche</th>
                <th className="px-4 py-3 text-right">Salaire de base</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liste.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{e.matricule}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {e.photo
                          ? <img src={e.photo} alt="" className="h-full w-full object-cover" />
                          : <span className="text-xs font-semibold text-slate-500">
                              {(e.prenom || "?").charAt(0)}{(e.nom || "").charAt(0)}
                            </span>}
                      </div>
                      <span className="font-medium text-slate-800">{e.prenom} {e.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.poste || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{e.agence}</td>
                  <td className="px-4 py-3 text-slate-600">{dateFr(e.dateEmbauche)}</td>
                  <td className="px-4 py-3 text-right font-mono">{fmt(e.salaireBase, dev)}</td>
                  <td className="px-4 py-3"><Badge statut={e.statut} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setForm({ ...EMPLOYE_VIDE, ...e })}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Modifier">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => supprimer(e.id)}
                        className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Supprimer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modale titre={form.id ? "Modifier la fiche" : "Nouvel employé"}
          sousTitre="Les montants servent au calcul automatique des bulletins."
          onFermer={() => setForm(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <PhotoEmploye photo={form.photo} onChange={(v) => set("photo", v)} onErreur={notifier} />
            <Champ label="Matricule"><input className={inputCls} value={form.matricule} onChange={(e) => set("matricule", e.target.value)} /></Champ>
            <Champ label="Statut">
              <select className={inputCls} value={form.statut} onChange={(e) => set("statut", e.target.value)}>
                <option>Actif</option><option>Suspendu</option><option>Sorti</option>
              </select>
            </Champ>
            <Champ label="Prénom"><input className={inputCls} value={form.prenom} onChange={(e) => set("prenom", e.target.value)} /></Champ>
            <Champ label="Nom"><input className={inputCls} value={form.nom} onChange={(e) => set("nom", e.target.value)} /></Champ>
            <Champ label="Sexe">
              <select className={inputCls} value={form.sexe} onChange={(e) => set("sexe", e.target.value)}>
                <option value="M">Masculin</option><option value="F">Féminin</option>
              </select>
            </Champ>
            <Champ label="Téléphone"><input className={inputCls} value={form.telephone} onChange={(e) => set("telephone", e.target.value)} /></Champ>
            <Champ label="Date de naissance"><input type="date" className={inputCls} value={form.dateNaissance} onChange={(e) => set("dateNaissance", e.target.value)} /></Champ>
            <Champ label="Lieu de naissance"><input className={inputCls} value={form.lieuNaissance} onChange={(e) => set("lieuNaissance", e.target.value)} /></Champ>
            <Champ label="Adresse" large><input className={inputCls} value={form.adresse} onChange={(e) => set("adresse", e.target.value)} /></Champ>
            <Champ label="Poste occupé"><input className={inputCls} value={form.poste} onChange={(e) => set("poste", e.target.value)} /></Champ>
            <Champ label="Agence">
              <select className={inputCls} value={form.agence} onChange={(e) => set("agence", e.target.value)}>
                <option>Madina</option><option>Sonfonia T7</option><option>Guangzhou</option><option>Direction</option>
              </select>
            </Champ>
            <Champ label="Type de contrat">
              <select className={inputCls} value={form.typeContrat} onChange={(e) => set("typeContrat", e.target.value)}>
                <option>CDI</option><option>CDD</option><option>Stage</option><option>Essai</option><option>Prestation</option>
              </select>
            </Champ>
            <Champ label="Date d'embauche"><input type="date" className={inputCls} value={form.dateEmbauche} onChange={(e) => set("dateEmbauche", e.target.value)} /></Champ>
            {form.typeContrat !== "CDI" && (
              <Champ label="Fin de contrat"><input type="date" className={inputCls} value={form.dateFin} onChange={(e) => set("dateFin", e.target.value)} /></Champ>
            )}
            <Champ label="Salaire de base"><input inputMode="numeric" className={inputCls} value={form.salaireBase} onChange={(e) => set("salaireBase", e.target.value)} /></Champ>
            <Champ label="Prime de transport"><input inputMode="numeric" className={inputCls} value={form.primeTransport} onChange={(e) => set("primeTransport", e.target.value)} /></Champ>
            <Champ label="Prime de logement"><input inputMode="numeric" className={inputCls} value={form.primeLogement} onChange={(e) => set("primeLogement", e.target.value)} /></Champ>
            <Champ label="Autre prime"><input inputMode="numeric" className={inputCls} value={form.primeAutre} onChange={(e) => set("primeAutre", e.target.value)} /></Champ>
            <Champ label="Numéro CNSS"><input className={inputCls} value={form.numCNSS} onChange={(e) => set("numCNSS", e.target.value)} /></Champ>
            <Champ label="Banque"><input className={inputCls} value={form.banque} onChange={(e) => set("banque", e.target.value)} /></Champ>
            <Champ label="Numéro de compte"><input className={inputCls} value={form.numCompte} onChange={(e) => set("numCompte", e.target.value)} /></Champ>
          </div>
          <PiedModale onAnnuler={() => setForm(null)} onValider={enregistrer}
            texte={form.id ? "Enregistrer les modifications" : "Ajouter au registre"} />
        </Modale>
      )}
    </section>
  );
}

function EnTetePage({ titre, sousTitre, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{titre}</h1>
        {sousTitre && <p className="mt-1 text-sm text-slate-500">{sousTitre}</p>}
      </div>
      {action}
    </div>
  );
}

function BoutonPrincipal({ children, onClick, icone: Ico }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800">
      {Ico && <Ico size={16} />} {children}
    </button>
  );
}

function PiedModale({ onAnnuler, onValider, texte }) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
      <button onClick={onAnnuler} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
        Annuler
      </button>
      <button onClick={onValider} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">
        {texte}
      </button>
    </div>
  );
}

/* ------------------------------ BULLETINS ------------------------------ */

function Bulletins({ ctx }) {
  const { data, maj, employes, par, dev, ent, notifier, setApercu } = ctx;
  const [mois, setMois] = useState(moisCourant());
  const [form, setForm] = useState(null);

  const duMois = data.bulletins.filter((b) => b.mois === mois);

  const soldeAvance = (empId) =>
    data.avances.filter((a) => a.employeId === empId)
      .reduce((s, a) => s + (n(a.montant) - n(a.rembourse)), 0);

  const ouvrir = (emp) => {
    setForm({
      employeId: emp.id, jours: par.joursMois, heuresSup: "",
      avance: Math.min(soldeAvance(emp.id), n(emp.salaireBase) * 0.3) || "",
      autresRetenues: "", observation: "",
    });
  };

  const generer = () => {
    const emp = employes.find((e) => e.id === form.employeId);
    const c = calculerPaie(emp, par, form);
    const bulletin = {
      id: uid(), employeId: emp.id, mois, ...c,
      observation: form.observation, dateGeneration: new Date().toISOString(),
      reference: `BP-${mois.replace("-", "")}-${emp.matricule}`,
    };
    let nouvellesAvances = data.avances;
    if (c.avance > 0) {
      let reste = c.avance;
      nouvellesAvances = data.avances.map((a) => {
        if (a.employeId !== emp.id || reste <= 0) return a;
        const du = n(a.montant) - n(a.rembourse);
        const pris = Math.min(du, reste);
        reste -= pris;
        return { ...a, rembourse: n(a.rembourse) + pris };
      });
    }
    maj({ bulletins: [...data.bulletins, bulletin], avances: nouvellesAvances });
    setForm(null);
    notifier("Bulletin généré.");
    voir(bulletin);
  };

  const voir = (b) => {
    const emp = employes.find((e) => e.id === b.employeId) || {};
    setApercu({
      titre: `Bulletin de paie — ${emp.prenom || ""} ${emp.nom || ""}`,
      contenu: <BulletinDoc b={b} emp={emp} ent={ent} dev={dev} par={par} />,
    });
  };

  const supprimer = (id) => {
    maj({ bulletins: data.bulletins.filter((b) => b.id !== id) });
    notifier("Bulletin supprimé.");
  };

  const totalNet = duMois.reduce((s, b) => s + n(b.net), 0);
  const emp = form ? employes.find((e) => e.id === form.employeId) : null;
  const calcul = emp ? calculerPaie(emp, par, form) : null;

  return (
    <section>
      <EnTetePage titre="Bulletins de paie" sousTitre={`${duMois.length} bulletin(s) pour ${libelleMois(mois)} · Total net ${fmt(totalNet, dev)}`}
        action={
          <input type="month" value={mois} onChange={(e) => setMois(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
        } />

      {employes.length === 0 ? (
        <Vide titre="Aucun employé au registre" texte="Ajoutez d'abord une fiche employé dans le module Employés." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Employés actifs</h2>
              <p className="text-xs text-slate-500">Générez le bulletin du mois sélectionné.</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {employes.filter((e) => e.statut === "Actif").map((e) => {
                const fait = duMois.find((b) => b.employeId === e.id);
                return (
                  <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-800">{e.prenom} {e.nom}</p>
                      <p className="text-xs text-slate-500">{e.poste || "—"} · {fmt(e.salaireBase, dev)}</p>
                    </div>
                    {fait ? (
                      <span className="text-xs font-medium text-emerald-700">Déjà généré</span>
                    ) : (
                      <button onClick={() => ouvrir(e)}
                        className="rounded-lg border border-emerald-700 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                        Générer
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Bulletins de {libelleMois(mois)}</h2>
            </div>
            {duMois.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-slate-500">Aucun bulletin pour ce mois.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {duMois.map((b) => {
                  const e = employes.find((x) => x.id === b.employeId) || {};
                  return (
                    <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{e.prenom} {e.nom}</p>
                        <p className="font-mono text-xs text-slate-500">{b.reference}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-700">{fmt(b.net, dev)}</span>
                        <button onClick={() => voir(b)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Voir et imprimer">
                          <Printer size={15} />
                        </button>
                        <button onClick={() => supprimer(b.id)} className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Supprimer">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {form && emp && (
        <Modale titre={`Paie de ${emp.prenom} ${emp.nom}`} sousTitre={libelleMois(mois)} onFermer={() => setForm(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label={`Jours travaillés (sur ${par.joursMois})`}>
              <input inputMode="numeric" className={inputCls} value={form.jours}
                onChange={(e) => setForm({ ...form, jours: e.target.value })} />
            </Champ>
            <Champ label="Heures supplémentaires / bonus">
              <input inputMode="numeric" className={inputCls} value={form.heuresSup}
                onChange={(e) => setForm({ ...form, heuresSup: e.target.value })} />
            </Champ>
            <Champ label={`Retenue d'avance (solde ${fmt(soldeAvance(emp.id), dev)})`}>
              <input inputMode="numeric" className={inputCls} value={form.avance}
                onChange={(e) => setForm({ ...form, avance: e.target.value })} />
            </Champ>
            <Champ label="Autres retenues">
              <input inputMode="numeric" className={inputCls} value={form.autresRetenues}
                onChange={(e) => setForm({ ...form, autresRetenues: e.target.value })} />
            </Champ>
            <Champ label="Observation" large>
              <input className={inputCls} value={form.observation}
                onChange={(e) => setForm({ ...form, observation: e.target.value })} />
            </Champ>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Aperçu du calcul</p>
            <Ligne l="Salaire brut" v={fmt(calcul.brut, dev)} />
            <Ligne l={`CNSS salarié (${par.tauxCnssSalarie}%)`} v={"− " + fmt(calcul.cnss, dev)} />
            <Ligne l="RTS (barème progressif)" v={"− " + fmt(calcul.rts, dev)} />
            <Ligne l="Avance retenue" v={"− " + fmt(calcul.avance, dev)} />
            <Ligne l="Autres retenues" v={"− " + fmt(calcul.autresRetenues, dev)} />
            <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 font-semibold text-slate-900">
              <span>Net à payer</span><span className="font-mono">{fmt(calcul.net, dev)}</span>
            </div>
          </div>

          <PiedModale onAnnuler={() => setForm(null)} onValider={generer} texte="Générer le bulletin" />
        </Modale>
      )}
    </section>
  );
}

function Ligne({ l, v }) {
  return (
    <div className="flex justify-between py-0.5 text-slate-600">
      <span>{l}</span><span className="font-mono">{v}</span>
    </div>
  );
}

function BulletinDoc({ b, emp, ent, dev, par }) {
  const R = ({ l, v, fort }) => (
    <tr className={fort ? "font-semibold" : ""}>
      <td className="border border-slate-300 px-3 py-1.5">{l}</td>
      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono">{v}</td>
    </tr>
  );
  return (
    <div className="text-slate-800">
      <EnTeteDoc ent={ent} titre="Bulletin de paie" reference={b.reference} />

      <div className="mb-5 grid grid-cols-2 gap-4 text-xs">
        <div className="rounded border border-slate-300 p-3">
          <p className="mb-1 font-semibold uppercase tracking-wide text-slate-500">Employé</p>
          <p className="text-sm font-semibold">{emp.prenom} {emp.nom}</p>
          <p>Matricule : {emp.matricule}</p>
          <p>Poste : {emp.poste || "—"}</p>
          <p>Agence : {emp.agence || "—"}</p>
          <p>N° CNSS : {emp.numCNSS || "—"}</p>
          <p>Embauché le {dateFr(emp.dateEmbauche)}</p>
        </div>
        <div className="rounded border border-slate-300 p-3">
          <p className="mb-1 font-semibold uppercase tracking-wide text-slate-500">Période</p>
          <p className="text-sm font-semibold">{libelleMois(b.mois)}</p>
          <p>Jours travaillés : {b.jours} / {par.joursMois}</p>
          <p>Contrat : {emp.typeContrat || "—"}</p>
          <p>Paiement : {emp.banque ? `${emp.banque} — ${emp.numCompte || ""}` : "Espèces"}</p>
          <p>Édité le {dateFr(b.dateGeneration)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-3 py-2 text-left">Gains</th>
              <th className="border border-slate-300 px-3 py-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            <R l="Salaire de base" v={fmt(b.base, dev)} />
            <R l="Prime de transport" v={fmt(b.transport, dev)} />
            <R l="Prime de logement" v={fmt(b.logement, dev)} />
            <R l="Autre prime" v={fmt(b.autrePrime, dev)} />
            <R l="Heures supplémentaires" v={fmt(b.heuresSup, dev)} />
            <R l="Total brut" v={fmt(b.brut, dev)} fort />
          </tbody>
        </table>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-3 py-2 text-left">Retenues</th>
              <th className="border border-slate-300 px-3 py-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            <R l={`CNSS salarié (${par.tauxCnssSalarie}%)`} v={fmt(b.cnss, dev)} />
            <R l="RTS (impôt sur salaire)" v={fmt(b.rts, dev)} />
            <R l="Avance sur salaire" v={fmt(b.avance, dev)} />
            <R l="Autres retenues" v={fmt(b.autresRetenues, dev)} />
            <R l="Total retenues" v={fmt(b.totalRetenues, dev)} fort />
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between rounded border-2 border-slate-800 px-4 py-3">
        <span className="text-sm font-bold uppercase tracking-wide">Net à payer</span>
        <span className="font-mono text-xl font-bold">{fmt(b.net, dev)}</span>
      </div>
      <p className="mt-2 text-xs italic text-slate-600">
        Arrêté le présent bulletin à la somme de : {montantEnLettres(b.net, dev)}.
      </p>
      {b.observation && <p className="mt-2 text-xs text-slate-600">Observation : {b.observation}</p>}
      <p className="mt-2 text-xs text-slate-500">
        Charges patronales CNSS ({par.tauxCnssPatronal}%) : {fmt(b.cnssPatronal, dev)} · Coût employeur : {fmt(b.coutEmployeur, dev)}
      </p>

      <Signature ent={ent} date={b.dateGeneration ? b.dateGeneration.slice(0, 10) : ""} />
      <p className="mt-6 border-t border-slate-200 pt-2 text-center text-xs text-slate-400">
        Document à conserver sans limitation de durée.
      </p>
    </div>
  );
}

/* --------------------------- CARTES DE TRAVAIL --------------------------- */

function Cartes({ ctx }) {
  const { employes, ent, setApercu } = ctx;

  const voir = (emp) => setApercu({
    titre: `Carte de travail — ${emp.prenom} ${emp.nom}`,
    contenu: <CarteDoc emp={emp} ent={ent} />,
  });

  if (employes.length === 0)
    return <><EnTetePage titre="Cartes de travail" />
      <Vide titre="Aucun employé" texte="Les cartes sont générées à partir des fiches employés." /></>;

  return (
    <section>
      <EnTetePage titre="Cartes de travail" sousTitre="Badge nominatif recto-verso, à imprimer et plastifier." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {employes.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                {e.photo
                  ? <img src={e.photo} alt="" className="h-full w-full object-cover" />
                  : <span className="text-xs text-slate-400">—</span>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{e.prenom} {e.nom}</p>
                <p className="text-xs text-slate-500">{e.poste || "—"} · {e.agence}</p>
                <p className="mt-1 font-mono text-xs text-slate-400">{e.matricule}</p>
                {!e.photo && <p className="mt-1 text-xs text-amber-700">Photo manquante</p>}
              </div>
            </div>
            <button onClick={() => voir(e)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Printer size={14} /> Imprimer la carte
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CarteDoc({ emp, ent }) {
  const validite = new Date();
  validite.setFullYear(validite.getFullYear() + 1);
  return (
    <div className="flex flex-wrap gap-6">
      {/* recto */}
      <div className="w-80 overflow-hidden rounded-xl border border-slate-300">
        <div className="bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2">
            {ent.logo
              ? <img src={ent.logo} alt="" className="h-8 w-8 rounded bg-white object-contain" />
              : <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-400 text-xs font-bold text-slate-900">AV</div>}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Carte de travail</p>
              <p className="text-xs text-slate-300">{ent.nom}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 text-xs">
          <div className="flex gap-3">
            <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-300 bg-slate-50">
              {emp.photo
                ? <img src={emp.photo} alt="" className="h-full w-full object-cover" />
                : <span className="text-center text-xs text-slate-400">Photo</span>}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight text-slate-900">{emp.prenom} {emp.nom}</p>
              <p className="text-slate-600">{emp.poste || "—"}</p>
              <div className="mt-2 space-y-0.5 text-slate-700">
                <p>Matricule : <span className="font-mono">{emp.matricule}</span></p>
                <p>Agence : {emp.agence}</p>
                <p>Embauche : {dateFr(emp.dateEmbauche)}</p>
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-0.5 text-slate-700">
            <p>N° CNSS : {emp.numCNSS || "—"}</p>
            <p>Téléphone : {emp.telephone || "—"}</p>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-xs text-slate-500">Valable jusqu'au<br />{dateFr(validite.toISOString().slice(0, 10))}</p>
            <div className="text-right">
              <div className="w-24 border-t border-slate-400 pt-1 text-xs text-slate-500">La Direction</div>
            </div>
          </div>
        </div>
        <div className="h-2 bg-amber-400" />
      </div>

      {/* verso */}
      <div className="w-80 overflow-hidden rounded-xl border border-slate-300 px-4 py-4 text-xs text-slate-700">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-900">Conditions d'usage</p>
        <ul className="list-disc space-y-1 pl-4">
          <li>Cette carte est strictement personnelle et non cessible.</li>
          <li>Elle doit être présentée à toute réquisition dans les locaux de l'entreprise.</li>
          <li>Toute perte est à signaler immédiatement à la Direction.</li>
          <li>Elle est restituée à la fin du contrat de travail.</li>
        </ul>
        <div className="mt-4 border-t border-slate-200 pt-3">
          <p className="font-semibold">{ent.nom}</p>
          <p>{ent.adresse}</p>
          <p>{ent.telephone} · {ent.email}</p>
        </div>
        <p className="mt-4 text-slate-400">Carte trouvée ? Merci de la retourner à l'adresse ci-dessus.</p>
      </div>
    </div>
  );
}

/* ------------------------------- AVANCES ------------------------------- */

function Avances({ ctx }) {
  const { data, maj, employes, dev, notifier } = ctx;
  const [form, setForm] = useState(null);

  const enregistrer = () => {
    if (!form.employeId || n(form.montant) <= 0) return notifier("Choisissez un employé et un montant.");
    if (form.id) {
      maj({ avances: data.avances.map((a) => (a.id === form.id ? form : a)) });
      notifier("Avance mise à jour.");
    } else {
      maj({ avances: [...data.avances, { ...form, id: uid(), rembourse: n(form.rembourse) }] });
      notifier("Avance enregistrée.");
    }
    setForm(null);
  };

  const total = data.avances.reduce((s, a) => s + (n(a.montant) - n(a.rembourse)), 0);

  return (
    <section>
      <EnTetePage titre="Avances sur salaire" sousTitre={`Reste à récupérer : ${fmt(total, dev)}`}
        action={<BoutonPrincipal icone={Plus}
          onClick={() => setForm({ id: null, employeId: "", montant: "", rembourse: "", date: new Date().toISOString().slice(0, 10), motif: "", echeance: "" })}>
          Enregistrer une avance
        </BoutonPrincipal>} />

      {data.avances.length === 0 ? (
        <Vide titre="Aucune avance en cours" texte="Les avances enregistrées ici sont proposées automatiquement en retenue lors de la génération des bulletins." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Employé</th><th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Motif</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-right">Remboursé</th>
                <th className="px-4 py-3 text-right">Reste</th>
                <th className="px-4 py-3">Statut</th><th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.avances.map((a) => {
                const e = employes.find((x) => x.id === a.employeId) || {};
                const reste = n(a.montant) - n(a.rembourse);
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{e.prenom} {e.nom}</td>
                    <td className="px-4 py-3 text-slate-600">{dateFr(a.date)}</td>
                    <td className="px-4 py-3 text-slate-600">{a.motif || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{fmt(a.montant, dev)}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700">{fmt(a.rembourse, dev)}</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">{fmt(reste, dev)}</td>
                    <td className="px-4 py-3"><Badge statut={reste > 0 ? "En cours" : "Soldée"} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setForm(a)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil size={15} /></button>
                        <button onClick={() => { maj({ avances: data.avances.filter((x) => x.id !== a.id) }); notifier("Avance supprimée."); }}
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modale titre={form.id ? "Modifier l'avance" : "Nouvelle avance"} onFermer={() => setForm(null)} taille="max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Employé" large>
              <select className={inputCls} value={form.employeId} onChange={(e) => setForm({ ...form, employeId: e.target.value })}>
                <option value="">— Choisir —</option>
                {employes.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </Champ>
            <Champ label="Montant accordé"><input inputMode="numeric" className={inputCls} value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} /></Champ>
            <Champ label="Déjà remboursé"><input inputMode="numeric" className={inputCls} value={form.rembourse} onChange={(e) => setForm({ ...form, rembourse: e.target.value })} /></Champ>
            <Champ label="Date d'octroi"><input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Champ>
            <Champ label="Échéance souhaitée"><input type="date" className={inputCls} value={form.echeance} onChange={(e) => setForm({ ...form, echeance: e.target.value })} /></Champ>
            <Champ label="Motif" large><input className={inputCls} value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} /></Champ>
          </div>
          <PiedModale onAnnuler={() => setForm(null)} onValider={enregistrer} texte="Enregistrer" />
        </Modale>
      )}
    </section>
  );
}

/* ------------------------- ATTESTATIONS DE CONGÉ ------------------------- */

function Conges({ ctx }) {
  const { data, maj, employes, ent, notifier, setApercu } = ctx;
  const [form, setForm] = useState(null);

  const enregistrer = () => {
    if (!form.employeId || !form.debut || !form.fin) return notifier("Employé et dates sont obligatoires.");
    const c = { ...form, id: form.id || uid(), jours: joursEntre(form.debut, form.fin), emission: new Date().toISOString().slice(0, 10) };
    maj({ conges: form.id ? data.conges.map((x) => (x.id === form.id ? c : x)) : [...data.conges, c] });
    setForm(null);
    notifier("Attestation enregistrée.");
    voir(c);
  };

  const voir = (c) => {
    const emp = employes.find((e) => e.id === c.employeId) || {};
    setApercu({ titre: `Attestation de congé — ${emp.prenom} ${emp.nom}`, contenu: <CongeDoc c={c} emp={emp} ent={ent} /> });
  };

  return (
    <section>
      <EnTetePage titre="Attestations de congé" sousTitre="Congés annuels, maladie, maternité et absences autorisées."
        action={<BoutonPrincipal icone={Plus}
          onClick={() => setForm({ id: null, employeId: "", type: "Congé annuel", debut: "", fin: "", motif: "", remplacant: "" })}>
          Nouvelle attestation
        </BoutonPrincipal>} />

      {data.conges.length === 0 ? (
        <Vide titre="Aucune attestation" texte="Créez une attestation dès qu'un congé est accordé : elle est imprimable et signée par la Direction." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Employé</th><th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Du</th><th className="px-4 py-3">Au</th>
                <th className="px-4 py-3 text-right">Jours</th><th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.conges.map((c) => {
                const e = employes.find((x) => x.id === c.employeId) || {};
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{e.prenom} {e.nom}</td>
                    <td className="px-4 py-3 text-slate-600">{c.type}</td>
                    <td className="px-4 py-3 text-slate-600">{dateFr(c.debut)}</td>
                    <td className="px-4 py-3 text-slate-600">{dateFr(c.fin)}</td>
                    <td className="px-4 py-3 text-right font-mono">{c.jours}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => voir(c)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Printer size={15} /></button>
                        <button onClick={() => setForm(c)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil size={15} /></button>
                        <button onClick={() => { maj({ conges: data.conges.filter((x) => x.id !== c.id) }); notifier("Attestation supprimée."); }}
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modale titre="Attestation de congé" onFermer={() => setForm(null)} taille="max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Employé" large>
              <select className={inputCls} value={form.employeId} onChange={(e) => setForm({ ...form, employeId: e.target.value })}>
                <option value="">— Choisir —</option>
                {employes.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </Champ>
            <Champ label="Type de congé">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Congé annuel</option><option>Congé de maladie</option><option>Congé de maternité</option>
                <option>Congé exceptionnel</option><option>Permission d'absence</option>
              </select>
            </Champ>
            <Champ label="Remplaçant pendant l'absence">
              <input className={inputCls} value={form.remplacant} onChange={(e) => setForm({ ...form, remplacant: e.target.value })} />
            </Champ>
            <Champ label="Date de début"><input type="date" className={inputCls} value={form.debut} onChange={(e) => setForm({ ...form, debut: e.target.value })} /></Champ>
            <Champ label="Date de fin"><input type="date" className={inputCls} value={form.fin} onChange={(e) => setForm({ ...form, fin: e.target.value })} /></Champ>
            <Champ label="Motif ou précision" large><input className={inputCls} value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} /></Champ>
          </div>
          {form.debut && form.fin && (
            <p className="mt-4 rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Durée : <span className="font-semibold text-slate-900">{joursEntre(form.debut, form.fin)} jour(s)</span> calendaires.
            </p>
          )}
          <PiedModale onAnnuler={() => setForm(null)} onValider={enregistrer} texte="Établir l'attestation" />
        </Modale>
      )}
    </section>
  );
}

function CongeDoc({ c, emp, ent }) {
  return (
    <div className="text-slate-800">
      <EnTeteDoc ent={ent} titre="Attestation de congé" reference={`ATT-${(c.id || "").toUpperCase().slice(0, 6)}`} />
      <p className="mb-6 text-sm">Je soussigné, <strong>{ent.signataire}</strong>, {ent.fonction} de {ent.nom}, atteste que :</p>

      <div className="mb-6 rounded border border-slate-300 p-4 text-sm">
        <p><strong>{emp.prenom} {emp.nom}</strong>, matricule <span className="font-mono">{emp.matricule}</span></p>
        <p>Fonction : {emp.poste || "—"} — Agence de {emp.agence || "—"}</p>
        <p>En service depuis le {dateFr(emp.dateEmbauche)}</p>
      </div>

      <p className="text-sm leading-relaxed">
        bénéficie d'un <strong>{(c.type || "").toLowerCase()}</strong> de <strong>{c.jours} jour(s)</strong>,
        du <strong>{dateFr(c.debut)}</strong> au <strong>{dateFr(c.fin)}</strong> inclus.
        {c.motif ? ` Motif : ${c.motif}.` : ""}
        {c.remplacant ? ` Pendant cette période, l'intérim est assuré par ${c.remplacant}.` : ""}
      </p>
      <p className="mt-4 text-sm leading-relaxed">
        L'intéressé(e) reprend son service le {dateFr(new Date(new Date(c.fin).getTime() + 86400000).toISOString().slice(0, 10))}.
        La présente attestation est délivrée pour servir et valoir ce que de droit.
      </p>

      <Signature ent={ent} date={c.emission} />
    </div>
  );
}

/* ------------------------- CONTRATS DE TRAVAIL ------------------------- */

function Contrats({ ctx }) {
  const { data, maj, employes, ent, dev, notifier, setApercu } = ctx;
  const [form, setForm] = useState(null);

  const enregistrer = () => {
    if (!form.employeId) return notifier("Choisissez un employé.");
    const c = { ...form, id: form.id || uid(), emission: new Date().toISOString().slice(0, 10) };
    maj({ contrats: form.id ? data.contrats.map((x) => (x.id === form.id ? c : x)) : [...data.contrats, c] });
    setForm(null);
    notifier("Contrat enregistré.");
    voir(c);
  };

  const voir = (c) => {
    const emp = employes.find((e) => e.id === c.employeId) || {};
    setApercu({ titre: `Contrat — ${emp.prenom} ${emp.nom}`, contenu: <ContratDoc c={c} emp={emp} ent={ent} dev={dev} /> });
  };

  const nouveau = () => setForm({
    id: null, employeId: "", type: "CDI", debut: "", fin: "", essai: "3 mois",
    lieu: "Conakry — Agence de Madina", horaires: "40 heures par semaine, du lundi au samedi",
    salaire: "", conges: "2,5 jours ouvrables par mois de service effectif", clauses: "",
  });

  return (
    <section>
      <EnTetePage titre="Contrats de travail" sousTitre="CDI, CDD, stage et période d'essai — prêts à signer."
        action={<BoutonPrincipal icone={Plus} onClick={nouveau}>Rédiger un contrat</BoutonPrincipal>} />

      {data.contrats.length === 0 ? (
        <Vide titre="Aucun contrat rédigé" texte="Le contrat reprend automatiquement les informations de la fiche employé."
          action={<BoutonPrincipal icone={Plus} onClick={nouveau}>Rédiger un contrat</BoutonPrincipal>} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Employé</th><th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Début</th><th className="px-4 py-3">Fin</th>
                <th className="px-4 py-3 text-right">Salaire</th><th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.contrats.map((c) => {
                const e = employes.find((x) => x.id === c.employeId) || {};
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{e.prenom} {e.nom}</td>
                    <td className="px-4 py-3 text-slate-600">{c.type}</td>
                    <td className="px-4 py-3 text-slate-600">{dateFr(c.debut)}</td>
                    <td className="px-4 py-3 text-slate-600">{c.type === "CDI" ? "Indéterminée" : dateFr(c.fin)}</td>
                    <td className="px-4 py-3 text-right font-mono">{fmt(c.salaire || e.salaireBase, dev)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => voir(c)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Printer size={15} /></button>
                        <button onClick={() => setForm(c)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil size={15} /></button>
                        <button onClick={() => { maj({ contrats: data.contrats.filter((x) => x.id !== c.id) }); notifier("Contrat supprimé."); }}
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modale titre="Contrat de travail" onFermer={() => setForm(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Employé" large>
              <select className={inputCls} value={form.employeId}
                onChange={(e) => {
                  const emp = employes.find((x) => x.id === e.target.value);
                  setForm({ ...form, employeId: e.target.value, salaire: emp ? emp.salaireBase : form.salaire, type: emp ? emp.typeContrat : form.type, debut: emp && emp.dateEmbauche ? emp.dateEmbauche : form.debut });
                }}>
                <option value="">— Choisir —</option>
                {employes.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </Champ>
            <Champ label="Type de contrat">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>CDI</option><option>CDD</option><option>Stage</option><option>Prestation</option>
              </select>
            </Champ>
            <Champ label="Période d'essai"><input className={inputCls} value={form.essai} onChange={(e) => setForm({ ...form, essai: e.target.value })} /></Champ>
            <Champ label="Date de début"><input type="date" className={inputCls} value={form.debut} onChange={(e) => setForm({ ...form, debut: e.target.value })} /></Champ>
            {form.type !== "CDI" && (
              <Champ label="Date de fin"><input type="date" className={inputCls} value={form.fin} onChange={(e) => setForm({ ...form, fin: e.target.value })} /></Champ>
            )}
            <Champ label="Salaire mensuel brut"><input inputMode="numeric" className={inputCls} value={form.salaire} onChange={(e) => setForm({ ...form, salaire: e.target.value })} /></Champ>
            <Champ label="Lieu de travail"><input className={inputCls} value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} /></Champ>
            <Champ label="Horaires" large><input className={inputCls} value={form.horaires} onChange={(e) => setForm({ ...form, horaires: e.target.value })} /></Champ>
            <Champ label="Droit aux congés" large><input className={inputCls} value={form.conges} onChange={(e) => setForm({ ...form, conges: e.target.value })} /></Champ>
            <Champ label="Clauses particulières" large>
              <textarea rows={3} className={inputCls} value={form.clauses} onChange={(e) => setForm({ ...form, clauses: e.target.value })}
                placeholder="Confidentialité, mobilité, dotation en matériel…" />
            </Champ>
          </div>
          <PiedModale onAnnuler={() => setForm(null)} onValider={enregistrer} texte="Établir le contrat" />
        </Modale>
      )}
    </section>
  );
}

function ContratDoc({ c, emp, ent, dev }) {
  const Art = ({ num, titre, children }) => (
    <div className="mb-4">
      <p className="text-sm font-bold">Article {num} — {titre}</p>
      <p className="mt-1 text-sm leading-relaxed">{children}</p>
    </div>
  );
  const salaire = c.salaire || emp.salaireBase;
  return (
    <div className="text-slate-800">
      <EnTeteDoc ent={ent} titre={`Contrat de travail à durée ${c.type === "CDI" ? "indéterminée" : "déterminée"}`}
        reference={`CT-${(c.id || "").toUpperCase().slice(0, 6)}`} />

      <p className="mb-4 text-sm"><strong>Entre les soussignés :</strong></p>
      <p className="mb-3 text-sm leading-relaxed">
        <strong>{ent.nom}</strong>, {ent.activite}, dont le siège est situé à {ent.adresse},
        représentée par {ent.signataire}, {ent.fonction}, ci-après dénommée « l'Employeur »,
      </p>
      <p className="mb-3 text-sm">d'une part,</p>
      <p className="mb-3 text-sm leading-relaxed">
        <strong>{emp.prenom} {emp.nom}</strong>, né(e) le {dateFr(emp.dateNaissance)} à {emp.lieuNaissance || "—"},
        demeurant à {emp.adresse || "—"}, téléphone {emp.telephone || "—"}, ci-après dénommé(e) « l'Employé(e) »,
      </p>
      <p className="mb-5 text-sm">d'autre part. Il a été convenu ce qui suit :</p>

      <Art num="1" titre="Engagement">
        L'Employeur engage l'Employé(e) au poste de <strong>{emp.poste || "—"}</strong>, à compter du {dateFr(c.debut)}
        {c.type === "CDI" ? ", pour une durée indéterminée." : `, jusqu'au ${dateFr(c.fin)}.`}
      </Art>
      <Art num="2" titre="Période d'essai">
        Le contrat débute par une période d'essai de {c.essai}, renouvelable une fois. Durant cette période,
        chacune des parties peut rompre le contrat sans préavis ni indemnité.
      </Art>
      <Art num="3" titre="Lieu et horaires de travail">
        Le lieu de travail est fixé à {c.lieu}. La durée du travail est de {c.horaires}. L'Employé(e) peut être
        affecté(e) à toute autre agence de l'entreprise selon les besoins du service.
      </Art>
      <Art num="4" titre="Rémunération">
        L'Employé(e) perçoit un salaire mensuel brut de {fmt(salaire, dev)} ({montantEnLettres(salaire, dev)}),
        payable à la fin de chaque mois, sous déduction des retenues légales (CNSS et RTS).
      </Art>
      <Art num="5" titre="Congés payés">
        L'Employé(e) bénéficie de {c.conges}, selon le calendrier arrêté par la Direction.
      </Art>
      <Art num="6" titre="Obligations">
        L'Employé(e) s'engage à exécuter ses tâches avec diligence, à respecter le règlement intérieur et à observer
        une stricte confidentialité sur les informations commerciales, financières et clients de l'entreprise.
      </Art>
      <Art num="7" titre="Rupture du contrat">
        Le contrat peut être rompu dans les conditions prévues par le Code du travail en vigueur en République de Guinée,
        moyennant le préavis légal.
      </Art>
      {c.clauses && <Art num="8" titre="Clauses particulières">{c.clauses}</Art>}

      <p className="mt-5 text-sm">Fait en deux exemplaires originaux, un pour chaque partie.</p>
      <Signature ent={ent} date={c.emission} />
    </div>
  );
}

/* ------------------------------ PARAMÈTRES ------------------------------ */

function Parametres({ ctx }) {
  const { data, maj, ent, par, notifier } = ctx;
  const [e, setE] = useState(ent);
  const [p, setP] = useState(par);

  const enregistrer = () => { maj({ entreprise: e, parametres: p }); notifier("Paramètres enregistrés."); };

  const setTranche = (i, k, v) => {
    const t = p.tranchesRts.map((x, j) => (j === i ? { ...x, [k]: v === "" ? null : n(v) } : x));
    setP({ ...p, tranchesRts: t });
  };

  const exporter = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paie-registre-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importer = (f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        maj(d); setE(d.entreprise); setP(d.parametres);
        notifier("Sauvegarde restaurée.");
      } catch (err) { notifier("Fichier illisible : choisissez une sauvegarde du registre."); }
    };
    r.readAsText(f);
  };

  return (
    <section className="max-w-4xl">
      <EnTetePage titre="Paramètres" sousTitre="Identité de l'entreprise, taux légaux et sauvegarde." />

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">Identité de l'entreprise</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="Raison sociale"><input className={inputCls} value={e.nom} onChange={(x) => setE({ ...e, nom: x.target.value })} /></Champ>
          <Champ label="Activité"><input className={inputCls} value={e.activite} onChange={(x) => setE({ ...e, activite: x.target.value })} /></Champ>
          <Champ label="Adresse du siège"><input className={inputCls} value={e.adresse} onChange={(x) => setE({ ...e, adresse: x.target.value })} /></Champ>
          <Champ label="Seconde agence"><input className={inputCls} value={e.agence2} onChange={(x) => setE({ ...e, agence2: x.target.value })} /></Champ>
          <Champ label="Téléphone"><input className={inputCls} value={e.telephone} onChange={(x) => setE({ ...e, telephone: x.target.value })} /></Champ>
          <Champ label="Email"><input className={inputCls} value={e.email} onChange={(x) => setE({ ...e, email: x.target.value })} /></Champ>
          <Champ label="RCCM"><input className={inputCls} value={e.rccm} onChange={(x) => setE({ ...e, rccm: x.target.value })} /></Champ>
          <Champ label="NIF"><input className={inputCls} value={e.nif} onChange={(x) => setE({ ...e, nif: x.target.value })} /></Champ>
          <Champ label="N° employeur CNSS"><input className={inputCls} value={e.numCNSS} onChange={(x) => setE({ ...e, numCNSS: x.target.value })} /></Champ>
          <Champ label="Signataire des documents"><input className={inputCls} value={e.signataire} onChange={(x) => setE({ ...e, signataire: x.target.value })} /></Champ>
          <Champ label="Fonction du signataire"><input className={inputCls} value={e.fonction} onChange={(x) => setE({ ...e, fonction: x.target.value })} /></Champ>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-slate-800">Cotisations et impôt</h2>
        <p className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Vérifiez ces taux auprès de la CNSS et de la Direction Nationale des Impôts avant la première paie : ils changent avec les lois de finances.
        </p>
        <div className="grid gap-4 sm:grid-cols-4">
          <Champ label="CNSS salarié (%)"><input inputMode="numeric" className={inputCls} value={p.tauxCnssSalarie} onChange={(x) => setP({ ...p, tauxCnssSalarie: x.target.value })} /></Champ>
          <Champ label="CNSS employeur (%)"><input inputMode="numeric" className={inputCls} value={p.tauxCnssPatronal} onChange={(x) => setP({ ...p, tauxCnssPatronal: x.target.value })} /></Champ>
          <Champ label="Plafond CNSS"><input inputMode="numeric" className={inputCls} value={p.plafondCnss} onChange={(x) => setP({ ...p, plafondCnss: x.target.value })} /></Champ>
          <Champ label="Jours par mois"><input inputMode="numeric" className={inputCls} value={p.joursMois} onChange={(x) => setP({ ...p, joursMois: x.target.value })} /></Champ>
        </div>

        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Barème RTS (progressif, mensuel)</p>
        <div className="space-y-2">
          {p.tranchesRts.map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-24 text-xs text-slate-500">Tranche {i + 1}</span>
              <input inputMode="numeric" placeholder="Sans plafond" className={inputCls + " flex-1"}
                value={t.plafond == null ? "" : t.plafond} onChange={(x) => setTranche(i, "plafond", x.target.value)} />
              <input inputMode="numeric" className={inputCls + " w-24"} value={t.taux}
                onChange={(x) => setTranche(i, "taux", x.target.value)} />
              <span className="text-xs text-slate-500">%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-slate-800">Sauvegarde</h2>
        <p className="mb-4 text-sm text-slate-500">
          Exportez le registre régulièrement : le fichier contient employés, bulletins, avances, congés et contrats.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exporter} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Exporter le registre
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Upload size={15} /> Restaurer une sauvegarde
            <input type="file" accept="application/json" className="hidden"
              onChange={(x) => importer(x.target.files && x.target.files[0])} />
          </label>
        </div>
      </div>

      <button onClick={enregistrer} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800">
        Enregistrer les paramètres
      </button>
    </section>
  );
}
