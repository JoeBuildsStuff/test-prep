export default function BookmarkedPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bookmarked Content</h1>
          <div className="flex gap-2">
            <select className="rounded-md border px-3 py-2">
              <option>All Types</option>
              <option>Questions</option>
              <option>Notes</option>
              <option>Flashcards</option>
            </select>
            <select className="rounded-md border px-3 py-2">
              <option>Recently Added</option>
              <option>Oldest First</option>
              <option>By Difficulty</option>
            </select>
          </div>
        </div>
  
        {/* Bookmark Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Bookmarks", value: "42" },
            { label: "Questions", value: "28" },
            { label: "Notes", value: "8" },
            { label: "Flashcards", value: "6" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="mt-1 text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
  
        {/* Bookmarked Items */}
        <div className="space-y-4">
          {[
            {
              type: "question",
              title: "Integration by Parts",
              subject: "Mathematics",
              difficulty: "Hard",
              date: "2 days ago",
            },
            {
              type: "note",
              title: "Chemical Bonding Overview",
              subject: "Chemistry",
              difficulty: "Medium",
              date: "1 week ago",
            },
            {
              type: "flashcard",
              title: "Physics Formulas",
              subject: "Physics",
              difficulty: "Medium",
              date: "2 weeks ago",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex items-start justify-between rounded-lg border p-4 hover:border-primary"
            >
              <div className="flex gap-4">
                <div className="mt-1 h-8 w-8 rounded bg-primary/10" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.difficulty === "Hard"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.difficulty}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.subject}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md border px-3 py-1 text-sm">
                  View
                </button>
                <button className="rounded-md border px-3 py-1 text-sm text-destructive opacity-0 group-hover:opacity-100">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Collections */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Collections</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { name: "Quick Review", count: 12 },
              { name: "Hard Problems", count: 8 },
              { name: "Important Formulas", count: 15 },
            ].map((collection) => (
              <div
                key={collection.name}
                className="rounded-lg border p-4 hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{collection.name}</h3>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {collection.count} items
                  </span>
                </div>
                <button className="mt-4 text-sm text-primary">View All →</button>
              </div>
            ))}
          </div>
        </div>
  
        {/* Empty State (hidden by default) */}
        <div className="hidden rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted" />
          <h3 className="mt-4 font-medium">No Bookmarks Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start bookmarking questions and content you want to review later.
          </p>
          <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            Browse Content
          </button>
        </div>
      </div>
    )
  }