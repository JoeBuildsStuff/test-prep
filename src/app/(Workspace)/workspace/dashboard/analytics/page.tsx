export default function AnalyticsPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
  
        {/* Performance Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Questions Attempted", value: "450" },
            { label: "Average Score", value: "76%" },
            { label: "Study Hours", value: "28.5" },
            { label: "Weak Areas", value: "3" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </h3>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
  
        {/* Performance Graph */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Performance Trend</h2>
          <div className="mt-4 h-[300px] rounded-md bg-muted/50" />
        </div>
  
        {/* Subject Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Subject Performance</h2>
            <div className="mt-4 space-y-4">
              {["Math", "Science", "English"].map((subject) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{subject}</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full w-[85%] rounded-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Time Distribution</h2>
            <div className="mt-4 h-[200px] rounded-md bg-muted/50" />
          </div>
        </div>
  
        {/* Recent Activity */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-12 w-12 rounded-full bg-muted/50" />
                <div className="flex-1">
                  <h3 className="font-medium">Practice Test Completed</h3>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-right">
                  <span className="font-medium">Score: 85%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }