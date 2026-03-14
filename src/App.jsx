import React, { useState, useEffect, useMemo } from 'react';
import { Check, Lock, GraduationCap, RotateCcw, CalendarDays, List, Plus, Trash2, Clock } from 'lucide-react';

// --- DEFINICIÓN DE DATOS DEL PENSUM ---
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

const TIME_BLOCKS = [
  // Turno Mañana
  { id: 'm1', label: '07:00 AM - 07:40 AM', shift: 'morning' },
  { id: 'm2', label: '07:40 AM - 08:20 AM', shift: 'morning' },
  { id: 'm3', label: '08:20 AM - 09:00 AM', shift: 'morning' },
  { id: 'm4', label: '09:00 AM - 09:40 AM', shift: 'morning' },
  { id: 'm5', label: '09:40 AM - 10:20 AM', shift: 'morning' },
  { id: 'm6', label: '10:20 AM - 11:00 AM', shift: 'morning' },
  { id: 'm7', label: '11:00 AM - 11:40 AM', shift: 'morning' },
  { id: 'm8', label: '11:40 AM - 12:20 PM', shift: 'morning' },
  { id: 'm9', label: '12:20 PM - 01:00 PM', shift: 'morning' },
  // Turno Tarde
  { id: 'a1', label: '01:20 PM - 02:00 PM', shift: 'afternoon' },
  { id: 'a2', label: '02:00 PM - 02:40 PM', shift: 'afternoon' },
  { id: 'a3', label: '02:40 PM - 03:20 PM', shift: 'afternoon' },
  { id: 'a4', label: '03:20 PM - 04:00 PM', shift: 'afternoon' },
  { id: 'a5', label: '04:00 PM - 04:40 PM', shift: 'afternoon' },
  { id: 'a6', label: '04:40 PM - 05:20 PM', shift: 'afternoon' },
  { id: 'a7', label: '05:20 PM - 06:00 PM', shift: 'afternoon' },
  { id: 'a8', label: '06:00 PM - 06:40 PM', shift: 'afternoon' },
];

export default function App() {
  const [approved, setApproved] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('pensum'); // 'pensum' | 'schedule'

  // Estados del formulario de horario
  const [formSubject, setFormSubject] = useState('');
  const [formDay, setFormDay] = useState('Sábado');
  const [formStart, setFormStart] = useState('m1');
  const [formEnd, setFormEnd] = useState('m1');
  const [formError, setFormError] = useState('');

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const savedPensum = localStorage.getItem('myPensumProgress');
    const savedSchedule = localStorage.getItem('myScheduleItems');
    if (savedPensum) {
      try { setApproved(JSON.parse(savedPensum)); } catch (e) { console.error(e); }
    }
    if (savedSchedule) {
      try { setScheduleItems(JSON.parse(savedSchedule)); } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  // Guardar estado cada vez que cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('myPensumProgress', JSON.stringify(approved));
      localStorage.setItem('myScheduleItems', JSON.stringify(scheduleItems));
    }
  }, [approved, scheduleItems, isLoaded]);

  // Limpiar materias del horario si se aprueban o se bloquean
  useEffect(() => {
    if (isLoaded) {
      setScheduleItems(prev => prev.filter(item => {
        const subj = INITIAL_SUBJECTS.find(s => s.id === item.subjectId);
        if(!subj) return false;
        
        const isApproved = approved.includes(subj.id);
        let prerequisitesMet = true;
        if (subj.prerequisites && Array.isArray(subj.prerequisites)) {
          prerequisitesMet = subj.prerequisites.every(pId => {
            if (pId === 'ALL_SEM_7') return INITIAL_SUBJECTS.filter(s => s.sem <= 7).every(s => approved.includes(s.id));
            if (pId === 'ALL_SEM_8') return INITIAL_SUBJECTS.filter(s => s.sem <= 8).every(s => approved.includes(s.id));
            if (pId === 'ALL_SEM_9') return INITIAL_SUBJECTS.filter(s => s.sem <= 9).every(s => approved.includes(s.id));
            return approved.includes(pId);
          });
        }
        const isUnlocked = prerequisitesMet || (subj.prerequisites && subj.prerequisites.length === 0);
        
        return isUnlocked && !isApproved;
      }));
    }
  }, [approved, isLoaded]);

  // Función lógica para verificar si una materia está desbloqueada
  const checkStatus = (subject) => {
    const isApproved = approved.includes(subject.id);
    let prerequisitesMet = true;
    
    if (subject.prerequisites && Array.isArray(subject.prerequisites)) {
      prerequisitesMet = subject.prerequisites.every(pId => {
        if (pId === 'ALL_SEM_7') return INITIAL_SUBJECTS.filter(s => s.sem <= 7).every(s => approved.includes(s.id));
        if (pId === 'ALL_SEM_8') return INITIAL_SUBJECTS.filter(s => s.sem <= 8).every(s => approved.includes(s.id));
        if (pId === 'ALL_SEM_9') return INITIAL_SUBJECTS.filter(s => s.sem <= 9).every(s => approved.includes(s.id));
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
    if (!isUnlocked && !approved.includes(id)) return;

    setApproved(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const resetProgress = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todo tu progreso y tu horario?")) {
      setApproved([]);
      setScheduleItems([]);
    }
  };

  // Filtrar SOLAMENTE materias disponibles (No aprobadas y no bloqueadas)
  const availableSubjects = useMemo(() => {
    return INITIAL_SUBJECTS.filter(s => {
      const status = checkStatus(s);
      return status.isUnlocked && !status.isApproved;
    });
  }, [approved]);

  const stats = useMemo(() => {
    const totalUC = INITIAL_SUBJECTS.reduce((acc, s) => acc + s.u, 0);
    const currentUC = INITIAL_SUBJECTS.filter(s => approved.includes(s.id)).reduce((acc, s) => acc + s.u, 0);
    const percentage = Math.round((currentUC / totalUC) * 100);
    return { currentUC, totalUC, percentage };
  }, [approved]);

  // LÓGICA DE HORARIOS
  const handleAddScheduleItem = (e) => {
    e.preventDefault();
    if (!formSubject || !formDay || !formStart || !formEnd) {
      setFormError("Por favor completa todos los campos.");
      return;
    }

    const startIdx = TIME_BLOCKS.findIndex(b => b.id === formStart);
    const endIdx = TIME_BLOCKS.findIndex(b => b.id === formEnd);

    if (startIdx > endIdx) {
      setFormError("La hora de fin no puede ser menor a la hora de inicio.");
      return;
    }

    // Verificar si hay choques de horario (Collision detection)
    const hasOverlap = scheduleItems.some(item => {
      if (item.day !== formDay) return false;
      const iStartIdx = TIME_BLOCKS.findIndex(b => b.id === item.startBlockId);
      const iEndIdx = TIME_BLOCKS.findIndex(b => b.id === item.endBlockId);
      return startIdx <= iEndIdx && iStartIdx <= endIdx;
    });

    if (hasOverlap) {
      setFormError("Ya hay una materia registrada en este bloque de horario.");
      return;
    }

    setFormError("");
    setScheduleItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        subjectId: formSubject,
        day: formDay,
        startBlockId: formStart,
        endBlockId: formEnd
      }
    ]);
    setFormSubject('');
  };

  const removeScheduleItem = (id) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
  };

  // Helpers para renderizar la tabla con RowSpan
  const getItemStartingAt = (day, bIdx) => {
    return scheduleItems.find(item => item.day === day && TIME_BLOCKS.findIndex(b => b.id === item.startBlockId) === bIdx);
  };

  const isCoveredByPrevious = (day, bIdx) => {
    return scheduleItems.some(item => {
      if (item.day !== day) return false;
      const sIdx = TIME_BLOCKS.findIndex(b => b.id === item.startBlockId);
      const eIdx = TIME_BLOCKS.findIndex(b => b.id === item.endBlockId);
      return bIdx > sIdx && bIdx <= eIdx;
    });
  };

  const semesters = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Plan de Estudio 2008</h1>
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

      {/* TABS DE NAVEGACIÓN */}
      <div className="bg-white shadow-sm border-b border-slate-200 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('pensum')}
              className={`py-4 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'pensum'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <List size={18} /> Mi Pensum
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarDays size={18} /> Horario Actual
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL SEGÚN TAB */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- PESTAÑA: PENSUM --- */}
        {activeTab === 'pensum' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {semesters.map(semNum => (
                <div key={semNum} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-2">
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">SEM {semNum}</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {INITIAL_SUBJECTS.filter(s => s.sem === semNum).map(subject => {
                      const { isApproved, isUnlocked, isLocked } = checkStatus(subject);
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
        )}

        {/* --- PESTAÑA: HORARIO --- */}
        {activeTab === 'schedule' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Panel Izquierdo: Formulario */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                  <Plus size={20} className="text-blue-600" /> Agregar Materia
                </h2>
                
                <form onSubmit={handleAddScheduleItem} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Materia Disponible</label>
                    <select 
                      value={formSubject} 
                      onChange={e => setFormSubject(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Selecciona una materia...</option>
                      {availableSubjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Sem {s.sem})</option>
                      ))}
                    </select>
                    {availableSubjects.length === 0 && (
                      <p className="text-xs text-orange-500 mt-1">No tienes materias disponibles para inscribir.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Día</label>
                    <select 
                      value={formDay} 
                      onChange={e => setFormDay(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hora Inicio</label>
                      <select 
                        value={formStart} 
                        onChange={e => setFormStart(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {TIME_BLOCKS.map(b => (
                          <option key={`start-${b.id}`} value={b.id}>{b.label.split(' - ')[0]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fin</label>
                      <select 
                        value={formEnd} 
                        onChange={e => setFormEnd(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {TIME_BLOCKS.map(b => (
                          <option key={`end-${b.id}`} value={b.id}>{b.label.split(' - ')[1]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                      {formError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={availableSubjects.length === 0}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Asignar al Horario
                  </button>
                </form>
              </div>
            </div>

            {/* Panel Derecho: Tabla Calendario */}
            <div className="lg:col-span-2 overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
              <table className="w-full text-sm text-left text-slate-500 border-collapse min-w-[600px]">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-4 border-b border-r w-[20%] text-center"><Clock size={16} className="inline mr-1"/> Hora</th>
                    <th scope="col" className="px-6 py-4 border-b border-r w-[40%] text-center text-blue-700 bg-blue-50/50">Sábado</th>
                    <th scope="col" className="px-6 py-4 border-b w-[40%] text-center text-blue-700 bg-blue-50/50">Domingo</th>
                  </tr>
                </thead>
                <tbody>
                  {TIME_BLOCKS.map((block, bIdx) => {
                    const isAfternoonStart = block.id === 'a1';
                    return (
                      <React.Fragment key={block.id}>
                        {isAfternoonStart && (
                          <tr>
                            <td colSpan="3" className="text-center bg-slate-200 border-y py-3 text-xs font-bold text-slate-600 uppercase tracking-widest shadow-inner">
                              Descanso (1:00 PM - 1:20 PM)
                            </td>
                          </tr>
                        )}
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 border-b border-r font-medium text-slate-800 text-center text-xs whitespace-nowrap bg-slate-50">
                            {block.label}
                          </td>
                          {['Sábado', 'Domingo'].map(day => {
                            const startingItem = getItemStartingAt(day, bIdx);
                            
                            if (startingItem) {
                              const subj = INITIAL_SUBJECTS.find(s => s.id === startingItem.subjectId);
                              const span = (TIME_BLOCKS.findIndex(b => b.id === startingItem.endBlockId) - TIME_BLOCKS.findIndex(b => b.id === startingItem.startBlockId)) + 1;
                              
                              return (
                                <td key={day} rowSpan={span} className="border-b border-r p-3 bg-blue-50 border-blue-200 align-top relative group">
                                  <div className="flex flex-col h-full gap-1">
                                    <span className="font-bold text-blue-900 leading-tight">{subj?.name}</span>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md self-start">
                                      {TIME_BLOCKS.find(b => b.id === startingItem.startBlockId).label.split(' - ')[0]} - {TIME_BLOCKS.find(b => b.id === startingItem.endBlockId).label.split(' - ')[1]}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => removeScheduleItem(startingItem.id)} 
                                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                    title="Quitar materia del horario"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              );
                            }

                            if (isCoveredByPrevious(day, bIdx)) return null;

                            return (
                              <td key={day} className="border-b border-r p-2 text-center text-slate-200 bg-white">
                                -
                              </td>
                            );
                          })}
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}