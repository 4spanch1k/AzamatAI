import { useState, type CSSProperties } from 'react';
import { FileText } from 'lucide-react';
import { analyzeDocument, type DocumentAnalysisResult } from '@/features/document-decoder/service';
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

const moduleMeta = modules.find((module) => module.key === 'document-decoder')!;
const tone = toneStyles[moduleMeta.tone];

function getDocumentRiskLabel(
  riskLevel: DocumentAnalysisResult['riskLevel'],
  copy: ReturnType<typeof useLanguage>['messages']['documentDecoder'],
) {
  return copy.riskLabels[riskLevel];
}

export function DocumentDecoderView() {
  const { messages } = useLanguage();
  const copy = messages.documentDecoder;
  const [documentText, setDocumentText] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);
  const isLoading = status === 'loading';
  const isRequestError = error === messages.common.requestFailed;
  const resultMeta = `${messages.common.resultReady} · ${messages.common.generatedNow}`;

  const analyze = async (source: string) => {
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
      const nextResult = await analyzeDocument(source);
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
                  disabled={isLoading}
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
                      disabled={isLoading}
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
                  <Button disabled={isLoading} onClick={() => analyze(documentText)}>{copy.analyzeButton}</Button>
                  <Button
                    disabled={isLoading}
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
            {error && (
              <ErrorAlert
                actionLabel={isRequestError ? messages.common.retryAction : undefined}
                hint={isRequestError ? messages.common.retryHint : undefined}
                message={error}
                onAction={isRequestError ? () => void analyze(documentText) : undefined}
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
              <LoadingState
                eyebrow={copy.toneBadge}
                title={copy.loadingTitle}
                message={copy.loadingMessage}
              />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <ResultMeta label={copy.toneBadge} meta={resultMeta} />
                  <div className={sharedStyles.headerRow}>
                    <ResultSection eyebrow={copy.detectedType} title={result.documentType}>
                      <p className={sharedStyles.muted}>{result.summary}</p>
                    </ResultSection>
                    <RiskBadge level={result.riskLevel}>{getDocumentRiskLabel(result.riskLevel, copy)}</RiskBadge>
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
                      <strong>{result.deadline || copy.deadlineNote}</strong>
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
