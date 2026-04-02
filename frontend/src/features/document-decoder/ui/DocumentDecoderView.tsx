import { useState, type CSSProperties } from 'react';
import { FileText } from 'lucide-react';
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
const demoText =
  'Notice from the State Revenue Committee: please pay additional tax and submit confirmation within 10 calendar days.';

function buildDocumentResult(source: string): DocumentResult {
  const normalized = source.toLowerCase();

  if (normalized.includes('court') || normalized.includes('claim')) {
    return {
      type: 'Court notice',
      summary:
        'This looks like a procedural notice connected to a court filing. The immediate task is to verify the case number, claimant, and response deadline.',
      actions: [
        'Check whether the court and case number match a real proceeding.',
        'Collect contracts, receipts, or payment proof tied to the dispute.',
        'Prepare a written response or contact a lawyer before the deadline.',
      ],
      deadline: 'Response expected within 5 business days after receipt.',
      riskLevel: 'high',
      riskLabel: 'High urgency',
      warnings: [
        'Ignoring the notice can lead to a default decision.',
        'Do not rely on screenshots alone; keep the full original document.',
      ],
    };
  }

  return {
    type: 'Tax notice',
    summary:
      'This document requests tax-related action and frames a short response window. The practical next step is to verify the amount, pay through an official channel, and store confirmation.',
    actions: [
      'Check the calculation and tax period before making payment.',
      'Use an official payment route such as ePay or your bank app.',
      'Keep a receipt and, if requested, submit proof through the relevant portal.',
    ],
    deadline: 'Payment or clarification is expected within 10 calendar days.',
    riskLevel: 'medium',
    riskLabel: 'Medium risk',
    warnings: [
      'Make sure the BIN or payment reference belongs to the official agency.',
      'If the amount looks inconsistent, request clarification before paying.',
    ],
  };
}

export function DocumentDecoderView() {
  const [documentText, setDocumentText] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<DocumentResult | null>(null);

  const analyze = async (source: string) => {
    if (!source.trim()) {
      setError('Paste a document or load the demo text before analysis.');
      setResult(null);
      setStatus('idle');
      return;
    }

    setError('');
    setStatus('loading');
    await delay(900);
    setResult(buildDocumentResult(source));
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
          Document Decoder
        </span>
        <div className={sharedStyles.headerRow}>
          <div className={sharedStyles.headingBlock}>
            <h1>Translate formal documents into a practical action list.</h1>
            <p>
              Paste a notice, letter, or legal text and get a short summary, a deadline view, and
              the next actions in plain language.
            </p>
          </div>
          <span className={sharedStyles.toneBadge}>Structured summary</span>
        </div>
      </header>

      <SplitWorkspace
        left={
          <>
            <Surface className={sharedStyles.panel}>
              <div className={sharedStyles.panelBody}>
                <TextAreaField
                  hint="Official notices, tax letters, or court messages"
                  label="Document text"
                  placeholder="Paste an official document here..."
                  rows={14}
                  value={documentText}
                  onChange={(event) => setDocumentText(event.target.value)}
                />
                <div className={sharedStyles.uploadZone}>
                  <strong>Upload flow placeholder</strong>
                  <p className={sharedStyles.muted}>
                    File parsing is not wired yet, but the result layout is ready for OCR or backend extraction.
                  </p>
                </div>
                <div className={sharedStyles.actionRow}>
                  <Button onClick={() => analyze(documentText)}>Analyze document</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setDocumentText(demoText);
                      void analyze(demoText);
                    }}
                  >
                    Try demo
                  </Button>
                </div>
                <p className={sharedStyles.footerNote}>
                  Best for tax notices, enforcement letters, official requests, and compliance reminders.
                </p>
              </div>
            </Surface>
          </>
        }
        right={
          <>
            {error && <ErrorAlert message={error} />}
            {status === 'idle' && !result && (
              <EmptyState
                title="No analysis yet"
                message="Run a document through the decoder to see the summary, action steps, deadline, and warnings."
              />
            )}
            {status === 'loading' && (
              <LoadingState
                title="Reading document"
                message="Extracting the document type, deadline, and recommended next steps."
              />
            )}
            {status === 'ready' && result && (
              <Surface className={sharedStyles.panel}>
                <div className={sharedStyles.panelBody}>
                  <div className={sharedStyles.headerRow}>
                    <ResultSection eyebrow="Detected type" title={result.type}>
                      <p className={sharedStyles.muted}>{result.summary}</p>
                    </ResultSection>
                    <RiskBadge level={result.riskLevel}>{result.riskLabel}</RiskBadge>
                  </div>

                  <ResultSection title="Action steps">
                    <div className={sharedStyles.list}>
                      {result.actions.map((item, index) => (
                        <div key={item} className={sharedStyles.listItem}>
                          <span className={sharedStyles.listMarker}>{index + 1}</span>
                          <p className={sharedStyles.muted}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>

                  <ResultSection title="Deadline">
                    <div className={sharedStyles.callout}>
                      <strong>{result.deadline}</strong>
                      <p>Keep the original file and payment or submission proof in the same case folder.</p>
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
