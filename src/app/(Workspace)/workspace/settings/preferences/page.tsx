export default function PreferencesPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Preferences</h1>
  
        {/* Study Preferences */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Study Preferences</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Daily Study Goal</label>
                <p className="text-sm text-muted-foreground">
                  Set your daily study target in minutes
                </p>
              </div>
              <input
                type="number"
                className="w-24 rounded-md border px-3 py-2"
                placeholder="60"
              />
            </div>
  
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Question Difficulty</label>
                <p className="text-sm text-muted-foreground">
                  Default difficulty level for practice questions
                </p>
              </div>
              <select className="rounded-md border px-3 py-2">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* Notification Settings */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="mt-4 space-y-4">
            {[
              {
                title: "Study Reminders",
                description: "Get daily reminders to complete your study goal",
              },
              {
                title: "Progress Updates",
                description: "Weekly summary of your learning progress",
              },
              {
                title: "New Content Alerts",
                description: "Notifications when new study material is available",
              },
              {
                title: "Achievement Notifications",
                description: "Get notified when you earn new achievements",
              },
            ].map((notification) => (
              <div
                key={notification.title}
                className="flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">{notification.title}</label>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
                <div className="h-6 w-11 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
  
        {/* Display Settings */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Display Settings</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Theme</label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>
              <select className="rounded-md border px-3 py-2">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
  
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Font Size</label>
                <p className="text-sm text-muted-foreground">
                  Adjust the text size for better readability
                </p>
              </div>
              <select className="rounded-md border px-3 py-2">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* Save Button */}
        <div className="flex justify-end">
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Save Preferences
          </button>
        </div>
      </div>
    )
  }