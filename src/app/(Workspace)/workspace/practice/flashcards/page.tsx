export default function FlashcardsPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <div className="flex gap-2">
            <button className="rounded-md border px-4 py-2">Previous</button>
            <button className="rounded-md border px-4 py-2">Next</button>
          </div>
        </div>
  
        {/* Flashcard Progress */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Card 1 of 20</div>
          <div className="h-2 flex-1 rounded-full bg-muted">
            <div className="h-full w-[5%] rounded-full bg-primary" />
          </div>
        </div>
  
        {/* Main Flashcard Area */}
        <div className="flex justify-center p-8">
          <div className="group relative h-[400px] w-[600px] cursor-pointer perspective-1000">
            <div className="relative h-full w-full duration-500 preserve-3d hover:rotate-y-180">
              {/* Front of Card */}
              <div className="absolute h-full w-full rounded-xl border bg-card p-6 backface-hidden">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">Question Side</h3>
                  <p className="mt-4 text-muted-foreground">
                    Click to flip and reveal the answer
                  </p>
                </div>
              </div>
  
              {/* Back of Card */}
              <div className="absolute h-full w-full rounded-xl border bg-card p-6 rotate-y-180 backface-hidden">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">Answer Side</h3>
                  <p className="mt-4 text-muted-foreground">
                    Click to flip back to the question
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button className="rounded-md border px-4 py-2">Mark as Known</button>
          <button className="rounded-md border px-4 py-2">Review Later</button>
        </div>
  
        {/* Study Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Cards Reviewed
            </h3>
            <p className="mt-2 text-2xl font-bold">12/50</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Success Rate
            </h3>
            <p className="mt-2 text-2xl font-bold">85%</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Time Spent
            </h3>
            <p className="mt-2 text-2xl font-bold">15:30</p>
          </div>
        </div>
      </div>
    )
  }