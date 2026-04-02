import { useState, type CSSProperties } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
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
const demoOffer =
  'Remote manager needed. Salary from 1,500,000 KZT. No experience required. Send a registration fee for training materials to reserve your place.';

function buildJobResult(text: string): JobResult {
  const normalized = text.toLowerCase();
  const flags = [];

  if (normalized.includes('fee') || normalized.includes('payment')) {
    flags.push('The offer requests money upfront before employment is confirmed.');
  }
  if (normalized.includes('no experience')) {
    flags.push('Very low entry requirements paired with high pay are a common scam pattern.');
  }
  if (normalized.includes('remote')) {
    flags.push('Remote-only hiring without company verification needs extra caution.');
  }

  return {
    score: flags.length >= 3 ? 8.1 : 5.6,
    riskLevel: flags.length >= 3 ? 'high' : 'medium',
    flags,
    explanation:
      flags.length >= 3
        ? 'Multiple trust signals are missing while pressure to send money appears early. That combination is typical of fraudulent recruiting.'
        : 'There are some caution markers, but the offer still needs company verification and contract review.',
    recommendation:
      flags.length >= 3
        ? 'Do not transfer money or identity documents until the employer is independently verified.'
        : 'Ask for a formal contract, company registration details, and a real interview before moving forward.',
  };
}

export function JobOfferScannerView() {
  const [jobText, setJobText] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<JobResult | null>(null);

  const scan = async (source: string) => {
    if (!source.trim()) {
      setError('Paste the job posting before scanning.');
      setStatus('idle');
      setResult(null);
      return;
    }

    setError('');
    setStatus('loading');
    await delay(820);
    setResult(buildJobResult(source));
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
          Job Offer Scanner
        </span>
        <div className={sharedStyles.headerRow}>
          <div className={sharedStyles.headingBlock}>
            <h1>Check whether a job offer is opportunity or bait.</h1>
            <p>
              Scan listings from Telegram, WhatsApp, or job boards and flag the patterns that often
              signal scam recruitment.
            </p>
          </div>
          <span className={sharedStyles.toneBadge}>Risk scan</span>
        </div>
      </header>

      <SplitWorkspace
        left={
          <Surface className={sharedStyles.panel}>
            <div className={sharedStyles.panelBody}>
              <TextAreaField
                hint="Telegram, hh.kz, direct messages, or social posts"
                label="Job description"
                placeholder="Paste the offer text here..."
                rows={15}
                value={jobText}
                onChange={(event) => setJobText(event.target.value)}
              />

              <div className={sharedStyles.actionRow}>
                <Button onClick={() => scan(jobText)}>Scan job offer</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setJobText(demoOffer);
                    void scan(demoOffer);
                  }}
                >
                  Try demo
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
                title="No scan yet"
                message="Run the scanner to get a risk score, red flags, explanation, and a recommendation."
              />
            )}
            {status === 'loading' && (
              <LoadingState title="Scanning posting" message="Checking the text for payment pressure, vague terms, and trust gaps." />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <div className={sharedStyles.headerRow}>
                    <div className={sharedStyles.callout}>
                      <strong>Risk score {result.score}/10</strong>
                      <div className={sharedStyles.progressTrack}>
                        <div className={sharedStyles.progressBar} style={{ width: `${result.score * 10}%` }} />
                      </div>
                    </div>
                    <RiskBadge level={result.riskLevel}>
                      {result.riskLevel === 'high' ? 'High risk' : 'Medium risk'}
                    </RiskBadge>
                  </div>

                  <ResultSection title="Red flags">
                    <div className={sharedStyles.warningStack}>
                      {result.flags.map((flag) => (
                        <div key={flag} className={sharedStyles.warningItem}>
                          <span className={sharedStyles.listMarker}>!</span>
                          <p className={sharedStyles.muted}>{flag}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title="Explanation">
                    <p className={sharedStyles.muted}>{result.explanation}</p>
                  </ResultSection>

                  <ResultSection title="Recommendation">
                    <div className={sharedStyles.callout}>
                      <strong>What to do next</strong>
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
