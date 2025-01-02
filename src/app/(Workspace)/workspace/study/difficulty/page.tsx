export default function StudyByDifficultyPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Study by Difficulty</h1>
          <div className="flex gap-2">
            <select className="rounded-md border px-3 py-2">
              <option>All Topics</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
            </select>
          </div>
        </div>
  
        {/* Difficulty Level Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              level: "Easy",
              color: "green",
              stats: {
                completed: 45,
                total: 60,
                accuracy: 85,
              },
            },
            {
              level: "Medium",
              color: "yellow",
              stats: {
                completed: 30,
                total: 80,
                accuracy: 72,
              },
            },
            {
              level: "Hard",
              color: "red",
              stats: {
                completed: 15,
                total: 40,
                accuracy: 65,
              },
            },
          ].map((difficulty) => (
            <div
              key={difficulty.level}
              className={`rounded-lg border p-6 hover:border-primary`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{difficulty.level}</h2>
                <span
                  className={`rounded-full bg-${difficulty.color}-100 px-3 py-1 text-sm text-${difficulty.color}-800`}
                >
                  {difficulty.stats.accuracy}% Accuracy
                </span>
              </div>
  
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {difficulty.stats.completed}/{difficulty.stats.total} Questions
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full bg-${difficulty.color}-500`}
                      style={{
                        width: `${(difficulty.stats.completed / difficulty.stats.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
  
                <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground">
                  Continue Practice
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Questions by Difficulty */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Questions</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Medium
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Mathematics
                      </span>
                    </div>
                    <h3 className="font-medium">
                      Solve the quadratic equation: 2x² + 5x + 3 = 0
                    </h3>
                  </div>
                  <button className="rounded-md border px-3 py-1 text-sm">
                    Try Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Performance Analytics */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Performance by Difficulty</h2>
          <div className="mt-6 h-[200px] rounded-lg bg-muted/50" />
        </div>
      </div>
    )
  }