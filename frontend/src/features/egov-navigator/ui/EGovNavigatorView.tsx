import { useState, type CSSProperties } from 'react';
import { Globe } from 'lucide-react';
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
const demoGoal = 'I need to register as an individual entrepreneur in Kazakhstan.';

function buildNavigatorResult(goal: string): NavigatorResult {
  if (goal.toLowerCase().includes('certificate')) {
    return {
      goal: 'Obtain a digital certificate or reference through eGov',
      documents: ['IIN', 'Phone number linked to eGov account', 'Digital signature or OTP access'],
      steps: [
        { title: 'Open egov.kz and sign in', description: 'Use EDS, QR, or OTP depending on the service.' },
        { title: 'Search for the certificate service', description: 'Use the portal search and verify the service owner.' },
        { title: 'Request the certificate', description: 'Submit the request and check whether a fee applies.' },
        { title: 'Download or forward the result', description: 'Store the PDF and verify expiry if the document has one.' },
      ],
      whereToApply: 'egov.kz portal or the mobile eGov app',
      notes: ['Some certificates are instant; others require manual review.', 'Verify whether the receiving institution accepts a digital copy.'],
      riskLevel: 'low',
    };
  }

  return {
    goal: 'Register as an individual entrepreneur (IP)',
    documents: ['Identity card', 'IIN', 'EDS or mobile signature access'],
    steps: [
      { title: 'Sign in to egov.kz', description: 'Use your digital signature or another verified login option.' },
      { title: 'Open the business registration service', description: 'Look for IP registration under business services.' },
      { title: 'Fill in the activity details', description: 'Choose business codes and verify contact information.' },
      { title: 'Submit and monitor status', description: 'Store the confirmation and wait for processing.' },
    ],
    whereToApply: 'egov.kz, business services section',
    notes: ['Check whether your chosen activity code matches the real business model.', 'Keep the registration confirmation for tax and bank onboarding.'],
    riskLevel: 'medium',
  };
}

export function EGovNavigatorView() {
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<NavigatorResult | null>(null);

  const run = async (source: string) => {
    if (!source.trim()) {
      setError('Describe the government task first.');
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');
    await delay(850);
    setResult(buildNavigatorResult(source));
    setStatus('ready');
  };

  const examples = [
    'Register an individual entrepreneur',
    'Get a certificate',
    'Pay a tax debt',
  ];

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
          eGov Navigator
        </span>
        <div className={sharedStyles.headerRow}>
          <div className={sharedStyles.headingBlock}>
            <h1>Turn a public-service goal into a usable route.</h1>
            <p>
              Describe what you need to do on egov.kz and get documents, steps, application point,
              and caution notes in one structured answer.
            </p>
          </div>
          <span className={sharedStyles.toneBadge}>Step-by-step guide</span>
        </div>
      </header>

      <SplitWorkspace
        left={
          <Surface className={sharedStyles.panel}>
            <div className={sharedStyles.panelBody}>
              <TextAreaField
                hint="One task per request works best"
                label="What do you need to do?"
                placeholder="Describe the government service you need..."
                rows={12}
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />

              <div>
                <strong>Popular requests</strong>
                <div className={sharedStyles.chips}>
                  {examples.map((example) => (
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
                <Button onClick={() => run(goal)}>Show steps</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setGoal(demoGoal);
                    void run(demoGoal);
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
                title="No guide yet"
                message="Describe the outcome you need and the navigator will map the route, documents, and next steps."
              />
            )}
            {status === 'loading' && (
              <LoadingState title="Building route" message="Matching the request to the right document list and portal flow." />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <div className={sharedStyles.headerRow}>
                    <ResultSection eyebrow="Goal" title={result.goal}>
                      <p className={sharedStyles.muted}>Prepared as a practical route through the eGov experience.</p>
                    </ResultSection>
                    <RiskBadge level={result.riskLevel}>{result.riskLevel === 'low' ? 'Low friction' : 'Needs care'}</RiskBadge>
                  </div>

                  <ResultSection title="Required documents">
                    <div className={sharedStyles.list}>
                      {result.documents.map((item) => (
                        <div key={item} className={sharedStyles.listItem}>
                          <span className={sharedStyles.listMarker}>✓</span>
                          <p className={sharedStyles.muted}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title="Steps">
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

                  <ResultSection title="Where to apply">
                    <div className={sharedStyles.callout}>
                      <strong>{result.whereToApply}</strong>
                      <p>Check the exact service owner and whether in-person confirmation is still required.</p>
                    </div>
                  </ResultSection>

                  <ResultSection title="Notes and warnings">
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
