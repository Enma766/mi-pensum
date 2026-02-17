import React, { useState, useEffect, useMemo } from 'react';
import { Check, Lock, GraduationCap, RotateCcw } from 'lucide-react';

// --- DEFINICIÓN DE DATOS DEL PENSUM ---
// CORRECCIÓN: Se ha unificado el nombre de la propiedad a 'prerequisites'

const INITIAL_SUBJECTS = [
  // SEMESTRE I
  { id: 'len-com', name: 'Lenguaje y Comunicación', sem: 1, u: 4, prerequisites: [] },
  { id: 'calc-1', name: 'Cálculo I', sem: 1, u: 4, prerequisites: [] },
  { id: 'des-per', name: 'Desarrollo Personal y Profesional', sem: 1, u: 2, prerequisites: [] },
  { id: 'ent-fis', name: 'Entrenamiento Físico General', sem: 1, u: 2, prerequisites: [] },
  { id: 'logica', name: 'Lógica', sem: 1, u: 4, prerequisites: [] },

  // SEMESTRE II
  { id: 'calc-2', name: 'Cálculo II', sem: 2, u: 4, prerequisites: ['calc-1'] },
  { id: 'intro-inf', name: 'Introducción a la Informática', sem: 2, u: 4, prerequisites: ['logica'] },
  { id: 'geo-nac', name: 'Espacio Geográfico e Identidad Nac.', sem: 2, u: 2, prerequisites: [] },
  { id: 'est-des', name: 'Estadística Descriptiva', sem: 2, u: 3, prerequisites: ['calc-1'] },
  { id: 'ing-ins', name: 'Inglés Instrumental', sem: 2, u: 2, prerequisites: [] },
  { id: 'eco-amb', name: 'Ecología y Educación Ambiental', sem: 2, u: 3, prerequisites: [] },

  // SEMESTRE III
  { id: 'calc-3', name: 'Cálculo III', sem: 3, u: 4, prerequisites: ['calc-2'] },
  { id: 'fisica', name: 'Física', sem: 3, u: 4, prerequisites: ['calc-1'] },
  { id: 'alg-1', name: 'Algoritmos y Programación I', sem: 3, u: 4, prerequisites: ['intro-inf'] },
  { id: 'algebra', name: 'Álgebra', sem: 3, u: 4, prerequisites: ['calc-1'] },
  { id: 'inf-prob', name: 'Inferencia y Probabilidades', sem: 3, u: 3, prerequisites: ['est-des'] },

  // SEMESTRE IV
  { id: 'calc-4', name: 'Cálculo IV', sem: 4, u: 4, prerequisites: ['calc-3'] },
  { id: 'est-disc', name: 'Estructuras Discretas', sem: 4, u: 4, prerequisites: ['algebra'] },
  { id: 'alg-2', name: 'Algoritmos y Programación II', sem: 4, u: 4, prerequisites: ['alg-1'] },
  { id: 'elec-1', name: 'Electiva I', sem: 4, u: 2, prerequisites: [] },
  { id: 'electro', name: 'Electrónica', sem: 4, u: 4, prerequisites: ['fisica'] },

  // SEMESTRE V
  { id: 'bd-1', name: 'Bases de Datos I', sem: 5, u: 3, prerequisites: ['alg-1'] },
  { id: 'org-sis', name: 'Organización y Sistemas', sem: 5, u: 4, prerequisites: [] },
  { id: 'alg-3', name: 'Algoritmos y Programación III', sem: 5, u: 4, prerequisites: ['est-disc', 'alg-2'] },
  { id: 'arq-comp', name: 'Arquitectura del Computador', sem: 5, u: 3, prerequisites: ['electro'] },
  { id: 'met-inv', name: 'Metodología de la Investigación', sem: 5, u: 3, prerequisites: [] },

  // SEMESTRE VI
  { id: 'bd-2', name: 'Bases de Datos II', sem: 6, u: 3, prerequisites: ['bd-1'] },
  { id: 'inv-ope', name: 'Investigación de Operaciones', sem: 6, u: 4, prerequisites: ['org-sis'] },
  { id: 'sis-ope', name: 'Sistemas Operativos', sem: 6, u: 4, prerequisites: ['arq-comp'] },
  { id: 'met-num', name: 'Métodos Numéricos', sem: 6, u: 3, prerequisites: ['est-disc'] },
  { id: 'ing-soft', name: 'Principios de Ingeniería del Software', sem: 6, u: 5, prerequisites: ['bd-1', 'alg-2'] },

  // SEMESTRE VII
  { id: 'arq-soft', name: 'Arquitecturas Software', sem: 7, u: 3, prerequisites: ['ing-soft'] },
  { id: 'met-soft', name: 'Metodologías de Desarrollo de Soft.', sem: 7, u: 4, prerequisites: ['ing-soft', 'alg-3'] },
  { id: 'elec-2', name: 'Electiva II', sem: 7, u: 2, prerequisites: [] },
  { id: 'redes-1', name: 'Redes y Comunicaciones I', sem: 7, u: 4, prerequisites: ['sis-ope'] },
  { id: 'des-app-1', name: 'Desarrollo de Aplicaciones I', sem: 7, u: 3, prerequisites: ['ing-soft', 'alg-3'] },
  { id: 'inv-soc', name: 'Investigación Social', sem: 7, u: 4, prerequisites: ['met-inv'] },

  // SEMESTRE VIII
  { id: 'ger-mer', name: 'Gerencia y Mercadeo', sem: 8, u: 3, prerequisites: ['inv-ope'] },
  { id: 'redes-2', name: 'Redes y Comunicaciones II', sem: 8, u: 4, prerequisites: ['redes-1'] },
  { id: 'elec-3', name: 'Electiva III', sem: 8, u: 2, prerequisites: [] },
  { id: 'des-app-2', name: 'Desarrollo de Aplicaciones II', sem: 8, u: 3, prerequisites: ['des-app-1', 'met-soft'] },
  { id: 'proy-grado', name: 'Proyecto de Grado', sem: 8, u: 4, prerequisites: ['met-inv', 'des-app-1', 'met-soft'] },
  { id: 'sem-etica', name: 'Seminario: Ética Profesional', sem: 8, u: 3, prerequisites: ['ALL_SEM_7'], specialReq: 'Todo hasta el 7mo' },

  // SEMESTRE IX
  { id: 'plan-proy', name: 'Planificación de Proyectos', sem: 9, u: 3, prerequisites: ['ger-mer'] },
  { id: 'aud-sis', name: 'Auditoría de Sistemas Informáticos', sem: 9, u: 4, prerequisites: ['arq-soft', 'des-app-1'] },
  { id: 'trab-grado', name: 'Trabajo de Grado', sem: 9, u: 8, prerequisites: ['ALL_SEM_8'], specialReq: 'Todo hasta el 8vo' },

  // SEMESTRE X
  { id: 'pasantia', name: 'Pasantía Profesional', sem: 10, u: 10, prerequisites: ['ALL_SEM_9'], specialReq: 'Todo hasta el 9no' },
];

export default function App() {
  const [approved, setApproved] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('myPensumProgress');
    if (saved) {
      try {
        setApproved(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar estado cada vez que cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('myPensumProgress', JSON.stringify(approved));
    }
  }, [approved, isLoaded]);

  // Función lógica para verificar si una materia está desbloqueada
  const checkStatus = (subject) => {
    const isApproved = approved.includes(subject.id);
    
    // Verificar prelaciones normales
    let prerequisitesMet = true;
    
    if (subject.prerequisites && Array.isArray(subject.prerequisites)) {
      prerequisitesMet = subject.prerequisites.every(pId => {
        // Manejo de casos especiales (Seminarios y Tesis que piden "Todo lo anterior")
        if (pId === 'ALL_SEM_7') {
          // Verificar que todas las materias de sem 1 a 7 estén aprobadas
          const allPrev = INITIAL_SUBJECTS.filter(s => s.sem <= 7).every(s => approved.includes(s.id));
          return allPrev;
        }
        if (pId === 'ALL_SEM_8') {
          const allPrev = INITIAL_SUBJECTS.filter(s => s.sem <= 8).every(s => approved.includes(s.id));
          return allPrev;
        }
        if (pId === 'ALL_SEM_9') {
          const allPrev = INITIAL_SUBJECTS.filter(s => s.sem <= 9).every(s => approved.includes(s.id));
          return allPrev;
        }
        return approved.includes(pId);
      });
    }

    return { 
      isApproved, 
      isUnlocked: prerequisitesMet || (subject.prerequisites && subject.prerequisites.length === 0),
      isLocked: !prerequisitesMet && (subject.prerequisites && subject.prerequisites.length > 0)
    };
  };

  const toggleSubject = (id) => {
    const subject = INITIAL_SUBJECTS.find(s => s.id === id);
    if (!subject) return;

    const { isUnlocked } = checkStatus(subject);

    if (!isUnlocked && !approved.includes(id)) {
      // Si está bloqueada y no está aprobada, no hacer nada
      return;
    }

    setApproved(prev => {
      if (prev.includes(id)) {
        // Si ya la tenemos, la quitamos
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const resetProgress = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todo tu progreso?")) {
      setApproved([]);
    }
  };

  const stats = useMemo(() => {
    const totalUC = INITIAL_SUBJECTS.reduce((acc, s) => acc + s.u, 0);
    const currentUC = INITIAL_SUBJECTS.filter(s => approved.includes(s.id)).reduce((acc, s) => acc + s.u, 0);
    const percentage = Math.round((currentUC / totalUC) * 100);
    return { currentUC, totalUC, percentage };
  }, [approved]);

  const semesters = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Plan de Estudio 2026</h1>
              <p className="text-xs text-slate-400">Ingeniería en Informática</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto bg-slate-800/50 p-2 rounded-xl border border-slate-700">
            <div className="flex-1 md:flex-none">
              <div className="flex justify-between text-xs mb-1 text-slate-300">
                <span>Progreso ({stats.percentage}%)</span>
                <span>{stats.currentUC} / {stats.totalUC} UC</span>
              </div>
              <div className="w-full md:w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
            
            <button 
              onClick={resetProgress}
              className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
              title="Reiniciar todo"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* LEYENDA */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-100 border border-emerald-500 rounded flex items-center justify-center text-emerald-700"><Check size={10} strokeWidth={4} /></div>
            <span>Aprobada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-slate-300 rounded shadow-sm"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded opacity-60 flex items-center justify-center text-slate-400"><Lock size={10} /></div>
            <span>Bloqueada (Prelada)</span>
          </div>
        </div>

        {/* GRID DE SEMESTRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {semesters.map(semNum => (
            <div key={semNum} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-2">
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">SEM {semNum}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {INITIAL_SUBJECTS.filter(s => s.sem === semNum).map(subject => {
                  const { isApproved, isUnlocked, isLocked } = checkStatus(subject);
                  
                  // Generar texto de requisitos para el tooltip
                  const reqNames = subject.prerequisites.map(reqId => {
                    if(reqId.startsWith('ALL')) return subject.specialReq;
                    return INITIAL_SUBJECTS.find(s => s.id === reqId)?.name || reqId;
                  }).join(', ');

                  return (
                    <div 
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      title={isLocked ? `Prelada por: ${reqNames}` : ''}
                      className={`
                        relative group p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none
                        ${isApproved 
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                          : isLocked 
                            ? 'bg-slate-100 border-slate-200 opacity-70 grayscale' 
                            : 'bg-white border-white shadow-md hover:border-blue-400 hover:shadow-lg hover:-translate-y-1'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isApproved ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {subject.u} UC
                        </span>
                        {isApproved && <Check size={18} className="text-emerald-600" />}
                        {isLocked && <Lock size={16} className="text-slate-400" />}
                        {!isApproved && !isLocked && <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-blue-400" />}
                      </div>
                      
                      <h3 className={`text-sm font-semibold leading-tight ${isApproved ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {subject.name}
                      </h3>

                      {isLocked && (
                        <div className="mt-2 text-[10px] text-red-500 leading-tight">
                          <span className="font-bold">Prelada por:</span> {reqNames}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center py-10 text-slate-400 text-sm">
        <p>Diseñado para organizar tu avance en Ingeniería Informática</p>
      </div>

    </div>
  );
}