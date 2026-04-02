import { useState, type CSSProperties } from 'react';
import { Globe } from 'lucide-react';
import { buildEgovRoute, type EGovRouteResult } from '@/features/egov-navigator/service';
import { getApiErrorMessage } from '@/shared/api/client';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { modules, toneStyles } from '@/shared/config/navigation';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorAlert } from '@/shared/ui/ErrorAlert';
import { LoadingState } from '@/shared/ui/LoadingState';
import sharedStyles from '@/shared/ui/ModulePage.module.css';
import { ResultSection } from '@/shared/ui/ResultSection';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { ResultMeta } from '@/shared/ui/ResultMeta';
import { SplitWorkspace } from '@/shared/ui/SplitWorkspace';
import { Surface } from '@/shared/ui/Surface';
import { TextAreaField } from '@/shared/ui/TextAreaField';

type ResultStatus = 'idle' | 'loading' | 'ready';

const moduleMeta = modules.find((module) => module.key === 'egov-navigator')!;
const tone = toneStyles[moduleMeta.tone];

export function EGovNavigatorView() {
  const { messages } = useLanguage();
  const copy = messages.egovNavigator;
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<EGovRouteResult | null>(null);
  const isLoading = status === 'loading';
  const isRequestError = error === messages.common.requestFailed;
  const resultMeta = `${messages.common.resultReady} · ${messages.common.generatedNow}`;

  const run = async (source: string) => {
    if (isLoading) {
      return;
    }

    if (!source.trim()) {
      setError(copy.errorMessage);
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const nextResult = await buildEgovRoute(source);
      setResult(nextResult);
      setStatus('ready');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, messages.common.requestFailed));
      setResult(null);
      setStatus('idle');
    }
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
                rows={10}
                value={goal}
                disabled={isLoading}
                onChange={(event) => setGoal(event.target.value)}
              />

              <div className={sharedStyles.sectionIntro}>
                <strong>{copy.popularRequests}</strong>
                <p className={sharedStyles.muted}>{copy.examplesHint}</p>
              </div>
              <div className={sharedStyles.chips}>
                {copy.examples.map((example) => (
                  <button
                    key={example}
                    className={`${sharedStyles.chip} ${goal === example ? sharedStyles.chipActive : ''}`}
                    disabled={isLoading}
                    onClick={() => setGoal(example)}
                    type="button"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <div className={sharedStyles.helperCard}>
                <strong>{copy.helperTitle}</strong>
                <ul className={sharedStyles.helperList}>
                  {copy.helperItems.map((item) => (
                    <li key={item} className={sharedStyles.helperListItem}>
                      <span className={sharedStyles.helperMarker}>AI</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={sharedStyles.actionRow}>
                <Button disabled={isLoading} onClick={() => run(goal)}>{copy.showStepsButton}</Button>
                <Button
                  disabled={isLoading}
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
            {error && (
              <ErrorAlert
                actionLabel={isRequestError ? messages.common.retryAction : undefined}
                hint={isRequestError ? messages.common.retryHint : undefined}
                message={error}
                onAction={isRequestError ? () => void run(goal) : undefined}
              />
            )}
            {status === 'idle' && !result && (
              <EmptyState
                eyebrow={copy.emptyEyebrow}
                items={copy.emptyItems}
                title={copy.emptyTitle}
                message={copy.emptyMessage}
              />
            )}
            {status === 'loading' && (
              <LoadingState eyebrow={copy.toneBadge} title={copy.loadingTitle} message={copy.loadingMessage} />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <ResultMeta label={copy.toneBadge} meta={resultMeta} />
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
                      {result.requiredDocuments.map((item) => (
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
                      {result.warnings.map((item) => (
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
