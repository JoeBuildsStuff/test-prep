export default function StudySectionsPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Study Sections</h1>
          <div className="flex gap-2">
            <select className="rounded-md border px-3 py-2">
              <option>All Sections</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <select className="rounded-md border px-3 py-2">
              <option>Sort by Name</option>
              <option>Sort by Progress</option>
              <option>Sort by Difficulty</option>
            </select>
          </div>
        </div>
  
        {/* Progress Overview */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>65%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div className="h-full w-[65%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">8/12</div>
                <div className="text-sm text-muted-foreground">
                  Sections Started
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">
                  Sections Completed
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Sections Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Mathematics",
              description: "Algebra, Geometry, and Calculus",
              progress: 80,
              topics: 12,
              difficulty: "Medium",
            },
            {
              title: "Physics",
              description: "Mechanics, Thermodynamics, and Waves",
              progress: 60,
              topics: 10,
              difficulty: "Hard",
            },
            {
              title: "Chemistry",
              description: "Organic, Inorganic, and Physical Chemistry",
              progress: 45,
              topics: 8,
              difficulty: "Medium",
            },
            // Add more sections as needed
          ].map((section) => (
            <div
              key={section.title}
              className="group rounded-lg border p-4 transition-all hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    section.difficulty === "Hard"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {section.difficulty}
                </span>
              </div>
  
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{section.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${section.progress}%` }}
                  />
                </div>
              </div>
  
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {section.topics} Topics
                </span>
                <button className="text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Continue →
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Recommended Next Steps */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Recommended Next Steps</h2>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10" />
                <div className="flex-1">
                  <h3 className="font-medium">Complete Physics Quiz 3</h3>
                  <p className="text-sm text-muted-foreground">
                    15 questions • Estimated 30 mins
                  </p>
                </div>
                <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }