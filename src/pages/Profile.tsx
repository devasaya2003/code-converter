
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState(user?.user_name || '');
  const [phone, setPhone] = useState(user?.phone_no || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    try {
      // Simulate API call - would be replaced with actual Supabase update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Just for demonstration
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] py-8 px-6 md:px-8">
      <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4 text-white hover:bg-white/10" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Your Profile</h1>
        </div>
        
        <div className="glass-panel p-6 rounded-xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-white">Account Information</h2>
              <p className="text-muted-foreground text-sm">Manage your account details</p>
            </div>
            
            <Separator className="bg-white/10" />
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-[#2A2F3C]/50 border-white/10 text-gray-400"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Username
                </label>
                <Input
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={isSaving}
                  className="bg-[#2A2F3C] border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSaving}
                  placeholder="Enter your phone number"
                  className="bg-[#2A2F3C] border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="border-white/10 bg-transparent text-white hover:bg-white/10"
                >
                  Sign out
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-medium text-destructive">Danger Zone</h2>
              <p className="text-muted-foreground text-sm">Irreversible actions for your account</p>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="pt-2">
              <Button variant="destructive">
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
