import { Button } from './Button';
import { Textarea } from './Textarea';
import { Card } from './Card';

export function EGovNavigator() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Side - Input */}
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="Describe what you want to do..."
          rows={8}
        />

        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-3">Popular requests:</p>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-white border border-border rounded-md text-sm hover:border-primary transition-colors">
              Open an IP business
            </button>
            <button className="px-3 py-1.5 bg-white border border-border rounded-md text-sm hover:border-primary transition-colors">
              Pay taxes
            </button>
            <button className="px-3 py-1.5 bg-white border border-border rounded-md text-sm hover:border-primary transition-colors">
              Get a certificate
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1">Show Steps</Button>
          <Button variant="secondary">Try Demo</Button>
        </div>
      </div>

      {/* Right Side - Results */}
      <div className="flex flex-col gap-4">
        <Card>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm mb-2 text-muted-foreground">Your Goal</h4>
              <p className="text-foreground">Register as an individual entrepreneur (IP)</p>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-muted-foreground">Required Documents</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-foreground">Identity card (or passport)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-foreground">IIN (Individual Identification Number)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-foreground">EDS (Electronic Digital Signature)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-muted-foreground">Steps to Complete</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">1</div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground mb-1">Go to egov.kz</p>
                    <p className="text-sm text-muted-foreground">Log in using your EDS</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">2</div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground mb-1">Find "IP Registration" service</p>
                    <p className="text-sm text-muted-foreground">Located in Business → Registration section</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">3</div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground mb-1">Fill out the application form</p>
                    <p className="text-sm text-muted-foreground">Choose your business activity codes (KVED)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">4</div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground mb-1">Submit and wait for approval</p>
                    <p className="text-sm text-muted-foreground">Usually takes 1-2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Note:</span> The service is free. Processing time is typically 1-2 business days.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}