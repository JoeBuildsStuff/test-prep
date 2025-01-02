export default function ProgressPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
  
        {/* Overall Progress */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Course Completion</h2>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>65%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-muted">
              <div className="h-full w-[65%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
  
        {/* Section Progress */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Section Progress</h2>
            <div className="mt-4 space-y-4">
              {[
                { name: "Section 1", progress: 90 },
                { name: "Section 2", progress: 75 },
                { name: "Section 3", progress: 45 },
                { name: "Section 4", progress: 20 },
              ].map((section) => (
                <div key={section.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{section.name}</span>
                    <span>{section.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-primary" 
                      style={{ width: `${section.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Milestones</h2>
            <div className="mt-4 space-y-4">
              {[
                { title: "Complete 500 Questions", current: 350, total: 500 },
                { title: "Achieve 80% Accuracy", current: 75, total: 80 },
                { title: "Study Streak", current: 5, total: 7 },
              ].map((milestone) => (
                <div key={milestone.title} className="rounded-lg border p-4">
                  <h3 className="font-medium">{milestone.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-primary" 
                        style={{ 
                          width: `${(milestone.current / milestone.total) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {milestone.current}/{milestone.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Weekly Activity */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Weekly Activity</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-7">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center">
                <div className="mx-auto h-20 w-4 rounded-full bg-muted/50" />
                <span className="mt-2 text-sm text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Achievement Badges */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((badge) => (
              <div key={badge} className="flex flex-col items-center rounded-lg border p-4">
                <div className="h-16 w-16 rounded-full bg-muted/50" />
                <h3 className="mt-2 font-medium">Achievement {badge}</h3>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }