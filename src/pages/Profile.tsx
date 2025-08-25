const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg bg-background"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-lg bg-background"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea 
                  className="w-full p-3 border rounded-lg bg-background h-24 resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <span>SMS notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <span>Marketing communications</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              Save Changes
            </button>
            <button className="px-6 py-2 border rounded-lg hover:bg-accent">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;