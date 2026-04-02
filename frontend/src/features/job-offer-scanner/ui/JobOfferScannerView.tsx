import { useState, type CSSProperties } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
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

interface JobResult {
  score: number;
  riskLevel: 'medium' | 'high';
  flags: string[];
  explanation: string;
  recommendation: string;
}

const moduleMeta = modules.find((module) => module.key === 'job-offer-scanner')!;
const tone = toneStyles[moduleMeta.tone];

function buildJobResult(
  text: string,
  copy: ReturnType<typeof useLanguage>['messages']['jobOfferScanner'],
): JobResult {
  const normalized = text.toLowerCase();
  const flags = [];

  if (
    normalized.includes('fee') ||
    normalized.includes('payment') ||
    normalized.includes('взнос') ||
    normalized.includes('төлем')
  ) {
    flags.push(copy.flags.upfrontPayment);
  }
  if (
    normalized.includes('no experience') ||
    normalized.includes('без опыта') ||
    normalized.includes('тәжірибе')
  ) {
    flags.push(copy.flags.noExperience);
  }
  if (
    normalized.includes('remote') ||
    normalized.includes('удал') ||
    normalized.includes('қашықтан')
  ) {
    flags.push(copy.flags.remoteOnly);
  }

  return {
    score: flags.length >= 3 ? 8.1 : 5.6,
    riskLevel: flags.length >= 3 ? 'high' : 'medium',
    flags,
    explanation:
      flags.length >= 3
        ? copy.explanations.high
        : copy.explanations.medium,
    recommendation:
      flags.length >= 3
        ? copy.recommendations.high
        : copy.recommendations.medium,
  };
}

export function JobOfferScannerView() {
  const { messages } = useLanguage();
  const copy = messages.jobOfferScanner;
  const [jobText, setJobText] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<JobResult | null>(null);

  const scan = async (source: string) => {
    if (!source.trim()) {
      setError(copy.errorMessage);
      setStatus('idle');
      setResult(null);
      return;
    }

    setError('');
    setStatus('loading');
    await delay(820);
    setResult(buildJobResult(source, copy));
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
                rows={15}
                value={jobText}
                onChange={(event) => setJobText(event.target.value)}
              />

              <div className={sharedStyles.actionRow}>
                <Button onClick={() => scan(jobText)}>{copy.scanButton}</Button>
                <Button
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
                    <div className={sharedStyles.callout}>
                      <strong>{copy.riskScore} {result.score}/10</strong>
                      <div className={sharedStyles.progressTrack}>
                        <div className={sharedStyles.progressBar} style={{ width: `${result.score * 10}%` }} />
                      </div>
                    </div>
                    <RiskBadge level={result.riskLevel}>
                      {result.riskLevel === 'high' ? copy.highRisk : copy.mediumRisk}
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
