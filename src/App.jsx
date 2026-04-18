import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, GitBranch, Database, Cloud, Layers, Box, ArrowRight, Lock, Server, AlertCircle, Loader } from 'lucide-react'

const ICON_MAP = {
  'box': Box,
  'git-branch': GitBranch,
  'layers': Layers,
  'database': Database,
  'cloud': Cloud,
  'lock': Lock,
  'server': Server,
}

const COLOR_SCHEMES = {
  purple: { card: 'bg-purple-100 border-purple-400 text-purple-800', header: 'bg-purple-400' },
  blue:   { card: 'bg-blue-100 border-blue-400 text-blue-800',   header: 'bg-blue-400' },
  green:  { card: 'bg-green-100 border-green-400 text-green-800', header: 'bg-green-400' },
  orange: { card: 'bg-orange-100 border-orange-400 text-orange-800', header: 'bg-orange-400' },
  yellow: { card: 'bg-yellow-100 border-yellow-400 text-yellow-800', header: 'bg-yellow-400' },
  red:    { card: 'bg-red-100 border-red-400 text-red-800',   header: 'bg-red-400' },
  gray:   { card: 'bg-gray-100 border-gray-400 text-gray-800', header: 'bg-gray-400' },
}

// ── Tab type: cards ────────────────────────────────────────────────────────
function CardsTab({ tab }) {
  const [activeId, setActiveId] = useState(null)
  const scheme = (c) => COLOR_SCHEMES[c] || COLOR_SCHEMES.gray

  return (
    <div className="space-y-6">
      {tab.preview && (
        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <p className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-widest">{tab.preview.label}</p>
          <code className="text-green-400 font-mono text-sm whitespace-nowrap">{tab.preview.value}</code>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tab.items.map((item) => {
          const s = scheme(item.colorScheme)
          const open = activeId === item.id
          return (
            <div
              key={item.id}
              className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${s.card}`}
              onClick={() => setActiveId(open ? null : item.id)}
            >
              <div className={`${s.header} px-4 py-2 flex items-center justify-between`}>
                <span className="font-semibold text-white text-sm">{item.label}</span>
                {open ? <ChevronDown className="text-white w-4 h-4" /> : <ChevronRight className="text-white w-4 h-4" />}
              </div>
              <div className="p-4">
                <p className="text-xs mb-2 opacity-75">{item.description}</p>
                <code className="text-xs font-mono font-bold">{item.example}</code>
                {open && item.segments && (
                  <div className="mt-3 space-y-2">
                    {item.segments.map((seg) => (
                      <div key={seg.label} className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-2">
                        <span className="font-mono text-xs font-bold min-w-fit">&lt;{seg.label}&gt;</span>
                        <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 opacity-50" />
                        <div>
                          <span className="font-mono text-xs font-semibold text-gray-800">{seg.value}</span>
                          <p className="text-xs text-gray-500">{seg.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {tab.footer && <p className="text-xs text-gray-400 text-center">{tab.footer}</p>}
    </div>
  )
}

// ── Tab type: pipeline ─────────────────────────────────────────────────────
function PipelineTab({ tab }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const badgeColors = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500', blue: 'bg-blue-500', gray: 'bg-gray-500' }
  const borderColors = { green: 'bg-green-100 border-green-400', yellow: 'bg-yellow-100 border-yellow-400', red: 'bg-red-100 border-red-400', blue: 'bg-blue-100 border-blue-400', gray: 'bg-gray-100 border-gray-400' }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-2 justify-center">
        {tab.stages.map((stage, i) => (
          <div key={stage.branch} className="flex items-center gap-2">
            <button
              className={`border-2 rounded-xl px-5 py-3 text-left transition-shadow hover:shadow-md w-48 ${borderColors[stage.colorScheme] || borderColors.gray} ${activeIdx === i ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            >
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 opacity-60" />
                <code className="text-xs font-mono font-bold">{stage.branch}</code>
                <span className={`ml-auto text-xs text-white px-1.5 py-0.5 rounded-full ${badgeColors[stage.colorScheme] || badgeColors.gray}`}>{stage.env}</span>
              </div>
              <p className="text-xs text-gray-500">{stage.gate}</p>
            </button>
            {i < tab.stages.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />}
          </div>
        ))}
      </div>

      {activeIdx !== null && (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Matrix Deployment — <code className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded">{tab.stages[activeIdx].env}</code>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tab.stages[activeIdx].stacks.map((stack) => (
              <div key={stack} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="w-4 h-4 text-blue-500" />
                  <code className="text-xs font-mono text-gray-700 truncate">{stack}</code>
                </div>
                {tab.stackCommand && (
                  <div className="text-xs text-gray-400 font-mono bg-gray-50 rounded p-2">
                    {tab.stackCommand.replace('{stack}', stack)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {tab.backends && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              {tab.backends.map((backend) => {
                const Icon = ICON_MAP[backend.icon] || Server
                const backendColors = {
                  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 text-yellow-600',
                  blue:   'bg-blue-50 border-blue-200 text-blue-800 text-blue-600',
                }
                const bc = backendColors[backend.colorScheme] || backendColors.blue
                return (
                  <div key={backend.title} className={`flex-1 border rounded-lg p-3 flex items-start gap-3 ${bc.split(' ').slice(0,2).join(' ')}`}>
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${bc.split(' ')[2]}`} />
                    <div>
                      <p className={`text-sm font-semibold ${bc.split(' ')[2]}`}>{backend.title} — {backend.subtitle}</p>
                      <p className={`text-xs mt-1 ${bc.split(' ')[3]}`}>{backend.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      {tab.footer && <p className="text-xs text-gray-400 text-center">{tab.footer}</p>}
    </div>
  )
}

// ── Tab type: hierarchy ────────────────────────────────────────────────────
function HierarchyTab({ tab }) {
  return (
    <div className="space-y-4">
      {tab.description && <p className="text-sm text-gray-500">{tab.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tab.domains.map((domain) => (
          <div key={domain.name} className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-white" />
              <span className="font-mono text-white text-sm font-bold">Project: {domain.name}</span>
            </div>
            <div className="p-3 space-y-2">
              {domain.stacks.map((stack, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <code className="font-mono text-xs text-gray-600">{stack}</code>
                  <Server className="w-3 h-3 text-gray-300 ml-auto" />
                </div>
              ))}
              {tab.note && <p className="text-xs text-gray-400 pt-1">{tab.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TAB_RENDERERS = { cards: CardsTab, pipeline: PipelineTab, hierarchy: HierarchyTab }

// ── Root app ───────────────────────────────────────────────────────────────
export default function App() {
  const [config, setConfig] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const configUrl = params.get('config') || '/config.json'
    fetch(configUrl)
      .then((r) => { if (!r.ok) throw new Error(`Failed to fetch config: ${r.status}`); return r.json() })
      .then((data) => { setConfig(data); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-gray-700 font-medium">Failed to load config</p>
        <p className="text-sm text-gray-400">{error}</p>
        <p className="text-xs text-gray-400">Pass a URL via <code className="font-mono bg-gray-100 px-1 rounded">?config=https://...</code></p>
      </div>
    </div>
  )

  const tab = config.tabs[activeTab]
  const Renderer = TAB_RENDERERS[tab.type]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{config.title}</h1>
          {config.subtitle && <p className="text-gray-500 text-sm">{config.subtitle}</p>}
        </div>

        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-6">
          {config.tabs.map((t, i) => {
            const Icon = ICON_MAP[t.icon] || Box
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {Renderer ? <Renderer tab={tab} /> : <p className="text-gray-400 text-sm">Unknown tab type: {tab.type}</p>}
        </div>
      </div>
    </div>
  )
}
