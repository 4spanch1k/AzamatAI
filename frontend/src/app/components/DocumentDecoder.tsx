import { Button } from './Button';
import { Textarea } from './Textarea';
import { Card } from './Card';
import { Badge } from './Badge';

export function DocumentDecoder() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Side - Input */}
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="Paste a government notice, tax message, or official document..."
          rows={12}
        />

        <div className="flex items-center gap-4">
          <div className="flex-1 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
            <div className="text-muted-foreground">
              <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm">Upload document</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1">Analyze Document</Button>
          <Button variant="secondary">Try Demo</Button>
        </div>
      </div>

      {/* Right Side - Results */}
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg">Document Analysis</h3>
            <Badge variant="info">Tax Notice</Badge>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm mb-2 text-muted-foreground">Summary</h4>
              <p className="text-foreground leading-relaxed">
                This is a tax payment notice from the State Revenue Committee requiring action within 10 days.
              </p>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-muted-foreground">Action Steps</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
                  <p className="text-foreground">Review the tax calculation details in sections 2.1-2.3</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</div>
                  <p className="text-foreground">Prepare payment through ePay or bank transfer</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</div>
                  <p className="text-foreground">Submit payment confirmation to tax authority</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-amber-900">
                    <span className="font-medium">Deadline:</span> April 12, 2026 (10 days remaining)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <Badge variant="medium">Medium Priority</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}