export default function SubscriptionPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Subscription</h1>
  
        {/* Current Plan */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Current Plan</h2>
          <div className="mt-4">
            <div className="rounded-lg border border-primary bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Billed monthly • Next payment on April 1, 2024
                  </p>
                </div>
                <span className="text-2xl font-bold">$15/mo</span>
              </div>
              <div className="mt-4">
                <button className="text-sm text-primary hover:underline">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Available Plans */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Plans</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Basic",
                price: "$0",
                period: "Free",
                features: [
                  "100 practice questions",
                  "Basic analytics",
                  "Limited study materials",
                ],
                current: false,
              },
              {
                name: "Pro",
                price: "$15",
                period: "per month",
                features: [
                  "Unlimited questions",
                  "Advanced analytics",
                  "Full study materials",
                  "Mock tests",
                  "Progress tracking",
                ],
                current: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "per year",
                features: [
                  "All Pro features",
                  "Priority support",
                  "Custom study plans",
                  "Team management",
                  "API access",
                ],
                current: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 ${
                  plan.current ? "border-primary bg-primary/5" : ""
                }`}
              >
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-6 w-full rounded-md px-4 py-2 ${
                    plan.current
                      ? "border border-primary bg-transparent"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        </div>
  
        {/* Billing History */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Billing History</h2>
          <div className="mt-4">
            <div className="rounded-lg border">
              <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Invoice</div>
              </div>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-4 gap-4 border-t p-4 text-sm"
                >
                  <div>Mar 1, 2024</div>
                  <div>$15.00</div>
                  <div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                      Paid
                    </span>
                  </div>
                  <div>
                    <button className="text-primary hover:underline">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }