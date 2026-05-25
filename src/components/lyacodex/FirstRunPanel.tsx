import { useEffect, useState } from 'react';
import { Cpu, Sparkles, Cloud, HardDrive } from 'lucide-react';
import { FirstRunPlan, getFirstRunPlan } from '../../core/lyacodex/client';

export function FirstRunPanel() {
  const [plan, setPlan] = useState<FirstRunPlan | null>(null);

  useEffect(() => {
    getFirstRunPlan()
      .then(setPlan)
      .catch(console.error);
  }, []);

  if (!plan) {
    return (
      <div className="first-run-panel">
        <div className="first-run-loading">
          LyaCodex II is waking up...
        </div>
      </div>
    );
  }

  return (
    <div className="first-run-panel">
      <div className="first-run-header">
        <div className="first-run-whisper">{plan.whisper}</div>
        <h1>{plan.title}</h1>
        <div className="first-run-philosophy">
          {plan.philosophy}
        </div>
      </div>

      <div className="first-run-options">
        {plan.options.map((option) => {
          const icon = option.kind.includes('local')
            ? <HardDrive size={18} />
            : option.kind.includes('cloud')
            ? <Cloud size={18} />
            : <Cpu size={18} />;

          return (
            <div
              key={option.id}
              className={`first-run-option ${option.recommended ? 'recommended' : ''}`}
            >
              <div className="first-run-option-header">
                <div className="first-run-option-title">
                  {option.recommended && (
                    <Sparkles size={16} className="first-run-star" />
                  )}
                  {icon}
                  <span>{option.title}</span>
                </div>
              </div>

              <div className="first-run-option-subtitle">
                {option.subtitle}
              </div>

              <div className="first-run-option-flags">
                {option.requires_download && (
                  <span className="flag">download</span>
                )}
                {option.requires_key && (
                  <span className="flag">api key</span>
                )}
                {!option.requires_key && (
                  <span className="flag">local-ready</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
