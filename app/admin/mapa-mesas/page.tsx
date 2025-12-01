'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Save } from 'lucide-react';

type MesaStatus = 'available' | 'busy' | 'reserved';
type TipoElemento = 'mesa' | 'referencia';

interface ElementoMapa {
  id: string;
  tipo: TipoElemento;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  seats?: number;
  status?: MesaStatus;
  lock?: boolean;
}

const statusColors = {
  available: 'from-emerald-500 to-emerald-700 shadow-[0_0_8px_#10b98170]',
  busy: 'from-red-600 to-red-800 shadow-[0_0_8px_#ef444470]',
  reserved: 'from-amber-500 to-amber-700 shadow-[0_0_8px_#f59e0b70]',
};

const MIN_WIDTH = 80;
const MIN_HEIGHT = 50;

export default function CanvasMesas() {
  const [elementos, setElementos] = useState<ElementoMapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<ElementoMapa[]>([]);

  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [editing, setEditing] = useState<string | null>(null);

  // zoom & pan
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const resizingRef = useRef<{
    id: string;
    dir: string;
    startMouseWorld: { x: number; y: number };
    startRect: { x: number; y: number; width: number; height: number };
  } | null>(null);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tables');
      
      if (!res.ok) {
        throw new Error('Erro ao buscar mesas');
      }

      const data = await res.json();
      setElementos(data);
      setOriginalData(JSON.parse(JSON.stringify(data))); // deep copy
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      alert('Erro ao carregar mesas');
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);

      // Atualiza apenas as mesas que foram modificadas
      const promises = elementos
        .filter((el) => el.tipo === 'mesa')
        .map((mesa) => {
          const original = originalData.find((o) => o.id === mesa.id);
          const changed = 
            !original ||
            original.x !== mesa.x ||
            original.y !== mesa.y ||
            original.width !== mesa.width ||
            original.height !== mesa.height ||
            original.seats !== mesa.seats ||
            original.label !== mesa.label ||
            original.lock !== mesa.lock;

          if (changed) {
            return fetch(`/api/tables/${mesa.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                label: mesa.label,
                seats: mesa.seats,
                x: mesa.x,
                y: mesa.y,
                width: mesa.width,
                height: mesa.height,
                lock: mesa.lock,
              }),
            });
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(promises);

      setOriginalData(JSON.parse(JSON.stringify(elementos)));
      setHasChanges(false);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const checkForChanges = (newElementos: ElementoMapa[]) => {
    const changed = newElementos.some((el, idx) => {
      const orig = originalData[idx];
      if (!orig) return true;
      return (
        orig.x !== el.x ||
        orig.y !== el.y ||
        orig.width !== el.width ||
        orig.height !== el.height ||
        orig.seats !== el.seats ||
        orig.label !== el.label ||
        orig.lock !== el.lock
      );
    });
    setHasChanges(changed);
  };

  const updateElementos = (updater: (prev: ElementoMapa[]) => ElementoMapa[]) => {
    setElementos((prev) => {
      const newVal = updater(prev);
      checkForChanges(newVal);
      return newVal;
    });
  };

  const clientToWorld = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: (clientX - rect.left - pan.x) / scale,
      y: (clientY - rect.top - pan.y) / scale,
    };
  };

  // --- Dragging ---
  const startDrag = (e: React.MouseEvent, id: string) => {
    const el = elementos.find((m) => m.id === id);
    if (!el || el.lock) return;
    if (resizingRef.current || isPanning) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragging(id);
    const screenX = el.x * scale + pan.x + rect.left;
    const screenY = el.y * scale + pan.y + rect.top;
    setOffset({ x: e.clientX - screenX, y: e.clientY - screenY });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging || isPanning || resizingRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    updateElementos((prev) =>
      prev.map((m) =>
        m.id === dragging
          ? { ...m, x: (e.clientX - rect.left - pan.x - offset.x) / scale, y: (e.clientY - rect.top - pan.y - offset.y) / scale }
          : m
      )
    );
  };

  const stopDrag = () => setDragging(null);

  // --- Resize ---
  const startResize = (e: React.MouseEvent, id: string, dir: string) => {
    e.stopPropagation();
    const el = elementos.find((m) => m.id === id);
    if (!el || el.lock) return;
    const world = clientToWorld(e.clientX, e.clientY);
    if (!world) return;

    resizingRef.current = {
      id,
      dir,
      startMouseWorld: world,
      startRect: { x: el.x, y: el.y, width: el.width ?? 170, height: el.height ?? 110 },
    };

    window.addEventListener('mousemove', globalMouseMove);
    window.addEventListener('mouseup', globalMouseUp);
  };

  const globalMouseMove = (ev: MouseEvent) => {
    const r = resizingRef.current;
    if (!r) return;
    const world = clientToWorld(ev.clientX, ev.clientY);
    if (!world) return;

    const dx = world.x - r.startMouseWorld.x;
    const dy = world.y - r.startMouseWorld.y;

    updateElementos((prev) =>
      prev.map((m) => {
        if (m.id !== r.id) return m;
        let nx = m.x;
        let ny = m.y;
        let nw = m.width ?? 170;
        let nh = m.height ?? 110;

        if (r.dir.includes('right')) nw = Math.max(MIN_WIDTH, r.startRect.width + dx);
        if (r.dir.includes('left')) {
          nw = Math.max(MIN_WIDTH, r.startRect.width - dx);
          nx = r.startRect.x + (r.startRect.width - nw);
        }
        if (r.dir.includes('bottom')) nh = Math.max(MIN_HEIGHT, r.startRect.height + dy);
        if (r.dir.includes('top')) {
          nh = Math.max(MIN_HEIGHT, r.startRect.height - dy);
          ny = r.startRect.y + (r.startRect.height - nh);
        }

        return { ...m, x: nx, y: ny, width: nw, height: nh };
      })
    );
  };

  const globalMouseUp = () => {
    resizingRef.current = null;
    window.removeEventListener('mousemove', globalMouseMove);
    window.removeEventListener('mouseup', globalMouseUp);
  };

  // --- Zoom e Pan ---
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    const newScale = Math.min(3, Math.max(0.4, scale + delta));
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const zoomFactor = newScale / scale;
    setPan({
      x: mouseX - zoomFactor * (mouseX - pan.x),
      y: mouseY - zoomFactor * (mouseY - pan.y),
    });
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsPanning(false);
  const preventContextMenu = (e: React.MouseEvent) => e.preventDefault();

  // --- Add / Clear ---
  const addMesa = async () => {
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: `Mesa ${elementos.filter((e) => e.tipo === 'mesa').length + 1}`,
          seats: 4,
          status: 'available',
          tipo: 'mesa',
          x: 100 + elementos.length * 40,
          y: 100,
          width: 170,
          height: 110,
          lock: false,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar mesa');
      }

      await fetchMesas();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao adicionar mesa');
    }
  };

  const addReferencia = () => {
    updateElementos((prev) => [
      ...prev,
      { 
        id: `ref-${Date.now()}`, 
        tipo: 'referencia', 
        label: 'Nova referência', 
        x: 100 + prev.length * 30, 
        y: 100 + prev.length * 20, 
        width: 150, 
        height: 80, 
        lock: false 
      },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111111] border-b border-[#2a2a2a]">
        <h1 className="text-gray-200 text-sm font-semibold tracking-wide">Mapa de Mesas</h1>
        <div className="flex gap-2">
          <button onClick={addMesa} className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-sm">
            + Mesa
          </button>
          <button onClick={addReferencia} className="px-3 py-1.5 rounded-md bg-sky-700 hover:bg-sky-600 text-sm">
            + Ref
          </button>
          {hasChanges && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e);
          onDrag(e);
        }}
        onMouseUp={() => {
          handleMouseUp();
          stopDrag();
        }}
        onMouseLeave={() => {
          handleMouseUp();
          stopDrag();
        }}
        onContextMenu={preventContextMenu}
        className="relative w-full h-full border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#0a0a0a]"
        style={{
          backgroundImage: `linear-gradient(to right, #1e293b20 1px, transparent 1px),
                            linear-gradient(to bottom, #1e293b20 1px, transparent 1px)`,
          backgroundSize: `${40 * scale}px ${40 * scale}px`,
          cursor: isPanning ? 'grabbing' : 'default',
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          {elementos.map((el) => (
            <div
              key={el.id}
              onMouseDown={(e) => startDrag(e, el.id)}
              onDoubleClick={() => setEditing(el.id)}
              className={`absolute group transition-transform ${dragging === el.id ? 'scale-105 z-20' : 'z-10'}`}
              style={{
                left: el.x,
                top: el.y,
                width: el.width ?? 170,
                height: el.height ?? 110,
              }}
            >
              {/* MESA */}
              {el.tipo === 'mesa' && (
                <div
                  className={`relative w-full h-full rounded-xl border ${
                    el.lock ? 'border-red-600/80 opacity-70' : 'border-gray-700'
                  } bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]
                  shadow-[inset_0_0_20px_#00000080,0_4px_20px_#00000090]
                  p-3 overflow-hidden`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElementos((prev) =>
                        prev.map((x) => (x.id === el.id ? { ...x, lock: !x.lock } : x))
                      );
                    }}
                    className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded ${
                      el.lock
                        ? 'bg-red-600/70 hover:bg-red-500/90'
                        : 'bg-gray-600/70 hover:bg-gray-500/90'
                    }`}
                    title={el.lock ? 'Desbloquear' : 'Bloquear'}
                  >
                    {el.lock ? '🔒' : '🔓'}
                  </button>

                  <div
                    className={`w-full rounded-md px-2 py-1 flex items-center justify-between bg-gradient-to-br ${statusColors[el.status!]}`}
                  >
                    <div className="text-sm font-semibold text-gray-50 tracking-wide">{el.label}</div>
                    <div className="text-xs text-gray-100 font-medium">{el.seats}✦</div>
                  </div>
                </div>
              )}

              {/* REFERÊNCIA */}
              {el.tipo === 'referencia' && (
                <div
                  className={`relative w-full h-full rounded-md border ${
                    el.lock ? 'border-red-600/80 opacity-70' : 'border-sky-700'
                  } bg-[#16202a]
                  shadow-[inset_0_0_10px_#00000070,0_0_20px_#0284c730] p-2 text-sm text-gray-200 flex items-center justify-center`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElementos((prev) =>
                        prev.map((x) => (x.id === el.id ? { ...x, lock: !x.lock } : x))
                      );
                    }}
                    className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded ${
                      el.lock
                        ? 'bg-red-600/70 hover:bg-red-500/90'
                        : 'bg-gray-600/70 hover:bg-gray-500/90'
                    }`}
                    title={el.lock ? 'Desbloquear' : 'Bloquear'}
                  >
                    {el.lock ? '🔒' : '🔓'}
                  </button>

                  {editing === el.id ? (
                    <input
                      autoFocus
                      value={el.label}
                      onChange={(e) =>
                        updateElementos((prev) =>
                          prev.map((x) => (x.id === el.id ? { ...x, label: e.target.value } : x))
                        )
                      }
                      onBlur={() => setEditing(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                      className="w-full text-center bg-transparent outline-none text-gray-100"
                    />
                  ) : (
                    <span>{el.label}</span>
                  )}
                </div>
              )}

              {/* Handles de resize */}
              {!el.lock &&
                ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'].map(
                  (dir) => (
                    <div
                      key={dir}
                      onMouseDown={(e) => startResize(e, el.id, dir)}
                      className={`absolute opacity-0 group-hover:opacity-100 bg-cyan-500 rounded-full ${
                        dir === 'top-left'
                          ? 'left-0 top-0 w-4 h-4 -translate-x-2 -translate-y-2 cursor-nwse-resize'
                          : dir === 'top-right'
                          ? 'right-0 top-0 w-4 h-4 translate-x-2 -translate-y-2 cursor-nesw-resize'
                          : dir === 'bottom-left'
                          ? 'left-0 bottom-0 w-4 h-4 -translate-x-2 translate-y-2 cursor-nesw-resize'
                          : dir === 'bottom-right'
                          ? 'right-0 bottom-0 w-4 h-4 translate-x-2 translate-y-2 cursor-nwse-resize'
                          : dir === 'top'
                          ? 'left-1/2 top-0 -translate-x-1/2 -translate-y-2 w-8 h-4 cursor-ns-resize'
                          : dir === 'bottom'
                          ? 'left-1/2 bottom-0 -translate-x-1/2 translate-y-2 w-8 h-4 cursor-ns-resize'
                          : dir === 'left'
                          ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-4 h-8 cursor-ew-resize'
                          : 'right-0 top-1/2 -translate-y-1/2 translate-x-2 w-4 h-8 cursor-ew-resize'
                      }`}
                    />
                  )
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
