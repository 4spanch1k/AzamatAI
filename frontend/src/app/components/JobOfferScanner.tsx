import { Button } from './Button';
import { Textarea } from './Textarea';
import { Card } from './Card';
import { Badge } from './Badge';

export function JobOfferScanner() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Side - Input */}
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="Paste a job description from hh.kz or Telegram..."
          rows={14}
        />

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1">Scan Job Offer</Button>
          <Button variant="secondary">Try Demo</Button>
        </div>
      </div>

      {/* Right Side - Results */}
      <div className="flex flex-col gap-4">
        <Card>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg">Risk Assessment</h3>
                <Badge variant="high">High Risk</Badge>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <span className="text-2xl text-red-600">7.5/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-muted-foreground">Red Flags Detected</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Upfront payment required</p>
                    <p className="text-sm text-red-800 mt-1">Job requires payment for "training materials" or "registration"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Unrealistic salary promises</p>
                    <p className="text-sm text-red-800 mt-1">Salary is 3x above market rate for this position</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">Vague job description</p>
                    <p className="text-sm text-amber-800 mt-1">Responsibilities and requirements are unclear</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">No company verification</p>
                    <p className="text-sm text-amber-800 mt-1">Cannot find registered business with this name</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-900 mb-2">Recommendation</h4>
              <p className="text-sm text-red-900">
                <span className="font-medium">⚠️ Avoid this offer.</span> Multiple red flags indicate this may be a scam. Legitimate employers never ask for upfront payments. Consider reporting this listing.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                <li>Do not send any money</li>
                <li>Research the company independently</li>
                <li>Report to hh.kz if found on their platform</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}