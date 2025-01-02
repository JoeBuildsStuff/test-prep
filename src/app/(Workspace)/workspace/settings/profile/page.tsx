export default function ProfileSettingsPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
  
        {/* Profile Header */}
        <div className="rounded-lg border p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-muted/50" />
              <button className="absolute bottom-0 right-0 rounded-full border bg-background p-2">
                <span className="sr-only">Change avatar</span>
                {/* You can add an edit icon here */}
              </button>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-semibold">John Doe</h2>
              <p className="text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>
        </div>
  
        {/* Personal Information */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Doe"
                />
              </div>
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2"
                placeholder="john.doe@example.com"
              />
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                className="w-full rounded-md border px-3 py-2"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
  
        {/* Password Change */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>
  
        {/* Save Button */}
        <div className="flex justify-end">
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Save Changes
          </button>
        </div>
      </div>
    )
  }