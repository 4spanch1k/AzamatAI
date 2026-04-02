import { useState, type CSSProperties } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { modules, toneStyles } from '@/shared/config/navigation';
import { delay } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorAlert } from '@/shared/ui/ErrorAlert';
import { LoadingState } from '@/shared/ui/LoadingState';
import sharedStyles from '@/shared/ui/ModulePage.module.css';
import { ResultSection } from '@/shared/ui/ResultSection';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { SplitWorkspace } from '@/shared/ui/SplitWorkspace';
import { Surface } from '@/shared/ui/Surface';
import { TextAreaField } from '@/shared/ui/TextAreaField';

type ResultStatus = 'idle' | 'loading' | 'ready';

interface NavigatorResult {
  goal: string;
  documents: string[];
  steps: Array<{ title: string; description: string }>;
  whereToApply: string;
  notes: string[];
  riskLevel: 'low' | 'medium';
}

const moduleMeta = modules.find((module) => module.key === 'egov-navigator')!;
const tone = toneStyles[moduleMeta.tone];

function buildNavigatorResult(
  goal: string,
  copy: ReturnType<typeof useLanguage>['messages']['egovNavigator'],
): NavigatorResult {
  const normalized = goal.toLowerCase();

  if (
    normalized.includes('certificate') ||
    normalized.includes('справк') ||
    normalized.includes('анықтама')
  ) {
    return {
      goal: copy.results.certificate.goal,
      documents: copy.results.certificate.documents,
      steps: copy.results.certificate.steps,
      whereToApply: copy.results.certificate.whereToApply,
      notes: copy.results.certificate.notes,
      riskLevel: 'low',
    };
  }

  return {
    goal: copy.results.entrepreneur.goal,
    documents: copy.results.entrepreneur.documents,
    steps: copy.results.entrepreneur.steps,
    whereToApply: copy.results.entrepreneur.whereToApply,
    notes: copy.results.entrepreneur.notes,
    riskLevel: 'medium',
  };
}

export function EGovNavigatorView() {
  const { messages } = useLanguage();
  const copy = messages.egovNavigator;
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<NavigatorResult | null>(null);

  const run = async (source: string) => {
    if (!source.trim()) {
      setError(copy.errorMessage);
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');
    await delay(850);
    setResult(buildNavigatorResult(source, copy));
    setStatus('ready');
  };

  return (
    <div
      className={sharedStyles.page}
      style={
        {
          '--tone-solid': tone.solid,
          '--tone-soft': tone.soft,
          '--tone-border': tone.border,
        } as CSSProperties
      }
    >
      <header className={sharedStyles.header}>
        <span className={sharedStyles.kicker}>
          <Globe size={16} />
          {copy.kicker}
        </span>
        <div className={sharedStyles.headerRow}>
          <div className={sharedStyles.headingBlock}>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <span className={sharedStyles.toneBadge}>{copy.toneBadge}</span>
        </div>
      </header>

      <SplitWorkspace
        left={
          <Surface className={sharedStyles.panel}>
            <div className={sharedStyles.panelBody}>
              <TextAreaField
                hint={copy.fieldHint}
                label={copy.fieldLabel}
                placeholder={copy.fieldPlaceholder}
                rows={12}
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />

              <div>
                <strong>{copy.popularRequests}</strong>
                <div className={sharedStyles.chips}>
                  {copy.examples.map((example) => (
                    <button
                      key={example}
                      className={`${sharedStyles.chip} ${goal === example ? sharedStyles.chipActive : ''}`}
                      onClick={() => setGoal(example)}
                      type="button"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className={sharedStyles.actionRow}>
                <Button onClick={() => run(goal)}>{copy.showStepsButton}</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setGoal(copy.demoGoal);
                    void run(copy.demoGoal);
                  }}
                >
                  {copy.tryDemoButton}
                </Button>
              </div>
            </div>
          </Surface>
        }
        right={
          <>
            {error && <ErrorAlert message={error} />}
            {status === 'idle' && !result && (
              <EmptyState
                title={copy.emptyTitle}
                message={copy.emptyMessage}
              />
            )}
            {status === 'loading' && (
              <LoadingState title={copy.loadingTitle} message={copy.loadingMessage} />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <div className={sharedStyles.headerRow}>
                    <ResultSection eyebrow={copy.goalEyebrow} title={result.goal}>
                      <p className={sharedStyles.muted}>{copy.goalPrepared}</p>
                    </ResultSection>
                    <RiskBadge level={result.riskLevel}>
                      {result.riskLevel === 'low' ? copy.lowFriction : copy.needsCare}
                    </RiskBadge>
                  </div>

                  <ResultSection title={copy.requiredDocuments}>
                    <div className={sharedStyles.list}>
                      {result.documents.map((item) => (
                        <div key={item} className={sharedStyles.listItem}>
                          <span className={sharedStyles.listMarker}>✓</span>
                          <p className={sharedStyles.muted}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.stepsTitle}>
                    <div className={sharedStyles.numberedList}>
                      {result.steps.map((step, index) => (
                        <div key={step.title} className={sharedStyles.numberItem}>
                          <span className={sharedStyles.numberIndex}>{index + 1}</span>
                          <div className={sharedStyles.numberBody}>
                            <strong>{step.title}</strong>
                            <p>{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.whereToApply}>
                    <div className={sharedStyles.callout}>
                      <strong>{result.whereToApply}</strong>
                      <p>{copy.whereToApplyNote}</p>
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.notesWarnings}>
                    <div className={sharedStyles.warningStack}>
                      {result.notes.map((item) => (
                        <div key={item} className={sharedStyles.warningItem}>
                          <span className={sharedStyles.listMarker}>!</span>
                          <p className={sharedStyles.muted}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                </div>
              </Surface>
            )}
          </>
        }
      />
    </div>
  );
}
