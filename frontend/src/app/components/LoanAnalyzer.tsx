import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { Badge } from './Badge';

export function LoanAnalyzer() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Side - Input */}
      <div className="flex flex-col gap-4">
        <Card className="bg-white">
          <h3 className="text-lg mb-4">Loan Details</h3>
          <div className="space-y-4">
            <Input
              label="Loan Amount (₸)"
              placeholder="1,000,000"
              type="text"
            />
            <Input
              label="Duration (months)"
              placeholder="24"
              type="number"
            />
            <Input
              label="Monthly Payment (₸)"
              placeholder="52,000"
              type="text"
            />
            <Input
              label="Fees & Commissions (₸)"
              placeholder="15,000"
              type="text"
            />
            <Input
              label="Insurance (₸)"
              placeholder="8,000"
              type="text"
            />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1">Analyze Loan</Button>
          <Button variant="secondary">Try Demo</Button>
        </div>
      </div>

      {/* Right Side - Results */}
      <div className="flex flex-col gap-4">
        <Card>
          <h3 className="text-lg mb-4">Loan Analysis</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Payment</p>
                <p className="text-2xl text-foreground">₸1,248,000</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Overpayment</p>
                <p className="text-2xl text-foreground">₸248,000</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Effective Interest Rate</span>
                <span className="text-xl text-foreground">24.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm mb-3 text-muted-foreground">Cost Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Principal amount</span>
                  <span className="text-foreground">₸1,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Interest</span>
                  <span className="text-foreground">₸225,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Fees & commissions</span>
                  <span className="text-foreground">₸15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Insurance</span>
                  <span className="text-foreground">₸8,000</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Assessment:</span>
              <Badge variant="medium">Medium Risk</Badge>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-900 mb-2">Recommendation</h4>
              <p className="text-sm text-amber-900">
                The effective rate is higher than average. Consider negotiating fees or comparing with other lenders. Monthly payment is 52% of median income.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-900 mb-1">Warning</p>
                  <p className="text-sm text-red-900">Insurance is optional. You can refuse it and save ₸8,000.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}