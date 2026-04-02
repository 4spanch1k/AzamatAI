import { useState, type CSSProperties } from 'react';
import { FileText } from 'lucide-react';
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

interface DocumentResult {
  type: string;
  summary: string;
  actions: string[];
  deadline: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskLabel: string;
  warnings: string[];
}

const moduleMeta = modules.find((module) => module.key === 'document-decoder')!;
const tone = toneStyles[moduleMeta.tone];

function buildDocumentResult(source: string, copy: ReturnType<typeof useLanguage>['messages']['documentDecoder']): DocumentResult {
  const normalized = source.toLowerCase();

  if (
    normalized.includes('court') ||
    normalized.includes('claim') ||
    normalized.includes('суд') ||
    normalized.includes('иск') ||
    normalized.includes('талап')
  ) {
    return {
      type: copy.results.court.type,
      summary: copy.results.court.summary,
      actions: copy.results.court.actions,
      deadline: copy.results.court.deadline,
      riskLevel: 'high',
      riskLabel: copy.results.court.riskLabel,
      warnings: copy.results.court.warnings,
    };
  }

  return {
    type: copy.results.tax.type,
    summary: copy.results.tax.summary,
    actions: copy.results.tax.actions,
    deadline: copy.results.tax.deadline,
    riskLevel: 'medium',
    riskLabel: copy.results.tax.riskLabel,
    warnings: copy.results.tax.warnings,
  };
}

export function DocumentDecoderView() {
  const { messages } = useLanguage();
  const copy = messages.documentDecoder;
  const [documentText, setDocumentText] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<DocumentResult | null>(null);

  const analyze = async (source: string) => {
    if (!source.trim()) {
      setError(copy.errorMessage);
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');
    await delay(900);
    setResult(buildDocumentResult(source, copy));
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
          <FileText size={16} />
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
          <>
            <Surface className={sharedStyles.panel}>
              <div className={sharedStyles.panelBody}>
                <TextAreaField
                  hint={copy.fieldHint}
                  label={copy.fieldLabel}
                  placeholder={copy.fieldPlaceholder}
                  rows={12}
                  value={documentText}
                  onChange={(event) => setDocumentText(event.target.value)}
                />

                <div className={sharedStyles.sectionIntro}>
                  <strong>{copy.examplesLabel}</strong>
                  <p className={sharedStyles.muted}>{copy.examplesHint}</p>
                </div>
                <div className={sharedStyles.chips}>
                  {copy.examples.map((example) => (
                    <button
                      key={example.label}
                      className={`${sharedStyles.chip} ${documentText === example.value ? sharedStyles.chipActive : ''}`}
                      onClick={() => setDocumentText(example.value)}
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
                  <Button onClick={() => analyze(documentText)}>{copy.analyzeButton}</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setDocumentText(copy.demoText);
                      void analyze(copy.demoText);
                    }}
                  >
                    {copy.tryDemoButton}
                  </Button>
                </div>
                <p className={sharedStyles.footerNote}>{copy.footerNote}</p>
              </div>
            </Surface>
          </>
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
              <LoadingState
                title={copy.loadingTitle}
                message={copy.loadingMessage}
              />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <div className={sharedStyles.headerRow}>
                    <ResultSection eyebrow={copy.detectedType} title={result.type}>
                      <p className={sharedStyles.muted}>{result.summary}</p>
                    </ResultSection>
                    <RiskBadge level={result.riskLevel}>{result.riskLabel}</RiskBadge>
                  </div>

                  <ResultSection title={copy.actionSteps}>
                    <div className={sharedStyles.list}>
                      {result.actions.map((item, index) => (
                        <div key={item} className={sharedStyles.listItem}>
                          <span className={sharedStyles.listMarker}>{index + 1}</span>
                          <p className={sharedStyles.muted}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title={copy.deadline}>
                    <div className={sharedStyles.callout}>
                      <strong>{result.deadline}</strong>
                      <p>{copy.deadlineNote}</p>
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
