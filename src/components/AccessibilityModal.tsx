import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Eye, Type, Activity, X } from 'lucide-react'

interface AccessibilityModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const { accessibility, updateAccessibility } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="card max-w-md w-full relative">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Eye size={20} />
            </span>
            <h3 className="text-lg font-bold">Accessibility Options</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
            <div>
              <div className="font-semibold text-sm">High Contrast Mode</div>
              <div className="text-xs text-slate-500">Enhanced text contrast for outdoor readability</div>
            </div>
            <button
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                accessibility.highContrast ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition" />
            </button>
          </div>

          {/* Text Sizing */}
          <div className="p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Type size={16} /> Text Sizing
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateAccessibility({ fontSizeScale: size })}
                  className={`py-1.5 text-xs font-bold rounded-lg border capitalize ${
                    accessibility.fontSizeScale === size
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
            <div>
              <div className="font-semibold text-sm">Reduced Motion</div>
              <div className="text-xs text-slate-500">Minimizes animations and map motion</div>
            </div>
            <button
              onClick={() => updateAccessibility({ reducedMotion: !accessibility.reducedMotion })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                accessibility.reducedMotion ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="button-primary text-sm w-full">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
