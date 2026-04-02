import { useState, type CSSProperties } from 'react';
import { TrendingUp } from 'lucide-react';
import { modules, toneStyles } from '@/shared/config/navigation';
import { delay, formatCurrency, formatPercent } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorAlert } from '@/shared/ui/ErrorAlert';
import { LoadingState } from '@/shared/ui/LoadingState';
import sharedStyles from '@/shared/ui/ModulePage.module.css';
import { ResultSection } from '@/shared/ui/ResultSection';
import { RiskBadge } from '@/shared/ui/RiskBadge';
import { SplitWorkspace } from '@/shared/ui/SplitWorkspace';
import { Surface } from '@/shared/ui/Surface';
import { TextField } from '@/shared/ui/TextField';

type ResultStatus = 'idle' | 'loading' | 'ready';

interface LoanResult {
  totalPayment: number;
  overpayment: number;
  overpaymentPercent: number;
  effectiveRate: number;
  recommendation: string;
  warnings: string[];
  riskLevel: 'low' | 'medium' | 'high';
  breakdown: Array<{ label: string; value: string }>;
}

const moduleMeta = modules.find((module) => module.key === 'loan-analyzer')!;
const tone = toneStyles[moduleMeta.tone];
const demoForm = {
  amount: '1000000',
  duration: '24',
  monthlyPayment: '52000',
  fees: '15000',
  insurance: '8000',
};

function toNumber(value: string) {
  return Number(value.replace(/[^\d.]/g, ''));
}

function buildLoanResult(values: typeof demoForm): LoanResult {
  const amount = toNumber(values.amount);
  const duration = toNumber(values.duration);
  const monthlyPayment = toNumber(values.monthlyPayment);
  const fees = toNumber(values.fees);
  const insurance = toNumber(values.insurance);
  const totalPayment = monthlyPayment * duration + fees + insurance;
  const overpayment = totalPayment - amount;
  const overpaymentPercent = (overpayment / amount) * 100;
  const effectiveRate = overpaymentPercent / 1.24;

  return {
    totalPayment,
    overpayment,
    overpaymentPercent,
    effectiveRate,
    recommendation:
      effectiveRate > 20
        ? 'This offer is expensive for the repayment horizon. Compare alternatives or negotiate fees before signing.'
        : 'The pricing pressure is moderate, but you should still verify whether the insurance is optional.',
    warnings:
      insurance > 0
        ? [
            'Insurance may be optional and can materially change the total cost.',
            'Commission-heavy offers often look cheaper only because the headline rate hides fees.',
          ]
        : ['Check early repayment penalties before accepting the agreement.'],
    riskLevel: effectiveRate > 22 ? 'high' : effectiveRate > 16 ? 'medium' : 'low',
    breakdown: [
      { label: 'Principal', value: formatCurrency(amount) },
      { label: 'Interest and spread', value: formatCurrency(totalPayment - amount - fees - insurance) },
      { label: 'Fees', value: formatCurrency(fees) },
      { label: 'Insurance', value: formatCurrency(insurance) },
    ],
  };
}

export function LoanAnalyzerView() {
  const [form, setForm] = useState(demoForm);
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<LoanResult | null>(null);

  const updateField = (field: keyof typeof demoForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const analyze = async (values: typeof demoForm) => {
    if (!values.amount || !values.duration || !values.monthlyPayment) {
      setError('Amount, duration, and monthly payment are required.');
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');
    await delay(950);
    setResult(buildLoanResult(values));
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
          <TrendingUp size={16} />
          Loan Analyzer
        </span>
        <div className={sharedStyles.headerRow}>
          <div className={sharedStyles.headingBlock}>
            <h1>Make the true cost of a loan impossible to hide.</h1>
            <p>
              Use the key numbers from a loan offer to estimate total payment, overpayment, hidden pressure, and a practical recommendation.
            </p>
          </div>
          <span className={sharedStyles.toneBadge}>Cost pressure</span>
        </div>
      </header>

      <SplitWorkspace
        left={
          <Surface className={sharedStyles.panel}>
            <div className={sharedStyles.panelBody}>
              <div className={sharedStyles.gridTwo}>
                <TextField label="Loan amount" placeholder="1000000" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} />
                <TextField label="Duration (months)" placeholder="24" value={form.duration} onChange={(event) => updateField('duration', event.target.value)} />
                <TextField label="Monthly payment" placeholder="52000" value={form.monthlyPayment} onChange={(event) => updateField('monthlyPayment', event.target.value)} />
                <TextField label="Fees" placeholder="15000" value={form.fees} onChange={(event) => updateField('fees', event.target.value)} />
              </div>

              <TextField label="Insurance" placeholder="8000" value={form.insurance} onChange={(event) => updateField('insurance', event.target.value)} />

              <div className={sharedStyles.actionRow}>
                <Button onClick={() => analyze(form)}>Analyze loan</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setForm(demoForm);
                    void analyze(demoForm);
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
                title="No calculation yet"
                message="Enter the core loan terms to estimate the true total payment and risk level."
              />
            )}
            {status === 'loading' && (
              <LoadingState title="Calculating loan" message="Estimating total payment, effective rate pressure, and fee load." />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <div className={sharedStyles.headerRow}>
                    <div className={sharedStyles.gridTwo}>
                      <div className={sharedStyles.metricCard}>
                        <span className={sharedStyles.metricLabel}>Total payment</span>
                        <strong className={sharedStyles.metricValue}>{formatCurrency(result.totalPayment)}</strong>
                      </div>
                      <div className={sharedStyles.metricCard}>
                        <span className={sharedStyles.metricLabel}>Overpayment</span>
                        <strong className={sharedStyles.metricValue}>{formatCurrency(result.overpayment)}</strong>
                      </div>
                    </div>
                    <RiskBadge level={result.riskLevel}>
                      {result.riskLevel === 'high' ? 'High risk' : result.riskLevel === 'medium' ? 'Medium risk' : 'Low risk'}
                    </RiskBadge>
                  </div>

                  <ResultSection title="Overpayment ratio">
                    <div className={sharedStyles.callout}>
                      <strong>{formatPercent(result.overpaymentPercent)}</strong>
                      <p className={sharedStyles.muted}>Effective pressure estimate: {formatPercent(result.effectiveRate)}</p>
                      <div className={sharedStyles.progressTrack}>
                        <div className={sharedStyles.progressBar} style={{ width: `${Math.min(result.overpaymentPercent, 100)}%` }} />
                      </div>
                    </div>
                  </ResultSection>

                  <ResultSection title="Cost breakdown">
                    <div className={sharedStyles.keyValueList}>
                      {result.breakdown.map((item) => (
                        <div key={item.label} className={sharedStyles.keyValueRow}>
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title="Recommendation">
                    <div className={sharedStyles.callout}>
                      <strong>Decision signal</strong>
                      <p>{result.recommendation}</p>
                    </div>
                  </ResultSection>

                  <ResultSection title="Warnings">
                    <div className={sharedStyles.warningStack}>
                      {result.warnings.map((warning) => (
                        <div key={warning} className={sharedStyles.warningItem}>
                          <span className={sharedStyles.listMarker}>!</span>
                          <p className={sharedStyles.muted}>{warning}</p>
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
