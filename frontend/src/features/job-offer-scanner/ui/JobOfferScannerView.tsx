import { useState, type CSSProperties } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { scanJob, type JobScanResult } from '@/features/job-offer-scanner/service';
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

const moduleMeta = modules.find((module) => module.key === 'job-offer-scanner')!;
const tone = toneStyles[moduleMeta.tone];

export function JobOfferScannerView() {
  const { messages } = useLanguage();
  const copy = messages.jobOfferScanner;
  const [jobText, setJobText] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<JobScanResult | null>(null);
  const isLoading = status === 'loading';
  const isRequestError = error === messages.common.requestFailed;
  const resultMeta = `${messages.common.resultReady} · ${messages.common.generatedNow}`;

  const scan = async (source: string) => {
    if (isLoading) {
      return;
    }

    if (!source.trim()) {
      setError(copy.errorMessage);
      setStatus('idle');
      setResult(null);
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const nextResult = await scanJob(source);
      setResult(nextResult);
      setStatus('ready');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, messages.common.requestFailed));
      setStatus('idle');
      setResult(null);
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
          <BriefcaseBusiness size={16} />
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
                rows={13}
                value={jobText}
                disabled={isLoading}
                onChange={(event) => setJobText(event.target.value)}
              />

              <div className={sharedStyles.sectionIntro}>
                <strong>{copy.examplesLabel}</strong>
                <p className={sharedStyles.muted}>{copy.examplesHint}</p>
              </div>
              <div className={sharedStyles.chips}>
                {copy.examples.map((example) => (
                  <button
                    key={example.label}
                    className={`${sharedStyles.chip} ${jobText === example.value ? sharedStyles.chipActive : ''}`}
                    disabled={isLoading}
                    onClick={() => setJobText(example.value)}
                    type="button"
                  >
                    {example.label}
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
                <Button disabled={isLoading} onClick={() => scan(jobText)}>{copy.scanButton}</Button>
                <Button
                  disabled={isLoading}
                  variant="secondary"
                  onClick={() => {
                    setJobText(copy.demoOffer);
                    void scan(copy.demoOffer);
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
                onAction={isRequestError ? () => void scan(jobText) : undefined}
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
                    <div className={sharedStyles.callout}>
                      <strong>{copy.riskScore} {result.score}/10</strong>
                      <div className={sharedStyles.progressTrack}>
                        <div className={sharedStyles.progressBar} style={{ width: `${result.score * 10}%` }} />
                      </div>
                    </div>
                    <RiskBadge level={result.riskLevel}>
                      {result.riskLevel === 'high'
                        ? copy.highRisk
                        : result.riskLevel === 'medium'
                          ? copy.mediumRisk
                          : copy.lowRisk}
                    </RiskBadge>
                  </div>

                  <ResultSection title={copy.redFlags}>
                    <div className={sharedStyles.warningStack}>
                      {result.flags.map((flag) => (
                        <div key={flag} className={sharedStyles.warningItem}>
                          <span className={sharedStyles.listMarker}>!</span>
                          <p className={sharedStyles.muted}>{flag}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.explanation}>
                    <p className={sharedStyles.muted}>{result.explanation}</p>
                  </ResultSection>

                  <ResultSection title={copy.recommendation}>
                    <div className={sharedStyles.callout}>
                      <strong>{copy.nextAction}</strong>
                      <p>{result.recommendation}</p>
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
