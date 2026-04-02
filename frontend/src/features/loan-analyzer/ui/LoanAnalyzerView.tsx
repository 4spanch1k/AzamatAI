import { useState, type CSSProperties } from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
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
const autoLoanForm = {
  amount: '3500000',
  duration: '60',
  monthlyPayment: '98000',
  fees: '40000',
  insurance: '120000',
};
const loanPresetKeys = ['consumer', 'auto'] as const;
type LoanPresetKey = (typeof loanPresetKeys)[number];

function toNumber(value: string) {
  return Number(value.replace(/[^\d.]/g, ''));
}

function buildLoanResult(
  values: typeof demoForm,
  copy: ReturnType<typeof useLanguage>['messages']['loanAnalyzer'],
  locale: string,
): LoanResult {
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
        ? copy.recommendations.expensive
        : copy.recommendations.moderate,
    warnings:
      insurance > 0
        ? copy.warningsByInsurance.withInsurance
        : copy.warningsByInsurance.withoutInsurance,
    riskLevel: effectiveRate > 22 ? 'high' : effectiveRate > 16 ? 'medium' : 'low',
    breakdown: [
      { label: copy.breakdownLabels.principal, value: formatCurrency(amount, locale) },
      {
        label: copy.breakdownLabels.interest,
        value: formatCurrency(totalPayment - amount - fees - insurance, locale),
      },
      { label: copy.breakdownLabels.fees, value: formatCurrency(fees, locale) },
      { label: copy.breakdownLabels.insurance, value: formatCurrency(insurance, locale) },
    ],
  };
}

export function LoanAnalyzerView() {
  const { messages, locale } = useLanguage();
  const copy = messages.loanAnalyzer;
  const [form, setForm] = useState(demoForm);
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<LoanResult | null>(null);

  const updateField = (field: keyof typeof demoForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const analyze = async (values: typeof demoForm) => {
    if (!values.amount || !values.duration || !values.monthlyPayment) {
      setError(copy.errorMessage);
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');
    await delay(950);
    setResult(buildLoanResult(values, copy, locale));
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
              <div className={sharedStyles.gridTwo}>
                <TextField hint={copy.labelHints.amount} label={copy.labels.amount} placeholder={copy.placeholders.amount} value={form.amount} onChange={(event) => updateField('amount', event.target.value)} />
                <TextField hint={copy.labelHints.duration} label={copy.labels.duration} placeholder={copy.placeholders.duration} value={form.duration} onChange={(event) => updateField('duration', event.target.value)} />
                <TextField hint={copy.labelHints.monthlyPayment} label={copy.labels.monthlyPayment} placeholder={copy.placeholders.monthlyPayment} value={form.monthlyPayment} onChange={(event) => updateField('monthlyPayment', event.target.value)} />
                <TextField hint={copy.labelHints.fees} label={copy.labels.fees} placeholder={copy.placeholders.fees} value={form.fees} onChange={(event) => updateField('fees', event.target.value)} />
              </div>

              <TextField hint={copy.labelHints.insurance} label={copy.labels.insurance} placeholder={copy.placeholders.insurance} value={form.insurance} onChange={(event) => updateField('insurance', event.target.value)} />

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

              <div className={sharedStyles.sectionIntro}>
                <strong>{copy.presetsLabel}</strong>
                <p className={sharedStyles.muted}>{copy.presetsHint}</p>
              </div>
              <div className={sharedStyles.chips}>
                {loanPresetKeys.map((presetKey) => {
                  const presetForm = presetKey === 'consumer' ? demoForm : autoLoanForm;
                  const isActive = Object.entries(presetForm).every(([key, value]) => form[key as keyof typeof demoForm] === value);

                  return (
                    <button
                      key={presetKey}
                      className={`${sharedStyles.chip} ${isActive ? sharedStyles.chipActive : ''}`}
                      onClick={() => setForm(presetForm)}
                      type="button"
                    >
                      {copy.presetLabels[presetKey as LoanPresetKey]}
                    </button>
                  );
                })}
              </div>

              <div className={sharedStyles.actionRow}>
                <Button onClick={() => analyze(form)}>{copy.analyzeButton}</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setForm(demoForm);
                    void analyze(demoForm);
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
                eyebrow={copy.emptyEyebrow}
                items={copy.emptyItems}
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
                    <div className={sharedStyles.gridTwo}>
                      <div className={sharedStyles.metricCard}>
                        <span className={sharedStyles.metricLabel}>{copy.totalPayment}</span>
                        <strong className={sharedStyles.metricValue}>{formatCurrency(result.totalPayment, locale)}</strong>
                      </div>
                      <div className={sharedStyles.metricCard}>
                        <span className={sharedStyles.metricLabel}>{copy.overpayment}</span>
                        <strong className={sharedStyles.metricValue}>{formatCurrency(result.overpayment, locale)}</strong>
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

                  <ResultSection title={copy.overpaymentRatio}>
                    <div className={sharedStyles.callout}>
                      <strong>{formatPercent(result.overpaymentPercent, locale)}</strong>
                      <p className={sharedStyles.muted}>
                        {copy.effectivePressureEstimate}: {formatPercent(result.effectiveRate, locale)}
                      </p>
                      <div className={sharedStyles.progressTrack}>
                        <div className={sharedStyles.progressBar} style={{ width: `${Math.min(result.overpaymentPercent, 100)}%` }} />
                      </div>
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.costBreakdown}>
                    <div className={sharedStyles.keyValueList}>
                      {result.breakdown.map((item) => (
                        <div key={item.label} className={sharedStyles.keyValueRow}>
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.recommendation}>
                    <div className={sharedStyles.callout}>
                      <strong>{copy.decisionSignal}</strong>
                      <p>{result.recommendation}</p>
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.warnings}>
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
